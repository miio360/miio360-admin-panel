
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { CheckCircle2, XCircle, AlertTriangle, Info } from 'lucide-react';

import { useModalContext } from '@/shared/hooks/useModal';
import { ButtonGlobal } from './button-global';
import { cn } from '@/shared/lib/utils';
import { useState } from 'react';

const iconMap = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
  confirm: AlertTriangle,
};

const colorMap = {
  success: 'text-green-500',
  error: 'text-red-500',
  warning: 'text-amber-500',
  info: 'text-blue-500',
  confirm: 'text-amber-500',
};

export function ModalGlobal() {
  const { isOpen, data, closeModal } = useModalContext();
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen || !data) return null;

  const Icon = iconMap[data.type];
  const iconColor = colorMap[data.type];

  const handleConfirm = async () => {
    if (data.onConfirm) {
      setIsLoading(true);
      try {
        await data.onConfirm();
      } finally {
        setIsLoading(false);
      }
    }
    closeModal();
  };

  const handleCancel = () => {
    if (data.onCancel) {
      data.onCancel();
    }
    closeModal();
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <div className={cn('flex-shrink-0', iconColor)}>
              <Icon className="h-6 w-6" />
            </div>
            <div className="flex-1 space-y-2">
              {data.title && (
                <DialogTitle className="text-lg font-semibold text-foreground">
                  {data.title}
                </DialogTitle>
              )}
              <DialogDescription asChild>
                <p className="text-foreground/80 leading-relaxed">
                  {data.message}
                </p>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <DialogFooter className="mt-6 flex gap-3 justify-end">
          {data.type === 'confirm' ? (
            <>
              <ButtonGlobal
                variant="outline"
                onClick={handleCancel}
                className="min-w-[100px]"
                disabled={isLoading}
              >
                {data.cancelText || 'Cancelar'}
              </ButtonGlobal>
              <ButtonGlobal
                onClick={handleConfirm}
                className="min-w-[100px]"
                loading={isLoading}
                disabled={isLoading}
              >
                {data.confirmText || 'Confirmar'}
              </ButtonGlobal>
            </>
          ) : (
            <ButtonGlobal
              onClick={closeModal}
              className="min-w-[100px]"
            >
              Aceptar
            </ButtonGlobal>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
