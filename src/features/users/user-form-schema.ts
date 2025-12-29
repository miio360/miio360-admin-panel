import { z } from 'zod';
import { UserRole, UserStatus } from '@/shared/types';

export const userFormSchema = z.object({
  email: z.string().email('Email inválido'),
  firstName: z.string().min(2, 'Nombre requerido'),
  lastName: z.string().min(2, 'Apellido requerido'),
  phone: z.string().min(6, 'Teléfono requerido'),
  activeRole: z.nativeEnum(UserRole),
  status: z.nativeEnum(UserStatus),
});

export type UserFormData = z.infer<typeof userFormSchema>;
