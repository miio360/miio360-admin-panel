import { useState } from 'react';
import { ButtonGlobal } from '@/shared/components/button-global';
import { useNavigate } from 'react-router-dom';
import { UserTable } from '../components/user-table';
import { useUsers } from '../hooks/useUsers';
import { PageHeaderGlobal } from '@/shared/components/page-header-global';
import { LoadingGlobal } from '@/shared/components/loading-global';
import { ErrorGlobal } from '@/shared/components/error-global';
import { Plus } from 'lucide-react';

export function UsersPage() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(6);
  const { data, total, isLoading, error, refetch } = useUsers(page - 1, pageSize);
  const navigate = useNavigate();

  if (isLoading) {
    return <LoadingGlobal message="Cargando usuarios..." />;
  }

  if (error) {
    return <ErrorGlobal message={error} onRetry={refetch} />;
  }

  return (
    <div className="px-2 sm:px-2 py-1 sm:py-2 bg-background space-y-6 sm:space-y-8 max-w-[1600px] mx-auto">
      <PageHeaderGlobal
        title="Usuarios"
        description="Gestiona todos los usuarios de la plataforma"
        action={
          <div className="flex items-center gap-3">

            <ButtonGlobal
              onClick={() => navigate("/users/new")}
              className="bg-primary hover:bg-primary/90 text-foreground font-semibold shadow-sm hover:shadow-md transition-all duration-200 px-5 py-2.5 text-sm rounded-lg"
            >
              <Plus className="w-4 h-4" />
              Nuevo Usuario

            </ButtonGlobal>
          </div>
        }
      />
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
