import { ChevronRight, type LucideIcon } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface SettingsListItemProps {
    icon: LucideIcon;
    label: string;
    description: string;
    onClick: () => void;
    badge?: string;
    badgeVariant?: 'success' | 'warning' | 'default';
}

const badgeClasses = {
    success: 'bg-green-100 text-green-700 border-green-200',
    warning: 'bg-amber-100 text-amber-700 border-amber-200',
    default: 'bg-muted text-muted-foreground border-border',
};

export function SettingsListItem({
    icon: Icon,
    label,
    description,
    onClick,
    badge,
    badgeVariant = 'default',
}: SettingsListItemProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                'w-full flex items-center gap-4 px-4 py-4 rounded-xl',
                'bg-card border border-border hover:border-primary/40',
                'hover:bg-primary/5 transition-all duration-150 group text-left',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
            )}
        >
            {/* Icon container */}
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon className="w-5 h-5 text-primary" />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">{label}</span>
                    {badge && (
                        <span
                            className={cn(
                                'text-[10px] font-bold px-2 py-0.5 rounded-full border',
                                badgeClasses[badgeVariant]
                            )}
                        >
                            {badge}
                        </span>
                    )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">{description}</p>
            </div>

            {/* Chevron */}
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
        </button>
    );
}
