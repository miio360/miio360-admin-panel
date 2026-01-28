import { useState, useMemo } from 'react';
import type { PaymentReceipt, PaymentReceiptStatus } from '@/shared/types/payment';

export function useReceiptsFilters(receipts: PaymentReceipt[]) {
  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [statusFilter, setStatusFilter] = useState<PaymentReceiptStatus | 'all'>('pending');

  const planOptions = useMemo(() => {
    const set = new Set(receipts.map(r => r.plan.title));
    return Array.from(set);
  }, [receipts]);

  const filteredReceipts = useMemo(() => {
    return receipts.filter(r => {
      const searchLower = search.trim().toLowerCase();
      const matchesSearch =
        !searchLower ||
        r.seller.name.toLowerCase().includes(searchLower) ||
        r.plan.title.toLowerCase().includes(searchLower);
      const matchesPlan = planFilter === 'all' || r.plan.title === planFilter;
      let matchesDate = true;
      let createdAtDate: Date | null = null;
      if (r.createdAt && typeof r.createdAt.toDate === 'function') {
        createdAtDate = r.createdAt.toDate();
      } else if (r.createdAt instanceof Date) {
        createdAtDate = r.createdAt;
      }
      if (dateFrom && createdAtDate) {
        matchesDate = matchesDate && createdAtDate >= new Date(dateFrom);
      }
      if (dateTo && createdAtDate) {
        matchesDate = matchesDate && createdAtDate <= new Date(dateTo);
      }
      const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
      return matchesSearch && matchesPlan && matchesDate && matchesStatus;
    });
  }, [receipts, search, planFilter, dateFrom, dateTo, statusFilter]);

  return {
    search, setSearch,
    planFilter, setPlanFilter,
    dateFrom, setDateFrom,
    dateTo, setDateTo,
    statusFilter, setStatusFilter,
    planOptions,
    filteredReceipts,
  };
}
