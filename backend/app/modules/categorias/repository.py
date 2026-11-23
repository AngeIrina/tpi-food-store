from sqlmodel import col, func, select

from app.core.base_repository import BaseRepository

from .models import Categoria


class CategoriaRepository(BaseRepository[Categoria]):
    model = Categoria

    def get_by_nombre(self, nombre: str) -> Categoria | None:
        consulta = select(Categoria).where(
            func.lower(Categoria.nombre) == nombre.lower()
        )
        return self.session.exec(consulta).first()

    def list_activas(self) -> list[Categoria]:
        consulta = (
            select(Categoria)
            .where(col(Categoria.activo).is_(True))
            .order_by(Categoria.nombre)
        )
        return list(self.session.exec(consulta).all())
