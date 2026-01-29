import { Label } from '@/shared/components/ui/label';
import { InputGlobal } from '@/shared/components/input-global';
import { TextareaGlobal } from '@/shared/components/textarea-global';
import { Switch } from '@/shared/components/ui/switch';
import type { Control, UseFormRegister, FieldErrors } from 'react-hook-form';
import type { VideoPlanFormData } from '../types/plan';

interface PlanBaseFieldsProps {
  register: UseFormRegister<VideoPlanFormData>;
  control: Control<VideoPlanFormData>;
  errors: FieldErrors<VideoPlanFormData>;
  isActive: boolean;
  onActiveChange: (value: boolean) => void;
}

export function PlanVideoFields({
  register,
  control,
  errors,
  isActive,
  onActiveChange,
}: PlanBaseFieldsProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title" className="text-sm font-medium mb-1 block">
          Titulo del Plan
        </Label>
        <InputGlobal
          id="title"
          placeholder="Ej: Plan Basico Video"
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
        placeholder="Describe el plan de video..."
        rows={3}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

        <div className="flex items-center gap-3 sm:pt-6">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="videoCount" className="text-sm font-medium mb-1 block">
            Cantidad de Videos
          </Label>
          <InputGlobal
            id="videoCount"
            type="number"
            min="1"
            placeholder="Ej: 5"
            error={!!errors.videoCount}
            {...register('videoCount', {
              required: 'La cantidad es requerida',
              valueAsNumber: true,
              min: { value: 1, message: 'Minimo 1 video' },
            })}
          />
          {errors.videoCount && (
            <p className="text-red-500 text-xs mt-1">
              {errors.videoCount.message}
            </p>
          )}
        </div>

        <div>
          <Label
            htmlFor="videoDurationMinutes"
            className="text-sm font-medium mb-1 block"
          >
            Duracion por Video (minutos)
          </Label>
          <InputGlobal
            id="videoDurationMinutes"
            type="number"
            min="1"
            placeholder="Ej: 30"
            error={!!errors.videoDurationMinutes}
            {...register('videoDurationMinutes', {
              required: 'La duracion es requerida',
              valueAsNumber: true,
              min: { value: 1, message: 'Minimo 1 minuto' },
            })}
          />
          {errors.videoDurationMinutes && (
            <p className="text-red-500 text-xs mt-1">
              {errors.videoDurationMinutes.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
