import * as React from "react";
import { Button, buttonVariants } from "./ui/button";
import { Loader2 } from "lucide-react";

export interface ButtonGlobalProps extends React.ComponentProps<typeof Button> {
  icon?: React.ReactNode;
  iconPosition?: "left" | "right" | "icon-only";
  loading?: boolean;
}

const ButtonGlobal = React.forwardRef<HTMLButtonElement, ButtonGlobalProps>(
  ({ icon, iconPosition = "left", loading = false, disabled, children, ...props }, ref) => {
    if (iconPosition === "icon-only" || loading) {
      return (
        <Button ref={ref} disabled={disabled || loading} {...props}>
          {loading ? (
            <span className="flex items-center">
              <Loader2 className="h-4 w-4 animate-spin" />
            </span>
          ) : (
            icon && <span className="flex items-center">{icon}</span>
          )}
          {loading && children}
        </Button>
      );
    }

    return (
      <Button ref={ref} disabled={disabled || loading} {...props}>
        {icon && iconPosition === "left" && <span className="flex items-center">{icon}</span>}
        {children}
        {icon && iconPosition === "right" && <span className="flex items-center">{icon}</span>}
      </Button>
    );
  }
);
ButtonGlobal.displayName = "ButtonGlobal";

export { ButtonGlobal, buttonVariants };
