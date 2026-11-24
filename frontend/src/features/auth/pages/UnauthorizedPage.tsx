import { Link } from 'react-router-dom'
import { EstadoVacio } from '../../../shared/components/EstadoVacio'

export function UnauthorizedPage() {
  return (
    <EstadoVacio mensaje="No tenés permisos para ver esta página.">
      <Link to="/" className="font-medium text-orange-700 hover:underline">
        Volver al inicio
      </Link>
    </EstadoVacio>
  )
}
