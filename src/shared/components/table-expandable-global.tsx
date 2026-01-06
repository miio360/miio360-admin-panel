import React, { useState, ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { ButtonGlobal } from "./button-global";
import { ChevronDown, ChevronRight } from "lucide-react";

export interface TableExpandableColumn<T> {
  key: string;
  header: string;
  width?: string;
  className?: string;
  align?: "left" | "center" | "right";
  render?: (item: T) => ReactNode;
}

export interface TableExpandableGlobalProps<T, S = T> {
  data: T[];
  columns: TableExpandableColumn<T>[];
  getRowId: (item: T) => string;
  getSubItems?: (item: T) => S[] | undefined;
  renderSubItem?: (item: S, parentItem: T, isEven: boolean) => ReactNode;
  renderEmptySubItems?: (item: T, isEven: boolean) => ReactNode;
  actions?: (item: T) => ReactNode;
}

export function TableExpandableGlobal<T, S = T>({
  data,
  columns,
  getRowId,
  getSubItems,
  renderSubItem,
  renderEmptySubItems,
  actions,
}: TableExpandableGlobalProps<T, S>) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const hasExpandable = !!getSubItems;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="sticky top-0 z-10 bg-background border-b border-gray-200">
            {hasExpandable && <TableHead className="w-10 bg-background"></TableHead>}
            {columns.map((column) => (
              <TableHead
                key={column.key}
                className={`font-semibold text-foreground text-xs uppercase tracking-wide bg-background ${
                  column.width || ""
                } ${column.align === "center" ? "text-center" : column.align === "right" ? "text-right" : ""} ${
                  column.className || ""
                }`}
                style={{ borderBottom: '1.5px solid #F3F4F6' }}
              >
                {column.header}
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
          {data.map((item, index) => {
            const itemId = getRowId(item);
            const isExpanded = expandedRows.has(itemId);
            const subItems = getSubItems?.(item);
            const isEven = index % 2 === 0;

            // Fila principal: hover amarillo, borde izq amarillo si expandido
            return (
              <React.Fragment key={itemId}>
                <TableRow
                  className={`transition-colors border-b border-gray-100 group
                    ${isExpanded ? 'ring-2 ring-primary/60 ring-inset border-l-4 border-l-primary bg-primary/10' : ''}
                    hover:bg-primary/20
                    ${isEven ? 'bg-white' : 'bg-background'}`}
                  style={{ cursor: hasExpandable ? 'pointer' : 'default' }}
                >
                  {hasExpandable && (
                    <TableCell className="bg-transparent">
                      <ButtonGlobal
                        variant="ghost"
                        size="iconSm"
                        onClick={() => toggleRow(itemId)}
                        className="hover:bg-primary/20 rounded-md transition-colors"
                        tabIndex={0}
                        aria-label={isExpanded ? 'Colapsar' : 'Expandir'}
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-gray-600" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-gray-600" />
                        )}
                      </ButtonGlobal>
                    </TableCell>
                  )}
                  {columns.map((column) => (
                    <TableCell
                      key={column.key}
                      className={`${column.width || ""} ${
                        column.align === "center"
                          ? "text-center"
                          : column.align === "right"
                          ? "text-right"
                          : ""
                      } ${column.className || ""}`}
                    >
                      {column.render
                        ? column.render(item)
                        : String((item as any)[column.key] || "")}
                    </TableCell>
                  ))}
                  {actions && (
                    <TableCell className="text-right w-[18%]">
                      <div className="flex justify-end gap-1">{actions(item)}</div>
                    </TableCell>
                  )}
                </TableRow>

                {/* Subfilas: alineadas debajo, indent visual, fondo moderno */}
                {isExpanded && subItems && subItems.length > 0 && renderSubItem && (
                  <React.Fragment key={itemId + "-subs"}>
                    {subItems.map((subItem, idx) => (
                      <TableRow
                        key={itemId + "-sub-" + idx}
                        className="border-b border-gray-100 bg-gray-50 group/subrow hover:bg-primary/10 transition-colors"
                      >
                        <TableCell
                          colSpan={columns.length + (actions ? 1 : 0) + (hasExpandable ? 1 : 0)}
                          className="bg-gray-50 p-0 align-middle"
                        >
                          {renderSubItem(subItem, item, isEven)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </React.Fragment>
                )}

                {/* Empty subitems: alineado debajo, fondo moderno */}
                {isExpanded &&
                  subItems &&
                  subItems.length === 0 &&
                  renderEmptySubItems && (
                    <TableRow
                      key={itemId + "-empty"}
                      className="border-b bg-background"
                    >
                      {hasExpandable && <TableCell className="bg-background p-0 w-10"></TableCell>}
                      <TableCell colSpan={columns.length + (actions ? 1 : 0)}>
                        {renderEmptySubItems(item, isEven)}
                      </TableCell>
                    </TableRow>
                  )}
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
