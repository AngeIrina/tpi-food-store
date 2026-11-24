import { Navigate, useNavigate } from 'react-router-dom'
import { handleApiError } from '../../../shared/api/handleApiError'
import { Card } from '../../../shared/ui/Card'
import { formatearPrecio } from '../../../shared/utils/formato'
import { useCartStore } from '../../../store/cartStore'
import { CheckoutForm, type CheckoutValues } from '../components/CheckoutForm'
import { useCrearPedido } from '../hooks/usePedidos'

export function CheckoutPage() {
  const items = useCartStore((s) => s.items)
  const total = useCartStore((s) => s.total())
  const vaciar = useCartStore((s) => s.vaciar)
  const crearPedido = useCrearPedido()
  const navigate = useNavigate()

  if (items.length === 0 && !crearPedido.isSuccess) return <Navigate to="/carrito" replace />

  const confirmar = (datos: CheckoutValues) => {
    crearPedido.mutate(
      {
        items: items.map((i) => ({ producto_id: i.producto_id, cantidad: i.cantidad })),
        forma_pago: datos.forma_pago,
        direccion_entrega: datos.direccion_entrega.trim(),
        notas: datos.notas.trim() || null,
      },
      {
        onSuccess: () => {
          vaciar()
          navigate('/mis-pedidos', { replace: true })
        },
      },
    )
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <Card>
        <h1 className="mb-4 text-2xl font-bold">Confirmar pedido</h1>
        <CheckoutForm
          enviando={crearPedido.isPending}
          error={crearPedido.isError ? handleApiError(crearPedido.error) : null}
          onConfirmar={confirmar}
        />
      </Card>

      <Card className="flex h-fit flex-col gap-3">
        <h2 className="text-lg font-semibold">Tu pedido</h2>
        {items.map((item) => (
          <div key={item.producto_id} className="flex justify-between text-sm">
            <span>
              {item.cantidad} × {item.nombre}
            </span>
            <span>{formatearPrecio(item.precio_unitario * item.cantidad)}</span>
          </div>
        ))}
        <div className="flex justify-between border-t border-stone-200 pt-3 text-lg font-bold">
          <span>Total</span>
          <span>{formatearPrecio(total)}</span>
        </div>
      </Card>
    </section>
  )
}
