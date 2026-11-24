import { useForm } from '@tanstack/react-form'
import { MensajeError } from '../../../shared/components/MensajeError'
import { Button } from '../../../shared/ui/Button'
import { Campo, Input, Textarea } from '../../../shared/ui/Input'
import type { Categoria, CategoriaPayload } from '../types/categoria'

interface CategoriaFormProps {
  categoria: Categoria | null
  guardando: boolean
  error: string | null
  onGuardar: (datos: CategoriaPayload) => void
  onCancelar: () => void
}

export function CategoriaForm({
  categoria,
  guardando,
  error,
  onGuardar,
  onCancelar,
}: Readonly<CategoriaFormProps>) {
  const form = useForm({
    defaultValues: {
      nombre: categoria?.nombre ?? '',
      descripcion: categoria?.descripcion ?? '',
    },
    onSubmit: ({ value }) =>
      onGuardar({ nombre: value.nombre.trim(), descripcion: value.descripcion.trim() || null }),
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
        name="nombre"
        validators={{
          onChange: ({ value }) => {
            const largo = value.trim().length
            if (largo < 2) return 'Mínimo 2 caracteres'
            if (largo > 100) return 'Máximo 100 caracteres'
            return undefined
          },
        }}
      >
        {(field) => (
          <Campo label="Nombre" errores={field.state.meta.errors}>
            <Input
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </Campo>
        )}
      </form.Field>

      <form.Field name="descripcion">
        {(field) => (
          <Campo label="Descripción">
            <Textarea
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </Campo>
        )}
      </form.Field>

      <div className="flex justify-end gap-2">
        <Button variante="secundario" onClick={onCancelar}>
          Cancelar
        </Button>
        <form.Subscribe selector={(state) => state.canSubmit}>
          {(canSubmit) => (
            <Button type="submit" disabled={!canSubmit || guardando}>
              {guardando ? 'Guardando…' : 'Guardar'}
            </Button>
          )}
        </form.Subscribe>
      </div>
    </form>
  )
}
