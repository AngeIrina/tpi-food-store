interface SkeletonProps {
  cantidad?: number
  className?: string
}

export function Skeleton({ cantidad = 1, className = 'h-24' }: Readonly<SkeletonProps>) {
  return (
    <>
      {Array.from({ length: cantidad }, (_, i) => (
        <div key={i} className={`animate-pulse rounded-xl bg-stone-200 ${className}`} />
      ))}
    </>
  )
}
