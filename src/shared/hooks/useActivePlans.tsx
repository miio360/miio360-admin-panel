import { useState, useEffect, useCallback } from 'react';
import { activePlanService } from '../services/activePlanService';
import type { ActivePlan, ActivePlanStatus } from '../types/active-plan';

interface UseActivePlansOptions {
  sellerId?: string;
  status?: ActivePlanStatus;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

interface UseActivePlansReturn {
  plans: ActivePlan[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useActivePlans(options: UseActivePlansOptions = {}): UseActivePlansReturn {
  const { sellerId, status, autoRefresh = false, refreshInterval = 60000 } = options;
  
  const [plans, setPlans] = useState<ActivePlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlans = useCallback(async () => {
    try {
      setError(null);
      let data: ActivePlan[];

      if (sellerId) {
        data = await activePlanService.getBySellerId(sellerId);
      } else if (status) {
        data = await activePlanService.getByStatus(status);
      } else {
        data = await activePlanService.getAll();
      }

      setPlans(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [sellerId, status]);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    await fetchPlans();
  }, [fetchPlans]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchPlans();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchPlans]);

  return {
    plans,
    isLoading,
    error,
    refetch,
  };
}
