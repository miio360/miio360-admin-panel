import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Category, FeatureDefinition } from "@/shared/types";
import { subcategoryService } from "@/shared/services/subcategoryService";
import { categoryService } from "@/shared/services/categoryService";

const subcategoryFormSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  description: z.string().min(1, "La descripción es obligatoria"),
  icon: z.string().min(1, "El icono es obligatorio"),
  isActive: z.boolean(),
  order: z.number().int().min(0),
  categoryId: z.string().min(1, "La categoría es obligatoria"),
});

type SubcategoryFormData = z.infer<typeof subcategoryFormSchema>;

export function useSubcategoryForm(isEditing: boolean) {
  const { id, categoryId } = useParams<{ id?: string; categoryId?: string }>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [featureDefinitions, setFeatureDefinitions] = useState<FeatureDefinition[]>([]);
  const [isReady, setIsReady] = useState(!isEditing);

  const form = useForm<SubcategoryFormData>({
    resolver: zodResolver(subcategoryFormSchema),
    defaultValues: {
      name: "",
      description: "",
      icon: "",
      isActive: true,
      order: 0,
      categoryId: categoryId || "",
    },
  });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoryService.getAll();
        setCategories(data);
        if (categoryId && !isEditing) {
          form.setValue("categoryId", categoryId);
        }
      } catch (error) {
        console.error('Error cargando categorías:', error);
      }
    };
    loadCategories();
  }, [categoryId, isEditing, form]);

  useEffect(() => {
    const fetchData = async () => {
      if (isEditing && id && categoryId) {
        try {
          const subcategory = await subcategoryService.getById(categoryId, id);
          if (subcategory) {
            form.reset({
              name: subcategory.name || "",
              description: subcategory.description || "",
              icon: subcategory.icon || "",
              isActive: subcategory.isActive ?? true,
              order: subcategory.order ?? 0,
              categoryId: categoryId,
            });
            setFeatureDefinitions(Array.isArray(subcategory.featureDefinitions) ? subcategory.featureDefinitions : []);
            setIsReady(true);
          }
        } catch (error) {
          console.error('Error cargando subcategoría:', error);
        }
      } else if (!isEditing && categoryId) {
        try {
          const subs = await subcategoryService.getByCategoryId(categoryId);
          const maxOrder = subs.reduce((max, s) => {
            const order = typeof s.order === 'number' ? s.order : -1;
            return order > max ? order : max;
          }, -1);
          form.setValue("order", maxOrder + 1);
        } catch (error) {
          form.setValue("order", 0);
        } finally {
          setIsReady(true);
        }
      } else {
        setIsReady(true);
      }
    };
    fetchData();
  }, [id, categoryId, isEditing, form]);

  return {
    form,
    categories,
    featureDefinitions,
    setFeatureDefinitions,
    isReady,
  };
}
