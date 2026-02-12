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
import type { Control, UseFormRegister, FieldErrors } from 'react-hook-form';
import type { AdvertisingPlanFormData, AdvertisingType, AdvertisingPosition } from '../types/plan';
import { ADVERTISING_TYPE_LABELS, ADVERTISING_POSITION_LABELS, ADVERTISING_POSITION_DESCRIPTIONS } from '../types/plan';
import { getValidTypesForPosition, getValidPositionsForType } from '../utils/advertisingValidation';
import { useMemo } from 'react';

interface PlanAdvertisingFieldsProps {
  register: UseFormRegister<AdvertisingPlanFormData>;
  control: Control<AdvertisingPlanFormData>;
  errors: FieldErrors<AdvertisingPlanFormData>;
  isActive: boolean;
  onActiveChange: (value: boolean) => void;
  advertisingType: AdvertisingType;
  onAdvertisingTypeChange: (value: AdvertisingType) => void;
  advertisingPosition: AdvertisingPosition;
  onAdvertisingPositionChange: (value: AdvertisingPosition) => void;
}

export function PlanAdvertisingFields({
  register,
  control,
  errors,
  isActive,
  onActiveChange,
  advertisingType,
  onAdvertisingTypeChange,
  advertisingPosition,
  onAdvertisingPositionChange,
}: PlanAdvertisingFieldsProps) {
  const validTypes = useMemo(
    () => getValidTypesForPosition(advertisingPosition),
    [advertisingPosition]
  );

  const validPositions = useMemo(
    () => getValidPositionsForType(advertisingType),
    [advertisingType]
  );

  const handleTypeChange = (newType: AdvertisingType) => {
    onAdvertisingTypeChange(newType);
    const validPositionsForNewType = getValidPositionsForType(newType);
    if (!validPositionsForNewType.includes(advertisingPosition)) {
      onAdvertisingPositionChange(validPositionsForNewType[0]);
    }
  };

  const handlePositionChange = (newPosition: AdvertisingPosition) => {
    onAdvertisingPositionChange(newPosition);
    const validTypesForNewPosition = getValidTypesForPosition(newPosition);
    if (!validTypesForNewPosition.includes(advertisingType)) {
      onAdvertisingTypeChange(validTypesForNewPosition[0]);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title" className="text-sm font-medium mb-1 block">
          Titulo del Plan
        </Label>
        <InputGlobal
          id="title"
          placeholder="Ej: Plan Publicidad Premium"
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
        placeholder="Describe el plan de publicidad..."
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
          <Label className="text-sm font-medium mb-1 block">
            Tipo de Publicidad
          </Label>
          <Select
            value={advertisingType}
            onValueChange={(val) => handleTypeChange(val as AdvertisingType)}
          >
            <SelectTrigger className="h-11 border border-gray-400/40">
              <SelectValue placeholder="Selecciona tipo" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(ADVERTISING_TYPE_LABELS).map(([key, label]) => (
                <SelectItem 
                  key={key} 
                  value={key}
                  disabled={!validTypes.includes(key as AdvertisingType)}
                >
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500 mt-1">
            {advertisingType === 'store_banner' 
              ? 'Banner de toda la tienda' 
              : 'Producto especifico'}
          </p>
        </div>

        <div>
          <Label htmlFor="daysEnabled" className="text-sm font-medium mb-1 block">
            Dias Habilitados
          </Label>
          <InputGlobal
            id="daysEnabled"
            type="number"
            min="1"
            placeholder="Ej: 30"
            error={!!errors.daysEnabled}
            {...register('daysEnabled', {
              required: 'Los dias son requeridos',
              valueAsNumber: true,
              min: { value: 1, message: 'Minimo 1 dia' },
            })}
          />
          {errors.daysEnabled && (
            <p className="text-red-500 text-xs mt-1">
              {errors.daysEnabled.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium mb-1 block">
          Posicionamiento en Home
        </Label>
        <Select
          value={advertisingPosition}
          onValueChange={(val) => handlePositionChange(val as AdvertisingPosition)}
        >
          <SelectTrigger className="h-11 border border-gray-400/40">
            <SelectValue placeholder="Selecciona posicionamiento" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(ADVERTISING_POSITION_LABELS).map(([key, label]) => (
              <SelectItem 
                key={key} 
                value={key}
                disabled={!validPositions.includes(key as AdvertisingPosition)}
              >
                <div className="flex flex-col gap-1">
                  <span className="font-medium">{label}</span>
                  <span className="text-xs text-gray-600">
                    {ADVERTISING_POSITION_DESCRIPTIONS[key as AdvertisingPosition]}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-gray-500 mt-1">
          Posicion donde aparecera la publicidad
        </p>
      </div>
    </div>
  );
}
