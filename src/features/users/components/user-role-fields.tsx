import { UseFormReturn, FieldErrors } from 'react-hook-form';
import { SelectGlobal } from '@/shared/components/select-global';
import { Label } from '@/shared/components/ui/label';
import { UserRole, UserStatus } from '@/shared/types';

interface UserRoleFieldsProps {
  form: UseFormReturn<UserRoleFieldsValues>;
  isSubmitting: boolean;
  errors: FieldErrors<UserRoleFieldsValues>;
}

interface UserRoleFieldsValues {
  activeRole: UserRole | "";
  status: UserStatus | "";
}

export function UserRoleFields({ form, isSubmitting, errors }: UserRoleFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      <div className="space-y-2">
        <Label htmlFor="activeRole" className="text-sm font-medium text-foreground">
          Rol activo <span className="text-red-500">*</span>
        </Label>
        <SelectGlobal
          id="activeRole"
          {...form.register('activeRole')}
          disabled={isSubmitting}
          className={`h-11 ${errors.activeRole ? 'border-red-500' : ''}`}
        >
          <option value="">Selecciona un rol</option>
          <option value={UserRole.CUSTOMER}>Cliente</option>
          <option value={UserRole.SELLER}>Vendedor</option>
          <option value={UserRole.ADMIN}>Administrador</option>
          <option value={UserRole.COURIER}>Repartidor</option>
        </SelectGlobal>
        {errors.activeRole && (
          <p className="text-xs text-red-500 mt-1">{errors.activeRole.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="status" className="text-sm font-medium text-foreground">
          Estado <span className="text-red-500">*</span>
        </Label>
        <SelectGlobal
          id="status"
          {...form.register('status')}
          disabled={isSubmitting}
          className={`h-11 ${errors.status ? 'border-red-500' : ''}`}
        >
          <option value="">Selecciona el estado</option>
          <option value={UserStatus.ACTIVE}>Activo</option>
          <option value={UserStatus.INACTIVE}>Inactivo</option>
        </SelectGlobal>
        {errors.status && (
          <p className="text-xs text-red-500 mt-1">{errors.status.message}</p>
        )}
      </div>
    </div>
  );
}
