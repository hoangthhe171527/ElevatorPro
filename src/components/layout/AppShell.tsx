import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useAppStore, useCurrentUser, useCurrentPermissions } from "@/lib/store";
import type { Permission } from "@/lib/mock-data";
import { mockTenants, mockUsers } from "@/lib/mock-data";
import {
  LayoutDashboard,
  Users,
  FileText,
  Briefcase,
  Cog,
  Package,
  History,
  Calendar,
  Wrench,
  ChevronDown,
  LogOut,
  Building2,
  AlertTriangle,
  Route as RouteIcon,
  Menu,
  X,
  CheckCircle2,
  Hammer,
  Activity,
  Smartphone,
  CheckSquare,
  Inbox,
  Layers,
  Construction,
  ClipboardList,
  CircleDollarSign,
  PhoneCall,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { GlobalSearch } from "@/components/common/GlobalSearch";
import { NotificationPanel } from "@/components/common/NotificationPanel";
import { CreateHotlineIncidentModal } from "@/components/common/Modals";
import { MobileBottomNav } from "./MobileBottomNav";

interface NavItem {
  to: string;
  label: string;
  icon: any;
  permissions: Permission[];
  search?: Record<string, any>;
  children?: { to: string; label: string; search?: Record<string, any>; permissions?: Permission[] }[];
}

const ROLE_LABELS: Record<string, string> = {
  ceo: "CEO",
  sales_admin: "Sale Admin",
  intake_operator: "Tiếp nhận & nhập liệu",
  accountant: "Kế toán",
  tech_maintenance: "Kỹ thuật bảo trì",
  tech_installation: "Kỹ thuật lắp đặt",
};

function getUserRoleLabel(user: { memberships?: Array<{ tenantId: string; permissions: string[] }> }, tenantId: string) {
  const perms = user.memberships?.find((m) => m.tenantId === tenantId)?.permissions || [];
  if (!perms.length) return "Chuyên viên";
  return perms.map((p) => ROLE_LABELS[p] || p).join(" • ");
}

const navConfig: { group: string; items: NavItem[] }[] = [
  {
    group: "Bảng điều khiển (Admin)",
    items: [
      { 
        to: "/admin", 
        label: "Dashboard", 
        icon: LayoutDashboard, 
        permissions: ["ceo", "sales_admin", "intake_operator", "accountant"] 
      },
      { to: "/admin/approvals", label: "Phê duyệt", icon: CheckSquare, permissions: ["ceo", "accountant"] },
      { to: "/admin/reports", label: "Báo cáo", icon: History, permissions: ["ceo", "accountant"] },
    ],
  },
  {
    group: "Quản lý kinh doanh",
    items: [
      { to: "/admin/customers", label: "Khách hàng", icon: Users, permissions: ["ceo", "sales_admin", "intake_operator", "accountant"] },
      { to: "/admin/leads", label: "Cơ hội (Leads)", icon: Inbox, permissions: ["ceo", "sales_admin", "intake_operator"] },
      { to: "/admin/contracts", label: "Hợp đồng", icon: FileText, permissions: ["ceo", "sales_admin", "accountant"] },
    ],
  },
  {
    group: "Vận hành kỹ thuật",
    items: [
      { to: "/admin/elevators", label: "Thang máy", icon: Layers, permissions: ["ceo", "sales_admin", "intake_operator", "tech_installation", "tech_maintenance"] },
      {
        to: "/admin/jobs",
        label: "Công việc",
        icon: Briefcase,
        permissions: ["ceo", "intake_operator"],
        children: [
          { to: "/admin/projects", label: "Tiến độ Lắp đặt" },
          { to: "/admin/unassigned-jobs", label: "Việc chưa phân công" },
          { to: "/admin/jobs", label: "Bảo trì", search: { tab: "maintenance" } },
          { to: "/admin/warranty", label: "Bảo hành" },
          { to: "/admin/repairs", label: "Sửa chữa & Sự cố" },
          { to: "/admin/jobs", label: "Khảo sát", search: { tab: "inspection" } },
        ],
      },
      { to: "/admin/inventory", label: "Kho vật tư", icon: Package, permissions: ["ceo", "tech_installation", "tech_maintenance"] },
    ],
  },
  {
    group: "Nhân sự & Kế toán",
    items: [
      { to: "/admin/hr", label: "Cán bộ nhân viên", icon: User, permissions: ["ceo"] },
      { to: "/admin/accounting", label: "Kế toán/Thu tiền", icon: CircleDollarSign, permissions: ["ceo", "accountant"] },
    ],
  },
  {
    group: "App Hiện trường (Field App)",
    items: [
      { to: "/tech", label: "Hôm nay", icon: LayoutDashboard, permissions: ["tech_maintenance", "tech_installation"] },
      { to: "/tech/route-plan", label: "Lộ trình tối ưu", icon: RouteIcon, permissions: ["tech_maintenance", "tech_installation"] },
      { 
        to: "/tech/jobs", 
        label: "Công việc", 
        icon: ClipboardList, 
        permissions: ["tech_maintenance", "tech_installation"],
        children: [
          { to: "/tech/jobs", label: "Bảo trì", search: { tab: "maintenance" }, permissions: ["tech_maintenance"] },
          { to: "/tech/warranty", label: "Bảo hành", permissions: ["tech_maintenance"] },
          { to: "/tech/repairs", label: "Sửa chữa", permissions: ["tech_maintenance"] },
          { to: "/tech/jobs", label: "Lắp đặt", search: { tab: "install" }, permissions: ["tech_installation"] },
          { to: "/tech/jobs", label: "Khảo sát", search: { tab: "inspection" }, permissions: ["tech_installation"] },
        ]
      },
      { to: "/tech/schedule", label: "Lịch", icon: Calendar, permissions: ["tech_maintenance", "tech_installation"] },
    ],
  },
];

function SidebarItem({ 
  item, 
  isRouteActive, 
  onClick 
}: { 
  item: NavItem; 
  isRouteActive: (to: string, search?: Record<string, any>) => boolean; 
  onClick?: () => void;
}) {
  const permissions = useCurrentPermissions();
  const location = useLocation();
  const isApp = location.pathname.startsWith("/app");
  
  const visibleChildren = item.children?.filter(child => 
    !child.permissions || child.permissions.some(p => (permissions as any[]).includes(p))
  );

  const isChildActive = visibleChildren?.some(child => isRouteActive(child.to, child.search));
  const active = isRouteActive(item.to, item.search) || isChildActive;
  const [open, setOpen] = useState(active);

  // Sync open state when navigation happens
  useEffect(() => {
    if (active) setOpen(true);
  }, [active]);
  const targetTo = isApp ? `/app${item.to}` : item.to;

  const handleClick = () => {
    if (onClick) onClick();
  };

  const Icon = item.icon;

  if (item.children) {
    return (
      <div className="space-y-1">
        <button
          onClick={() => setOpen(!open)}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
            active
              ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
              : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
          )}
        >
          <Icon className="h-4 w-4" />
          <span className="flex-1 text-left">{item.label}</span>
          <ChevronDown className={cn("h-3 w-3 transition-transform", open && "rotate-180")} />
        </button>
        {open && visibleChildren && (
          <div className="ml-4 space-y-1 border-l border-sidebar-border pl-4">
            {visibleChildren.map((child) => {
              const childTargetTo = isApp ? `/app${child.to}` : child.to;
              return (
                <Link
                  key={child.label}
                  to={childTargetTo as any}
                  search={child.search as any}
                  onClick={handleClick}
                  className={cn(
                    "block rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                    isRouteActive(child.to, child.search)
                      ? "text-sidebar-primary font-bold"
                      : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/30"
                  )}
                >
                  {child.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      to={targetTo as any}
      search={item.search as any}
      onClick={handleClick}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
      )}
    >
      <Icon className="h-4 w-4" />
      {item.label}
    </Link>
  );
}

function SidebarContent({ 
  visibleGroups, 
  isRouteActive,
  onItemClick
}: { 
  visibleGroups: any[]; 
  isRouteActive: any;
  onItemClick?: () => void;
}) {
  return (
    <>
      <div className="flex h-16 items-center gap-2 px-6 border-b border-sidebar-border">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
          <Cog className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <div className="font-bold leading-tight tracking-tight">ElevatorPro</div>
          <div className="text-[10px] text-sidebar-foreground/50 font-medium uppercase tracking-wider">Service Management</div>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-hide">
        {visibleGroups.map((g) => (
          <div key={g.group}>
            <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-sidebar-foreground/40">
              {g.group}
            </div>
            <div className="space-y-1">
              {g.items.map((item: NavItem) => (
                <SidebarItem 
                  key={item.label} 
                  item={item} 
                  isRouteActive={isRouteActive} 
                  onClick={onItemClick}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>
      <div className="border-t border-sidebar-border p-3">
        <Link
          to="/"
          className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors"
        >
          <LogOut className="h-3.5 w-3.5" /> Về trang chủ
        </Link>
      </div>
    </>
  );
}

export function AppShell({ 
  children, 
  className,
  secondaryNav
}: { 
  children: React.ReactNode; 
  className?: string;
  secondaryNav?: React.ReactNode;
}) {
  const setUserId = useAppStore((s) => s.setUserId);
  const activeTenantId = useAppStore((s) => s.activeTenantId);
  const setTenantId = useAppStore((s) => s.setTenantId);
  const user = useCurrentUser();
  const permissions = useCurrentPermissions();
  const location = useLocation();
  const { pathname } = location;
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const quickIncidentOpen = useAppStore((s) => s.quickIncidentOpen);
  const setQuickIncidentOpen = useAppStore((s) => s.setQuickIncidentOpen);
  const isAppPreviewStored = useAppStore((s) => s.isAppPreview);
  const setAppPreview = useAppStore((s) => s.setAppPreview);
  const navigate = useNavigate();

  const isAppPreview = pathname.startsWith("/app");

  useEffect(() => {
    if (isAppPreview !== isAppPreviewStored) {
      setAppPreview(isAppPreview);
    }
  }, [isAppPreview, isAppPreviewStored, setAppPreview]);

  const visibleGroups = navConfig
        .map((g) => ({
          ...g,
          items: g.items.filter((item) => item.permissions.some((p) => permissions.includes(p as Permission))),
        }))
        .filter((g) => g.items.length > 0);

  const initials = user.name
    .split(" ")
    .slice(-2)
    .map((n) => n[0])
    .join("");

  const isRouteActive = (to: string, search?: Record<string, any>) => {
    const currentPath = pathname.startsWith("/app") 
      ? pathname.replace("/app", "") 
      : pathname;
    
    const normalizedTo = to.startsWith("/app") ? to.replace("/app", "") : to;

    const isBaseActive = currentPath === normalizedTo ||
      (normalizedTo !== "/admin" && normalizedTo !== "/tech" && normalizedTo !== "/portal" && currentPath.startsWith(normalizedTo));
    
    if (!search || Object.keys(search).length === 0) return isBaseActive;
    
    const query = new URLSearchParams(location.search);
    const searchMatch = Object.entries(search).every(([k, v]) => query.get(k) === String(v));
    return isBaseActive && searchMatch;
  };

  return (
    <div className={cn("flex min-h-screen w-full", isAppPreview ? "bg-slate-200" : "bg-muted/30")}>
      {!isAppPreview && (
        <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground sticky top-0 h-screen">
          <SidebarContent 
            visibleGroups={visibleGroups} 
            isRouteActive={isRouteActive} 
          />
        </aside>
      )}

      {mobileSidebarOpen && !isAppPreview && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-64 flex flex-col bg-sidebar text-sidebar-foreground shadow-xl">
            <div className="absolute top-3 right-3">
              <Button
                variant="ghost"
                size="icon"
                className="text-sidebar-foreground/60 hover:text-sidebar-foreground"
                onClick={() => setMobileSidebarOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <SidebarContent 
              visibleGroups={visibleGroups} 
              isRouteActive={isRouteActive} 
              onItemClick={() => setMobileSidebarOpen(false)}
            />
          </aside>
        </div>
      )}

      <div className={cn(
        "flex flex-1 flex-col min-w-0 transition-all duration-500",
        isAppPreview ? "items-center justify-center p-4 lg:p-12 overflow-hidden" : "pb-16 lg:pb-0"
      )}>
        
        {/* Standard Web Header - HIDDEN in App Preview */}
        {!isAppPreview && (
          <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background px-4 lg:px-6">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            <div className="hidden sm:block flex-1">
              <GlobalSearch />
            </div>

            <div className="hidden md:flex items-center ml-auto mr-2 pr-4 border-r">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2 shrink-0 h-8 font-medium">
                    <Building2 className="h-4 w-4 text-primary" />
                    <span>
                      {mockTenants.find((t) => t.id === activeTenantId)?.name || "Select Tenant"}
                    </span>
                    <ChevronDown className="h-3 w-3 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Tổ chức (SaaS Tenant)</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {mockTenants.map((t) => (
                    <DropdownMenuItem
                      key={t.id}
                      onClick={() => {
                        setTenantId(t.id);
                        setUserId("u-director-2");
                        window.location.href = "/admin";
                      }}
                    >
                      {t.name}
                      {activeTenantId === t.id && (
                        <Badge variant="secondary" className="ml-auto">Hiện tại</Badge>
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2 h-9 px-3 rounded-full mr-2"
              onClick={() => {
                const target = location.pathname.startsWith("/admin") 
                  ? location.pathname.replace("/admin", "/app/admin")
                  : "/app/admin";
                navigate({ to: target as any });
              }}
            >
              <Smartphone className="h-4 w-4" />
              <span className="hidden xl:inline text-[10px] font-black uppercase tracking-widest text-slate-500">Xem giao diện App</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 shrink-0 max-w-[200px] truncate">
                  <Wrench className="h-3.5 w-3.5 shrink-0" />
                  <span className="hidden sm:inline truncate">
                    {getUserRoleLabel(user, activeTenantId)}
                  </span>
                  <ChevronDown className="h-3 w-3 shrink-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>Chuyển Role (Công ty hiện tại)</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {mockUsers
                  .filter((u) => u.memberships.some((m) => m.tenantId === activeTenantId))
                  .map((u) => (
                    <DropdownMenuItem
                      key={u.id}
                      onClick={() => {
                        setUserId(u.id);
                        const isTech = u.memberships[0]?.permissions.some((p) => p === "tech_maintenance" || p === "tech_installation");
                        let target = isTech ? "/tech" : "/admin";
                        // If we are in app mode, stay in app mode
                        if (isAppPreview) target = `/app${target}`;
                        window.location.href = target;
                      }}
                      className="flex items-start flex-col gap-1 py-2"
                    >
                      <div className="font-semibold">{u.name.split("(")[0]}</div>
                      <div className="text-xs font-semibold text-primary/80">
                        Vai: {getUserRoleLabel(u, activeTenantId)}
                      </div>
                    </DropdownMenuItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <NotificationPanel />

            <Avatar className="h-8 w-8 ml-2">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">{initials}</AvatarFallback>
            </Avatar>
          </header>
        )}

        {/* --- SMARTPHONE SIMULATOR WRAPPER --- */}
        <div 
          className={cn(
            "flex flex-col min-w-0 transition-all relative",
            isAppPreview ? (
              "mx-auto my-auto shrink-0 w-[390px] h-[844px] bg-white rounded-[48px] shadow-[0_0_0_8px_#111,0_30px_60px_rgba(0,0,0,0.3)] border-[8px] border-[#111] overflow-hidden"
            ) : (
              "flex-1 w-full h-full"
            )
          )}
          style={isAppPreview ? { transform: 'scale(min(1, calc((100vh - 100px) / 844)))', transformOrigin: 'center' } : {}}
        >
          
          {/* Simulated Status Bar (Clock, Signal, Island) */}
          {isAppPreview && (
            <div className="h-12 w-full flex items-center justify-between px-7 pt-2 shrink-0 select-none pointer-events-none bg-white z-50">
               <div className="text-[14px] font-black tracking-tight">{new Date().getHours()}:{new Date().getMinutes().toString().padStart(2, '0')}</div>
               {/* Apple Dynamic Island Simulation */}
               <div className="absolute top-2.5 left-1/2 -translate-x-1/2 h-[30px] w-[100px] bg-black rounded-full shadow-sm flex items-center justify-end px-2">
                 <div className="h-2 w-2 rounded-full bg-emerald-500 mr-1 opacity-80" />
               </div>
               <div className="flex items-center gap-1.5 opacity-80">
                  <Activity className="h-3 w-3 fill-current" />
                  <div className="h-2.5 w-5 rounded-sm border border-slate-900 relative">
                     <div className="absolute inset-[1px] bg-slate-900 w-[70%]" />
                  </div>
               </div>
            </div>
          )}

          {/* Floating Exit/Role Controls for Preview Mode */}
          {isAppPreview && (
            <div className="absolute top-14 left-0 right-0 z-50 flex justify-center gap-2 pointer-events-auto">
               <Button 
                variant="secondary" 
                size="sm" 
                className="h-8 rounded-full bg-slate-900 text-white hover:bg-slate-800 text-[10px] font-black uppercase tracking-widest px-4 shadow-xl"
                onClick={() => {
                  const target = location.pathname.replace("/app", "");
                  navigate({ to: target || "/" as any });
                  setAppPreview(false);
                }}
               >
                 <X className="mr-2 h-3 w-3" /> Thoát Xem Thử
               </Button>
            </div>
          )}

          {/* Actual Content Area */}
          <main className={cn(
            "flex-1 overflow-y-auto bg-slate-50/50 relative scrollbar-hide",
            isAppPreview ? "px-4 pb-28 pt-4" : "p-4 lg:p-6"
          )}>
            {secondaryNav && (
              <div className={cn("sticky top-0 z-40 mb-4", isAppPreview ? "-mx-4 -mt-4" : "")}>
                {secondaryNav}
              </div>
            )}
            {children}
          </main>

          <MobileBottomNav />
          
          <CreateHotlineIncidentModal 
            open={quickIncidentOpen} 
            onOpenChange={setQuickIncidentOpen} 
          />
        </div>
      </div>
    </div>
  );
}
