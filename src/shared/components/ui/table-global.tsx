



import * as React from 'react';
import { useState, ChangeEvent } from 'react';
import { Table, TableBody, TableCell, TableRow } from './table';
import clsx from 'clsx';
import { Button } from './button';
import { Package, Search } from 'lucide-react';


export interface TableGlobalColumn<T> {
  key: keyof T | string;
  header: React.ReactNode;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

export interface TableGlobalProps<T> {
  columns: TableGlobalColumn<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  emptyButtonText?: string;
  onEmptyButtonClick?: () => void;
  actionsRender?: (row: T) => React.ReactNode;
  rowClassName?: (row: T) => string;
}


export function TableGlobal<T extends { id: string }>({
  columns,
  data,
  loading = false,
  emptyMessage = 'Sin datos',
  emptyButtonText,
  onEmptyButtonClick,
  actionsRender,
  rowClassName,
}: TableGlobalProps<T>) {
  // Search state
  const [search, setSearch] = useState('');
  // Filtrado por search (busca en string de todas las celdas)
  const filteredData = search.trim()
    ? data.filter(row =>
        columns.some(col => {
          const value = col.render ? col.render(row) : row[col.key as keyof T];
          return typeof value === 'string' && value.toLowerCase().includes(search.toLowerCase());
        })
      )
    : data;

  // Paginación real de 6 en 6
  const realPageSize = 6;
  const totalPages = Math.ceil(filteredData.length / realPageSize);
  const [internalPage, setInternalPage] = useState(0);
  React.useEffect(() => { setInternalPage(0); }, [search]);
  const paginatedData = filteredData.slice(internalPage * realPageSize, (internalPage + 1) * realPageSize);

  // Handlers
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value);
  const handlePrev = () => setInternalPage(p => Math.max(0, p - 1));
  const handleNext = () => setInternalPage(p => Math.min(totalPages - 1, p + 1));

  return (
    <div className="w-full">
      {/* Search bar */}
      <div className="mb-4 flex items-center bg-background rounded-lg border border-border px-3 py-2 shadow-sm">
        <Search className="w-4 h-4 text-muted-foreground mr-2" />
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Buscar por nombre o descripción..."
          className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
        />
      </div>
      <Table className="w-full">
        <thead>
          <tr className="bg-gray-50 hover:bg-gray-50 border-y">
            {columns.map((col) => (
              <th key={col.key as string} className={clsx('px-6 py-4 text-left font-semibold text-gray-600 text-xs uppercase', col.className)}>{col.header}</th>
            ))}
            {actionsRender && <th className="px-6 py-4 text-right font-semibold text-gray-600 text-xs uppercase">Acciones</th>}
          </tr>
        </thead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={columns.length + (actionsRender ? 1 : 0)} className="text-center py-8">Cargando...</TableCell>
            </TableRow>
          ) : paginatedData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length + (actionsRender ? 1 : 0)} className="h-48 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                    <Package className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground font-medium">{emptyMessage}</p>
                  {emptyButtonText && onEmptyButtonClick && (
                    <Button variant="link" size="sm" onClick={onEmptyButtonClick}>
                      {emptyButtonText}
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ) : (
            paginatedData.map((row, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <TableRow
                  key={row.id}
                  className={clsx(
                    'transition-colors border-b group',
                    isEven ? 'bg-primary/5 hover:bg-primary/10' : 'bg-emerald-50 hover:bg-emerald-100',
                    rowClassName ? rowClassName(row) : ''
                  )}
                >
                  {columns.map((col) => (
                    <TableCell
                      key={col.key as string}
                      className={clsx('py-4 px-6 text-sm', col.className)}
                    >
                      {col.render ? col.render(row) : (row[col.key as keyof T] as React.ReactNode)}
                    </TableCell>
                  ))}
                  {actionsRender && (
                    <TableCell className="text-right px-6">
                      <div className="flex justify-end gap-2">
                        {actionsRender(row)}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
      {/* Paginación */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-muted-foreground">
          Página {totalPages === 0 ? 0 : internalPage + 1} de {totalPages}
        </div>
        <div className="flex gap-2">
          <button
            className="px-3 py-1 rounded bg-muted text-foreground disabled:opacity-50"
            onClick={handlePrev}
            disabled={internalPage === 0}
          >
            Anterior
          </button>
          <button
            className="px-3 py-1 rounded bg-muted text-foreground disabled:opacity-50"
            onClick={handleNext}
            disabled={internalPage + 1 >= totalPages}
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}
