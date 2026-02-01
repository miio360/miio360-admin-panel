import { useState, useEffect } from 'react';
import { orderReceiptService } from '../api/orderReceiptService';
import type { OrderPaymentReceipt, OrderReceiptStatus } from '@/shared/types/recepit';

interface UseOrderReceiptsReturn {
    receipts: OrderPaymentReceipt[];
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export function useOrderReceipts(status?: OrderReceiptStatus): UseOrderReceiptsReturn {
    const [receipts, setReceipts] = useState<OrderPaymentReceipt[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchReceipts = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = status
                ? await orderReceiptService.getByStatus(status)
                : await orderReceiptService.getAll();
            setReceipts(data);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Error desconocido';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReceipts();
    }, [status]);

    return {
        receipts,
        isLoading,
        error,
        refetch: fetchReceipts,
    };
}
