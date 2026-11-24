import type { ColumnDef } from '@tanstack/react-table'
import { useState } from 'react'
import { handleApiError } from '../../../shared/api/handleApiError'
import { ConfirmarAccion } from '../../../shared/components/ConfirmarAccion'
import { DataTable } from '../../../shared/components/DataTable'
import { EstadoError } from '../../../shared/components/EstadoError'
import { Skeleton } from '../../../shared/components/Skeleton'
import { Button } from '../../../shared/ui/Button'
import { Modal } from '../../../shared/ui/Modal'
import { CategoriaForm } from '../components/CategoriaForm'
import { useCategorias, useEliminarCategoria, useGuardarCategoria } from '../hooks/useCategorias'
import type { Categoria, CategoriaPayload } from '../types/categoria'

type Dialogo = { tipo: 'form'; categoria: Categoria | null } | { tipo: 'eliminar'; categoria: Categoria }

export function AdminCategoriasPage() {
  const [dialogo, setDialogo] = useState<Dialogo | null>(null)
  const { data, isPending, isError, error, refetch } = useCategorias()
  const guardar = useGuardarCategoria()
  const eliminar = useEliminarCategoria()

  const abrir = (nuevo: Dialogo) => {
    guardar.reset()
    eliminar.reset()
    setDialogo(nuevo)
  }
  const cerrar = () => setDialogo(null)

  const columnas: ColumnDef<Categoria>[] = [
    { accessorKey: 'nombre', header: 'Nombre' },
    {
      accessorKey: 'descripcion',
      header: 'Descripción',
      cell: ({ row }) => row.original.descripcion ?? '—',
    },
    {
      id: 'acciones',
      header: 'Acciones',
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex gap-1">
          <Button variante="fantasma" tamano="sm" onClick={() => abrir({ tipo: 'form', categoria: row.original })}>
            Editar
          </Button>
          <Button
            variante="fantasma"
            tamano="sm"
            className="text-rose-700"
            onClick={() => abrir({ tipo: 'eliminar', categoria: row.original })}
          >
            Eliminar
          </Button>
        </div>
      ),
    },
  ]

  const onGuardar = (datos: CategoriaPayload) => {
    const id = dialogo?.tipo === 'form' ? dialogo.categoria?.id : undefined
    guardar.mutate({ id, datos }, { onSuccess: cerrar })
  }

  let contenido
  if (isPending) contenido = <Skeleton cantidad={4} className="h-12" />
  else if (isError) contenido = <EstadoError mensaje={handleApiError(error)} onReintentar={() => void refetch()} />
  else contenido = <DataTable data={data} columns={columnas} buscador />

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Categorías</h1>
        <Button onClick={() => abrir({ tipo: 'form', categoria: null })}>+ Nueva categoría</Button>
      </div>

      {contenido}

      <Modal
        abierto={dialogo?.tipo === 'form'}
        titulo={dialogo?.tipo === 'form' && dialogo.categoria ? 'Editar categoría' : 'Nueva categoría'}
        onCerrar={cerrar}
      >
        {dialogo?.tipo === 'form' && (
          <CategoriaForm
            categoria={dialogo.categoria}
            guardando={guardar.isPending}
            error={guardar.isError ? handleApiError(guardar.error) : null}
            onGuardar={onGuardar}
            onCancelar={cerrar}
          />
        )}
      </Modal>

      <ConfirmarAccion
        abierto={dialogo?.tipo === 'eliminar'}
        titulo="Eliminar categoría"
        mensaje={`¿Dar de baja "${dialogo?.categoria?.nombre ?? ''}"? Sus productos siguen en el catálogo hasta que los des de baja.`}
        textoConfirmar="Eliminar"
        procesando={eliminar.isPending}
        error={eliminar.isError ? handleApiError(eliminar.error) : null}
        onConfirmar={() => {
          if (dialogo?.tipo === 'eliminar') eliminar.mutate(dialogo.categoria.id, { onSuccess: cerrar })
        }}
        onCancelar={cerrar}
      />
    </section>
  )
}
