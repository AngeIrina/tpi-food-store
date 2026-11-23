import type { ButtonHTMLAttributes } from 'react'

type Variante = 'primario' | 'secundario' | 'peligro' | 'fantasma'
type Tamano = 'sm' | 'md'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: Variante
  tamano?: Tamano
}

const VARIANTES: Record<Variante, string> = {
  primario: 'bg-orange-700/80 text-white hover:bg-orange-700/90',
  secundario: 'bg-stone-200 text-stone-700 hover:bg-stone-300',
  peligro: 'bg-rose-700/75 text-white hover:bg-rose-700/85',
  fantasma: 'text-stone-600 hover:bg-stone-100',
}

const TAMANOS: Record<Tamano, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2',
}

export function Button({
  variante = 'primario',
  tamano = 'md',
  type = 'button',
  className = '',
  ...props
}: Readonly<ButtonProps>) {
  return (
    <button
      type={type}
      className={`rounded-lg font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTES[variante]} ${TAMANOS[tamano]} ${className}`}
      {...props}
    />
  )
}
