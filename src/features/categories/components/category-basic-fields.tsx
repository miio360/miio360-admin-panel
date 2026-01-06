import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { categoryService } from "@/shared/services/categoryService";
import { CategoryFormData } from "../hooks/useCategoryForm";
import { InputGlobal } from "@/shared/components/input-global";

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

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-foreground">Descripción</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe brevemente esta categoría y qué tipo de productos o servicios incluye..."
                disabled={loading}
                rows={3}
                className="resize-none text-sm border border-secondary/40 focus-visible:border-secondary focus-visible:ring-0 bg-secondary/5 focus:bg-background transition-all"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
