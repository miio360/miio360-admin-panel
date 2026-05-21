import { useState, useEffect } from 'react';
import { Percent, DollarSign, Pencil, X, Save, History, Store, Truck, Loader2, Info } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { useCommissionSettings } from '../hooks/useCommissionSettings';
import { useCommissionForm } from '../hooks/useCommissionForm';
import type { CommissionHistoryEntry } from '@/shared/types/settings';

// ─── Summary card ────────────────────────────────────────────────────────────

function SummaryCard({
    icon: Icon,
    label,
    value,
    unit,
    description,
}: {
    icon: React.ElementType;
    label: string;
    value: number | null;
    unit: string;
    description: string;
}) {
    return (
        <div className="flex items-start gap-3 rounded-xl border border-border bg-card px-4 py-4">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-muted-foreground">{label}</p>
                <p className="mt-0.5 text-2xl font-bold tracking-tight text-foreground">
                    {value === null ? '—' : value}
                    <span className="ml-1 text-sm font-medium text-muted-foreground">{unit}</span>
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
            </div>
        </div>
    );
}

// ─── History row ─────────────────────────────────────────────────────────────

function HistoryRow({ entry, index }: { entry: CommissionHistoryEntry; index: number }) {
    const dateStr = entry.changedAt
        ? format(new Date((entry.changedAt as unknown as { seconds: number }).seconds * 1000), 'dd MMM yyyy, HH:mm', { locale: es })
        : '—';

    return (
        <tr className={cn('text-sm', index % 2 === 0 ? 'bg-muted/30' : 'bg-transparent')}>
            <td className="px-3 py-2 text-muted-foreground whitespace-nowrap">{dateStr}</td>
            <td className="px-3 py-2 truncate max-w-[120px]" title={entry.changedByName}>{entry.changedByName}</td>
            <td className="px-3 py-2 text-center font-medium">Bs {entry.appService}</td>
            <td className="px-3 py-2 text-center font-medium">{entry.sellerService}%</td>
            <td className="px-3 py-2 text-center font-medium">{entry.courierService}%</td>
            <td className="px-3 py-2 text-muted-foreground italic text-xs max-w-[160px] truncate" title={entry.notes}>
                {entry.notes || '—'}
            </td>
        </tr>
    );
}

// ─── Number field ────────────────────────────────────────────────────────────

