import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { cn } from "../../lib/utils";
import { useAuth } from "@/shared/hooks/useAuth";
import { ButtonGlobal } from "../button-global";
import { ScrollArea } from "../ui/scroll-area";
import {
  LayoutDashboard,
  Users,
  FolderTree,
  CreditCard,
  Video,
  Megaphone,
  Radio,
  ChevronDown,
  ChevronRight,
  Receipt,
  QrCode,
  ShoppingBag,
  Settings,
} from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

interface SubNavItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

interface NavGroup {
  title: string;
  icon: React.ElementType;
  children: SubNavItem[];
}

const navItems: NavItem[] = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "Categorias", href: "/categories", icon: FolderTree },
  { title: "Gestionar Usuarios", href: "/users", icon: Users },
  { title: "Comprobantes de Pago", href: "/payment-receipts", icon: Receipt },
  { title: "QR de Pago", href: "/payment-qr", icon: QrCode },
  { title: "Pedidos", href: "/orders", icon: ShoppingBag },
];

const configNavItems: NavItem[] = [
  { title: "Configuracion", href: "/settings", icon: Settings },
];

const navGroups: NavGroup[] = [
  {
    title: "Planes",
    icon: CreditCard,
    children: [
      { title: "Plan Video", href: "/plans/video", icon: Video },
      { title: "Plan Publicidad", href: "/plans/advertising", icon: Megaphone },
      { title: "Plan Lives", href: "/plans/lives", icon: Radio },
    ],
  },
];

export const MobileHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['Planes']);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const toggleGroup = (title: string) => {
    setExpandedGroups((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  return (
    <>
      <header className="lg:hidden flex items-center justify-between h-14 px-4 border-b border-white/10 bg-gradient-to-b from-slate-900 to-slate-800 z-30 relative">
        <div className="flex items-center gap-2">
          <img src="/miio.jpeg" alt="Miio Logo" className="w-8 h-8 rounded-md object-cover" onClick={() => navigate(`/`)} />
          <span className="text-lg font-bold text-white tracking-tight">M!!o Market</span>
        </div>
        <ButtonGlobal
          aria-label="Abrir menú"
          variant="ghost"
          size="icon"
          className="text-primary hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary"
          onClick={() => setMenuOpen(true)}
        >
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path d="M4 6h16M4 12h16M4 18h16" stroke="#FECD1B" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </ButtonGlobal>
      </header>
      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 animate-fade-in"
            onClick={() => setMenuOpen(false)}
            aria-label="Cerrar menú"
          />
          <aside className="fixed top-0 right-0 h-full w-64 max-w-full z-50 bg-gradient-to-b from-slate-900 to-slate-800 shadow-xl border-l border-white/10 flex flex-col animate-slide-in-right">
            <div className="flex items-center h-14 px-4 border-b border-white/10">
              <span className="text-lg font-bold text-white tracking-tight">Menú</span>
              <ButtonGlobal
                aria-label="Cerrar menú"
                variant="ghost"
                size="icon"
                className="ml-auto text-white/70 hover:text-white"
                onClick={() => setMenuOpen(false)}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M6 6l8 8M6 14L14 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </ButtonGlobal>
            </div>
            <ScrollArea className="flex-1 py-4">
              <nav className="flex flex-col gap-1 px-3">
                {navItems.map((item) => {
                  const isActive =
                    location.pathname === item.href ||
                    (item.href !== "/" && location.pathname.startsWith(item.href));
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all text-white text-sm",
                        isActive
                          ? "bg-primary/90 text-foreground font-semibold shadow-sm"
                          : "hover:bg-primary/20 hover:text-foreground/90"
                      )}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      <span className="font-medium flex-1">{item.title}</span>
                    </Link>
                  );
                })}
                {navGroups.map((group) => {
                  const isExpanded = expandedGroups.includes(group.title);
                  const hasActiveChild = group.children.some(
                    (child) => location.pathname.startsWith(child.href)
                  );
                  const GroupIcon = group.icon;

                  return (
                    <div key={group.title}>
                      <button
                        onClick={() => toggleGroup(group.title)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all text-white text-sm",
                          hasActiveChild ? "bg-white/10" : "hover:bg-primary/20"
                        )}
                      >
                        <GroupIcon className="h-4 w-4 flex-shrink-0" />
                        <span className="font-medium flex-1 text-left">{group.title}</span>
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>
                      {isExpanded && (
                        <div className="ml-4 mt-1 space-y-0.5">
                          {group.children.map((child) => {
                            const isActive = location.pathname.startsWith(child.href);
                            const ChildIcon = child.icon;
                            return (
                              <Link
                                key={child.href}
                                to={child.href}
                                onClick={() => setMenuOpen(false)}
                                className={cn(
                                  "flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all text-white text-sm",
                                  isActive
                                    ? "bg-primary/90 text-foreground font-semibold shadow-sm"
                                    : "hover:bg-primary/20"
                                )}
                              >
                                <ChildIcon className="h-4 w-4 flex-shrink-0" />
                                <span className="font-medium">{child.title}</span>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>

              {/* CONFIGURACION section */}
              <div className="mt-4">
                <p className="text-[10px] font-bold text-white/50 mb-2 px-3 tracking-wider">CONFIGURACION</p>
                <nav className="flex flex-col gap-1">
                  {configNavItems.map((item) => {
                    const isActive = location.pathname === item.href ||
                      (item.href !== "/" && location.pathname.startsWith(item.href));
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all text-white text-sm",
                          isActive
                            ? "bg-primary/90 text-foreground font-semibold shadow-sm"
                            : "hover:bg-primary/20 hover:text-foreground/90"
                        )}
                      >
                        <Icon className="h-4 w-4 flex-shrink-0" />
                        <span className="font-medium flex-1">{item.title}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </ScrollArea>
            <div className="p-4 border-t border-white/10 flex flex-col gap-2">
              <button
                className="w-full flex items-center gap-3 px-2 py-2 rounded-lg transition-all hover:bg-primary/20 group"
                onClick={() => {
                  setMenuOpen(false);
                  navigate('/profile');
                }}
              >
                <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-lg font-bold text-primary">
                  {user?.profile?.firstName?.[0]?.toUpperCase() || user?.profile?.email?.[0]?.toUpperCase() || '?'}
                </div>
                <div className="flex flex-col items-start min-w-0">
                  <span className="text-white font-medium text-sm truncate max-w-[120px] group-hover:underline">{user?.profile?.firstName || 'Usuario'}</span>
                  <span className="text-xs text-white/60 truncate max-w-[120px]">{user?.profile?.email}</span>
                </div>
              </button>
            </div>
          </aside>
        </>
      )}
    </>
  );
};