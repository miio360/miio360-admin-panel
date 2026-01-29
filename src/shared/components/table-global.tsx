import * as React from 'react';
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { PaginationGlobal } from './pagination-global';
import { Package } from 'lucide-react';

export interface TableGlobalColumn<T> {
  key: keyof T | string;
  header: React.ReactNode;
  render?: (row: T) => React.ReactNode;
  className?: string;
  width?: string;
  align?: "left" | "center" | "right";
}

export interface TableGlobalProps<T> {
  columns: TableGlobalColumn<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  actions?: (row: T) => React.ReactNode;
  rowClassName?: (row: T) => string;
  pageSize?: number;
  showPagination?: boolean;
  externalPagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
}

export function TableGlobal<T extends { id: string }>({
  columns,
  data,
  loading = false,
  emptyMessage = 'Sin datos',
  actions,
  rowClassName,
  pageSize = 6,
  showPagination = true,
  externalPagination,
}: TableGlobalProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  // Si hay paginacion externa, usar esos valores; sino, paginar localmente
  const useExternalPagination = !!externalPagination;
  
  const internalTotalPages = Math.ceil(data.length / pageSize);
  const paginatedData = useExternalPagination
    ? data // Los datos ya vienen paginados desde Firestore
    : showPagination
    ? data.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : data;

  const effectiveCurrentPage = useExternalPagination 
    ? externalPagination.currentPage 
    : currentPage;
  const effectiveTotalPages = useExternalPagination 
    ? externalPagination.totalPages 
    : internalTotalPages;
  const effectiveOnPageChange = useExternalPagination 
    ? externalPagination.onPageChange 
    : setCurrentPage;

  React.useEffect(() => {
    if (!useExternalPagination) {
      setCurrentPage(1);
    }
  }, [data.length, useExternalPagination]);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="sticky top-0 z-10 bg-background border-b border-gray-200">
            {columns.map((col) => (
              <TableHead
                key={col.key as string}
                className={`font-semibold text-foreground text-xs uppercase tracking-wide bg-background ${col.width || ""} ${
                  col.align === "center"
                    ? "text-center"
                    : col.align === "right"
                    ? "text-right"
                    : ""
                } ${col.className || ""}`}
                style={{ borderBottom: '1.5px solid #F3F4F6' }}
              >
                {col.header}
              </TableHead>
            ))}
            {actions && (
              <TableHead className="text-right font-semibold text-foreground text-xs uppercase w-[18%] bg-background" style={{ borderBottom: '1.5px solid #F3F4F6' }}>
                Acciones
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell
                colSpan={columns.length + (actions ? 1 : 0)}
                className="text-center py-12 bg-white"
              >
                <div className="flex items-center justify-center">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                  <p className="ml-3 text-sm text-foreground/60 font-medium">Cargando...</p>
                </div>
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length + (actions ? 1 : 0)}
                className="h-48 text-center bg-white"
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                    <Package className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-foreground/60 font-medium">{emptyMessage}</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            paginatedData.map((row, idx) => (
              <TableRow
                key={row.id}
                className={`transition-colors border-b border-gray-100 group hover:bg-primary/10 ${
                  rowClassName ? rowClassName(row) : ""
                } ${idx % 2 === 0 ? 'bg-white' : 'bg-background'}`}
              >
                {columns.map((col) => (
                  <TableCell
                    key={col.key as string}
                    className={`text-sm ${col.width || ""} ${
                      col.align === "center"
                        ? "text-center"
                        : col.align === "right"
                        ? "text-right"
                        : ""
                    } ${col.className || ""}`}
                  >
                    {col.render
                      ? col.render(row)
                      : (row[col.key as keyof T] as React.ReactNode)}
                  </TableCell>
                ))}
                {actions && (
                  <TableCell className="text-right w-[18%]">
                    <div className="flex justify-end gap-1">{actions(row)}</div>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {(showPagination || useExternalPagination) && effectiveTotalPages > 1 && (
        <PaginationGlobal
          currentPage={effectiveCurrentPage}
          totalPages={effectiveTotalPages}
          onPageChange={effectiveOnPageChange}
        />
      )}
    </div>
  );
}
