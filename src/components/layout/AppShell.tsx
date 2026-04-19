// src/components/layout/AppShell.tsx  ← THAY THẾ FILE CŨ
import { Link, useLocation } from "@tanstack/react-router";
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
  BarChart3,
  Calendar,
  Wrench,
  QrCode,
  ChevronDown,
  LogOut,
  Building2,
  AlertTriangle,
  UserCog,
  Map,
  Route as RouteIcon,
  Menu,
  X,
  Wallet,
  Building,
  CheckCircle2,
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
import { useState } from "react";

interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  permissions: Permission[];
}

const navConfig: { group: string; items: NavItem[] }[] = [
  {
    group: "Quản trị & Phân tích",
    items: [
      { to: "/admin", label: "Dashboard", icon: LayoutDashboard, permissions: ["director", "sales", "install_mgmt", "maintenance_mgmt", "hr_admin", "accounting"] },
      { to: "/admin/approvals", label: "Phê duyệt (Workflows)", icon: CheckCircle2, permissions: ["director", "install_mgmt", "maintenance_mgmt", "hr_admin", "accounting"] },
      { to: "/admin/reports", label: "Báo cáo", icon: BarChart3, permissions: ["director", "sales", "accounting", "hr_admin"] },
    ],
  },
  {
    group: "Kinh doanh",
    items: [
      { to: "/admin/leads", label: "Khách hàng tiềm năng", icon: UserCog, permissions: ["director", "sales"] },
      { to: "/admin/customers", label: "Khách hàng", icon: Users, permissions: ["director", "sales", "maintenance_mgmt", "accounting", "sales_maintenance"] },
      { to: "/admin/contracts", label: "Hợp đồng", icon: FileText, permissions: ["director", "sales", "sales_maintenance", "accounting"] },
    ],
  },
  {
    group: "Kỹ thuật vận hành",
    items: [
      { to: "/admin/projects", label: "Dự án Lắp đặt", icon: Building, permissions: ["director", "install_mgmt", "sales"] },
      { to: "/admin/jobs", label: "Công việc (Điều phối)", icon: Briefcase, permissions: ["director", "install_mgmt", "maintenance_mgmt", "tech_survey"] },
      { to: "/admin/elevators", label: "Thang máy", icon: Building2, permissions: ["director", "install_mgmt", "maintenance_mgmt", "tech_survey", "sales_maintenance"] },
      { to: "/admin/inventory", label: "Kho vật tư", icon: Package, permissions: ["director", "install_mgmt", "maintenance_mgmt", "accounting"] },
    ],
  },
  {
    group: "Backoffice (Kế toán - NS)",
    items: [
      { to: "/admin/accounting", label: "Kế toán & Công nợ", icon: Wallet, permissions: ["director", "accounting"] },
      { to: "/admin/hr", label: "Nhân sự & Hiệu suất", icon: Users, permissions: ["director", "hr_admin"] },
    ],
  },
  {
    group: "App Hiện trường (Field App)",
    items: [
      { to: "/tech", label: "Hôm nay", icon: LayoutDashboard, permissions: ["field_tech"] },
      { to: "/tech/jobs", label: "Công việc & lộ trình", icon: RouteIcon, permissions: ["field_tech"] },
      { to: "/tech/schedule", label: "Lịch", icon: Calendar, permissions: ["field_tech"] },
    ],
  },
  {
    group: "Portal Khách hàng",
    items: [
      { to: "/portal", label: "Tổng quan", icon: LayoutDashboard, permissions: ["customer"] },
      { to: "/portal/elevators", label: "Thang máy", icon: Building2, permissions: ["customer"] },
      { to: "/portal/contracts", label: "Hợp đồng", icon: FileText, permissions: ["customer"] },
      { to: "/portal/issues", label: "Báo lỗi", icon: AlertTriangle, permissions: ["customer"] },
    ],
  },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const setUserId = useAppStore((s) => s.setUserId);
  const activeTenantId = useAppStore((s) => s.activeTenantId);
  const setTenantId = useAppStore((s) => s.setTenantId);
  const user = useCurrentUser();
  const permissions = useCurrentPermissions();
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Filter groups
  const visibleGroups = navConfig
    .map(g => ({
      ...g,
      items: g.items.filter(item => item.permissions.some(p => permissions.includes(p))),
    }))
    .filter(g => g.items.length > 0);

  const initials = user.name
    .split(" ")
    .slice(-2)
    .map((n) => n[0])
    .join("");

  const isActive = (to: string) =>
    location.pathname === to ||
    (to !== "/admin" && to !== "/tech" && to !== "/portal" && location.pathname.startsWith(to));

  const SidebarContent = () => (
    <>
      <div className="flex h-16 items-center gap-2 px-6 border-b border-sidebar-border">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
          <Cog className="h-5 w-5 text-sidebar-primary-foreground" />
        </div>
        <div>
          <div className="font-semibold leading-tight">ElevatorPro</div>
          <div className="text-[11px] text-sidebar-foreground/60">Quản lý dịch vụ thang máy</div>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {visibleGroups.map((g) => (
          <div key={g.group}>
            <div className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/50">
              {g.group}
            </div>
            <div className="space-y-1">
              {g.items.map((item) => {
                const active = isActive(item.to);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="border-t border-sidebar-border p-3">
        <Link
          to="/"
          className="flex items-center gap-2 px-3 py-2 text-xs text-sidebar-foreground/60 hover:text-sidebar-foreground"
        >
          <LogOut className="h-3.5 w-3.5" /> Về trang chủ
        </Link>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen w-full bg-muted/30">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
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
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex flex-1 flex-col min-w-0">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background px-4 lg:px-6">
          {/* Mobile hamburger */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Global search */}
          <GlobalSearch />

          {/* Tenant switcher */}
          <div className="hidden md:flex items-center ml-auto mr-2 pr-4 border-r">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 shrink-0 h-8 font-medium">
                  <Building2 className="h-4 w-4 text-primary" />
                  <span>{mockTenants.find(t => t.id === activeTenantId)?.name || 'Select Tenant'}</span>
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
                      // Auto-login into the director of the newly selected tenant
                      const directorId = t.id === "t-1" ? "u-director-1" : "u-director-2";
                      setUserId(directorId);
                      window.location.href = "/admin"; // reset to dashboard
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

          {/* Role switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 shrink-0 max-w-[200px] truncate">
                <Wrench className="h-3.5 w-3.5 shrink-0" />
                <span className="hidden sm:inline truncate">{user.name.split('(')[1] ? user.name.split('(')[1].replace(')', '') : user.name}</span>
                <ChevronDown className="h-3 w-3 shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>Chuyển Role (Công ty hiện tại)</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {mockUsers.filter(u => u.memberships.some(m => m.tenantId === activeTenantId)).map((u) => (
                <DropdownMenuItem
                  key={u.id}
                  onClick={() => {
                    setUserId(u.id);
                    const isTech = u.memberships[0]?.permissions.includes("field_tech");
                    const isCus = u.memberships[0]?.permissions.includes("customer");
                    const isHR = u.memberships[0]?.permissions.includes("hr_admin") && u.memberships[0]?.permissions.length === 1;
                    const isAcc = u.memberships[0]?.permissions.includes("accounting") && u.memberships[0]?.permissions.length === 1;

                    let target = "/admin";
                    if (isTech) target = "/tech";
                    if (isCus) target = "/portal";
                    if (isHR) target = "/admin/hr";
                    if (isAcc) target = "/admin/accounting";

                    window.location.href = target;
                  }}
                  className="flex items-start flex-col gap-1 py-2"
                >
                  <div className="font-semibold">{u.name.split('(')[0]}</div>
                  <div className="text-xs font-semibold text-primary/80 truncate">
                    Vai: {u.name.split('(')[1] ? u.name.split('(')[1].replace(')','') : "Chuyên viên"}
                  </div>
                  <div className="text-[10px] text-muted-foreground opacity-80 max-w-[220px] truncate">
                    Quyền: {u.memberships.find(m => m.tenantId === activeTenantId)?.permissions.slice(0,3).join(", ")}{u.memberships.find(m => m.tenantId === activeTenantId)!.permissions.length > 3 ? "..." : ""}
                  </div>
                  {user.id === u.id && (
                    <Badge variant="secondary" className="absolute right-2 top-2">
                      Đang chọn
                    </Badge>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notification bell */}
          <NotificationPanel />

          {/* Demo QR */}
          <Link to="/qr/$elevatorId" params={{ elevatorId: "e-1" }} className="hidden sm:flex">
            <Button variant="ghost" size="icon" title="Demo QR thang máy">
              <QrCode className="h-4 w-4" />
            </Button>
          </Link>

          {/* User avatar */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 px-2">
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <div className="text-xs font-medium leading-tight">{user.name}</div>
                  <div className="text-[10px] text-muted-foreground truncate max-w-[100px]">{user.name.split('(')[1] ? user.name.split('(')[1].replace(')', '') : "RBAC"}</div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Tài khoản</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Hồ sơ</DropdownMenuItem>
              <DropdownMenuItem>Cài đặt</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/">Đăng xuất</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}