import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { cn } from "../../lib/utils";
import { useAuth } from "@/shared/hooks/useAuth";
import { ButtonGlobal } from "../button-global";
import { ScrollArea } from "../ui/scroll-area";
import { LayoutDashboard, Users, FolderTree } from "lucide-react";

const navItems = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "Categorías", href: "/categories", icon: FolderTree },
  { title: "Gestionar Usuarios", href: "/users", icon: Users },
];

export const MobileHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <>
      <header className="lg:hidden flex items-center justify-between h-14 px-4 border-b border-white/10 bg-gradient-to-b from-slate-900 to-slate-800 z-30 relative">
        <div className="flex items-center gap-2">
          <img src="/miio.jpeg" alt="Miio Logo" className="w-8 h-8 rounded-md object-cover" onClick={() => navigate(`/`)}/>
          <span className="text-lg font-bold text-white tracking-tight">Miio</span>
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
              </nav>
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