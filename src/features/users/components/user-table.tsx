import type { User } from '@/shared/types';

import { TableGlobal, TableGlobalColumn } from '@/shared/components/ui/table-global';
import { Button } from '@/shared/components/ui/button';
import { Link } from 'react-router-dom';
import { Edit2 } from 'lucide-react';

interface UserTableProps {
  data: User[];
  loading: boolean;
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

const columns: TableGlobalColumn<User>[] = [
  { key: 'email', header: 'Email' },
  { key: 'activeRole', header: 'Rol' },
  { key: 'status', header: 'Estado' },
  { key: 'createdAt', header: 'Creado', render: (u) => new Date(u.createdAt).toLocaleDateString() },
  {
    key: 'actions',
    header: '',
    render: (u) => (
      <Button
        asChild
        variant="ghost"
        size="icon"
        className="h-9 w-9 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
        title="Editar"
      >
        <Link to={`/users/${u.id}/edit`}>
          <Edit2 className="w-4 h-4" />
        </Link>
      </Button>
    ),
  },
];

export function UserTable(props: UserTableProps) {
  return (
    <TableGlobal<User> {...props} columns={columns} />
  );
}
