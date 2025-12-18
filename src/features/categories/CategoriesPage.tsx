import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { categoryService } from "../../shared/services/categoryService";
import { Category } from "../../shared/types";
import { Button } from "../../shared/components/ui/button";
import { Input } from "../../shared/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../shared/components/ui/table";
import { Badge } from "../../shared/components/ui/badge";
import { Plus, Search, RefreshCw, Edit2, Trash2, Tag, AlertCircle, Package } from "lucide-react";

export const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (err: any) {
      setError("Error al cargar las categorías");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadCategories();
      return;
    }

    try {
      setLoading(true);
      const data = await categoryService.search(searchTerm);
      setCategories(data);
    } catch (err: any) {
      setError("Error al buscar categorías");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`¿Estás seguro de eliminar la categoría "${name}"?`)) {
      return;
    }

    try {
      await categoryService.delete(id);
      setCategories(categories.filter((cat) => cat.id !== id));
    } catch (err: any) {
      setError("Error al eliminar la categoría");
      console.error(err);
    }
  };

  if (loading && categories.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando categorías...</p>
        </div>
      </div>
    );
  }

  const activeCategories = categories.filter(c => c.status === 'active').length;
  const inactiveCategories = categories.filter(c => c.status === 'inactive').length;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Categorías</h1>
          <p className="text-sm text-gray-500 mt-1">Administra y organiza las categorías del sistema</p>
        </div>
        <Button asChild className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
          <Link to="/categories/new">
            <Plus className="w-4 h-4" />
            Nueva Categoría
          </Link>
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow bg-white">
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide font-medium">Total Categorías</p>
                <p className="text-3xl font-bold text-gray-900">{categories.length}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                <Package className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-green-200 shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-green-50 to-white">
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide font-medium">Activas</p>
                <p className="text-3xl font-bold text-gray-900">{activeCategories}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-500 flex items-center justify-center shadow-sm">
                <Tag className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-orange-200 shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-orange-50 to-white">
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide font-medium">Inactivas</p>
                <p className="text-3xl font-bold text-gray-900">{inactiveCategories}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-orange-500 flex items-center justify-center shadow-sm">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {error && (
        <Card className="bg-destructive/10 border-destructive/30">
          <CardContent className="flex items-center gap-3 pt-6">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
            <p className="text-sm font-medium text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Search and Table Section */}
      <Card className="border border-gray-200 shadow-sm bg-white">
        <CardHeader className="border-b border-gray-200 bg-gray-50/50 px-6 py-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <Input
                type="text"
                placeholder="Buscar por nombre o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10 border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <Button 
              onClick={handleSearch} 
              variant="outline" 
              className="gap-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
            >
              <Search className="w-4 h-4" />
              Buscar
            </Button>
            <Button 
              onClick={loadCategories} 
              variant="outline" 
              className="gap-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
            >
              <RefreshCw className="w-4 h-4" />
              Limpiar
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-200 bg-gray-50/30 hover:bg-gray-50/30">
                  <TableHead className="text-xs font-semibold text-gray-600 uppercase tracking-wider py-3">Nombre</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-600 uppercase tracking-wider py-3">Descripción</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-600 uppercase tracking-wider py-3">Estado</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-600 uppercase tracking-wider py-3">Fecha Creación</TableHead>
                  <TableHead className="text-right text-xs font-semibold text-gray-600 uppercase tracking-wider py-3">Acciones</TableHead>
                </TableRow>
              </TableHeader>
            <TableBody>
              {categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-48 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                        <Package className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground font-medium">No hay categorías registradas</p>
                      <Button asChild variant="link" size="sm">
                        <Link to="/categories/new">
                          Crear primera categoría
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((category) => (
                  <TableRow key={category.id} className="border-b border-gray-100 last:border-0 hover:bg-blue-50/30 transition-colors">
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
                          <span className="text-sm font-semibold text-gray-900 block">{category.name}</span>
                          {category.tags && category.tags.length > 0 && (
                            <div className="flex gap-1 mt-1 flex-wrap">
                              {category.tags.slice(0, 3).map((tag, i) => (
                                <span key={i} className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                  {tag}
                                </span>
                              ))}
                              {(category.tags?.length ?? 0) > 3 && (
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">+{(category.tags?.length ?? 0) - 3}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600 max-w-xs truncate px-6">
                      {category.description || <span className="text-gray-400">-</span>}
                    </TableCell>
                    <TableCell className="px-6">
                      <Badge
                        className={`${
                          category.status === "active"
                            ? "bg-green-100 text-green-700 border-0 font-medium"
                            : "bg-gray-100 text-gray-600 border-0 font-medium"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${category.status === "active" ? "bg-green-500" : "bg-gray-400"}`}></span>
                        {category.status === "active" ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600 px-6">
                      {category.createdAt.toLocaleDateString('es-ES', { 
                        day: '2-digit', 
                        month: '2-digit', 
                        year: 'numeric' 
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
                          onClick={() => handleDelete(category.id, category.name)}
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
                ))
              )}
            </TableBody>
          </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
