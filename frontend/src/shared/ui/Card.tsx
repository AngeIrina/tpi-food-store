import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
}

export function Card({ children, className = '' }: Readonly<CardProps>) {
  return (
    <div className={`rounded-xl bg-white p-5 shadow-sm ring-1 ring-stone-200 ${className}`}>
      {children}
    </div>
  )
}
