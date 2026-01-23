import { Badge } from '@/shared/components/ui/badge';
import type { TableGlobalColumn } from '@/shared/components/table-global';
import type { LivesPlan } from '../types/plan';

export function getLivesPlanColumns(formatPrice: (price: number) => string): TableGlobalColumn<LivesPlan>[] {
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
      key: 'livesDurationMinutes',
      header: 'Tiempo Total de Lives',
      align: 'center',
      render: (row) => (
        <span className="font-medium text-foreground">{row.livesDurationMinutes} min</span>
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
