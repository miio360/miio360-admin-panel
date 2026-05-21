import { useEffect, useState } from 'react';
import { useForm, useController, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Upload } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Label } from '@/shared/components/ui/label';
import { Switch } from '@/shared/components/ui/switch';
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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
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
      isAvailable: true,
      cities: [],
      currentCity: '',
      bankName: '',
      accountNumber: '',
    },
  });

  const { field: citiesField } = useController({ name: 'cities', control });
  const selectedCities = citiesField.value ?? [];
  const { field: qrCodeField } = useController({ name: 'qrCodeFile', control });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      qrCodeField.onChange(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

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
        isAvailable: courier.courierProfile?.isAvailable ?? true,
        cities: courier.courierProfile?.cities ?? [],
        currentCity: courier.courierProfile?.currentCity ?? '',
        bankName: courier.courierProfile?.payInformation?.bankName ?? '',
        accountNumber: courier.courierProfile?.payInformation?.accountNumber ?? '',
        qrCodeFile: undefined,
      });
      setPreviewUrl(courier.courierProfile?.payInformation?.qrCode?.url ?? null);
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
        isAvailable: true,
        cities: [],
        currentCity: '',
        bankName: '',
        accountNumber: '',
        qrCodeFile: undefined,
      });
      setPreviewUrl(null);
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

          <div className="pt-4 border-t border-border space-y-4">
            <h4 className="text-sm font-semibold text-foreground">Información de Pago</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="bankName" className="text-sm font-medium text-foreground">
                  Nombre del Banco
                </Label>
                <InputGlobal
                  id="bankName"
                  placeholder="Ej: Banco Unión"
                  {...register('bankName')}
                  disabled={isSubmitting}
                />
                <p className="text-xs text-muted-foreground">Opcional</p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="accountNumber" className="text-sm font-medium text-foreground">
                  Número de Cuenta o Celular
                </Label>
                <InputGlobal
                  id="accountNumber"
                  placeholder="123456789"
                  {...register('accountNumber')}
                  disabled={isSubmitting}
                />
                <p className="text-xs text-muted-foreground">Opcional</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-foreground block mb-1">
                Código QR de Pago
              </Label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="courier-qr-upload"
                disabled={isSubmitting}
              />
              <label htmlFor="courier-qr-upload" className="inline-block w-full">
                <div className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center transition-colors ${!isSubmitting ? 'cursor-pointer hover:border-primary' : 'opacity-50 cursor-not-allowed'}`}>
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-32 h-32 object-contain mx-auto mb-2"
                    />
                  ) : (
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  )}
                  <p className="text-sm text-gray-600">
                    {qrCodeField.value?.name ?? 'Click para seleccionar imagen'}
                  </p>
                </div>
              </label>
              <p className="text-xs text-muted-foreground text-center">Opcional. Sube la imagen del QR para recibir pagos.</p>
            </div>
          </div>

          <div className="pt-4 border-t border-border space-y-1.5">
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

          <div className="flex flex-row items-center justify-between rounded-lg border border-border p-3 shadow-sm bg-card">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium text-foreground">Disponible</Label>
              <p className="text-xs text-muted-foreground">
                Habilita si el repartidor está listo para recibir pedidos.
              </p>
            </div>
            <Controller
              control={control}
              name="isAvailable"
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isSubmitting || (isEditing && courier?.courierProfile?.isAvailable === true)}
                />
              )}
            />
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
