import { UseFormReturn } from 'react-hook-form';
import { InputGlobal } from '@/shared/components/input-global';
import { Textarea } from '@/shared/components/ui/textarea';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import type { Category } from '@/shared/types';
import { TextareaGlobal } from '@/shared/components/textarea-global';

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

      <TextareaGlobal
        control={form.control}
        name="description"
        label="Descripción"
        placeholder="Describe brevemente esta subcategoría y qué tipo de productos incluye..."
        description="Texto descriptivo opcional"
        disabled={loading}
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
              <InputGlobal
                type="checkbox"
                checked={field.value}
                onChange={field.onChange}
                disabled={loading}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}
