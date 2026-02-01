
import type { OrderPaymentReceipt } from '@/shared/types/recepit';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/shared/components/ui/card';
import { ButtonGlobal } from '@/shared/components/button-global';
import { User, CreditCard, ShoppingBag, ExternalLink } from 'lucide-react';

interface OrderReceiptCardProps {
    receipt: OrderPaymentReceipt;
    onApprove: (receipt: OrderPaymentReceipt) => void;
    onReject: (receipt: OrderPaymentReceipt) => void;
    disabled?: boolean;
}

export function OrderReceiptCard({ receipt, onApprove, onReject, disabled }: OrderReceiptCardProps) {

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-BO', {
            style: 'currency',
            currency: 'BOB',
        }).format(price);
    };

    const getStatusBadge = () => {
        const labels = {
            pending: 'Pendiente',
            approved: 'Aprobado',
            rejected: 'Rechazado'
        };
        const label = labels[receipt.status];
        const colorClass = {
            pending: 'bg-muted text-muted-foreground border border-muted-foreground/10',
            approved: 'bg-green-100 text-green-800 border border-green-200',
            rejected: 'bg-red-100 text-red-800 border border-red-200',
        }[receipt.status];
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colorClass}`}>{label}</span>
        );
    };

    const formatDate = (timestamp?: any) => {
        if (!timestamp) return '-';
        // Handle number or timestamp
        const date = typeof timestamp === 'number' ? new Date(timestamp) : timestamp.toDate();
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <Card className="rounded-3xl border-0 bg-[#f5f6fa] shadow-xl hover:shadow-2xl transition-all duration-300 p-0 overflow-hidden group max-w-[380px] mx-auto flex flex-col">
            {/* Imagen destacada arriba */}
            <div className="w-full aspect-[4/3] bg-gray-200 flex items-center justify-center overflow-hidden relative">
                <img
                    src={receipt.receiptImageUrl}
                    alt="Comprobante"
                    className="object-cover w-full group-hover:scale-[1.03] transition-transform duration-300"
                />
                <a
                    href={receipt.receiptImageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-2 right-2 bg-white/90 p-1.5 rounded-full shadow-sm hover:bg-white transition-colors"
                >
                    <ExternalLink className="w-4 h-4 text-gray-700" />
                </a>
            </div>

            <CardHeader className="flex flex-row items-start justify-between gap-3 pb-0 pt-4 px-4 bg-transparent">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow flex items-center justify-center">
                        <User className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div>
                        <CardTitle className="text-lg font-bold text-foreground mb-0.5 leading-tight">{receipt.client?.name || 'Cliente'}</CardTitle>
                        <CardDescription className="flex items-center gap-1 text-xs text-muted-foreground">
                            {receipt.client?.phone || 'Sin télefono'}
                        </CardDescription>
                    </div>
                </div>
                {getStatusBadge()}
            </CardHeader>

            <CardContent className="pt-2 pb-0 px-4">
                <div className="flex flex-col gap-3 mt-4">

                    {/* Order Info */}
                    <div className="bg-white p-4 rounded-2xl border border-muted-foreground/10 flex flex-col gap-2 shadow-sm">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                            <div className="flex items-center gap-2">
                                <ShoppingBag className="w-4 h-4 text-muted-foreground" />
                                <span className="text-xs font-semibold text-muted-foreground uppercase">Orden</span>
                            </div>
                            <span className="font-bold text-foreground">#{receipt.orderNumber}</span>
                        </div>

                        <div className="flex justify-between items-center pt-1">
                            <div className="flex items-center gap-2">
                                <CreditCard className="w-4 h-4 text-muted-foreground" />
                                <span className="text-xs font-semibold text-muted-foreground uppercase">Monto Total</span>
                            </div>
                            <span className="font-bold text-lg text-primary">{formatPrice(receipt.totalAmount)}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white p-3 rounded-xl border border-muted-foreground/10 shadow-sm">
                            <span className="text-[10px] text-muted-foreground uppercase tracking-wide block mb-1">Vendedor</span>
                            <p className="font-semibold text-sm truncate">{receipt.seller?.name || 'Vendedor'}</p>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-muted-foreground/10 shadow-sm">
                            <span className="text-[10px] text-muted-foreground uppercase tracking-wide block mb-1">Fecha</span>
                            <p className="font-semibold text-sm truncate">{formatDate(receipt.createdAt)}</p>
                        </div>
                    </div>

                </div>
                <div className="my-3" />
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
