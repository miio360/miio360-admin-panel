import { useState } from 'react';
import { HeadphonesIcon } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { PageHeaderGlobal } from '@/shared/components/page-header-global';
import { LoadingGlobal } from '@/shared/components/loading-global';
import { ErrorGlobal } from '@/shared/components/error-global';
import { useSettings } from '../hooks/useSettings';
import { SettingsListItem } from '../components/settings-list-item';
import { TechSupportModal } from '../components/tech-support-modal';

type Tab = 'soporte';

const tabs: { id: Tab; label: string; icon: typeof HeadphonesIcon }[] = [
    { id: 'soporte', label: 'Soporte Tecnico', icon: HeadphonesIcon },
];

export function SettingsPage() {
    const { settings, isLoading, error, refetch } = useSettings();
    const [activeTab, setActiveTab] = useState<Tab>('soporte');
    const [techSupportOpen, setTechSupportOpen] = useState(false);

    if (isLoading) return <LoadingGlobal message="Cargando configuracion..." />;
    if (error) return <ErrorGlobal message={error} onRetry={refetch} />;

    const whatsappConfigured = !!settings?.techSupport?.whatsapp?.phoneNumber;

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

            <TechSupportModal
                open={techSupportOpen}
                onOpenChange={setTechSupportOpen}
                settings={settings}
                onSuccess={refetch}
            />
        </div>
    );
}
