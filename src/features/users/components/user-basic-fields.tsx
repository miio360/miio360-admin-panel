import { UseFormReturn } from 'react-hook-form';
import { InputGlobal } from '@/shared/components/input-global';
import { Label } from '@/shared/components/ui/label';

interface UserBasicFieldsProps {
  form: UseFormReturn<any>;
  isEditing: boolean;
  isSubmitting: boolean;
  errors: any;
}

export function UserBasicFields({ form, isEditing, isSubmitting, errors }: UserBasicFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-foreground">
          Email <span className="text-red-500">*</span>
        </Label>
        <InputGlobal
          id="email"
          placeholder="usuario@ejemplo.com"
          type="email"
          {...form.register('email')}
          disabled={isSubmitting || isEditing}
          className={`h-11 ${errors.email ? 'border-red-500' : ''}`}
        />
        {errors.email && (
          <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
        )}
      </div>

      {!isEditing && (
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium text-foreground">
            Contraseña <span className="text-red-500">*</span>
          </Label>
          <InputGlobal
            id="password"
            placeholder="Mínimo 6 caracteres"
            type="password"
            {...form.register('password')}
            disabled={isSubmitting}
            className={`h-11 ${errors.password ? 'border-red-500' : ''}`}
          />
          {errors.password && (
            <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
          )}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="displayName" className="text-sm font-medium text-foreground">
          Nombre completo <span className="text-red-500">*</span>
        </Label>
        <InputGlobal
          id="displayName"
          placeholder="Juan Pérez"
          {...form.register('displayName')}
          disabled={isSubmitting}
          className={`h-11 ${errors.displayName ? 'border-red-500' : ''}`}
        />
        {errors.displayName && (
          <p className="text-xs text-red-500 mt-1">{errors.displayName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phoneNumber" className="text-sm font-medium text-foreground">
          Teléfono
        </Label>
        <InputGlobal
          id="phoneNumber"
          placeholder="+52 123 456 7890"
          type="tel"
          {...form.register('phoneNumber')}
          disabled={isSubmitting}
          className="h-11"
        />
      </div>
    </div>
  );
}
