import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/shared/components/ui/form";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import { useAuth } from "@/shared/hooks/useAuth";
import { categoryService } from "@/shared/services/categoryService";
import { CategoryBasicFields } from "./components/category-basic-fields";
import { CategoryAppearanceFields } from "./components/category-appearance-fields";

const categoryFormSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  slug: z.string().min(3, "El slug debe tener al menos 3 caracteres"),
  description: z.string().min(1, "La descripción es obligatoria"),
  icon: z.string().min(1, "El icono es obligatorio"),
  isActive: z.boolean(),
  order: z.number().int().min(0),
});

export type CategoryFormData = z.infer<typeof categoryFormSchema>;

export function CategoryFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      icon: "",
      isActive: true,
      order: 0,
    },
  });

  const isEditing = Boolean(id);
  const { isSubmitting } = form.formState;

  useEffect(() => {
    if (id) {
      loadCategory(id);
    }
  }, [id]);

  const loadCategory = async (categoryId: string) => {
    try {
      const category = await categoryService.getById(categoryId);
      if (category) {
        form.reset({
          name: category.name,
          slug: category.slug,
          description: category.description,
          icon: category.icon,
          isActive: category.isActive,
          order: category.order,
        });
      }
    } catch (error) {
      console.error("Error al cargar la categoría:", error);
      alert("Error al cargar los datos de la categoría");
    }
  };

  const onSubmit = async (data: CategoryFormData) => {
    if (!user) {
      alert("Debes estar autenticado para realizar esta acción");
      return;
    }

    try {
      if (isEditing && id) {
        await categoryService.update(id, {
          ...data,
        });
        alert("Categoría actualizada exitosamente");
      } else {
        await categoryService.create({
          ...data,
          createdBy: user.id,
        });
        alert("Categoría creada exitosamente");
      }
      navigate("/categories");
    } catch (error) {
      console.error("Error al guardar la categoría:", error);
      alert("Error al guardar la categoría. Por favor intenta de nuevo.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="px-6 py-8 max-w-7xl mx-auto">
        {/* Botón Volver en esquina superior izquierda */}
        <div className="mb-6">
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
        <div className="mb-8 bg-card border border-border rounded-lg p-6 shadow-sm">
          <h1 className="text-4xl font-bold text-foreground">
            {isEditing ? "Editar Categoría" : "Nueva Categoría"}
          </h1>
          <p className="text-base text-foreground/70 mt-2">
            {isEditing
              ? "Modifica los campos necesarios y guarda los cambios"
              : "Completa la información para crear una nueva categoría"}
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Info Card */}
            <Card className="bg-card shadow-sm border border-border overflow-hidden">
              <div className="bg-primary/5 px-6 py-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                    <span className="text-foreground font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">Información Básica</h3>
                    <p className="text-xs text-muted-foreground">Datos principales de la categoría</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <CategoryBasicFields form={form} loading={isSubmitting} />
              </div>
            </Card>

            {/* Appearance Card */}
            <Card className="bg-card shadow-sm border border-border overflow-hidden">
              <div className="bg-secondary/5 px-6 py-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                    <span className="text-secondary-foreground font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">Apariencia y Configuración</h3>
                    <p className="text-xs text-muted-foreground">Personaliza la visualización de la categoría</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <CategoryAppearanceFields form={form} loading={isSubmitting} />
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
              >
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting
                  ? "Guardando..."
                  : isEditing
                    ? "Guardar Cambios"
                    : "Crear Categoría"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
