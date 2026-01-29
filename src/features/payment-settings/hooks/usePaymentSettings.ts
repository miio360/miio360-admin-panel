import { useState, useEffect } from 'react';
import { paymentSettingsService } from '@/shared/services/paymentSettingsService';
import type { PaymentSettings } from '@/shared/types/payment';

interface UsePaymentSettingsReturn {
  settings: PaymentSettings[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function usePaymentSettings(): UsePaymentSettingsReturn {
  const [settings, setSettings] = useState<PaymentSettings[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await paymentSettingsService.getAll();
      setSettings(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    isLoading,
    error,
    refetch: fetchSettings,
  };
}
