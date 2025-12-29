import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userFormSchema, UserFormData } from '../user-form-schema';
import { UserRole, UserStatus } from '@/shared/types';
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
      activeRole: UserRole.CUSTOMER,
      status: UserStatus.ACTIVE,
    },
  });
  const { reset } = form;

  useEffect(() => {
    if (isEditing && id) {
      userService.getById(id).then(user => {
        if (user) {
          reset({
            email: user.email || '',
            firstName: user.profile?.firstName || '',
            lastName: user.profile?.lastName || '',
            phone: user.profile?.phone || '',
            activeRole: user.activeRole || UserRole.CUSTOMER,
            status: user.status || UserStatus.ACTIVE,
          });
        }
      });
    }
  }, [isEditing, id, reset]);

  return form;
}
