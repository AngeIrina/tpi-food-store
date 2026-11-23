import type { EstadoPedido } from '../../features/pedidos/types/pedido'

const ESTILOS: Record<EstadoPedido, string> = {
  PENDIENTE: 'bg-amber-100 text-amber-800',
  EN_PREPARACION: 'bg-sky-100 text-sky-800',
  ENTREGADO: 'bg-emerald-100 text-emerald-800',
  CANCELADO: 'bg-rose-100 text-rose-800',
}

const ETIQUETAS: Record<EstadoPedido, string> = {
  PENDIENTE: 'Pendiente',
  EN_PREPARACION: 'En preparación',
  ENTREGADO: 'Entregado',
  CANCELADO: 'Cancelado',
}

interface BadgeEstadoProps {
  estado: EstadoPedido
}

export function BadgeEstado({ estado }: Readonly<BadgeEstadoProps>) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${ESTILOS[estado]}`}>
      {ETIQUETAS[estado]}
    </span>
  )
}
