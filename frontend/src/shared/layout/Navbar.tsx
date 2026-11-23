import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { useCartStore } from '../../store/cartStore'
import { Button } from '../ui/Button'

const claseLink = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-2 text-sm font-medium ${isActive ? 'bg-white/15 text-white' : 'text-white/85 hover:bg-white/10'}`

export function Navbar() {
  const usuario = useAuthStore((s) => s.usuario)
  const logout = useAuthStore((s) => s.logout)
  const cantidad = useCartStore((s) => s.cantidadTotal())
  const navigate = useNavigate()

  const cerrarSesion = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <header className="bg-stone-800 text-white shadow">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="text-xl font-bold tracking-tight">
          🍔 Food Store
        </Link>

        <div className="flex flex-wrap items-center gap-1">
          <NavLink to="/" end className={claseLink}>
            Catálogo
          </NavLink>
          <NavLink to="/carrito" className={claseLink}>
            Carrito{cantidad > 0 && <span className="ml-1 rounded-full bg-orange-600 px-2 text-xs">{cantidad}</span>}
          </NavLink>
          {usuario && (
            <NavLink to="/mis-pedidos" className={claseLink}>
              Mis pedidos
            </NavLink>
          )}
          {usuario?.role === 'admin' && (
            <NavLink to="/admin" className={claseLink}>
              Panel admin
            </NavLink>
          )}
        </div>

        <div className="flex items-center gap-3">
          {usuario ? (
            <>
              <span className="text-sm text-white/80">
                {usuario.full_name} <span className="text-white/50">({usuario.role})</span>
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
