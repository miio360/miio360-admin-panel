import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { categoryService } from "../../shared/services/categoryService";
import { useAuth } from "../../shared/hooks/useAuth";

export const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalCategories: 0,
    activeCategories: 0,
    inactiveCategories: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const categories = await categoryService.getAll();
      setStats({
        totalCategories: categories.length,
        activeCategories: categories.filter((c) => c.status === "active").length,
        inactiveCategories: categories.filter((c) => c.status === "inactive").length,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-muted-foreground font-medium">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-muted/50 to-card border-2 border-border rounded-2xl p-8 shadow-lg">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
            <span className="text-4xl font-black text-primary-foreground">
              {user?.profile.fullName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              ¡Bienvenido, {user?.profile.fullName}!
            </h1>
            <p className="text-muted-foreground text-lg">
              Panel de administración MIIO360
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Categories */}
        <div className="bg-gradient-to-br from-card to-card/80 border-2 border-border rounded-2xl p-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-foreground mb-1">{stats.totalCategories}</p>
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Total Categorías
          </p>
        </div>

        {/* Active Categories */}
        <div className="bg-gradient-to-br from-card to-card/80 border-2 border-green-200 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-green-600 mb-1">{stats.activeCategories}</p>
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Categorías Activas
          </p>
        </div>

        {/* Inactive Categories */}
        <div className="bg-gradient-to-br from-card to-card/80 border-2 border-orange-200 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-orange-600 mb-1">{stats.inactiveCategories}</p>
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Categorías Inactivas
          </p>
        </div>

        {/* Average Time (placeholder) */}
        <div className="bg-gradient-to-br from-card to-card/80 border-2 border-purple-200 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-foreground mb-1">2.5m</p>
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Tiempo Promedio
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Categories Management */}
        <div className="bg-card border-2 border-border rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-muted/30 px-6 py-4 border-b-2 border-border">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Gestión de Categorías
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <p className="text-muted-foreground">
              Administra las categorías del sistema, crea nuevas, edita o elimina existentes.
            </p>
            <div className="flex gap-3">
              <Link
                to="/categories"
                className="flex-1 bg-primary text-primary-foreground px-4 py-3 rounded-xl font-semibold text-center shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all"
              >
                Ver Todas
              </Link>
              <Link
                to="/categories/new"
                className="flex-1 bg-secondary text-secondary-foreground px-4 py-3 rounded-xl font-semibold text-center shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all"
              >
                Crear Nueva
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activity (placeholder) */}
        <div className="bg-card border-2 border-border rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-muted/30 px-6 py-4 border-b-2 border-border">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Actividad Reciente
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-muted-foreground">Sistema inicializado correctamente</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-muted-foreground">Sesión iniciada como administrador</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span className="text-muted-foreground">Dashboard cargado exitosamente</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
