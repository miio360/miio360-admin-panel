import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Link } from 'react-router-dom';
import { UserTable } from './components/user-table';
import { useUsers } from './hooks/useUsers';
import { UserStats } from './components/user-stats';

export function UsersPage() {
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const { data, total, isLoading, stats } = useUsers(page, pageSize);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-foreground">Usuarios</h1>
        <Button asChild>
          <Link to="/users/new">Agregar usuario</Link>
        </Button>
      </div>
      <UserStats {...stats} />
      <UserTable
        data={data}
        loading={isLoading}
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={setPage}
      />
    </div>
  );
}
