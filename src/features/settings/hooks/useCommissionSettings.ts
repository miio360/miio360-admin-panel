import { useState, useCallback, useEffect } from 'react';
import { commissionService } from '@/shared/services/commissionService';
import type { CommissionPriceSettings, CommissionHistoryEntry } from '@/shared/types/settings';

interface UseCommissionSettingsReturn {
    commission: CommissionPriceSettings | null;
    history: CommissionHistoryEntry[];
    isLoading: boolean;
    error: string | null;
    refetch: () => void;
}

export function useCommissionSettings(): UseCommissionSettingsReturn {
    const [commission, setCommission] = useState<CommissionPriceSettings | null>(null);
    const [history, setHistory] = useState<CommissionHistoryEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAll = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [data, histData] = await Promise.all([
                commissionService.get(),
                commissionService.getHistory(20),
            ]);
            setCommission(data);
            setHistory(histData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar comisiones');
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Fetch on mount
    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    return { commission, history, isLoading, error, refetch: fetchAll };
}
