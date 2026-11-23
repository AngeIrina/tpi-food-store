import axios, { type AxiosError } from 'axios'
import { useAuthStore } from '../../store/authStore'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  timeout: 10000,
})

const RUTAS_DE_AUTH = ['/auth/token', '/auth/me']
const CUENTA_DESACTIVADA = 'Cuenta de usuario desactivada'

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ detail?: unknown }>) => {
    const url = error.config?.url ?? ''
    const esDeAuth = RUTAS_DE_AUTH.some((ruta) => url.includes(ruta))
    const status = error.response?.status
    const desactivada = status === 400 && error.response?.data?.detail === CUENTA_DESACTIVADA

    if ((status === 401 && !esDeAuth) || desactivada) {
      useAuthStore.getState().limpiarSesion()
    }
    return Promise.reject(error)
  },
)
