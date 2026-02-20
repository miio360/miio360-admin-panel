import { useState, useEffect } from 'react';
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
import { Upload } from 'lucide-react';
import type { PlanType } from '@/features/plans/types/plan';
import { PLAN_TYPE_LABELS } from '@/features/plans/types/plan';
import type { PaymentSettings } from '@/shared/types/payment';

interface QRDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (planType: PlanType, file: File) => void;
  isLoading?: boolean;
  editingSetting?: PaymentSettings | null;
}

export function QRDialog({
  open,
  onOpenChange,
  onConfirm,
  isLoading,
  editingSetting,
}: QRDialogProps) {
  const [planType, setPlanType] = useState<PlanType>(editingSetting?.planType || 'video');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setPlanType(editingSetting?.planType || 'video');
      setFile(null);
      setPreviewUrl(null);
    }
  }, [open, editingSetting]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleConfirm = () => {
    if (file) {
      onConfirm(planType, file);
      setFile(null);
      setPreviewUrl(null);
    }
  };

  const handleClose = () => {
    setFile(null);
    setPreviewUrl(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {editingSetting ? 'Actualizar QR de Pago' : 'Crear QR de Pago'}
          </DialogTitle>
          <DialogDescription>
            {editingSetting
              ? 'Sube una nueva imagen para reemplazar el QR actual'
              : 'Selecciona el tipo de plan y sube la imagen del QR'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {!editingSetting && (
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Tipo de Plan
              </label>
              <SelectGlobal
                value={planType}
                onChange={(e) => setPlanType(e.target.value as PlanType)}
              >
                {Object.entries(PLAN_TYPE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </SelectGlobal>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Imagen del QR
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="qr-file-input"
            />
            <label htmlFor="qr-file-input" className="inline-block w-full">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors">
                {previewUrl || editingSetting?.qrImage.url ? (
                  <img
                    src={previewUrl || editingSetting?.qrImage.url}
                    alt="Preview"
                    className="w-48 h-48 object-contain mx-auto mb-3"
                  />
                ) : (
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                )}
                <p className="text-sm text-gray-600">
                  {file ? file.name : 'Click para seleccionar imagen'}
                </p>
              </div>
            </label>
          </div>
        </div>

        <DialogFooter>
          <ButtonGlobal variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancelar
          </ButtonGlobal>
          <ButtonGlobal onClick={handleConfirm} disabled={!file || isLoading}>
            {isLoading ? 'Guardando...' : editingSetting ? 'Actualizar' : 'Crear'}
          </ButtonGlobal>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
