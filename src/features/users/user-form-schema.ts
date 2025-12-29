import { z } from 'zod';
import { UserRole, UserStatus } from '@/shared/types';

// El password es requerido solo en creación, opcional en edición

export const userFormSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').optional(),
  firstName: z.string().min(2, 'Nombre requerido'),
  lastName: z.string().min(2, 'Apellido requerido'),
  phone: z.string().min(6, 'Teléfono requerido'),
  activeRole: z.nativeEnum(UserRole),
  status: z.nativeEnum(UserStatus),
  // Courier fields
  vehicleType: z.string().min(2, 'Selecciona un tipo de vehículo').optional(),
  vehiclePlate: z.string().optional(),
  licenseNumber: z.string().optional(),
  workingZones: z.string().optional(), // se separa por coma
  isAvailable: z.boolean().optional(),
  // Seller fields
  businessName: z.string().optional(),
  businessType: z.string().optional(),
  taxId: z.string().optional(),
  businessPhone: z.string().optional(),
  businessEmail: z.string().optional(),
  businessAddress: z.string().optional(),
  categories: z.string().optional(), // se separa por coma
  isVerified: z.boolean().optional(),
}).superRefine((data, ctx) => {
  if (data.activeRole === UserRole.COURIER) {
    if (!data.vehicleType || data.vehicleType.length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'El tipo de vehículo es obligatorio para repartidores',
        path: ['vehicleType'],
      });
    }
  }
  if (data.activeRole === UserRole.SELLER) {
    if (!data.businessName || data.businessName.length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'El nombre del negocio es obligatorio',
        path: ['businessName'],
      });
    }
    if (!data.businessType || data.businessType.length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'El tipo de negocio es obligatorio',
        path: ['businessType'],
      });
    }
    if (!data.businessPhone || data.businessPhone.length < 6) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'El teléfono del negocio es obligatorio',
        path: ['businessPhone'],
      });
    }
    if (!data.businessEmail || data.businessEmail.length < 6) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'El email del negocio es obligatorio',
        path: ['businessEmail'],
      });
    }
  }
});

export type UserFormData = z.infer<typeof userFormSchema>;
