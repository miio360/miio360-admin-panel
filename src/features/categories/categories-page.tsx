import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { Plus, AlertCircle, RefreshCw } from "lucide-react";
import { CategoryStats } from "./components/category-stats";
import { CategorySearchBar } from "./components/category-search-bar";
import { CategoryTableExpandable } from "./components/category-table-expandable";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/components/ui/pagination";
import { useCategoriesWithSubcategories } from "./hooks/useCategoriesWithSubcategories";

export const CategoriesPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const {
    categories,
    subcategories,
    isLoading,
    error,
    refetch,
  } = useCategoriesWithSubcategories();

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
    // Búsqueda solo en categorías (no subcategorías)
    // Si quieres búsqueda profunda, deberías filtrar también subcategorías
  };

  const handleDelete = async (id: string, type: "category" | "subcategory") => {
    if (!confirm(`¿Estás seguro de eliminar esta ${type === "category" ? "categoría" : "subcategoría"}?`)) {
      return;
    }
    try {
      if (type === "category") {
        await import("@/shared/services/categoryService").then(m => m.categoryService.delete(id));
      } else {
        // Buscar la categoría a la que pertenece la subcategoría
        const categoryId = Object.keys(subcategories).find(catId =>
          subcategories[catId].some(sub => sub.id === id)
        );
        if (categoryId) {
          await import("@/shared/services/subcategoryService").then(m => m.subcategoryService.delete(categoryId, id));
        } else {
          alert("No se pudo encontrar la categoría de la subcategoría");
        }
      }
      refetch();
    } catch (error) {
      console.error("Error deleting:", error);
      alert("Error al eliminar");
    }
  };

  const handleCreateSubcategory = (categoryId: string) => {
    navigate(`/categories/${categoryId}/subcategory/new`);
  };

  const filteredCategories = searchTerm
    ? categories.filter((cat) =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.slug.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : categories;

  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.ceil(filteredCategories.length / ITEMS_PER_PAGE);
  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalCategories = categories.length;
  const activeCategories = categories.filter((c) => c.isActive).length;
  const totalSubcategories = Object.values(subcategories).reduce((acc, arr) => acc + arr.length, 0);

  if (isLoading) {
    return (
      <div className="p-6 bg-white min-h-screen">
        <p className="text-center text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white min-h-screen">
        <div className="bg-red-50 text-red-600 p-6 rounded-lg flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium">Error al cargar los datos</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
          <Button 
            onClick={refetch} 
            variant="outline" 
            className="w-fit border-red-300 hover:bg-red-100"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 bg-white min-h-screen space-y-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-foreground bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">Categorías</h1>
          <p className="text-sm text-foreground/70 mt-2 font-medium">
            Gestiona las categorías y subcategorías del marketplace
          </p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90 text-foreground font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02] px-6 py-3 text-sm rounded-lg">
          <Link to="/categories/new" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Nueva Categoría
          </Link>
        </Button>
      </div>

      <CategoryStats
        total={totalCategories}
        active={activeCategories}
        subcategories={totalSubcategories}
      />

      <Card className="shadow-sm border border-gray-200 overflow-hidden rounded-lg bg-white">
        <CardHeader className="border-b border-gray-200 bg-white py-4 px-6">
          <CategorySearchBar searchTerm={searchTerm} onSearch={handleSearch} />
        </CardHeader>
        <CardContent className="p-0">
          {paginatedCategories.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Plus className="w-8 h-8 text-primary" />
              </div>
              <p className="text-foreground/70 font-medium">No se encontraron categorías</p>
              <Button asChild className="mt-4 bg-primary hover:bg-primary/90 text-foreground" size="sm">
                <Link to="/categories/new">
                  Crear primera categoría
                </Link>
              </Button>
            </div>
          ) : (
            <CategoryTableExpandable
              categories={paginatedCategories}
              subcategories={subcategories}
              onDelete={handleDelete}
              onCreateSubcategory={handleCreateSubcategory}
            />
          )}
        </CardContent>
        {totalPages > 1 && (
          <div className="p-4 border-t border-primary/10 bg-white flex justify-center">
            <Pagination>
              <PaginationContent className="gap-1">
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                    className={`h-9 px-3 text-sm ${currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-primary/10"}`}
                  />
                </PaginationItem>
                
                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  const isCurrentPage = pageNumber === currentPage;
                  
                  // Mostrar solo algunas páginas alrededor de la actual
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                  ) {
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          onClick={() => setCurrentPage(pageNumber)}
                          isActive={isCurrentPage}
                          className={`cursor-pointer h-9 w-9 text-sm ${
                            isCurrentPage 
                              ? "bg-primary text-foreground font-bold hover:bg-primary" 
                              : "hover:bg-gray-100 text-gray-700"
                          }`}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  } else if (
                    pageNumber === currentPage - 2 ||
                    pageNumber === currentPage + 2
                  ) {
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationEllipsis className="h-9 w-9" />
                      </PaginationItem>
                    );
                  }
                  return null;
                })}

                <PaginationItem>
                  <PaginationNext 
                    onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                    className={`h-9 px-3 text-sm ${currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-primary/10"}`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </Card>
    </div>
  );
};
