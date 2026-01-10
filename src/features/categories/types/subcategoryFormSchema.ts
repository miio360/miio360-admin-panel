import { z } from "zod";

export const subcategoryFormSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  description: z.string().min(1, "La descripción es obligatoria"),
  icon: z.string().min(1, "El icono es obligatorio"),
  isActive: z.boolean(),
  order: z.number().int().min(0),
  categoryId: z.string().min(1, "La categoría es obligatoria"),
});

export type SubcategoryFormData = z.infer<typeof subcategoryFormSchema>;
