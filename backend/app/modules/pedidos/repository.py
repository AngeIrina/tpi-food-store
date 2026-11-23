from datetime import datetime

from sqlalchemy.orm import selectinload
from sqlmodel import col, func, select

from app.core.base_repository import BaseRepository

from .models import Pedido


class PedidoRepository(BaseRepository[Pedido]):
    model = Pedido

    def list_by_usuario(
        self, usuario_id: int | None, skip: int, limit: int, estado: str | None = None
    ) -> tuple[int, list[Pedido]]:
        consulta = select(Pedido)
        if usuario_id is not None:
            consulta = consulta.where(Pedido.usuario_id == usuario_id)
        if estado:
            consulta = consulta.where(Pedido.estado == estado)

        total = self.session.exec(
            select(func.count()).select_from(consulta.subquery())
        ).one()
        items = self.session.exec(
            consulta.options(selectinload(Pedido.items))  # type: ignore[arg-type]
            .order_by(col(Pedido.id).desc())
            .offset(skip)
            .limit(limit)
        ).all()
        return total, list(items)

    def count_by_estado(self) -> dict[str, int]:
        consulta = select(Pedido.estado, func.count()).group_by(Pedido.estado)
        return dict(self.session.exec(consulta).all())

    def count_desde(self, desde: datetime) -> int:
        consulta = select(func.count()).where(Pedido.created_at >= desde)
        return self.session.exec(consulta).one()

    def suma_total_por_estado(self, estado: str) -> float:
        consulta = select(func.coalesce(func.sum(Pedido.total), 0)).where(
            Pedido.estado == estado
        )
        return float(self.session.exec(consulta).one())
