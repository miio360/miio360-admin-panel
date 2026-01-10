import { Input } from "@/shared/components/ui/input";
import { Switch } from "@/shared/components/ui/switch";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { CategoryFormData } from "../hooks/useCategoryForm";
import { InputGlobal } from "@/shared/components/input-global";

interface CategoryAppearanceFieldsProps {
  form: UseFormReturn<CategoryFormData>;
  loading: boolean;
}

export function CategoryAppearanceFields({ form, loading }: CategoryAppearanceFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-foreground">Icono *</FormLabel>
              <FormControl>
                <InputGlobal
                  placeholder="briefcase-outline"
                  disabled={loading}
                  className="h-11 border border-secondary/40 focus-visible:border-secondary focus-visible:ring-0 bg-secondary/5 focus:bg-background transition-all"
                  {...field}
                />
              </FormControl>
              <FormDescription>Nombre del icono de Ionicons</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

      </div>

      <FormField
        control={form.control}
        name="isActive"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border-2 border-primary/30 p-4 bg-primary/5">
            <div className="space-y-0.5">
              <FormLabel className="text-base text-foreground">Estado de la Categoría</FormLabel>
              <FormDescription>
                Activa la categoría para que sea visible en la aplicación
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={loading}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}
