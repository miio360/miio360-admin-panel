



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
}: TableGlobalProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / pageSize);
  const paginatedData = showPagination
    ? data.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : data;

  React.useEffect(() => {
    setCurrentPage(1);
  }, [data.length]);

  return (
    <div className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 hover:bg-gray-50 border-y">
            {columns.map((col) => (
              <TableHead
                key={col.key as string}
                className={`font-semibold text-gray-600 text-xs uppercase ${col.width || ""} ${
                  col.align === "center"
                    ? "text-center"
                    : col.align === "right"
                    ? "text-right"
                    : ""
                } ${col.className || ""}`}
              >
                {col.header}
              </TableHead>
            ))}
            {actions && (
              <TableHead className="text-right font-semibold text-gray-600 text-xs uppercase w-[18%]">
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
                className="text-center py-12"
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
                className="h-48 text-center"
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
            paginatedData.map((row) => (
              <TableRow
                key={row.id}
                className={`transition-colors border-b group ${
                  rowClassName ? rowClassName(row) : ""
                }`}
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
      {showPagination && (
        <PaginationGlobal
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
