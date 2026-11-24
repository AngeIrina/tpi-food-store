import { useState } from 'react'
import { Button } from '../../../shared/ui/Button'
import { formatearPrecio } from '../../../shared/utils/formato'
import type { Producto } from '../types/producto'

interface ProductoCardProps {
  producto: Producto
  enCarrito: number
  onAgregar: (producto: Producto, cantidad: number) => void
}

export function ProductoCard({ producto, enCarrito, onAgregar }: Readonly<ProductoCardProps>) {
  const [imagenRota, setImagenRota] = useState(false)
  const [cantidad, setCantidad] = useState(1)

  const disponibles = producto.stock - enCarrito
  const puedeAgregar = producto.disponible && disponibles > 0

  let textoBoton = 'Agregar'
  if (!producto.disponible) textoBoton = 'No disponible'
  else if (producto.stock === 0) textoBoton = 'Sin stock'
  else if (disponibles <= 0) textoBoton = 'Máximo en el carrito'

  const cambiarCantidad = (valor: number) => {
    if (Number.isNaN(valor)) return
    setCantidad(Math.min(Math.max(1, valor), Math.max(1, disponibles)))
  }

  const agregar = () => {
    onAgregar(producto, Math.min(cantidad, disponibles))
    setCantidad(1)
  }

  return (
    <article className="flex flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-stone-200">
      {producto.imagen_url && !imagenRota ? (
        <img
          src={producto.imagen_url}
          alt={producto.nombre}
          loading="lazy"
          onError={() => setImagenRota(true)}
          className="h-40 w-full object-cover"
        />
      ) : (
        <div className="flex h-40 items-center justify-center bg-orange-50 text-5xl font-bold text-orange-700/40">
          {producto.nombre.charAt(0)}
        </div>
      )}

      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="text-xs font-semibold tracking-wide text-orange-700/80 uppercase">
          {producto.categoria.nombre}
        </span>
        <h3 className="text-lg font-semibold text-stone-900">{producto.nombre}</h3>
        {producto.descripcion && <p className="text-sm text-stone-600">{producto.descripcion}</p>}

        <div className="mt-auto flex items-end justify-between pt-2">
          <span className="text-xl font-bold text-stone-900">{formatearPrecio(producto.precio_base)}</span>
          <span className="text-xs text-stone-500">Stock: {producto.stock}</span>
        </div>

        <div className="flex items-center gap-2">
          {puedeAgregar && (
            <div className="flex items-center rounded-lg ring-1 ring-stone-300">
              <button
                type="button"
                aria-label="Restar"
                disabled={cantidad <= 1}
                onClick={() => cambiarCantidad(cantidad - 1)}
                className="px-2.5 py-1.5 text-stone-600 hover:bg-stone-100 disabled:opacity-40"
              >
                −
              </button>
              <input
                type="number"
                aria-label={`Cantidad de ${producto.nombre}`}
                min={1}
                max={disponibles}
                value={cantidad}
                onChange={(e) => cambiarCantidad(e.target.valueAsNumber)}
                className="w-10 [appearance:textfield] text-center text-sm font-medium outline-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <button
                type="button"
                aria-label="Sumar"
                disabled={cantidad >= disponibles}
                onClick={() => cambiarCantidad(cantidad + 1)}
                className="px-2.5 py-1.5 text-stone-600 hover:bg-stone-100 disabled:opacity-40"
              >
                +
              </button>
            </div>
          )}
          <Button className="flex-1" disabled={!puedeAgregar} onClick={agregar}>
            {textoBoton}
          </Button>
        </div>
      </div>
    </article>
  )
}
