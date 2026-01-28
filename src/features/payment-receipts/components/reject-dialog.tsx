import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { ButtonGlobal } from '@/shared/components/button-global';
import { SelectGlobal } from '@/shared/components/select-global';
import type { RejectionReason } from '@/shared/types/payment';
import { REJECTION_REASON_LABELS } from '@/shared/types/payment';

interface RejectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: RejectionReason, comment?: string) => void;
  isLoading?: boolean;
}

export function RejectDialog({ open, onOpenChange, onConfirm, isLoading }: RejectDialogProps) {
  const [reason, setReason] = useState<RejectionReason>('illegible');
  const [comment, setComment] = useState('');

  const handleConfirm = () => {
    onConfirm(reason, reason === 'other' ? comment : undefined);
    setReason('illegible');
    setComment('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rechazar Comprobante</DialogTitle>
          <DialogDescription>
            Selecciona el motivo del rechazo para que el vendedor pueda corregirlo.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Motivo del rechazo
            </label>
            <SelectGlobal
              value={reason}
              onChange={(e) => setReason(e.target.value as RejectionReason)}
            >
              {Object.entries(REJECTION_REASON_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </SelectGlobal>
          </div>

          {reason === 'other' && (
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">
                Comentario adicional
              </label>
              <textarea
                className="w-full border border-gray-400/40 focus-visible:border-gray-400 focus-visible:ring-0 bg-gray-500/5 focus:bg-background transition-all rounded-md px-3 py-2 text-base text-foreground"
                value={comment}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)}
                placeholder="Especifica el motivo del rechazo"
                rows={3}
                required
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <ButtonGlobal
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancelar
          </ButtonGlobal>
          <ButtonGlobal
            variant="destructive"
            onClick={handleConfirm}
            disabled={(reason === 'other' && !comment.trim()) || isLoading}
          >
            {isLoading ? 'Rechazando...' : 'Rechazar'}
          </ButtonGlobal>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
