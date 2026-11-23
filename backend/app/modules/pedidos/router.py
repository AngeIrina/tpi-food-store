from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.core.deps import AdminUser, CurrentUser
from app.modules.productos.service import ProductoNoEncontrado

from .schemas import (
    CambioEstado,
    EstadoPedido,
    PedidoCreate,
    PedidoRead,
    PedidosPaginados,
    ResumenPedidos,
)
from .service import PedidoAjeno, PedidoNoEncontrado, PedidoService, ReglaDeNegocio
from .unit_of_work import PedidoUnitOfWork

router = APIRouter(prefix="/pedidos", tags=["pedidos"])


def get_pedido_service() -> PedidoService:
    return PedidoService(PedidoUnitOfWork())


ServiceDep = Annotated[PedidoService, Depends(get_pedido_service)]

ErroresPedido = (PedidoNoEncontrado, ProductoNoEncontrado, PedidoAjeno, ReglaDeNegocio)


def _a_http(error: Exception) -> HTTPException:
    if isinstance(error, PedidoAjeno):
        codigo = status.HTTP_403_FORBIDDEN
    elif isinstance(error, ReglaDeNegocio):
        codigo = status.HTTP_400_BAD_REQUEST
    else:
        codigo = status.HTTP_404_NOT_FOUND
    return HTTPException(status_code=codigo, detail=str(error))


@router.post("", response_model=PedidoRead, status_code=status.HTTP_201_CREATED)
def crear_pedido(data: PedidoCreate, usuario: CurrentUser, service: ServiceDep):
    try:
        return service.crear(data, usuario.id)
    except ErroresPedido as e:
        raise _a_http(e) from e


@router.get("", response_model=PedidosPaginados)
def listar_pedidos(
    usuario: CurrentUser,
    service: ServiceDep,
    skip: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
    estado: EstadoPedido | None = None,
):
    return service.listar(usuario, skip, limit, estado)


@router.get("/resumen", response_model=ResumenPedidos)
def resumen_pedidos(_admin: AdminUser, service: ServiceDep):
    return service.resumen()


@router.get("/{id}", response_model=PedidoRead)
def obtener_pedido(id: int, usuario: CurrentUser, service: ServiceDep):
    try:
        return service.obtener(id, usuario)
    except ErroresPedido as e:
        raise _a_http(e) from e


@router.patch("/{id}/estado", response_model=PedidoRead)
def cambiar_estado_pedido(
    id: int, data: CambioEstado, admin: AdminUser, service: ServiceDep
):
    try:
        return service.cambiar_estado(id, data.estado, admin)
    except ErroresPedido as e:
        raise _a_http(e) from e


@router.patch("/{id}/cancelar", response_model=PedidoRead)
def cancelar_pedido(id: int, usuario: CurrentUser, service: ServiceDep):
    try:
        return service.cancelar(id, usuario)
    except ErroresPedido as e:
        raise _a_http(e) from e
