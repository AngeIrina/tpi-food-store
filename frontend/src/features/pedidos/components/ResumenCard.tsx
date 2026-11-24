import { Card } from '../../../shared/ui/Card'

interface ResumenCardProps {
  titulo: string
  valor: string | number
  color?: string
}

export function ResumenCard({ titulo, valor, color = 'text-stone-900' }: Readonly<ResumenCardProps>) {
  return (
    <Card className="flex flex-col gap-1">
      <span className="text-sm text-stone-500">{titulo}</span>
      <span className={`text-3xl font-bold ${color}`}>{valor}</span>
    </Card>
  )
}
