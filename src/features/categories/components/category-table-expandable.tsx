import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Category, Subcategory } from "@/shared/types";
import { TableExpandableGlobal, TableExpandableColumn } from "@/shared/components/table-expandable-global";
import { TableRow, TableCell } from "@/shared/components/ui/table";
import { ButtonGlobal } from "@/shared/components/button-global";
import { Edit, Trash2, Plus, ChevronDown, ChevronRight, Layers } from "lucide-react";
import { EmptyStateGlobal } from "@/shared/components/empty-state-global";
import { CategoryOrderInput } from "./category-order-input";
import { cn } from "@/shared/lib/utils";

interface CategoryTableExpandableProps {
  categories: Category[];
  subcategories: Record<string, Subcategory[]>;
  onDelete: (id: string, type: "category" | "subcategory") => void;
  onCreateSubcategory: (categoryId: string) => void;
  onOrderChange: (categoryId: string, newOrder: number) => Promise<void>;
}

const getColumns = (onOrderChange: (categoryId: string, newOrder: number) => Promise<void>): TableExpandableColumn<Category>[] => [
  {
    key: 'order',
    header: 'Orden',
    width: 'w-[10%]',
    align: 'center',
    render: (category) => (
      <CategoryOrderInput
        currentOrder={category.order ?? 999}
        categoryId={category.id}
        onOrderChange={onOrderChange}
      />
    ),
  },
  {
    key: 'name',
    header: 'Nombre',
    width: 'w-[18%]',
    render: (category) => (
      <div className="flex items-center gap-2">
        <span className="font-semibold text-gray-900">{category.name}</span>
      </div>
    ),
  },
  {
    key: 'slug',
    header: 'Slug',
    width: 'w-[16%]',
    className: 'text-sm text-gray-500 font-mono',
  },
  {
    key: 'description',
    header: 'Descripción',
    width: 'w-[28%]',
    render: (category) => (
      <div className="truncate text-sm text-gray-600">
        {category.description || <span className="italic text-gray-400">Sin descripción</span>}
      </div>
    ),
  },
  {
    key: 'isActive',
    header: 'Estado',
    width: 'w-[10%]',
    align: 'center',
    render: (category) => (
      <div className="flex justify-center">
        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded ${category.isActive
            ? "text-green-700 bg-green-50"
            : "text-gray-600 bg-gray-100"
          }`}>
          {category.isActive ? "✓ Activo" : "Inactivo"}
        </span>
      </div>
    ),
  },
];

export function CategoryTableExpandable({
  categories,
  subcategories,
  onDelete,
  onCreateSubcategory,
  onOrderChange,
}: CategoryTableExpandableProps) {
  const navigate = useNavigate();
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const toggleCard = (id: string) => {
    setExpandedCards((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <>
      {/* ── Desktop table ───────────────────────────────────── */}
      <div className="hidden sm:block">
        <TableExpandableGlobal<Category, Subcategory>
          data={categories}
          columns={getColumns(onOrderChange)}
          getRowId={(category) => category.id}
          getSubItems={(category) => subcategories[category.id]}
          actions={(category) => (
            <>
              <ButtonGlobal
                variant="ghost"
                size="sm"
                onClick={() => onCreateSubcategory(category.id)}
                icon={<Plus className="h-3.5 w-3.5" />}
                iconPosition="left"
                className="hover:bg-gray-100 text-gray-700 text-xs h-8"
              >
                Subcategoría
              </ButtonGlobal>
              <ButtonGlobal variant="ghost" size="sm" className="hover:bg-gray-100 h-8 w-8" onClick={() => navigate(`/categories/${category.id}/edit`)}>
                <Edit className="h-3.5 w-3.5 text-gray-600" />
              </ButtonGlobal>
              <ButtonGlobal
                variant="ghost"
                size="sm"
                onClick={() => onDelete(category.id, "category")}
                className="hover:bg-red-50 h-8 w-8"
              >
                <Trash2 className="h-3.5 w-3.5 text-red-600" />
              </ButtonGlobal>
            </>
          )}
          renderSubItem={(sub, parent, isEven) => (
            <TableRow
              key={sub.id}
              className={`transition-colors border-b ${isEven
                  ? 'bg-gray-100 hover:bg-gray-200'
                  : 'bg-gray-50 hover:bg-gray-100'
                }`}
            >
              <TableCell></TableCell>
              <TableCell className="w-[10%]"></TableCell>
              <TableCell className="pl-12 w-[18%]">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-400">└─</span>
                  <span className="text-gray-700">{sub.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-sm text-gray-500 font-mono w-[16%]">
                {sub.slug}
              </TableCell>
              <TableCell className="text-sm text-gray-600 w-[28%]">
                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-medium border border-emerald-200">
                  Subcategoría
                </span>
              </TableCell>
              <TableCell className="text-center w-[10%]">
                <div className="flex justify-center">
                  <span className={`inline-flex items-center text-xs font-medium px-2 py-1 rounded ${sub.isActive
                      ? "text-green-700 bg-green-50"
                      : "text-gray-600 bg-gray-100"
                    }`}>
                    {sub.isActive ? "✓ Activo" : "Inactivo"}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-right w-[18%]">
                <div className="flex justify-end gap-1">
                  <ButtonGlobal variant="ghost" size="sm" className="hover:bg-gray-100 h-8 w-8" onClick={() => navigate(`/categories/${parent.id}/subcategories/${sub.id}/edit`)}>
                    <Edit className="h-3.5 w-3.5 text-gray-600" />
                  </ButtonGlobal>
                  <ButtonGlobal
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(sub.id, "subcategory")}
                    className="hover:bg-red-50 h-8 w-8"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-red-600" />
                  </ButtonGlobal>
                </div>
              </TableCell>
            </TableRow>
          )}
          renderEmptySubItems={(category) => (
            <EmptyStateGlobal
              icon={<Plus className="w-5 h-5 text-gray-400" />}
              message="No hay subcategorías"
              actionLabel="Crear subcategoría"
              onAction={() => onCreateSubcategory(category.id)}
              actionIcon={<Plus className="h-3 w-3" />}
            />
          )}
        />
      </div>

      {/* ── Mobile card list ─────────────────────────────────── */}
      <div className="sm:hidden space-y-3">
        {categories.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-12 text-slate-400">
            <Layers className="w-10 h-10 opacity-40" />
            <p className="text-sm font-medium">No hay categorías registradas</p>
          </div>
        ) : (
          categories.map((category) => {
            const subs = subcategories[category.id] ?? [];
            const isExpanded = expandedCards.has(category.id);
            return (
              <div key={category.id} className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="p-4 space-y-3">
                  {/* Header: name + status */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900">{category.name}</p>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">{category.slug}</p>
                    </div>
                    <span className={cn(
                      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium shrink-0',
                      category.isActive
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    )}>
                      <span className={cn('w-1.5 h-1.5 rounded-full', category.isActive ? 'bg-emerald-500' : 'bg-slate-400')} />
                      {category.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>

                  {/* Description */}
                  {category.description && (
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                      {category.description}
                    </p>
                  )}

                  {/* Order + subcategory count */}
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      Orden:
                      <span className="font-semibold text-slate-700">{category.order ?? '—'}</span>
                    </span>
                    {subs.length > 0 && (
                      <button
                        onClick={() => toggleCard(category.id)}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium transition-colors"
                      >
                        {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                        {subs.length} subcategor{subs.length === 1 ? 'ía' : 'ías'}
                      </button>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                    <ButtonGlobal
                      variant="ghost"
                      size="sm"
                      onClick={() => onCreateSubcategory(category.id)}
                      icon={<Plus className="h-3.5 w-3.5" />}
                      iconPosition="left"
                      className="hover:bg-slate-100 text-slate-700 text-xs h-8 px-2"
                    >
                      Subcategoría
                    </ButtonGlobal>
                    <div className="flex gap-1">
                      <ButtonGlobal
                        variant="ghost"
                        size="sm"
                        className="hover:bg-slate-100 h-8 w-8"
                        onClick={() => navigate(`/categories/${category.id}/edit`)}
                      >
                        <Edit className="h-3.5 w-3.5 text-slate-600" />
                      </ButtonGlobal>
                      <ButtonGlobal
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(category.id, "category")}
                        className="hover:bg-red-50 h-8 w-8"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-red-600" />
                      </ButtonGlobal>
                    </div>
                  </div>
                </div>

                {/* Subcategories expandable section */}
                {isExpanded && subs.length > 0 && (
                  <div className="border-t border-slate-200 bg-slate-50 px-4 py-3 space-y-2">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Subcategorías ({subs.length})
                    </p>
                    {subs.map((sub) => (
                      <div
                        key={sub.id}
                        className="rounded-lg border border-slate-200 bg-white p-3 space-y-2"
                      >
                        {/* Sub header */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-slate-800 break-words">{sub.name}</p>
                            <p className="text-xs text-slate-400 font-mono mt-0.5 break-all">{sub.slug}</p>
                          </div>
                          <span className={cn(
                            'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium shrink-0',
                            sub.isActive
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-500 border border-slate-200'
                          )}>
                            <span className={cn('w-1 h-1 rounded-full', sub.isActive ? 'bg-emerald-500' : 'bg-slate-400')} />
                            {sub.isActive ? 'Activo' : 'Inactivo'}
                          </span>
                        </div>
                        {/* Sub actions */}
                        <div className="flex items-center justify-end gap-1 pt-1 border-t border-slate-100">
                          <ButtonGlobal
                            variant="ghost"
                            size="sm"
                            className="hover:bg-slate-100 h-7 w-7"
                            onClick={() => navigate(`/categories/${category.id}/subcategories/${sub.id}/edit`)}
                          >
                            <Edit className="h-3.5 w-3.5 text-slate-600" />
                          </ButtonGlobal>
                          <ButtonGlobal
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(sub.id, "subcategory")}
                            className="hover:bg-red-50 h-7 w-7"
                          >
                            <Trash2 className="h-3.5 w-3.5 text-red-600" />
                          </ButtonGlobal>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </>
  );
}

