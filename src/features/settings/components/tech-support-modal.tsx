import { useEffect } from 'react';
import { MessageCircle, Phone, User, ToggleLeft } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/shared/components/ui/dialog';
import { ButtonGlobal } from '@/shared/components/button-global';
import { InputGlobal } from '@/shared/components/input-global';
import { Switch } from '@/shared/components/ui/switch';
import { Label } from '@/shared/components/ui/label';
import { useTechSupportForm } from '../hooks/useTechSupportForm';
import { WHATSAPP_COUNTRY_CODE } from '../types/settings-feature';
import type { AppSettings } from '@/shared/types/settings';

interface TechSupportModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    settings: AppSettings | null;
    onSuccess: () => void;
}

export function TechSupportModal({
    open,
    onOpenChange,
    settings,
    onSuccess,
}: TechSupportModalProps) {
    const { form, onSubmit, isSubmitting } = useTechSupportForm({
        settings,
        onSuccess: () => {
            onOpenChange(false);
            onSuccess();
        },
    });

    const { register, formState: { errors }, watch, setValue, reset } = form;

    // Reset form when settings load or modal reopens
    useEffect(() => {
        if (open) {
            reset({
                displayName: settings?.techSupport?.whatsapp?.displayName ?? 'Soporte MIIO',
                phoneNumber: settings?.techSupport?.whatsapp?.phoneNumber ?? '',
                isActive: settings?.techSupport?.whatsapp?.isActive ?? true,
            });
        }
    }, [open, settings, reset]);

    const isActive = watch('isActive');

    const phoneNumber = watch('phoneNumber');
    const whatsappPreview = phoneNumber
        ? `https://wa.me/${WHATSAPP_COUNTRY_CODE}${phoneNumber}`
        : null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md w-full">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                            <MessageCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <DialogTitle className="text-base font-semibold leading-tight">
                                Soporte Tecnico
                            </DialogTitle>
                            <DialogDescription className="text-xs mt-0.5">
                                Configura el numero de WhatsApp que los usuarios veran en la app MIIO.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-4 pt-2">
                    {/* Display Name */}
                    <div className="space-y-1.5">
                        <Label className="flex items-center gap-1.5 text-xs font-medium text-foreground/80">
                            <User className="w-3.5 h-3.5" />
                            Nombre de contacto
                        </Label>
                        <InputGlobal
                            {...register('displayName')}
                            placeholder="Soporte MIIO"
                            error={!!errors.displayName}
                        />
                        {errors.displayName && (
                            <p className="text-xs text-destructive">{errors.displayName.message}</p>
                        )}
                    </div>

                    {/* Phone number with fixed +591 prefix */}
                    <div className="space-y-1.5">
                        <Label className="flex items-center gap-1.5 text-xs font-medium text-foreground/80">
                            <Phone className="w-3.5 h-3.5" />
                            Numero de WhatsApp
                        </Label>
                        <div className="flex gap-2">
                            <div className="flex items-center px-3 rounded-lg border border-border bg-muted/50 text-sm font-medium text-muted-foreground select-none">
                                +{WHATSAPP_COUNTRY_CODE}
                            </div>
                            <InputGlobal
                                {...register('phoneNumber')}
                                placeholder="71234567"
                                type="tel"
                                inputMode="numeric"
                                error={!!errors.phoneNumber}
                                aria-label="Numero de celular"
                                className="flex-1"
                            />
                        </div>
                        {errors.phoneNumber && (
                            <p className="text-xs text-destructive">{errors.phoneNumber.message}</p>
                        )}
                        {whatsappPreview && (
                            <p className="text-[11px] text-muted-foreground break-all">
                                {whatsappPreview}
                            </p>
                        )}
                    </div>

                    {/* Active toggle */}
                    <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-4 py-3">
                        <div className="flex items-center gap-2">
                            <ToggleLeft className="w-4 h-4 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium text-foreground">Soporte activo</p>
                                <p className="text-xs text-muted-foreground">
                                    Visible para los usuarios en la app
                                </p>
                            </div>
                        </div>
                        <Switch
                            checked={isActive}
                            onCheckedChange={(v) => setValue('isActive', v)}
                            aria-label="Activar soporte"
                        />
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
