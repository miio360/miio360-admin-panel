import { Label } from '@/shared/components/ui/label';
import { InputGlobal } from '@/shared/components/input-global';
import { TextareaGlobal } from '@/shared/components/textarea-global';
import { Switch } from '@/shared/components/ui/switch';
import { Controller } from 'react-hook-form';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';
import type { Control, UseFormRegister, FieldErrors } from 'react-hook-form';
import type { LivesPlanFormData } from '../types/plan';

interface PlanLivesFieldsProps {
  register: UseFormRegister<LivesPlanFormData>;
  control: Control<LivesPlanFormData>;
  errors: FieldErrors<LivesPlanFormData>;
  isActive: boolean;
  onActiveChange: (value: boolean) => void;
}

const AVAILABLE_FEATURES = [
  { id: 'clean_signal', label: 'Señal Limpia', desc: 'Transmisión limpia sin marcas de agua ni logotipos de terceros.' },
  { id: 'assisted_distribution', label: 'Distribución Asistida', desc: 'Soporte técnico y optimización automática para la distribución de tu transmisión.' },
  { id: 'signal_boost', label: 'Impulso de Señal', desc: 'Prioridad en el ancho de banda y servidores optimizados para evitar retrasos.' },
  { id: 'vip_boost', label: 'Impulso VIP', desc: 'Máxima prioridad y posicionamiento preferencial de tu transmisión en la plataforma.' },
  { id: 'click_to_buy', label: 'Clic para Comprar', desc: 'Permite a los usuarios realizar compras directamente desde la pantalla del Live.' },
  { id: 'flash_offers', label: 'Ofertas Relámpago', desc: 'Funcionalidad para lanzar ofertas con cronómetro en vivo durante la transmisión.' },
];

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
        <Label htmlFor="name" className="text-sm font-medium mb-1 block">
          Nombre del Plan
        </Label>
        <InputGlobal
          id="name"
          placeholder="Ej: MiiO Live Premium"
          error={!!errors.name}
          {...register('name', { required: 'El nombre es requerido' })}
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
        )}
      </div>

      <TextareaGlobal
        control={control}
        name="description"
        label="Descripción"
        placeholder="Describe el plan de lives..."
        rows={3}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="pricePublic" className="text-sm font-medium mb-1 block">
            Precio Público (BOB)
          </Label>
          <InputGlobal
            id="pricePublic"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            error={!!errors.pricePublic}
            {...register('pricePublic', {
              required: 'El precio público es requerido',
              valueAsNumber: true,
              min: { value: 0, message: 'El precio debe ser positivo o cero' },
            })}
          />
          {errors.pricePublic && (
            <p className="text-red-500 text-xs mt-1">{errors.pricePublic.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="priceNet" className="text-sm font-medium mb-1 block">
            Precio Neto (BOB)
          </Label>
          <InputGlobal
            id="priceNet"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            readOnly
            className="bg-muted text-muted-foreground cursor-not-allowed select-none border-dashed"
            error={!!errors.priceNet}
            {...register('priceNet', {
              required: 'El precio neto es requerido',
              valueAsNumber: true,
              min: { value: 0, message: 'El precio debe ser positivo o cero' },
            })}
          />
          {errors.priceNet && (
            <p className="text-red-500 text-xs mt-1">{errors.priceNet.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="maxMinutesPerMonth" className="text-sm font-medium mb-1 block">
            Tiempo de Lives (minutos/mes)
          </Label>
          <InputGlobal
            id="maxMinutesPerMonth"
            type="number"
            min="1"
            placeholder="Ej: 120"
            error={!!errors.maxMinutesPerMonth}
            {...register('maxMinutesPerMonth', {
              required: 'El tiempo es requerido',
              valueAsNumber: true,
              min: { value: 1, message: 'Mínimo 1 minuto' },
            })}
          />
          {errors.maxMinutesPerMonth && (
            <p className="text-red-500 text-xs mt-1">
              {errors.maxMinutesPerMonth.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="maxConcurrentViewers" className="text-sm font-medium mb-1 block">
            Límite de Espectadores
          </Label>
          <InputGlobal
            id="maxConcurrentViewers"
            type="number"
            min="1"
            placeholder="Ej: 99"
            error={!!errors.maxConcurrentViewers}
            {...register('maxConcurrentViewers', {
              required: 'El límite de espectadores es requerido',
              valueAsNumber: true,
              min: { value: 1, message: 'Mínimo 1 espectador' },
            })}
          />
          {errors.maxConcurrentViewers && (
            <p className="text-red-500 text-xs mt-1">
              {errors.maxConcurrentViewers.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium mb-2 block">
          Características / Funcionalidades
        </Label>
        <Controller
          control={control}
          name="features"
          render={({ field: { onChange, value = [] } }) => {
            const handleCheckboxChange = (featureId: string, checked: boolean) => {
              if (featureId === 'clean_signal') return; // Impedir cualquier cambio en la señal limpia
              if (checked) {
                onChange([...value, featureId]);
              } else {
                onChange(value.filter((val) => val !== featureId));
              }
            };

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 border rounded-md bg-muted/20">
                <TooltipProvider>
                  {AVAILABLE_FEATURES.map((feature) => {
                    const isCleanSignal = feature.id === 'clean_signal';
                    const isChecked = isCleanSignal ? true : value.includes(feature.id);
                    return (
                      <div 
                        key={feature.id} 
                        className="flex items-center justify-between p-2 rounded hover:bg-muted/40 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            id={`feat-${feature.id}`}
                            checked={isChecked}
                            disabled={isCleanSignal}
                            onChange={(e) => handleCheckboxChange(feature.id, e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-background disabled:opacity-70 disabled:cursor-not-allowed"
                          />
                          <Label 
                            htmlFor={`feat-${feature.id}`} 
                            className={`text-sm font-normal cursor-pointer select-none ${isCleanSignal ? 'opacity-70 cursor-not-allowed' : ''}`}
                          >
                            {feature.label}
                          </Label>
                        </div>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              className="text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-muted transition-colors"
                            >
                              <HelpCircle className="w-4 h-4" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-xs text-xs bg-popover text-popover-foreground border shadow-sm">
                            {feature.desc}
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    );
                  })}
                </TooltipProvider>
              </div>
            );
          }}
        />
      </div>

      <div className="flex flex-col gap-4 pt-2 border-t">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Controller
            control={control}
            name="triggerPushOnStart"
            render={({ field: { onChange, value } }) => (
              <div className="flex items-center gap-3">
                <Switch
                  id="triggerPushOnStart"
                  checked={value}
                  onCheckedChange={onChange}
                />
                <Label htmlFor="triggerPushOnStart" className="text-sm font-medium">
                  Notificación Push al iniciar Live
                </Label>
              </div>
            )}
          />

          <div className="flex items-center gap-3">
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

        <Controller
          control={control}
          name="isInitial"
          render={({ field: { onChange, value } }) => (
            <div className="flex items-start gap-3 p-3 bg-indigo-50 dark:bg-indigo-950/20 rounded-md border border-indigo-150 dark:border-indigo-900/30">
              <Switch
                id="isInitial"
                checked={value || false}
                onCheckedChange={onChange}
              />
              <div className="space-y-1">
                <Label htmlFor="isInitial" className="text-sm font-medium leading-none cursor-pointer">
                  Plan Inicial por Defecto
                </Label>
                <p className="text-xs text-muted-foreground">
                  Al marcar este plan como inicial, se asignará automáticamente a las nuevas tiendas registradas. 
                  Solo puede haber un plan inicial activo a la vez; al guardar, se desmarcarán otros planes iniciales.
                </p>
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
}
