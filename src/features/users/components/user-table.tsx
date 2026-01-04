import type { User } from '@/shared/types';
import { UserStatus } from '@/shared/types';
import { TableGlobal, TableGlobalColumn } from '@/shared/components/table-global';
import { CardGlobal, CardGlobalContent } from '@/shared/components/card-global';
import { PaginationGlobal } from '@/shared/components/pagination-global';
import { ButtonGlobal } from '@/shared/components/button-global';
import { Link } from 'react-router-dom';
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
    key: 'email', 
    header: 'Email',
    width: 'w-[30%]',
    className: 'font-medium text-gray-900'
  },
  { 
    key: 'activeRole', 
    header: 'Rol',
    width: 'w-[20%]',
    render: (u) => (
      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700">
        {u.activeRole}
      </span>
    )
  },
  { 
    key: 'status', 
    header: 'Estado',
    width: 'w-[20%]',
    align: 'center',
    render: (u) => (
      <div className="flex justify-center">
        <span className={`inline-flex items-center text-xs font-medium px-2 py-1 rounded ${
          u.status === UserStatus.ACTIVE 
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

  return (
    <CardGlobal>
      <CardGlobalContent className="p-0">
        <TableGlobal<User>
          data={data}
          columns={columns}
          loading={loading}
          emptyMessage="No hay usuarios registrados"
          showPagination={false}
          actions={(u) => (
            <>
              <ButtonGlobal
                asChild
                variant="ghost"
                size="iconSm"
                className="hover:bg-gray-100 h-8 w-8"
              >
                <Link to={`/users/${u.id}/edit`}>
                  <Edit2 className="w-3.5 h-3.5 text-gray-600" />
                </Link>
              </ButtonGlobal>
              <ButtonGlobal
                variant="ghost"
                size="iconSm"
                className="hover:bg-red-50 h-8 w-8"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-600" />
              </ButtonGlobal>
            </>
          )}
        />
      </CardGlobalContent>
      <PaginationGlobal
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </CardGlobal>
  );
}
