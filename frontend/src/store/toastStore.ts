import { create } from 'zustand'

interface ToastState {
  mensaje: string | null
  mostrar: (mensaje: string) => void
  cerrar: () => void
}

let temporizador: ReturnType<typeof setTimeout> | undefined

export const useToastStore = create<ToastState>()((set) => ({
  mensaje: null,
  mostrar: (mensaje) => {
    clearTimeout(temporizador)
    set({ mensaje })
    temporizador = setTimeout(() => set({ mensaje: null }), 3000)
  },
  cerrar: () => {
    clearTimeout(temporizador)
    set({ mensaje: null })
  },
}))
