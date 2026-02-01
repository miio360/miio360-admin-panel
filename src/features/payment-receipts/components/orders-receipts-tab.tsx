import { useState } from 'react';
import { LoadingGlobal } from '@/shared/components/loading-global';
import { ErrorGlobal } from '@/shared/components/error-global';
import { EmptyStateGlobal } from '@/shared/components/empty-state-global';
import { FilterGlobal } from '@/shared/components/filter-global';
import { ShoppingBag } from 'lucide-react';
import { OrderReceiptGrid } from '@/features/orders/components/order-receipt-grid';
import { useOrderReceipts } from '@/features/orders/hooks/useOrderReceipts';
import { useOrderReceiptsFilters } from '@/features/orders/hooks/useOrderReceiptsFilters';
import type { OrderPaymentReceipt } from '@/shared/types/recepit';
import { orderReceiptService } from '@/features/orders/api/orderReceiptService';
import { useAuth } from '@/shared/hooks/useAuth';
import { RejectionReason } from '@/shared/types/payment';
import { RejectDialog } from './reject-dialog';

export function OrdersReceiptsTab() {
    const { user } = useAuth();
    const { receipts, isLoading, error, refetch } = useOrderReceipts();

    const {
        search, setSearch,
        statusFilter,
        setStatusFilter,
        filteredReceipts
    } = useOrderReceiptsFilters(receipts);

    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [selectedReceipt, setSelectedReceipt] = useState<OrderPaymentReceipt | null>(null);
    const [actionLoading, setActionLoading] = useState(false);

    const handleApprove = async (receipt: OrderPaymentReceipt) => {
        if (!user?.id) return;
        try {
            setActionLoading(true);
            await orderReceiptService.approve(receipt.id, user.id);
            await refetch();
        } catch (err) {
            console.error('Error al aprobar orden:', err);
        } finally {
            setActionLoading(false);
        }
    };

    const handleRejectClick = (receipt: OrderPaymentReceipt) => {
        setSelectedReceipt(receipt);
        setRejectDialogOpen(true);
    };

    const handleRejectConfirm = async (reason: RejectionReason, comment?: string) => {
        if (!user?.id || !selectedReceipt) return;
        try {
            setActionLoading(true);
            await orderReceiptService.reject(selectedReceipt.id, user.id, reason, comment);
            await refetch();
            setRejectDialogOpen(false);
            setSelectedReceipt(null);
        } catch (err) {
            console.error('Error al rechazar:', err);
        } finally {
            setActionLoading(false);
        }
    };

    if (isLoading) return <LoadingGlobal message="Cargando comprobantes de pedidos..." />;
    if (error) return <ErrorGlobal message={error} onRetry={refetch} />;

    return (
        <div className="space-y-6">
            <FilterGlobal
                search={search}
                setSearch={setSearch}
                statusFilter={statusFilter as string}
                setStatusFilter={setStatusFilter as (v: string) => void}
                statusLabel="Estado"
                searchPlaceholder="Buscar por cliente, orden o vendedor..."
                customStatusOptions={[
                    { value: 'all', label: 'Todos' },
                    { value: 'pending', label: 'Pendientes' },
                    { value: 'approved', label: 'Aprobados' },
                    { value: 'rejected', label: 'Rechazados' },
                ]}
                hidePlanFilter={true}
            />

            {filteredReceipts.length === 0 ? (
                <EmptyStateGlobal
                    icon={<ShoppingBag className="w-12 h-12 text-gray-400" />}
                    message="No se encontraron comprobantes de pedidos"
                />
            ) : (
                <OrderReceiptGrid
                    receipts={filteredReceipts}
                    onApprove={handleApprove}
                    onReject={handleRejectClick}
                    disabled={actionLoading}
                    pageSize={4}
                />
            )}

            <RejectDialog
                open={rejectDialogOpen}
                onOpenChange={setRejectDialogOpen}
                onConfirm={handleRejectConfirm}
                isLoading={actionLoading}
            />
        </div>
    );
}

