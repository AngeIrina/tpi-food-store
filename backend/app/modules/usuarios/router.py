from typing import Annotated

from fastapi import APIRouter, Depends

from app.core.deps import AdminUser

from .schemas import UserPublic
from .service import UsuarioService
from .unit_of_work import UsuarioUnitOfWork

router = APIRouter(prefix="/admin/usuarios", tags=["usuarios"])


def get_usuario_service() -> UsuarioService:
    return UsuarioService(UsuarioUnitOfWork())


ServiceDep = Annotated[UsuarioService, Depends(get_usuario_service)]


@router.get("", response_model=list[UserPublic])
def listar_usuarios(_admin: AdminUser, service: ServiceDep):
    return service.listar()


@router.post("/{id}/activar", response_model=UserPublic)
def activar_usuario(id: int, admin: AdminUser, service: ServiceDep):
    return service.cambiar_estado(id, disabled=False, admin_id=admin.id)


@router.post("/{id}/desactivar", response_model=UserPublic)
def desactivar_usuario(id: int, admin: AdminUser, service: ServiceDep):
    return service.cambiar_estado(id, disabled=True, admin_id=admin.id)
