import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Category, Subcategory } from "@/shared/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { ChevronDown, ChevronRight, Edit, Trash2, Plus } from "lucide-react";

interface CategoryTableExpandableProps {
  categories: Category[];
  subcategories: Record<string, Subcategory[]>;
  onDelete: (id: string, type: "category" | "subcategory") => void;
  onCreateSubcategory: (categoryId: string) => void;
}

export function CategoryTableExpandable({
  categories,
  subcategories,
  onDelete,
  onCreateSubcategory,
}: CategoryTableExpandableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (categoryId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedRows(newExpanded);
  };

  return (
    <div className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 hover:bg-gray-50 border-y">
            <TableHead className="w-10"></TableHead>
            <TableHead className="font-semibold text-gray-600 text-xs uppercase w-[20%]">Nombre</TableHead>
            <TableHead className="font-semibold text-gray-600 text-xs uppercase w-[18%]">Slug</TableHead>
            <TableHead className="font-semibold text-gray-600 text-xs uppercase w-[32%]">Descripción</TableHead>
            <TableHead className="text-center font-semibold text-gray-600 text-xs uppercase w-[12%]">Estado</TableHead>
            <TableHead className="text-right font-semibold text-gray-600 text-xs uppercase w-[18%]">Acciones</TableHead>
          </TableRow>
        </TableHeader>
      <TableBody>
        {categories.map((category, index) => {
          const isExpanded = expandedRows.has(category.id);
          const categorySubs = subcategories[category.id] || [];
          const isEven = index % 2 === 0;

          return (
            <>
              <TableRow 
                key={category.id}
                className={`transition-colors border-b group ${
                  isEven 
                    ? 'bg-primary/5 hover:bg-primary/10' 
                    : 'bg-emerald-50 hover:bg-emerald-100'
                }`}
              >
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleRow(category.id)}
                    className="h-7 w-7 p-0 hover:bg-gray-200 rounded-md"
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-gray-600" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-600" />
                    )}
                  </Button>
                </TableCell>
                <TableCell className="font-semibold text-gray-900 w-[20%]">
                  <div className="flex items-center gap-2">
                    <span>{category.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-gray-500 font-mono w-[18%]">
                  {category.slug}
                </TableCell>
                <TableCell className="text-sm text-gray-600 w-[32%]">
                  <div className="truncate">
                    {category.description || <span className="italic text-gray-400">Sin descripción</span>}
                  </div>
                </TableCell>
                <TableCell className="text-center w-[12%]">
                  <div className="flex justify-center">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded ${
                      category.isActive 
                        ? "text-green-700 bg-green-50" 
                        : "text-gray-600 bg-gray-100"
                    }`}>
                      {category.isActive ? "✓ Activo" : "Inactivo"}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right w-[18%]">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onCreateSubcategory(category.id)}
                      className="hover:bg-gray-100 text-gray-700 text-xs h-8"
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      Subcategoría
                    </Button>
                    <Button variant="ghost" size="icon" asChild className="hover:bg-gray-100 h-8 w-8">
                      <Link to={`/categories/${category.id}/edit`}>
                        <Edit className="h-3.5 w-3.5 text-gray-600" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(category.id, "category")}
                      className="hover:bg-red-50 h-8 w-8"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>

              {isExpanded && categorySubs.length > 0 && (
                <React.Fragment key={category.id + "-subs"}>
                  {categorySubs.map((sub) => (
                    <TableRow 
                      key={sub.id} 
                      className={`transition-colors border-b ${
                        isEven
                          ? 'bg-primary/[0.08] hover:bg-primary/[0.12]'
                          : 'bg-emerald-100/70 hover:bg-emerald-100'
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
                          <Button variant="ghost" size="icon" asChild className="hover:bg-gray-100 h-8 w-8">
                            <Link to={`/subcategories/${sub.id}/edit`}>
                              <Edit className="h-3.5 w-3.5 text-gray-600" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDelete(sub.id, "subcategory")}
                            className="hover:bg-red-50 h-8 w-8"
                          >
                            <Trash2 className="h-3.5 w-3.5 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              )}

              {isExpanded && categorySubs.length === 0 && (
                <TableRow 
                  key={category.id + "-empty"}
                  className={`border-b ${
                    isEven 
                      ? 'bg-primary/[0.08]' 
                      : 'bg-emerald-100/70'
                  }`}
                >
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100">
                        <Plus className="w-5 h-5 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-500">No hay subcategorías</p>
                      <Button 
                        size="sm" 
                        onClick={() => onCreateSubcategory(category.id)}
                        className="bg-gray-900 hover:bg-gray-800 text-white text-xs mt-1"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Crear subcategoría
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </>
          );
        })}
      </TableBody>
    </Table>
    </div>
  );
}

