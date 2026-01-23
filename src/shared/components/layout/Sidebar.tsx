import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from '@/shared/hooks/useAuth';
import { cn } from "../../lib/utils";
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
} from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  section?: string;
}

interface SubNavItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

interface NavGroup {
  title: string;
  icon: React.ElementType;
  section: string;
  children: SubNavItem[];
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    section: "GENERAL",
  },
  {
    title: "Categorias",
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
];

const navGroups: NavGroup[] = [
  {
    title: "Planes",
    icon: CreditCard,
    section: "GENERAL",
    children: [
      { title: "Plan Video", href: "/plans/video", icon: Video },
      { title: "Plan Publicidad", href: "/plans/advertising", icon: Megaphone },
      { title: "Plan Lives", href: "/plans/lives", icon: Radio },
    ],
  },
];

export const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['Planes']);

  const generalItems = navItems.filter((item) => item.section === "GENERAL");
  const generalGroups = navGroups.filter((group) => group.section === "GENERAL");

  const toggleGroup = (title: string) => {
    setExpandedGroups((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

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
    <div className="hidden lg:flex flex-col h-screen w-60 border-r border-gray-100 bg-gradient-to-b from-slate-900 to-slate-800 z-20 shrink-0">
      <div className="flex items-center gap-3 h-14 px-5 border-b border-white/10">
        <div className="flex items-center justify-center w-10 h-14">
          <img
          src="/miio.jpeg"
          alt="Miio Logo"
          className="w-8 h-8 rounded-md object-cover"
          />
        </div>
        <span className="text-lg font-bold text-white tracking-tight">Miio</span>
      </div>

      <ScrollArea className="flex-1 py-4">
        <div className="px-3 mb-6">
          <p className="text-[10px] font-bold text-white/50 mb-2 px-3 tracking-wider">MAIN</p>
          <nav className="space-y-0.5">
            {generalItems.map(renderNavItem)}
            {generalGroups.map((group) => {
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
                      hasActiveChild ? "bg-white/10" : "hover:bg-white/5"
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
                          <Link key={child.href} to={child.href}>
                            <div
                              className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all text-white text-sm",
                                isActive
                                  ? "bg-primary/90 text-foreground font-semibold shadow-sm"
                                  : "hover:bg-white/5"
                              )}
                            >
                              <ChildIcon className="h-4 w-4 flex-shrink-0" />
                              <span className="font-medium">{child.title}</span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </ScrollArea>

      <div className="p-3 border-t border-white/10 flex flex-col gap-2">
        <button
          className="w-full flex items-center gap-3 px-2 py-2 rounded-lg transition-all hover:bg-white/10 group"
          onClick={() => navigate('/profile')}
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
    </div>
  );
};
