import { Link, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import {
  LayoutDashboard,
  Package,
  Store,
  Users,
  Settings,
  LogOut,
  HelpCircle,
  CreditCard,
  Link as LinkIcon,
  MessageSquare,
  UserCircle2,
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
    title: "Productos",
    href: "/products",
    icon: Package,
    section: "GENERAL",
  },
  {
    title: "Inventario",
    href: "/inventory",
    icon: Store,
    section: "GENERAL",
  },
  {
    title: "Clientes",
    href: "/customers",
    icon: Users,
    section: "GENERAL",
  },
  {
    title: "Reseñas",
    href: "/review",
    icon: MessageSquare,
    badge: "02",
    section: "GENERAL",
  },
  {
    title: "Pagos",
    href: "/payment",
    icon: CreditCard,
    section: "GENERAL",
  },
  {
    title: "Integraciones",
    href: "/integration",
    icon: LinkIcon,
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
  {
    title: "Gestionar Usuarios",
    href: "/manage-users",
    icon: UserCircle2,
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
            "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all",
            isActive
              ? "bg-gray-800 text-white"
              : "text-gray-400 hover:text-white hover:bg-gray-800/50"
          )}
        >
          <Icon className="h-5 w-5 flex-shrink-0" />
          <span className="text-sm font-medium flex-1">{item.title}</span>
          {item.badge && (
            <span className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded">
              {item.badge}
            </span>
          )}
        </div>
      </Link>
    );
  };

  return (
    <div className="flex flex-col h-screen w-64 bg-[#1a1d23] text-white border-r border-gray-800">
      {/* Logo Section */}
      <div className="flex items-center gap-3 h-16 px-4 border-b border-gray-800">
        <img 
          src="/miio.jpeg" 
          alt="Miio Logo" 
          className="w-8 h-8 rounded object-cover"
        />
        <span className="text-lg font-bold">miio</span>
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto text-gray-400 hover:text-white hover:bg-gray-800"
        >
          <svg
            width="20"
            height="20"
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
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-6">
        {/* GENERAL Section */}
        <div className="px-4 mb-6">
          <p className="text-xs font-semibold text-gray-500 mb-3">GENERAL</p>
          <nav className="space-y-1">{generalItems.map(renderNavItem)}</nav>
        </div>

        {/* CUENTA Section */}
        <div className="px-4">
          <p className="text-xs font-semibold text-gray-500 mb-3">CUENTA</p>
          <nav className="space-y-1">{accountItems.map(renderNavItem)}</nav>
        </div>
      </ScrollArea>

      {/* Cerrar Sesión Section */}
      <div className="p-4 border-t border-gray-800">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-gray-400 hover:text-white hover:bg-gray-800"
        >
          <LogOut className="h-5 w-5" />
          <span className="text-sm font-medium">Cerrar Sesión</span>
        </Button>
      </div>
    </div>
  );
};
