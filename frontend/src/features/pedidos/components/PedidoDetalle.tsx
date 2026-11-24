import { BadgeEstado } from '../../../shared/ui/BadgeEstado'
import { formatearFecha, formatearPrecio } from '../../../shared/utils/formato'
import type { Pedido } from '../types/pedido'

interface PedidoDetalleProps {
  pedido: Pedido
}

export function PedidoDetalle({ pedido }: Readonly<PedidoDetalleProps>) {
  return (
    <div className="flex flex-col gap-4 text-sm">
      <div className="grid grid-cols-2 gap-2">
        <span className="text-stone-500">Estado</span>
        <span>
          <BadgeEstado estado={pedido.estado} />
        </span>
        <span className="text-stone-500">Fecha</span>
        <span>{formatearFecha(pedido.created_at)}</span>
        <span className="text-stone-500">Forma de pago</span>
        <span>{pedido.forma_pago === 'EFECTIVO' ? 'Efectivo' : 'Transferencia'}</span>
        <span className="text-stone-500">Dirección</span>
        <span>{pedido.direccion_entrega}</span>
        {pedido.notas && (
          <>
            <span className="text-stone-500">Notas</span>
            <span>{pedido.notas}</span>
          </>
        )}
      </div>

      <table className="w-full">
        <thead className="border-b border-stone-200 text-left text-xs text-stone-500 uppercase">
          <tr>
            <th className="py-2">Producto</th>
            <th className="py-2 text-right">Cant.</th>
            <th className="py-2 text-right">Precio</th>
            <th className="py-2 text-right">Subtotal</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {pedido.items.map((item) => (
            <tr key={item.producto_id}>
              <td className="py-2">{item.nombre_producto}</td>
              <td className="py-2 text-right">{item.cantidad}</td>
              <td className="py-2 text-right">{formatearPrecio(item.precio_unitario)}</td>
              <td className="py-2 text-right">{formatearPrecio(item.subtotal)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between border-t border-stone-200 pt-3 text-base font-bold">
        <span>Total</span>
        <span>{formatearPrecio(pedido.total)}</span>
      </div>
    </div>
  )
}
