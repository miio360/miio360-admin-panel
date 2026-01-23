import { SearchGlobal } from '@/shared/components/search-global';
import { ButtonGlobal } from '@/shared/components/button-global';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { ArrowUpDown } from 'lucide-react';
import type { SortField, SortOrder, StatusFilter } from '../hooks/usePlanFilters';

interface PlanTableFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (value: StatusFilter) => void;
  sortField: SortField;
  onSortFieldChange: (value: SortField) => void;
  sortOrder: SortOrder;
  onToggleSortOrder: () => void;
}

const SORT_FIELD_LABELS: Record<SortField, string> = {
  title: 'Titulo',
  price: 'Precio',
  isActive: 'Estado',
  createdAt: 'Fecha de creacion',
};

export function PlanTableFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortField,
  onSortFieldChange,
  sortOrder,
  onToggleSortOrder,
}: PlanTableFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-4">
      <SearchGlobal
        value={searchTerm}
        onChange={onSearchChange}
        placeholder="Buscar por titulo o descripcion"
        className="sm:max-w-xs"
      />

      <Select
        value={statusFilter}
        onValueChange={(val) => onStatusFilterChange(val as StatusFilter)}
      >
        <SelectTrigger className="w-full sm:w-40 h-10 border border-gray-200">
          <SelectValue placeholder="Estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="active">Activos</SelectItem>
          <SelectItem value="inactive">Inactivos</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={sortField}
        onValueChange={(val) => onSortFieldChange(val as SortField)}
      >
        <SelectTrigger className="w-full sm:w-44 h-10 border border-gray-200">
          <SelectValue placeholder="Ordenar por" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(SORT_FIELD_LABELS).map(([key, label]) => (
            <SelectItem key={key} value={key}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <ButtonGlobal
        variant="outline"
        size="icon"
        onClick={onToggleSortOrder}
        title={sortOrder === 'asc' ? 'Ascendente' : 'Descendente'}
        className="h-10 w-10 shrink-0 hover:bg-gray-100"
      >
        <ArrowUpDown
          className={`w-4 h-4 transition-transform ${
            sortOrder === 'desc' ? 'rotate-180' : ''
          }`}
        />
      </ButtonGlobal>
    </div>
  );
}
