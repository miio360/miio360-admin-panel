import { Label } from '@/shared/components/ui/label';
import { InputGlobal } from '@/shared/components/input-global';
import { TextareaGlobal } from '@/shared/components/textarea-global';
import { Switch } from '@/shared/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import type { Control, UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import type { VideoPlanFormData, VideoMode } from '../types/plan';
import { VIDEO_MODE_LABELS } from '../types/plan';

interface PlanVideoFieldsProps {
  register: UseFormRegister<VideoPlanFormData>;
  control: Control<VideoPlanFormData>;
  errors: FieldErrors<VideoPlanFormData>;
  isActive: boolean;
  onActiveChange: (value: boolean) => void;
  watch: UseFormWatch<VideoPlanFormData>;
  setValue: UseFormSetValue<VideoPlanFormData>;
}

/**
 * Formatea segundos a texto legible (ej: "1 min 30 seg", "2 min", "45 seg")
 */
function formatSecondsToReadable(seconds: number): string {
  if (!seconds || seconds <= 0) return '0 seg';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs} seg`;
  if (secs === 0) return `${mins} min`;
  return `${mins} min ${secs} seg`;
}

export function PlanVideoFields({
  register,
  control,
  errors,
  isActive,
  onActiveChange,
  watch,
  setValue,
}: PlanVideoFieldsProps) {
  const videoMode = watch('videoMode');
  const maxDurationPerVideoSeconds = watch('maxDurationPerVideoSeconds');
  const totalDurationSeconds = watch('totalDurationSeconds');

  const handleVideoModeChange = (value: string) => {
    setValue('videoMode', value as VideoMode);
  };

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

      {/* Selector de Tipo de Plan de Video */}
      <div>
        <Label className="text-sm font-medium mb-1 block">Tipo de Plan</Label>
        <Select value={videoMode} onValueChange={handleVideoModeChange}>
          <SelectTrigger className="w-full h-11 border border-secondary/40 focus:border-secondary bg-secondary/5">
            <SelectValue placeholder="Selecciona el tipo de plan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="video_count">{VIDEO_MODE_LABELS.video_count}</SelectItem>
            <SelectItem value="time_pool">{VIDEO_MODE_LABELS.time_pool}</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-foreground/60 mt-1">
          {videoMode === 'video_count'
            ? 'El vendedor tendra una cantidad fija de videos, cada uno con duracion maxima.'
            : 'El vendedor tendra un pool de tiempo total para distribuir en multiples videos.'}
        </p>
      </div>

      {/* Campos para Modalidad: Por cantidad de videos */}
      {videoMode === 'video_count' && (
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="text-sm font-medium text-foreground">Configuracion por cantidad de videos</h4>
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
                  valueAsNumber: true,
                  min: { value: 1, message: 'Minimo 1 video' },
                  validate: (value) => {
                    if (videoMode === 'video_count' && (!value || value < 1)) {
                      return 'La cantidad de videos es requerida';
                    }
                    return true;
                  },
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
                htmlFor="maxDurationPerVideoSeconds"
                className="text-sm font-medium mb-1 block"
              >
                Duracion maxima por video (segundos)
              </Label>
              <InputGlobal
                id="maxDurationPerVideoSeconds"
                type="number"
                min="1"
                placeholder="Ej: 1800 (30 min)"
                error={!!errors.maxDurationPerVideoSeconds}
                {...register('maxDurationPerVideoSeconds', {
                  valueAsNumber: true,
                  min: { value: 1, message: 'Minimo 1 segundo' },
                  validate: (value) => {
                    if (videoMode === 'video_count' && (!value || value < 1)) {
                      return 'La duracion maxima es requerida';
                    }
                    return true;
                  },
                })}
              />
              {errors.maxDurationPerVideoSeconds && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.maxDurationPerVideoSeconds.message}
                </p>
              )}
              {maxDurationPerVideoSeconds && maxDurationPerVideoSeconds > 0 && (
                <p className="text-xs text-foreground/60 mt-1">
                  Equivale a: {formatSecondsToReadable(maxDurationPerVideoSeconds)}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Campos para Modalidad: Por tiempo total */}
      {videoMode === 'time_pool' && (
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="text-sm font-medium text-foreground">Configuracion por tiempo total</h4>
          <div>
            <Label
              htmlFor="totalDurationSeconds"
              className="text-sm font-medium mb-1 block"
            >
              Tiempo total disponible (segundos)
            </Label>
            <InputGlobal
              id="totalDurationSeconds"
              type="number"
              min="1"
              placeholder="Ej: 1200 (20 min)"
              error={!!errors.totalDurationSeconds}
              {...register('totalDurationSeconds', {
                valueAsNumber: true,
                min: { value: 1, message: 'Minimo 1 segundo' },
                validate: (value) => {
                  if (videoMode === 'time_pool' && (!value || value < 1)) {
                    return 'El tiempo total es requerido';
                  }
                  return true;
                },
              })}
            />
            {errors.totalDurationSeconds && (
              <p className="text-red-500 text-xs mt-1">
                {errors.totalDurationSeconds.message}
              </p>
            )}
            {totalDurationSeconds && totalDurationSeconds > 0 && (
              <p className="text-xs text-foreground/60 mt-1">
                Equivale a: {formatSecondsToReadable(totalDurationSeconds)}
              </p>
            )}
            <p className="text-xs text-foreground/60 mt-2">
              El vendedor puede crear multiples videos hasta agotar este tiempo.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
