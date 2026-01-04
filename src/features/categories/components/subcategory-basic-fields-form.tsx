import { UseFormReturn } from 'react-hook-form';
import { InputGlobal } from '@/shared/components/ui/input-global';
import { SelectGlobal } from '@/shared/components/select-global';
import { Label } from '@/shared/components/ui/label';
import type { Category } from '@/shared/types';

interface SubcategoryBasicFieldsProps {
  form: UseFormReturn<any>;
  categories: Category[];
  loading: boolean;
}

export function SubcategoryBasicFields({ form, categories, loading }: SubcategoryBasicFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      <div className="space-y-2">
        <Label htmlFor="categoryId" className="text-sm font-medium text-foreground">
          Categoría <span className="text-red-500">*</span>
        </Label>
        <SelectGlobal
          id="categoryId"
          {...form.register('categoryId')}
          disabled={loading}
          className="h-11"
        >
          <option value="">Selecciona una categoría</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </SelectGlobal>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium text-foreground">
          Nombre <span className="text-red-500">*</span>
        </Label>
        <InputGlobal
          id="name"
          placeholder="Ej: Electrodomésticos"
          {...form.register('name')}
          disabled={loading}
          className="h-11"
        />
        {form.formState.errors.name && (
          <p className="text-xs text-red-500">{form.formState.errors.name.message as string}</p>
        )}
      </div>

      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="description" className="text-sm font-medium text-foreground">
          Descripción <span className="text-red-500">*</span>
        </Label>
        <InputGlobal
          id="description"
          placeholder="Describe la subcategoría..."
          {...form.register('description')}
          disabled={loading}
          className="h-11"
        />
        {form.formState.errors.description && (
          <p className="text-xs text-red-500">{form.formState.errors.description.message as string}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="icon" className="text-sm font-medium text-foreground">
          Icono <span className="text-red-500">*</span>
        </Label>
        <InputGlobal
          id="icon"
          placeholder="📱"
          {...form.register('icon')}
          disabled={loading}
          className="h-11"
        />
        {form.formState.errors.icon && (
          <p className="text-xs text-red-500">{form.formState.errors.icon.message as string}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="order" className="text-sm font-medium text-foreground">
          Orden
        </Label>
        <InputGlobal
          id="order"
          type="number"
          placeholder="0"
          {...form.register('order', { valueAsNumber: true })}
          disabled={loading}
          className="h-11"
        />
      </div>
    </div>
  );
}
