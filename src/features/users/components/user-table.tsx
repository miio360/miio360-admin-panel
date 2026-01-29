import type { User } from '@/shared/types';
import { UserStatus } from '@/shared/types';
import { TableGlobal, TableGlobalColumn } from '@/shared/components/table-global';
import { PaginationGlobal } from '@/shared/components/pagination-global';
import { ButtonGlobal } from '@/shared/components/button-global';
import { useNavigate } from 'react-router-dom';
import { Edit2, Trash2 } from 'lucide-react';

interface UserTableProps {
  data: User[];
  loading: boolean;
  currentPage: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
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

export function UserTable({ data, loading, currentPage, pageSize, total, onPageChange }: UserTableProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const navigate = useNavigate();

  return (
    <div className="space-y-1">
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
            >
              <Trash2 className="w-3.5 h-3.5 text-red-600" />
            </ButtonGlobal>
          </>
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
