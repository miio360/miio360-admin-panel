import { useState } from 'react';
import { TableGlobal } from '@/shared/components/table-global';
import { ButtonGlobal } from '@/shared/components/button-global';
import { DeleteConfirmDialog } from '@/shared/components/delete-confirm-dialog';
import { Edit, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';
import type { VideoPlan } from '../types/plan';
import { getVideoPlanColumns } from '../utils/getVideoPlanColumns';
import { PlanVideoCardCarousel } from './plan-card-carousel';
import { PlanTableFilters } from './plan-table-filters';
import { usePlanFilters } from '../hooks/usePlanFilters';

interface PlanVideoTableProps {
  plans: VideoPlan[];
  loading: boolean;
  onEdit: (plan: VideoPlan) => void;
  onToggleActive: (plan: VideoPlan) => void;
  onDelete: (plan: VideoPlan) => void;
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
}

function formatPrice(price: number): string {
  return `BOB ${price.toFixed(2)}`;
}

export function PlanVideoTable({
  plans,
  loading,
  onEdit,
  onToggleActive,
  onDelete,
  pagination,
}: PlanVideoTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<VideoPlan | null>(null);

  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    sortField,
    setSortField,
    sortOrder,
    toggleSortOrder,
    filteredPlans,
  } = usePlanFilters(plans);

  const handleDeleteClick = (plan: VideoPlan) => {
    setPlanToDelete(plan);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (planToDelete) {
      onDelete(planToDelete);
      setDeleteDialogOpen(false);
      setPlanToDelete(null);
    }
  };

  const columns = getVideoPlanColumns(formatPrice);

  const renderActions = (row: VideoPlan) => (
    <div className="flex justify-end gap-1">
      <ButtonGlobal
        variant="ghost"
        size="icon"
        onClick={() => onToggleActive(row)}
        title={row.isActive ? 'Desactivar' : 'Activar'}
        className="hover:bg-gray-100"
      >
        {row.isActive ? (
          <ToggleRight className="w-4 h-4 text-green-600" />
        ) : (
          <ToggleLeft className="w-4 h-4 text-gray-400" />
        )}
      </ButtonGlobal>
      <ButtonGlobal
        variant="ghost"
        size="icon"
        onClick={() => onEdit(row)}
        title="Editar"
        className="hover:bg-gray-100"
      >
        <Edit className="w-4 h-4" />
      </ButtonGlobal>
      <ButtonGlobal
        variant="ghost"
        size="icon"
        onClick={() => handleDeleteClick(row)}
        title="Eliminar"
        className="hover:bg-gray-100"
      >
        <Trash2 className="w-4 h-4 text-red-500" />
      </ButtonGlobal>
    </div>
  );

  return (
    <>
      <PlanTableFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        sortField={sortField}
        onSortFieldChange={setSortField}
        sortOrder={sortOrder}
        onToggleSortOrder={toggleSortOrder}
      />

      <div className="hidden md:block">
        <TableGlobal
          columns={columns}
          data={filteredPlans as VideoPlan[]}
          loading={loading}
          emptyMessage="No hay planes de video creados"
          actions={renderActions}
          showPagination={!pagination}
          externalPagination={pagination}
        />
      </div>

      <div className="block md:hidden">
        <PlanVideoCardCarousel
          plans={filteredPlans as VideoPlan[]}
          onEdit={onEdit}
          onToggleActive={onToggleActive}
          onDelete={handleDeleteClick}
        />
      </div>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        itemName={planToDelete?.title}
      />
    </>
  );
}
