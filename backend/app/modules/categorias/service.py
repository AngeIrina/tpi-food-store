from .models import Categoria
from .schemas import CategoriaCreate, CategoriaRead, CategoriaUpdate
from .unit_of_work import CategoriaUnitOfWork


class CategoriaNoEncontrada(Exception):
    def __init__(self) -> None:
        super().__init__("Categoría no encontrada")


class NombreDuplicado(Exception):
    def __init__(self, nombre: str) -> None:
        super().__init__(f"Ya existe una categoría llamada '{nombre}'")


class CategoriaService:
    def __init__(self, uow: CategoriaUnitOfWork) -> None:
        self.uow = uow

    def _obtener_activa(self, uow: CategoriaUnitOfWork, id: int) -> Categoria:
        categoria = uow.categorias.get_by_id(id)
        if categoria is None or not categoria.activo:
            raise CategoriaNoEncontrada()
        return categoria

    def _validar_nombre(
        self, uow: CategoriaUnitOfWork, nombre: str, excluir_id: int | None = None
    ) -> None:
        existente = uow.categorias.get_by_nombre(nombre)
        if existente is not None and existente.id != excluir_id:
            raise NombreDuplicado(nombre)

    def listar(self) -> list[CategoriaRead]:
        with self.uow as uow:
            return [
                CategoriaRead.model_validate(c) for c in uow.categorias.list_activas()
            ]

    def obtener(self, id: int) -> CategoriaRead:
        with self.uow as uow:
            return CategoriaRead.model_validate(self._obtener_activa(uow, id))

    def crear(self, data: CategoriaCreate) -> CategoriaRead:
        with self.uow as uow:
            self._validar_nombre(uow, data.nombre)
            categoria = uow.categorias.add(Categoria.model_validate(data))
            return CategoriaRead.model_validate(categoria)

    def actualizar(self, id: int, data: CategoriaUpdate) -> CategoriaRead:
        with self.uow as uow:
            categoria = self._obtener_activa(uow, id)
            cambios = data.model_dump(exclude_unset=True)
            if cambios.get("nombre"):
                self._validar_nombre(uow, cambios["nombre"], excluir_id=id)
            categoria.sqlmodel_update(cambios)
            uow.categorias.add(categoria)
            return CategoriaRead.model_validate(categoria)

    def eliminar(self, id: int) -> None:
        with self.uow as uow:
            categoria = self._obtener_activa(uow, id)
            categoria.activo = False
            uow.categorias.add(categoria)
