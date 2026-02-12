import { Badge } from '@/shared/components/ui/badge';
import type { TableGlobalColumn } from '@/shared/components/table-global';
import type { AdvertisingPlan } from '../types/plan';
import { ADVERTISING_TYPE_LABELS, ADVERTISING_POSITION_LABELS } from '../types/plan';

export function getAdvertisingPlanColumns(formatPrice: (price: number) => string): TableGlobalColumn<AdvertisingPlan>[] {
  return [
    {
      key: 'title',
      header: 'Titulo',
      render: (row) => (
        <span className="font-medium text-foreground">{row.title}</span>
      ),
    },
    {
      key: 'description',
      header: 'Descripcion',
      render: (row) => (
        <span className="text-foreground/70 text-sm line-clamp-2">
          {row.description}
        </span>
      ),
    },
    {
      key: 'advertisingType',
      header: 'Tipo',
      align: 'center',
      render: (row) => (
        <span className="font-medium text-foreground text-sm">
          {ADVERTISING_TYPE_LABELS[row.advertisingType]}
        </span>
      ),
    },
    {
      key: 'advertisingPosition',
      header: 'Posicionamiento',
      align: 'center',
      render: (row) => (
        <span className="font-medium text-foreground text-sm">
          {ADVERTISING_POSITION_LABELS[row.advertisingPosition]}
        </span>
      ),
    },
    {
      key: 'daysEnabled',
      header: 'Dias',
      align: 'center',
      render: (row) => (
        <span className="text-foreground">{row.daysEnabled}</span>
      ),
    },
    {
      key: 'price',
      header: 'Precio',
      align: 'right',
      render: (row) => (
        <span className="font-semibold text-foreground">
          {formatPrice(row.price)}
        </span>
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
