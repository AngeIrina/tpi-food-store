import { handleApiError } from '../../../shared/api/handleApiError'
import { EstadoError } from '../../../shared/components/EstadoError'
import { Skeleton } from '../../../shared/components/Skeleton'
import { formatearPrecio } from '../../../shared/utils/formato'
import { ResumenCard } from '../components/ResumenCard'
import { useResumenPedidos } from '../hooks/usePedidos'

export function AdminResumenPage() {
  const { data, isPending, isError, error, refetch } = useResumenPedidos()

  let contenido
  if (isPending) contenido = <Skeleton cantidad={6} className="h-24" />
  else if (isError)
    contenido = (
      <div className="col-span-full">
        <EstadoError mensaje={handleApiError(error)} onReintentar={() => void refetch()} />
      </div>
    )
  else
    contenido = (
      <>
        <ResumenCard titulo="Pedidos de hoy" valor={data.pedidos_hoy} />
        <ResumenCard titulo="Pendientes" valor={data.pendientes} color="text-amber-700" />
        <ResumenCard titulo="En preparación" valor={data.en_preparacion} color="text-sky-700" />
        <ResumenCard titulo="Entregados" valor={data.entregados} color="text-emerald-700" />
        <ResumenCard titulo="Cancelados" valor={data.cancelados} color="text-rose-700" />
        <ResumenCard titulo="Ingresos (entregados)" valor={formatearPrecio(data.ingresos_entregados)} />
      </>
    )

  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Resumen del negocio</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">{contenido}</div>
    </section>
  )
}
