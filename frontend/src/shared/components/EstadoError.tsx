import { Button } from '../ui/Button'

interface EstadoErrorProps {
  mensaje: string
  onReintentar?: () => void
}

export function EstadoError({ mensaje, onReintentar }: Readonly<EstadoErrorProps>) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 py-10 text-center">
      <p className="text-rose-700">{mensaje}</p>
      {onReintentar && (
        <Button variante="secundario" tamano="sm" onClick={onReintentar}>
          Reintentar
        </Button>
      )}
    </div>
  )
}
