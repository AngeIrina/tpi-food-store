import { useForm } from '@tanstack/react-form'
import { MensajeError } from '../../../shared/components/MensajeError'
import { Button } from '../../../shared/ui/Button'
import { Campo, Input } from '../../../shared/ui/Input'
import type { Producto, ProductoStockPayload } from '../types/producto'

interface StockFormProps {
  producto: Producto
  guardando: boolean
  error: string | null
  onGuardar: (datos: ProductoStockPayload) => void
  onCancelar: () => void
}

export function StockForm({ producto, guardando, error, onGuardar, onCancelar }: Readonly<StockFormProps>) {
  const form = useForm({
    defaultValues: { stock: producto.stock, disponible: producto.disponible },
    onSubmit: ({ value }) => onGuardar(value),
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        void form.handleSubmit()
      }}
      className="flex flex-col gap-4"
    >
      <MensajeError mensaje={error} />
      <p className="text-sm text-stone-600">{producto.nombre}</p>

      <form.Field
        name="stock"
        validators={{
          onChange: ({ value }) =>
            value < 0 || !Number.isInteger(value) ? 'Entero mayor o igual a 0' : undefined,
        }}
      >
        {(field) => (
          <Campo label="Stock" errores={field.state.meta.errors}>
            <Input
              type="number"
              min={0}
              step={1}
              placeholder="0"
              value={field.state.value || ''}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(Number(e.target.value))}
            />
          </Campo>
        )}
      </form.Field>

      <form.Field name="disponible">
        {(field) => (
          <label className="flex items-center gap-2 text-sm font-medium text-stone-700">
            <input
              type="checkbox"
              checked={field.state.value}
              onChange={(e) => field.handleChange(e.target.checked)}
              className="h-4 w-4 accent-orange-700"
            />
            <span>Disponible para la venta</span>
          </label>
        )}
      </form.Field>

      <div className="flex justify-end gap-2">
        <Button variante="secundario" onClick={onCancelar}>
          Cancelar
        </Button>
        <Button type="submit" disabled={guardando}>
          {guardando ? 'Guardando…' : 'Actualizar stock'}
        </Button>
      </div>
    </form>
  )
}
