import { useState, useCallback, useEffect } from 'react';
import { userService } from '@/shared/services/userService';
import { ordersTrackingService } from '@/features/orders/api/ordersTrackingService';
import type { CourierSummary } from '@/shared/services/userService';

interface UseAssignCourierReturn {
    couriers: CourierSummary[];
    isLoadingCouriers: boolean;
    couriersError: string | null;
    isAssigning: boolean;
    assignError: string | null;
    assign: (orderId: string, courierId: string) => Promise<boolean>;
    clearAssignError: () => void;
}

/**
 * Loads available couriers and exposes an assign action.
 *
 * @param open - Whether the assign-courier modal is open. Couriers are fetched only when true.
 */
export function useAssignCourier(open: boolean): UseAssignCourierReturn {
    const [couriers, setCouriers] = useState<CourierSummary[]>([]);
    const [isLoadingCouriers, setIsLoadingCouriers] = useState(false);
    const [couriersError, setCouriersError] = useState<string | null>(null);

    const [isAssigning, setIsAssigning] = useState(false);
    const [assignError, setAssignError] = useState<string | null>(null);

    useEffect(() => {
        if (!open) return;

        let cancelled = false;
        setIsLoadingCouriers(true);
        setCouriersError(null);

        userService.getCouriers()
            .then((data) => {
                if (!cancelled) setCouriers(data);
            })
            .catch((err: unknown) => {
                if (cancelled) return;
                const msg = err instanceof Error ? err.message : 'Error al cargar repartidores';
                setCouriersError(msg);
            })
            .finally(() => {
                if (!cancelled) setIsLoadingCouriers(false);
            });

        return () => { cancelled = true; };
    }, [open]);

    const assign = useCallback(async (orderId: string, courierId: string): Promise<boolean> => {
        setIsAssigning(true);
        setAssignError(null);
        try {
            await ordersTrackingService.assignCourier(orderId, courierId);
            return true;
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Error al asignar repartidor';
            setAssignError(msg);
            return false;
        } finally {
            setIsAssigning(false);
        }
    }, []);

    const clearAssignError = useCallback(() => setAssignError(null), []);

    return {
        couriers,
        isLoadingCouriers,
        couriersError,
        isAssigning,
        assignError,
        assign,
        clearAssignError,
    };
}
