import { useState, useCallback } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
    Check, X, Eye, CreditCard as CardIcon,
    ImageOff, AlertCircle, Loader2, CalendarDays,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/shared/components/ui/table';
import { Button } from '@/shared/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import {
    AlertDialog, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/components/ui/tooltip';
import { useWalletTransactions } from '../hooks/useWalletTransactions';
import { walletTransactionService } from '@/shared/services/wallet-transaction-service';
import { useAuth } from '@/shared/hooks/useAuth';
import { RejectDialog } from './reject-dialog';
import { ErrorGlobal } from '@/shared/components/error-global';
import type { WalletTransaction } from '@/shared/types/wallet';
import type { RejectionReason } from '@/shared/types/payment';
import { REJECTION_REASON_LABELS } from '@/shared/types/payment';

// ─── Status helpers ────────────────────────────────────────────────────────────

type TxStatus = WalletTransaction['status'];

const STATUS_CONFIG: Record<TxStatus, { label: string; className: string; dot: string }> = {
    pending:   { label: 'Pendiente',    className: 'bg-amber-50 text-amber-700 border border-amber-200',     dot: 'bg-amber-400' },
    completed: { label: 'Aprobado',     className: 'bg-emerald-50 text-emerald-700 border border-emerald-200', dot: 'bg-emerald-500' },
    failed:    { label: 'Rechazado',    className: 'bg-rose-50 text-rose-700 border border-rose-200',         dot: 'bg-rose-500' },
    refunded:  { label: 'Reembolsado',  className: 'bg-slate-100 text-slate-600 border border-slate-200',     dot: 'bg-slate-400' },
};

type StatusFilter = TxStatus | 'all';

const STATUS_TABS: { value: StatusFilter; label: string }[] = [
    { value: 'all',       label: 'Todos' },
    { value: 'pending',   label: 'Pendientes' },
    { value: 'completed', label: 'Aprobados' },
    { value: 'failed',    label: 'Rechazados' },
];

function formatDate(ts: { toDate: () => Date } | undefined): string {
    if (!ts) return '—';
    return format(ts.toDate(), 'dd MMM yyyy, HH:mm', { locale: es });
}

function formatAmount(amount: number): string {
    return new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB', minimumFractionDigits: 2 }).format(amount);
}

// ─── Skeleton rows ─────────────────────────────────────────────────────────────

