import { useState, useCallback } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
    Check, X, Eye, ChevronLeft, ChevronRight,
    ShoppingBag, ImageOff, AlertCircle, Loader2, CalendarDays,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/shared/components/ui/table';
import { Button } from '@/shared/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/components/ui/tooltip';
import { useOrderReceiptsPaginated } from '@/features/orders/hooks/useOrderReceiptsPaginated';
import { orderReceiptService } from '@/features/orders/api/orderReceiptService';
import { RejectDialog } from './reject-dialog';
import type { OrderPaymentReceipt, OrderReceiptStatus } from '@/shared/types/recepit';
import type { RejectionReason } from '@/shared/types/payment';
import { ErrorGlobal } from '@/shared/components/error-global';

// ─── Status helpers ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<OrderReceiptStatus, {
    label: string;
    className: string;
    dot: string;
}> = {
    pending: {
        label: 'Pendiente',
        className: 'bg-amber-50 text-amber-700 border border-amber-200',
        dot: 'bg-amber-400',
    },
    approved: {
        label: 'Aprobado',
        className: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
        dot: 'bg-emerald-500',
    },
    rejected: {
        label: 'Rechazado',
        className: 'bg-rose-50 text-rose-700 border border-rose-200',
        dot: 'bg-rose-500',
    },
};

type StatusFilter = OrderReceiptStatus | 'all';

const STATUS_TABS: { value: StatusFilter; label: string }[] = [
    { value: 'all', label: 'Todos' },
    { value: 'pending', label: 'Pendientes' },
    { value: 'approved', label: 'Aprobados' },
    { value: 'rejected', label: 'Rechazados' },
];

function formatDate(createdAt: number): string {
    if (!createdAt) return '—';
    return format(new Date(createdAt), 'dd MMM yyyy, HH:mm', { locale: es });
}

function formatAmount(amount: number): string {
    return new Intl.NumberFormat('es-BO', {
        style: 'currency',
        currency: 'BOB',
        minimumFractionDigits: 2,
    }).format(amount);
}

// ─── Skeleton rows ─────────────────────────────────────────────────────────────

function TableSkeleton() {
    return (
        <>
            {Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={i} className="hover:bg-transparent">
                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                    <TableCell>
                        <div className="space-y-1.5">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-24" />
                        </div>
                    </TableCell>
                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20 rounded-full" /></TableCell>
                    <TableCell className="text-center"><Skeleton className="h-7 w-14 mx-auto rounded-md" /></TableCell>
                    <TableCell className="text-right">
                        <div className="flex justify-end gap-1.5">
                            <Skeleton className="h-7 w-7 rounded-md" />
                            <Skeleton className="h-7 w-7 rounded-md" />
                        </div>
                    </TableCell>
                </TableRow>
            ))}
        </>
    );
}

// ─── Mobile card skeleton ──────────────────────────────────────────────────────

