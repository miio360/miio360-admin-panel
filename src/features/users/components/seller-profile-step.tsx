import { UseFormReturn } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { InputGlobal } from '@/shared/components/input-global';
import { Label } from '@/shared/components/ui/label';
import { SelectGlobal } from '@/shared/components/select-global';
import { categoryService } from '@/shared/services/categoryService';
import { Category } from '@/shared/types';
import { UserFormData } from '../user-form-schema';
import { Badge } from '@/shared/components/ui/badge';
import { X } from 'lucide-react';

interface SellerProfileStepProps {
  form: UseFormReturn<UserFormData>;
  isSubmitting: boolean;
}

export function SellerProfileStep({ form, isSubmitting }: SellerProfileStepProps) {
  const { formState: { errors }, register, watch, setValue } = form;
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  
  const categoriesValue = watch('categories');

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoryService.getAll();
        setCategories(data.filter(c => c.isActive));
      } catch (error) {
        console.error('Error cargando categorías:', error);
      } finally {
        setIsLoadingCategories(false);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    if (categoriesValue) {
      setSelectedCategories(categoriesValue.split(',').map(c => c.trim()).filter(Boolean));
    }
  }, [categoriesValue]);

  const toggleCategory = (categoryId: string) => {
    let updated: string[];
    if (selectedCategories.includes(categoryId)) {
      updated = selectedCategories.filter(id => id !== categoryId);
    } else {
      updated = [...selectedCategories, categoryId];
    }
    setSelectedCategories(updated);
    setValue('categories', updated.join(','));
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-1">Perfil de Vendedor</h3>
        <p className="text-sm text-muted-foreground">Información del negocio y categorías de productos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="businessName" className="text-sm font-medium text-foreground">
            Nombre del Negocio <span className="text-red-500">*</span>
          </Label>
          <InputGlobal
            id="businessName"
            placeholder="Mi Tienda"
            {...register('businessName')}
            disabled={isSubmitting}
            className={`h-11 ${errors.businessName ? 'border-red-500' : ''}`}
          />
          {errors.businessName && (
            <p className="text-xs text-red-500 mt-1">{errors.businessName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="businessType" className="text-sm font-medium text-foreground">
            Tipo de Negocio <span className="text-red-500">*</span>
          </Label>
          <SelectGlobal
            {...register('businessType')}
            disabled={isSubmitting}
            className={errors.businessType ? 'border-red-500' : ''}
          >
            <option value="">Selecciona el tipo</option>
            <option value="individual">Persona Física</option>
            <option value="company">Empresa</option>
          </SelectGlobal>
          {errors.businessType && (
            <p className="text-xs text-red-500 mt-1">{errors.businessType.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="businessPhone" className="text-sm font-medium text-foreground">
            Teléfono del Negocio <span className="text-red-500">*</span>
          </Label>
          <InputGlobal
            id="businessPhone"
            placeholder="+52 123 456 7890"
            type="tel"
            {...register('businessPhone')}
            disabled={isSubmitting}
            className={`h-11 ${errors.businessPhone ? 'border-red-500' : ''}`}
          />
          {errors.businessPhone && (
            <p className="text-xs text-red-500 mt-1">{errors.businessPhone.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="businessEmail" className="text-sm font-medium text-foreground">
            Email del Negocio <span className="text-red-500">*</span>
          </Label>
          <InputGlobal
            id="businessEmail"
            placeholder="negocio@ejemplo.com"
            type="email"
            {...register('businessEmail')}
            disabled={isSubmitting}
            className={`h-11 ${errors.businessEmail ? 'border-red-500' : ''}`}
          />
          {errors.businessEmail && (
            <p className="text-xs text-red-500 mt-1">{errors.businessEmail.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="taxId" className="text-sm font-medium text-foreground">
            RFC / Tax ID
          </Label>
          <InputGlobal
            id="taxId"
            placeholder="ABCD123456XYZ"
            {...register('taxId')}
            disabled={isSubmitting}
            className="h-11"
          />
          <p className="text-xs text-muted-foreground">Opcional</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="businessAddress" className="text-sm font-medium text-foreground">
            Dirección del Negocio
          </Label>
          <InputGlobal
            id="businessAddress"
            placeholder="Calle, Ciudad, Estado"
            {...register('businessAddress')}
            disabled={isSubmitting}
            className="h-11"
          />
          <p className="text-xs text-muted-foreground">Opcional</p>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label className="text-sm font-medium text-foreground">
            Categorías de Productos <span className="text-red-500">*</span>
          </Label>
          
          {isLoadingCategories ? (
            <p className="text-sm text-muted-foreground">Cargando categorías...</p>
          ) : (
            <>
              <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg border border-gray-200 min-h-[100px]">
                {categories.map((category) => {
                  const isSelected = selectedCategories.includes(category.id);
                  return (
                    <Badge
                      key={category.id}
                      onClick={() => !isSubmitting && toggleCategory(category.id)}
                      className={`cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? 'bg-primary text-foreground hover:bg-primary/90'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                      }`}
                    >
                      {category.name}
                      {isSelected && <X className="w-3 h-3 ml-1" />}
                    </Badge>
                  );
                })}
              </div>
              {selectedCategories.length > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedCategories.length} categoría(s) seleccionada(s)
                </p>
              )}
              {errors.categories && (
                <p className="text-xs text-red-500 mt-1">{errors.categories.message}</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
