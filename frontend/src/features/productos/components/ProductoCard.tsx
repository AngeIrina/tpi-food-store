import { formatearPrecio } from '../../../shared/utils/formato'
import { Button } from '../../../shared/ui/Button'
import type { Producto } from '../types/producto'

interface ProductoCardProps {
  producto: Producto
  enCarrito: number
  onAgregar: (producto: Producto) => void
}

export function ProductoCard({ producto, enCarrito, onAgregar }: Readonly<ProductoCardProps>) {
  const sinStock = producto.stock === 0
  const puedeAgregar = producto.disponible && enCarrito < producto.stock

  let textoBoton = 'Agregar al carrito'
  if (!producto.disponible) textoBoton = 'No disponible'
  else if (sinStock) textoBoton = 'Sin stock'
  else if (!puedeAgregar) textoBoton = 'Máximo en el carrito'

  return (
    <article className="flex flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-stone-200">
      {producto.imagen_url ? (
        <img src={producto.imagen_url} alt={producto.nombre} className="h-40 w-full object-cover" />
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

        <Button disabled={!puedeAgregar} onClick={() => onAgregar(producto)}>
          {textoBoton}
        </Button>
        {enCarrito > 0 && (
          <span className="text-center text-xs text-stone-500">En el carrito: {enCarrito}</span>
        )}
      </div>
    </article>
  )
}
