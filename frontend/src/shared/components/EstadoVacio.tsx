import type { ReactNode } from 'react'

interface EstadoVacioProps {
  mensaje: string
  children?: ReactNode
}

export function EstadoVacio({ mensaje, children }: Readonly<EstadoVacioProps>) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-stone-300 py-12 text-center">
      <p className="text-stone-500">{mensaje}</p>
      {children}
    </div>
  )
}
