import { Link, useLocation } from "@tanstack/react-router";
import { useCurrentUser } from "@/lib/store";
import {
  Home,
  Building,
  Briefcase,
  User,
  Bell,
  ChevronLeft,
  LayoutGrid,
  Settings,
  Package,
  Users,
  ShieldCheck,
  BarChart3,
  ClipboardCheck,
  CreditCard,
  Building2,
  X,
  QrCode,
  Navigation,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Card } from "../ui/card";

interface MobileShellProps {
  children: React.ReactNode;
  title?: string;
  showBackButton?: boolean;
}

export function MobileShell({ children, title, showBackButton }: MobileShellProps) {
  const user = useCurrentUser();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const initials = user.name
    .split(" ")
    .slice(-2)
    .map((n) => n[0])
    .join("");

  const tabs = [
    { to: "/mobile", label: "Home", icon: Home },
    { to: "/mobile/projects", label: "Dự án", icon: Building },
    { to: "/mobile/jobs", label: "Việc", icon: Briefcase },
    { to: "/mobile/elevators", label: "Thang", icon: Building2 },
    { to: "menu", label: "Menu", icon: LayoutGrid },
  ];

  const menuItems = [
    { to: "/mobile/leads", label: "Leads/CRM", icon: Users, color: "bg-orange-500" },
    { to: "/mobile/portal", label: "Cổng Khách hàng", icon: LayoutGrid, color: "bg-indigo-500" },
    {
      to: "/mobile/route-plan",
      label: "Lộ trình kỹ thuật",
      icon: Navigation,
      color: "bg-indigo-600",
    },
    { to: "/mobile/schedule", label: "Lịch bảo trì", icon: Calendar, color: "bg-pink-500" },
    { to: "/mobile/inventory", label: "Kho vật tư", icon: Package, color: "bg-blue-500" },
    { to: "/mobile/approvals", label: "Phê duyệt", icon: ShieldCheck, color: "bg-emerald-500" },
    { to: "/mobile/accounting", label: "Kế toán", icon: CreditCard, color: "bg-purple-500" },
    { to: "/mobile/reports", label: "Báo cáo", icon: BarChart3, color: "bg-amber-500" },
    { to: "/mobile/hr", label: "Nhân sự", icon: ClipboardCheck, color: "bg-slate-500" },
    { to: "/mobile/profile", label: "Tài khoản", icon: User, color: "bg-primary" },
    { to: "/mobile/settings", label: "Cài đặt", icon: Settings, color: "bg-slate-700" },
  ];

  const isActive = (to: string) =>
    location.pathname === to || (to !== "/mobile" && location.pathname.startsWith(to));

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-0 md:p-8">
      {/* Phone Frame Simulator */}
      <div className="relative w-full h-screen md:w-[390px] md:h-[844px] bg-background md:rounded-[3rem] md:border-[8px] md:border-slate-900 md:shadow-2xl overflow-hidden flex flex-col">
        {/* Status Bar */}
        <div className="h-10 w-full flex items-center justify-between px-6 pt-2 shrink-0 select-none">
          <span className="text-xs font-bold">11:28</span>
          <div className="flex gap-1.5 items-center">
            <div className="w-4 h-4 bg-foreground rounded-full opacity-10" />
            <div className="w-3 h-2 bg-foreground rounded-full opacity-10" />
          </div>
        </div>

        {/* Header */}
        <header className="h-16 flex items-center justify-between px-4 sticky top-0 bg-background/80 backdrop-blur-md z-30 border-b">
          <div className="flex items-center gap-2">
            {showBackButton ? (
              <Button
                variant="ghost"
                size="icon"
                className="-ml-2 h-9 w-9 rounded-full"
                onClick={() => window.history.back()}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            ) : (
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <LayoutGrid className="h-4.5 w-4.5 text-white" />
              </div>
            )}
            <h1 className="font-bold text-base truncate max-w-[160px]">{title || "ElevatorPro"}</h1>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-destructive rounded-full" />
            </Button>
            <Link to="/mobile/profile">
              <Avatar className="h-8 w-8 ring-2 ring-primary/10">
                <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto pb-24 scrollbar-hide bg-slate-50/50">
          {children}
        </main>

        {/* More Menu Overlay */}
        {isMenuOpen && (
          <div className="absolute inset-0 bg-background z-50 animate-in fade-in slide-in-from-bottom-4 duration-200">
            <div className="p-6 pt-12">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold">Tất cả chức năng</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-full h-10 w-10 bg-muted"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-y-8 gap-x-4">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex flex-col items-center gap-2"
                    >
                      <div
                        className={cn(
                          "h-14 w-14 rounded-2xl flex items-center justify-center text-white shadow-lg",
                          item.color,
                        )}
                      >
                        <Icon className="h-7 w-7" />
                      </div>
                      <span className="text-[11px] font-bold text-center leading-tight">
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Bottom Tab Bar */}
        <nav className="h-[72px] bg-background/95 backdrop-blur-lg border-t flex items-center justify-around px-2 absolute bottom-0 w-full z-40 pb-5">
          <Link to="/mobile" className="flex flex-col items-center gap-1 group">
            <Home
              className={cn(
                "h-5 w-5",
                location.pathname === "/mobile" ? "text-primary font-bold" : "text-slate-400",
              )}
            />
            <span
              className={cn(
                "text-[9px] font-bold",
                location.pathname === "/mobile" ? "text-primary" : "text-slate-400",
              )}
            >
              HOME
            </span>
          </Link>
          <Link to="/mobile/projects" className="flex flex-col items-center gap-1">
            <Building
              className={cn(
                "h-5 w-5",
                location.pathname.startsWith("/mobile/projects")
                  ? "text-primary"
                  : "text-slate-400",
              )}
            />
            <span
              className={cn(
                "text-[9px] font-bold",
                location.pathname.startsWith("/mobile/projects")
                  ? "text-primary"
                  : "text-slate-400",
              )}
            >
              DỰ ÁN
            </span>
          </Link>

          {/* Central QR Button */}
          <Link to="/mobile/scanner" className="relative -mt-10">
            <div className="h-14 w-14 rounded-2xl bg-primary text-white shadow-lg shadow-primary/30 flex items-center justify-center border-4 border-white active:scale-90 transition-transform">
              <QrCode className="h-7 w-7" />
            </div>
          </Link>

          <Link to="/mobile/jobs" className="flex flex-col items-center gap-1">
            <Briefcase
              className={cn(
                "h-5 w-5",
                location.pathname.startsWith("/mobile/jobs") ? "text-primary" : "text-slate-400",
              )}
            />
            <span
              className={cn(
                "text-[9px] font-bold",
                location.pathname.startsWith("/mobile/jobs") ? "text-primary" : "text-slate-400",
              )}
            >
              CÔNG VIỆC
            </span>
          </Link>
          <button
            className="flex flex-col items-center gap-1"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <LayoutGrid className={cn("h-5 w-5", isMenuOpen ? "text-primary" : "text-slate-400")} />
            <span
              className={cn("text-[9px] font-bold", isMenuOpen ? "text-primary" : "text-slate-400")}
            >
              MENU
            </span>
          </button>
        </nav>

        {/* Home Indicator */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-foreground/10 rounded-full z-50 pointer-events-none hidden md:block" />
      </div>

      {/* Exit Button - Desktop only */}
      <div className="hidden lg:flex absolute top-8 right-8 flex-col items-end gap-3">
        <Link to="/admin">
          <Button variant="secondary" className="shadow-lg">
            Thoát Mobile Demo
          </Button>
        </Link>
        <p className="text-muted-foreground text-xs text-right max-w-[200px]">
          Đang mô phỏng trên khung hình <b>iPhone 13 Pro</b>
        </p>
      </div>
    </div>
  );
}
