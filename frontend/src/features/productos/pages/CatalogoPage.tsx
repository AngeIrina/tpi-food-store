import { useState } from 'react'
import { handleApiError } from '../../../shared/api/handleApiError'
import { EstadoError } from '../../../shared/components/EstadoError'
import { EstadoVacio } from '../../../shared/components/EstadoVacio'
import { Paginacion } from '../../../shared/components/Paginacion'
import { Skeleton } from '../../../shared/components/Skeleton'
import { useDebounce } from '../../../shared/hooks/useDebounce'
import { Input, Select } from '../../../shared/ui/Input'
import { useCartStore } from '../../../store/cartStore'
import { useToastStore } from '../../../store/toastStore'
import { useCategorias } from '../../categorias/hooks/useCategorias'
import { ProductoCard } from '../components/ProductoCard'
import { useProductos } from '../hooks/useProductos'

const POR_PAGINA = 8

export function CatalogoPage() {
  const [busqueda, setBusqueda] = useState('')
  const [categoriaId, setCategoriaId] = useState('')
  const [pagina, setPagina] = useState(0)
  const search = useDebounce(busqueda.trim())

  const { data: categorias = [] } = useCategorias()
  const { data, isPending, isError, error, refetch, isFetching } = useProductos({
    skip: pagina * POR_PAGINA,
    limit: POR_PAGINA,
    search: search || undefined,
    categoria_id: categoriaId ? Number(categoriaId) : undefined,
  })

  const items = useCartStore((s) => s.items)
  const agregar = useCartStore((s) => s.agregar)
  const mostrarAviso = useToastStore((s) => s.mostrar)
  const totalPaginas = data ? Math.ceil(data.total / POR_PAGINA) : 0

  let contenido
  if (isPending) {
    contenido = <Skeleton cantidad={POR_PAGINA} className="h-80" />
  } else if (isError) {
    contenido = (
      <div className="col-span-full">
        <EstadoError mensaje={handleApiError(error)} onReintentar={() => void refetch()} />
      </div>
    )
  } else if (data.items.length === 0) {
    contenido = (
      <div className="col-span-full">
        <EstadoVacio mensaje="No encontramos productos con esos filtros." />
      </div>
    )
  } else {
    contenido = data.items.map((producto) => (
      <ProductoCard
        key={producto.id}
        producto={producto}
        enCarrito={items.find((i) => i.producto_id === producto.id)?.cantidad ?? 0}
        onAgregar={(producto, cantidad) => {
          agregar(producto, cantidad)
          mostrarAviso(`${cantidad} × ${producto.nombre} agregado al carrito`)
        }}
      />
    ))
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-stone-900">Nuestro menú</h1>
        <p className="text-stone-500">Elegí tus productos y armá tu pedido.</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          placeholder="Buscar por nombre…"
          value={busqueda}
          onChange={(e) => {
            setBusqueda(e.target.value)
            setPagina(0)
          }}
          className="sm:max-w-sm"
        />
        <Select
          value={categoriaId}
          onChange={(e) => {
            setCategoriaId(e.target.value)
            setPagina(0)
          }}
          className="sm:max-w-xs"
        >
          <option value="">Todas las categorías</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </Select>
      </div>

      <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 ${isFetching && !isPending ? 'opacity-60' : ''}`}>
        {contenido}
      </div>

      <Paginacion pagina={pagina} totalPaginas={totalPaginas} onCambiar={setPagina} />
    </section>
  )
}
