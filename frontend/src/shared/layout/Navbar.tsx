import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { useCartStore } from '../../store/cartStore'
import { Button } from '../ui/Button'

const claseLink = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-2 text-sm font-medium ${isActive ? 'bg-orange-100 text-orange-800' : 'text-stone-600 hover:bg-stone-100'}`

export function Navbar() {
  const usuario = useAuthStore((s) => s.usuario)
  const logout = useAuthStore((s) => s.logout)
  const cantidad = useCartStore((s) => s.cantidadTotal())
  const navigate = useNavigate()
  const esAdmin = usuario?.role === 'admin'

  const cerrarSesion = async () => {
    await logout()
    await navigate('/login')
  }

  return (
    <header className="border-b border-stone-200 bg-white shadow-sm">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link to={esAdmin ? '/admin' : '/'} className="flex items-center gap-2 text-xl font-bold tracking-tight text-stone-900">
          <img src="/assets/logo.svg" alt="" className="h-9 w-auto" />
          <span>Food Store</span>
        </Link>

        <div className="flex flex-wrap items-center gap-1">
          {esAdmin ? (
            <NavLink to="/admin" className={claseLink}>
              Panel admin
            </NavLink>
          ) : (
            <>
              <NavLink to="/" end className={claseLink}>
                Catálogo
              </NavLink>
              <NavLink to="/carrito" className={claseLink}>
                Carrito
                {cantidad > 0 && <span className="ml-1 rounded-full bg-orange-600 px-2 text-xs text-white">{cantidad}</span>}
              </NavLink>
              {usuario && (
                <NavLink to="/mis-pedidos" className={claseLink}>
                  Mis pedidos
                </NavLink>
              )}
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          {usuario ? (
            <>
              <span className="text-sm text-stone-600">
                {usuario.full_name} <span className="text-stone-400">({usuario.role})</span>
              </span>
              <Button variante="secundario" tamano="sm" onClick={cerrarSesion}>
                Cerrar sesión
              </Button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={claseLink}>
                Ingresar
              </NavLink>
              <NavLink to="/register" className={claseLink}>
                Registrarse
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
