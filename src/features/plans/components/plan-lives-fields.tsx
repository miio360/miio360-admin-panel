import { Label } from '@/shared/components/ui/label';
import { InputGlobal } from '@/shared/components/input-global';
import { TextareaGlobal } from '@/shared/components/textarea-global';
import { Switch } from '@/shared/components/ui/switch';
import type { Control, UseFormRegister, FieldErrors } from 'react-hook-form';
import type { LivesPlanFormData } from '../types/plan';

interface PlanLivesFieldsProps {
  register: UseFormRegister<LivesPlanFormData>;
  control: Control<LivesPlanFormData>;
  errors: FieldErrors<LivesPlanFormData>;
  isActive: boolean;
  onActiveChange: (value: boolean) => void;
}

export function PlanLivesFields({
  register,
  control,
  errors,
  isActive,
  onActiveChange,
}: PlanLivesFieldsProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title" className="text-sm font-medium mb-1 block">
          Titulo del Plan
        </Label>
        <InputGlobal
          id="title"
          placeholder="Ej: Plan Lives Premium"
          error={!!errors.title}
          {...register('title', { required: 'El titulo es requerido' })}
        />
        {errors.title && (
          <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
        )}
      </div>

      <TextareaGlobal
        control={control}
        name="description"
        label="Descripcion"
        placeholder="Describe el plan de lives..."
        rows={3}
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price" className="text-sm font-medium mb-1 block">
            Precio (BOB)
          </Label>
          <InputGlobal
            id="price"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            error={!!errors.price}
            {...register('price', {
              required: 'El precio es requerido',
              valueAsNumber: true,
              min: { value: 0, message: 'El precio debe ser positivo' },
            })}
          />
          {errors.price && (
            <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>
          )}
        </div>

        <div className="flex items-center gap-3 pt-6">
          <Switch
            id="isActive"
            checked={isActive}
            onCheckedChange={onActiveChange}
          />
          <Label htmlFor="isActive" className="text-sm font-medium">
            Plan Activo
          </Label>
        </div>
      </div>

      <div>
        <Label
          htmlFor="livesDurationMinutes"
          className="text-sm font-medium mb-1 block"
        >
          Tiempo Total de Lives (minutos)
        </Label>
        <InputGlobal
          id="livesDurationMinutes"
          type="number"
          min="1"
          placeholder="Ej: 120"
          error={!!errors.livesDurationMinutes}
          {...register('livesDurationMinutes', {
            required: 'El tiempo es requerido',
            valueAsNumber: true,
            min: { value: 1, message: 'Minimo 1 minuto' },
          })}
        />
        {errors.livesDurationMinutes && (
          <p className="text-red-500 text-xs mt-1">
            {errors.livesDurationMinutes.message}
          </p>
        )}
        <p className="text-xs text-foreground/60 mt-1">
          Tiempo total disponible para transmisiones en vivo
        </p>
      </div>
    </div>
  );
}
