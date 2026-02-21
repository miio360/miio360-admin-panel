import { QrCode, Eye } from 'lucide-react';
import { PLAN_TYPE_LABELS } from '@/features/plans/types/plan';
import type { PaymentSettings } from '@/shared/types/payment';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';

interface ActiveQRListProps {
  activeQRs: PaymentSettings[];
}

export function ActiveQRList({ activeQRs }: ActiveQRListProps) {
  const [previewQR, setPreviewQR] = useState<PaymentSettings | null>(null);

  if (activeQRs.length === 0) return null;

  return (
    <>
      <div className="bg-gradient-to-br from-primary/10 to-yellow-100 rounded-2xl p-6 border-2 border-primary/30 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <QrCode className="w-6 h-6 text-foreground" />
          </div>
          <h2 className="text-xl font-bold text-foreground">QR Activos</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {activeQRs.map((qr) => (
            <div
              key={qr.id}
              className="bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all border-2 border-transparent hover:border-primary"
            >
              <div className="flex justify-between items-start mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-primary to-yellow-400 text-foreground">
                  {PLAN_TYPE_LABELS[qr.planType]}
                </span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-green-400 to-green-500 text-white">
                  <span className="w-1.5 h-1.5 rounded-full bg-white mr-1 animate-pulse" />
                  Activo
                </span>
              </div>

              {/* Imagen QR — en mobile se ve pequena, el botón abre el modal */}
              <div className="relative group">
                <img
                  src={qr.qrImage.url}
                  alt={`QR ${PLAN_TYPE_LABELS[qr.planType]}`}
                  className="w-full h-40 sm:h-48 object-contain bg-white rounded-lg border-2 border-gray-200 p-2"
                />
                <div className="absolute inset-0 flex items-end justify-center pb-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-1.5 text-blue-600 bg-white/90 hover:bg-white hover:text-blue-800 text-xs shadow-sm border border-blue-100"
                    onClick={() => setPreviewQR(qr)}
                  >
                    <Eye className="w-3.5 h-3.5" />Ver código QR
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

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
              <span className="font-medium">Plan {PLAN_TYPE_LABELS[previewQR.planType]}</span>
              <span className={cn(
                'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
                'bg-emerald-50 text-emerald-700 border border-emerald-200'
              )}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Activo
              </span>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
