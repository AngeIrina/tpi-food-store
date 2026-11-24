import { useState } from 'react'
import { handleApiError } from '../../../shared/api/handleApiError'
import { EstadoError } from '../../../shared/components/EstadoError'
import { MensajeError } from '../../../shared/components/MensajeError'
import { Paginacion } from '../../../shared/components/Paginacion'
import { Skeleton } from '../../../shared/components/Skeleton'
import { Select } from '../../../shared/ui/Input'
import { Modal } from '../../../shared/ui/Modal'
import { PedidoDetalle } from '../components/PedidoDetalle'
import { PedidosTabla } from '../components/PedidosTabla'
import { useCambiarEstadoPedido, usePedidos } from '../hooks/usePedidos'
import type { EstadoPedido, Pedido } from '../types/pedido'

const POR_PAGINA = 20

const ESTADOS: { valor: EstadoPedido; nombre: string }[] = [
  { valor: 'PENDIENTE', nombre: 'Pendientes' },
  { valor: 'EN_PREPARACION', nombre: 'En preparación' },
  { valor: 'ENTREGADO', nombre: 'Entregados' },
  { valor: 'CANCELADO', nombre: 'Cancelados' },
]

export function AdminPedidosPage() {
  const [estado, setEstado] = useState<EstadoPedido | ''>('')
  const [pagina, setPagina] = useState(0)
  const [detalle, setDetalle] = useState<Pedido | null>(null)
  const { data, isPending, isError, error, refetch } = usePedidos({
    skip: pagina * POR_PAGINA,
    limit: POR_PAGINA,
    estado: estado || undefined,
  })
  const cambiarEstado = useCambiarEstadoPedido()
  const totalPaginas = data ? Math.ceil(data.total / POR_PAGINA) : 0

  let contenido
  if (isPending) contenido = <Skeleton cantidad={5} className="h-12" />
  else if (isError) contenido = <EstadoError mensaje={handleApiError(error)} onReintentar={() => void refetch()} />
  else
    contenido = (
      <PedidosTabla
        pedidos={data.items}
        procesandoId={cambiarEstado.isPending ? (cambiarEstado.variables?.id ?? null) : null}
        onVer={setDetalle}
        onCambiarEstado={(pedido, nuevo) => cambiarEstado.mutate({ id: pedido.id, estado: nuevo })}
      />
    )

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Pedidos</h1>
        <Select
          value={estado}
          onChange={(e) => {
            setEstado(e.target.value as EstadoPedido | '')
            setPagina(0)
          }}
          className="max-w-xs"
        >
          <option value="">Todos los estados</option>
          {ESTADOS.map((e) => (
            <option key={e.valor} value={e.valor}>
              {e.nombre}
            </option>
          ))}
        </Select>
      </div>

      <MensajeError mensaje={cambiarEstado.isError ? handleApiError(cambiarEstado.error) : null} />
      {contenido}
      <Paginacion pagina={pagina} totalPaginas={totalPaginas} onCambiar={setPagina} />

      <Modal abierto={detalle !== null} titulo={`Pedido #${detalle?.id ?? ''}`} onCerrar={() => setDetalle(null)}>
        {detalle && <PedidoDetalle pedido={detalle} />}
      </Modal>
    </section>
  )
}
