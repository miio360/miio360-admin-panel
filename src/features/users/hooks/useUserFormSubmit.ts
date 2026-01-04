import { useNavigate } from 'react-router-dom';
import { UserFormData } from '../user-form-schema';
import { userService } from '@/shared/services/userService';
import { UserRole } from '@/shared/types';
import { useModal } from '@/shared/hooks/useModal';

export function useUserFormSubmit() {
  const navigate = useNavigate();
  const modal = useModal();

  const onSubmit = async (data: UserFormData, isEditing: boolean, id?: string) => {
    try {
      if (isEditing && id) {
        modal.showWarning('Actualización de usuario aún no implementada');
        return;
      } else {
        if (!data.password) {
          modal.showError('La contraseña es obligatoria');
          return;
        }
        
        await userService.createUser({
          email: data.email,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          activeRole: data.activeRole,
          status: data.status,
          vehicleType: data.activeRole === UserRole.COURIER ? data.vehicleType : undefined,
        });
        
        modal.showSuccess('Usuario creado correctamente');
        navigate('/users');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al guardar el usuario';
      modal.showError(errorMessage);
    }
  };

  return { onSubmit };
}
