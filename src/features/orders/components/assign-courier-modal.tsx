import { AlertCircle, CheckCircle2, Loader2, MapPin, Package, Phone, Truck, User, Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { useAssignCourier } from '@/features/orders/hooks/useAssignCourier';
import type { Order } from '@/shared/types/order';
import type { CourierSummary } from '@/shared/services/userService';

// ─── Props ────────────────────────────────────────────────────────────────────

interface AssignCourierModalProps {
    order: Order | null;
    onClose: () => void;
    onSuccess: () => void;
}

// ─── Courier row ──────────────────────────────────────────────────────────────

interface CourierRowProps {
    courier: CourierSummary;
    isAssigning: boolean;
    onSelect: (courierId: string) => void;
}

function CourierRow({ courier, isAssigning, onSelect }: CourierRowProps) {
    const initials = courier.fullName
        .split(' ')
        .slice(0, 2)
        .map((w) => w[0] ?? '')
        .join('')
        .toUpperCase();

    return (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-100 bg-white hover:bg-slate-50/70 transition-colors">
            {/* Avatar */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 text-sm font-bold select-none">
                {initials || <User className="w-4 h-4" />}
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1 space-y-0.5">
                <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-900 truncate">{courier.fullName}</p>
                    <span className={cn(
                        'inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium shrink-0',
                        courier.isAvailable
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-500 border border-slate-200',
                    )}>
                        {courier.isAvailable
                            ? <><Wifi className="w-2.5 h-2.5" />Disponible</>
                            : <><WifiOff className="w-2.5 h-2.5" />No disp.</>}
                    </span>
                </div>
                <div className="flex items-center flex-wrap gap-x-3 gap-y-0.5 text-xs text-slate-500">
                    {courier.phone && (
                        <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />{courier.phone}
                        </span>
                    )}
                    {courier.cities.length > 0 && (
                        <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />{courier.cities.join(', ')}
                        </span>
                    )}

                </div>
            </div>

            {/* Action */}
            <Button
                size="sm"
                variant="outline"
                className="shrink-0 h-8 text-xs gap-1.5 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
                disabled={isAssigning}
                onClick={() => onSelect(courier.id)}
            >
                {isAssigning ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
                Asignar
            </Button>
        </div>
    );
}

// ─── Skeleton list ────────────────────────────────────────────────────────────

function CourierListSkeleton() {
    return (
        <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-100">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-1.5">
                        <Skeleton className="h-4 w-36" />
                        <Skeleton className="h-3 w-48" />
                    </div>
                    <Skeleton className="h-8 w-20 rounded-md" />
                </div>
            ))}
        </div>
    );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function AssignCourierModal({ order, onClose, onSuccess }: AssignCourierModalProps) {
    const isOpen = !!order;

    const {
        couriers,
        isLoadingCouriers,
        couriersError,
        isAssigning,
        assignError,
        assign,
        clearAssignError,
    } = useAssignCourier(isOpen);

    async function handleSelect(courierId: string) {
        if (!order) return;
        const ok = await assign(order.id, courierId);
        if (ok) {
            onSuccess();
        }
    }

    function handleClose() {
        if (isAssigning) return;
        clearAssignError();
        onClose();
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="max-w-lg max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-base">
                        <Truck className="w-4 h-4 text-indigo-600" />
                        Asignar repartidor
                    </DialogTitle>
                    <DialogDescription className="text-sm text-slate-500">
                        Pedido{' '}
                        <span className="font-mono font-semibold text-slate-700">
                            {order?.orderNumber}
                        </span>
                        {' '}— selecciona un repartidor para asignarlo manualmente.
                    </DialogDescription>
                </DialogHeader>

                {/* Error banner */}
                {(assignError ?? couriersError) && (
                    <div className="flex items-center gap-2 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2.5">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{assignError ?? couriersError}</span>
                    </div>
                )}

                {/* Courier list */}
                <div className="flex-1 overflow-y-auto min-h-0 space-y-2 pr-1 -mr-1">
                    {isLoadingCouriers ? (
                        <CourierListSkeleton />
                    ) : couriersError ? null : couriers.length === 0 ? (
                        <div className="flex flex-col items-center gap-3 py-12 text-slate-400">
                            <Truck className="w-10 h-10 opacity-40" />
                            <p className="text-sm font-medium">No hay repartidores activos</p>
                            <p className="text-xs text-slate-400">
                                Crea un usuario con rol Courier para poder asignar pedidos.
                            </p>
                        </div>
                    ) : (
                        couriers.map((courier) => (
                            <CourierRow
                                key={courier.id}
                                courier={courier}
                                isAssigning={isAssigning}
                                onSelect={handleSelect}
                            />
                        ))
                    )}
                </div>

                {/* Footer cancel */}
                <div className="pt-2 border-t border-slate-100">
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleClose}
                        disabled={isAssigning}
                    >
                        Cancelar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
