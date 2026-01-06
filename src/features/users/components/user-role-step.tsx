import { UseFormReturn } from 'react-hook-form';
import { Label } from '@/shared/components/ui/label';
import { UserRole, UserStatus } from '@/shared/types';
import { UserFormData } from '../user-form-schema';
import { SelectGlobal } from '@/shared/components/select-global';

interface UserRoleStepProps {
  form: UseFormReturn<UserFormData>;
  isSubmitting: boolean;
}

export function UserRoleStep({ form, isSubmitting }: UserRoleStepProps) {
  const { formState: { errors }, watch, register } = form;
  const activeRole = watch('activeRole');

  return (
    <div className="space-y-6 p-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-1">Rol y Estado</h3>
        <p className="text-sm text-muted-foreground">Define el rol y estado del usuario en la plataforma</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="activeRole" className="text-sm font-medium text-foreground">
            Rol del Usuario <span className="text-red-500">*</span>
          </Label>
          <SelectGlobal
            {...register('activeRole')}
            disabled={isSubmitting}
            className={errors.activeRole ? 'border-red-500' : ''}
          >
            <option value="">Selecciona un rol</option>
            <option value={UserRole.CUSTOMER}>Cliente</option>
            <option value={UserRole.SELLER}>Vendedor</option>
            <option value={UserRole.COURIER}>Repartidor</option>
            <option value={UserRole.ADMIN}>Administrador</option>
          </SelectGlobal>
          {errors.activeRole && (
            <p className="text-xs text-red-500 mt-1">{errors.activeRole.message}</p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            {activeRole === UserRole.SELLER && 'El usuario podrá vender productos'}
            {activeRole === UserRole.COURIER && 'El usuario podrá realizar entregas'}
            {activeRole === UserRole.CUSTOMER && 'El usuario podrá comprar productos'}
            {activeRole === UserRole.ADMIN && 'El usuario tendrá acceso completo al panel'}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status" className="text-sm font-medium text-foreground">
            Estado <span className="text-red-500">*</span>
          </Label>
          <SelectGlobal
            {...register('status')}
            disabled={isSubmitting}
            className={errors.status ? 'border-red-500' : ''}
          >
            <option value="">Selecciona un estado</option>
            <option value={UserStatus.ACTIVE}>Activo</option>
            <option value={UserStatus.INACTIVE}>Inactivo</option>
            <option value={UserStatus.SUSPENDED}>Suspendido</option>
            <option value={UserStatus.PENDING_VERIFICATION}>Pendiente de verificación</option>
          </SelectGlobal>
          {errors.status && (
            <p className="text-xs text-red-500 mt-1">{errors.status.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
