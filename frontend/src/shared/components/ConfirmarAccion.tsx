import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import { MensajeError } from './MensajeError'

interface ConfirmarAccionProps {
  abierto: boolean
  titulo: string
  mensaje: string
  textoConfirmar?: string
  procesando: boolean
  error: string | null
  onConfirmar: () => void
  onCancelar: () => void
}

export function ConfirmarAccion({
  abierto,
  titulo,
  mensaje,
  textoConfirmar = 'Confirmar',
  procesando,
  error,
  onConfirmar,
  onCancelar,
}: Readonly<ConfirmarAccionProps>) {
  return (
    <Modal abierto={abierto} titulo={titulo} onCerrar={onCancelar}>
      <div className="flex flex-col gap-4">
        <MensajeError mensaje={error} />
        <p className="text-stone-600">{mensaje}</p>
        <div className="flex justify-end gap-2">
          <Button variante="secundario" onClick={onCancelar}>
            Volver
          </Button>
          <Button variante="peligro" onClick={onConfirmar} disabled={procesando}>
            {procesando ? 'Procesando…' : textoConfirmar}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
