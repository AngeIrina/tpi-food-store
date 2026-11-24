import { useForm } from '@tanstack/react-form'
import { MensajeError } from '../../../shared/components/MensajeError'
import { Button } from '../../../shared/ui/Button'
import { Campo, Select, Textarea } from '../../../shared/ui/Input'
import type { FormaPago } from '../types/pedido'

export interface CheckoutValues {
  direccion_entrega: string
  forma_pago: FormaPago
  notas: string
}

interface CheckoutFormProps {
  enviando: boolean
  error: string | null
  onConfirmar: (datos: CheckoutValues) => void
}

const valoresIniciales: CheckoutValues = {
  direccion_entrega: '',
  forma_pago: 'EFECTIVO',
  notas: '',
}

export function CheckoutForm({ enviando, error, onConfirmar }: Readonly<CheckoutFormProps>) {
  const form = useForm({
    defaultValues: valoresIniciales,
    onSubmit: ({ value }) => onConfirmar(value),
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

      <form.Field
        name="direccion_entrega"
        validators={{
          onChange: ({ value }) => {
            const largo = value.trim().length
            if (largo < 5) return 'La dirección debe tener al menos 5 caracteres'
            if (largo > 200) return 'La dirección no puede superar los 200 caracteres'
            return undefined
          },
        }}
      >
        {(field) => (
          <Campo label="Dirección de entrega" errores={field.state.meta.isTouched ? field.state.meta.errors : []}>
            <Textarea
              rows={2}
              placeholder="Calle, número, piso, departamento…"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </Campo>
        )}
      </form.Field>

      <form.Field name="forma_pago">
        {(field) => (
          <Campo label="Forma de pago">
            <Select
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value as FormaPago)}
            >
              <option value="EFECTIVO">Efectivo</option>
              <option value="TRANSFERENCIA">Transferencia</option>
            </Select>
          </Campo>
        )}
      </form.Field>

      <form.Field name="notas">
        {(field) => (
          <Campo label="Notas (opcional)">
            <Textarea
              rows={2}
              placeholder="Ej.: tocar timbre, sin cebolla…"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </Campo>
        )}
      </form.Field>

      <form.Subscribe selector={(state) => state.canSubmit}>
        {(canSubmit) => (
          <Button type="submit" disabled={!canSubmit || enviando}>
            {enviando ? 'Confirmando…' : 'Confirmar pedido'}
          </Button>
        )}
      </form.Subscribe>
    </form>
  )
}
