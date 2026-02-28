import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userFormSchema, UserFormData } from '../utils/user-form-schema';
import { UserStatus } from '@/shared/types';
import { userService } from '@/shared/services/userService';

export function useUserForm(id?: string) {
  const isEditing = Boolean(id);
  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      activeRole: undefined,
      status: UserStatus.ACTIVE,
    },
  });
  const { reset } = form;

  useEffect(() => {
    if (isEditing && id) {
      userService.getById(id).then(user => {
        if (user) {
          const seller = user.sellerProfile;
          const courier = user.courierProfile;
          reset({
            email: user.profile?.email || '',
            firstName: user.profile?.firstName || '',
            lastName: user.profile?.lastName || '',
            phone: user.profile?.phone || '',
            activeRole: user.activeRole || undefined,
            status: user.status || UserStatus.ACTIVE,
            // Seller fields
            businessName: seller?.businessName || '',
            businessType: seller?.businessType || '',
            businessPhone: seller?.businessPhone || '',
            businessEmail: seller?.businessEmail || '',
            taxId: seller?.taxId || '',
            categories: seller?.categories?.join(', ') || '',
            isVerified: seller?.isVerified || false,
            // Courier fields
            vehiclePlate: courier?.vehiclePlate || '',
            licenseNumber: courier?.licenseNumber || '',
            cities: courier?.cities || [],
            currentCity: courier?.currentCity || '',
            isAvailable: courier?.isAvailable || false,
          });
        }
      });
    }
  }, [isEditing, id, reset]);

  return form;
}
