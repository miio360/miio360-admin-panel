import { useState } from 'react';
import { usePaymentReceipts } from '../hooks/usePaymentReceipts';
import { paymentReceiptService } from '@/shared/services/paymentReceiptService';
import { useAuth } from '@/shared/hooks/useAuth';
import { PageHeaderGlobal } from '@/shared/components/page-header-global';
import { LoadingGlobal } from '@/shared/components/loading-global';
import { ErrorGlobal } from '@/shared/components/error-global';
import { EmptyStateGlobal } from '@/shared/components/empty-state-global';
import { ReceiptCardGrid } from '../components/receipt-card-grid';
import { RejectDialog } from '../components/reject-dialog';
import { FileText } from 'lucide-react';
import { FilterGlobal } from '@/shared/components/filter-global';
import { useReceiptsFilters } from '../hooks/useReceiptsFilters';
import type { PaymentReceipt, RejectionReason } from '@/shared/types/payment';

export function PaymentReceiptsPage() {
  const { user } = useAuth();
  const { receipts, isLoading, error, refetch } = usePaymentReceipts();
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentReceipt | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const {
    search, setSearch,
    planFilter, setPlanFilter,
    statusFilter,
    setStatusFilter,
    planOptions,
    filteredReceipts
  } = useReceiptsFilters(receipts);


  const handleApprove = async (receipt: PaymentReceipt) => {
    if (!user?.id) return;
    try {
      setActionLoading(true);
      
      // Construir datos del vendedor para el active_plan
      const sellerData = {
        id: receipt.seller.id,
        name: receipt.seller.name,
        profileImage: receipt.seller.avatar || '',
        storeName: receipt.seller.name, // Se usa el nombre como fallback
      };

      const result = await paymentReceiptService.approve(receipt.id, user.id, sellerData);
      console.log('Comprobante aprobado. Plan activo creado:', result.activePlanId);
      await refetch();
    } catch (err) {
      console.error('Error al aprobar:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = (receipt: PaymentReceipt) => {
    setSelectedReceipt(receipt);
    setRejectDialogOpen(true);
  };

  const handleRejectConfirm = async (reason: RejectionReason, comment?: string) => {
    if (!user?.id || !selectedReceipt) return;
    try {
      setActionLoading(true);
      await paymentReceiptService.reject(selectedReceipt.id, user.id, reason, comment);
      setRejectDialogOpen(false);
      setSelectedReceipt(null);
      console.log('Comprobante rechazado');
      await refetch();
    } catch (err) {
      console.error('Error al rechazar:', err);
    } finally {
      setActionLoading(false);
    }
  };


  if (isLoading) return <LoadingGlobal message="Cargando comprobantes..." />;
  if (error) return <ErrorGlobal message={error} onRetry={refetch} />;

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <PageHeaderGlobal
        title="Comprobantes de Pago"
        description="Gestiona las solicitudes de compra de planes"
      />

      <FilterGlobal
        search={search}
        setSearch={setSearch}
        planFilter={planFilter}
        setPlanFilter={setPlanFilter}
        planOptions={planOptions}
        statusFilter={statusFilter as string}
        setStatusFilter={setStatusFilter as (v: string) => void}
        statusLabel="Estado"
        planLabel="Plan"
        searchPlaceholder="Buscar por nombre, email o plan..."
        customStatusOptions={[
          { value: 'all', label: 'Todos' },
          { value: 'pending', label: 'Pendientes' },
          { value: 'approved', label: 'Aprobados' },
          { value: 'rejected', label: 'Rechazados' },
        ]}
      />

      {filteredReceipts.length === 0 ? (
        <EmptyStateGlobal
          icon={<FileText className="w-12 h-12 text-gray-400" />}
          message="No se encontraron comprobantes con los filtros seleccionados"
        />
      ) : (
        <ReceiptCardGrid
          receipts={filteredReceipts}
          onApprove={handleApprove}
          onReject={handleReject}
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
