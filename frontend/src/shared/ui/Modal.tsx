import type { ReactNode } from 'react'

interface ModalProps {
  abierto: boolean
  titulo: string
  onCerrar: () => void
  children: ReactNode
}

export function Modal({ abierto, titulo, onCerrar, children }: Readonly<ModalProps>) {
  if (!abierto) return null

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 className="text-xl font-bold text-stone-900">{titulo}</h2>
          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar"
            className="rounded-md px-2 text-2xl leading-none text-stone-400 hover:text-stone-700"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
