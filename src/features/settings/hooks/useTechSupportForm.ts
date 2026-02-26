import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { toast } from 'sonner';
import { serverTimestamp } from 'firebase/firestore';
import { settingsService } from '@/shared/services/settingsService';
import { useAuth } from '@/shared/hooks/useAuth';
import {
    techSupportSchema,
    WHATSAPP_COUNTRY_CODE,
    type TechSupportFormValues,
} from '../types/settings-feature';
import type { AppSettings } from '@/shared/types/settings';

interface UseTechSupportFormProps {
    settings: AppSettings | null;
    onSuccess: () => void;
}

export function useTechSupportForm({ settings, onSuccess }: UseTechSupportFormProps) {
    const { user } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const defaultValues: TechSupportFormValues = {
        displayName: settings?.techSupport?.whatsapp?.displayName ?? 'Soporte MIIO',
        phoneNumber: settings?.techSupport?.whatsapp?.phoneNumber ?? '',
        isActive: settings?.techSupport?.whatsapp?.isActive ?? true,
    };

    const form = useForm<TechSupportFormValues>({
        resolver: zodResolver(techSupportSchema),
        defaultValues,
    });

    const onSubmit = async (values: TechSupportFormValues) => {
        if (!user?.id) return;
        try {
            setIsSubmitting(true);
            await settingsService.upsertTechSupport(
                {
                    whatsapp: {
                        phoneNumber: values.phoneNumber,
                        countryCode: WHATSAPP_COUNTRY_CODE,
                        displayName: values.displayName,
                        isActive: values.isActive,
                    },
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    updatedAt: serverTimestamp() as any,
                    updatedBy: user.id,
                },
                user.id
            );
            toast.success('Número de WhatsApp guardado correctamente');
            onSuccess();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Error al guardar');
        } finally {
            setIsSubmitting(false);
        }
    };

    return { form, onSubmit: form.handleSubmit(onSubmit), isSubmitting };
}
