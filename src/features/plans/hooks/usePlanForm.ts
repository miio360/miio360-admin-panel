import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/shared/hooks/useAuth';
import { planService } from '../services/planService';
import type {
  Plan,
  PlanType,
  VideoPlanFormData,
  AdvertisingPlanFormData,
  LivesPlanFormData,
} from '../types/plan';

interface UsePlanFormReturn {
  plan: Plan | null;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  submitVideoPlan: (data: VideoPlanFormData) => Promise<void>;
  submitAdvertisingPlan: (data: AdvertisingPlanFormData) => Promise<void>;
  submitLivesPlan: (data: LivesPlanFormData) => Promise<void>;
}

export function usePlanForm(
  planId: string | undefined,
  planType: PlanType
): UsePlanFormReturn {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [isLoading, setIsLoading] = useState(!!planId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!planId) return;
    const fetchPlan = async () => {
      try {
        setIsLoading(true);
        const data = await planService.getById(planId);
        setPlan(data);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Error desconocido';
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlan();
  }, [planId]);

  const getRedirectPath = useCallback(() => {
    return `/plans/${planType}`;
  }, [planType]);

  const submitVideoPlan = useCallback(
    async (data: VideoPlanFormData) => {
      if (!user?.id) return;
      try {
        setIsSubmitting(true);
        setError(null);
        if (planId) {
          await planService.update(planId, data);
        } else {
          await planService.createVideoPlan(data, user.id);
        }
        navigate(getRedirectPath());
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Error desconocido';
        setError(msg);
      } finally {
        setIsSubmitting(false);
      }
    },
    [planId, user?.id, navigate, getRedirectPath]
  );

  const submitAdvertisingPlan = useCallback(
    async (data: AdvertisingPlanFormData) => {
      if (!user?.id) return;
      try {
        setIsSubmitting(true);
        setError(null);
        if (planId) {
          await planService.update(planId, data);
        } else {
          await planService.createAdvertisingPlan(data, user.id);
        }
        navigate(getRedirectPath());
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Error desconocido';
        setError(msg);
      } finally {
        setIsSubmitting(false);
      }
    },
    [planId, user?.id, navigate, getRedirectPath]
  );

  const submitLivesPlan = useCallback(
    async (data: LivesPlanFormData) => {
      if (!user?.id) return;
      try {
        setIsSubmitting(true);
        setError(null);
        if (planId) {
          await planService.update(planId, data);
        } else {
          await planService.createLivesPlan(data, user.id);
        }
        navigate(getRedirectPath());
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Error desconocido';
        setError(msg);
      } finally {
        setIsSubmitting(false);
      }
    },
    [planId, user?.id, navigate, getRedirectPath]
  );

  return {
    plan,
    isLoading,
    isSubmitting,
    error,
    submitVideoPlan,
    submitAdvertisingPlan,
    submitLivesPlan,
  };
}
