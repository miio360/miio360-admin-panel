import { useEffect } from 'react';
import { X, CheckCircle2, XCircle, AlertTriangle, Info } from 'lucide-react';
import { useModalContext } from '@/shared/hooks/useModal';
import { ButtonGlobal } from './button-global';
import { cn } from '@/shared/lib/utils';

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

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !data) return null;

  const Icon = iconMap[data.type];
  const iconColor = colorMap[data.type];

  const handleConfirm = async () => {
    if (data.onConfirm) {
      await data.onConfirm();
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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={data.type !== 'confirm' ? closeModal : undefined}
      />

      <div className="relative bg-background rounded-lg shadow-2xl max-w-md w-full mx-4 border border-border animate-in fade-in-0 zoom-in-95 duration-200">
        <button
          onClick={closeModal}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
        >
          <X className="h-4 w-4 text-foreground" />
          <span className="sr-only">Cerrar</span>
        </button>

        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={cn('flex-shrink-0', iconColor)}>
              <Icon className="h-6 w-6" />
            </div>

            <div className="flex-1 space-y-2">
              {data.title && (
                <h2 className="text-lg font-semibold text-foreground">
                  {data.title}
                </h2>
              )}
              <p className="text-sm text-foreground/80 leading-relaxed">
                {data.message}
              </p>
            </div>
          </div>

          <div className="mt-6 flex gap-3 justify-end">
            {data.type === 'confirm' ? (
              <>
                <ButtonGlobal
                  variant="outline"
                  onClick={handleCancel}
                  className="min-w-[100px]"
                >
                  {data.cancelText || 'Cancelar'}
                </ButtonGlobal>
                <ButtonGlobal
                  onClick={handleConfirm}
                  className="min-w-[100px]"
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
          </div>
        </div>
      </div>
    </div>
  );
}
