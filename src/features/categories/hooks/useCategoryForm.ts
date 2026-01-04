import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { categoryService } from '@/shared/services/categoryService';
import { useAuth } from '@/shared/hooks/useAuth';
import { useModal } from '@/shared/hooks/useModal';

const categoryFormSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  slug: z.string().min(3, 'El slug debe tener al menos 3 caracteres'),
  description: z.string().min(1, 'La descripción es obligatoria'),
  icon: z.string().min(1, 'El icono es obligatorio'),
  isActive: z.boolean(),
});

export type CategoryFormData = z.infer<typeof categoryFormSchema>;

export function useCategoryForm(categoryId?: string) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const modal = useModal();
  const isEditing = Boolean(categoryId);

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      icon: '',
      isActive: true,
    },
  });

  useEffect(() => {
    if (categoryId) {
      loadCategory(categoryId);
    }
  }, [categoryId]);

  const loadCategory = async (id: string) => {
    try {
      const category = await categoryService.getById(id);
      if (category) {
        form.reset({
          name: category.name,
          slug: category.slug,
          description: category.description,
          icon: category.icon,
          isActive: category.isActive,
        });
      }
    } catch (error) {
      console.error('Error al cargar la categoría:', error);
      modal.showError('Error al cargar los datos de la categoría');
    }
  };

  const onSubmit = async (data: CategoryFormData) => {
    if (!user) {
      modal.showError('Debes estar autenticado para realizar esta acción');
      return;
    }

    try {
      if (isEditing && categoryId) {
        await categoryService.update(categoryId, {
          ...data,
        });
        modal.showSuccess('Categoría actualizada exitosamente');
      } else {
        const categories = await categoryService.getAll();
        const order = categories.length + 1;
        await categoryService.create({
          ...data,
          order,
          createdBy: user.id,
        });
        modal.showSuccess('Categoría creada exitosamente');
      }
      navigate('/categories');
    } catch (error) {
      console.error('Error al guardar la categoría:', error);
      modal.showError('Error al guardar la categoría. Por favor intenta de nuevo.');
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isEditing,
    isSubmitting: form.formState.isSubmitting,
  };
}
