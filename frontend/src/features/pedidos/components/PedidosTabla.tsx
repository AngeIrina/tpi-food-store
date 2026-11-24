import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '../../../shared/components/DataTable'
import { BadgeEstado } from '../../../shared/ui/BadgeEstado'
import { Button } from '../../../shared/ui/Button'
import { formatearFecha, formatearPrecio } from '../../../shared/utils/formato'
import { type EstadoPedido, type Pedido, TRANSICIONES } from '../types/pedido'

interface PedidosTablaProps {
  pedidos: Pedido[]
  procesandoId: number | null
  onVer: (pedido: Pedido) => void
  onCambiarEstado: (pedido: Pedido, estado: EstadoPedido) => void
}

const ETIQUETA_AVANCE: Partial<Record<EstadoPedido, string>> = {
  EN_PREPARACION: 'Preparar',
  ENTREGADO: 'Entregar',
}

export function PedidosTabla({ pedidos, procesandoId, onVer, onCambiarEstado }: Readonly<PedidosTablaProps>) {
  const columnas: ColumnDef<Pedido>[] = [
    { accessorKey: 'id', header: '#' },
    { accessorKey: 'usuario_id', header: 'Cliente (id)' },
    {
      accessorKey: 'created_at',
      header: 'Fecha',
      cell: ({ row }) => formatearFecha(row.original.created_at),
    },
    {
      accessorKey: 'estado',
      header: 'Estado',
      cell: ({ row }) => <BadgeEstado estado={row.original.estado} />,
    },
    {
      accessorKey: 'total',
      header: 'Total',
      cell: ({ row }) => formatearPrecio(row.original.total),
    },
    {
      id: 'acciones',
      header: 'Acciones',
      enableSorting: false,
      cell: ({ row }) => {
        const pedido = row.original
        const procesando = procesandoId === pedido.id
        const siguiente = TRANSICIONES[pedido.estado].find((estado) => estado !== 'CANCELADO')
        const cancelable = TRANSICIONES[pedido.estado].includes('CANCELADO')
        return (
          <div className="flex items-center gap-2">
            <Button variante="secundario" tamano="sm" className="w-14" onClick={() => onVer(pedido)}>
              Ver
            </Button>
            {siguiente ? (
              <Button
                tamano="sm"
                className="w-24"
                disabled={procesando}
                onClick={() => onCambiarEstado(pedido, siguiente)}
              >
                {ETIQUETA_AVANCE[siguiente]}
              </Button>
            ) : (
              <span className="w-24" />
            )}
            {cancelable && (
              <Button
                variante="alerta"
                tamano="sm"
                disabled={procesando}
                onClick={() => onCambiarEstado(pedido, 'CANCELADO')}
              >
                Cancelar
              </Button>
            )}
          </div>
        )
      },
    },
  ]

  return <DataTable data={pedidos} columns={columnas} paginacionCliente={false} />
}
