import { ReactNode } from "react";
import { Plus } from "lucide-react";
import { ButtonGlobal } from "./button-global";

interface EmptyStateGlobalProps {
  icon?: ReactNode;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  actionIcon?: ReactNode;
  className?: string;
}

export function EmptyStateGlobal({
  icon = <Plus className="w-5 h-5 text-gray-400" />,
  message,
  actionLabel,
  onAction,
  actionIcon = <Plus className="h-3 w-3" />,
  className = "",
}: EmptyStateGlobalProps) {
  return (
    <div className={`text-center py-8 ${className}`}>
      <div className="flex flex-col items-center gap-2">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100">
          {icon}
        </div>
        <p className="text-sm text-gray-500">{message}</p>
        {actionLabel && onAction && (
          <ButtonGlobal
            size="sm"
            onClick={onAction}
            icon={actionIcon}
            iconPosition="left"
            className="bg-gray-900 hover:bg-gray-800 text-white text-xs mt-1"
          >
            {actionLabel}
          </ButtonGlobal>
        )}
      </div>
    </div>
  );
}
