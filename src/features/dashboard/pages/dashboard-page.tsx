import { ButtonGlobal } from "@/shared/components/button-global";
import { DashboardStats } from "../components/dashboard-stats";
import { DashboardSummaryChart } from "../components/dashboard-summary-chart";
import { DashboardTopProducts } from "../components/dashboard-top-products";
import { DashboardRecentOrders } from "../components/dashboard-recent-orders";
import { DashboardTopCustomers } from "../components/dashboard-top-customers";
import { Calendar } from "lucide-react";

export const DashboardPage = () => {
  return (
    <div className="p-8 space-y-6 bg-background min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-foreground/60 mt-1">Resumen general de la plataforma</p>
        </div>
        <div className="flex gap-2">
          <ButtonGlobal 
            variant="outline" 
            size="sm"
            icon={<Calendar className="w-4 h-4" />}
            iconPosition="left"
            className="border-gray-200 hover:bg-gray-50 text-gray-700"
          >
            Año Anterior
          </ButtonGlobal>
          <ButtonGlobal 
            variant="outline" 
            size="sm"
            className="border-gray-200 hover:bg-gray-50 text-gray-700"
          >
            Todo el Tiempo
          </ButtonGlobal>
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
