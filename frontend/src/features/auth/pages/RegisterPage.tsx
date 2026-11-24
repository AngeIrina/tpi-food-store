import { useForm } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { handleApiError } from '../../../shared/api/handleApiError'
import { MensajeError } from '../../../shared/components/MensajeError'
import { Button } from '../../../shared/ui/Button'
import { Card } from '../../../shared/ui/Card'
import { Campo, Input } from '../../../shared/ui/Input'
import { useAuthStore } from '../../../store/authStore'
import { requestRegistro } from '../api/auth'
import type { RegistroPayload } from '../types/auth'

interface RegistroForm extends RegistroPayload {
  confirmar: string
}

const valoresIniciales: RegistroForm = {
  username: '',
  full_name: '',
  email: '',
  password: '',
  confirmar: '',
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@.]+\.[^\s@]+$/

export function RegisterPage() {
  const usuario = useAuthStore((s) => s.usuario)
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()

  const registro = useMutation({
    mutationFn: (datos: RegistroPayload) => requestRegistro(datos),
    onSuccess: async (_usuario, datos) => {
      await login(datos.username, datos.password)
      await navigate('/', { replace: true })
    },
  })

  const form = useForm({
    defaultValues: valoresIniciales,
    onSubmit: ({ value }) => {
      const { confirmar: _confirmar, ...datos } = value
      registro.mutate({ ...datos, username: datos.username.trim(), full_name: datos.full_name.trim() })
    },
  })

  if (usuario && !registro.isPending) return <Navigate to="/" replace />

  return (
    <div className="mx-auto max-w-md">
      <Card>
        <img src="/assets/logo.svg" alt="Food Store" className="mx-auto mb-4 h-32 w-auto" />
        <h1 className="mb-1 text-2xl font-bold">Crear cuenta</h1>
        <p className="mb-6 text-sm text-stone-500">Registrate para hacer tus pedidos.</p>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            void form.handleSubmit()
          }}
          className="flex flex-col gap-4"
        >
          <MensajeError mensaje={registro.isError ? handleApiError(registro.error) : null} />

          <form.Field
            name="username"
            validators={{
              onChange: ({ value }) =>
                value.trim().length < 3 ? 'Mínimo 3 caracteres' : undefined,
            }}
          >
            {(field) => (
              <Campo label="Usuario" errores={field.state.meta.isTouched ? field.state.meta.errors : []}>
                <Input
                  autoComplete="username"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </Campo>
            )}
          </form.Field>

          <form.Field
            name="full_name"
            validators={{
              onChange: ({ value }) =>
                value.trim().length < 2 ? 'Ingresá tu nombre completo' : undefined,
            }}
          >
            {(field) => (
              <Campo label="Nombre completo" errores={field.state.meta.isTouched ? field.state.meta.errors : []}>
                <Input
                  autoComplete="name"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </Campo>
            )}
          </form.Field>

          <form.Field
            name="email"
            validators={{
              onChange: ({ value }) => (EMAIL_REGEX.test(value) ? undefined : 'Email inválido'),
            }}
          >
            {(field) => (
              <Campo label="Email" errores={field.state.meta.isTouched ? field.state.meta.errors : []}>
                <Input
                  type="email"
                  autoComplete="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </Campo>
            )}
          </form.Field>

          <form.Field
            name="password"
            validators={{
              onChange: ({ value }) =>
                value.length < 8 ? 'La contraseña debe tener al menos 8 caracteres' : undefined,
            }}
          >
            {(field) => (
              <Campo label="Contraseña" errores={field.state.meta.isTouched ? field.state.meta.errors : []}>
                <Input
                  type="password"
                  autoComplete="new-password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </Campo>
            )}
          </form.Field>

          <form.Field
            name="confirmar"
            validators={{
              onChangeListenTo: ['password'],
              onChange: ({ value, fieldApi }) =>
                value === fieldApi.form.getFieldValue('password')
                  ? undefined
                  : 'Las contraseñas no coinciden',
            }}
          >
            {(field) => (
              <Campo label="Repetir contraseña" errores={field.state.meta.isTouched ? field.state.meta.errors : []}>
                <Input
                  type="password"
                  autoComplete="new-password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </Campo>
            )}
          </form.Field>

          <form.Subscribe selector={(state) => state.canSubmit}>
            {(canSubmit) => (
              <Button type="submit" disabled={!canSubmit || registro.isPending}>
                {registro.isPending ? 'Creando cuenta…' : 'Registrarme'}
              </Button>
            )}
          </form.Subscribe>
        </form>

        <p className="mt-4 text-center text-sm text-stone-600">
          ¿Ya tenés cuenta?{' '}
          <Link to="/login" className="font-medium text-orange-700 hover:underline">
            Iniciá sesión
          </Link>
        </p>
      </Card>
    </div>
  )
}
