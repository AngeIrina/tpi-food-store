import axios from 'axios'

export function handleApiError(error: unknown): string {
  if (!axios.isAxiosError(error)) return 'Error inesperado.'
  if (error.code === 'ECONNABORTED') return 'El servidor tardó demasiado en responder.'
  if (!error.response) return 'No se pudo conectar con el servidor.'

  const { status, data } = error.response
  const detail = (data as { detail?: unknown } | undefined)?.detail

  if (status === 401) return 'La sesión venció. Iniciá sesión de nuevo.'
  if (status === 403) return 'No tenés permisos para realizar esta acción.'
  if (status === 422) return 'Los datos enviados no son válidos.'
  if (typeof detail === 'string') return detail
  if (status < 500) return 'No se pudo completar la operación.'
  return 'Error del servidor. Intentá nuevamente más tarde.'
}
