import {
  PaymentReceipt,
  REJECTION_REASON_LABELS,
} from '@/shared/types/payment';
import { PLAN_TYPE_LABELS } from '@/features/plans/types/plan';
import { CardContent } from '@/shared/components/ui/card';
import { ExternalLink } from 'lucide-react';

interface ReceiptCardDetailsProps {
  receipt: PaymentReceipt;
}

export function ReceiptCardDetails({ receipt }: ReceiptCardDetailsProps) {
  const formatDate = (timestamp?: any) => {
    if (!timestamp) return '-';
    return timestamp.toDate().toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <CardContent className="pt-2 pb-2 px-0">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
        <ReceiptStat label="Tipo" value={PLAN_TYPE_LABELS[receipt.plan.planType]} />
        {receipt.plan.planType === 'video' && (
          <ReceiptStat label="Videos" value={`${receipt.plan.videoCount} (${receipt.plan.videoDurationMinutes} min)`} />
        )}
        {receipt.plan.planType === 'advertising' && (
          <ReceiptStat label="Duración" value={`${receipt.plan.daysEnabled} días`} />
        )}
        {receipt.plan.planType === 'lives' && (
          <ReceiptStat label="Duración" value={`${receipt.plan.livesDurationMinutes} minutos`} />
        )}
        <ReceiptStat label="Fecha" value={formatDate(receipt.createdAt)} className="col-span-1 md:col-span-2" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {receipt.bannerImage && (
          <ReceiptImageCard
            label="Banner de Tienda"
            url={receipt.bannerImage.url}
            alt="Banner"
          />
        )}
        <ReceiptImageCard
          label="Comprobante de Pago"
          url={receipt.receiptImage.url}
          alt="Comprobante"
        />
      </div>
      {receipt.status === 'rejected' && receipt.rejectionReason && (
        <div className="bg-red-50 border-l-4 border-red-200 rounded-2xl p-4 mt-2">
          <p className="text-xs font-bold text-red-900 mb-2 uppercase tracking-wide">
            Motivo de rechazo
          </p>
          <p className="text-sm font-semibold text-red-800">
            {REJECTION_REASON_LABELS[receipt.rejectionReason]}
          </p>
          {receipt.rejectionComment && (
            <p className="text-sm text-red-700 mt-2 italic">{receipt.rejectionComment}</p>
          )}
        </div>
      )}
    </CardContent>
  );
}

function ReceiptStat({ label, value, className = "" }: { label: string; value: string; className?: string }) {
  return (
    <div className={`bg-white p-5 rounded-2xl border border-muted-foreground/10 flex flex-col gap-1 shadow-sm ${className}`}>
      <span className="text-xs text-muted-foreground uppercase tracking-wide block">{label}</span>
      <p className="font-semibold text-foreground">{value}</p>
    </div>
  );
}

function ReceiptImageCard({ label, url, alt }: { label: string; url: string; alt: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-muted-foreground/10 bg-white shadow-sm flex flex-col">
      <div className="p-3 border-b border-muted-foreground/10">
        <p className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wide">{label}</p>
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="block p-4"
      >
        <img
          src={url}
          alt={alt}
          className="w-full h-44 object-cover rounded-xl mb-3 border border-muted-foreground/10"
        />
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground font-semibold">
          <span>Abrir completo</span>
          <ExternalLink className="w-4 h-4" />
        </div>
      </a>
    </div>
  );
}