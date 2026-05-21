import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { toast } from 'sonner';
import { Timestamp } from 'firebase/firestore';
import { settingsService } from '@/shared/services/settingsService';
import { salesSettingsSchema, type SalesSettingsFormValues } from '../types/settings-feature';
import type { SalesSettings } from '@/shared/types/settings';

/** Convert a Firestore Timestamp (or null) to a datetime-local string (YYYY-MM-DDTHH:mm) */
function timestampToDatetimeLocal(ts: Timestamp | null | undefined): string {
    if (!ts) return '';
    const d = ts.toDate();
    // Pad values to produce a valid datetime-local string in local time
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

interface UseSalesSettingsFormProps {
    salesSettings: SalesSettings | null;
    onSuccess: () => void;
}

export function useSalesSettingsForm({ salesSettings, onSuccess }: UseSalesSettingsFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const defaultValues: SalesSettingsFormValues = {
        sales_enabled: salesSettings?.sales_enabled ?? false,
        date_to_enable_sales: timestampToDatetimeLocal(salesSettings?.date_to_enable_sales),
    };

    const form = useForm<SalesSettingsFormValues>({
        resolver: zodResolver(salesSettingsSchema),
        defaultValues,
    });

    const onSubmit = async (values: SalesSettingsFormValues) => {
        try {
            setIsSubmitting(true);

            let dateTimestamp: Timestamp | null = null;
            if (!values.sales_enabled && values.date_to_enable_sales) {
                const parsedDate = new Date(values.date_to_enable_sales);

                if (Number.isNaN(parsedDate.getTime())) {
                    throw new Error('La fecha de habilitación de ventas no es válida');
                }

                dateTimestamp = Timestamp.fromDate(parsedDate);
            }

            await settingsService.upsertSalesSettings({
                sales_enabled: values.sales_enabled,
                date_to_enable_sales: dateTimestamp,
            });

            toast.success('Configuración de ventas guardada');
            onSuccess();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Error al guardar');
        } finally {
            setIsSubmitting(false);
        }
    };

    return { form, onSubmit: form.handleSubmit(onSubmit), isSubmitting };
}
