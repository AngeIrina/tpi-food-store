interface MensajeErrorProps {
  mensaje: string | null
}

export function MensajeError({ mensaje }: Readonly<MensajeErrorProps>) {
  if (!mensaje) return null
  return (
    <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{mensaje}</p>
  )
}
