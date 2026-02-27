import { useModal } from '@/shared/hooks/useModal';
import { createCourier, updateCourier } from '../api/courierService';
import type { CourierFormData } from '../utils/courier-form-schema';

/**
 * Handles create and update submissions for the courier form.
 * On create, calls the existing `createUser` cloud function with COURIER role.
 * On update, patches Firestore directly.
 */
export function useCourierFormSubmit(onSuccess: () => void) {
  const modal = useModal();

  const onSubmit = async (
    data: CourierFormData,
    isEditing: boolean,
    id?: string
  ): Promise<boolean> => {
    try {
      if (isEditing && id) {
        await updateCourier(id, {
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          vehiclePlate: data.vehiclePlate,
          licenseNumber: data.licenseNumber,
          status: data.status,
          cities: data.cities,
          currentCity: data.currentCity,
        });
        modal.showSuccess('Repartidor actualizado correctamente');
      } else {
        if (!data.password) {
          modal.showError('La contraseña es obligatoria para crear un repartidor');
          return false;
        }
        await createCourier({
          email: data.email,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          vehiclePlate: data.vehiclePlate,
          licenseNumber: data.licenseNumber,
          status: data.status,
          cities: data.cities,
          currentCity: data.currentCity,
        });
        modal.showSuccess('Repartidor creado correctamente');
      }
      onSuccess();
      return true;
    } catch (error: unknown) {
      modal.showError(error instanceof Error ? error.message : 'Error al guardar el repartidor');
      return false;
    }
  };

  return { onSubmit };
}
