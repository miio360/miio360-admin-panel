import { useEffect } from 'react';
import { ShoppingBag, CalendarClock, ToggleLeft, AlertCircle } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/shared/components/ui/dialog';
import { ButtonGlobal } from '@/shared/components/button-global';
import { Switch } from '@/shared/components/ui/switch';
import { Label } from '@/shared/components/ui/label';
import { cn } from '@/shared/lib/utils';
import { useSalesSettingsForm } from '../hooks/useSalesSettingsForm';
import type { SalesSettings } from '@/shared/types/settings';

interface SalesSettingsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    salesSettings: SalesSettings | null;
    onSuccess: () => void;
}

export function SalesSettingsModal({
    open,
    onOpenChange,
    salesSettings,
    onSuccess,
}: SalesSettingsModalProps) {
    const { form, onSubmit, isSubmitting } = useSalesSettingsForm({
        salesSettings,
        onSuccess: () => {
            onOpenChange(false);
            onSuccess();
        },
    });

    const { formState: { errors }, watch, setValue, reset } = form;

    useEffect(() => {
        if (open) {
            const ts = salesSettings?.date_to_enable_sales;
            let dateStr = '';
            if (ts) {
                const d = ts.toDate();
                const pad = (n: number) => String(n).padStart(2, '0');
                dateStr = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
            }
            reset({
                sales_enabled: salesSettings?.sales_enabled ?? false,
                date_to_enable_sales: dateStr,
            });
        }
    }, [open, salesSettings, reset]);

    const salesEnabled = watch('sales_enabled');

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md w-full">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                            <ShoppingBag className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <DialogTitle className="text-base font-semibold leading-tight">
                                Opciones de Venta
                            </DialogTitle>
                            <DialogDescription className="text-xs mt-0.5">
                                Controla si las ventas están habilitadas en la plataforma MIIO.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-4 pt-2">
                    {/* Sales enabled toggle */}
                    <div
                        className={cn(
                            'flex items-center justify-between rounded-lg border px-4 py-3 transition-colors',
                            salesEnabled
                                ? 'border-green-300 bg-green-50'
                                : 'border-border bg-muted/30'
                        )}
                    >
                        <div className="flex items-center gap-2">
                            <ToggleLeft className="w-4 h-4 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium text-foreground">
                                    Ventas habilitadas
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {salesEnabled
                                        ? 'Las ventas están activas en la app'
                                        : 'Las ventas están desactivadas'}
                                </p>
                            </div>
                        </div>
                        <Switch
                            checked={salesEnabled}
                            onCheckedChange={(v) => setValue('sales_enabled', v)}
                            aria-label="Habilitar ventas"
                        />
                    </div>

                    {/* Date to enable sales — only when sales are disabled */}
                    <div
                        className={cn(
                            'space-y-1.5 rounded-lg border px-4 py-3 transition-all',
                            salesEnabled
                                ? 'border-border bg-muted/20 opacity-50'
                                : 'border-border bg-card'
                        )}
                    >
                        <Label
                            className={cn(
                                'flex items-center gap-1.5 text-xs font-medium',
                                salesEnabled ? 'text-muted-foreground' : 'text-foreground/80'
                            )}
                        >
                            <CalendarClock className="w-3.5 h-3.5" />
                            Fecha programada de habilitación
                        </Label>

                        {salesEnabled ? (
                            <div className="flex items-start gap-2 py-1">
                                <AlertCircle className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
                                <p className="text-xs text-muted-foreground">
                                    Las ventas ya están habilitadas. Desactívalas para programar una fecha.
                                </p>
                            </div>
                        ) : (
                            <>
                                <input
                                    {...form.register('date_to_enable_sales')}
                                    type="datetime-local"
                                    disabled={salesEnabled}
                                    className={cn(
                                        'w-full rounded-md border border-border bg-background px-3 py-2 text-sm',
                                        'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary',
                                        'disabled:cursor-not-allowed disabled:opacity-50',
                                        errors.date_to_enable_sales && 'border-destructive'
                                    )}
                                />
                                {errors.date_to_enable_sales && (
                                    <p className="text-xs text-destructive">
                                        {errors.date_to_enable_sales.message}
                                    </p>
                                )}
                                <p className="text-[11px] text-muted-foreground">
                                    Opcional — fecha en la que se habilitarán las ventas automáticamente.
                                </p>
                            </>
                        )}
                    </div>

                    <DialogFooter className="pt-2">
                        <ButtonGlobal
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </ButtonGlobal>
                        <ButtonGlobal type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Guardando...' : 'Guardar'}
                        </ButtonGlobal>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
