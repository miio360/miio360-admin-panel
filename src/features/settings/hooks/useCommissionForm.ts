import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { toast } from 'sonner';
import { commissionService } from '@/shared/services/commissionService';
import { useAuth } from '@/shared/hooks/useAuth';
import { commissionSchema, type CommissionFormValues } from '../types/commission-feature';
import type { CommissionPriceSettings } from '@/shared/types/settings';

interface UseCommissionFormProps {
    commission: CommissionPriceSettings | null;
    onSuccess: () => void;
}

export function useCommissionForm({ commission, onSuccess }: UseCommissionFormProps) {
    const { user } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<CommissionFormValues>({
        resolver: zodResolver(commissionSchema),
        defaultValues: {
            appService: commission?.appService ?? 0,
            sellerService: commission?.sellerService ?? 0,
            courierService: commission?.courierService ?? 0,
            notes: '',
        },
    });

    const onSubmit = async (values: CommissionFormValues) => {
        if (!user?.id) return;
        const userName = [user.profile?.firstName, user.profile?.lastName]
            .filter(Boolean)
            .join(' ') || user.email || 'Admin';
        try {
            setIsSubmitting(true);
            await commissionService.update(
                {
                    appService: values.appService,
                    sellerService: values.sellerService,
                    courierService: values.courierService,
                },
                user.id,
                userName,
                values.notes
            );
            toast.success('Comisiones actualizadas correctamente');
            form.setValue('notes', '');
            onSuccess();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Error al guardar comisiones');
        } finally {
            setIsSubmitting(false);
        }
    };

    return { form, onSubmit: form.handleSubmit(onSubmit), isSubmitting };
}
