import { useMemo, useState } from 'react';
import { PLAN_TYPE_LABELS } from '@/features/plans/types/plan';
import { getDateFromTimestamp } from '@/shared/lib/utils';
import type { PaymentSettings } from '@/shared/types/payment';

export interface QRTableFilters {
  search: string;
  planFilter: string;
  dateFrom: string;
  dateTo: string;
  statusFilter: 'all' | 'active' | 'inactive';
  setStatusFilter: (v: 'all' | 'active' | 'inactive') => void;
  sortOrder: 'asc' | 'desc';
  currentPage: number;
  pageSize: number;
  setSearch: (v: string) => void;
  setPlanFilter: (v: string) => void;
  setDateFrom: (v: string) => void;
  setDateTo: (v: string) => void;

  setSortOrder: (v: 'asc' | 'desc') => void;
  setCurrentPage: (v: number) => void;
  planOptions: string[];
  paginatedSettings: PaymentSettings[];
  totalPages: number;
  filteredSettings: PaymentSettings[];
}

export function useQRTableFilters(
  settings: PaymentSettings[],
  pageSize: number = 6
): QRTableFilters {
  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  // Eliminado: showOnlyActive. Todo el filtrado de activos/inactivos se maneja por statusFilter.
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);

  const planOptions = useMemo(() => Array.from(new Set(settings.map(s => s.planType))), [settings]);

  const filteredSettings = useMemo(() => {
    let data = settings.filter(s => {
      const searchLower = search.trim().toLowerCase();
      const matchesSearch =
        !searchLower ||
        PLAN_TYPE_LABELS[s.planType].toLowerCase().includes(searchLower) ||
        s.id.toLowerCase().includes(searchLower);
      const matchesPlan = planFilter === 'all' || s.planType === planFilter;
      let matchesDate = true;
      const updatedAtDate = getDateFromTimestamp(s.updatedAt);
      if (dateFrom && updatedAtDate) {
        matchesDate = matchesDate && updatedAtDate >= new Date(dateFrom);
      }
      if (dateTo && updatedAtDate) {
        matchesDate = matchesDate && updatedAtDate <= new Date(dateTo);
      }
      let matchesActive = true;
      if (statusFilter === 'active') matchesActive = s.isActive;
      else if (statusFilter === 'inactive') matchesActive = !s.isActive;
      // 'all' muestra ambos
      return matchesSearch && matchesPlan && matchesDate && matchesActive;
    });
    // Ordenar activos primero SIEMPRE
    data = [...data].sort((a, b) => {
      if (a.isActive && !b.isActive) return -1;
      if (!a.isActive && b.isActive) return 1;
      const dateA = getDateFromTimestamp(a.updatedAt)?.getTime() ?? 0;
      const dateB = getDateFromTimestamp(b.updatedAt)?.getTime() ?? 0;
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
    return data;
  }, [settings, search, planFilter, dateFrom, dateTo, statusFilter, sortOrder]);

  // Paginación: activos siempre en la primera página
  const paginatedSettings = useMemo(() => {
    const activos = filteredSettings.filter(s => s.isActive);
    const inactivos = filteredSettings.filter(s => !s.isActive);
    let pageData: PaymentSettings[] = [];
    if (currentPage === 1) {
      if (activos.length >= pageSize) {
        pageData = activos.slice(0, pageSize);
      } else {
        pageData = [...activos, ...inactivos.slice(0, pageSize - activos.length)];
      }
    } else {
      const start = (currentPage - 2) * pageSize + (pageSize - activos.length > 0 ? pageSize - activos.length : 0);
      pageData = inactivos.slice(start, start + pageSize);
    }
    return pageData;
  }, [filteredSettings, currentPage, pageSize]);

  const totalPages = useMemo(() => {
    const activos = filteredSettings.filter(s => s.isActive);
    const inactivos = filteredSettings.filter(s => !s.isActive);
    if (activos.length >= pageSize) {
      return Math.ceil(activos.length / pageSize) + Math.ceil(inactivos.length / pageSize);
    }
    const firstPageInactivos = Math.max(0, pageSize - activos.length);
    const remainingInactivos = inactivos.length - firstPageInactivos;
    return 1 + (remainingInactivos > 0 ? Math.ceil(remainingInactivos / pageSize) : 0);
  }, [filteredSettings, pageSize]);

  return {
    search,
    planFilter,
    dateFrom,
    dateTo,
    statusFilter,
    setStatusFilter,
    sortOrder,
    currentPage,
    pageSize,
    setSearch,
    setPlanFilter,
    setDateFrom,
    setDateTo,
    setSortOrder,
    setCurrentPage,
    planOptions,
    paginatedSettings,
    totalPages,
    filteredSettings,
  };
}


