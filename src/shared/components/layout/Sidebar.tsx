import { Link, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils";
import { ButtonGlobal } from "../button-global";
import { ScrollArea } from "../ui/scroll-area";
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  HelpCircle,
  FolderTree,
} from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  section?: string;
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    section: "GENERAL",
  },
  {
    title: "Categorías",
    href: "/categories",
    icon: FolderTree,
    section: "GENERAL",
  },
  {
    title: "Gestionar Usuarios",
    href: "/users",
    icon: Users,
    section: "GENERAL",
  },
  {
    title: "Configuración",
    href: "/settings",
    icon: Settings,
    section: "CUENTA",
  },
  {
    title: "Ayuda",
    href: "/help",
    icon: HelpCircle,
    section: "CUENTA",
  },
];

export const Sidebar = () => {
  const location = useLocation();

  const generalItems = navItems.filter((item) => item.section === "GENERAL");
  const accountItems = navItems.filter((item) => item.section === "CUENTA");

  const renderNavItem = (item: NavItem) => {
    const isActive =
      location.pathname === item.href ||
      (item.href !== "/" && location.pathname.startsWith(item.href));
    const Icon = item.icon;

    return (
      <Link key={item.href} to={item.href}>
        <div
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all text-white text-sm",
            isActive
              ? "bg-primary/90 text-foreground font-semibold shadow-sm"
              : "hover:bg-white/5"
          )}
        >
          <Icon className="h-4 w-4 flex-shrink-0" />
          <span className="font-medium flex-1">{item.title}</span>
          {item.badge && (
            <span className="bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
              {item.badge}
            </span>
          )}
        </div>
      </Link>
    );
  };

  return (
    <div className="hidden lg:flex flex-col sticky top-0 h-screen w-60 border-r border-gray-100 bg-gradient-to-b from-slate-900 to-slate-800 z-20 shrink-0">
      <div className="flex items-center gap-3 h-14 px-5 border-b border-white/10">
        <div className="flex items-center justify-center w-10 h-14">
          <img
          src="/miio.jpeg"
          alt="Miio Logo"
          className="w-8 h-8 rounded-md object-cover"
          />
        </div>
        <span className="text-lg font-bold text-white tracking-tight">Miio</span>
        <ButtonGlobal
          variant="ghost"
          size="iconSm"
          className="ml-auto text-white/70 hover:text-white hover:bg-white/10"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 5h14M3 10h14M3 15h14"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </ButtonGlobal>
      </div>

      <ScrollArea className="flex-1 py-4">
        <div className="px-3 mb-6">
          <p className="text-[10px] font-bold text-white/50 mb-2 px-3 tracking-wider">MAIN</p>
          <nav className="space-y-0.5">{generalItems.map(renderNavItem)}</nav>
        </div>

        <div className="px-3">
          <p className="text-[10px] font-bold text-white/50 mb-2 px-3 tracking-wider">USERS</p>
          <nav className="space-y-0.5">{accountItems.map(renderNavItem)}</nav>
        </div>
      </ScrollArea>

      <div className="p-3 border-t border-white/10">
        <ButtonGlobal
          variant="ghost"
          className="w-full justify-start gap-3 text-white/80 hover:text-white hover:bg-white/10 h-9"
        >
          <LogOut className="h-4 w-4" />
          <span className="text-sm font-medium">Cerrar Sesión</span>
        </ButtonGlobal>
      </div>
    </div>
  );
};
