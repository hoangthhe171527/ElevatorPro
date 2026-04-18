import { Link, useLocation } from "@tanstack/react-router";
import { useAppStore, useCurrentUser } from "@/lib/store";
import type { Role } from "@/lib/mock-data";
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
  Bell,
  Search,
  ChevronDown,
  LogOut,
  Building2,
  AlertTriangle,
  UserCog,
  Map,
  Route as RouteIcon,
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
import { Input } from "@/components/ui/input";

interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navByRole: Record<Role, { group: string; items: NavItem[] }[]> = {
  admin: [
    {
      group: "Tổng quan",
      items: [
        { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
        { to: "/admin/reports", label: "Báo cáo", icon: BarChart3 },
      ],
    },
    {
      group: "Kinh doanh",
      items: [
        { to: "/admin/leads", label: "Khách hàng tiềm năng", icon: UserCog },
        { to: "/admin/customers", label: "Khách hàng", icon: Users },
        { to: "/admin/contracts", label: "Hợp đồng", icon: FileText },
      ],
    },
    {
      group: "Vận hành",
      items: [
        { to: "/admin/jobs", label: "Công việc", icon: Briefcase },
        { to: "/admin/dispatch", label: "Bản đồ & Điều phối", icon: Map },
        { to: "/admin/elevators", label: "Thang máy", icon: Building2 },
        { to: "/admin/inventory", label: "Kho vật tư", icon: Package },
      ],
    },
  ],
  technician: [
    {
      group: "Công việc",
      items: [
        { to: "/tech", label: "Hôm nay", icon: LayoutDashboard },
        { to: "/tech/jobs", label: "Công việc & lộ trình", icon: RouteIcon },
        { to: "/tech/schedule", label: "Lịch", icon: Calendar },
      ],
    },
  ],
  customer: [
    {
      group: "Của tôi",
      items: [
        { to: "/portal", label: "Tổng quan", icon: LayoutDashboard },
        { to: "/portal/elevators", label: "Thang máy", icon: Building2 },
        { to: "/portal/contracts", label: "Hợp đồng", icon: FileText },
        { to: "/portal/issues", label: "Báo lỗi", icon: AlertTriangle },
      ],
    },
  ],
};

const roleLabels: Record<Role, string> = {
  admin: "Quản trị viên",
  technician: "Kỹ thuật viên",
  customer: "Khách hàng",
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const role = useAppStore((s) => s.role);
  const setRole = useAppStore((s) => s.setRole);
  const user = useCurrentUser();
  const location = useLocation();
  const groups = navByRole[role];

  const initials = user.name
    .split(" ")
    .slice(-2)
    .map((n) => n[0])
    .join("");

  return (
    <div className="flex min-h-screen w-full bg-muted/30">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground">
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
          {groups.map((g) => (
            <div key={g.group}>
              <div className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/50">
                {g.group}
              </div>
              <div className="space-y-1">
                {g.items.map((item) => {
                  const active =
                    location.pathname === item.to ||
                    (item.to !== "/admin" &&
                      item.to !== "/tech" &&
                      item.to !== "/portal" &&
                      location.pathname.startsWith(item.to));
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
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
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col min-w-0">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6">
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm khách hàng, hợp đồng, công việc..."
              className="pl-9 bg-muted/50 border-0"
            />
          </div>

          {/* Role switcher (demo) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Wrench className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{roleLabels[role]}</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Chuyển role (demo)</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {(["admin", "technician", "customer"] as Role[]).map((r) => (
                <DropdownMenuItem
                  key={r}
                  onClick={() => {
                    setRole(r);
                    const target =
                      r === "admin" ? "/admin" : r === "technician" ? "/tech" : "/portal";
                    window.location.href = target;
                  }}
                >
                  {roleLabels[r]}
                  {role === r && (
                    <Badge variant="secondary" className="ml-auto">
                      Hiện tại
                    </Badge>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive" />
          </Button>

          <Link to="/qr/e-1" className="hidden sm:flex">
            <Button variant="ghost" size="icon" title="Demo QR thang máy">
              <QrCode className="h-4 w-4" />
            </Button>
          </Link>

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
                  <div className="text-[10px] text-muted-foreground">{roleLabels[role]}</div>
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

        {/* Mobile nav */}
        <div className="lg:hidden flex overflow-x-auto gap-1 px-3 py-2 border-b bg-background">
          {groups
            .flatMap((g) => g.items)
            .map((item) => {
              const active = location.pathname === item.to;
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted",
                  )}
                >
                  <Icon className="h-3.5 w-3.5" /> {item.label}
                </Link>
              );
            })}
        </div>

        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
