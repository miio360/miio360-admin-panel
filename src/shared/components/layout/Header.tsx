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
      <div className="flex-1 max-w-md hidden md:block">
        <SearchGlobal
          value=""
          onChange={() => {}}
          placeholder="Buscar transacción..."
          className="h-10 text-sm"
        />
      </div>

      <div className="flex items-center gap-1">
        <ButtonGlobal variant="ghost" size="iconSm" className="text-gray-500 hover:text-gray-900 hover:bg-gray-50 hidden sm:flex">
          <Maximize2 className="w-4 h-4" />
        </ButtonGlobal>

        <ButtonGlobal variant="ghost" size="iconSm" className="text-gray-500 hover:text-gray-900 hover:bg-gray-50 hidden md:flex">
          <svg
            width="18"
            height="18"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 4h5v5H4V4zm0 7h5v5H4v-5zm7-7h5v5h-5V4zm0 7h5v5h-5v-5z"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
            />
          </svg>
        </ButtonGlobal>

        <ButtonGlobal variant="ghost" size="iconSm" className="text-gray-500 hover:text-gray-900 hover:bg-gray-50 hidden sm:flex">
          <Moon className="w-4 h-4" />
        </ButtonGlobal>

        <ButtonGlobal variant="ghost" size="iconSm" className="text-gray-500 hover:text-gray-900 hover:bg-gray-50 hidden sm:flex">
          <SettingsIcon className="w-4 h-4" />
        </ButtonGlobal>

        <ButtonGlobal variant="ghost" size="iconSm" className="relative text-gray-500 hover:text-gray-900 hover:bg-gray-50">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </ButtonGlobal>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <ButtonGlobal variant="ghost" className="gap-2 pl-2 pr-3 hover:bg-gray-50 h-9 ml-2">
              <Avatar className="w-7 h-7">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs font-semibold">
                  {user?.email?.charAt(0).toUpperCase() || "M"}
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
