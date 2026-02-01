import { InputGlobal } from './input-global';
import { SelectGlobal } from './select-global';
import { CalendarDays, Filter } from 'lucide-react';

interface FilterGlobalProps {
  search: string;
  setSearch: (v: string) => void;
  planFilter?: string;
  setPlanFilter?: (v: string) => void;
  planOptions?: string[];
  statusFilter: string;
  setStatusFilter: (v: string) => void;
  dateFrom?: string;
  setDateFrom?: (v: string) => void;
  dateTo?: string;
  setDateTo?: (v: string) => void;
  showDate?: boolean;
  statusLabel?: string;
  planLabel?: string;
  searchPlaceholder?: string;
  showStatusFilter?: boolean;
  customStatusOptions?: { value: string; label: string }[];
  hidePlanFilter?: boolean;
}

export function FilterGlobal({
  search, setSearch,
  planFilter, setPlanFilter,
  planOptions,
  statusFilter, setStatusFilter,
  dateFrom, setDateFrom,
  dateTo, setDateTo,
  showDate = false,
  statusLabel = 'Estado',
  planLabel = 'Plan',
  searchPlaceholder = 'Buscar...',
  showStatusFilter = true,
  customStatusOptions,
  hidePlanFilter = false
}: FilterGlobalProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end gap-6 w-full">
      <div className="flex-1 min-w-[220px]">
        <label className="text-sm font-medium text-foreground mb-1 block">Buscar</label>
        <div className="relative">
          <InputGlobal
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="pr-10 bg-background border border-primary/30 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/30 transition"
          />
          <Filter className="absolute right-2 top-2.5 w-5 h-5 text-muted-foreground" />
        </div>
      </div>
      {showStatusFilter && (
        <div className="min-w-[190px] w-full md:w-auto">
          <label className="text-sm font-medium text-foreground mb-1 block">Filtrar por {statusLabel}</label>
          <SelectGlobal
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="w-full bg-background border border-primary/30 rounded-lg px-3 py-2 focus:border-primary focus:ring-2 focus:ring-primary/30 transition"
          >
            {customStatusOptions
              ? customStatusOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))
              : <>
                <option value="all">Todos</option>
                <option value="active">Activos</option>
                <option value="inactive">Inactivos</option>
              </>
            }
          </SelectGlobal>
        </div>
      )}
      {!hidePlanFilter && planFilter && setPlanFilter && planOptions && (
        <div className="min-w-[190px] w-full md:w-auto">
          <label className="text-sm font-medium text-foreground mb-1 block">Filtrar por {planLabel}</label>
          <SelectGlobal
            value={planFilter}
            onChange={e => setPlanFilter(e.target.value)}
            className="w-full bg-background border border-primary/30 rounded-lg px-3 py-2 focus:border-primary focus:ring-2 focus:ring-primary/30 transition"
          >
            <option value="all">Todos</option>
            {planOptions.map(plan => (
              <option key={plan} value={plan}>{plan}</option>
            ))}
          </SelectGlobal>
        </div>
      )}
      {showDate && setDateFrom && setDateTo && (
        <>
          <div className="flex flex-col gap-1 min-w-[180px]">
            <label className="text-sm font-medium text-foreground mb-1 block">Fecha desde</label>
            <div className="relative">
              <InputGlobal
                type="date"
                value={dateFrom}
                onChange={e => setDateFrom(e.target.value)}
                className="pr-8 bg-background border border-primary/30 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/30 transition"
              />
              <CalendarDays className="absolute right-2 top-2.5 w-5 h-5 text-muted-foreground" />
            </div>
          </div>
          <div className="flex flex-col gap-1 min-w-[180px]">
            <label className="text-sm font-medium text-foreground mb-1 block">Fecha hasta</label>
            <div className="relative">
              <InputGlobal
                type="date"
                value={dateTo}
                onChange={e => setDateTo(e.target.value)}
                className="pr-8 bg-background border border-primary/30 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/30 transition"
              />
              <CalendarDays className="absolute right-2 top-2.5 w-5 h-5 text-muted-foreground" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
