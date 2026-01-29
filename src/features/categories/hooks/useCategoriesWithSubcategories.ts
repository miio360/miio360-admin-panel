import { useEffect, useState } from "react";
import { Category, Subcategory } from "@/shared/types";
import { categoryService } from "@/shared/services/categoryService";
import { getDocs, collection } from "firebase/firestore";
import { db } from "@/shared/services/firebase";

interface UseCategoriesWithSubcategoriesResult {
  categories: Category[];
  subcategories: Record<string, Subcategory[]>;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useCategoriesWithSubcategories(): UseCategoriesWithSubcategoriesResult {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Record<string, Subcategory[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const fetchAll = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const cats = await categoryService.getAll();
        setCategories(cats);
        // Para cada categoría, obtener subcolección "subcategories"
        const subsByCat: Record<string, Subcategory[]> = {};
        for (const cat of cats) {
          const subSnap = await getDocs(collection(db, "categories", cat.id, "subcategories"));
          subsByCat[cat.id] = subSnap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Subcategory[];
        }
        setSubcategories(subsByCat);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error desconocido");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAll();
  }, [reload]);

  return {
    categories,
    subcategories,
    isLoading,
    error,
    refetch: () => setReload((r) => r + 1),
  };
}
