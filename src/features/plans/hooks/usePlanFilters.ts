import { useState, useMemo } from 'react';
import type { Plan } from '../types/plan';

export type SortField = 'title' | 'price' | 'isActive' | 'createdAt';
export type SortOrder = 'asc' | 'desc';
export type StatusFilter = 'all' | 'active' | 'inactive';

interface UsePlanFiltersReturn {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: StatusFilter;
  setStatusFilter: (value: StatusFilter) => void;
  sortField: SortField;
  setSortField: (value: SortField) => void;
  sortOrder: SortOrder;
  toggleSortOrder: () => void;
  filteredPlans: Plan[];
}

export function usePlanFilters(plans: Plan[]): UsePlanFiltersReturn {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const filteredPlans = useMemo(() => {
    let result = [...plans];

    // Filtro por busqueda
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (plan) =>
          plan.title.toLowerCase().includes(term) ||
          plan.description.toLowerCase().includes(term)
      );
    }

    // Filtro por estado
    if (statusFilter !== 'all') {
      const isActive = statusFilter === 'active';
      result = result.filter((plan) => plan.isActive === isActive);
    }

    // Ordenamiento
    result.sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'isActive':
          comparison = Number(a.isActive) - Number(b.isActive);
          break;
        case 'createdAt':
          comparison = a.createdAt.seconds - b.createdAt.seconds;
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [plans, searchTerm, statusFilter, sortField, sortOrder]);

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    sortField,
    setSortField,
    sortOrder,
    toggleSortOrder,
    filteredPlans,
  };
}
