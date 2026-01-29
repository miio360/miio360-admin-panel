import { useState } from 'react';
import { TableGlobal, TableGlobalColumn } from '@/shared/components/table-global';
import { ButtonGlobal } from '@/shared/components/button-global';
import { DeleteConfirmDialog } from '@/shared/components/delete-confirm-dialog';
import { LoadingGlobal } from '@/shared/components/loading-global';
import { Edit, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';
import type { LivesPlan } from '../types/plan';
import { PlanCardLives } from './plan-cards/PlanCardLives';
import { PlanCardEmptyState } from './plan-cards/PlanCardEmptyState';
import { PaginationGlobal } from '@/shared/components/pagination-global';
import { PlanTableFilters } from './plan-table-filters';
import { usePlanFilters } from '../hooks/usePlanFilters';
import { getLivesPlanColumns } from '../utils/getLivesPlanColumns';

interface PlanLivesTableProps {
  plans: LivesPlan[];
  loading: boolean;
  onEdit: (plan: LivesPlan) => void;
  onToggleActive: (plan: LivesPlan) => void;
  onDelete: (plan: LivesPlan) => void;
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
}

function formatPrice(price: number): string {
  return `BOB ${price.toFixed(2)}`;
}

export function PlanLivesTable({
  plans,
  loading,
  onEdit,
  onToggleActive,
  onDelete,
  pagination,
}: PlanLivesTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<LivesPlan | null>(null);

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

  const handleDeleteClick = (plan: LivesPlan) => {
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

  const renderActions = (row: LivesPlan) => (
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
        <LoadingGlobal variant="overlay" loading={loading} message="Cargando tabla...">
          <TableGlobal
            columns={getLivesPlanColumns(formatPrice) as TableGlobalColumn<LivesPlan>[]}
            data={filteredPlans as LivesPlan[]}
            loading={false}
            emptyMessage="No hay planes de lives creados"
            actions={renderActions}
            showPagination={!pagination}
            externalPagination={pagination}
          />
        </LoadingGlobal>
      </div>

      {/* Vista Mobile - Cards con paginación */}
      <div className="block md:hidden">
        {(filteredPlans as LivesPlan[]).length === 0 ? (
          <PlanCardEmptyState />
        ) : (
          <LoadingGlobal variant="overlay" loading={loading} message="Cargando página...">
            <div className="flex flex-col gap-4">
              {(pagination
                ? (filteredPlans as LivesPlan[]).slice(
                    (pagination.currentPage - 1) * 10,
                    pagination.currentPage * 10
                  )
                : (filteredPlans as LivesPlan[])
              ).map((plan) => (
                <PlanCardLives
                  key={plan.id}
                  plan={plan}
                  onEdit={() => onEdit(plan)}
                  onToggleActive={() => onToggleActive(plan)}
                  onDelete={() => handleDeleteClick(plan)}
                />
              ))}
            </div>
          </LoadingGlobal>
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
