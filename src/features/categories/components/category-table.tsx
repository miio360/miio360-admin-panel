import { Link } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { TableBody, TableCell, TableRow } from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import { Edit2, Trash2, Tag, Package } from "lucide-react";
import { Category } from "@/shared/types";

interface CategoryTableProps {
  categories: Category[];
  onDelete: (id: string, name: string) => void;
}

export function CategoryTable({ categories, onDelete }: CategoryTableProps) {
  if (categories.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={5} className="h-48 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <Package className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground font-medium">No hay categorías registradas</p>
              <Button asChild variant="link" size="sm">
                <Link to="/categories/new">Crear primera categoría</Link>
              </Button>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <TableBody>
      {categories.map((category) => (
        <TableRow
          key={category.id}
          className="border-b border-gray-100 last:border-0 hover:bg-blue-90/30 transition-colors"
        >
          <TableCell className="py-4 px-6">
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
                <span className="text-xs text-gray-500 mt-0.5 block">
                  {category.slug}
                </span>
              </div>
            </div>
          </TableCell>
          <TableCell className="text-sm text-gray-600 max-w-xs truncate px-6">
            {category.description || <span className="text-gray-400">-</span>}
          </TableCell>
          <TableCell className="px-6">
            <Badge
              className={`${
                category.isActive
                  ? "bg-green-100 text-green-700 border-0 font-medium"
                  : "bg-gray-100 text-gray-600 border-0 font-medium"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                  category.isActive ? "bg-green-500" : "bg-gray-400"
                }`}
              ></span>
              {category.isActive ? "Activo" : "Inactivo"}
            </Badge>
          </TableCell>
          <TableCell className="text-sm text-gray-600 px-6">
            {category.createdAt.toDate().toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </TableCell>
          <TableCell className="text-right px-6">
            <div className="flex justify-end gap-2">
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="h-9 w-9 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
              >
                <Link to={`/categories/edit/${category.id}`} title="Editar">
                  <Edit2 className="w-4 h-4" />
                </Link>
              </Button>
              <Button
                onClick={() => onDelete(category.id, category.name)}
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                title="Eliminar"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}
