import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export function SoloClientes() {
  const usuario = useAuthStore((s) => s.usuario)

  if (usuario?.role === 'admin') return <Navigate to="/admin" replace />
  return <Outlet />
}