import { useState } from 'react';
import { PageHeaderGlobal } from '@/shared/components/page-header-global';
import { ButtonGlobal } from '@/shared/components/button-global';
import { LoadingGlobal } from '@/shared/components/loading-global';
import { ErrorGlobal } from '@/shared/components/error-global';
import { PlanAdvertisingTable } from '../components/plan-advertising-table';
import { PlanAdvertisingDialog } from '../components/plan-advertising-dialog';
import { usePlans } from '../hooks/usePlans';
import { planService } from '../services/planService';
import { useAuth } from '@/shared/hooks/useAuth';
import { Plus } from 'lucide-react';
import type { AdvertisingPlan } from '../types/plan';

export function PlanAdvertisingPage() {
  const { user } = useAuth();
  const { plans, isLoading, error, currentPage, totalPages, goToPage, refetch } = usePlans('advertising');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<AdvertisingPlan | null>(null);

  const handleEdit = (plan: AdvertisingPlan) => {
    setEditingPlan(plan);
    setDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingPlan(null);
    setDialogOpen(true);
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setEditingPlan(null);
    }
    setDialogOpen(open);
  };

  const handleToggleActive = async (plan: AdvertisingPlan) => {
    try {
      await planService.toggleActive(plan.id, !plan.isActive);
      refetch();
    } catch (err) {
      console.error('Error toggling plan:', err);
    }
  };

  const handleDelete = async (plan: AdvertisingPlan) => {
    if (!user?.id) return;
    try {
      await planService.softDelete(plan.id, user.id);
      refetch();
    } catch (err) {
      console.error('Error deleting plan:', err);
    }
  };

  if (isLoading) {
    return <LoadingGlobal message="Cargando planes de publicidad..." />;
  }

  if (error) {
    return <ErrorGlobal message={error} onRetry={refetch} />;
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <PageHeaderGlobal
        title="Planes de Publicidad"
        description="Gestiona los planes de publicidad para vendedores"
        action={
          <ButtonGlobal
            onClick={handleCreate}
            icon={<Plus className="w-4 h-4" />}
            iconPosition="left"
          >
            Crear Plan
          </ButtonGlobal>
        }
      />

      <PlanAdvertisingTable
        plans={plans as AdvertisingPlan[]}
        loading={isLoading}
        onEdit={handleEdit}
        onToggleActive={handleToggleActive}
        onDelete={handleDelete}
        pagination={{
          currentPage,
          totalPages,
          onPageChange: goToPage,
        }}
      />

      <PlanAdvertisingDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        onSuccess={refetch}
        plan={editingPlan}
      />
    </div>
  );
}
