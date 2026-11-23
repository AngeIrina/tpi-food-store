import { NavLink, Outlet } from 'react-router-dom'

const SECCIONES = [
  { ruta: '/admin/resumen', nombre: 'Resumen' },
  { ruta: '/admin/categorias', nombre: 'Categorías' },
  { ruta: '/admin/productos', nombre: 'Productos' },
  { ruta: '/admin/pedidos', nombre: 'Pedidos' },
  { ruta: '/admin/usuarios', nombre: 'Usuarios' },
]

export function AdminLayout() {
  return (
    <div className="flex flex-col gap-6">
      <nav className="flex flex-wrap gap-2 border-b border-stone-200 pb-3">
        {SECCIONES.map((s) => (
          <NavLink
            key={s.ruta}
            to={s.ruta}
            className={({ isActive }) =>
              `rounded-lg px-3 py-1.5 text-sm font-medium ${isActive ? 'bg-orange-700/80 text-white' : 'text-stone-600 hover:bg-stone-200'}`
            }
          >
            {s.nombre}
          </NavLink>
        ))}
      </nav>
      <Outlet />
    </div>
  )
}
