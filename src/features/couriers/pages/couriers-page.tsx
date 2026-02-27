import { useState } from 'react';
import { Plus } from 'lucide-react';
import { PageHeaderGlobal } from '@/shared/components/page-header-global';
import { ButtonGlobal } from '@/shared/components/button-global';
import { LoadingGlobal } from '@/shared/components/loading-global';
import { ErrorGlobal } from '@/shared/components/error-global';
import type { User } from '@/shared/types';
import { useCouriers } from '../hooks/useCouriers';
import { CourierTable } from '../components/courier-table';
import { CourierStats } from '../components/courier-stats';
import { CourierFormDialog } from '../components/courier-form-dialog';

export function CouriersPage() {
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const { data, total, isLoading, error, stats, refetch } = useCouriers(page - 1, PAGE_SIZE);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCourier, setSelectedCourier] = useState<User | null>(null);

  const handleCreate = () => {
    setSelectedCourier(null);
    setDialogOpen(true);
  };

  const handleEdit = (courier: User) => {
    setSelectedCourier(courier);
    setDialogOpen(true);
  };

  const handleSuccess = () => {
    refetch();
  };

  if (isLoading) return <LoadingGlobal message="Cargando repartidores..." />;
  if (error) return <ErrorGlobal message={error} onRetry={refetch} />;

  return (
    <div className="px-2 sm:px-2 py-1 sm:py-2 bg-background space-y-6 sm:space-y-8 max-w-[1600px] mx-auto">
      <PageHeaderGlobal
        title="Repartidores"
        description="Gestiona los usuarios de tipo courier de la plataforma"
        action={
          <ButtonGlobal
            onClick={handleCreate}
            className="bg-primary hover:bg-primary/90 text-foreground font-semibold shadow-sm hover:shadow-md transition-all duration-200 px-5 py-2.5 text-sm rounded-lg"
          >
            <Plus className="w-4 h-4" />
            Nuevo Repartidor
          </ButtonGlobal>
        }
      />

      <CourierStats
        total={stats.total}
        active={stats.active}
        available={stats.available}
      />

      <CourierTable
        data={data}
        loading={isLoading}
        currentPage={page}
        pageSize={PAGE_SIZE}
        total={total}
        onPageChange={setPage}
        onEdit={handleEdit}
      />

      <CourierFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        courier={selectedCourier}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
