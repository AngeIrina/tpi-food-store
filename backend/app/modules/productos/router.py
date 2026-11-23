from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.core.deps import AdminUser
from app.modules.categorias.service import CategoriaNoEncontrada

from .schemas import (
    ProductoCreate,
    ProductoRead,
    ProductosPaginados,
    ProductoStockUpdate,
    ProductoUpdate,
)
from .service import ProductoNoEncontrado, ProductoService
from .unit_of_work import ProductoUnitOfWork

router = APIRouter(prefix="/productos", tags=["productos"])


def get_producto_service() -> ProductoService:
    return ProductoService(ProductoUnitOfWork())


ServiceDep = Annotated[ProductoService, Depends(get_producto_service)]


def _no_encontrado(error: Exception) -> HTTPException:
    return HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(error))


@router.get("", response_model=ProductosPaginados)
def listar_productos(
    service: ServiceDep,
    skip: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
    search: str | None = None,
    categoria_id: int | None = None,
    disponible: bool | None = None,
):
    return service.listar(skip, limit, search, categoria_id, disponible)


@router.get("/{id}", response_model=ProductoRead)
def obtener_producto(id: int, service: ServiceDep):
    try:
        return service.obtener(id)
    except ProductoNoEncontrado as e:
        raise _no_encontrado(e) from e


@router.post("", response_model=ProductoRead, status_code=status.HTTP_201_CREATED)
def crear_producto(data: ProductoCreate, _admin: AdminUser, service: ServiceDep):
    try:
        return service.crear(data)
    except CategoriaNoEncontrada as e:
        raise _no_encontrado(e) from e


@router.put("/{id}", response_model=ProductoRead)
def actualizar_producto(
    id: int, data: ProductoUpdate, _admin: AdminUser, service: ServiceDep
):
    try:
        return service.actualizar(id, data)
    except (ProductoNoEncontrado, CategoriaNoEncontrada) as e:
        raise _no_encontrado(e) from e


@router.patch("/{id}/stock", response_model=ProductoRead)
def actualizar_stock(
    id: int, data: ProductoStockUpdate, _admin: AdminUser, service: ServiceDep
):
    try:
        return service.actualizar_stock(id, data)
    except ProductoNoEncontrado as e:
        raise _no_encontrado(e) from e


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_producto(id: int, _admin: AdminUser, service: ServiceDep) -> None:
    try:
        service.eliminar(id)
    except ProductoNoEncontrado as e:
        raise _no_encontrado(e) from e
