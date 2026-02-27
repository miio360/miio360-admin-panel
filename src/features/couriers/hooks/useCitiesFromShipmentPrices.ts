import { useState, useEffect } from 'react';
import { shipmentPriceService } from '@/shared/services/shipmentPriceService';

/**
 * Extracts a deduplicated, sorted list of cities (from + to)
 * from the existing shipment prices collection.
 */
export function useCitiesFromShipmentPrices() {
  const [cities, setCities] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    shipmentPriceService
      .getAll()
      .then((prices) => {
        if (cancelled) return;
        const set = new Set<string>();
        prices.forEach((p) => {
          if (p.from) set.add(p.from);
          if (p.to) set.add(p.to);
        });
        setCities(Array.from(set).sort((a, b) => a.localeCompare(b)));
      })
      .catch((err) => {
        console.error('[useCitiesFromShipmentPrices] Error fetching cities:', err);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { cities, isLoading };
}
