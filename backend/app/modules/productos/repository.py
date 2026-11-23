from sqlalchemy.orm import selectinload
from sqlmodel import col, func, select

from app.core.base_repository import BaseRepository

from .models import Producto


class ProductoRepository(BaseRepository[Producto]):
    model = Producto

    def search(
        self,
        skip: int,
        limit: int,
        search: str | None = None,
        categoria_id: int | None = None,
        disponible: bool | None = None,
    ) -> tuple[int, list[Producto]]:
        consulta = select(Producto).where(col(Producto.activo).is_(True))
        if search:
            consulta = consulta.where(col(Producto.nombre).ilike(f"%{search}%"))
        if categoria_id is not None:
            consulta = consulta.where(Producto.categoria_id == categoria_id)
        if disponible is not None:
            consulta = consulta.where(col(Producto.disponible).is_(disponible))

        total = self.session.exec(
            select(func.count()).select_from(consulta.subquery())
        ).one()
        items = self.session.exec(
            consulta.options(selectinload(Producto.categoria))  # type: ignore[arg-type]
            .order_by(Producto.nombre)
            .offset(skip)
            .limit(limit)
        ).all()
        return total, list(items)
