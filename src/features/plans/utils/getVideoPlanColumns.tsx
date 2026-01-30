import { Badge } from '@/shared/components/ui/badge';
import type { TableGlobalColumn } from '@/shared/components/table-global';
import type { VideoPlan } from '../types/plan';
import { VIDEO_MODE_LABELS } from '../types/plan';

/**
 * Formatea segundos a texto legible (ej: "1 min 30 seg", "2 min", "45 seg")
 */
function formatSecondsToReadable(seconds: number | undefined): string {
  if (!seconds || seconds <= 0) return '-';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs} seg`;
  if (secs === 0) return `${mins} min`;
  return `${mins} min ${secs} seg`;
}

export function getVideoPlanColumns(formatPrice: (price: number) => string): TableGlobalColumn<VideoPlan>[] {
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
      key: 'videoMode',
      header: 'Tipo de Plan',
      align: 'center',
      render: (row) => (
        <Badge 
          variant="outline"
          className={row.videoMode === 'video_count' 
            ? 'bg-blue-50 text-blue-700 border-blue-200' 
            : 'bg-purple-50 text-purple-700 border-purple-200'
          }
        >
          {VIDEO_MODE_LABELS[row.videoMode] ?? 'Por cantidad de videos'}
        </Badge>
      ),
    },
    {
      key: 'videoDetails',
      header: 'Detalles',
      align: 'center',
      render: (row) => {
        if (row.videoMode === 'time_pool') {
          return (
            <span className="text-foreground text-sm">
              {formatSecondsToReadable(row.totalDurationSeconds)} total
            </span>
          );
        }
        return (
          <span className="text-foreground text-sm">
            {row.videoCount ?? 0} videos / {formatSecondsToReadable(row.maxDurationPerVideoSeconds)} c/u
          </span>
        );
      },
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
