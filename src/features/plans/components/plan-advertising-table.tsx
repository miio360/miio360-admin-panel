import { useState } from 'react';
import { TableGlobal, TableGlobalColumn } from '@/shared/components/table-global';
import { ButtonGlobal } from '@/shared/components/button-global';
import { DeleteConfirmDialog } from '@/shared/components/delete-confirm-dialog';
import { Edit, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';
import type { AdvertisingPlan } from '../types/plan';
import { PlanCardAdvertising } from './plan-cards/PlanCardAdvertising';
import { PlanCardEmptyState } from './plan-cards/PlanCardEmptyState';
import { PaginationGlobal } from '@/shared/components/pagination-global';
import { PlanTableFilters } from './plan-table-filters';
import { usePlanFilters } from '../hooks/usePlanFilters';
import { getAdvertisingPlanColumns } from '../utils/getAdvertisingPlanColumns';

interface PlanAdvertisingTableProps {
  plans: AdvertisingPlan[];
  loading: boolean;
  onEdit: (plan: AdvertisingPlan) => void;
  onToggleActive: (plan: AdvertisingPlan) => void;
  onDelete: (plan: AdvertisingPlan) => void;
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
}

function formatPrice(price: number): string {
  return `BOB ${price.toFixed(2)}`;
}

export function PlanAdvertisingTable({
  plans,
  loading,
  onEdit,
  onToggleActive,
  onDelete,
  pagination,
}: PlanAdvertisingTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<AdvertisingPlan | null>(null);

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

  const handleDeleteClick = (plan: AdvertisingPlan) => {
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

  const renderActions = (row: AdvertisingPlan) => (
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
      {/* Filtros */}
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

      {/* Vista Desktop */}
      <div className="hidden md:block">
        <TableGlobal
          columns={getAdvertisingPlanColumns(formatPrice) as TableGlobalColumn<AdvertisingPlan>[]}
          data={filteredPlans as AdvertisingPlan[]}
          loading={loading}
          emptyMessage="No hay planes de publicidad creados"
          actions={renderActions}
          showPagination={!pagination}
          externalPagination={pagination}
        />
      </div>

      {/* Vista Mobile - Cards con paginación (server-side) */}
      <div className="block md:hidden">
        {(filteredPlans as AdvertisingPlan[]).length === 0 ? (
          <PlanCardEmptyState />
        ) : (
          <div className="flex flex-col gap-4">
            {(filteredPlans as AdvertisingPlan[]).map((plan) => (
              <PlanCardAdvertising
                key={plan.id}
                plan={plan}
                onEdit={() => onEdit(plan)}
                onToggleActive={() => onToggleActive(plan)}
                onDelete={() => handleDeleteClick(plan)}
              />
            ))}
          </div>
        )}
        {pagination && (
          <div className="mt-4">
            <PaginationGlobal
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={pagination.onPageChange}
            />
          </div>
        )}
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
