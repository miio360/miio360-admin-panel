import { useState, useEffect } from 'react';
import { paymentReceiptService } from '@/shared/services/paymentReceiptService';
import type { PaymentReceipt, PaymentReceiptStatus } from '@/shared/types/payment';

interface UsePaymentReceiptsReturn {
  receipts: PaymentReceipt[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function usePaymentReceipts(status?: PaymentReceiptStatus): UsePaymentReceiptsReturn {
  const [receipts, setReceipts] = useState<PaymentReceipt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReceipts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = status
        ? await paymentReceiptService.getByStatus(status)
        : await paymentReceiptService.getAll();
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