function NumberField({
    label,
    description,
    unit,
    name,
    register,
    error,
}: {
    label: string;
    description: string;
    unit: string;
    name: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    register: any;
    error?: string;
}) {
    return (
        <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">{label}</label>
            <p className="text-xs text-muted-foreground">{description}</p>
            <div className="flex items-center gap-2">
                <div className="relative flex-1">
                    <Input
                        type="number"
                        step="0.01"
                        min="0"
                        {...register(name, { valueAsNumber: true })}
                        className={cn('pr-10', error && 'border-destructive focus-visible:ring-destructive')}
                    />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">
                        {unit}
                    </span>
                </div>
            </div>
            {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
    );
}

// ─── Main panel ──────────────────────────────────────────────────────────────

export function CommissionSettingsPanel() {
    const { commission, history, isLoading, error, refetch } = useCommissionSettings();
    const [isEditing, setIsEditing] = useState(false);

    const { form, onSubmit, isSubmitting } = useCommissionForm({
        commission,
        onSuccess: () => {
            setIsEditing(false);
            refetch();
        },
    });

    const { register, formState: { errors }, reset } = form;

    // Sync default values when commission data loads
    useEffect(() => {
        if (commission) {
            reset({
                appService: commission.appService,
                sellerService: commission.sellerService,
                courierService: commission.courierService,
                notes: '',
            });
        }
    }, [commission, reset]);

    const handleCancel = () => {
        setIsEditing(false);
        if (commission) {
            reset({
                appService: commission.appService,
                sellerService: commission.sellerService,
                courierService: commission.courierService,
                notes: '',
            });
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center gap-2 py-8 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Cargando comisiones...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Info banner */}
            <div className="flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
                <Info className="mt-0.5 h-4 w-4 shrink-0" />
                <p>
                    Los cambios aplican únicamente a nuevas transacciones. Las órdenes existentes no se ven afectadas.
                </p>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <SummaryCard
                    icon={DollarSign}
                    label="Tarifa de Servicio"
                    value={commission?.appService ?? null}
                    unit="Bs"
                    description="Cargo fijo por cada orden creada"
                />
                <SummaryCard
                    icon={Store}
                    label="Comisión Vendedor"
                    value={commission?.sellerService ?? null}
                    unit="%"
                    description="Porcentaje descontado del pago al vendedor"
                />
                <SummaryCard
                    icon={Truck}
                    label="Comisión Repartidor"
                    value={commission?.courierService ?? null}
                    unit="%"
                    description="Porcentaje descontado del pago al repartidor"
                />
            </div>

            {/* Edit section */}
            {!isEditing ? (
                <div className="flex justify-end">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => setIsEditing(true)}
                    >
                        <Pencil className="h-3.5 w-3.5" />
                        Editar comisiones
                    </Button>
                </div>
            ) : (
                <form onSubmit={onSubmit} className="rounded-xl border border-border bg-card p-5 space-y-5">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                            <Pencil className="h-3.5 w-3.5 text-primary" />
                            Editar Comisiones
                        </h3>
                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={isSubmitting}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <NumberField
                            label="Tarifa de Servicio"
                            description="Monto fijo en Bs por orden"
                            unit="Bs"
                            name="appService"
                            register={register}
                            error={errors.appService?.message}
                        />
                        <NumberField
                            label="Comisión Vendedor"
                            description="Porcentaje sobre el subtotal"
                            unit="%"
                            name="sellerService"
                            register={register}
                            error={errors.sellerService?.message}
                        />
                        <NumberField
                            label="Comisión Repartidor"
                            description="Porcentaje sobre el costo de envío"
                            unit="%"
                            name="courierService"
                            register={register}
                            error={errors.courierService?.message}
                        />
                    </div>

                    {/* Notes */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-foreground">
                            Notas del cambio <span className="text-muted-foreground font-normal">(opcional)</span>
                        </label>
                        <Textarea
                            placeholder="Ej: Ajuste por temporada alta, revisión Q2 2026..."
                            rows={2}
                            {...register('notes')}
                            className={cn(errors.notes && 'border-destructive focus-visible:ring-destructive')}
                        />
                        {errors.notes && <p className="text-xs text-destructive">{errors.notes.message}</p>}
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                        <Button type="button" variant="outline" size="sm" onClick={handleCancel} disabled={isSubmitting}>
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            size="sm"
                            disabled={isSubmitting}
                            className="gap-2"
                        >
                            {isSubmitting ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                                <Save className="h-3.5 w-3.5" />
                            )}
                            {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
                        </Button>
                    </div>
                </form>
            )}

            {/* History */}
            <div className="space-y-3">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <History className="h-4 w-4 text-muted-foreground" />
                    Historial de cambios
                    {history.length > 0 && (
                        <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                            {history.length}
                        </span>
                    )}
                </h3>

                {history.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic">Sin cambios registrados aún.</p>
                ) : (
                    <div className="overflow-x-auto rounded-lg border border-border">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border bg-muted/50">
                                    <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground whitespace-nowrap">Fecha</th>
                                    <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Modificado por</th>
                                    <th className="px-3 py-2 text-center text-xs font-semibold text-muted-foreground whitespace-nowrap">Tarifa App</th>
                                    <th className="px-3 py-2 text-center text-xs font-semibold text-muted-foreground whitespace-nowrap">Comis. Vendedor</th>
                                    <th className="px-3 py-2 text-center text-xs font-semibold text-muted-foreground whitespace-nowrap">Comis. Repartidor</th>
                                    <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Notas</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((entry, i) => (
                                    <HistoryRow key={entry.id} entry={entry} index={i} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
