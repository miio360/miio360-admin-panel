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
import { FileText, ShoppingBag, CreditCard } from 'lucide-react';
import { FilterGlobal } from '@/shared/components/filter-global';
import { useReceiptsFilters } from '../hooks/useReceiptsFilters';
import type { PaymentReceipt, RejectionReason } from '@/shared/types/payment';
import type { OrderPaymentReceipt } from '@/shared/types/recepit';

// Order imports
import { useOrderReceipts } from '@/features/orders/hooks/useOrderReceipts';
import { useOrderReceiptsFilters } from '@/features/orders/hooks/useOrderReceiptsFilters';
import { OrderReceiptGrid } from '@/features/orders/components/order-receipt-grid';
import { orderReceiptService } from '@/features/orders/api/orderReceiptService';

export function PaymentReceiptsPage() {
  const { user } = useAuth();

  // State for Tabs
  const [activeTab, setActiveTab] = useState('plans');

  // ==================== PLAN RECEIPTS LOGIC ====================
  const { receipts: planReceipts, isLoading: isLoadingPlans, error: errorPlans, refetch: refetchPlans } = usePaymentReceipts();

  const {
    search: searchPlans, setSearch: setSearchPlans,
    planFilter, setPlanFilter,
    statusFilter: statusFilterPlans,
    setStatusFilter: setStatusFilterPlans,
    planOptions,
    filteredReceipts: filteredPlanReceipts
  } = useReceiptsFilters(planReceipts);

  // ==================== ORDER RECEIPTS LOGIC ====================
  const { receipts: orderReceipts, isLoading: isLoadingOrders, error: errorOrders, refetch: refetchOrders } = useOrderReceipts();

  const {
    search: searchOrders, setSearch: setSearchOrders,
    statusFilter: statusFilterOrders,
    setStatusFilter: setStatusFilterOrders,
    filteredReceipts: filteredOrderReceipts
  } = useOrderReceiptsFilters(orderReceipts);


  // ==================== COMMON STATE ====================
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentReceipt | OrderPaymentReceipt | null>(null);
  const [selectedReceiptType, setSelectedReceiptType] = useState<'plan' | 'order' | null>(null);
  const [actionLoading, setActionLoading] = useState(false);


  // ==================== ACTIONS ====================

  // --- PLANS ---
  const handleApprovePlan = async (receipt: PaymentReceipt) => {
    if (!user?.id) return;
    try {
      setActionLoading(true);
      const sellerData = {
        id: receipt.seller.id,
        name: receipt.seller.name,
        profileImage: receipt.seller.avatar || '',
        storeName: receipt.seller.name,
      };
      await paymentReceiptService.approve(receipt.id, user.id, sellerData);
      await refetchPlans();
    } catch (err) {
      console.error('Error al aprobar plan:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectPlan = (receipt: PaymentReceipt) => {
    setSelectedReceipt(receipt);
    setSelectedReceiptType('plan');
    setRejectDialogOpen(true);
  };


  // --- ORDERS ---
  const handleApproveOrder = async (receipt: OrderPaymentReceipt) => {
    if (!user?.id) return;
    try {
      setActionLoading(true);
      await orderReceiptService.approve(receipt.id, user.id);
      await refetchOrders();
    } catch (err) {
      console.error('Error al aprobar orden:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectOrder = (receipt: OrderPaymentReceipt) => {
    setSelectedReceipt(receipt);
    setSelectedReceiptType('order');
    setRejectDialogOpen(true);
  };


  // --- REJECT CONFIRM ---
  const handleRejectConfirm = async (reason: RejectionReason, comment?: string) => {
    if (!user?.id || !selectedReceipt || !selectedReceiptType) return;

    try {
      setActionLoading(true);

      if (selectedReceiptType === 'plan') {
        await paymentReceiptService.reject(selectedReceipt.id, user.id, reason, comment);
        await refetchPlans();
      } else {
        await orderReceiptService.reject(selectedReceipt.id, user.id, reason, comment);
        await refetchOrders();
      }

      setRejectDialogOpen(false);
      setSelectedReceipt(null);
      setSelectedReceiptType(null);
    } catch (err) {
      console.error('Error al rechazar:', err);
    } finally {
      setActionLoading(false);
    }
  };


  if (isLoadingPlans && activeTab === 'plans') return <LoadingGlobal message="Cargando comprobantes de planes..." />;
  if (isLoadingOrders && activeTab === 'orders') return <LoadingGlobal message="Cargando comprobantes de pedidos..." />;

  if (errorPlans && activeTab === 'plans') return <ErrorGlobal message={errorPlans} onRetry={refetchPlans} />;

  // Note: We might want to handle errorOrders separately or just show global error if current tab fails


  return (
    <div className="space-y-6 p-4 sm:p-6">
      <PageHeaderGlobal
        title="Comprobantes de Pago"
        description="Gestiona las solicitudes de compra y pagos"
      />

      {/* Custom Tabs */}
      <div className="w-full max-w-[400px] grid grid-cols-2 mb-6 bg-slate-100 p-1 rounded-xl">
        <button
          onClick={() => setActiveTab('plans')}
          className={`flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'plans'
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-slate-500 hover:text-slate-700'
            }`}
        >
          <CreditCard className="w-4 h-4" />
          Planes
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'orders'
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-slate-500 hover:text-slate-700'
            }`}
        >
          <ShoppingBag className="w-4 h-4" />
          Pedidos
        </button>
      </div>

      {/* ==================== PLANES TAB ==================== */}
      {activeTab === 'plans' && (
        <div className="space-y-6">
          <FilterGlobal
            search={searchPlans}
            setSearch={setSearchPlans}
            planFilter={planFilter}
            setPlanFilter={setPlanFilter}
            planOptions={planOptions}
            statusFilter={statusFilterPlans as string}
            setStatusFilter={setStatusFilterPlans as (v: string) => void}
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

          {filteredPlanReceipts.length === 0 ? (
            <EmptyStateGlobal
              icon={<FileText className="w-12 h-12 text-gray-400" />}
              message="No se encontraron comprobantes de planes"
            />
          ) : (
            <ReceiptCardGrid
              receipts={filteredPlanReceipts}
              onApprove={handleApprovePlan}
              onReject={handleRejectPlan}
              disabled={actionLoading}
              pageSize={4}
            />
          )}
        </div>
      )}

      {/* ==================== PEDIDOS TAB ==================== */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <FilterGlobal
            search={searchOrders}
            setSearch={setSearchOrders}
            statusFilter={statusFilterOrders as string}
            setStatusFilter={setStatusFilterOrders as (v: string) => void}
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

          {filteredOrderReceipts.length === 0 ? (
            <EmptyStateGlobal
              icon={<ShoppingBag className="w-12 h-12 text-gray-400" />}
              message="No se encontraron comprobantes de pedidos"
            />
          ) : (
            <OrderReceiptGrid
              receipts={filteredOrderReceipts}
              onApprove={handleApproveOrder}
              onReject={handleRejectOrder}
              disabled={actionLoading}
              pageSize={4}
            />
          )}
        </div>
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
