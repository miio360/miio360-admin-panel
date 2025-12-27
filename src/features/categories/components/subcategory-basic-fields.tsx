import { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Switch } from '@/shared/components/ui/switch';
import type { Category } from '@/shared/types';

interface SubcategoryBasicFieldsProps {
  form: UseFormReturn<any>;
  categories: Category[];
  isLoading: boolean;
}

export function SubcategoryBasicFields({
  form,
  categories,
  isLoading,
}: SubcategoryBasicFieldsProps) {
    return (
        <div className="bg-card rounded-xl shadow p-6 border border-border mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg text-foreground">Categoría *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger className="bg-accent/30 border border-accent rounded-lg h-12 text-base">
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="icon"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg text-foreground">Icono</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ej: 📱"
                    {...field}
                    disabled={isLoading}
                    className="bg-accent/30 border border-accent rounded-lg h-12 text-base"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg text-foreground">Nombre *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ej: iPhone"
                    {...field}
                    disabled={isLoading}
                    className="bg-accent/30 border border-accent rounded-lg h-12 text-base"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="order"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg text-foreground">Orden</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    disabled={isLoading}
                    className="bg-accent/30 border border-accent rounded-lg h-12 text-base"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="mb-6">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg text-foreground">Descripción</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Descripción de la subcategoría..."
                    {...field}
                    disabled={isLoading}
                    className="bg-accent/30 border border-accent rounded-lg text-base min-h-[48px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="mb-6">
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-xl border border-accent bg-accent/20 p-4 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel className="text-base text-foreground">Activo</FormLabel>
                  <div className="text-sm text-muted-foreground">
                    La subcategoría estará visible para los usuarios
                  </div>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isLoading}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>
  );
}
