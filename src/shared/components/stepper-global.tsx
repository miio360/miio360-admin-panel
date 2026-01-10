import { cn } from "@/shared/lib/utils";

interface StepperGlobalProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

export function StepperGlobal({ steps, currentStep, className }: StepperGlobalProps) {
  return (
    <div className={cn("w-full py-6", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          const isLast = index === steps.length - 1;

          return (
            <div key={step} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-200",
                    isCompleted && "bg-primary text-foreground",
                    isActive && "bg-primary text-foreground ring-4 ring-primary/20",
                    !isActive && !isCompleted && "bg-gray-200 text-gray-600"
                  )}
                >
                  {isCompleted ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={cn(
                    "text-xs font-medium mt-2 text-center",
                    (isActive || isCompleted) && "text-foreground",
                    !isActive && !isCompleted && "text-gray-500"
                  )}
                >
                  {step}
                </span>
              </div>
              {!isLast && (
                <div
                  className={cn(
                    "h-0.5 flex-1 mx-2 transition-all duration-200",
                    isCompleted ? "bg-primary" : "bg-gray-200"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
