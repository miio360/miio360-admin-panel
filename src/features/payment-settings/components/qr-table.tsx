import { PaymentSettings } from '@/shared/types/payment';
import { PLAN_TYPE_LABELS } from '@/features/plans/types/plan';
import { Trash2, Edit, ToggleLeft, ToggleRight, QrCode, CalendarDays, Eye } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';
import { useState } from 'react';
import { TableGlobal, TableGlobalColumn } from '@/shared/components/table-global';
import { ButtonGlobal } from '@/shared/components/button-global';
import { TooltipProvider } from '@/shared/components/ui/tooltip';
import { PaginationGlobal } from '@/shared/components/pagination-global';
import { cn } from '@/shared/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';

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
  const [currentPage, setCurrentPage] = useState(1);
  const [previewQR, setPreviewQR] = useState<PaymentSettings | null>(null);
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
        <div className="flex flex-col items-center gap-1.5">
          <img
            src={row.qrImage.url}
            alt="QR Preview"
            className="w-12 h-12 object-contain rounded border border-slate-200"
          />
          <Button
            variant="ghost"
            size="sm"
            className="h-6 gap-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 text-xs px-2"
            onClick={() => setPreviewQR(row)}
          >
            <Eye className="w-3 h-3" />Ver
          </Button>
        </div>
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
      {/* ── Desktop table ─────────────────────────────────────── */}
      <div className="hidden sm:block">
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
      </div>

      {/* ── Mobile card list ───────────────────────────────────── */}
      <div className="sm:hidden space-y-3">
        {paginatedData.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-12 text-slate-400">
            <QrCode className="w-10 h-10 opacity-40" />
            <p className="text-sm font-medium">No hay códigos QR configurados</p>
          </div>
        ) : (
          paginatedData.map((row) => (
            <div key={row.id} className="rounded-xl border border-slate-200 bg-white shadow-sm p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-slate-900">
                  Plan {PLAN_TYPE_LABELS[row.planType]}
                </p>
                <span className={cn(
                  'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium shrink-0',
                  row.isActive
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                )}>
                  <span className={cn('w-1.5 h-1.5 rounded-full', row.isActive ? 'bg-emerald-500' : 'bg-slate-400')} />
                  {row.isActive ? 'Activo' : 'Inactivo'}
                </span>
              </div>

              <div className="flex items-start gap-4">
                <div className="shrink-0 flex flex-col items-center gap-1.5">
                  <img
                    src={row.qrImage.url}
                    alt="QR"
                    className="w-16 h-16 object-contain rounded-lg border border-slate-200"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 gap-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 text-xs px-2"
                    onClick={() => setPreviewQR(row)}
                  >
                    <Eye className="w-3 h-3" />Ver QR
                  </Button>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-500 pt-1">
                  <CalendarDays className="w-3.5 h-3.5" />
                  <span>Actualizado: {formatDate(row.updatedAt)}</span>
                </div>
              </div>

              <div className="flex items-center justify-end pt-1 border-t border-slate-100 gap-1">
                <ButtonGlobal
                  variant="ghost"
                  size="icon"
                  onClick={() => onDisable?.(row)}
                  title={row.isActive ? 'Desactivar' : 'Activar'}
                  className="h-8 w-8 hover:bg-slate-100"
                  disabled={disabled}
                >
                  {row.isActive ? (
                    <ToggleRight className="w-4 h-4 text-green-600" />
                  ) : (
                    <ToggleLeft className="w-4 h-4 text-slate-400" />
                  )}
                </ButtonGlobal>
                <ButtonGlobal
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(row)}
                  title="Editar"
                  className="h-8 w-8 hover:bg-slate-100"
                  disabled={disabled}
                >
                  <Edit className="w-4 h-4 text-slate-600" />
                </ButtonGlobal>
                <ButtonGlobal
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(row)}
                  title="Eliminar"
                  className="h-8 w-8 hover:bg-red-50"
                  disabled={disabled}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </ButtonGlobal>
              </div>
            </div>
          ))
        )}
      </div>

      <PaginationGlobal
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        className="mt-2"
      />

      {/* ── QR Preview Dialog ─────────────────────────────────── */}
      <Dialog open={!!previewQR} onOpenChange={(open) => !open && setPreviewQR(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base">
              QR — Plan {previewQR ? PLAN_TYPE_LABELS[previewQR.planType] : ''}
            </DialogTitle>
          </DialogHeader>
          {previewQR?.qrImage?.url && (
            <div className="mt-2 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 p-4 flex justify-center">
              <img
                src={previewQR.qrImage.url}
                alt="QR Code"
                className="w-full max-w-[280px] h-auto object-contain"
              />
            </div>
          )}
          {previewQR && (
            <div className="flex items-center justify-between pt-1 text-sm text-slate-600 border-t border-slate-100">
              <span>Plan {PLAN_TYPE_LABELS[previewQR.planType]}</span>
              <span className={cn(
                'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
                previewQR.isActive
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-slate-100 text-slate-600 border border-slate-200'
              )}>
                <span className={cn('w-1.5 h-1.5 rounded-full', previewQR.isActive ? 'bg-emerald-500' : 'bg-slate-400')} />
                {previewQR.isActive ? 'Activo' : 'Inactivo'}
              </span>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
