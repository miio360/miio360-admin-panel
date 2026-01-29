import { useState } from 'react';
import {
  PaymentReceipt,
  PAYMENT_RECEIPT_STATUS_LABELS,
} from '@/shared/types/payment';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/shared/components/ui/card';
import { ReceiptCardDetails } from './receipt-card-details';
import { ButtonGlobal } from '@/shared/components/button-global';
import { User, CreditCard, ChevronDown, ChevronUp } from 'lucide-react';

interface ReceiptCardProps {
  receipt: PaymentReceipt;
  onApprove: (receipt: PaymentReceipt) => void;
  onReject: (receipt: PaymentReceipt) => void;
  disabled?: boolean;
}

export function ReceiptCard({ receipt, onApprove, onReject, disabled }: ReceiptCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(price);
  };

  const getStatusBadge = () => {
    const label = PAYMENT_RECEIPT_STATUS_LABELS[receipt.status];
    const colorClass = {
      pending: 'bg-muted text-muted-foreground border border-muted-foreground/10',
      approved: 'bg-green-100 text-green-800 border border-green-200',
      rejected: 'bg-red-100 text-red-800 border border-red-200',
    }[receipt.status];
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colorClass}`}>{label}</span>
    );
  };

  return (
    <Card className="rounded-3xl border-0 bg-[#f5f6fa] shadow-xl hover:shadow-2xl transition-all duration-300 p-0 overflow-hidden group max-w-[380px] mx-auto flex flex-col">
      {/* Imagen destacada arriba */}
      <div className="w-full aspect-[4/3] bg-gray-200 flex items-center justify-center overflow-hidden">
        <img
          src={receipt.receiptImage.url}
          alt="Comprobante"
          className="object-cover w-full group-hover:scale-[1.03] transition-transform duration-300"
        />
      </div>
      <CardHeader className="flex flex-row items-start justify-between gap-3 pb-0 pt-4 px-4 bg-transparent">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white shadow flex items-center justify-center">
            <User className="w-6 h-6 text-muted-foreground" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold text-foreground mb-0.5 leading-tight">{receipt.seller.name}</CardTitle>
            <CardDescription className="flex items-center gap-1 text-xs text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              {receipt.seller.phone}
            </CardDescription>
          </div>
        </div>
        {getStatusBadge()}
      </CardHeader>
      <CardContent className="pt-2 pb-0 px-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-muted-foreground" />
            <span className="font-semibold text-foreground text-base">Plan Seleccionado</span>
          </div>
          <div className="flex flex-row gap-4">
            <div>
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Plan</span>
              <p className="font-bold text-foreground text-base">{receipt.plan.title}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Precio</span>
              <p className="font-bold text-foreground text-lg">{formatPrice(receipt.plan.price)}</p>
            </div>
          </div>
        </div>
        <div className="my-3" />
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between px-4 py-2 rounded-xl bg-white border border-muted-foreground/10 hover:bg-gray-100 transition-colors shadow-sm"
        >
          <span className="text-sm font-medium text-foreground">
            {isExpanded ? 'Ocultar detalles' : 'Ver más detalles'}
          </span>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          )}
        </button>
        {isExpanded && (
          <div className="pt-4">
            <ReceiptCardDetails receipt={receipt} />
          </div>
        )}
      </CardContent>
      {receipt.status === 'pending' && (
        <CardFooter className="bg-transparent border-t-0 px-4 pt-2 pb-4 mt-auto">
          <div className="flex flex-row gap-3 w-full mt-2">
            <ButtonGlobal
              onClick={() => onApprove(receipt)}
              variant="outline"
              size="sm"
              disabled={disabled}
              iconPosition="left"
              className="h-10 font-bold rounded-xl flex-1"
            >
              Aprobar
            </ButtonGlobal>
            <ButtonGlobal
              onClick={() => onReject(receipt)}
              variant="destructive"
              size="sm"
              disabled={disabled}
              iconPosition="left"
              className="h-10 font-bold rounded-xl flex-1"
            >
              Rechazar
            </ButtonGlobal>
          </div>
        </CardFooter>
      )}
    </Card>
  );

}
