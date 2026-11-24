import { api } from '../../../shared/api/axiosInstance'
import type {
  EstadoPedido,
  FiltrosPedidos,
  Pedido,
  PedidoPayload,
  PedidosPaginados,
  ResumenPedidos,
} from '../types/pedido'

export const pedidosApi = {
  listar: async (filtros: FiltrosPedidos) =>
    (await api.get<PedidosPaginados>('/pedidos', { params: filtros })).data,
  crear: async (datos: PedidoPayload) => (await api.post<Pedido>('/pedidos', datos)).data,
  cambiarEstado: async (id: number, estado: EstadoPedido) =>
    (await api.patch<Pedido>(`/pedidos/${id}/estado`, { estado })).data,
  cancelar: async (id: number) => (await api.patch<Pedido>(`/pedidos/${id}/cancelar`)).data,
  resumen: async () => (await api.get<ResumenPedidos>('/pedidos/resumen')).data,
}
