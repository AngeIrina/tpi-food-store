import { useForm } from '@tanstack/react-form'
import { MensajeError } from '../../../shared/components/MensajeError'
import { Button } from '../../../shared/ui/Button'
import { Campo, Input, Select, Textarea } from '../../../shared/ui/Input'
import type { Categoria } from '../../categorias/types/categoria'
import type { Producto, ProductoPayload } from '../types/producto'

interface ProductoFormProps {
  producto: Producto | null
  categorias: Categoria[]
  guardando: boolean
  error: string | null
  onGuardar: (datos: ProductoPayload) => void
  onCancelar: () => void
}

interface ProductoFormValues {
  nombre: string
  descripcion: string
  precio_base: number
  imagen_url: string
  stock: number
  disponible: boolean
  categoria_id: number
}

const valoresDesde = (producto: Producto | null, categorias: Categoria[]): ProductoFormValues => ({
  nombre: producto?.nombre ?? '',
  descripcion: producto?.descripcion ?? '',
  precio_base: producto?.precio_base ?? 0,
  imagen_url: producto?.imagen_url ?? '',
  stock: producto?.stock ?? 0,
  disponible: producto?.disponible ?? true,
  categoria_id: producto?.categoria_id ?? categorias[0]?.id ?? 0,
})

export function ProductoForm({
  producto,
  categorias,
  guardando,
  error,
  onGuardar,
  onCancelar,
}: Readonly<ProductoFormProps>) {
  const form = useForm({
    defaultValues: valoresDesde(producto, categorias),
    onSubmit: ({ value }) =>
      onGuardar({
        ...value,
        nombre: value.nombre.trim(),
        descripcion: value.descripcion.trim() || null,
        imagen_url: value.imagen_url.trim() || null,
      }),
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
          onChange: ({ value }) => (value.trim().length < 2 ? 'Mínimo 2 caracteres' : undefined),
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

      <div className="grid grid-cols-2 gap-4">
        <form.Field
          name="precio_base"
          validators={{
            onChange: ({ value }) => (value < 0 ? 'No puede ser negativo' : undefined),
          }}
        >
          {(field) => (
            <Campo label="Precio" errores={field.state.meta.errors}>
              <Input
                type="number"
                min={0}
                step="0.01"
                placeholder="0"
                value={field.state.value || ''}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(Number(e.target.value))}
              />
            </Campo>
          )}
        </form.Field>

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
      </div>

      <form.Field
        name="categoria_id"
        validators={{ onChange: ({ value }) => (value ? undefined : 'Elegí una categoría') }}
      >
        {(field) => (
          <Campo label="Categoría" errores={field.state.meta.errors}>
            <Select
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(Number(e.target.value))}
            >
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </Select>
          </Campo>
        )}
      </form.Field>

      <form.Field name="imagen_url">
        {(field) => (
          <Campo label="URL de la imagen (opcional)">
            <Input
              type="url"
              placeholder="https://…"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
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
