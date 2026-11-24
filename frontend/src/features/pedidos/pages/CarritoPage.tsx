import { Link, useNavigate } from 'react-router-dom'
import { EstadoVacio } from '../../../shared/components/EstadoVacio'
import { Button } from '../../../shared/ui/Button'
import { Card } from '../../../shared/ui/Card'
import { formatearPrecio } from '../../../shared/utils/formato'
import { useCartStore } from '../../../store/cartStore'

export function CarritoPage() {
  const items = useCartStore((s) => s.items)
  const quitar = useCartStore((s) => s.quitar)
  const cambiarCantidad = useCartStore((s) => s.cambiarCantidad)
  const vaciar = useCartStore((s) => s.vaciar)
  const total = useCartStore((s) => s.total())
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <EstadoVacio mensaje="Tu carrito está vacío.">
        <Link to="/" className="font-medium text-orange-700 hover:underline">
          Ver el menú
        </Link>
      </EstadoVacio>
    )
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-bold">Tu carrito</h1>
        {items.map((item) => (
          <Card
            key={item.producto_id}
            className="grid grid-cols-[1fr_auto] items-center gap-4 sm:grid-cols-[1fr_auto_7rem_auto]"
          >
            <div className="flex flex-col">
              <span className="font-semibold">{item.nombre}</span>
              <span className="text-sm text-stone-500">{formatearPrecio(item.precio_unitario)} c/u</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variante="secundario"
                tamano="sm"
                aria-label="Restar"
                disabled={item.cantidad <= 1}
                onClick={() => cambiarCantidad(item.producto_id, item.cantidad - 1)}
              >
                −
              </Button>
              <span className="w-8 text-center font-medium">{item.cantidad}</span>
              <Button
                variante="secundario"
                tamano="sm"
                aria-label="Sumar"
                disabled={item.cantidad >= item.stock}
                onClick={() => cambiarCantidad(item.producto_id, item.cantidad + 1)}
              >
                +
              </Button>
            </div>
            <span className="text-right font-semibold">
              {formatearPrecio(item.precio_unitario * item.cantidad)}
            </span>
            <Button variante="alerta" tamano="sm" onClick={() => quitar(item.producto_id)}>
              Quitar
            </Button>
          </Card>
        ))}
      </div>

      <Card className="flex h-fit flex-col gap-4">
        <h2 className="text-lg font-semibold">Resumen</h2>
        <div className="flex justify-between text-xl font-bold">
          <span>Total</span>
          <span>{formatearPrecio(total)}</span>
        </div>
                <Button onClick={() => void navigate('/checkout')}>Continuar con el pedido</Button>
        <Button variante="secundario" onClick={vaciar}>
          Vaciar carrito
        </Button>
      </Card>
    </section>
  )
}
