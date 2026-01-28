import { QrCode } from 'lucide-react';
import { PLAN_TYPE_LABELS } from '@/features/plans/types/plan';
import type { PaymentSettings } from '@/shared/types/payment';

interface ActiveQRListProps {
  activeQRs: PaymentSettings[];
}

export function ActiveQRList({ activeQRs }: ActiveQRListProps) {
  if (activeQRs.length === 0) return null;
  return (
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
                <span className="w-1.5 h-1.5 rounded-full bg-white mr-1 animate-pulse"></span>
                Activo
              </span>
            </div>
            <img
              src={qr.qrImage.url}
              alt={`QR ${PLAN_TYPE_LABELS[qr.planType]}`}
              className="w-full h-48 object-contain bg-white rounded-lg border-2 border-gray-200 p-2"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
