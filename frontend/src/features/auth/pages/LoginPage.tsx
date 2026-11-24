import { useForm } from '@tanstack/react-form'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { MensajeError } from '../../../shared/components/MensajeError'
import { Button } from '../../../shared/ui/Button'
import { Card } from '../../../shared/ui/Card'
import { Campo, Input } from '../../../shared/ui/Input'
import { useAuthStore } from '../../../store/authStore'

const requerido = ({ value }: { value: string }) =>
  value.trim() ? undefined : 'Este campo es obligatorio'

export function LoginPage() {
  const usuario = useAuthStore((s) => s.usuario)
  const login = useAuthStore((s) => s.login)
  const error = useAuthStore((s) => s.error)
  const enviando = useAuthStore((s) => s.enviando)
  const navigate = useNavigate()
  const location = useLocation()
  const desde = (location.state as { from?: { pathname: string } } | null)?.from?.pathname

  const form = useForm({
    defaultValues: { username: '', password: '' },
    onSubmit: async ({ value }) => {
      const logueado = await login(value.username.trim(), value.password)
      if (logueado) {
        navigate(desde ?? (logueado.role === 'admin' ? '/admin' : '/'), { replace: true })
      }
    },
  })

  if (usuario && !enviando) return <Navigate to="/" replace />

  return (
    <div className="mx-auto max-w-md">
      <Card>
        <h1 className="mb-1 text-2xl font-bold">Iniciar sesión</h1>
        <p className="mb-6 text-sm text-stone-500">Ingresá con tu usuario para hacer pedidos.</p>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            void form.handleSubmit()
          }}
          className="flex flex-col gap-4"
        >
          <MensajeError mensaje={error} />

          <form.Field name="username" validators={{ onSubmit: requerido }}>
            {(field) => (
              <Campo label="Usuario" errores={field.state.meta.errors}>
                <Input
                  autoComplete="username"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </Campo>
            )}
          </form.Field>

          <form.Field name="password" validators={{ onSubmit: requerido }}>
            {(field) => (
              <Campo label="Contraseña" errores={field.state.meta.errors}>
                <Input
                  type="password"
                  autoComplete="current-password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </Campo>
            )}
          </form.Field>

          <Button type="submit" disabled={enviando}>
            {enviando ? 'Ingresando…' : 'Ingresar'}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-stone-600">
          ¿No tenés cuenta?{' '}
          <Link to="/register" className="font-medium text-orange-700 hover:underline">
            Registrate
          </Link>
        </p>
      </Card>
    </div>
  )
}
