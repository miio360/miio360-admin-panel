import { useEffect, useState } from 'react';
import { useForm, useController } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Label } from '@/shared/components/ui/label';
import { InputGlobal } from '@/shared/components/input-global';
import { SelectGlobal } from '@/shared/components/select-global';
import { ButtonGlobal } from '@/shared/components/button-global';
import { UserStatus } from '@/shared/types';
import type { User } from '@/shared/types';
import { courierFormSchema, type CourierFormData } from '../utils/courier-form-schema';
import { useCourierFormSubmit } from '../hooks/useCourierFormSubmit';
import { useCitiesFromShipmentPrices } from '../hooks/useCitiesFromShipmentPrices';

interface CourierFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courier?: User | null;
  onSuccess: () => void;
}

export function CourierFormDialog({
  open,
  onOpenChange,
  courier,
  onSuccess,
}: CourierFormDialogProps) {
  const isEditing = !!courier;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { cities: availableCities, isLoading: citiesLoading } = useCitiesFromShipmentPrices();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CourierFormData>({
    resolver: zodResolver(courierFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      vehiclePlate: '',
      licenseNumber: '',
      status: UserStatus.ACTIVE,
      cities: [],
      currentCity: '',
    },
  });

  const { field: citiesField } = useController({ name: 'cities', control });
  const selectedCities = citiesField.value ?? [];

  useEffect(() => {
    if (courier) {
      reset({
        firstName: courier.profile?.firstName ?? '',
        lastName: courier.profile?.lastName ?? '',
        email: courier.profile?.email ?? '',
        phone: courier.profile?.phone ?? '',
        vehiclePlate: courier.courierProfile?.vehiclePlate ?? '',
        licenseNumber: courier.courierProfile?.licenseNumber ?? '',
        status: courier.status ?? UserStatus.ACTIVE,
        cities: courier.courierProfile?.cities ?? [],
        currentCity: courier.courierProfile?.currentCity ?? '',
      });
    } else {
      reset({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        vehiclePlate: '',
        licenseNumber: '',
        status: UserStatus.ACTIVE,
        cities: [],
        currentCity: '',
      });
    }
  }, [courier, open, reset]);

  const { onSubmit } = useCourierFormSubmit(() => {
    onSuccess();
    onOpenChange(false);
  });

  const handleFormSubmit = async (data: CourierFormData) => {
    setIsSubmitting(true);
    await onSubmit(data, isEditing, courier?.id);
    setIsSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-150 bg-background max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground text-lg font-semibold">
            {isEditing ? 'Editar Repartidor' : 'Nuevo Repartidor'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5 mt-2">
          {/* Basic info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="firstName" className="text-sm font-medium text-foreground">
                Nombre <span className="text-red-500">*</span>
              </Label>
              <InputGlobal
                id="firstName"
                placeholder="Juan"
                {...register('firstName')}
                disabled={isSubmitting}
              />
              {errors.firstName && (
                <p className="text-xs text-red-500">{errors.firstName.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="lastName" className="text-sm font-medium text-foreground">
                Apellido <span className="text-red-500">*</span>
              </Label>
              <InputGlobal
                id="lastName"
                placeholder="Pérez"
                {...register('lastName')}
                disabled={isSubmitting}
              />
              {errors.lastName && (
                <p className="text-xs text-red-500">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                Email <span className="text-red-500">*</span>
              </Label>
              <InputGlobal
                id="email"
                type="email"
                placeholder="juan@ejemplo.com"
                {...register('email')}
                disabled={isEditing || isSubmitting}
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-sm font-medium text-foreground">
                Teléfono <span className="text-red-500">*</span>
              </Label>
              <InputGlobal
                id="phone"
                placeholder="+591 70000000"
                {...register('phone')}
                disabled={isSubmitting}
              />
              {errors.phone && (
                <p className="text-xs text-red-500">{errors.phone.message}</p>
              )}
            </div>
          </div>

          {!isEditing && (
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">
                Contraseña <span className="text-red-500">*</span>
              </Label>
              <InputGlobal
                id="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                {...register('password')}
                disabled={isSubmitting}
              />
              {errors.password && (
                <p className="text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>
          )}

          {/* Courier-specific fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="vehiclePlate" className="text-sm font-medium text-foreground">
                Placa del Vehículo
              </Label>
              <InputGlobal
                id="vehiclePlate"
                placeholder="ABC-123"
                {...register('vehiclePlate')}
                disabled={isSubmitting}
              />
              <p className="text-xs text-muted-foreground">Opcional</p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="licenseNumber" className="text-sm font-medium text-foreground">
                Nº de Licencia
              </Label>
              <InputGlobal
                id="licenseNumber"
                placeholder="123456789"
                {...register('licenseNumber')}
                disabled={isSubmitting}
              />
              <p className="text-xs text-muted-foreground">Opcional</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="status" className="text-sm font-medium text-foreground">
              Estado
            </Label>
            <SelectGlobal {...register('status')} disabled={isSubmitting}>
              <option value={UserStatus.ACTIVE}>Activo</option>
              <option value={UserStatus.INACTIVE}>Inactivo</option>
              <option value={UserStatus.SUSPENDED}>Suspendido</option>
              <option value={UserStatus.PENDING_VERIFICATION}>Pendiente de verificación</option>
            </SelectGlobal>
          </div>

          {/* City configuration */}
          <div className="space-y-1.5">
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
              <p className="text-xs text-red-500">{errors.cities.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
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
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </SelectGlobal>
            {errors.currentCity && (
              <p className="text-xs text-red-500">{errors.currentCity.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Muestra solo las ciudades seleccionadas arriba
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <ButtonGlobal
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </ButtonGlobal>
            <ButtonGlobal
              type="submit"
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90 text-foreground font-semibold px-6"
            >
              {isSubmitting
                ? isEditing
                  ? 'Guardando...'
                  : 'Creando...'
                : isEditing
                ? 'Guardar Cambios'
                : 'Crear Repartidor'}
            </ButtonGlobal>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
