interface LoadingGlobalProps {
  message?: string;
  className?: string;
}

export function LoadingGlobal({ 
  message = "Cargando...", 
  className = "" 
}: LoadingGlobalProps) {
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
