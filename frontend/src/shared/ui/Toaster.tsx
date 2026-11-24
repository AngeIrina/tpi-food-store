import { Link } from 'react-router-dom'
import { useToastStore } from '../../store/toastStore'

export function Toaster() {
  const mensaje = useToastStore((s) => s.mensaje)
  const cerrar = useToastStore((s) => s.cerrar)

  if (!mensaje) return null

  return (
    <output
      className="fixed right-4 top-20 z-30 flex items-center gap-3 rounded-xl bg-emerald-700/90 px-4 py-3 text-white shadow-lg"
    >
      <span className="text-lg">✓</span>
      <span className="text-sm font-medium">{mensaje}</span>
      <Link to="/carrito" onClick={cerrar} className="text-sm font-semibold underline underline-offset-2">
        Ver carrito
      </Link>
      <button type="button" onClick={cerrar} aria-label="Cerrar aviso" className="ml-1 text-white/70 hover:text-white">
        ×
      </button>
    </output>
  )
}
