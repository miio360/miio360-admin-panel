import { UseFormReturn } from 'react-hook-form';
import { InputGlobal } from '@/shared/components/input-global';
import { Label } from '@/shared/components/ui/label';
import { SelectGlobal } from '@/shared/components/select-global';
import { UserFormData } from '../user-form-schema';

interface CourierProfileStepProps {
  form: UseFormReturn<UserFormData>;
  isSubmitting: boolean;
}

export function CourierProfileStep({ form, isSubmitting }: CourierProfileStepProps) {
  const { formState: { errors }, register } = form;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-1">Perfil de Repartidor</h3>
        <p className="text-sm text-muted-foreground">Información sobre el vehículo y licencias</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="vehicleType" className="text-sm font-medium text-foreground">
            Tipo de Vehículo <span className="text-red-500">*</span>
          </Label>
          <SelectGlobal
            {...register('vehicleType')}
            disabled={isSubmitting}
            className={errors.vehicleType ? 'border-red-500' : ''}
          >
            <option value="">Selecciona un vehículo</option>
            <option value="bike">Bicicleta</option>
            <option value="motorcycle">Motocicleta</option>
            <option value="car">Automóvil</option>
            <option value="walking">A pie</option>
          </SelectGlobal>
          {errors.vehicleType && (
            <p className="text-xs text-red-500 mt-1">{errors.vehicleType.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="vehiclePlate" className="text-sm font-medium text-foreground">
            Placa del Vehículo
          </Label>
          <InputGlobal
            id="vehiclePlate"
            placeholder="ABC-123"
            {...register('vehiclePlate')}
            disabled={isSubmitting}
          />
          <p className="text-xs text-muted-foreground">Opcional, solo si aplica</p>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="licenseNumber" className="text-sm font-medium text-foreground">
            Número de Licencia
          </Label>
          <InputGlobal
            id="licenseNumber"
            placeholder="Ej: 123456789"
            {...register('licenseNumber')}
            disabled={isSubmitting}
          />
          <p className="text-xs text-muted-foreground">Opcional, número de licencia de conducir</p>
        </div>
      </div>
    </div>
  );
}
