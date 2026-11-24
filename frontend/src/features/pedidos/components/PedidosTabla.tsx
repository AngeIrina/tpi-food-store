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
        return (
          <div className="flex flex-wrap gap-1">
            <Button variante="fantasma" tamano="sm" onClick={() => onVer(pedido)}>
              Ver
            </Button>
            {TRANSICIONES[pedido.estado].map((destino) =>
              destino === 'CANCELADO' ? (
                <Button
                  key={destino}
                  variante="fantasma"
                  tamano="sm"
                  className="text-rose-700"
                  disabled={procesando}
                  onClick={() => onCambiarEstado(pedido, destino)}
                >
                  Cancelar
                </Button>
              ) : (
                <Button key={destino} tamano="sm" disabled={procesando} onClick={() => onCambiarEstado(pedido, destino)}>
                  {ETIQUETA_AVANCE[destino]}
                </Button>
              ),
            )}
          </div>
        )
      },
    },
  ]

  return <DataTable data={pedidos} columns={columnas} paginacionCliente={false} />
}
