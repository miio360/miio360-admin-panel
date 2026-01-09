import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { categoryService } from "@/shared/services/categoryService";
import { CategoryFormData } from "../hooks/useCategoryForm";
import { InputGlobal } from "@/shared/components/input-global";
import { TextareaGlobal } from "@/shared/components/textarea-global";

interface CategoryBasicFieldsProps {
  form: UseFormReturn<CategoryFormData>;
  loading: boolean;
}

export function CategoryBasicFields({ form, loading }: CategoryBasicFieldsProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-foreground">
              Nombre de la Categoría *
            </FormLabel>
            <FormControl>
              <InputGlobal
                placeholder="Ej: Electrónica, Hogar, Deportes..."
                disabled={loading}
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  form.setValue("slug", categoryService.generateSlug(e.target.value));
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="slug"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-foreground">Slug (URL amigable)</FormLabel>
            <FormControl>
              <InputGlobal
                placeholder="electronica-y-tecnologia"
                disabled={loading}
                {...field}
              />
            </FormControl>
            <FormDescription>Se genera automáticamente del nombre</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <TextareaGlobal
        control={form.control}
        name="description"
        label="Descripción"
        placeholder="Describe brevemente esta categoría y qué tipo de productos o servicios incluye..."
        description="Texto descriptivo opcional"
        disabled={loading}
      />
    </div>
  );
}
