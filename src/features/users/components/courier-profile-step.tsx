import { UseFormReturn, useController } from 'react-hook-form';
import { InputGlobal } from '@/shared/components/input-global';
import { Label } from '@/shared/components/ui/label';
import { SelectGlobal } from '@/shared/components/select-global';
import { UserFormData } from '../utils/user-form-schema';
import { useCitiesFromShipmentPrices } from '@/features/couriers/hooks/useCitiesFromShipmentPrices';

interface CourierProfileStepProps {
  form: UseFormReturn<UserFormData>;
  isSubmitting: boolean;
}

export function CourierProfileStep({ form, isSubmitting }: CourierProfileStepProps) {
  const { formState: { errors }, register, control } = form;
  const { cities: availableCities, isLoading: citiesLoading } = useCitiesFromShipmentPrices();

  const { field: citiesField } = useController({ name: 'cities', control, defaultValue: [] });
  const selectedCities: string[] = citiesField.value ?? [];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-1">Perfil de Repartidor</h3>
        <p className="text-sm text-muted-foreground">Información sobre el vehículo, licencias y ciudades de operación</p>
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

        {/* Cities where the courier operates */}
        <div className="space-y-2 md:col-span-2">
          <Label className="text-sm font-medium text-foreground">
            Ciudades donde opera <span className="text-red-500">*</span>
          </Label>
          {citiesLoading ? (
            <p className="text-xs text-muted-foreground">Cargando ciudades...</p>
          ) : availableCities.length === 0 ? (
            <p className="text-xs text-muted-foreground">No hay ciudades disponibles. Agrega precios de envío primero.</p>
          ) : (
            <div className="grid grid-cols-2 gap-2 p-3 border border-border rounded-md bg-muted/30 max-h-40 overflow-y-auto">
              {availableCities.map((city) => (
                <label key={city} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="accent-primary w-4 h-4"
                    checked={selectedCities.includes(city)}
                    onChange={(e) => {
                      const next = e.target.checked
                        ? [...selectedCities, city]
                        : selectedCities.filter((c) => c !== city);
                      citiesField.onChange(next);
                    }}
                    disabled={isSubmitting}
                  />
                  <span className="text-sm text-foreground">{city}</span>
                </label>
              ))}
            </div>
          )}
          {errors.cities && (
            <p className="text-xs text-red-500">{(errors.cities as { message?: string }).message}</p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="currentCity" className="text-sm font-medium text-foreground">
            Ciudad actual <span className="text-red-500">*</span>
          </Label>
          <SelectGlobal
            id="currentCity"
            {...register('currentCity')}
            disabled={isSubmitting || citiesLoading}
          >
            <option value="">Selecciona una ciudad</option>
            {(selectedCities.length > 0 ? selectedCities : availableCities).map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </SelectGlobal>
          {errors.currentCity && (
            <p className="text-xs text-red-500">{errors.currentCity.message}</p>
          )}
          <p className="text-xs text-muted-foreground">Muestra solo las ciudades seleccionadas arriba</p>
        </div>
      </div>
    </div>
  );
}
