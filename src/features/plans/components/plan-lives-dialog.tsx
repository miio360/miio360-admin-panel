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
      name: '',
      title: '',
      description: '',
      pricePublic: 0,
      priceNet: 0,
      price: 0,
      maxMinutesPerMonth: 1,
      livesDurationMinutes: 1,
      maxConcurrentViewers: 99,
      features: ['clean_signal'],
      triggerPushOnStart: false,
      isActive: true,
      isInitial: false,
    },
  });

  const pricePublic = form.watch('pricePublic');

  useEffect(() => {
    if (pricePublic !== undefined && !isNaN(pricePublic)) {
      form.setValue('priceNet', pricePublic);
    }
  }, [pricePublic, form]);

  useEffect(() => {
    if (plan) {
      const planFeatures = plan.features ?? [];
      const features = planFeatures.includes('clean_signal') ? planFeatures : ['clean_signal', ...planFeatures];
      form.reset({
        name: plan.name || plan.title || '',
        title: plan.title || plan.name || '',
        description: plan.description || '',
        pricePublic: plan.pricePublic ?? plan.price ?? 0,
        priceNet: plan.priceNet ?? 0,
        price: plan.price ?? plan.pricePublic ?? 0,
        maxMinutesPerMonth: plan.maxMinutesPerMonth ?? plan.livesDurationMinutes ?? 1,
        livesDurationMinutes: plan.livesDurationMinutes ?? plan.maxMinutesPerMonth ?? 1,
        maxConcurrentViewers: plan.maxConcurrentViewers ?? 99,
        features,
        triggerPushOnStart: plan.triggerPushOnStart ?? false,
        isActive: plan.isActive,
        isInitial: plan.isInitial ?? false,
      });
    } else {
      form.reset({
        name: '',
        title: '',
        description: '',
        pricePublic: 0,
        priceNet: 0,
        price: 0,
        maxMinutesPerMonth: 1,
        livesDurationMinutes: 1,
        maxConcurrentViewers: 99,
        features: ['clean_signal'],
        triggerPushOnStart: false,
        isActive: true,
        isInitial: false,
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

      const features = data.features ?? [];
      const finalFeatures = features.includes('clean_signal') ? features : ['clean_signal', ...features];

      // Duplicar campos redundantes para seguridad extra antes de enviar
      const payload: LivesPlanFormData = {
        ...data,
        title: data.name,
        price: data.pricePublic,
        livesDurationMinutes: data.maxMinutesPerMonth,
        features: finalFeatures,
      };

      if (isEditing && plan) {
        await planService.update(plan.id, payload, user.id, 'lives');
      } else {
        await planService.createLivesPlan(payload, user.id);
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
