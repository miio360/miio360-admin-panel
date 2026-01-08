import { UseFormReturn } from 'react-hook-form';
import { InputGlobal } from '@/shared/components/input-global';
import { Label } from '@/shared/components/ui/label';
import { UserFormData } from '../user-form-schema';


interface UserProfileStepProps {
  form: UseFormReturn<UserFormData>;
  isSubmitting: boolean;
  isEditing?: boolean;
}

export function UserProfileStep({ form, isSubmitting, isEditing = false }: UserProfileStepProps) {
  const { formState: { errors }, register } = form;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-1">Información del Perfil</h3>
        <p className="text-sm text-muted-foreground">Datos personales del usuario</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-sm font-medium text-foreground">
            Nombre <span className="text-red-500">*</span>
          </Label>
          <InputGlobal
            id="firstName"
            autoComplete="given-name"
            placeholder="Juan"
            {...register('firstName')}
            disabled={isSubmitting}
            className={`h-11 ${errors.firstName ? 'border-red-500' : ''}`}
          />
          {errors.firstName && (
            <p className="text-xs text-red-500 mt-1">{errors.firstName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-sm font-medium text-foreground">
            Apellidos <span className="text-red-500">*</span>
          </Label>
          <InputGlobal
            id="lastName"
            autoComplete="family-name"
            placeholder="Pérez"
            {...register('lastName')}
            disabled={isSubmitting}
            className={`h-11 ${errors.lastName ? 'border-red-500' : ''}`}
          />
          {errors.lastName && (
            <p className="text-xs text-red-500 mt-1">{errors.lastName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-foreground">
            Email <span className="text-red-500">*</span>
          </Label>
          <InputGlobal
            id="email"
            autoComplete="email"
            placeholder="usuario@ejemplo.com"
            type="email"
            {...register('email')}
            disabled={isSubmitting}
            className={`h-11 ${errors.email ? 'border-red-500' : ''}`}
          />
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium text-foreground">
            Teléfono <span className="text-red-500">*</span>
          </Label>
          <InputGlobal
            id="phone"
            autoComplete="tel"
            placeholder="+52 123 456 7890"
            type="tel"
            {...register('phone')}
            disabled={isSubmitting}
            className={`h-11 ${errors.phone ? 'border-red-500' : ''}`}
          />
          {errors.phone && (
            <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>
          )}
        </div>

        {/* Solo mostrar contraseña si no es edición */}
        {!isEditing && (
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-foreground">
              Contraseña <span className="text-red-500">*</span>
            </Label>
            <InputGlobal
              id="password"
              autoComplete="new-password"
              placeholder="Mínimo 6 caracteres"
              type="password"
              {...register('password')}
              disabled={isSubmitting}
              className={`h-11 ${errors.password ? 'border-red-500' : ''}`}
            />
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
