import type { User } from '@/shared/types';
import { UserStatus } from '@/shared/types';
import { TableGlobal, TableGlobalColumn } from '@/shared/components/table-global';
import { PaginationGlobal } from '@/shared/components/pagination-global';
import { ButtonGlobal } from '@/shared/components/button-global';
import { useNavigate } from 'react-router-dom';
import { Edit2, Trash2, CalendarDays, UserCircle2 } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface UserTableProps {
  data: User[];
  loading: boolean;
  currentPage: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

const columns: TableGlobalColumn<User>[] = [
  {
    key: 'profile',
    header: 'Email',
    width: 'w-[30%]',
    className: 'font-medium text-gray-900',
    render: (u) => u.profile?.email || '-'
  },
  {
    key: 'activeRole',
    header: 'Rol',
    width: 'w-[20%]',
    render: (u) => {
      const roleMap: Record<string, string> = {
        customer: 'Comprador',
        seller: 'Vendedor',
        courier: 'Repartidor',
        admin: 'Administrador',
      };
      return (
        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700">
          {roleMap[u.activeRole] || u.activeRole}
        </span>
      );
    }
  },
  {
    key: 'status',
    header: 'Estado',
    width: 'w-[20%]',
    align: 'center',
    render: (u) => (
      <div className="flex justify-center">
        <span className={`inline-flex items-center text-xs font-medium px-2 py-1 rounded ${u.status === UserStatus.ACTIVE
          ? "text-green-700 bg-green-50"
          : "text-gray-600 bg-gray-100"
          }`}>
          {u.status === UserStatus.ACTIVE ? "✓ Activo" : "Inactivo"}
        </span>
      </div>
    )
  },
  {
    key: 'createdAt',
    header: 'Creado',
    width: 'w-[20%]',
    className: 'text-gray-600',
    render: (u) => u.createdAt.toDate().toLocaleDateString('es-ES')
  },
];

const ROLE_CONFIG: Record<string, { label: string; className: string }> = {
  customer: { label: 'Comprador', className: 'bg-blue-50 text-blue-700 border border-blue-200' },
  seller: { label: 'Vendedor', className: 'bg-violet-50 text-violet-700 border border-violet-200' },
  courier: { label: 'Repartidor', className: 'bg-amber-50 text-amber-700 border border-amber-200' },
  admin: { label: 'Administrador', className: 'bg-rose-50 text-rose-700 border border-rose-200' },
};

export function UserTable({ data, loading, currentPage, pageSize, total, onPageChange, onDelete, isDeleting = false }: UserTableProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const navigate = useNavigate();

  return (
    <div className="space-y-1">
      {/* ── Desktop table ─────────────────────────────────────── */}
      <div className="hidden sm:block">
        <TableGlobal<User>
          data={data}
          columns={columns}
          loading={loading}
          emptyMessage="No hay usuarios registrados"
          showPagination={false}
          actions={(u) => (
            <>
              <ButtonGlobal
                onClick={() => navigate(`/users/${u.id}/edit`)}
                variant="ghost"
                size="sm"
                className="hover:bg-gray-80 h-8 w-8"
              >
                <Edit2 className="w-3.5 h-3.5 text-gray-600" />
              </ButtonGlobal>
              <ButtonGlobal
                variant="ghost"
                size="sm"
                className="hover:bg-red-50 h-8 w-8"
                onClick={() => onDelete(u.id)}
                disabled={isDeleting}
              >
                <Trash2 className="w-3.5 h-3.5 text-red-600" />
              </ButtonGlobal>
            </>
          )}
        />
      </div>

      {/* ── Mobile card list ───────────────────────────────────── */}
      <div className="sm:hidden space-y-3">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-slate-200 bg-white p-4 space-y-2 animate-pulse">
                <div className="flex justify-between">
                  <div className="h-4 bg-slate-200 rounded w-36" />
                  <div className="h-5 bg-slate-200 rounded-full w-20" />
                </div>
                <div className="h-4 bg-slate-200 rounded w-28" />
                <div className="flex justify-between items-center pt-1">
                  <div className="h-4 bg-slate-200 rounded w-24" />
                  <div className="flex gap-1.5">
                    <div className="h-7 w-7 bg-slate-200 rounded-md" />
                    <div className="h-7 w-7 bg-slate-200 rounded-md" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-12 text-slate-400">
            <UserCircle2 className="w-10 h-10 opacity-40" />
            <p className="text-sm font-medium">No hay usuarios registrados</p>
          </div>
        ) : (
          data.map((u) => {
            const roleCfg = ROLE_CONFIG[u.activeRole] ?? { label: u.activeRole, className: 'bg-slate-100 text-slate-600 border border-slate-200' };
            const isActive = u.status === UserStatus.ACTIVE;
            return (
              <div key={u.id} className="rounded-xl border border-slate-200 bg-white shadow-sm p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {u.profile?.firstName && u.profile?.lastName
                        ? `${u.profile.firstName} ${u.profile.lastName}`
                        : u.profile?.email || '—'}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">{u.profile?.email || '—'}</p>
                  </div>
                  <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium shrink-0', roleCfg.className)}>
                    {roleCfg.label}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className={cn(
                    'inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium',
                    isActive ? 'text-green-700 bg-green-50' : 'text-slate-600 bg-slate-100'
                  )}>
                    {isActive ? 'Activo' : 'Inactivo'}
                  </span>
                  <span className="flex items-center gap-1">
                    <CalendarDays className="w-3.5 h-3.5" />
                    {u.createdAt.toDate().toLocaleDateString('es-ES')}
                  </span>
                </div>

                <div className="flex items-center justify-end pt-1 border-t border-slate-100 gap-1">
                  <ButtonGlobal
                    onClick={() => navigate(`/users/${u.id}/edit`)}
                    variant="ghost"
                    size="sm"
                    className="hover:bg-slate-100 h-8 w-8"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-slate-600" />
                  </ButtonGlobal>
                  <ButtonGlobal
                    variant="ghost"
                    size="sm"
                    className="hover:bg-red-50 h-8 w-8"
                    onClick={() => onDelete(u.id)}
                    disabled={isDeleting}
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-600" />
                  </ButtonGlobal>
                </div>
              </div>
            );
          })
        )}
      </div>

      <PaginationGlobal
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}
