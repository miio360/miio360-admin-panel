import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { categoryService } from "../../shared/services/categoryService";
import { Category } from "../../shared/types";

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

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gestión de Categorías</h1>
        <Link
          to="/categories/new"
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors"
        >
          Nueva Categoría
        </Link>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive border border-destructive/20 rounded-md p-3 mb-6 text-sm">
          {error}
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-card border rounded-lg p-4 mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Buscar categorías..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1 px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={handleSearch}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors"
          >
            Buscar
          </button>
          <button
            onClick={loadCategories}
            className="bg-secondary text-secondary-foreground px-6 py-2 rounded-md font-medium hover:bg-secondary/90 transition-colors"
          >
            Limpiar
          </button>
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-card border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium">Nombre</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Descripción</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Estado</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Fecha Creación</th>
              <th className="px-6 py-3 text-right text-sm font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {categories.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                  No hay categorías registradas
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr key={category.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 font-medium">{category.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {category.description || "-"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        category.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {category.status === "active" ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {category.createdAt.toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/categories/edit/${category.id}`}
                        className="text-primary hover:underline text-sm font-medium"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(category.id, category.name)}
                        className="text-destructive hover:underline text-sm font-medium"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
