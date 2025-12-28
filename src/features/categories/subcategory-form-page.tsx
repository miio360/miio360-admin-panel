import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/shared/components/ui/form";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import { useAuth } from "@/shared/hooks/useAuth";
import { subcategoryService } from "@/shared/services/subcategoryService";
import { categoryService } from "@/shared/services/categoryService";
import type { Category, FeatureDefinition } from "@/shared/types";
import { FeatureDefinitionEditor } from "./components/feature-definition-editor";
import { SubcategoryBasicFields } from "./components/subcategory-basic-fields";

const subcategoryFormSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  description: z.string().min(1, "La descripción es obligatoria"),
  icon: z.string().min(1, "El icono es obligatorio"),
  isActive: z.boolean(),
  order: z.number().int().min(0),
  categoryId: z.string().min(1, "La categoría es obligatoria"),
});

type SubcategoryFormData = z.infer<typeof subcategoryFormSchema>;


export function SubcategoryFormPage() {
  const { id, categoryId } = useParams<{ id?: string; categoryId?: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditing = Boolean(id);

  const [categories, setCategories] = useState<Category[]>([]);
  const [featureDefinitions, setFeatureDefinitions] = useState<FeatureDefinition[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(!isEditing); // Si no es edición, el form está listo de entrada

  const form = useForm<SubcategoryFormData>({
    resolver: zodResolver(subcategoryFormSchema),
    defaultValues: {
      name: "",
      description: "",
      icon: "",
      isActive: true,
      order: 0, // Se ajustará dinámicamente
      categoryId: categoryId || "",
    },
  });

  const { isSubmitting } = form.formState;

  // Cargar categorías y setear categoryId automáticamente si viene en la URL
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoryService.getAll();
        setCategories(data);
        // Si viene categoryId en la URL y no estamos editando, setearlo automáticamente en el form
        if (categoryId && !isEditing) {
          form.setValue("categoryId", categoryId);
        }
      } catch (error) {
        console.error('Error cargando categorías:', error);
      }
    };

    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId, isEditing]);


  // Cargar subcategoría si es edición o calcular order si es nuevo
  useEffect(() => {
    const fetchData = async () => {
      if (isEditing && id && categoryId) {
        setIsLoading(true);
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
          } else {
            navigate("/categories");
          }
        } catch (error) {
          navigate("/categories");
        } finally {
          setIsLoading(false);
        }
      } else if (!isEditing && categoryId) {
        // Calcular el siguiente order disponible
        setIsLoading(true);
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
          setIsLoading(false);
        }
      } else {
        setIsReady(true);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, categoryId]);


  const onSubmit = async (data: SubcategoryFormData) => {
    if (!user) {
      alert("Debes estar autenticado para realizar esta acción");
      return;
    }
    try {
      const selectedCategory = categories.find((cat) => cat.id === data.categoryId);
      if (!selectedCategory) {
        alert("Categoría no encontrada");
        return;
      }
      const slug = subcategoryService.generateSlug(data.name);
      // Solo enviar los campos requeridos por Firestore (sin categoryId ni categoryName)
      const subcategoryData = {
        name: data.name,
        slug,
        description: data.description,
        icon: data.icon,
        isActive: data.isActive,
        order: typeof data.order === 'number' && !isNaN(data.order) ? data.order : 0,
        featureDefinitions,
        createdBy: user.id,
      };
      if (isEditing && id && data.categoryId) {
        await subcategoryService.update(data.categoryId, id, subcategoryData);
        alert("Subcategoría actualizada exitosamente");
      } else {
        const newId = await subcategoryService.create(data.categoryId, subcategoryData);
        alert("Subcategoría creada exitosamente");
      }
      navigate("/categories");
    } catch (error) {
      alert("Error al guardar la subcategoría. Por favor intenta de nuevo.");
    }
  };

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <span className="text-lg text-muted-foreground">Cargando subcategoría...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 py-10 max-w-3xl mx-auto flex flex-col gap-8">
        {/* Botón Volver en esquina superior izquierda */}
        <div className="mb-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/categories")}
            className="hover:bg-muted text-foreground font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Categorías
          </Button>
        </div>

        {/* Header sin ícono */}
        <div className="mb-8 bg-card border border-border rounded-lg p-8 shadow-sm flex flex-col gap-2">
          <h1 className="text-4xl font-bold text-foreground">
            {isEditing ? "Editar Subcategoría" : "Nueva Subcategoría"}
          </h1>
          <p className="text-base text-foreground/70 mt-2">
            {isEditing
              ? "Modifica los campos necesarios y guarda los cambios"
              : "Completa la información para crear una nueva subcategoría"}
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(
              (data) => {
                onSubmit(data);
              },
              (errors) => {
                console.error('[DEBUG] Errores de validación:', errors);
              }
            )}
            className="flex flex-col gap-8"
          >
            {/* Basic Info Card */}
            <Card className="bg-card shadow-sm border border-border overflow-hidden">
              <div className="bg-primary/5 px-6 py-4 border-b border-border flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-foreground font-bold">1</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">Información Básica</h3>
                  <p className="text-xs text-muted-foreground">Datos principales de la subcategoría</p>
                </div>
              </div>
              <div className="p-0 md:p-6">
                <SubcategoryBasicFields form={form} categories={categories} loading={isSubmitting} />
              </div>
            </Card>

            {/* Definición de Características */}
            <Card className="bg-card shadow-sm border border-border overflow-hidden mt-8">
              <div className="bg-secondary/5 px-6 py-4 border-b border-border flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                  <span className="text-secondary-foreground font-bold">2</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">Definición de Características</h3>
                  <p className="text-xs text-muted-foreground">Define los campos que tendrán los productos de esta subcategoría</p>
                </div>
              </div>
              <div className="p-0 md:p-6">
                <FeatureDefinitionEditor
                  featureDefinitions={featureDefinitions}
                  onChange={setFeatureDefinitions}
                  inputClassName="h-11 border border-secondary/40 focus-visible:border-secondary focus-visible:ring-0 bg-secondary/5 focus:bg-background transition-all px-3 text-base text-foreground"
                />
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/categories")}
                disabled={isSubmitting}
                className="flex-1 h-12 border-2 border-border hover:bg-muted text-foreground font-semibold"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 h-12 bg-primary hover:bg-primary/90 text-foreground font-bold shadow-md hover:shadow-lg transition-all"
                onClick={() => { console.log('[DEBUG] Click en botón submit'); }}
              >
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting
                  ? "Guardando..."
                  : isEditing
                  ? "Guardar Cambios"
                  : "Crear Subcategoría"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
