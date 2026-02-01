import { useState, useMemo } from 'react';
import type { OrderPaymentReceipt, OrderReceiptStatus } from '@/shared/types/recepit';

export function useOrderReceiptsFilters(receipts: OrderPaymentReceipt[]) {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<OrderReceiptStatus | 'all'>('pending');

    const filteredReceipts = useMemo(() => {
        return receipts.filter(r => {
            const searchLower = search.trim().toLowerCase();
            const matchesSearch =
                !searchLower ||
                r.client?.name?.toLowerCase().includes(searchLower) ||
                r.orderNumber?.toLowerCase().includes(searchLower) ||
                r.seller?.name?.toLowerCase().includes(searchLower);

            const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [receipts, search, statusFilter]);

    return {
        search, setSearch,
        statusFilter, setStatusFilter,
        filteredReceipts,
    };
}
