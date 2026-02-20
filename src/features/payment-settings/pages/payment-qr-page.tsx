import { useEffect, useState } from 'react';
import { usePaymentSettings } from '../hooks/usePaymentSettings';
import { paymentSettingsService } from '@/shared/services/paymentSettingsService';
import { useAuth } from '@/shared/hooks/useAuth';
import { PageHeaderGlobal } from '@/shared/components/page-header-global';
import { ButtonGlobal } from '@/shared/components/button-global';
import { PaginationGlobal } from '@/shared/components/pagination-global';
import { LoadingGlobal } from '@/shared/components/loading-global';
import { ErrorGlobal } from '@/shared/components/error-global';
import { EmptyStateGlobal } from '@/shared/components/empty-state-global';
import { DeleteConfirmDialog } from '@/shared/components/delete-confirm-dialog';
import { QRTable } from '../components/qr-table';
import { QRDialog } from '../components/qr-dialog';
import { Plus } from 'lucide-react';
import { useQRTableFilters } from '../hooks/useQRTableFilters';
import { ActiveQRList } from '../components/active-qr-list';
import { FilterGlobal } from '@/shared/components/filter-global';
import type { PaymentSettings } from '@/shared/types/payment';

export function PaymentQRPage() {
  const { user } = useAuth();
  const { settings, isLoading, error, refetch } = usePaymentSettings();
  const [activeQRs, setActiveQRs] = useState<PaymentSettings[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingSetting, setEditingSetting] = useState<PaymentSettings | null>(null);
  const [deletingSetting, setDeletingSetting] = useState<PaymentSettings | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const {
    search, setSearch,
    planFilter, setPlanFilter,
    statusFilter, setStatusFilter,
    planOptions,
    currentPage, setCurrentPage,
    paginatedSettings, totalPages, filteredSettings
  } = useQRTableFilters(settings, 6);

  useEffect(() => {
    const loadActiveQRs = async () => {
      try {
        const actives = await paymentSettingsService.getActiveQRs();
        setActiveQRs(actives);
      } catch (err) {
        console.error('Error loading active QRs:', err);
      }
    };
    if (!isLoading) {
      loadActiveQRs();
    }
  }, [settings, isLoading]);

  if (isLoading) return <LoadingGlobal message="Cargando configuración de QR..." />;
  if (error) return <ErrorGlobal message={error} onRetry={refetch} />;

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <PageHeaderGlobal
        title="Gestión de QR de Pago"
        description="Configura los códigos QR para cada tipo de plan"
        action={
          <ButtonGlobal
            onClick={() => { setEditingSetting(null); setDialogOpen(true); }}
            icon={<Plus className="w-4 h-4" />}
            iconPosition="left"
          >
            Nuevo QR
          </ButtonGlobal>
        }
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
        searchPlaceholder="Buscar por plan..."
      />

      <ActiveQRList activeQRs={activeQRs} />

      {filteredSettings.length === 0 ? (
        <EmptyStateGlobal
          icon={<span className="w-12 h-12" />}
          message="No hay códigos QR configurados"
          actionLabel="Crear primer QR"
          onAction={() => { setEditingSetting(null); setDialogOpen(true); }}
        />
      ) : (
        <QRTable
          settings={paginatedSettings}
          onEdit={(setting) => { setEditingSetting(setting); setDialogOpen(true); }}
          onDelete={(setting) => { setDeletingSetting(setting); setDeleteDialogOpen(true); }}
          onDisable={async (setting) => {
            if (!user?.id) return;
            try {
              setActionLoading(true);
              await paymentSettingsService.toggleActive(setting.id, user.id);
              await refetch();
            } catch (err) {
              console.error('Error:', err);
            } finally {
              setActionLoading(false);
            }
          }}
          disabled={actionLoading}
        />
      )}

      <PaginationGlobal
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        className="mt-2"
      />

      <QRDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onConfirm={async (planType, file) => {
          if (!user?.id) return;
          try {
            setActionLoading(true);
            if (editingSetting) {
              await paymentSettingsService.update(editingSetting.id, file, user.id);
            } else {
              await paymentSettingsService.create(planType, file, user.id);
            }
            setDialogOpen(false);
            setEditingSetting(null);
            await refetch();
          } catch (err) {
            console.error('Error:', err);
          } finally {
            setActionLoading(false);
          }
        }}
        isLoading={actionLoading}
        editingSetting={editingSetting}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={async () => {
          if (!user?.id || !deletingSetting) return;
          try {
            setActionLoading(true);
            await paymentSettingsService.softDelete(deletingSetting.id, user.id);
            setDeleteDialogOpen(false);
            setDeletingSetting(null);
            await refetch();
          } catch (err) {
            console.error('Error:', err);
          } finally {
            setActionLoading(false);
          }
        }}
        title="Eliminar QR"
        description="¿Estás seguro de que deseas eliminar este código QR? Esta acción no se puede deshacer."
        isLoading={actionLoading}
      />
    </div>
  );
}
