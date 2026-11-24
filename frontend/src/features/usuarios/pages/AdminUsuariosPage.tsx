import type { ColumnDef } from '@tanstack/react-table'
import { handleApiError } from '../../../shared/api/handleApiError'
import { DataTable } from '../../../shared/components/DataTable'
import { EstadoError } from '../../../shared/components/EstadoError'
import { MensajeError } from '../../../shared/components/MensajeError'
import { Skeleton } from '../../../shared/components/Skeleton'
import { Button } from '../../../shared/ui/Button'
import { useAuthStore } from '../../../store/authStore'
import { useCambiarEstadoUsuario, useUsuarios } from '../hooks/useUsuarios'
import type { Usuario } from '../types/usuario'

export function AdminUsuariosPage() {
  const sesion = useAuthStore((s) => s.usuario)
  const { data, isPending, isError, error, refetch } = useUsuarios()
  const cambiarEstado = useCambiarEstadoUsuario()

  const columnas: ColumnDef<Usuario>[] = [
    { accessorKey: 'username', header: 'Usuario' },
    { accessorKey: 'full_name', header: 'Nombre' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'role', header: 'Rol' },
    {
      id: 'estado',
      accessorFn: (u) => (u.disabled ? 'Desactivado' : 'Activo'),
      header: 'Estado',
      cell: ({ row }) => (
        <span className={row.original.disabled ? 'font-medium text-rose-700' : 'font-medium text-emerald-700'}>
          {row.original.disabled ? 'Desactivado' : 'Activo'}
        </span>
      ),
    },
    {
      id: 'acciones',
      header: 'Acciones',
      enableSorting: false,
      cell: ({ row }) => {
        const usuario = row.original
        const procesando = cambiarEstado.isPending && cambiarEstado.variables?.id === usuario.id
        if (usuario.disabled) {
          return (
            <Button tamano="sm" disabled={procesando} onClick={() => cambiarEstado.mutate({ id: usuario.id, activar: true })}>
              Activar
            </Button>
          )
        }
        if (usuario.id === sesion?.id) return <span className="text-xs text-stone-400">Tu cuenta</span>
        return (
          <Button
            variante="peligro"
            tamano="sm"
            disabled={procesando}
            onClick={() => cambiarEstado.mutate({ id: usuario.id, activar: false })}
          >
            Desactivar
          </Button>
        )
      },
    },
  ]

  let contenido
  if (isPending) contenido = <Skeleton cantidad={4} className="h-12" />
  else if (isError) contenido = <EstadoError mensaje={handleApiError(error)} onReintentar={() => void refetch()} />
  else contenido = <DataTable data={data} columns={columnas} buscador />

  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Usuarios</h1>
      <MensajeError mensaje={cambiarEstado.isError ? handleApiError(cambiarEstado.error) : null} />
      {contenido}
    </section>
  )
}
