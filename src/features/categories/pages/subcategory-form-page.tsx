import { useNavigate } from "react-router-dom";
import { Form } from "@/shared/components/ui/form";
import { ButtonGlobal } from "@/shared/components/button-global";
import { Card } from "@/shared/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/shared/hooks/useAuth";
import { useModal } from "@/shared/hooks/useModal";
import { useSubcategoryForm } from "../hooks/useSubcategoryForm";
import { subcategoryService } from "@/shared/services/subcategoryService";
import { FeatureDefinitionEditor } from "../components/feature-definition-editor";
import { SubcategoryBasicFields } from "../components/subcategory-basic-fields-form";
import { FormActionsGlobal } from "@/shared/components/form-actions-global";

export function SubcategoryFormPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const modal = useModal();
  const isEditing = window.location.pathname.includes('/edit');
  
  const {
    form,
    categories,
    featureDefinitions,
    setFeatureDefinitions,
    isReady,
  } = useSubcategoryForm(isEditing);

  const { isSubmitting } = form.formState;

  const onSubmit = async (data: any) => {
    if (!user) {
      modal.showError("Debes estar autenticado para realizar esta acción");
      return;
    }
    try {
      const selectedCategory = categories.find((cat) => cat.id === data.categoryId);
      if (!selectedCategory) {
        modal.showError("Categoría no encontrada");
        return;
      }
      const slug = subcategoryService.generateSlug(data.name);
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
      
      const pathParts = window.location.pathname.split('/');
      const id = pathParts[pathParts.length - 2];
      
      if (isEditing && id && data.categoryId) {
        await subcategoryService.update(data.categoryId, id, subcategoryData);
        modal.showSuccess("Subcategoría actualizada exitosamente");
      } else {
        await subcategoryService.create(data.categoryId, subcategoryData);
        modal.showSuccess("Subcategoría creada exitosamente");
      }
      navigate("/categories");
    } catch (error) {
      modal.showError("Error al guardar la subcategoría. Por favor intenta de nuevo.");
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
      <div className="px-6 py-8 max-w-7xl mx-auto flex flex-col gap-8">
        <div className="mb-4">
          <ButtonGlobal
            variant="ghost"
            onClick={() => navigate("/categories")}
            icon={<ArrowLeft className="w-4 h-4" />}
            iconPosition="left"
          >
            Volver a Categorías
          </ButtonGlobal>
        </div>

        <div className="mb-6 bg-card border border-border rounded-lg p-8 shadow-sm flex flex-col gap-2">
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8">
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
              <SubcategoryBasicFields form={form} categories={categories} loading={isSubmitting} />
            </Card>

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

            <FormActionsGlobal
              onCancel={() => navigate("/categories")}
              isSubmitting={isSubmitting}
              isEditing={isEditing}
              submitText={{
                creating: "Crear Subcategoría",
                editing: "Guardar Cambios",
              }}
            />
          </form>
        </Form>
      </div>
    </div>
  );
}
