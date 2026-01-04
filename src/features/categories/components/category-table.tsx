import { Link } from "react-router-dom";
import { ButtonGlobal } from "@/shared/components/button-global";
import { TableGlobal, TableGlobalColumn } from "@/shared/components/table-global";
import { CardGlobal, CardGlobalContent } from "@/shared/components/card-global";
import { Edit2, Trash2, Tag } from "lucide-react";
import { Category } from "@/shared/types";
import { Timestamp } from "firebase/firestore";

interface CategoryTableProps {
  categories: Category[];
  onDelete: (id: string, name: string) => void;
  loading?: boolean;
}

const columns: TableGlobalColumn<Category>[] = [
  {
    key: 'name',
    header: 'Categoría',
    width: 'w-[25%]',
    render: (category) => (
      <div className="flex items-center gap-3">
        {category.icon ? (
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-xl shadow-sm">
            {category.icon}
          </div>
        ) : (
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-sm">
            <Tag className="w-5 h-5 text-gray-600" />
          </div>
        )}
        <div className="min-w-0">
          <span className="text-sm font-semibold text-gray-900 block">
            {category.name}
          </span>
          <span className="text-xs text-gray-500 mt-0.5 block font-mono">
            {category.slug}
          </span>
        </div>
      </div>
    ),
  },
  {
    key: 'description',
    header: 'Descripción',
    width: 'w-[35%]',
    className: 'text-sm text-gray-600 truncate max-w-xs',
    render: (category) => category.description || <span className="text-gray-400 italic">Sin descripción</span>
  },
  {
    key: 'isActive',
    header: 'Estado',
    width: 'w-[15%]',
    align: 'center',
    render: (category) => (
      <div className="flex justify-center">
        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded ${
          category.isActive
            ? "text-green-700 bg-green-50"
            : "text-gray-600 bg-gray-100"
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${
            category.isActive ? "bg-green-500" : "bg-gray-400"
          }`}></span>
          {category.isActive ? "Activo" : "Inactivo"}
        </span>
      </div>
    ),
  },
  {
    key: 'createdAt',
    header: 'Creado',
    width: 'w-[15%]',
    className: 'text-sm text-gray-600',
    render: (category) => new Timestamp(category.createdAt.seconds, category.createdAt.nanoseconds)
      .toDate()
      .toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
  },
];

export function CategoryTable({ categories, onDelete, loading = false }: CategoryTableProps) {
  return (
    <CardGlobal>
      <CardGlobalContent className="p-0">
        <TableGlobal<Category>
          data={categories}
          columns={columns}
          loading={loading}
          emptyMessage="No hay categorías registradas"
          actions={(category) => (
            <>
              <ButtonGlobal
                asChild
                variant="ghost"
                size="iconSm"
                className="hover:bg-gray-100 h-8 w-8"
              >
                <Link to={`/categories/edit/${category.id}`}>
                  <Edit2 className="w-3.5 h-3.5 text-gray-600" />
                </Link>
              </ButtonGlobal>
              <ButtonGlobal
                variant="ghost"
                size="iconSm"
                onClick={() => onDelete(category.id, category.name)}
                className="hover:bg-red-50 h-8 w-8"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-600" />
              </ButtonGlobal>
            </>
          )}
        />
      </CardGlobalContent>
    </CardGlobal>
  );
}
