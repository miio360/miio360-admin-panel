import { Bell, Moon, Settings as SettingsIcon, Maximize2 } from "lucide-react";
import { ButtonGlobal } from "../button-global";
import { SearchGlobal } from "../search-global";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useAuth } from "../../hooks/useAuth";

export const Header = () => {
  const { user } = useAuth();

  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-10 shadow-sm">
      <div className="flex items-center gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <ButtonGlobal variant="ghost" className="gap-2 pl-2 pr-3 hover:bg-gray-50 h-9 ml-2">
              <Avatar className="w-7 h-7">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs font-semibold">
                  {user?.profile?.email?.charAt(0).toUpperCase() || "M"}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs font-medium text-gray-700">ENG</span>
            </ButtonGlobal>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Perfil</DropdownMenuItem>
            <DropdownMenuItem>Configuración</DropdownMenuItem>
            <DropdownMenuItem>Ayuda</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              Cerrar Sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
