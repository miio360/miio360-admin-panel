import { useState, useEffect, useCallback } from 'react';
import { settingsService } from '@/shared/services/settingsService';
import type { AppSettings } from '@/shared/types/settings';

export function useSettings() {
    const [settings, setSettings] = useState<AppSettings | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSettings = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await settingsService.get();
            setSettings(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    return { settings, isLoading, error, refetch: fetchSettings };
}
