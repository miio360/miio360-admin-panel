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
    <div className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 hover:bg-gray-50 border-y">
            {hasExpandable && <TableHead className="w-10"></TableHead>}
            {columns.map((column) => (
              <TableHead
                key={column.key}
                className={`font-semibold text-gray-600 text-xs uppercase ${
                  column.width || ""
                } ${column.align === "center" ? "text-center" : column.align === "right" ? "text-right" : ""} ${
                  column.className || ""
                }`}
              >
                {column.header}
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
          {data.map((item, index) => {
            const itemId = getRowId(item);
            const isExpanded = expandedRows.has(itemId);
            const subItems = getSubItems?.(item);
            const isEven = index % 2 === 0;

            return (
              <React.Fragment key={itemId}>
                <TableRow className="transition-colors border-b group">
                  {hasExpandable && (
                    <TableCell>
                      <ButtonGlobal
                        variant="ghost"
                        size="iconSm"
                        onClick={() => toggleRow(itemId)}
                        className="hover:bg-gray-200 rounded-md"
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

                {isExpanded && subItems && subItems.length > 0 && renderSubItem && (
                  <React.Fragment key={itemId + "-subs"}>
                    {subItems.map((subItem, idx) => (
                      <React.Fragment key={itemId + "-sub-" + idx}>
                        {renderSubItem(subItem, item, isEven)}
                      </React.Fragment>
                    ))}
                  </React.Fragment>
                )}

                {isExpanded &&
                  subItems &&
                  subItems.length === 0 &&
                  renderEmptySubItems && (
                    <TableRow
                      key={itemId + "-empty"}
                      className={`border-b ${
                        isEven ? "bg-primary/[0.08]" : "bg-emerald-100/70"
                      }`}
                    >
                      <TableCell colSpan={columns.length + (hasExpandable ? 1 : 0) + (actions ? 1 : 0)}>
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
