import { UseFormReturn } from 'react-hook-form';
import { InputGlobal } from '@/shared/components/ui/input-global';
import { TextareaGlobal } from '@/shared/components/textarea-global';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import type { Category } from '@/shared/types';

interface SubcategoryBasicFieldsProps {
  form: UseFormReturn<any>;
  categories: Category[];
  loading: boolean;
}

export function SubcategoryBasicFields({
  form,
  categories,
  loading,
}: SubcategoryBasicFieldsProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-foreground">
              Nombre de la Subcategoría *
            </FormLabel>
            <FormControl>
              <InputGlobal
                placeholder="Ej: iPhone, Laptops, Sillas..."
                disabled={loading}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="categoryId"
        render={({ field }) => (
          <FormItem className="flex flex-col gap-1">
            <FormLabel className="text-sm font-medium text-foreground">Categoría *</FormLabel>
            <FormControl>
              <select
                {...field}
                className="h-11 border border-secondary/40 focus-visible:border-secondary focus-visible:ring-0 bg-secondary/5 focus:bg-background transition-all rounded-md px-3 text-base text-foreground"
                disabled={loading}
              >
                <option value="">Selecciona una categoría</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

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
                {...field}
              />
            </FormControl>
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
              <TextareaGlobal
                placeholder="Describe brevemente esta subcategoría y qué tipo de productos incluye..."
                disabled={loading}
                rows={3}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="isActive"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border-2 border-primary/30 p-4 bg-primary/5">
            <div className="space-y-0.5">
              <FormLabel className="text-base text-foreground">Estado de la Subcategoría</FormLabel>
              <span className="text-xs text-muted-foreground">Activa la subcategoría para que sea visible en la aplicación</span>
            </div>
            <FormControl>
              <input
                type="checkbox"
                checked={field.value}
                onChange={field.onChange}
                className="h-5 w-5 text-primary border border-border rounded focus:ring-primary/40"
                disabled={loading}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}
