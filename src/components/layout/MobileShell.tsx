import { useRef, useEffect, useState, useMemo } from "react";
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
  QrCode,
  Navigation,
  Calendar,
  Globe,
  X,
  Check,
  ChevronRight,
  HelpCircle,
  LogOut,
  Camera,
  Scan,
  Plus,
} from "lucide-react";
import { useAppStore, useCurrentPermissions, useMainRole } from "@/lib/store";
import { mockTenants, mockUsers } from "@/lib/mock-data";
import { MobilePortalProvider } from "./MobilePortalContext";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface MobileShellProps {
  children: React.ReactNode;
  title?: string;
  showBackButton?: boolean;
  backLink?: string;
  actions?: React.ReactNode;
}

export function MobileShell({ children, title, showBackButton, backLink, actions }: MobileShellProps) {
  const user = useCurrentUser();
  const activeTenantId = useAppStore((s) => s.activeTenantId);
  const setTenantId = useAppStore((s) => s.setTenantId);
  const userId = useAppStore((s) => s.userId);
  const setUserId = useAppStore((s) => s.setUserId);
  const permissions = useCurrentPermissions();
  const activeTenant = mockTenants.find(t => t.id === activeTenantId);

  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  // Portal container for modals
  const shellRef = useRef<HTMLDivElement>(null);
  const [portalNode, setPortalNode] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (shellRef.current) {
      setPortalNode(shellRef.current);
    }
  }, []);

  const initials = user.name
    .split(" ")
    .slice(-1)[0][0]
    .toUpperCase();

  const role = useMainRole();
  const companySize = useAppStore((s) => s.companySize);
  const setCompanySize = useAppStore((s) => s.setCompanySize);

  const menuItems = [
    { to: "/mobile/leads", label: "CRM Leads", icon: Users, color: "bg-indigo-500 shadow-indigo-500/20", permissions: ["director", "sales"] },
    { to: "/mobile/route-plan", label: "Lộ trình", icon: Navigation, color: "bg-blue-600 shadow-blue-600/20", permissions: ["director", "field_tech", "maintenance_mgmt"] },
    { to: "/mobile/inventory", label: "Kho vật tư", icon: Package, color: "bg-emerald-500 shadow-emerald-500/20", permissions: ["director", "install_mgmt", "maintenance_mgmt", "field_tech", "accounting"] },
    { to: "/mobile/projects", label: "Dự án", icon: Building, color: "bg-slate-700 shadow-slate-700/20", permissions: ["director", "install_mgmt", "sales"] },
    { to: "/mobile/accounting", label: "Tài chính", icon: CreditCard, color: "bg-purple-500 shadow-purple-500/20", permissions: ["director", "accounting"] },
    { to: "/mobile/reports", label: "Báo cáo", icon: BarChart3, color: "bg-primary shadow-primary/20", permissions: ["director", "sales", "accounting", "hr_admin"] },
    { to: "/mobile/hr", label: "Nhân sự", icon: User, color: "bg-rose-500 shadow-rose-500/20", permissions: ["director", "hr_admin"] },
    { to: "/mobile/settings", label: "Cài đặt", icon: Settings, color: "bg-slate-500 shadow-slate-500/20", permissions: ["director", "sales", "hr_admin", "accounting", "field_tech", "install_mgmt", "maintenance_mgmt"] },
  ].filter(item => item.permissions.some(p => permissions.includes(p as any)));

  const navItems = {
    director: [
      { to: "/mobile", label: "DASHBOARD", icon: Home },
      { to: "/mobile/projects", label: "DỰ ÁN", icon: Building },
      { to: "/mobile/approvals", label: "PHÊ DUYỆT", icon: ShieldCheck },
      { to: "/mobile/accounting", label: "KẾ TOÁN", icon: CreditCard },
    ],
    sales: [
      { to: "/mobile", label: "PIPELINE", icon: Home },
      { to: "/mobile/leads", label: "TIỀM NĂNG", icon: Users },
      { to: "/mobile/reports", label: "Báo cáo", icon: BarChart3 },
      { to: "/mobile/projects", label: "Hợp đồng", icon: Briefcase },
    ],
    tech: [
      { to: "/mobile", label: "LÀM VIỆC", icon: Home },
      { to: "/mobile/route-plan", label: "LỘ TRÌNH", icon: Navigation },
      { to: "/mobile/jobs", label: "PHIẾU VIỆC", icon: ClipboardCheck },
      { to: "/mobile/inventory", label: "Kho", icon: Package },
    ],
    staff: [
      { to: "/mobile", label: "Trang chủ", icon: Home },
      { to: "/mobile/hr", label: "Đội ngũ", icon: User },
    ]
  }[role] || [];

  const isActive = (to: string) =>
    location.pathname === to || (to !== "/mobile" && location.pathname.startsWith(to));

  const currentRoleName = user.name.split("(")[1] ? user.name.split("(")[1].replace(")", "") : "Thành viên";

  // Context-aware Floating Action Button
  const fabConfig = useMemo(() => {
    if (location.pathname.includes('/inventory')) return { icon: Scan, to: '/mobile/scanner', label: 'Quét mã' };
    if (location.pathname.includes('/leads')) return { icon: Plus, to: '/mobile/leads/new', label: 'Thêm Lead' };
    if (location.pathname.includes('/jobs')) return { icon: ClipboardCheck, to: '/mobile/jobs', label: 'Việc của tôi' };
    return null;
  }, [location.pathname]);

  const isActive = (to: string) =>
    location.pathname === to || (to !== "/mobile" && location.pathname.startsWith(to));

  const currentRoleName = user.name.split("(")[1] ? user.name.split("(")[1].replace(")", "") : "Thành viên";

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-0 md:p-12">
      {/* Phone Frame Simulator - Ultra High Fidelity */}
      <div
        ref={shellRef}
        className="relative w-full h-screen md:w-[414px] md:h-[896px] bg-slate-50 md:rounded-[4rem] md:border-[12px] md:border-slate-900 md:shadow-[0_0_120px_-15px_rgba(30,41,59,0.3)] overflow-hidden flex flex-col transition-all duration-500"
      >
        {/* Status Bar (Dynamic) */}
        <div className="h-12 w-full flex items-center justify-between px-8 pt-3 shrink-0 select-none z-50">
          <span className="text-xs font-black tracking-tighter">11:28</span>
          <div className="h-4.5 w-20 bg-slate-900 rounded-full mx-auto -mt-2 hidden md:block" /> {/* Dynamic Island Mimic */}
          <div className="flex gap-1.5 items-center">
            <div className="w-4 h-4 bg-foreground rounded-full opacity-10" />
            <div className="w-4 h-2.5 bg-foreground rounded-sm opacity-10" />
          </div>
        </div>

        {/* Header - Unified & Compact */}
        <header className="h-[72px] flex items-center px-6 sticky top-0 bg-white/80 backdrop-blur-3xl z-[60] border-b border-slate-100 italic transition-all">
          <div className="flex items-center gap-4 z-10 w-[110px] shrink-0">
            {showBackButton || backLink ? (
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-2xl bg-slate-50/50 hover:bg-slate-100 active:scale-90 transition-all border border-slate-100"
                onClick={() => {
                  if (backLink) window.location.assign(backLink);
                  else window.history.back();
                }}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            ) : (
              <button
                onClick={() => setIsAccountOpen(true)}
                className="flex items-center gap-3 active:scale-95 transition-transform min-w-0"
              >
                <div className="h-11 w-11 rounded-2xl bg-slate-900 flex items-center justify-center shadow-lg shadow-slate-900/10 shrink-0">
                  <Avatar className="h-full w-full rounded-2xl">
                    <AvatarFallback className="bg-slate-900 text-white text-[10px] font-black italic">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex flex-col items-start min-w-0">
                  <h1 className="font-black text-[14px] text-slate-900 leading-none tracking-tight truncate w-full">
                    {user.name.split(' ')[0]}
                  </h1>
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1 flex items-center gap-1 overflow-hidden">
                    <Globe className="h-2.5 w-2.5 text-primary shrink-0" /> <span className="truncate">{activeTenant?.name?.split(' ')[0]}</span>
                  </span>
                </div>
              </button>
            )}
          </div>

          <div className="flex-1 flex flex-col items-center justify-center min-w-0 px-1 overflow-hidden">
               <span className="text-[11px] font-black text-slate-900 uppercase tracking-[0.15em] line-clamp-2 text-center w-full leading-tight">{title || "COMMAND"}</span>
               {!showBackButton && !backLink && (
                 <div className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-[7px] font-black text-emerald-600 uppercase tracking-widest mt-1 border border-emerald-500/20 whitespace-nowrap">
                    {role} • {companySize}
                 </div>
               )}
          </div>

          <div className="flex items-center gap-2 z-10 w-[110px] shrink-0 justify-end">
            {actions ? (
              actions
            ) : (
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-2xl relative bg-slate-50 border border-slate-100 shrink-0">
                <Bell className="h-5 w-5 text-slate-600" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-10 w-10 rounded-2xl bg-slate-50 border border-slate-100 shrink-0"
              onClick={() => setIsMenuOpen(true)}
            >
              <LayoutGrid className="h-5 w-5 text-slate-600" />
            </Button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto pb-32 scrollbar-hide bg-white relative">
          <MobilePortalProvider container={portalNode}>
            {children}
            
            {/* Dynamic FAB */}
            {fabConfig && (
              <Link
                to={fabConfig.to}
                className="absolute bottom-24 right-6 h-14 w-14 rounded-full bg-slate-900 border-4 border-white text-white flex items-center justify-center shadow-2xl shadow-slate-900/40 z-50 active:scale-90 transition-transform"
              >
                <fabConfig.icon className="h-6 w-6" />
                {/* Tooltip optional for mobile */}
              </Link>
            )}
          </MobilePortalProvider>
        </main>

        {/* Global Overlays (Menu / Auth / Switch Role) */}
        {(isMenuOpen || isAccountOpen) && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-3xl z-[100] animate-in fade-in slide-in-from-bottom-20 duration-500 flex flex-col p-8 pt-16">
              <div className="flex items-center justify-between mb-8">
                <div className="flex flex-col">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">
                    {isMenuOpen ? "COMMAND" : "WORKSPACE"}
                  </h2>
                  <p className="text-[9px] font-black text-slate-400 tracking-[0.3em] mt-1 uppercase italic opacity-50">Demo Controls & RBAC</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsAccountOpen(false);
                  }}
                  className="rounded-2xl h-12 w-12 bg-slate-50 border border-slate-100 shadow-sm active:scale-90"
                >
                  <X className="h-6 w-6 text-slate-900" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto scrollbar-hide space-y-12">
                {/* 1. COMPANY SIZE SWITCHER */}
                <section className="space-y-4">
                   <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1 italic">QUY MÔ HỆ THỐNG</h3>
                   <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: "large", label: "Tập Đoàn Lớn", desc: "Quy trình chuyên môn hóa", icon: Globe },
                        { id: "small", label: "Công Ty SME", desc: "Nhân sự kiêm nhiệm", icon: LayoutGrid }
                      ].map((type) => (
                        <button
                          key={type.id}
                          onClick={() => {
                            setCompanySize(type.id as any);
                            setIsMenuOpen(false);
                            setIsAccountOpen(false);
                          }}
                          className={cn(
                            "p-4 rounded-[1.75rem] border-2 transition-all text-left flex flex-col gap-2 relative overflow-hidden group",
                            companySize === type.id ? "bg-slate-900 border-slate-900 text-white shadow-xl" : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
                          )}
                        >
                          <type.icon className={cn("h-6 w-6 mb-2", companySize === type.id ? "text-white" : "text-slate-300")} />
                          <span className={cn("text-[11px] font-black uppercase tracking-tight leading-none", companySize === type.id ? "text-white" : "text-slate-900")}>
                            {type.label}
                          </span>
                          <span className="text-[8px] font-bold opacity-60 leading-tight">{type.desc}</span>
                          {companySize === type.id && <div className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                        </button>
                      ))}
                   </div>
                </section>

                {/* 2. ROLE SWITCHER (Contextual) */}
                <section className="space-y-4">
                   <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1 italic">VAI TRÒ TRONG HỆ THỐNG</h3>
                   <div className="grid grid-cols-1 gap-3">
                      {mockUsers
                        .filter((u) => u.memberships.some((m) => m.tenantId === activeTenantId))
                        .map((u) => {
                           const roleLabel = u.name.split("(")[1] ? u.name.split("(")[1].replace(")", "") : "Thành viên";
                           const isCurrent = userId === u.id;
                           return (
                             <button
                               key={u.id}
                               onClick={() => {
                                 setUserId(u.id);
                                 setIsMenuOpen(false);
                                 setIsAccountOpen(false);
                               }}
                               className={cn(
                                 "flex items-center gap-4 p-4 rounded-3xl border-2 transition-all text-left",
                                 isCurrent ? "bg-primary/5 border-primary shadow-sm" : "bg-white border-slate-100 hover:border-slate-200"
                               )}
                             >
                               <div className={cn("h-11 w-11 rounded-2xl shrink-0 flex items-center justify-center font-black text-xs border border-white shadow-sm", isCurrent ? "bg-primary text-white" : "bg-slate-50 text-slate-400")}>
                                 {u.name.split(' ').slice(-1)[0][0]}
                               </div>
                               <div className="flex-1 min-w-0">
                                  <p className={cn("text-[11px] font-black uppercase tracking-tight", isCurrent ? "text-primary" : "text-slate-900")}>{roleLabel}</p>
                                  <p className="text-[9px] font-bold text-slate-400 truncate">{u.name.split("(")[0].trim()}</p>
                               </div>
                               {isCurrent && <Check className="h-5 w-5 text-primary shrink-0" />}
                             </button>
                           );
                        })}
                   </div>
                </section>

                {/* 3. QUICK ACTIONS (Strict Filtered) */}
                {isMenuOpen && (
                  <section className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1 italic">DANH MỤC CHỨC NĂNG</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.to}
                            to={item.to}
                            onClick={() => setIsMenuOpen(false)}
                            className="flex flex-col items-center gap-2 group"
                          >
                            <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center text-white transition-all active:scale-95", item.color)}>
                              <Icon className="h-6 w-6" />
                            </div>
                            <span className="text-[9px] font-black text-slate-500 text-center leading-tight uppercase tracking-widest h-6 flex items-center transition-colors group-hover:text-slate-900">
                              {item.label.split(' ')[0]}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </section>
                )}
              </div>
              
              <div className="mt-8 flex flex-col gap-4">
                 <p className="text-center text-[9px] font-black text-slate-300 uppercase tracking-widest italic flex items-center justify-center gap-2">
                    <ShieldCheck className="h-3 w-3" /> SECURED BY ELEVATORPRO CLOUD
                 </p>
              </div>
          </div>
        )}

        {/* Bottom Tab Bar - Dynamic & Role-Based */}
        <nav className="h-[80px] bg-white/80 backdrop-blur-3xl border-t border-slate-100 flex items-center justify-around px-4 absolute bottom-0 w-full z-[110] pb-6 shadow-[0_-5px_25px_rgba(0,0,0,0.03)]">
          {navItems.slice(0, 2).map((item) => {
            const Icon = item.icon;
            const active = isActive(item.to);
            return (
              <Link key={item.to} to={item.to} className="flex flex-col items-center gap-1.5 active:scale-90 transition-all w-16">
                <div className={cn("h-1 w-3 rounded-full mb-0.5", active ? "bg-primary" : "bg-transparent")} />
                <Icon className={cn("h-5 w-5", active ? "text-primary" : "text-slate-400")} />
                <span className={cn("text-[8px] font-black uppercase tracking-tight", active ? "text-primary" : "text-slate-400")}>
                  {item.label}
                </span>
              </Link>
            );
          })}

          {/* Central QR Feature (Always visible) */}
          <Link to="/mobile/scanner" className="relative -mt-12 group">
            <div className="h-[68px] w-[68px] rounded-[2rem] bg-slate-900 text-white shadow-xl flex items-center justify-center border-4 border-white active:scale-90 transition-all group-hover:bg-primary">
              <QrCode className="h-8 w-8" />
            </div>
            <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[8px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">SCAN QR</span>
          </Link>

          {navItems.slice(2, 4).map((item) => {
            const Icon = item.icon;
            const active = isActive(item.to);
            return (
              <Link key={item.to} to={item.to} className="flex flex-col items-center gap-1.5 active:scale-90 transition-all w-16">
                <div className={cn("h-1 w-3 rounded-full mb-0.5", active ? "bg-primary" : "bg-transparent")} />
                <Icon className={cn("h-5 w-5", active ? "text-primary" : "text-slate-400")} />
                <span className={cn("text-[8px] font-black uppercase tracking-tight", active ? "text-primary" : "text-slate-400")}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Home Indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-40 h-1 bg-slate-900/10 rounded-full z-[120] pointer-events-none" />
      </div>

      {/* Frame Context Info - High Aesthetic */}
      <div className="hidden lg:flex absolute top-12 right-12 flex-col items-end gap-6 select-none animate-in fade-in slide-in-from-right-10 duration-700">
        <div className="text-right">
           <h4 className="text-3xl font-black text-slate-300 italic tracking-tighter uppercase mb-2">Simulating Next-Gen</h4>
           <div className="flex items-center justify-end gap-3">
              <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-full border border-emerald-100">STABLE V2.4.0</span>
              <span className="text-slate-400 text-xs font-bold font-mono">IPHONE 13 PRO MAX</span>
           </div>
        </div>
      </div>
    </div>
  );
}
