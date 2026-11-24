import { api } from '../../../shared/api/axiosInstance'
import type {
  FiltrosProductos,
  Producto,
  ProductoPayload,
  ProductosPaginados,
  ProductoStockPayload,
} from '../types/producto'

export const productosApi = {
  listar: async (filtros: FiltrosProductos) =>
    (await api.get<ProductosPaginados>('/productos', { params: filtros })).data,
  crear: async (datos: ProductoPayload) => (await api.post<Producto>('/productos', datos)).data,
  actualizar: async (id: number, datos: ProductoPayload) =>
    (await api.put<Producto>(`/productos/${id}`, datos)).data,
  actualizarStock: async (id: number, datos: ProductoStockPayload) =>
    (await api.patch<Producto>(`/productos/${id}/stock`, datos)).data,
  eliminar: async (id: number) => {
    await api.delete(`/productos/${id}`)
  },
}
