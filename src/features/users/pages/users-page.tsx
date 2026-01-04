import { useState } from 'react';
import { ButtonGlobal } from '@/shared/components/button-global';
import { Link } from 'react-router-dom';
import { UserTable } from '../components/user-table';
import { useUsers } from '../hooks/useUsers';
import { UserStats } from '../components/user-stats';
import { PageHeaderGlobal } from '@/shared/components/page-header-global';
import { LoadingGlobal } from '@/shared/components/loading-global';
import { ErrorGlobal } from '@/shared/components/error-global';
import { Plus } from 'lucide-react';

export function UsersPage() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(6);
  const { data, total, isLoading, stats, error, refetch } = useUsers(page - 1, pageSize);

  if (isLoading) {
    return <LoadingGlobal message="Cargando usuarios..." />;
  }

  if (error) {
    return <ErrorGlobal message={error} onRetry={refetch} />;
  }

  return (
    <div className="px-4 sm:px-6 py-6 sm:py-8 bg-background min-h-screen space-y-6 sm:space-y-8 max-w-[1600px] mx-auto">
      <PageHeaderGlobal
        title="Usuarios"
        description="Gestiona todos los usuarios de la plataforma"
        action={
          <div className="flex items-center gap-3">

            <ButtonGlobal
              asChild
              className="bg-primary hover:bg-primary/90 text-foreground font-semibold shadow-sm hover:shadow-md transition-all duration-200 px-5 py-2.5 text-sm rounded-lg"
            >
              <Link to="/users/new" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Nuevo Usuario
              </Link>
            </ButtonGlobal>
          </div>
        }
      />
      <UserStats {...stats} />
      <UserTable
        data={data}
        loading={isLoading}
        currentPage={page}
        pageSize={pageSize}
        total={total}
        onPageChange={(newPage) => setPage(newPage)}
      />
    </div>
  );
}
