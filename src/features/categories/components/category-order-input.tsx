import { useState } from 'react';
import { InputGlobal } from '@/shared/components/input-global';
import { ButtonGlobal } from '@/shared/components/button-global';
import { Check, X, Edit2 } from 'lucide-react';

interface CategoryOrderInputProps {
  currentOrder: number;
  categoryId: string;
  onOrderChange: (categoryId: string, newOrder: number) => Promise<void>;
}

export function CategoryOrderInput({
  currentOrder,
  categoryId,
  onOrderChange,
}: CategoryOrderInputProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempOrder, setTempOrder] = useState(currentOrder.toString());
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    const newOrder = parseInt(tempOrder, 10);
    if (isNaN(newOrder) || newOrder < 0) {
      setTempOrder(currentOrder.toString());
      setIsEditing(false);
      return;
    }

    if (newOrder === currentOrder) {
      setIsEditing(false);
      return;
    }

    try {
      setIsSaving(true);
      await onOrderChange(categoryId, newOrder);
      setIsEditing(false);
    } catch (error) {
      console.error('Error changing order:', error);
      setTempOrder(currentOrder.toString());
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setTempOrder(currentOrder.toString());
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (!isEditing) {
    return (
      <div className="flex items-center gap-2">
        <span className="font-medium text-foreground text-sm min-w-[24px] text-center">
          {currentOrder}
        </span>
        <ButtonGlobal
          variant="ghost"
          size="icon"
          onClick={() => setIsEditing(true)}
          className="h-7 w-7 hover:bg-primary/10"
          title="Cambiar orden"
        >
          <Edit2 className="w-3 h-3" />
        </ButtonGlobal>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <InputGlobal
        type="number"
        min="0"
        value={tempOrder}
        onChange={(e) => setTempOrder(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-16 h-7 text-sm text-center"
        disabled={isSaving}
        autoFocus
      />
      <ButtonGlobal
        variant="ghost"
        size="icon"
        onClick={handleSave}
        disabled={isSaving}
        className="h-7 w-7 hover:bg-green-100"
        title="Guardar"
      >
        <Check className="w-3 h-3 text-green-600" />
      </ButtonGlobal>
      <ButtonGlobal
        variant="ghost"
        size="icon"
        onClick={handleCancel}
        disabled={isSaving}
        className="h-7 w-7 hover:bg-red-100"
        title="Cancelar"
      >
        <X className="w-3 h-3 text-red-600" />
      </ButtonGlobal>
    </div>
  );
}
