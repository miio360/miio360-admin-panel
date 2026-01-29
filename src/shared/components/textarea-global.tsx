import { Textarea } from './ui/textarea';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';

interface TextareaGlobalProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  description?: string;
  disabled?: boolean;
  rows?: number;
}

export function TextareaGlobal<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  description,
  disabled = false,
  rows = 3,
}: TextareaGlobalProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-sm font-medium text-foreground mb-1 block">{label}</FormLabel>
          <FormControl>
            <Textarea
              className="w-full h-11 border border-gray-400/40 focus-visible:border-gray-400 focus-visible:ring-0 bg-gray-500/5 focus:bg-background transition-all px-3 text-base text-foreground"
              placeholder={placeholder}
              disabled={disabled}
              rows={rows}
              {...field}
            />
          </FormControl>
          {description && (
            <FormDescription>{description}</FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
