import { useEffect, useState } from 'react';
import { userService } from '@/shared/services/userService';
import type { User, UserRole, UserStatus } from '@/shared/types';

export function useUsers(page = 0, pageSize = 10) {
  const [data, setData] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    userService.getAll({ page, pageSize })
      .then(res => {
        setData(res.users);
        setTotal(res.total);
        setError(null);
      })
      .catch(err => {
        setError(err.message || 'Error al cargar usuarios');
      })
      .finally(() => setIsLoading(false));
  }, [page, pageSize]);

  // Stats
  const stats = {
    total,
    active: data.filter(u => u.status === 'active').length,
    customers: data.filter(u => u.activeRole === 'customer').length,
    sellers: data.filter(u => u.activeRole === 'seller').length,
    couriers: data.filter(u => u.activeRole === 'courier').length,
    admins: data.filter(u => u.activeRole === 'admin').length,
  };

  return { data, total, isLoading, error, stats };
}
