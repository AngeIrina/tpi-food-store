from datetime import UTC, datetime

from app.modules.productos.service import ProductoNoEncontrado
from app.modules.usuarios.schemas import UserPublic

from .models import DetallePedido, Pedido
from .schemas import (
    EstadoPedido,
    PedidoCreate,
    PedidoRead,
    PedidosPaginados,
    ResumenPedidos,
)
from .unit_of_work import PedidoUnitOfWork

TRANSICIONES: dict[str, set[str]] = {
    "PENDIENTE": {"EN_PREPARACION", "CANCELADO"},
    "EN_PREPARACION": {"ENTREGADO", "CANCELADO"},
    "ENTREGADO": set(),
    "CANCELADO": set(),
}


class PedidoNoEncontrado(Exception):
    def __init__(self) -> None:
        super().__init__("Pedido no encontrado")


class PedidoAjeno(Exception):
    def __init__(self) -> None:
        super().__init__("No tenés permiso para acceder a este pedido")


class ReglaDeNegocio(Exception):
    pass


class ProductoRepetido(ReglaDeNegocio):
    def __init__(self, producto_id: int) -> None:
        super().__init__(f"El producto {producto_id} está repetido en el pedido")


class ProductoNoDisponible(ReglaDeNegocio):
    def __init__(self, nombre: str) -> None:
        super().__init__(f"El producto '{nombre}' no está disponible")


class StockInsuficiente(ReglaDeNegocio):
    def __init__(self, nombre: str, stock: int) -> None:
        super().__init__(f"Stock insuficiente para '{nombre}' (disponible: {stock})")


class TransicionInvalida(ReglaDeNegocio):
    def __init__(self, actual: str, nuevo: str) -> None:
        super().__init__(f"No se puede pasar un pedido de {actual} a {nuevo}")


class PedidoNoCancelable(ReglaDeNegocio):
    def __init__(self) -> None:
        super().__init__("Solo se pueden cancelar pedidos en estado PENDIENTE")


class PedidoService:
    def __init__(self, uow: PedidoUnitOfWork) -> None:
        self.uow = uow

    def _obtener(self, uow: PedidoUnitOfWork, id: int, usuario: UserPublic) -> Pedido:
        pedido = uow.pedidos.get_by_id(id)
        if pedido is None:
            raise PedidoNoEncontrado()
        if usuario.role != "admin" and pedido.usuario_id != usuario.id:
            raise PedidoAjeno()
        return pedido

    def _cambiar_estado(
        self, uow: PedidoUnitOfWork, pedido: Pedido, nuevo: str
    ) -> None:
        if nuevo not in TRANSICIONES[pedido.estado]:
            raise TransicionInvalida(pedido.estado, nuevo)
        if nuevo == "CANCELADO":
            for item in pedido.items:
                producto = uow.productos.get_by_id(item.producto_id)
                if producto is not None:
                    producto.stock += item.cantidad
                    uow.session.add(producto)
        pedido.estado = nuevo
        pedido.updated_at = datetime.now(UTC)
        uow.pedidos.add(pedido)

    def crear(self, data: PedidoCreate, usuario_id: int) -> PedidoRead:
        with self.uow as uow:
            ids = [item.producto_id for item in data.items]
            repetidos = {i for i in ids if ids.count(i) > 1}
            if repetidos:
                raise ProductoRepetido(min(repetidos))

            pedido = uow.pedidos.add(
                Pedido(
                    usuario_id=usuario_id,
                    forma_pago=data.forma_pago,
                    direccion_entrega=data.direccion_entrega,
                    notas=data.notas,
                    total=0,
                )
            )

            total = 0.0
            for item in data.items:
                producto = uow.productos.get_by_id(item.producto_id)
                if producto is None or not producto.activo:
                    raise ProductoNoEncontrado(item.producto_id)
                if not producto.disponible:
                    raise ProductoNoDisponible(producto.nombre)
                if producto.stock < item.cantidad:
                    raise StockInsuficiente(producto.nombre, producto.stock)

                producto.stock -= item.cantidad
                uow.session.add(producto)
                subtotal = round(producto.precio_base * item.cantidad, 2)
                pedido.items.append(
                    DetallePedido(
                        producto_id=producto.id,
                        cantidad=item.cantidad,
                        nombre_producto=producto.nombre,
                        precio_unitario=producto.precio_base,
                        subtotal=subtotal,
                    )
                )
                total += subtotal

            pedido.total = round(total, 2)
            uow.pedidos.add(pedido)
            return PedidoRead.model_validate(pedido)

    def listar(
        self, usuario: UserPublic, skip: int, limit: int, estado: EstadoPedido | None
    ) -> PedidosPaginados:
        with self.uow as uow:
            usuario_id = None if usuario.role == "admin" else usuario.id
            total, pedidos = uow.pedidos.list_by_usuario(
                usuario_id, skip, limit, estado
            )
            return PedidosPaginados(
                total=total, items=[PedidoRead.model_validate(p) for p in pedidos]
            )

    def obtener(self, id: int, usuario: UserPublic) -> PedidoRead:
        with self.uow as uow:
            return PedidoRead.model_validate(self._obtener(uow, id, usuario))

    def cambiar_estado(
        self, id: int, nuevo: EstadoPedido, admin: UserPublic
    ) -> PedidoRead:
        with self.uow as uow:
            pedido = self._obtener(uow, id, admin)
            self._cambiar_estado(uow, pedido, nuevo)
            return PedidoRead.model_validate(pedido)

    def cancelar(self, id: int, usuario: UserPublic) -> PedidoRead:
        with self.uow as uow:
            pedido = uow.pedidos.get_by_id(id)
            if pedido is None:
                raise PedidoNoEncontrado()
            if pedido.usuario_id != usuario.id:
                raise PedidoAjeno()
            if pedido.estado != "PENDIENTE":
                raise PedidoNoCancelable()
            self._cambiar_estado(uow, pedido, "CANCELADO")
            return PedidoRead.model_validate(pedido)

    def resumen(self) -> ResumenPedidos:
        with self.uow as uow:
            conteos = uow.pedidos.count_by_estado()
            inicio_hoy = (
                datetime.now(UTC)
                .astimezone()
                .replace(hour=0, minute=0, second=0, microsecond=0)
            )
            return ResumenPedidos(
                pendientes=conteos.get("PENDIENTE", 0),
                en_preparacion=conteos.get("EN_PREPARACION", 0),
                entregados=conteos.get("ENTREGADO", 0),
                cancelados=conteos.get("CANCELADO", 0),
                pedidos_hoy=uow.pedidos.count_desde(inicio_hoy),
                ingresos_entregados=uow.pedidos.suma_total_por_estado("ENTREGADO"),
            )
