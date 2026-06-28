import { Badge } from '@/shared/components/ui/badge';
import type { TableGlobalColumn } from '@/shared/components/table-global';
import type { LivesPlan } from '../types/plan';

export function getLivesPlanColumns(formatPrice: (price: number) => string): TableGlobalColumn<LivesPlan>[] {
  return [
    {
      key: 'name',
      header: 'Nombre',
      render: (row) => (
        <span className="font-medium text-foreground">{row.name || row.title}</span>
      ),
    },
    {
      key: 'description',
      header: 'Descripción',
      render: (row) => (
        <span className="text-foreground/70 text-sm line-clamp-2">
          {row.description}
        </span>
      ),
    },
    {
      key: 'maxMinutesPerMonth',
      header: 'Tiempo Mensual',
      align: 'center',
      render: (row) => (
        <span className="font-medium text-foreground">{(row.maxMinutesPerMonth ?? row.livesDurationMinutes) || 0} min</span>
      ),
    },
    {
      key: 'maxConcurrentViewers',
      header: 'Espectadores Máx.',
      align: 'center',
      render: (row) => (
        <span className="text-foreground">{row.maxConcurrentViewers || 0}</span>
      ),
    },
    {
      key: 'pricePublic',
      header: 'Precio (Púb / Net)',
      align: 'right',
      render: (row) => (
        <div className="flex flex-col items-end">
          <span className="font-semibold text-foreground">
            {formatPrice(row.pricePublic ?? row.price)}
          </span>
          <span className="text-[10px] text-muted-foreground">
            Neto: {formatPrice(row.priceNet ?? 0)}
          </span>
        </div>
      ),
    },
    {
      key: 'features',
      header: 'Características',
      render: (row) => {
        const FEATURE_TRANSLATIONS: Record<string, string> = {
          clean_signal: 'Señal Limpia',
          assisted_distribution: 'Distribución Asistida',
          signal_boost: 'Impulso de Señal',
          vip_boost: 'Impulso VIP',
          click_to_buy: 'Clic para Comprar',
          flash_offers: 'Ofertas Relámpago',
        };
        return (
          <div className="flex flex-wrap gap-1 max-w-[150px]">
            {(row.features || []).map((feat) => (
              <Badge 
                key={feat} 
                variant="outline" 
                className="text-[10px] py-0 px-1.5 font-medium border-indigo-100 bg-indigo-50/50 text-indigo-700 hover:bg-indigo-50/50"
              >
                {FEATURE_TRANSLATIONS[feat] || feat}
              </Badge>
            ))}
          </div>
        );
      },
    },
    {
      key: 'triggerPushOnStart',
      header: 'Push al Iniciar',
      align: 'center',
      render: (row) => (
        <Badge 
          variant="outline"
          className={row.triggerPushOnStart 
            ? 'border-violet-200 bg-violet-50 text-violet-700 cursor-default' 
            : 'border-gray-200 text-gray-500 cursor-default'
          }
        >
          {row.triggerPushOnStart ? 'Sí' : 'No'}
        </Badge>
      ),
    },
    {
      key: 'isActive',
      header: 'Estado',
      align: 'center',
      render: (row) => (
        <Badge 
          variant={row.isActive ? 'default' : 'secondary'}
          className={row.isActive 
            ? 'bg-green-100 text-green-700 hover:bg-green-200 cursor-default' 
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-default'
          }
        >
          {row.isActive ? 'Activo' : 'Inactivo'}
        </Badge>
      ),
    },
  ];
}
