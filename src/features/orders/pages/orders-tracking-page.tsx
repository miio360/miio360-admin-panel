import { useState, useCallback, Fragment, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
    ChevronLeft, ChevronRight, ChevronDown, ChevronUp,
    ShoppingBag, AlertCircle, Loader2, X,
    Truck, Store, Package, CreditCard,
    DollarSign, MapPin, Phone, Clock,
    CheckCircle2, Ban, UserPlus, User2,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/shared/components/ui/table';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { TooltipProvider } from '@/shared/components/ui/tooltip';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/shared/components/ui/dialog';
import {
    AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
    AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog';
import { PageHeaderGlobal } from '@/shared/components/page-header-global';
import { ErrorGlobal } from '@/shared/components/error-global';
import { useOrdersTracking } from '@/features/orders/hooks/useOrdersTracking';
import { ordersTrackingService } from '@/features/orders/api/ordersTrackingService';
import { userService } from '@/shared/services/userService';
import type { User } from '@/shared/types';
import { AssignCourierModal } from '@/features/orders/components/assign-courier-modal';
import type { Order, OrderStatus as OrderStatusType } from '@/shared/types/order';
import {
    OrderStatus, PaymentStatus,
    PAYMENT_METHOD_LABELS, PAYMENT_USER_STATUS_LABELS,
} from '@/shared/types/order';

// ─── Status styling ────────────────────────────────────────────────────────────

const ORDER_STATUS_CONFIG: Record<string, { label: string; className: string; dot: string }> = {
    [OrderStatus.RESERVED]: { label: 'Pendiente de pago', className: 'bg-amber-50 text-amber-700 border border-amber-200', dot: 'bg-amber-400' },
    [OrderStatus.PENDING_PAY_CONFIRMATION]: { label: 'Pendiente validación pago', className: 'bg-orange-50 text-orange-700 border border-orange-200', dot: 'bg-orange-400' },
    [OrderStatus.PAID]: { label: 'Pagado', className: 'bg-blue-50 text-blue-700 border border-blue-200', dot: 'bg-blue-500' },
    [OrderStatus.PREPARING]: { label: 'Preparando', className: 'bg-indigo-50 text-indigo-700 border border-indigo-200', dot: 'bg-indigo-500' },
    [OrderStatus.PENDING_PICKUP]: { label: 'Esperando courier', className: 'bg-purple-50 text-purple-700 border border-purple-200', dot: 'bg-purple-500' },
    [OrderStatus.PICKED_UP]: { label: 'Recolectado', className: 'bg-cyan-50 text-cyan-700 border border-cyan-200', dot: 'bg-cyan-500' },
    [OrderStatus.IN_TRANSIT]: { label: 'En camino', className: 'bg-sky-50 text-sky-700 border border-sky-200', dot: 'bg-sky-500' },
    [OrderStatus.DELIVERED]: { label: 'Entregado', className: 'bg-teal-50 text-teal-700 border border-teal-200', dot: 'bg-teal-500' },
    [OrderStatus.CANCELLED]: { label: 'Cancelado', className: 'bg-rose-50 text-rose-700 border border-rose-200', dot: 'bg-rose-500' },
    [OrderStatus.CANCELLED_BY_SELLER]: { label: 'Cancel. vendedor', className: 'bg-rose-50 text-rose-700 border border-rose-200', dot: 'bg-rose-500' },
    [OrderStatus.PENDING_REFUND]: { label: 'Pend. reembolso', className: 'bg-yellow-50 text-yellow-700 border border-yellow-200', dot: 'bg-yellow-500' },
    [OrderStatus.REFUNDED]: { label: 'Reembolsado', className: 'bg-gray-50 text-gray-700 border border-gray-200', dot: 'bg-gray-500' },
    [OrderStatus.COMPLETED]: { label: 'Completado', className: 'bg-emerald-50 text-emerald-700 border border-emerald-200', dot: 'bg-emerald-500' },
};

const PAYMENT_USER_STATUS_CONFIG: Record<string, { label: string; className: string }> = {
    [PaymentStatus.PENDING]: { label: 'Pendiente', className: 'bg-amber-50 text-amber-700 border border-amber-200' },
    [PaymentStatus.COMPLETED]: { label: 'Completado', className: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
    [PaymentStatus.FAILED]: { label: 'Fallido', className: 'bg-rose-50 text-rose-700 border border-rose-200' },
    [PaymentStatus.REFUNDED]: { label: 'Reembolsado', className: 'bg-gray-50 text-gray-700 border border-gray-200' },
};

type StatusFilter = OrderStatusType | 'all';

const STATUS_TABS: { value: StatusFilter; label: string }[] = [
    { value: 'all', label: 'Todos' },
    { value: OrderStatus.RESERVED, label: 'Pend. Pago' },
    { value: OrderStatus.PENDING_PAY_CONFIRMATION, label: 'Pend. Validación' },
    { value: OrderStatus.PAID, label: 'Pagados' },
    { value: OrderStatus.IN_TRANSIT, label: 'En tránsito' },
    { value: OrderStatus.DELIVERED, label: 'Entregados' },
    { value: OrderStatus.COMPLETED, label: 'Completados' },
    { value: OrderStatus.CANCELLED, label: 'Cancelados' },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────

function formatFirestoreDate(ts: { seconds: number; nanoseconds: number } | undefined | null): string {
    if (!ts) return '—';
    return format(new Date(ts.seconds * 1000), 'dd MMM yyyy, HH:mm', { locale: es });
}

function formatAmount(amount: number): string {
    return new Intl.NumberFormat('es-BO', {
        style: 'currency',
        currency: 'BOB',
        minimumFractionDigits: 2,
    }).format(amount);
}

function getStatusConfig(status: string) {
    return ORDER_STATUS_CONFIG[status] || { label: status, className: 'bg-gray-50 text-gray-700 border border-gray-200', dot: 'bg-gray-400' };
}

// ─── Skeletons ─────────────────────────────────────────────────────────────────

function TableSkeleton() {
    return (
        <>
            {Array.from({ length: 8 }).map((_, i) => (
                <TableRow key={i} className="hover:bg-transparent">
                    <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-7 w-16" /></TableCell>
                </TableRow>
            ))}
        </>
    );
}

function CardSkeleton() {
    return (
        <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-slate-200 bg-white p-4 space-y-2">
                    <div className="flex justify-between">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-5 w-24 rounded-full" />
                    </div>
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-4 w-24" />
                </div>
            ))}
        </div>
    );
}

// ─── Expandable details section ────────────────────────────────────────────────

function OrderExpandedDetails({
    order,
    onManagePayment,
    onAssignCourier,
}: {
    order: Order;
    onManagePayment: (order: Order) => void;
    onAssignCourier: (order: Order) => void;
}) {
    return (
        <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Comprador */}
                <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                        <User2 className="w-3.5 h-3.5" /> Comprador
                    </h4>
                    <div className="space-y-1 text-sm">
                        <p className="font-medium text-slate-900">{order.userName}</p>
                        {order.userPhone && (
                            <p className="text-slate-500 flex items-center gap-1">
                                <Phone className="w-3 h-3" /> {order.userPhone}
                            </p>
                        )}
                    </div>
                </div>

                {/* Vendedor */}
                <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                        <Store className="w-3.5 h-3.5" /> Vendedor
                    </h4>
                    <div className="space-y-1 text-sm">
                        <p className="font-medium text-slate-900">{order.sellerName}</p>
                        {order.seller?.phone && (
                            <p className="text-slate-500 flex items-center gap-1">
                                <Phone className="w-3 h-3" /> {order.seller.phone}
                            </p>
                        )}
                        {order.seller?.storeName && (
                            <p className="text-xs text-slate-400">Tienda: {order.seller.storeName}</p>
                        )}
                    </div>
                </div>

                {/* Courier */}
                <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5" /> Courier
                    </h4>
                    <div className="space-y-1.5 text-sm">
                        {order.courierName ? (
                            <p className="font-medium text-slate-900">{order.courierName}</p>
                        ) : (
                            <>
                                <p className="text-slate-400 italic">Sin asignar</p>
                                <button
                                    onClick={(e) => { e.stopPropagation(); onAssignCourier(order); }}
                                    className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800 hover:underline transition-colors"
                                >
                                    <UserPlus className="w-3.5 h-3.5" />
                                    Asignar courier
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Productos */}
                <div className="space-y-2 md:col-span-2">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                        <Package className="w-3.5 h-3.5" /> Productos ({order.items?.length || 0})
                    </h4>
                    <div className="space-y-1.5">
                        {order.items?.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3 bg-white rounded-lg px-3 py-2 border border-slate-100">
                                {item.productImage && (
                                    <img src={item.productImage} alt={item.productName} className="w-8 h-8 rounded object-cover" />
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-800 truncate">{item.productName}</p>
                                    <p className="text-xs text-slate-400">x{item.quantity} · {formatAmount(item.unitPrice)} c/u</p>
                                </div>
                                <span className="text-sm font-semibold text-slate-700">{formatAmount(item.totalPrice)}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pago */}
                <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5" /> Pago
                    </h4>
                    <div className="space-y-1 text-sm">
                        <p className="text-slate-600">
                            Método: <span className="font-medium text-slate-800">{PAYMENT_METHOD_LABELS[order.payment?.method] || order.payment?.method || '—'}</span>
                        </p>
                        <p className="text-slate-600">
                            Estado: <span className="font-medium text-slate-800">{PAYMENT_USER_STATUS_LABELS[order.payment?.status] || order.payment?.status || '—'}</span>
                        </p>
                        <div className="pt-1 space-y-1">
                            <p className="text-slate-600">Subtotal: <span className="font-medium">{formatAmount(order.subtotal)}</span></p>
                            <p className="text-slate-600">Envío: <span className="font-medium">{formatAmount(order.shippingCost)}</span></p>
                            {order.discount > 0 && <p className="text-slate-600">Descuento: <span className="font-medium text-green-600">-{formatAmount(order.discount)}</span></p>}
                            <p className="text-slate-800 font-bold">Total: {formatAmount(order.total)}</p>
                        </div>
                    </div>
                </div>

                {/* Dirección de envío */}
                {order.shippingAddress && (
                    <div className="space-y-2">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5" /> Dirección de envío
                        </h4>
                        <div className="space-y-1 text-sm">
                            <p className="text-slate-600">{order.shippingAddress.location?.address || '—'}</p>
                            {order.shippingAddress.location?.city && (
                                <p className="text-slate-400 text-xs">{order.shippingAddress.location.city}</p>
                            )}
                            {order.shippingAddress.additionalInfo && (
                                <p className="text-slate-500 text-xs italic">{order.shippingAddress.additionalInfo}</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Fechas */}
                <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" /> Fechas
                    </h4>
                    <div className="space-y-1 text-sm text-slate-600">
                        <p>Creado: <span className="font-medium">{formatFirestoreDate(order.createdAt)}</span></p>
                        <p>Actualizado: <span className="font-medium">{formatFirestoreDate(order.updatedAt)}</span></p>
                        {order.deliveredAt && <p>Entregado: <span className="font-medium">{formatFirestoreDate(order.deliveredAt)}</span></p>}
                        {order.cancelledAt && <p>Cancelado: <span className="font-medium">{formatFirestoreDate(order.cancelledAt)}</span></p>}
                    </div>
                </div>

                {/* Pago a usuario (paymentUserStatus) */}
                <div className="space-y-2 md:col-span-3">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5" /> Pago al usuario
                    </h4>
                    <PaymentUserStatusSection order={order} onManagePayment={onManagePayment} />
                </div>

                {/* Notas / Razón de cancelación */}
                {(order.notes || order.cancelReason) && (
                    <div className="space-y-2 md:col-span-3">
                        {order.notes && (
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase mb-1">Notas</p>
                                <p className="text-sm text-slate-600 bg-white rounded-lg px-3 py-2 border border-slate-100">{order.notes}</p>
                            </div>
                        )}
                        {order.cancelReason && (
                            <div>
                                <p className="text-xs font-bold text-rose-500 uppercase mb-1">Razón de cancelación</p>
                                <p className="text-sm text-rose-600 bg-rose-50 rounded-lg px-3 py-2 border border-rose-100">{order.cancelReason}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Payment user status section ───────────────────────────────────────────────

function PaymentUserStatusSection({ order, onManagePayment }: { order: Order; onManagePayment: (order: Order) => void }) {
    if (!order.paymentUserStatus) {
        return (
            <div className="flex items-center gap-3 bg-white rounded-lg px-4 py-3 border border-slate-100">
                <AlertCircle className="w-4 h-4 text-slate-400 shrink-0" />
                <div>
                    <p className="text-sm text-slate-500">No hay pago pendiente al usuario.</p>
                    <p className="text-xs text-slate-400">Revise los comprobantes de pago para más información.</p>
                </div>
            </div>
        );
    }

    const pus = order.paymentUserStatus;
    const statusConfig = PAYMENT_USER_STATUS_CONFIG[pus.status] || { label: pus.status, className: 'bg-gray-50 text-gray-700 border border-gray-200' };
    const toUserLabel = pus.toUser === 'seller' ? 'Vendedor' : 'Cliente';

    return (
        <div className="flex items-center justify-between gap-4 bg-white rounded-lg px-4 py-3 border border-slate-100">
            <div className="flex items-center gap-4">
                <div>
                    <p className="text-sm text-slate-600">
                        Pago a: <span className="font-semibold text-slate-800">{toUserLabel}</span>
                    </p>
                    <span className={cn(
                        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium mt-1',
                        statusConfig.className,
                    )}>
                        {statusConfig.label}
                    </span>
                </div>
                <div className="text-sm text-slate-600">
                    Total: <span className="font-bold text-slate-800">{formatAmount(pus.amount ?? order.total)}</span>
                </div>
            </div>
            {pus.status === PaymentStatus.PENDING && (
                <Button
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
                    onClick={() => onManagePayment(order)}
                >
                    <DollarSign className="w-3.5 h-3.5" />
                    Gestionar pago
                </Button>
            )}
        </div>
    );
}

// ─── Main page component ───────────────────────────────────────────────────────

export function OrdersTrackingPage() {
    const {
        orders, isLoading, error, refetch,
        page, hasNextPage, hasPrevPage,
        statusFilter, setStatusFilter,
        nextPage, prevPage,
    } = useOrdersTracking();

    const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
    const [paymentOrder, setPaymentOrder] = useState<Order | null>(null);
    const [cancelOrder, setCancelOrder] = useState<Order | null>(null);
    const [assignCourierOrder, setAssignCourierOrder] = useState<Order | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [actionError, setActionError] = useState<string | null>(null);

    const [clientUser, setClientUser] = useState<User | null>(null);
    const [isFetchingClient, setIsFetchingClient] = useState(false);

    useEffect(() => {
        if (paymentOrder?.paymentUserStatus?.toUser === 'client' && paymentOrder.userId) {
            setIsFetchingClient(true);
            userService.getById(paymentOrder.userId)
                .then(user => setClientUser(user))
                .catch(err => console.error('Error fetching client user data:', err))
                .finally(() => setIsFetchingClient(false));
        } else {
            setClientUser(null);
            setIsFetchingClient(false);
        }
    }, [paymentOrder]);

    const activeTab: StatusFilter = statusFilter ?? 'all';

    const toggleExpand = (orderId: string) => {
        setExpandedOrders((prev) => {
            const next = new Set(prev);
            if (next.has(orderId)) next.delete(orderId);
            else next.add(orderId);
            return next;
        });
    };

    const handleStatusTab = (tab: StatusFilter) => {
        setStatusFilter(tab === 'all' ? undefined : tab as OrderStatusType);
    };

    // ── Payment management modal ──
    const handleMarkPaymentCompleted = useCallback(async () => {
        if (!paymentOrder) return;
        try {
            setActionLoading(true);
            setActionError(null);
            await ordersTrackingService.markPaymentUserCompleted(paymentOrder.id);
            setPaymentOrder(null);
        } catch (err) {
            setActionError(err instanceof Error ? err.message : 'Error al marcar pago');
        } finally {
            setActionLoading(false);
        }
    }, [paymentOrder]);

    // ── Cancel order ──
    const handleCancelOrder = useCallback(async () => {
        if (!cancelOrder) return;
        try {
            setActionLoading(true);
            setActionError(null);
            await ordersTrackingService.cancelOrder(cancelOrder.id, 'Cancelado por admin');
            setCancelOrder(null);
        } catch (err) {
            setActionError(err instanceof Error ? err.message : 'Error al cancelar pedido');
        } finally {
            setActionLoading(false);
        }
    }, [cancelOrder]);

    if (error) return <ErrorGlobal message={error} onRetry={refetch} />;

    return (
        <TooltipProvider delayDuration={300}>
            <div className="space-y-6 p-4 sm:p-6">
                <PageHeaderGlobal
                    title="Seguimiento de Pedidos"
                    description="Visualiza y gestiona todos los pedidos en tiempo real"
                />

                {/* Status filter tabs */}
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="inline-flex items-center gap-1 bg-slate-100 p-1 rounded-lg overflow-x-auto">
                        {STATUS_TABS.map(({ value, label }) => (
                            <button
                                key={value}
                                onClick={() => handleStatusTab(value)}
                                className={cn(
                                    'px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-150 whitespace-nowrap',
                                    activeTab === value
                                        ? 'bg-white text-slate-900 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-700',
                                )}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={prevPage} disabled={!hasPrevPage || isLoading} className="h-8 w-8 p-0">
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <span className="text-sm text-slate-600 tabular-nums min-w-16 text-center">Página {page}</span>
                        <Button variant="outline" size="sm" onClick={nextPage} disabled={!hasNextPage || isLoading} className="h-8 w-8 p-0">
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Action error banner */}
                {actionError && (
                    <div className="flex items-center gap-2 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-4 py-3">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{actionError}</span>
                        <button onClick={() => setActionError(null)} className="ml-auto text-rose-500 hover:text-rose-700">
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </div>
                )}

                {/* ── Desktop Table ───────────────────────────────────── */}
                <div className="hidden sm:block rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50 hover:bg-slate-50 border-b border-slate-200">
                                <TableHead className="w-10 pl-3"></TableHead>
                                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">N° Pedido</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Comprador</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Vendedor</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Estado</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Courier</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Pago usuario</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Fecha</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableSkeleton />
                            ) : orders.length === 0 ? (
                                <TableRow className="hover:bg-transparent">
                                    <TableCell colSpan={9} className="py-16 text-center">
                                        <div className="flex flex-col items-center gap-3 text-slate-400">
                                            <ShoppingBag className="w-10 h-10 opacity-40" />
                                            <p className="text-sm font-medium">No se encontraron pedidos</p>
                                            <p className="text-xs">
                                                {activeTab !== 'all'
                                                    ? 'No hay pedidos con este estado'
                                                    : 'Los pedidos aparecerán aquí en tiempo real'}
                                            </p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                orders.map((order) => {
                                    const isExpanded = expandedOrders.has(order.id);
                                    const statusCfg = getStatusConfig(order.status);
                                    const paymentUserCfg = order.paymentUserStatus
                                        ? PAYMENT_USER_STATUS_CONFIG[order.paymentUserStatus.status]
                                        : null;

                                    return (
                                        <Fragment key={order.id}>
                                            <TableRow
                                                className={cn(
                                                    'border-b border-slate-100 hover:bg-slate-50/60 transition-colors cursor-pointer',
                                                    isExpanded && 'bg-slate-50/40',
                                                )}
                                                onClick={() => toggleExpand(order.id)}
                                            >
                                                <TableCell className="pl-3">
                                                    {isExpanded ? (
                                                        <ChevronUp className="w-4 h-4 text-slate-400" />
                                                    ) : (
                                                        <ChevronDown className="w-4 h-4 text-slate-400" />
                                                    )}
                                                </TableCell>

                                                <TableCell>
                                                    <span className="font-mono text-xs text-slate-700 bg-slate-100 px-2 py-1 rounded-md">
                                                        {order.orderNumber || '—'}
                                                    </span>
                                                </TableCell>

                                                <TableCell>
                                                    <p className="text-sm font-medium text-slate-900 leading-tight truncate max-w-32">
                                                        {order.userName || '—'}
                                                    </p>
                                                </TableCell>

                                                <TableCell>
                                                    <p className="text-sm text-slate-700 truncate max-w-32">
                                                        {order.sellerName || '—'}
                                                    </p>
                                                </TableCell>

                                                <TableCell className="text-sm font-semibold text-slate-800 tabular-nums whitespace-nowrap">
                                                    {formatAmount(order.total)}
                                                </TableCell>

                                                <TableCell>
                                                    <span className={cn(
                                                        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap',
                                                        statusCfg.className,
                                                    )}>
                                                        <span className={cn('w-1.5 h-1.5 rounded-full', statusCfg.dot)} />
                                                        {statusCfg.label}
                                                    </span>
                                                </TableCell>

                                                <TableCell>
                                                    <span className="text-sm text-slate-600 truncate max-w-28">
                                                        {order.courierName || <span className="text-slate-400 italic">Sin asignar</span>}
                                                    </span>
                                                </TableCell>

                                                <TableCell>
                                                    {order.paymentUserStatus ? (
                                                        <span className={cn(
                                                            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap',
                                                            paymentUserCfg?.className || 'bg-gray-50 text-gray-700 border border-gray-200',
                                                        )}>
                                                            {order.paymentUserStatus.toUser === 'seller' ? '→ Vendedor' : '→ Cliente'}
                                                            {' · '}
                                                            {paymentUserCfg?.label || order.paymentUserStatus.status}
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs text-slate-400">—</span>
                                                    )}
                                                </TableCell>

                                                <TableCell className="text-sm text-slate-500 whitespace-nowrap">
                                                    {formatFirestoreDate(order.createdAt)}
                                                </TableCell>
                                            </TableRow>

                                            {isExpanded && (
                                                <TableRow className="hover:bg-transparent">
                                                    <TableCell colSpan={9} className="p-0">
                                                        <OrderExpandedDetails
                                                            order={order}
                                                            onManagePayment={setPaymentOrder}
                                                            onAssignCourier={setAssignCourierOrder}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </Fragment>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* ── Mobile cards ─────────────────────────────────────── */}
                <div className="sm:hidden space-y-3">
                    {isLoading ? (
                        <CardSkeleton />
                    ) : orders.length === 0 ? (
                        <div className="flex flex-col items-center gap-3 py-12 text-slate-400">
                            <ShoppingBag className="w-10 h-10 opacity-40" />
                            <p className="text-sm font-medium">No se encontraron pedidos</p>
                        </div>
                    ) : (
                        orders.map((order) => {
                            const isExpanded = expandedOrders.has(order.id);
                            const statusCfg = getStatusConfig(order.status);
                            return (
                                <div key={order.id} className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                                    <button
                                        className="w-full p-4 text-left space-y-2"
                                        onClick={() => toggleExpand(order.id)}
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="min-w-0">
                                                <p className="font-mono text-xs text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded inline-block">
                                                    {order.orderNumber}
                                                </p>
                                                <p className="text-sm font-semibold text-slate-900 mt-1">{order.userName}</p>
                                                <p className="text-xs text-slate-500">{order.sellerName}</p>
                                            </div>
                                            <div className="flex flex-col items-end gap-1 shrink-0">
                                                <span className={cn(
                                                    'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
                                                    statusCfg.className,
                                                )}>
                                                    <span className={cn('w-1.5 h-1.5 rounded-full', statusCfg.dot)} />
                                                    {statusCfg.label}
                                                </span>
                                                <span className="text-sm font-bold text-slate-800">{formatAmount(order.total)}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between text-xs text-slate-400">
                                            <span>{formatFirestoreDate(order.createdAt)}</span>
                                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                        </div>
                                    </button>
                                    {isExpanded && (
                                        <OrderExpandedDetails
                                            order={order}
                                            onManagePayment={setPaymentOrder}
                                            onAssignCourier={setAssignCourierOrder}
                                        />
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Bottom pagination */}
                {(hasPrevPage || hasNextPage) && !isLoading && (
                    <div className="flex justify-end items-center gap-2 pt-1">
                        <Button variant="outline" size="sm" onClick={prevPage} disabled={!hasPrevPage} className="gap-1">
                            <ChevronLeft className="w-3.5 h-3.5" /> Anterior
                        </Button>
                        <span className="text-sm text-slate-500 tabular-nums">Página {page}</span>
                        <Button variant="outline" size="sm" onClick={nextPage} disabled={!hasNextPage} className="gap-1">
                            Siguiente <ChevronRight className="w-3.5 h-3.5" />
                        </Button>
                    </div>
                )}
            </div>

            {/* ── Payment management dialog ─────────────────────────── */}
            <Dialog open={!!paymentOrder} onOpenChange={(open) => !open && setPaymentOrder(null)}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-base">
                            Gestionar pago — Pedido {paymentOrder?.orderNumber}
                        </DialogTitle>
                        <DialogDescription className="text-sm text-slate-500">
                            {paymentOrder?.paymentUserStatus?.toUser === 'seller'
                                ? 'Debe realizarse el pago al vendedor'
                                : 'Debe realizarse el reembolso al cliente'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 pt-2">
                        {/* Info del destinatario */}
                        <div className="rounded-lg bg-slate-50 border border-slate-100 p-4 space-y-2">
                            <p className="text-xs font-bold text-slate-500 uppercase">
                                {paymentOrder?.paymentUserStatus?.toUser === 'seller' ? 'Datos del vendedor' : 'Datos del cliente'}
                            </p>
                            {paymentOrder?.paymentUserStatus?.toUser === 'seller' ? (
                                <>
                                    <p className="text-sm font-medium text-slate-900">{paymentOrder?.sellerName}</p>
                                    {paymentOrder?.seller?.phone && (
                                        <p className="text-sm text-slate-500 flex items-center gap-1">
                                            <Phone className="w-3 h-3" /> {paymentOrder.seller.phone}
                                        </p>
                                    )}
                                </>
                            ) : (
                                <>
                                    <p className="text-sm font-medium text-slate-900">{paymentOrder?.userName}</p>
                                    {isFetchingClient ? (
                                        <p className="text-sm text-slate-500 flex items-center gap-1">
                                            <Loader2 className="w-3 h-3 animate-spin" /> Cargando teléfono...
                                        </p>
                                    ) : (clientUser?.profile?.phone || paymentOrder?.userPhone) ? (
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm text-slate-500 flex items-center gap-1">
                                                <Phone className="w-3 h-3" /> {clientUser?.profile?.phone || paymentOrder?.userPhone}
                                            </p>
                                            <a
                                                href={`https://wa.me/${String(clientUser?.profile?.phone || paymentOrder?.userPhone).replace(/[^0-9]/g, '')}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-xs font-medium text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-2 py-1 rounded transition-colors"
                                            >
                                                Contactar por WhatsApp
                                            </a>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-slate-400 italic">Celular no disponible</p>
                                    )}
                                </>
                            )}
                            <p className="text-lg font-bold text-slate-900 pt-1">{paymentOrder ? formatAmount(paymentOrder.paymentUserStatus?.amount ?? paymentOrder.total) : ''}</p>
                        </div>

                        {/* QR del vendedor si aplica */}
                        {paymentOrder?.paymentUserStatus?.toUser === 'seller' && paymentOrder?.payment?.qrImageUrl ? (
                            <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
                                <p className="text-xs font-bold text-slate-500 px-4 pt-3 uppercase">QR de pago del vendedor</p>
                                <img
                                    src={paymentOrder.payment.qrImageUrl}
                                    alt="QR de pago"
                                    className="w-full max-h-64 object-contain p-2"
                                />
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
                                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                                <p className="text-sm text-amber-700">
                                    Contacte al {paymentOrder?.paymentUserStatus?.toUser === 'seller' ? 'vendedor' : 'cliente'} para coordinar el pago.
                                </p>
                            </div>
                        )}

                        {actionError && (
                            <div className="flex items-center gap-2 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <span>{actionError}</span>
                            </div>
                        )}
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            variant="outline"
                            onClick={() => { setPaymentOrder(null); setActionError(null); }}
                            disabled={actionLoading}
                        >
                            Cancelar
                        </Button>
                        <Button
                            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
                            onClick={handleMarkPaymentCompleted}
                            disabled={actionLoading}
                        >
                            {actionLoading ? (
                                <><Loader2 className="w-4 h-4 animate-spin" /> Procesando...</>
                            ) : (
                                <><CheckCircle2 className="w-4 h-4" /> Marcar como pagado</>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ── Cancel order alert dialog ──────────────────────────── */}
            <AlertDialog open={!!cancelOrder} onOpenChange={(open) => !open && setCancelOrder(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Cancelar pedido</AlertDialogTitle>
                        <AlertDialogDescription asChild>
                            <div className="space-y-2 text-sm text-slate-600">
                                <p>
                                    ¿Estás seguro de cancelar el pedido{' '}
                                    <span className="font-mono font-semibold text-slate-800">{cancelOrder?.orderNumber}</span>?
                                </p>
                                <p className="text-xs text-slate-500">
                                    Si el pago del cliente ya fue confirmado, se generará automáticamente un reembolso pendiente.
                                </p>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={actionLoading}>Volver</AlertDialogCancel>
                        <Button
                            className="bg-rose-600 hover:bg-rose-700 text-white gap-1.5"
                            onClick={handleCancelOrder}
                            disabled={actionLoading}
                        >
                            {actionLoading ? (
                                <><Loader2 className="w-4 h-4 animate-spin" /> Cancelando...</>
                            ) : (
                                <><Ban className="w-4 h-4" /> Confirmar cancelación</>
                            )}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* ── Assign courier modal ──────────────────────────── */}
            <AssignCourierModal
                order={assignCourierOrder}
                onClose={() => setAssignCourierOrder(null)}
                onSuccess={() => setAssignCourierOrder(null)}
            />
        </TooltipProvider>
    );
}
