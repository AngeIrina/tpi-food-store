import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { useState } from 'react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

interface DataTableProps<T> {
  data: T[]
  columns: ColumnDef<T>[]
  buscador?: boolean
  paginacionCliente?: boolean
  tamanoPagina?: number
}

export function DataTable<T>({
  data,
  columns,
  buscador = false,
  paginacionCliente = true,
  tamanoPagina = 10,
}: Readonly<DataTableProps<T>>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [filtro, setFiltro] = useState('')

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter: filtro },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltro,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    ...(paginacionCliente && { getPaginationRowModel: getPaginationRowModel() }),
    initialState: { pagination: { pageSize: tamanoPagina } },
  })

  return (
    <div className="flex flex-col gap-3">
      {buscador && (
        <Input
          placeholder="Buscar en la tabla…"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="max-w-xs"
        />
      )}

      <div className="overflow-x-auto rounded-xl bg-white shadow-sm ring-1 ring-stone-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-stone-100 text-xs uppercase tracking-wide text-stone-500">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-3 font-semibold">
                    {header.isPlaceholder ? null : (
                      <button
                        type="button"
                        className={header.column.getCanSort() ? 'cursor-pointer select-none' : 'cursor-default'}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{ asc: ' ▲', desc: ' ▼' }[header.column.getIsSorted() as string] ?? ''}
                      </button>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-stone-100">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-stone-50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 align-middle">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
            {table.getRowModel().rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-stone-500">
                  No hay registros para mostrar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {paginacionCliente && table.getPageCount() > 1 && (
        <div className="flex items-center justify-end gap-3 text-sm text-stone-600">
          <Button variante="secundario" tamano="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            Anterior
          </Button>
          <span>
            Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
          </span>
          <Button variante="secundario" tamano="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Siguiente
          </Button>
        </div>
      )}
    </div>
  )
}
