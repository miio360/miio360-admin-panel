import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { Form } from '@/shared/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/shared/components/ui/dialog';
import { FormActionsGlobal } from '@/shared/components/form-actions-global';
import { PlanAdvertisingFields } from './plan-advertising-fields';
import { useAuth } from '@/shared/hooks/useAuth';
import { planService } from '../services/planService';
import { useState } from 'react';
import type { AdvertisingPlanFormData, AdvertisingPlan } from '../types/plan';

interface PlanAdvertisingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  plan?: AdvertisingPlan | null;
}

export function PlanAdvertisingDialog({
  open,
  onOpenChange,
  onSuccess,
  plan,
}: PlanAdvertisingDialogProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEditing = !!plan;

  const form = useForm<AdvertisingPlanFormData>({
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      isActive: true,
      advertisingType: 'store_banner',
      daysEnabled: 1,
    },
  });

  useEffect(() => {
    if (plan) {
      form.reset({
        title: plan.title,
        description: plan.description,
        price: plan.price,
        isActive: plan.isActive,
        advertisingType: plan.advertisingType,
        daysEnabled: plan.daysEnabled,
      });
    } else {
      form.reset({
        title: '',
        description: '',
        price: 0,
        isActive: true,
        advertisingType: 'store_banner',
        daysEnabled: 1,
      });
    }
  }, [plan, form]);

  const handleClose = () => {
    form.reset();
    setError(null);
    onOpenChange(false);
  };

  const onSubmit = async (data: AdvertisingPlanFormData) => {
    if (!user?.id) return;
    try {
      setIsSubmitting(true);
      setError(null);
      if (isEditing && plan) {
        await planService.update(plan.id, data);
      } else {
        await planService.createAdvertisingPlan(data, user.id);
      }
      handleClose();
      onSuccess();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error desconocido';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-lg max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">
            {isEditing ? 'Editar Plan de Publicidad' : 'Crear Plan de Publicidad'}
          </DialogTitle>
          <DialogDescription className="text-sm">
            {isEditing
              ? 'Modifica los datos del plan de publicidad'
              : 'Configura un nuevo plan de publicidad para vendedores'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <PlanAdvertisingFields
              register={form.register}
              control={form.control}
              errors={form.formState.errors}
              isActive={form.watch('isActive')}
              onActiveChange={(val) => form.setValue('isActive', val)}
              advertisingType={form.watch('advertisingType')}
              onAdvertisingTypeChange={(val) =>
                form.setValue('advertisingType', val)
              }
            />

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <FormActionsGlobal
              onCancel={handleClose}
              isSubmitting={isSubmitting}
              isEditing={isEditing}
              submitText={{ creating: 'Crear Plan', editing: 'Guardar Cambios' }}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
