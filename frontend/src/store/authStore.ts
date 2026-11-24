import axios from 'axios'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { requestLogin, requestLogout, requestMe } from '../features/auth/api/auth'
import type { Usuario } from '../features/auth/types/auth'

interface AuthState {
  usuario: Usuario | null
  cargando: boolean
  enviando: boolean
  error: string | null
  login: (username: string, password: string) => Promise<Usuario | null>
  logout: () => Promise<void>
  checkSession: () => Promise<void>
  limpiarSesion: () => void
}

const mensajeLogin = (error: unknown): string => {
  if (axios.isAxiosError<{ detail?: unknown }>(error)) {
    const detail = error.response?.data?.detail
    if (typeof detail === 'string') return detail
    if (!error.response) return 'No se pudo conectar con el servidor'
  }
  return 'No se pudo iniciar sesión'
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      usuario: null,
      cargando: true,
      enviando: false,
      error: null,

      login: async (username, password) => {
        set({ enviando: true, error: null })
        try {
          await requestLogin(username, password)
          const usuario = await requestMe()
          set({ usuario })
          return usuario
        } catch (error) {
          set({ usuario: null, error: mensajeLogin(error) })
          return null
        } finally {
          set({ enviando: false })
        }
      },

      logout: async () => {
        try {
          await requestLogout()
        } finally {
          set({ usuario: null })
        }
      },

      checkSession: async () => {
        try {
          set({ usuario: await requestMe() })
        } finally {
          set({ cargando: false })
        }
      },

      limpiarSesion: () => set({ usuario: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ usuario: state.usuario }),
    },
  ),
)
