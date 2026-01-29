import { useState, useEffect } from 'react';
import { dashboardService } from '../services/dashboardService';
import type { DashboardStats, TopSeller } from '../types/dashboard';

interface UseDashboardReturn {
  stats: DashboardStats | null;
  topSellers: TopSeller[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useDashboard = (): UseDashboardReturn => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [topSellers, setTopSellers] = useState<TopSeller[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [statsData, sellersData] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getTopSellers(5),
      ]);

      setStats(statsData);
      setTopSellers(sellersData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error fetching dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    stats,
    topSellers,
    isLoading,
    error,
    refetch: fetchData,
  };
};
