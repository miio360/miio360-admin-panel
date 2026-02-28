import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import { ShipmentPrice } from '@/shared/types/shipment-price';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Button } from '@/shared/components/ui/button';
import { Edit2, Trash2, MapPin } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/components/ui/tooltip';

interface ShipmentPricesTableProps {
    prices: ShipmentPrice[];
    isLoading: boolean;
    onRefetch: () => void;
    onEdit?: (price: ShipmentPrice) => void;
    onDelete?: (id: string) => void;
}

function TableSkeleton() {
    return (
        <>
            {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="hover:bg-transparent">
                    <TableCell className="pl-5"><Skeleton className="h-4 w-28" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell className="text-right pr-5">
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

function formatAmount(amount: number): string {
    return new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB', minimumFractionDigits: 2 }).format(amount);
}

const TYPE_CONFIG: Record<string, { label: string; className: string; dot: string }> = {
    local: { label: 'Local', className: 'bg-emerald-50 text-emerald-700 border border-emerald-200', dot: 'bg-emerald-500' },
    national: { label: 'Nacional', className: 'bg-indigo-50 text-indigo-700 border border-indigo-200', dot: 'bg-indigo-500' },
};

export function ShipmentPricesTable({ prices, isLoading, onEdit, onDelete }: ShipmentPricesTableProps) {
    return (
        <TooltipProvider delayDuration={300}>
            <div className="hidden sm:block rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50 hover:bg-slate-50 border-b border-slate-200">
                            <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide pl-5">Fecha</TableHead>
                            <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Origen</TableHead>
                            <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Destino</TableHead>
                            <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Tipo de Envío</TableHead>
                            <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Precio Base</TableHead>
                            <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Kg Extra</TableHead>
                            <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide text-right pr-5">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableSkeleton />
                        ) : prices.length === 0 ? (
                            <TableRow className="hover:bg-transparent">
                                <TableCell colSpan={7} className="py-16 text-center">
                                    <div className="flex flex-col items-center gap-3 text-slate-400">
                                        <MapPin className="w-10 h-10 opacity-40" />
                                        <p className="text-sm font-medium">No se encontraron precios de envío</p>
                                        <p className="text-xs text-slate-400">
                                            Agrega un nuevo precio para comenzar listarlos aquí.
                                        </p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            prices.map((price) => {
                                const typeCfg = TYPE_CONFIG[price.type] || { label: price.type, className: 'bg-slate-50 text-slate-700 border-slate-200', dot: 'bg-slate-500' };
                                return (
                                    <TableRow key={price.id} className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors">
                                        <TableCell className="pl-5 text-sm text-slate-600 whitespace-nowrap">
                                            {price.createdAt ? format(price.createdAt.toDate(), 'dd MMM yyyy, HH:mm', { locale: es }) : '—'}
                                        </TableCell>
                                        <TableCell>
                                            <p className="text-sm font-medium text-slate-900 leading-tight">{price.from || '—'}</p>
                                        </TableCell>
                                        <TableCell>
                                            <p className="text-sm font-medium text-slate-900 leading-tight">{price.to || '—'}</p>
                                        </TableCell>
                                        <TableCell>
                                            <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium', typeCfg.className)}>
                                                <span className={cn('w-1.5 h-1.5 rounded-full', typeCfg.dot)} />
                                                {typeCfg.label}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-sm font-semibold text-slate-800 tabular-nums">
                                            {formatAmount(price.price || 0)}
                                        </TableCell>
                                        <TableCell className="text-sm font-semibold text-slate-800 tabular-nums">
                                            {formatAmount(price.excessPerKgPrice || 0)}
                                        </TableCell>
                                        <TableCell className="text-right pr-5">
                                            <div className="flex justify-end gap-1">
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="ghost" size="icon"
                                                            className="h-7 w-7 text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-colors"
                                                            onClick={() => onEdit && onEdit(price)}
                                                        >
                                                            <Edit2 className="w-4 h-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>Editar precio</TooltipContent>
                                                </Tooltip>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="ghost" size="icon"
                                                            className="h-7 w-7 text-rose-600 hover:text-rose-800 hover:bg-rose-50 transition-colors"
                                                            onClick={() => onDelete && onDelete(price.id)}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>Eliminar precio</TooltipContent>
                                                </Tooltip>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile view */}
            <div className="sm:hidden space-y-3">
                {isLoading ? (
                    <div className="space-y-3">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="rounded-xl border border-slate-200 bg-white p-4 space-y-2">
                                <Skeleton className="h-4 w-28" />
                                <Skeleton className="h-5 w-20 rounded-full" />
                                <Skeleton className="h-4 w-36" />
                            </div>
                        ))}
                    </div>
                ) : prices.length === 0 ? (
                    <div className="flex flex-col items-center gap-3 py-12 text-slate-400 bg-white rounded-xl border border-slate-200">
                        <MapPin className="w-10 h-10 opacity-40" />
                        <p className="text-sm font-medium">No se encontraron precios</p>
                    </div>
                ) : (
                    prices.map((price) => {
                        const typeCfg = TYPE_CONFIG[price.type] || { label: price.type, className: 'bg-slate-50 text-slate-700', dot: 'bg-slate-500' };
                        return (
                            <div key={price.id} className="rounded-xl border border-slate-200 bg-white shadow-sm p-4 space-y-3">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-slate-500">Origen</span>
                                            <p className="text-sm font-semibold text-slate-900">{price.from || '—'}</p>
                                        </div>
                                        <div className="flex flex-col mt-2">
                                            <span className="text-xs text-slate-500">Destino</span>
                                            <p className="text-sm font-semibold text-slate-900">{price.to || '—'}</p>
                                        </div>
                                    </div>
                                    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium shrink-0', typeCfg.className)}>
                                        <span className={cn('w-1.5 h-1.5 rounded-full', typeCfg.dot)} />
                                        {typeCfg.label}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                                    <div className="flex gap-4">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-slate-500">Precio Base</span>
                                            <span className="font-semibold text-slate-800">{formatAmount(price.price || 0)}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-slate-500">Kg Extra</span>
                                            <span className="font-semibold text-slate-800">{formatAmount(price.excessPerKgPrice || 0)}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-blue-600 hover:bg-blue-50" onClick={() => onEdit && onEdit(price)}>
                                            <Edit2 className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 text-rose-600 hover:bg-rose-50"
                                            onClick={() => onDelete && onDelete(price.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </TooltipProvider>
    );
}
