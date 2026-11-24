import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { pedidosApi } from '../api/pedidos'
import type { EstadoPedido, FiltrosPedidos, PedidoPayload } from '../types/pedido'

export function usePedidos(filtros: FiltrosPedidos) {
  return useQuery({
    queryKey: ['pedidos', filtros],
    queryFn: () => pedidosApi.listar(filtros),
    placeholderData: keepPreviousData,
  })
}

export function useResumenPedidos() {
  return useQuery({ queryKey: ['pedidos', 'resumen'], queryFn: pedidosApi.resumen })
}

function useInvalidarPedidosYStock() {
  const queryClient = useQueryClient()
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ['pedidos'] }),
      queryClient.invalidateQueries({ queryKey: ['productos'] }),
    ])
}

export function useCrearPedido() {
  const invalidar = useInvalidarPedidosYStock()
  return useMutation({
    mutationFn: (datos: PedidoPayload) => pedidosApi.crear(datos),
    onSuccess: invalidar,
  })
}

export function useCambiarEstadoPedido() {
  const invalidar = useInvalidarPedidosYStock()
  return useMutation({
    mutationFn: ({ id, estado }: { id: number; estado: EstadoPedido }) =>
      pedidosApi.cambiarEstado(id, estado),
    onSuccess: invalidar,
  })
}

export function useCancelarPedido() {
  const invalidar = useInvalidarPedidosYStock()
  return useMutation({
    mutationFn: (id: number) => pedidosApi.cancelar(id),
    onSuccess: invalidar,
  })
}
