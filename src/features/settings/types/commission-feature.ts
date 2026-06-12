import { z } from 'zod';

export const commissionSchema = z.object({
    appService: z
        .number({ message: 'Debe ser un número' })
        .min(0, 'No puede ser negativo')
        .max(9999, 'Valor demasiado alto'),
    sellerService: z
        .number({ message: 'Debe ser un número' })
        .min(0, 'No puede ser negativo')
        .max(100, 'No puede superar 100%'),
    courierService: z
        .number({ message: 'Debe ser un número' })
        .min(0, 'No puede ser negativo')
        .max(100, 'No puede superar 100%'),
    notes: z.string().max(200, 'Máximo 200 caracteres').optional(),
});

export type CommissionFormValues = z.infer<typeof commissionSchema>;
