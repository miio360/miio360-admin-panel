import { Link } from "react-router-dom";
import { Category, Subcategory } from "@/shared/types";
import { TableExpandableGlobal, TableExpandableColumn } from "@/shared/components/table-expandable-global";
import { TableRow, TableCell } from "@/shared/components/ui/table";
import { ButtonGlobal } from "@/shared/components/button-global";
import { Edit, Trash2, Plus } from "lucide-react";
import { EmptyStateGlobal } from "@/shared/components/empty-state-global";

interface CategoryTableExpandableProps {
  categories: Category[];
  subcategories: Record<string, Subcategory[]>;
  onDelete: (id: string, type: "category" | "subcategory") => void;
  onCreateSubcategory: (categoryId: string) => void;
}

const columns: TableExpandableColumn<Category>[] = [
  {
    key: 'name',
    header: 'Nombre',
    width: 'w-[20%]',
    render: (category) => (
      <div className="flex items-center gap-2">
        <span className="font-semibold text-gray-900">{category.name}</span>
      </div>
    ),
  },
  {
    key: 'slug',
    header: 'Slug',
    width: 'w-[18%]',
    className: 'text-sm text-gray-500 font-mono',
  },
  {
    key: 'description',
    header: 'Descripción',
    width: 'w-[32%]',
    render: (category) => (
      <div className="truncate text-sm text-gray-600">
        {category.description || <span className="italic text-gray-400">Sin descripción</span>}
      </div>
    ),
  },
  {
    key: 'isActive',
    header: 'Estado',
    width: 'w-[12%]',
    align: 'center',
    render: (category) => (
      <div className="flex justify-center">
        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded ${
          category.isActive 
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
}: CategoryTableExpandableProps) {
  return (
    <TableExpandableGlobal<Category, Subcategory>
      data={categories}
      columns={columns}
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
          <ButtonGlobal variant="ghost" size="iconSm" asChild className="hover:bg-gray-100 h-8 w-8">
            <Link to={`/categories/${category.id}/edit`}>
              <Edit className="h-3.5 w-3.5 text-gray-600" />
            </Link>
          </ButtonGlobal>
          <ButtonGlobal
            variant="ghost"
            size="iconSm"
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
          className={`transition-colors border-b ${
            isEven
              ? 'bg-gray-100 hover:bg-gray-200'
              : 'bg-gray-50 hover:bg-gray-100'
          }`}
        >
          <TableCell></TableCell>
          <TableCell className="pl-12 w-[20%]">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-400">└─</span>
              <span className="text-gray-700">{sub.name}</span>
            </div>
          </TableCell>
          <TableCell className="text-sm text-gray-500 font-mono w-[18%]">
            {sub.slug}
          </TableCell>
          <TableCell className="text-sm text-gray-600 w-[32%]">
            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-medium border border-emerald-200">
              Subcategoría
            </span>
          </TableCell>
          <TableCell className="text-center w-[12%]">
            <div className="flex justify-center">
              <span className={`inline-flex items-center text-xs font-medium px-2 py-1 rounded ${
                sub.isActive 
                  ? "text-green-700 bg-green-50" 
                  : "text-gray-600 bg-gray-100"
              }`}>
                {sub.isActive ? "✓ Activo" : "Inactivo"}
              </span>
            </div>
          </TableCell>
          <TableCell className="text-right w-[18%]">
            <div className="flex justify-end gap-1">
              <ButtonGlobal variant="ghost" size="iconSm" asChild className="hover:bg-gray-100 h-8 w-8">
                <Link to={`/categories/${parent.id}/subcategories/${sub.id}/edit`}>
                  <Edit className="h-3.5 w-3.5 text-gray-600" />
                </Link>
              </ButtonGlobal>
              <ButtonGlobal
                variant="ghost"
                size="iconSm"
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
  );
}

