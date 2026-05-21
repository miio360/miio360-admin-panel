import { useState } from 'react';
import { HeadphonesIcon, ShoppingBag, Percent } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { PageHeaderGlobal } from '@/shared/components/page-header-global';
import { LoadingGlobal } from '@/shared/components/loading-global';
import { ErrorGlobal } from '@/shared/components/error-global';
import { useSettings } from '../hooks/useSettings';
import { useSalesSettings } from '../hooks/useSalesSettings';
import { SettingsListItem } from '../components/settings-list-item';
import { TechSupportModal } from '../components/tech-support-modal';
import { SalesSettingsModal } from '../components/sales-settings-modal';
import { CommissionSettingsPanel } from '../components/commission-settings-panel';

type Tab = 'soporte' | 'ventas' | 'comisiones';

const tabs: { id: Tab; label: string; icon: typeof HeadphonesIcon }[] = [
    { id: 'soporte', label: 'Soporte Tecnico', icon: HeadphonesIcon },
    { id: 'ventas', label: 'Opciones de Venta', icon: ShoppingBag },
    { id: 'comisiones', label: 'Comisiones', icon: Percent },
];

export function SettingsPage() {
    const { settings, isLoading, error, refetch } = useSettings();
    const { salesSettings, isLoading: isSalesLoading, error: salesError, refetch: refetchSales } = useSalesSettings();
    const [activeTab, setActiveTab] = useState<Tab>('soporte');
    const [techSupportOpen, setTechSupportOpen] = useState(false);
    const [salesSettingsOpen, setSalesSettingsOpen] = useState(false);

    if (isLoading || isSalesLoading) return <LoadingGlobal message="Cargando configuracion..." />;
    if (error) return <ErrorGlobal message={error} onRetry={refetch} />;
    if (salesError) return <ErrorGlobal message={salesError} onRetry={refetchSales} />;

    const whatsappConfigured = !!settings?.techSupport?.whatsapp?.phoneNumber;

    const salesEnabled = salesSettings?.sales_enabled ?? false;
    const dateToEnable = salesSettings?.date_to_enable_sales
        ? salesSettings.date_to_enable_sales.toDate().toLocaleString('es-BO', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
          })
        : null;

    return (
        <div className="space-y-6 p-4 sm:p-6 max-w-2xl">
            <PageHeaderGlobal
                title="Configuracion"
                description="Administra las opciones globales de la plataforma MIIO"
            />

            {/* Tab bar */}
            <div className="flex gap-1 border-b border-border">
                {tabs.map(({ id, label, icon: Icon }) => (
                    <button
                        key={id}
                        type="button"
                        onClick={() => setActiveTab(id)}
                        className={cn(
                            'flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg',
                            'transition-all border-b-2 -mb-px',
                            activeTab === id
                                ? 'border-primary text-foreground bg-primary/5'
                                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                        )}
                    >
                        <Icon className="w-4 h-4" />
                        {label}
                    </button>
                ))}
            </div>

            {/* Tab content */}
            {activeTab === 'soporte' && (
                <div className="space-y-2">
                    <SettingsListItem
                        icon={HeadphonesIcon}
                        label="Soporte Tecnico"
                        description={
                            whatsappConfigured
                                ? `WhatsApp: +${settings!.techSupport.whatsapp.countryCode} ${settings!.techSupport.whatsapp.phoneNumber}`
                                : 'Configura el numero de WhatsApp de soporte'
                        }
                        badge={
                            whatsappConfigured
                                ? settings!.techSupport.whatsapp.isActive
                                    ? 'Activo'
                                    : 'Inactivo'
                                : 'Sin configurar'
                        }
                        badgeVariant={
                            whatsappConfigured
                                ? settings!.techSupport.whatsapp.isActive
                                    ? 'success'
                                    : 'warning'
                                : 'default'
                        }
                        onClick={() => setTechSupportOpen(true)}
                    />
                </div>
            )}

            {activeTab === 'ventas' && (
                <div className="space-y-2">
                    <SettingsListItem
                        icon={ShoppingBag}
                        label="Estado de Ventas"
                        description={
                            salesEnabled
                                ? 'Las ventas están activas en la plataforma'
                                : dateToEnable
                                  ? `Programadas para: ${dateToEnable}`
                                  : 'Las ventas están desactivadas'
                        }
                        badge={salesEnabled ? 'Habilitadas' : 'Deshabilitadas'}
                        badgeVariant={salesEnabled ? 'success' : 'warning'}
                        onClick={() => setSalesSettingsOpen(true)}
                    />
                </div>
            )}

            {activeTab === 'comisiones' && (
                <div className="space-y-2">
                    <CommissionSettingsPanel />
                </div>
            )}

            <TechSupportModal
                open={techSupportOpen}
                onOpenChange={setTechSupportOpen}
                settings={settings}
                onSuccess={refetch}
            />

            <SalesSettingsModal
                open={salesSettingsOpen}
                onOpenChange={setSalesSettingsOpen}
                salesSettings={salesSettings}
                onSuccess={refetchSales}
            />
        </div>
    );
}
