import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Form } from '@/shared/components/ui/form';
import { subcategoryService } from '@/shared/services/subcategoryService';
import { categoryService } from '@/shared/services/categoryService';
import type { Category, FeatureDefinition } from '@/shared/types';
import { SubcategoryBasicFields } from './components/subcategory-basic-fields';
import { FeatureDefinitionEditor } from './components/feature-definition-editor';

const formSchema = z.object({
  name: z.string().min(1, 'Nombre requerido'),
  categoryId: z.string().min(1, 'Categoría requerida'),
  description: z.string().optional(),
  icon: z.string().optional(),
  order: z.number().min(0).optional(),
  isActive: z.boolean(),
});

type FormData = z.infer<typeof formSchema>;

export function SubcategoryFormPage() {
  const { id, categoryId } = useParams<{ id?: string; categoryId?: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [featureDefinitions, setFeatureDefinitions] = useState<FeatureDefinition[]>([]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      categoryId: categoryId || '',
      description: '',
      icon: '',
      order: 0,
      isActive: true,
    },
  });

  // Cargar categorías
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoryService.getAll();
        setCategories(data);
      } catch (error) {
        console.error('Error cargando categorías:', error);
      }
    };

    loadCategories();
  }, []);

  // Cargar subcategoría si es edición
  useEffect(() => {
    const loadSubcategory = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const subcategory = await subcategoryService.getById(id);
        
        if (!subcategory) {
          console.error('Subcategoría no encontrada');
          navigate('/categories');
          return;
        }

        form.reset({
          name: subcategory.name,
          categoryId: subcategory.categoryId,
          description: subcategory.description || '',
          icon: subcategory.icon || '',
          order: subcategory.order || 0,
          isActive: subcategory.isActive,
        });

        setFeatureDefinitions(subcategory.featureDefinitions || []);
      } catch (error) {
        console.error('Error cargando subcategoría:', error);
        navigate('/categories');
      } finally {
        setIsLoading(false);
      }
    };

    loadSubcategory();
  }, [id, form, navigate]);

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);

      // Buscar el nombre de la categoría seleccionada
      const selectedCategory = categories.find(cat => cat.id === data.categoryId);
      if (!selectedCategory) {
        throw new Error('Categoría no encontrada');
      }

      // Generar slug si no existe
      const slug = subcategoryService.generateSlug(data.name);

      const subcategoryData = {
        ...data,
        slug,
        categoryName: selectedCategory.name,
        featureDefinitions,
        createdBy: 'admin', // TODO: Obtener del contexto de autenticación
      };

      if (isEdit && id) {
        await subcategoryService.update(id, subcategoryData);
      } else {
        await subcategoryService.create(subcategoryData);
      }

      navigate('/categories');
    } catch (error) {
      console.error('Error guardando subcategoría:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {isEdit ? 'Editar Subcategoría' : 'Nueva Subcategoría'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <SubcategoryBasicFields
                form={form}
                categories={categories}
                isLoading={isLoading}
              />

              <FeatureDefinitionEditor
                featureDefinitions={featureDefinitions}
                onChange={setFeatureDefinitions}
              />

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isLoading ? 'Guardando...' : 'Guardar'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/categories')}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
