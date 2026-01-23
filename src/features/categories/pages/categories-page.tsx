import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ButtonGlobal } from "@/shared/components/button-global";
import { useModal } from "@/shared/hooks/useModal";
import { CardContent } from "@/shared/components/ui/card";
import { PageHeaderGlobal } from "@/shared/components/page-header-global";
import { SearchGlobal } from "@/shared/components/search-global";
import { PaginationGlobal } from "@/shared/components/pagination-global";
import { LoadingGlobal } from "@/shared/components/loading-global";
import { ErrorGlobal } from "@/shared/components/error-global";
import { Plus } from "lucide-react";
import { CategoryStats } from "../components/category-stats";
import { CategoryTableExpandable } from "../components/category-table-expandable";
import { useCategoriesWithSubcategories } from "../hooks/useCategoriesWithSubcategories";

export const CategoriesPage = () => {
  const navigate = useNavigate();
  const modal = useModal();
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
  };

  const handleDelete = async (id: string, type: "category" | "subcategory") => {
    const entityName = type === "category" ? "categoría" : "subcategoría";

    modal.showConfirm(
      `¿Estás seguro de eliminar esta ${entityName}?`,
      async () => {
        try {
          if (type === "category") {
            await import("@/shared/services/categoryService").then(m => m.categoryService.delete(id));
          } else {
            const categoryId = Object.keys(subcategories).find(catId =>
              subcategories[catId].some(sub => sub.id === id)
            );
            if (categoryId) {
              await import("@/shared/services/subcategoryService").then(m => m.subcategoryService.delete(categoryId, id));
            } else {
              modal.showError("No se pudo encontrar la categoría de la subcategoría");
              return;
            }
          }
          refetch();
          modal.showSuccess(`${entityName.charAt(0).toUpperCase() + entityName.slice(1)} eliminada exitosamente`);
        } catch (error) {
          console.error("Error deleting:", error);
          modal.showError("Error al eliminar");
        }
      },
      {
        title: "Confirmar eliminación",
        confirmText: "Eliminar",
        cancelText: "Cancelar"
      }
    );
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
    return <LoadingGlobal message="Cargando categorías..." />;
  }

  if (error) {
    return <ErrorGlobal message={error} onRetry={refetch} />;
  }

  return (
<div className="px-2 sm:px-2 py-1 sm:py-2 bg-background space-y-6 sm:space-y-8 max-w-[1600px] mx-auto">
      <PageHeaderGlobal
        title="Categorías"
        description="Gestiona las categorías y subcategorías del marketplace"
        action={
          <ButtonGlobal
            onClick={() => navigate("/categories/new")}
            className="bg-primary hover:bg-primary/90 text-foreground font-semibold shadow-sm hover:shadow-md transition-all duration-200 px-5 py-2.5 text-sm rounded-lg"
          >
            <Plus className="w-4 h-4" />
            Nueva Categoría
          </ButtonGlobal>
        }
      />

      <CategoryStats
        total={totalCategories}
        active={activeCategories}
        subcategories={totalSubcategories}
      />
      <div className="space-y-2">
        <SearchGlobal
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Buscar por nombre o slug"
        />
        <div className="space-y-1">
          <CardContent className="p-0">
            {paginatedCategories.length === 0 ? (
              <div className="text-center py-12 sm:py-20 px-4">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary/10 mb-3 sm:mb-4">
                  <Plus className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                </div>
                <p className="text-sm sm:text-base text-foreground/60 font-medium mb-1">No se encontraron categorías</p>
                <p className="text-xs sm:text-sm text-foreground/40 mb-4 sm:mb-5">Comienza creando tu primera categoría</p>
                <ButtonGlobal
                  onClick={() => navigate("/categories/new")}
                  className="bg-primary hover:bg-primary/90 text-foreground font-semibold"
                  size="sm"
                  icon={<Plus className="w-4 h-4" />}
                  iconPosition="left"
                >
                  Crear primera categoría
                </ButtonGlobal>
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
          <PaginationGlobal
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};
