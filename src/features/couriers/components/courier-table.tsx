import type { User } from '@/shared/types';
import { UserStatus } from '@/shared/types';
import { TableGlobal, type TableGlobalColumn } from '@/shared/components/table-global';
import { PaginationGlobal } from '@/shared/components/pagination-global';
import { ButtonGlobal } from '@/shared/components/button-global';
import { Edit2 } from 'lucide-react';

interface CourierTableProps {
  data: User[];
  loading: boolean;
  currentPage: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onEdit: (courier: User) => void;
}

const columns: TableGlobalColumn<User>[] = [
  {
    key: 'profile',
    header: 'Nombre',
    width: 'w-[22%]',
    className: 'font-medium text-gray-900',
    render: (u) =>
      [u.profile?.firstName, u.profile?.lastName].filter(Boolean).join(' ') || '—',
  },
  {
    key: 'email',
    header: 'Email',
    width: 'w-[26%]',
    className: 'text-gray-600 text-sm',
    render: (u) => u.profile?.email || '—',
  },
  {
    key: 'phone',
    header: 'Teléfono',
    width: 'w-[15%]',
    className: 'text-gray-600 text-sm',
    render: (u) => u.profile?.phone || '—',
  },
  {
    key: 'courierProfile',
    header: 'Placa',
    width: 'w-[12%]',
    render: (u) => (
      <span className="text-sm text-gray-700 font-mono">
        {u.courierProfile?.vehiclePlate || '—'}
      </span>
    ),
  },
  {
    key: 'isAvailable',
    header: 'Disponible',
    width: 'w-[12%]',
    align: 'center',
    render: (u) => (
      <div className="flex justify-center">
        <span
          className={`inline-flex items-center text-xs font-medium px-2 py-1 rounded ${
            u.courierProfile?.isAvailable
              ? 'text-emerald-700 bg-emerald-50'
              : 'text-gray-500 bg-gray-100'
          }`}
        >
          {u.courierProfile?.isAvailable ? 'Sí' : 'No'}
        </span>
      </div>
    ),
  },
  {
    key: 'status',
    header: 'Estado',
    width: 'w-[13%]',
    align: 'center',
    render: (u) => (
      <div className="flex justify-center">
        <span
          className={`inline-flex items-center text-xs font-medium px-2 py-1 rounded ${
            u.status === UserStatus.ACTIVE
              ? 'text-green-700 bg-green-50'
              : 'text-gray-600 bg-gray-100'
          }`}
        >
          {u.status === UserStatus.ACTIVE ? '✓ Activo' : 'Inactivo'}
        </span>
      </div>
    ),
  },
];

export function CourierTable({
  data,
  loading,
  currentPage,
  pageSize,
  total,
  onPageChange,
  onEdit,
}: CourierTableProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="space-y-1">
      <TableGlobal<User>
        data={data}
        columns={columns}
        loading={loading}
        emptyMessage="No hay repartidores registrados"
        showPagination={false}
        actions={(u) => (
          <ButtonGlobal
            onClick={() => onEdit(u)}
            variant="ghost"
            size="sm"
            className="hover:bg-gray-80 h-8 w-8"
          >
            <Edit2 className="w-3.5 h-3.5 text-gray-600" />
          </ButtonGlobal>
        )}
      />
      <PaginationGlobal
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}
