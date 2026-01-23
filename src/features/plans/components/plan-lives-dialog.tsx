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
import { PlanLivesFields } from './plan-lives-fields';
import { useAuth } from '@/shared/hooks/useAuth';
import { planService } from '../services/planService';
import { useState } from 'react';
import type { LivesPlanFormData, LivesPlan } from '../types/plan';

interface PlanLivesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  plan?: LivesPlan | null;
}

export function PlanLivesDialog({
  open,
  onOpenChange,
  onSuccess,
  plan,
}: PlanLivesDialogProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEditing = !!plan;

  const form = useForm<LivesPlanFormData>({
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      isActive: true,
      livesDurationMinutes: 1,
    },
  });

  useEffect(() => {
    if (plan) {
      form.reset({
        title: plan.title,
        description: plan.description,
        price: plan.price,
        isActive: plan.isActive,
        livesDurationMinutes: plan.livesDurationMinutes,
      });
    } else {
      form.reset({
        title: '',
        description: '',
        price: 0,
        isActive: true,
        livesDurationMinutes: 1,
      });
    }
  }, [plan, form]);

  const handleClose = () => {
    form.reset();
    setError(null);
    onOpenChange(false);
  };

  const onSubmit = async (data: LivesPlanFormData) => {
    if (!user?.id) return;
    try {
      setIsSubmitting(true);
      setError(null);
      if (isEditing && plan) {
        await planService.update(plan.id, data);
      } else {
        await planService.createLivesPlan(data, user.id);
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
            {isEditing ? 'Editar Plan de Lives' : 'Crear Plan de Lives'}
          </DialogTitle>
          <DialogDescription className="text-sm">
            {isEditing
              ? 'Modifica los datos del plan de lives'
              : 'Configura un nuevo plan de transmisiones en vivo'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <PlanLivesFields
              register={form.register}
              control={form.control}
              errors={form.formState.errors}
              isActive={form.watch('isActive')}
              onActiveChange={(val) => form.setValue('isActive', val)}
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
