import { useNavigate } from 'react-router-dom';
import { useDashboard } from '../hooks/useDashboard';
import { StatCard } from '../components/stat-card';
import { RevenueCard } from '../components/revenue-card';
import { UserRolesCard } from '../components/user-roles-card';
import { ReceiptStatusCard } from '../components/receipt-status-card';
import { TopSellersCard } from '../components/top-sellers-card';
import { QuickActionsCard } from '../components/quick-actions-card';
import { EmptyStateDashboard } from '../components/empty-state-dashboard';
import { LoadingGlobal } from '@/shared/components/loading-global';
import { ErrorGlobal } from '@/shared/components/error-global';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { stats, topSellers, isLoading, error, refetch } = useDashboard();

  if (isLoading) {
    return <LoadingGlobal message="Cargando estadísticas..." />;
  }

  if (error) {
    return (
      <div className="p-8">
        <ErrorGlobal message={error} onRetry={refetch} />
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const hasData = stats.totalUsers > 0 || 
                  stats.totalCategories > 0 || 
                  stats.totalReceipts > 0 ||
                  stats.totalActivePlans > 0;

  return (
    <div className="p-2 space-y-6 bg-background min-h-full">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-foreground/60 mt-1">Resumen general de la plataforma MIIO360</p>
        </div>
      </div>

      {!hasData && (
        <div className="mb-6">
          <EmptyStateDashboard />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Usuarios"
          value={stats.totalUsers}
          subtitle={`${stats.activeUsers} activos · ${stats.suspendedUsers} suspendidos`}
          icon="users"
          onClick={() => navigate('/users')}
        />
        
        <StatCard
          title="Categorías"
          value={stats.totalCategories}
          subtitle={`${stats.activeCategories} activas · ${stats.inactiveCategories} inactivas`}
          icon="categories"
          onClick={() => navigate('/categories')}
        />
        
        <StatCard
          title="Comprobantes Pendientes"
          value={stats.pendingReceipts}
          subtitle={`${stats.totalReceipts} totales · ${stats.approvedReceipts} aprobados`}
          icon="receipts"
          onClick={() => navigate('/payment-receipts')}
        />
        
        <StatCard
          title="Planes Activos"
          value={stats.activePlans}
          subtitle={`${stats.totalActivePlans} totales · ${stats.expiredPlans} expirados`}
          icon="plans"
          onClick={() => navigate('/active-plans')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RevenueCard 
              currentMonth={stats.revenueCurrentMonth}
              lastMonth={stats.revenueLastMonth}
            />
            
            <UserRolesCard
              sellers={stats.totalSellers}
              couriers={stats.totalCouriers}
              customers={stats.totalCustomers}
            />
          </div>

          <ReceiptStatusCard
            approved={stats.approvedReceipts}
            rejected={stats.rejectedReceipts}
            pending={stats.pendingReceipts}
          />
        </div>

        <div className="space-y-4">
          <QuickActionsCard />
          
          <TopSellersCard sellers={topSellers} />
        </div>
      </div>
    </div>
  );
};