function CardSkeleton() {
    return (
        <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-slate-200 bg-white p-4 space-y-2">
                    <div className="flex justify-between">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-5 w-20 rounded-full" />
                    </div>
                    <Skeleton className="h-4 w-36" />
                    <div className="flex justify-between items-center pt-1">
                        <Skeleton className="h-4 w-20" />
                        <div className="flex gap-1.5">
                            <Skeleton className="h-7 w-7 rounded-md" />
                            <Skeleton className="h-7 w-7 rounded-md" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

// ─── Main component ────────────────────────────────────────────────────────────

export function OrdersReceiptsTab() {
    const {
        receipts,
        isLoading,
        error,
        refetch,
        page,
        hasNextPage,
        hasPrevPage,
        status: activeStatus,
        setStatus,
        nextPage,
        prevPage,
    } = useOrderReceiptsPaginated();

    // Dialogs
    const [previewReceipt, setPreviewReceipt] = useState<OrderPaymentReceipt | null>(null);
    const [approveReceipt, setApproveReceipt] = useState<OrderPaymentReceipt | null>(null);
    const [rejectReceipt, setRejectReceipt] = useState<OrderPaymentReceipt | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [actionError, setActionError] = useState<string | null>(null);

    const handleStatusTab = (tab: StatusFilter) => {
        setStatus(tab === 'all' ? undefined : tab);
    };

    const handleApproveConfirm = useCallback(async () => {
        if (!approveReceipt) return;
        try {
            setActionLoading(true);
            setActionError(null);
            await orderReceiptService.approve(approveReceipt.id, approveReceipt.orderId);
            setApproveReceipt(null);
            await refetch();
        } catch (err) {
            setActionError(err instanceof Error ? err.message : 'Error al aprobar');
        } finally {
            setActionLoading(false);
        }
    }, [approveReceipt, refetch]);

    const handleRejectConfirm = useCallback(async (reason: RejectionReason, comment?: string) => {
        if (!rejectReceipt) return;
        try {
            setActionLoading(true);
            setActionError(null);
            await orderReceiptService.reject(rejectReceipt.id, rejectReceipt.orderId, reason, comment);
            setRejectReceipt(null);
            await refetch();
        } catch (err) {
            setActionError(err instanceof Error ? err.message : 'Error al rechazar');
        } finally {
            setActionLoading(false);
        }
    }, [rejectReceipt, refetch]);

    const activeTab: StatusFilter = activeStatus ?? 'all';

    if (error) return <ErrorGlobal message={error} onRetry={refetch} />;

    return (
        <TooltipProvider delayDuration={300}>
            <div className="space-y-4">

                {/* ── Status filter tabs ───────────────────────────────── */}
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="inline-flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                        {STATUS_TABS.map(({ value, label }) => (
                            <button
                                key={value}
                                onClick={() => handleStatusTab(value)}
                                className={cn(
                                    'px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-150',
                                    activeTab === value
                                        ? 'bg-white text-slate-900 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-700'
                                )}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={prevPage}
                            disabled={!hasPrevPage || isLoading}
                            className="h-8 w-8 p-0"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <span className="text-sm text-slate-600 tabular-nums min-w-16 text-center">
                            Página {page}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={nextPage}
                            disabled={!hasNextPage || isLoading}
                            className="h-8 w-8 p-0"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* ── Action error banner ──────────────────────────────── */}
                {actionError && (
                    <div className="flex items-center gap-2 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-4 py-3">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{actionError}</span>
                        <button
                            onClick={() => setActionError(null)}
                            className="ml-auto text-rose-500 hover:text-rose-700"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </div>
                )}

                {/* ── Table ───────────────────────────────────────────── */}
                <div className="hidden sm:block rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50 hover:bg-slate-50 border-b border-slate-200">
                                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide pl-5">Fecha</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Cliente</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">N° Pedido</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Monto</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Estado</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide text-center">Comprobante</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide text-right pr-5">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableSkeleton />
                            ) : receipts.length === 0 ? (
                                <TableRow className="hover:bg-transparent">
                                    <TableCell colSpan={7} className="py-16 text-center">
                                        <div className="flex flex-col items-center gap-3 text-slate-400">
                                            <ShoppingBag className="w-10 h-10 opacity-40" />
                                            <p className="text-sm font-medium">No se encontraron comprobantes</p>
                                            <p className="text-xs text-slate-400">
                                                {activeTab !== 'all'
                                                    ? 'No hay comprobantes con este estado'
                                                    : 'Los comprobantes aparecerán aquí cuando los clientes envíen su pago'}
                                            </p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                receipts.map((receipt) => {
                                    const statusCfg = STATUS_CONFIG[receipt.status];
                                    const isPending = receipt.status === 'pending';
                                    return (
                                        <TableRow
                                            key={receipt.id}
                                            className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors"
                                        >
                                            {/* Fecha */}
                                            <TableCell className="pl-5 text-sm text-slate-600 whitespace-nowrap">
                                                {formatDate(receipt.createdAt)}
                                            </TableCell>

                                            {/* Cliente */}
                                            <TableCell>
                                                <div>
                                                    <p className="text-sm font-medium text-slate-900 leading-tight">
                                                        {receipt.client?.name || '—'}
                                                    </p>
                                                    <p className="text-xs text-slate-400 mt-0.5 truncate max-w-40">
                                                        {receipt.seller?.name || '—'}
                                                    </p>
                                                </div>
                                            </TableCell>

                                            {/* N° Pedido */}
                                            <TableCell>
                                                <span className="font-mono text-xs text-slate-700 bg-slate-100 px-2 py-1 rounded-md">
                                                    {receipt.orderNumber || '—'}
                                                </span>
                                            </TableCell>

                                            {/* Monto */}
                                            <TableCell className="text-sm font-semibold text-slate-800 tabular-nums">
                                                {formatAmount(receipt.totalAmount)}
                                            </TableCell>

                                            {/* Estado */}
                                            <TableCell>
                                                <span className={cn(
                                                    'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
                                                    statusCfg.className
                                                )}>
                                                    <span className={cn('w-1.5 h-1.5 rounded-full', statusCfg.dot)} />
                                                    {statusCfg.label}
                                                </span>
                                            </TableCell>

                                            {/* Comprobante */}
                                            <TableCell className="text-center">
                                                {receipt.receiptImageUrl ? (
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-7 gap-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 text-xs"
                                                                onClick={() => setPreviewReceipt(receipt)}
                                                            >
                                                                <Eye className="w-3.5 h-3.5" />
                                                                Ver
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>Ver comprobante</TooltipContent>
                                                    </Tooltip>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                                                        <ImageOff className="w-3.5 h-3.5" />
                                                        Sin imagen
                                                    </span>
                                                )}
                                            </TableCell>

                                            {/* Acciones */}
                                            <TableCell className="text-right pr-5">
                                                {isPending ? (
                                                    <div className="flex justify-end gap-1">
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-7 w-7 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 transition-colors"
                                                                    onClick={() => setApproveReceipt(receipt)}
                                                                    disabled={actionLoading}
                                                                >
                                                                    <Check className="w-4 h-4" />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>Aprobar pago</TooltipContent>
                                                        </Tooltip>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-7 w-7 text-rose-600 hover:text-rose-800 hover:bg-rose-50 transition-colors"
                                                                    onClick={() => setRejectReceipt(receipt)}
                                                                    disabled={actionLoading}
                                                                >
                                                                    <X className="w-4 h-4" />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>Rechazar comprobante</TooltipContent>
                                                        </Tooltip>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-slate-400">—</span>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* ── Mobile card list ────────────────────────────────────── */}
                <div className="sm:hidden space-y-3">
                    {isLoading ? (
                        <CardSkeleton />
                    ) : receipts.length === 0 ? (
                        <div className="flex flex-col items-center gap-3 py-12 text-slate-400">
                            <ShoppingBag className="w-10 h-10 opacity-40" />
                            <p className="text-sm font-medium">No se encontraron comprobantes</p>
                        </div>
                    ) : (
                        receipts.map((receipt) => {
                            const statusCfg = STATUS_CONFIG[receipt.status];
                            const isPending = receipt.status === 'pending';
                            return (
                                <div key={receipt.id} className="rounded-xl border border-slate-200 bg-white shadow-sm p-4 space-y-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900">{receipt.client?.name || '—'}</p>
                                            <p className="text-xs text-slate-500 mt-0.5">{receipt.seller?.name || '—'}</p>
                                        </div>
                                        <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium shrink-0', statusCfg.className)}>
                                            <span className={cn('w-1.5 h-1.5 rounded-full', statusCfg.dot)} />
                                            {statusCfg.label}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                                        <span className="flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5" />{formatDate(receipt.createdAt)}</span>
                                        <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">{receipt.orderNumber || '—'}</span>
                                        <span className="font-semibold text-slate-800">{formatAmount(receipt.totalAmount)}</span>
                                    </div>
                                    <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                                        {receipt.receiptImageUrl ? (
                                            <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-blue-600 hover:bg-blue-50 text-xs px-2" onClick={() => setPreviewReceipt(receipt)}>
                                                <Eye className="w-3.5 h-3.5" />Ver comprobante
                                            </Button>
                                        ) : (
                                            <span className="text-xs text-slate-400">Sin comprobante</span>
                                        )}
                                        {isPending && (
                                            <div className="flex gap-1">
                                                <Button variant="ghost" size="icon" className="h-7 w-7 text-emerald-600 hover:bg-emerald-50" onClick={() => setApproveReceipt(receipt)} disabled={actionLoading}>
                                                    <Check className="w-4 h-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-7 w-7 text-rose-600 hover:bg-rose-50" onClick={() => setRejectReceipt(receipt)} disabled={actionLoading}>
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* ── Bottom pagination ────────────────────────────────── */}
                {(hasPrevPage || hasNextPage) && !isLoading && (
                    <div className="flex justify-end items-center gap-2 pt-1">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={prevPage}
                            disabled={!hasPrevPage || isLoading}
                            className="gap-1"
                        >
                            <ChevronLeft className="w-3.5 h-3.5" />
                            Anterior
                        </Button>
                        <span className="text-sm text-slate-500 tabular-nums">Página {page}</span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={nextPage}
                            disabled={!hasNextPage || isLoading}
                            className="gap-1"
                        >
                            Siguiente
                            <ChevronRight className="w-3.5 h-3.5" />
                        </Button>
                    </div>
                )}
            </div>

            {/* ── Receipt image preview Dialog ─────────────────────────── */}
            <Dialog open={!!previewReceipt} onOpenChange={(open) => !open && setPreviewReceipt(null)}>
                <DialogContent className="max-w-xl">
                    <DialogHeader>
                        <DialogTitle className="text-base">
                            Comprobante — Pedido {previewReceipt?.orderNumber}
                        </DialogTitle>
                    </DialogHeader>
                    {previewReceipt?.receiptImageUrl ? (
                        <div className="mt-2 rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                            <img
                                src={previewReceipt.receiptImageUrl}
                                alt="Comprobante de pago"
                                className="w-full h-auto max-h-[65vh] object-contain"
                            />
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-40 text-slate-400">
                            <ImageOff className="w-8 h-8" />
                        </div>
                    )}
                    {previewReceipt && (
                        <div className="flex items-center justify-between pt-1 text-sm text-slate-600 border-t border-slate-100">
                            <span>{previewReceipt.client?.name}</span>
                            <span className="font-semibold">{formatAmount(previewReceipt.totalAmount)}</span>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* ── Approve confirmation AlertDialog ─────────────────────── */}
            <AlertDialog open={!!approveReceipt} onOpenChange={(open) => !open && setApproveReceipt(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar aprobación de pago</AlertDialogTitle>
                        <AlertDialogDescription asChild>
                            <div className="space-y-3 text-sm text-slate-600">
                                <p>
                                    ¿Confirmar el pago del pedido{' '}
                                    <span className="font-mono font-semibold text-slate-800">
                                        {approveReceipt?.orderNumber}
                                    </span>{' '}
                                    por{' '}
                                    <span className="font-semibold text-slate-800">
                                        {approveReceipt ? formatAmount(approveReceipt.totalAmount) : ''}
                                    </span>?
                                </p>
                                <p className="text-xs text-slate-500">
                                    Al aprobar, la orden pasará a <strong>Pagado</strong> y el
                                    vendedor recibirá una notificación para preparar el pedido.
                                    El cliente también será notificado.
                                </p>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={actionLoading}>Cancelar</AlertDialogCancel>
                        <Button
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                            onClick={handleApproveConfirm}
                            disabled={actionLoading}
                        >
                            {actionLoading ? (
                                <><Loader2 className="w-4 h-4 animate-spin mr-1.5" />Aprobando...</>
                            ) : 'Aprobar pago'}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* ── Reject Dialog ─────────────────────────────────────────── */}
            <RejectDialog
                open={!!rejectReceipt}
                onOpenChange={(open) => !open && setRejectReceipt(null)}
                onConfirm={handleRejectConfirm}
                isLoading={actionLoading}
            />
        </TooltipProvider>
    );
}


