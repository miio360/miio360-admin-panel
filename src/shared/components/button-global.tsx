import * as React from "react";
import { Button, buttonVariants } from "./ui/button";

export interface ButtonGlobalProps extends React.ComponentProps<typeof Button> {
  icon?: React.ReactNode;
  iconPosition?: "left" | "right" | "icon-only";
}

const ButtonGlobal = React.forwardRef<HTMLButtonElement, ButtonGlobalProps>(
  ({ icon, iconPosition = "left", children, ...props }, ref) => {
    if (iconPosition === "icon-only") {
      return (
        <Button ref={ref} {...props}>
          {icon && <span className="flex items-center">{icon}</span>}
        </Button>
      );
    }

    return (
      <Button ref={ref} {...props}>
        {icon && iconPosition === "left" && <span className="flex items-center">{icon}</span>}
        {children}
        {icon && iconPosition === "right" && <span className="flex items-center">{icon}</span>}
      </Button>
    );
  }
);
ButtonGlobal.displayName = "ButtonGlobal";

export { ButtonGlobal, buttonVariants };
