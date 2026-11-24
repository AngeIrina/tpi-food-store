import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { categoriasApi } from '../api/categorias'
import type { CategoriaPayload } from '../types/categoria'

export const CATEGORIAS_KEY = ['categorias']

export function useCategorias() {
  return useQuery({ queryKey: CATEGORIAS_KEY, queryFn: categoriasApi.listar })
}

function useInvalidarCatalogo() {
  const queryClient = useQueryClient()
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: CATEGORIAS_KEY }),
      queryClient.invalidateQueries({ queryKey: ['productos'] }),
    ])
}

export function useGuardarCategoria() {
  const invalidar = useInvalidarCatalogo()
  return useMutation({
    mutationFn: ({ id, datos }: { id?: number; datos: CategoriaPayload }) =>
      id ? categoriasApi.actualizar(id, datos) : categoriasApi.crear(datos),
    onSuccess: invalidar,
  })
}

export function useEliminarCategoria() {
  const invalidar = useInvalidarCatalogo()
  return useMutation({
    mutationFn: (id: number) => categoriasApi.eliminar(id),
    onSuccess: invalidar,
  })
}
