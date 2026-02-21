import { useParams, useNavigate } from "react-router-dom";
import { Form } from "@/shared/components/ui/form";
import { ButtonGlobal } from "@/shared/components/button-global";
import { Card } from "@/shared/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { CategoryBasicFields } from "../components/category-basic-fields";
import { CategoryAppearanceFields } from "../components/category-appearance-fields";
import { useCategoryForm } from "../hooks/useCategoryForm";
import { FormActionsGlobal } from "@/shared/components/form-actions-global";

export function CategoryFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { form, onSubmit, isEditing, isSubmitting } = useCategoryForm(id);

  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 py-6 sm:px-6 sm:py-8 max-w-7xl mx-auto">
        <div className="mb-6">
          <ButtonGlobal
            variant="ghost"
            onClick={() => navigate("/categories")}
            icon={<ArrowLeft className="w-4 h-4" />}
            iconPosition="left"
          >
            Volver a Categorías
          </ButtonGlobal>
        </div>

        <div className="mb-6 sm:mb-8 bg-card border border-border rounded-lg p-4 sm:p-6 shadow-sm">
          <h1 className="text-2xl sm:text-4xl font-bold text-foreground">
            {isEditing ? "Editar Categoría" : "Nueva Categoría"}
          </h1>
          <p className="text-sm sm:text-base text-foreground/70 mt-2">
            {isEditing
              ? "Modifica los campos necesarios y guarda los cambios"
              : "Completa la información para crear una nueva categoría"}
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-6">
            <Card className="bg-card shadow-sm border border-border overflow-hidden">
              <div className="bg-primary/5 px-4 py-3 sm:px-6 sm:py-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
                    <span className="text-foreground font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-foreground">Información Básica</h3>
                    <p className="text-xs text-muted-foreground">Datos principales de la categoría</p>
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <CategoryBasicFields form={form} loading={isSubmitting} />
              </div>
            </Card>

            <Card className="bg-card shadow-sm border border-border overflow-hidden">
              <div className="bg-secondary/5 px-4 py-3 sm:px-6 sm:py-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                    <span className="text-secondary-foreground font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-foreground">Apariencia y Configuración</h3>
                    <p className="text-xs text-muted-foreground">Personaliza la visualización de la categoría</p>
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <CategoryAppearanceFields form={form} loading={isSubmitting} />
              </div>
            </Card>

            <FormActionsGlobal
              onCancel={() => navigate("/categories")}
              isSubmitting={isSubmitting}
              isEditing={isEditing}
              submitText={{
                creating: "Crear Categoría",
                editing: "Guardar Cambios",
              }}
            />
          </form>
        </Form>
      </div>
    </div>
  );
}
