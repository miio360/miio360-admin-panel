import { ReactNode } from "react";
import { ButtonGlobal } from "./button-global";
import { Save } from "lucide-react";

interface FormActionsGlobalProps {
  onCancel: () => void;
  isSubmitting: boolean;
  isEditing: boolean;
  submitText?: {
    creating: string;
    editing: string;
  };
  cancelText?: string;
  icon?: ReactNode;
}

export function FormActionsGlobal({
  onCancel,
  isSubmitting,
  isEditing,
  submitText = {
    creating: "Crear",
    editing: "Guardar cambios",
  },
  cancelText = "Cancelar",
  icon = <Save className="w-4 h-4" />,
}: FormActionsGlobalProps) {
  return (
    <div className="flex gap-3 pt-2">
      <ButtonGlobal
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isSubmitting}
        className="flex-1 h-12 border-2 border-border hover:bg-muted text-foreground font-semibold"
      >
        {cancelText}
      </ButtonGlobal>
      <ButtonGlobal
        type="submit"
        disabled={isSubmitting}
        icon={icon}
        iconPosition="left"
        className="flex-1 h-12 bg-primary hover:bg-primary/90 text-foreground font-bold shadow-md hover:shadow-lg transition-all"
      >
        {isSubmitting
          ? "Guardando..."
          : isEditing
          ? submitText.editing
          : submitText.creating}
      </ButtonGlobal>
    </div>
  );
}
