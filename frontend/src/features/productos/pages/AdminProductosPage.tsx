import type { ColumnDef } from '@tanstack/react-table'
import { useState } from 'react'
import { handleApiError } from '../../../shared/api/handleApiError'
import { ConfirmarAccion } from '../../../shared/components/ConfirmarAccion'
import { DataTable } from '../../../shared/components/DataTable'
import { EstadoError } from '../../../shared/components/EstadoError'
import { Skeleton } from '../../../shared/components/Skeleton'
import { Button } from '../../../shared/ui/Button'
import { Modal } from '../../../shared/ui/Modal'
import { formatearPrecio } from '../../../shared/utils/formato'
import { useCategorias } from '../../categorias/hooks/useCategorias'
import { ProductoForm } from '../components/ProductoForm'
import { StockForm } from '../components/StockForm'
import {
  useActualizarStock,
  useEliminarProducto,
  useGuardarProducto,
  useProductos,
} from '../hooks/useProductos'
import type { Producto, ProductoPayload, ProductoStockPayload } from '../types/producto'

type Dialogo = { tipo: 'form'; producto: Producto | null } | { tipo: 'stock' | 'eliminar'; producto: Producto }

const errorDe = (mutacion: { isError: boolean; error: unknown }) =>
  mutacion.isError ? handleApiError(mutacion.error) : null

export function AdminProductosPage() {
  const [dialogo, setDialogo] = useState<Dialogo | null>(null)
  const { data, isPending, isError, error, refetch } = useProductos({ skip: 0, limit: 100 })
  const { data: categorias = [] } = useCategorias()
  const guardar = useGuardarProducto()
  const stock = useActualizarStock()
  const eliminar = useEliminarProducto()

  const abrir = (nuevo: Dialogo) => {
    guardar.reset()
    stock.reset()
    eliminar.reset()
    setDialogo(nuevo)
  }
  const cerrar = () => setDialogo(null)

  const columnas: ColumnDef<Producto>[] = [
    { accessorKey: 'nombre', header: 'Nombre' },
    { id: 'categoria', accessorFn: (p) => p.categoria.nombre, header: 'Categoría' },
    {
      accessorKey: 'precio_base',
      header: 'Precio',
      cell: ({ row }) => formatearPrecio(row.original.precio_base),
    },
    { accessorKey: 'stock', header: 'Stock' },
    {
      accessorKey: 'disponible',
      header: 'Disponible',
      cell: ({ row }) => (row.original.disponible ? 'Sí' : 'No'),
    },
    {
      id: 'acciones',
      header: 'Acciones',
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex gap-1">
          <Button variante="fantasma" tamano="sm" onClick={() => abrir({ tipo: 'form', producto: row.original })}>
            Editar
          </Button>
          <Button variante="fantasma" tamano="sm" onClick={() => abrir({ tipo: 'stock', producto: row.original })}>
            Stock
          </Button>
          <Button
            variante="fantasma"
            tamano="sm"
            className="text-rose-700"
            onClick={() => abrir({ tipo: 'eliminar', producto: row.original })}
          >
            Eliminar
          </Button>
        </div>
      ),
    },
  ]

  const onGuardar = (datos: ProductoPayload) => {
    const id = dialogo?.tipo === 'form' ? dialogo.producto?.id : undefined
    guardar.mutate({ id, datos }, { onSuccess: cerrar })
  }

  const onStock = (datos: ProductoStockPayload) => {
    if (dialogo?.tipo === 'stock') stock.mutate({ id: dialogo.producto.id, datos }, { onSuccess: cerrar })
  }

  let contenido
  if (isPending) contenido = <Skeleton cantidad={5} className="h-12" />
  else if (isError) contenido = <EstadoError mensaje={handleApiError(error)} onReintentar={() => void refetch()} />
  else contenido = <DataTable data={data.items} columns={columnas} buscador />

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Productos</h1>
        <Button onClick={() => abrir({ tipo: 'form', producto: null })} disabled={categorias.length === 0}>
          + Nuevo producto
        </Button>
      </div>

      {contenido}

      <Modal
        abierto={dialogo?.tipo === 'form'}
        titulo={dialogo?.tipo === 'form' && dialogo.producto ? 'Editar producto' : 'Nuevo producto'}
        onCerrar={cerrar}
      >
        {dialogo?.tipo === 'form' && (
          <ProductoForm
            producto={dialogo.producto}
            categorias={categorias}
            guardando={guardar.isPending}
            error={errorDe(guardar)}
            onGuardar={onGuardar}
            onCancelar={cerrar}
          />
        )}
      </Modal>

      <Modal abierto={dialogo?.tipo === 'stock'} titulo="Stock y disponibilidad" onCerrar={cerrar}>
        {dialogo?.tipo === 'stock' && (
          <StockForm
            producto={dialogo.producto}
            guardando={stock.isPending}
            error={errorDe(stock)}
            onGuardar={onStock}
            onCancelar={cerrar}
          />
        )}
      </Modal>

      <ConfirmarAccion
        abierto={dialogo?.tipo === 'eliminar'}
        titulo="Eliminar producto"
        mensaje={`¿Dar de baja "${dialogo?.producto?.nombre ?? ''}"? Dejará de aparecer en el catálogo.`}
        textoConfirmar="Eliminar"
        procesando={eliminar.isPending}
        error={errorDe(eliminar)}
        onConfirmar={() => {
          if (dialogo?.tipo === 'eliminar') eliminar.mutate(dialogo.producto.id, { onSuccess: cerrar })
        }}
        onCancelar={cerrar}
      />
    </section>
  )
}
