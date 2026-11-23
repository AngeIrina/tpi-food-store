import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'

const claseCampo =
  'w-full rounded-lg border border-stone-300 bg-white px-3 py-2 focus:border-orange-600/60 focus:outline-none focus:ring-2 focus:ring-orange-200'

interface CampoProps {
  label: string
  errores?: ReadonlyArray<unknown>
  children: ReactNode
}

export function Campo({ label, errores = [], children }: Readonly<CampoProps>) {
  return (
    <label className="flex flex-col gap-1 text-sm font-medium text-stone-700">
      <span>{label}</span>
      {children}
      {errores.filter(Boolean).map((error) => (
        <span key={String(error)} className="text-xs font-normal text-rose-700">
          {String(error)}
        </span>
      ))}
    </label>
  )
}

export function Input(props: Readonly<InputHTMLAttributes<HTMLInputElement>>) {
  return <input {...props} className={`${claseCampo} ${props.className ?? ''}`} />
}

export function Select(props: Readonly<SelectHTMLAttributes<HTMLSelectElement>>) {
  return <select {...props} className={`${claseCampo} ${props.className ?? ''}`} />
}

export function Textarea(props: Readonly<TextareaHTMLAttributes<HTMLTextAreaElement>>) {
  return <textarea rows={3} {...props} className={`${claseCampo} ${props.className ?? ''}`} />
}
