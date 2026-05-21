import { useState, useEffect, useCallback } from 'react';
import { settingsService } from '@/shared/services/settingsService';
import type { SalesSettings } from '@/shared/types/settings';

export function useSalesSettings() {
    const [salesSettings, setSalesSettings] = useState<SalesSettings | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSalesSettings = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await settingsService.getSalesSettings();
            setSalesSettings(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSalesSettings();
    }, [fetchSalesSettings]);

    return { salesSettings, isLoading, error, refetch: fetchSalesSettings };
}
