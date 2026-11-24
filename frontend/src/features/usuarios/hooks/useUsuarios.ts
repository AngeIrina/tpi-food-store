import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { usuariosApi } from '../api/usuarios'

const USUARIOS_KEY = ['usuarios']

export function useUsuarios() {
  return useQuery({ queryKey: USUARIOS_KEY, queryFn: usuariosApi.listar })
}

export function useCambiarEstadoUsuario() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, activar }: { id: number; activar: boolean }) =>
      activar ? usuariosApi.activar(id) : usuariosApi.desactivar(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: USUARIOS_KEY }),
  })
}
