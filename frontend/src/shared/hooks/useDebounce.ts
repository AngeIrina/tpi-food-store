import { useEffect, useState } from 'react'

export function useDebounce<T>(valor: T, demoraMs = 400): T {
  const [valorDemorado, setValorDemorado] = useState(valor)

  useEffect(() => {
    const id = setTimeout(() => setValorDemorado(valor), demoraMs)
    return () => clearTimeout(id)
  }, [valor, demoraMs])

  return valorDemorado
}
