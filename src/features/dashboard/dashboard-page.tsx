import { Button } from "@/shared/components/ui/button";
import { DashboardStats } from "./components/dashboard-stats";
import { DashboardSummaryChart } from "./components/dashboard-summary-chart";
import { DashboardTopProducts } from "./components/dashboard-top-products";
import { DashboardRecentOrders } from "./components/dashboard-recent-orders";
import { DashboardTopCustomers } from "./components/dashboard-top-customers";

export const DashboardPage = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-foreground">¡Bienvenido de Vuelta!</h1>
          <p className="text-sm text-muted-foreground">Aquí está lo que está pasando con tu tienda hoy</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Año Anterior</Button>
          <Button variant="outline" size="sm">Ver Todo el Tiempo</Button>
        </div>
      </div>

      <DashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DashboardSummaryChart />
        <DashboardTopProducts />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DashboardRecentOrders />
        <DashboardTopCustomers />
      </div>
    </div>
  );
};
