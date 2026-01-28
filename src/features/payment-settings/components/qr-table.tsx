import { PaymentSettings } from '@/shared/types/payment';
import { PLAN_TYPE_LABELS } from '@/features/plans/types/plan';
import { Trash2, Edit, ToggleLeft, ToggleRight } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';
import { useState } from 'react';
import { TableGlobal, TableGlobalColumn } from '@/shared/components/table-global';
import { ButtonGlobal } from '@/shared/components/button-global';
import { TooltipProvider } from '@/shared/components/ui/tooltip';
import { PaginationGlobal } from '@/shared/components/pagination-global';

interface QRTableProps {
  settings: PaymentSettings[];
  onEdit: (setting: PaymentSettings) => void;
  onDelete: (setting: PaymentSettings) => void;
  onDisable?: (setting: PaymentSettings) => void;
  disabled?: boolean;
}

export function QRTable({
  settings,
  onEdit,
  onDelete,
  onDisable,
  disabled = false,
}: QRTableProps) {
  // Estado de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const totalPages = Math.ceil(settings.length / pageSize) || 1;
  const paginatedData = settings.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const formatDate = (timestamp?: Timestamp) => {
    if (!timestamp) return '-';
    if (typeof timestamp.toDate === 'function') {
      return timestamp.toDate().toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    }
    return new Date(timestamp as any).toLocaleDateString('es-ES');
  };

  const columns: TableGlobalColumn<PaymentSettings>[] = [
    {
      key: 'planType',
      header: 'Tipo de Plan',
      width: 'w-[18%]',
      render: (row) => (
        <span className="font-semibold text-foreground text-sm">
          Plan {PLAN_TYPE_LABELS[row.planType]}
        </span>
      ),
    },
    {
      key: 'qrImage',
      header: 'QR',
      width: 'w-[18%]',
      render: (row) => (
        <a
          href={row.qrImage.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block mx-auto w-fit"
        >
          <img
            src={row.qrImage.url}
            alt="QR Preview"
            className="w-14 h-14 object-contain rounded border hover:shadow-lg transition-all"
          />
        </a>
      ),
      align: 'center',
    },
    {
      key: 'isActive',
      header: 'Estado',
      width: 'w-[14%]',
      render: (row) => (
        <span className={`inline-flex items-center text-xs font-medium px-2 py-1 rounded ${row.isActive ? 'text-green-700 bg-green-50' : 'text-gray-600 bg-gray-100'}`}>
          {row.isActive ? '✓ Activo' : 'Inactivo'}
        </span>
      ),
      align: 'center',
    },
    {
      key: 'updatedAt',
      header: 'Actualizado',
      width: 'w-[18%]',
      render: (row) => formatDate(row.updatedAt),
      align: 'center',
    },
  ];

  return (
    <TooltipProvider>
      <TableGlobal<PaymentSettings>
        columns={columns}
        data={paginatedData}
        loading={false}
        emptyMessage="No hay códigos QR configurados"
        actions={(row) => (
          <div className="flex justify-end gap-1">
            <ButtonGlobal
              variant="ghost"
              size="icon"
              onClick={() => onDisable?.(row)}
              title={row.isActive ? 'Desactivar' : 'Activar'}
              className="hover:bg-gray-100"
              disabled={disabled}
            >
              {row.isActive ? (
                <ToggleRight className="w-4 h-4 text-green-600" />
              ) : (
                <ToggleLeft className="w-4 h-4 text-gray-400" />
              )}
            </ButtonGlobal>
            <ButtonGlobal
              variant="ghost"
              size="icon"
              onClick={() => onEdit(row)}
              title="Editar"
              className="hover:bg-gray-100"
              disabled={disabled}
            >
              <Edit className="w-4 h-4" />
            </ButtonGlobal>
            <ButtonGlobal
              variant="ghost"
              size="icon"
              onClick={() => onDelete(row)}
              title="Eliminar"
              className="hover:bg-gray-100"
              disabled={disabled}
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </ButtonGlobal>
          </div>
        )}
        showPagination={false}
      />
      <PaginationGlobal
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        className="mt-2"
      />
    </TooltipProvider>
  );
}
