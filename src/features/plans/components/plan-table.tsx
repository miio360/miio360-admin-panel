import { TableGlobal, TableGlobalColumn } from '@/shared/components/table-global';
import { Badge } from '@/shared/components/ui/badge';
import { ButtonGlobal } from '@/shared/components/button-global';
import { Edit, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';
import type { Plan, VideoPlan, AdvertisingPlan, LivesPlan } from '../types/plan';
import { ADVERTISING_TYPE_LABELS } from '../types/plan';
import { PlanTableFilters } from './plan-table-filters';
import { usePlanFilters } from '../hooks/usePlanFilters';

interface PlanTableProps {
  plans: Plan[];
  loading: boolean;
  onEdit: (plan: Plan) => void;
  onToggleActive: (plan: Plan) => void;
  onDelete: (plan: Plan) => void;
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
}

function formatPrice(price: number): string {
  return `BOB ${price.toFixed(2)}`;
}

function getSpecificDetails(plan: Plan): string {
  if (plan.planType === 'video') {
    const p = plan as VideoPlan;
    return `${p.videoCount} videos / ${p.videoDurationMinutes} min c/u`;
  }
  if (plan.planType === 'advertising') {
    const p = plan as AdvertisingPlan;
    const typeLabel = ADVERTISING_TYPE_LABELS[p.advertisingType];
    return `${typeLabel} / ${p.daysEnabled} dias`;
  }
  if (plan.planType === 'lives') {
    const p = plan as LivesPlan;
    return `${p.livesDurationMinutes} minutos de lives`;
  }
  return '-';
}

export function PlanTable({
  plans,
  loading,
  onEdit,
  onToggleActive,
  onDelete,
  pagination,
}: PlanTableProps) {
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

  const columns: TableGlobalColumn<Plan>[] = [
    {
      key: 'title',
      header: 'Titulo',
      render: (row) => (
        <span className="font-medium text-foreground">{row.title}</span>
      ),
    },
    {
      key: 'description',
      header: 'Descripcion',
      render: (row) => (
        <span className="text-foreground/70 text-sm line-clamp-2">
          {row.description}
        </span>
      ),
    },
    {
      key: 'details',
      header: 'Detalles',
      render: (row) => (
        <span className="text-sm text-foreground/80">
          {getSpecificDetails(row)}
        </span>
      ),
    },
    {
      key: 'price',
      header: 'Precio',
      align: 'right',
      render: (row) => (
        <span className="font-semibold text-foreground">
          {formatPrice(row.price)}
        </span>
      ),
    },
    {
      key: 'isActive',
      header: 'Estado',
      align: 'center',
      render: (row) => (
        <Badge variant={row.isActive ? 'default' : 'secondary'}>
          {row.isActive ? 'Activo' : 'Inactivo'}
        </Badge>
      ),
    },
  ];

  const renderActions = (row: Plan) => (
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
        onClick={() => onDelete(row)}
        title="Eliminar"
        className="hover:bg-gray-100"
      >
        <Trash2 className="w-4 h-4 text-red-500" />
      </ButtonGlobal>
    </div>
  );

  return (
    <div>
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
      <TableGlobal
        columns={columns}
        data={filteredPlans}
        loading={loading}
        emptyMessage="No hay planes creados"
        actions={renderActions}
        showPagination={!pagination}
        externalPagination={pagination}
      />
    </div>
  );
}
