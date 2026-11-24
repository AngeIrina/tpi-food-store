import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Producto } from '../features/productos/types/producto'

export interface ItemCarrito {
  producto_id: number
  nombre: string
  precio_unitario: number
  cantidad: number
  stock: number
}

interface CartState {
  items: ItemCarrito[]
  agregar: (producto: Producto) => void
  quitar: (productoId: number) => void
  cambiarCantidad: (productoId: number, cantidad: number) => void
  vaciar: () => void
  total: () => number
  cantidadTotal: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      agregar: (producto) => {
        const existente = get().items.find((i) => i.producto_id === producto.id)
        if (existente) {
          get().cambiarCantidad(producto.id, existente.cantidad + 1)
          return
        }
        set({
          items: [
            ...get().items,
            {
              producto_id: producto.id,
              nombre: producto.nombre,
              precio_unitario: producto.precio_base,
              cantidad: 1,
              stock: producto.stock,
            },
          ],
        })
      },

      quitar: (productoId) =>
        set({ items: get().items.filter((i) => i.producto_id !== productoId) }),

      cambiarCantidad: (productoId, cantidad) =>
        set({
          items: get().items.map((i) =>
            i.producto_id === productoId
              ? { ...i, cantidad: Math.min(Math.max(1, cantidad), i.stock) }
              : i,
          ),
        }),

      vaciar: () => set({ items: [] }),

      total: () => get().items.reduce((acc, i) => acc + i.precio_unitario * i.cantidad, 0),

      cantidadTotal: () => get().items.reduce((acc, i) => acc + i.cantidad, 0),
    }),
    { name: 'cart-storage' },
  ),
)
