import { useState } from 'react'
import { handleApiError } from '../../../shared/api/handleApiError'
import { EstadoError } from '../../../shared/components/EstadoError'
import { EstadoVacio } from '../../../shared/components/EstadoVacio'
import { MensajeError } from '../../../shared/components/MensajeError'
import { Paginacion } from '../../../shared/components/Paginacion'
import { Skeleton } from '../../../shared/components/Skeleton'
import { BadgeEstado } from '../../../shared/ui/BadgeEstado'
import { Button } from '../../../shared/ui/Button'
import { Card } from '../../../shared/ui/Card'
import { Modal } from '../../../shared/ui/Modal'
import { formatearFecha, formatearPrecio } from '../../../shared/utils/formato'
import { PedidoDetalle } from '../components/PedidoDetalle'
import { useCancelarPedido, usePedidos } from '../hooks/usePedidos'

const POR_PAGINA = 10

export function MisPedidosPage() {
  const [pagina, setPagina] = useState(0)
  const [seleccionadoId, setSeleccionadoId] = useState<number | null>(null)
  const [confirmando, setConfirmando] = useState(false)
  const { data, isPending, isError, error, refetch } = usePedidos({ skip: pagina * POR_PAGINA, limit: POR_PAGINA })
  const cancelar = useCancelarPedido()

  const seleccionado = data?.items.find((p) => p.id === seleccionadoId) ?? null
  const totalPaginas = data ? Math.ceil(data.total / POR_PAGINA) : 0

  const abrir = (id: number) => {
    cancelar.reset()
    setConfirmando(false)
    setSeleccionadoId(id)
  }

  let contenido
  if (isPending) contenido = <Skeleton cantidad={3} className="h-20" />
  else if (isError) contenido = <EstadoError mensaje={handleApiError(error)} onReintentar={() => void refetch()} />
  else if (data.items.length === 0) contenido = <EstadoVacio mensaje="Todavía no hiciste ningún pedido." />
  else
    contenido = data.items.map((pedido) => (
      <Card key={pedido.id} className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col">
          <span className="font-semibold">Pedido #{pedido.id}</span>
          <span className="text-sm text-stone-500">{formatearFecha(pedido.created_at)}</span>
        </div>
        <BadgeEstado estado={pedido.estado} />
        <span className="font-semibold">{formatearPrecio(pedido.total)}</span>
        <Button variante="secundario" tamano="sm" onClick={() => abrir(pedido.id)}>
          Ver detalle
        </Button>
      </Card>
    ))

  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Mis pedidos</h1>
      {contenido}
      <Paginacion pagina={pagina} totalPaginas={totalPaginas} onCambiar={setPagina} />

      <Modal
        abierto={seleccionado !== null}
        titulo={`Pedido #${seleccionado?.id ?? ''}`}
        onCerrar={() => setSeleccionadoId(null)}
      >
        {seleccionado && (
          <div className="flex flex-col gap-4">
            <PedidoDetalle pedido={seleccionado} />
            <MensajeError mensaje={cancelar.isError ? handleApiError(cancelar.error) : null} />
            {seleccionado.estado === 'PENDIENTE' && !confirmando && (
              <Button variante="peligro" onClick={() => setConfirmando(true)}>
                Cancelar pedido
              </Button>
            )}
            {seleccionado.estado === 'PENDIENTE' && confirmando && (
              <div className="flex flex-col gap-2 rounded-lg bg-rose-50 p-3">
                <span className="text-sm text-rose-800">¿Seguro que querés cancelar este pedido?</span>
                <div className="flex justify-end gap-2">
                  <Button variante="secundario" tamano="sm" onClick={() => setConfirmando(false)}>
                    No
                  </Button>
                  <Button
                    variante="peligro"
                    tamano="sm"
                    disabled={cancelar.isPending}
                    onClick={() => cancelar.mutate(seleccionado.id, { onSuccess: () => setConfirmando(false) })}
                  >
                    {cancelar.isPending ? 'Cancelando…' : 'Sí, cancelar'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </section>
  )
}
