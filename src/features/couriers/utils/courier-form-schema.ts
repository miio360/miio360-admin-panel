import { z } from 'zod';
import { UserStatus } from '@/shared/types';

export const courierFormSchema = z.object({
  firstName: z.string().min(2, 'Nombre requerido'),
  lastName: z.string().min(2, 'Apellido requerido'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres').optional(),
  phone: z.string().min(6, 'Teléfono requerido'),
  vehiclePlate: z.string().optional(),
  licenseNumber: z.string().optional(),
  status: z.nativeEnum(UserStatus),
  cities: z.array(z.string()).min(1, 'Selecciona al menos una ciudad'),
  currentCity: z.string().min(1, 'Ciudad actual requerida'),
});

export type CourierFormData = z.infer<typeof courierFormSchema>;
