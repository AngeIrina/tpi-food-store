import { api } from '../../../shared/api/axiosInstance'
import type { RegistroPayload, Usuario } from '../types/auth'

export async function requestLogin(username: string, password: string): Promise<void> {
  await api.post('/auth/token', new URLSearchParams({ username, password }))
}

export async function requestMe(): Promise<Usuario | null> {
  try {
    const { data } = await api.get<Usuario>('/auth/me')
    return data
  } catch {
    return null
  }
}

export async function requestLogout(): Promise<void> {
  await api.post('/auth/logout')
}

export async function requestRegistro(payload: RegistroPayload): Promise<Usuario> {
  const { data } = await api.post<Usuario>('/auth/register', payload)
  return data
}
