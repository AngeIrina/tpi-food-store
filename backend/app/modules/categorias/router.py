from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status

from app.core.deps import AdminUser

from .schemas import CategoriaCreate, CategoriaRead, CategoriaUpdate
from .service import CategoriaNoEncontrada, CategoriaService, NombreDuplicado
from .unit_of_work import CategoriaUnitOfWork

router = APIRouter(prefix="/categorias", tags=["categorias"])


def get_categoria_service() -> CategoriaService:
    return CategoriaService(CategoriaUnitOfWork())


ServiceDep = Annotated[CategoriaService, Depends(get_categoria_service)]


def _a_http(error: Exception) -> HTTPException:
    codigo = (
        status.HTTP_409_CONFLICT
        if isinstance(error, NombreDuplicado)
        else status.HTTP_404_NOT_FOUND
    )
    return HTTPException(status_code=codigo, detail=str(error))


@router.get("", response_model=list[CategoriaRead])
def listar_categorias(service: ServiceDep):
    return service.listar()


@router.get("/{id}", response_model=CategoriaRead)
def obtener_categoria(id: int, service: ServiceDep):
    try:
        return service.obtener(id)
    except CategoriaNoEncontrada as e:
        raise _a_http(e) from e


@router.post("", response_model=CategoriaRead, status_code=status.HTTP_201_CREATED)
def crear_categoria(data: CategoriaCreate, _admin: AdminUser, service: ServiceDep):
    try:
        return service.crear(data)
    except NombreDuplicado as e:
        raise _a_http(e) from e


@router.put("/{id}", response_model=CategoriaRead)
def actualizar_categoria(
    id: int, data: CategoriaUpdate, _admin: AdminUser, service: ServiceDep
):
    try:
        return service.actualizar(id, data)
    except (CategoriaNoEncontrada, NombreDuplicado) as e:
        raise _a_http(e) from e


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_categoria(id: int, _admin: AdminUser, service: ServiceDep) -> None:
    try:
        service.eliminar(id)
    except CategoriaNoEncontrada as e:
        raise _a_http(e) from e
