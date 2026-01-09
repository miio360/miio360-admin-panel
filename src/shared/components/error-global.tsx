import { AlertCircle, RefreshCw } from "lucide-react";
import { ButtonGlobal } from "./button-global";
import { Card, CardContent } from "../components/ui/card";

interface ErrorGlobalProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorGlobal({
  title = "Error al cargar los datos",
  message,
  onRetry,
}: ErrorGlobalProps) {
  return (
    <div className="p-6 bg-background min-h-screen">
      <Card className="max-w-2xl mx-auto mt-20">
        <CardContent>
          <div className="flex flex-col items-center text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
            <p className="text-sm text-foreground/60 mb-6 max-w-md">{message}</p>
            {onRetry && (
              <ButtonGlobal
                onClick={onRetry}
                variant="outline"
                icon={<RefreshCw className="w-4 h-4" />}
                iconPosition="left"
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                Reintentar
              </ButtonGlobal>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
