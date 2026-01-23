import { ReactNode } from 'react';

interface LoadingGlobalProps {
  message?: string;
  className?: string;
  variant?: 'fullscreen' | 'overlay';
  loading?: boolean;
  children?: ReactNode;
}

export function LoadingGlobal({ 
  message = "Cargando...", 
  className = "",
  variant = 'fullscreen',
  loading = true,
  children
}: LoadingGlobalProps) {
  if (variant === 'overlay') {
    return (
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-20 flex items-center justify-center rounded-xl">
            <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-lg shadow-lg">
              <div className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
              <p className="text-sm text-foreground/80 font-medium">{message}</p>
            </div>
          </div>
        )}
        {children}
      </div>
    );
  }

  return (
    <div className={`p-6 bg-background min-h-screen ${className}`}>
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
          <p className="text-sm text-foreground/60 font-medium">{message}</p>
        </div>
      </div>
    </div>
  );
}
