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
import { PlanVideoFields } from './plan-video-fields';
import { useAuth } from '@/shared/hooks/useAuth';
import { planService } from '../services/planService';
import { useState } from 'react';
import type { VideoPlanFormData, VideoPlan } from '../types/plan';

interface PlanVideoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  plan?: VideoPlan | null;
}

export function PlanVideoDialog({
  open,
  onOpenChange,
  onSuccess,
  plan,
}: PlanVideoDialogProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEditing = !!plan;

  const form = useForm<VideoPlanFormData>({
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      isActive: true,
      videoCount: 1,
      videoDurationMinutes: 1,
    },
  });

  useEffect(() => {
    if (plan) {
      form.reset({
        title: plan.title,
        description: plan.description,
        price: plan.price,
        isActive: plan.isActive,
        videoCount: plan.videoCount,
        videoDurationMinutes: plan.videoDurationMinutes,
      });
    } else {
      form.reset({
        title: '',
        description: '',
        price: 0,
        isActive: true,
        videoCount: 1,
        videoDurationMinutes: 1,
      });
    }
  }, [plan, form]);

  const handleClose = () => {
    form.reset();
    setError(null);
    onOpenChange(false);
  };

  const onSubmit = async (data: VideoPlanFormData) => {
    if (!user?.id) return;
    try {
      setIsSubmitting(true);
      setError(null);
      if (isEditing && plan) {
        await planService.update(plan.id, data);
      } else {
        await planService.createVideoPlan(data, user.id);
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
            {isEditing ? 'Editar Plan de Video' : 'Crear Plan de Video'}
          </DialogTitle>
          <DialogDescription className="text-sm">
            {isEditing
              ? 'Modifica los datos del plan de video'
              : 'Configura un nuevo plan de video para vendedores'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <PlanVideoFields
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