function TableSkeleton() {
    return (
        <>
            {Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={i} className="hover:bg-transparent">
                    <TableCell className="pl-5"><Skeleton className="h-4 w-28" /></TableCell>
                    <TableCell>
                        <div className="space-y-1.5">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-24" />
                        </div>
                    </TableCell>
                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20 rounded-full" /></TableCell>
                    <TableCell className="text-right pr-5">
                        <div className="flex justify-end gap-1.5">
                            <Skeleton className="h-7 w-7 rounded-md" />
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

export function TransactionsReceiptsTab() {
    const { user } = useAuth();
    const { transactions, isLoading, error, refetch } = useWalletTransactions();

    const [activeTab, setActiveTab] = useState<StatusFilter>('all');
    const [previewTx, setPreviewTx] = useState<WalletTransaction | null>(null);
    const [approveTx, setApproveTx] = useState<WalletTransaction | null>(null);
    const [rejectTx, setRejectTx] = useState<WalletTransaction | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [actionError, setActionError] = useState<string | null>(null);

    const filtered: WalletTransaction[] = activeTab === 'all'
        ? transactions
        : transactions.filter((tx) => tx.status === activeTab);

    const handleApproveConfirm = useCallback(async () => {
        if (!user?.id || !approveTx) return;
        try {
            setActionLoading(true);
            setActionError(null);
            await walletTransactionService.approve(approveTx.seller.id, approveTx.id, user.id);
            setApproveTx(null);
            await refetch();
        } catch (err) {
            setActionError(err instanceof Error ? err.message : 'Error al aprobar');
        } finally {
            setActionLoading(false);
        }
    }, [approveTx, user, refetch]);

    const handleRejectConfirm = useCallback(async (reason: RejectionReason, comment?: string) => {
        if (!user?.id || !rejectTx) return;
        try {
            setActionLoading(true);
            setActionError(null);
            const reasonText = reason === 'other' ? (comment || 'Sin motivo especificado') : REJECTION_REASON_LABELS[reason];
            await walletTransactionService.reject(rejectTx.seller.id, rejectTx.id, user.id, reasonText);
            setRejectTx(null);
            await refetch();
        } catch (err) {
            setActionError(err instanceof Error ? err.message : 'Error al rechazar');
        } finally {
            setActionLoading(false);
        }
    }, [rejectTx, user, refetch]);

    if (error) return <ErrorGlobal message={error} onRetry={refetch} />;

    return (
        <TooltipProvider delayDuration={300}>
            <div className="space-y-4">

                {/* ── Filter tabs ──────────────────────────────────────────── */}
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="inline-flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                        {STATUS_TABS.map(({ value, label }) => (
                            <button
                                key={value}
                                onClick={() => setActiveTab(value)}
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
                </div>

                {/* ── Action error banner ──────────────────────────────────── */}
                {actionError && (
                    <div className="flex items-center gap-2 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-4 py-3">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{actionError}</span>
                        <button onClick={() => setActionError(null)} className="ml-auto text-rose-500 hover:text-rose-700">
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </div>
                )}

                {/* ── Desktop table ───────────────────────────────────────── */}
                <div className="hidden sm:block rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50 hover:bg-slate-50 border-b border-slate-200">
                                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide pl-5">Fecha</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Comprador</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Plan</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Precio</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Estado</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide text-right pr-5">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableSkeleton />
                            ) : filtered.length === 0 ? (
                                <TableRow className="hover:bg-transparent">
                                    <TableCell colSpan={6} className="py-16 text-center">
                                        <div className="flex flex-col items-center gap-3 text-slate-400">
                                            <CardIcon className="w-10 h-10 opacity-40" />
                                            <p className="text-sm font-medium">No se encontraron transacciones</p>
                                            <p className="text-xs text-slate-400">
                                                {activeTab !== 'all' ? 'No hay transacciones con este estado' : 'Las transacciones aparecerán aquí'}
                                            </p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filtered.map((tx) => {
                                    const statusCfg = STATUS_CONFIG[tx.status] ?? STATUS_CONFIG.failed;
                                    const isPending = tx.status === 'pending';
                                    return (
                                        <TableRow key={tx.id} className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors">
                                            <TableCell className="pl-5 text-sm text-slate-600 whitespace-nowrap">
                                                {formatDate(tx.createdAt)}
                                            </TableCell>
                                            <TableCell>
                                                <p className="text-sm font-medium text-slate-900 leading-tight">{tx.seller?.name || '—'}</p>
                                                <p className="text-xs text-slate-400 mt-0.5 truncate max-w-40">{tx.seller?.id || '—'}</p>
                                            </TableCell>
                                            <TableCell className="text-sm text-slate-800">
                                                {tx.plan?.title || tx.description || '—'}
                                            </TableCell>
                                            <TableCell className="text-sm font-semibold text-slate-800 tabular-nums">
                                                {formatAmount(tx.price || 0)}
                                            </TableCell>
                                            <TableCell>
                                                <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium', statusCfg.className)}>
                                                    <span className={cn('w-1.5 h-1.5 rounded-full', statusCfg.dot)} />
                                                    {statusCfg.label}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right pr-5">
                                                <div className="flex justify-end gap-1">
                                                    {tx.receipt?.url && (
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="ghost" size="icon"
                                                                    className="h-7 w-7 text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-colors"
                                                                    onClick={() => setPreviewTx(tx)}
                                                                >
                                                                    <Eye className="w-4 h-4" />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>Ver comprobante</TooltipContent>
                                                        </Tooltip>
                                                    )}
                                                    {isPending && (
                                                        <>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Button
                                                                        variant="ghost" size="icon"
                                                                        className="h-7 w-7 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 transition-colors"
                                                                        onClick={() => setApproveTx(tx)}
                                                                        disabled={actionLoading}
                                                                    >
                                                                        <Check className="w-4 h-4" />
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>Aprobar transacción</TooltipContent>
                                                            </Tooltip>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Button
                                                                        variant="ghost" size="icon"
                                                                        className="h-7 w-7 text-rose-600 hover:text-rose-800 hover:bg-rose-50 transition-colors"
                                                                        onClick={() => setRejectTx(tx)}
                                                                        disabled={actionLoading}
                                                                    >
                                                                        <X className="w-4 h-4" />
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>Rechazar transacción</TooltipContent>
                                                            </Tooltip>
                                                        </>
                                                    )}
                                                    {!isPending && !tx.receipt?.url && (
                                                        <span className="text-xs text-slate-400">—</span>
                                                    )}
                                                </div>
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
                    ) : filtered.length === 0 ? (
                        <div className="flex flex-col items-center gap-3 py-12 text-slate-400">
                            <CardIcon className="w-10 h-10 opacity-40" />
                            <p className="text-sm font-medium">No se encontraron transacciones</p>
                        </div>
                    ) : (
                        filtered.map((tx) => {
                            const statusCfg = STATUS_CONFIG[tx.status] ?? STATUS_CONFIG.failed;
                            const isPending = tx.status === 'pending';
                            return (
                                <div key={tx.id} className="rounded-xl border border-slate-200 bg-white shadow-sm p-4 space-y-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900">{tx.seller?.name || '—'}</p>
                                            <p className="text-xs text-slate-500 mt-0.5">{tx.plan?.title || tx.description || '—'}</p>
                                        </div>
                                        <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium shrink-0', statusCfg.className)}>
                                            <span className={cn('w-1.5 h-1.5 rounded-full', statusCfg.dot)} />
                                            {statusCfg.label}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-slate-500">
                                        <span className="flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5" />{formatDate(tx.createdAt)}</span>
                                        <span className="font-semibold text-slate-800">{formatAmount(tx.price || 0)}</span>
                                    </div>
                                    <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                                        {tx.receipt?.url ? (
                                            <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-blue-600 hover:bg-blue-50 text-xs px-2" onClick={() => setPreviewTx(tx)}>
                                                <Eye className="w-3.5 h-3.5" />Ver comprobante
                                            </Button>
                                        ) : (
                                            <span className="text-xs text-slate-400">Sin comprobante</span>
                                        )}
                                        {isPending && (
                                            <div className="flex gap-1">
                                                <Button variant="ghost" size="icon" className="h-7 w-7 text-emerald-600 hover:bg-emerald-50" onClick={() => setApproveTx(tx)} disabled={actionLoading}>
                                                    <Check className="w-4 h-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-7 w-7 text-rose-600 hover:bg-rose-50" onClick={() => setRejectTx(tx)} disabled={actionLoading}>
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
            </div>

            {/* ── Receipt preview Dialog ────────────────────────────────── */}
            <Dialog open={!!previewTx} onOpenChange={(open) => !open && setPreviewTx(null)}>
                <DialogContent className="max-w-xl">
                    <DialogHeader>
                        <DialogTitle className="text-base">
                            Comprobante — {previewTx?.seller?.name}
                        </DialogTitle>
                    </DialogHeader>
                    {previewTx?.receipt?.url ? (
                        <div className="mt-2 rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                            <img src={previewTx.receipt.url} alt="Comprobante" className="w-full h-auto max-h-[65vh] object-contain" />
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-40 text-slate-400">
                            <ImageOff className="w-8 h-8" />
                        </div>
                    )}
                    {previewTx && (
                        <div className="flex items-center justify-between pt-1 text-sm text-slate-600 border-t border-slate-100">
                            <span>{previewTx.plan?.title || previewTx.description}</span>
                            <span className="font-semibold">{formatAmount(previewTx.price || 0)}</span>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* ── Approve confirmation AlertDialog ──────────────────────── */}
            <AlertDialog open={!!approveTx} onOpenChange={(open) => !open && setApproveTx(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar aprobación de transacción</AlertDialogTitle>
                        <AlertDialogDescription asChild>
                            <div className="space-y-3 text-sm text-slate-600">
                                <p>
                                    ¿Aprobar la transacción de{' '}
                                    <span className="font-semibold text-slate-800">{approveTx?.seller?.name}</span>{' '}
                                    por{' '}
                                    <span className="font-semibold text-slate-800">{approveTx ? formatAmount(approveTx.price || 0) : ''}</span>?
                                </p>
                                <div className="bg-slate-50 rounded-lg p-3 text-xs space-y-1 border border-slate-200">
                                    <p><span className="text-slate-500">Plan:</span> <span className="font-medium text-slate-800">{approveTx?.plan?.title || approveTx?.description}</span></p>
                                    <p><span className="text-slate-500">Categoría:</span> <span className="font-medium text-slate-800">{approveTx?.category}</span></p>
                                </div>
                                <p className="text-xs text-slate-500">
                                    Al aprobar se acreditará el saldo al usuario de inmediato.
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
                            ) : 'Aprobar transacción'}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* ── Reject Dialog ─────────────────────────────────────────── */}
            <RejectDialog
                open={!!rejectTx}
                onOpenChange={(open) => !open && setRejectTx(null)}
                onConfirm={handleRejectConfirm}
                isLoading={actionLoading}
            />
        </TooltipProvider>
    );
}
