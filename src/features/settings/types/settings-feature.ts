import { z } from 'zod';

// ========== FORM SCHEMA ==========
// Country code is hardcoded to +591 (Bolivia)
export const WHATSAPP_COUNTRY_CODE = '591';

export const techSupportSchema = z.object({
    displayName: z
        .string()
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(50, 'El nombre no puede superar 50 caracteres'),
    phoneNumber: z
        .string()
        .min(7, 'El número debe tener al menos 7 dígitos')
        .max(16, 'Número demasiado largo')
        .regex(/^\d+$/, 'Solo dígitos, sin espacios ni guiones'),
    isActive: z.boolean(),
});

export type TechSupportFormValues = z.infer<typeof techSupportSchema>;
