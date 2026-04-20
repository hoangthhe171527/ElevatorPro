import { useRef, useEffect, useState } from "react";
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
} from "lucide-react";
import { useAppStore, useCurrentPermissions } from "@/lib/store";
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
}

export function MobileShell({ children, title, showBackButton, backLink }: MobileShellProps) {
  const user = useCurrentUser();
  const activeTenantId = useAppStore((s) => s.activeTenantId);
  const setTenantId = useAppStore((s) => s.setTenantId);
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

  const menuItems = [
    { to: "/mobile/leads", label: "CRM Leads", icon: Users, color: "bg-indigo-500 shadow-indigo-500/20" },
    { to: "/mobile/route-plan", label: "Lộ trình", icon: Navigation, color: "bg-blue-600 shadow-blue-600/20" },
    { to: "/mobile/schedule", label: "Lịch bảo trì", icon: Calendar, color: "bg-rose-500 shadow-rose-500/20" },
    { to: "/mobile/inventory", label: "Kho vật tư", icon: Package, color: "bg-emerald-500 shadow-emerald-500/20" },
    { to: "/mobile/approvals", label: "Phê duyệt", icon: ShieldCheck, color: "bg-amber-500 shadow-amber-500/20" },
    { to: "/mobile/projects", label: "Dự án", icon: Building, color: "bg-slate-700 shadow-slate-700/20" },
    { to: "/mobile/accounting", label: "Tài chính", icon: CreditCard, color: "bg-purple-500 shadow-purple-500/20" },
    { to: "/mobile/reports", label: "Báo cáo", icon: BarChart3, color: "bg-primary shadow-primary/20" },
    { to: "/mobile/settings", label: "Cài đặt", icon: Settings, color: "bg-slate-500 shadow-slate-500/20" },
  ];

  const isActive = (to: string) =>
    location.pathname === to || (to !== "/mobile" && location.pathname.startsWith(to));

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

        {/* Header - Enhanced Glassmorphism */}
        <header className="h-20 flex items-center justify-between px-6 sticky top-0 bg-white/70 backdrop-blur-3xl z-[60] border-b border-slate-100/50">
          <div className="flex items-center gap-3">
            {showBackButton || backLink ? (
              <Button
                variant="ghost"
                size="icon"
                className="-ml-2 h-10 w-10 rounded-2xl bg-slate-50/50 hover:bg-slate-100 active:scale-90 transition-all"
                onClick={() => {
                  if (backLink) window.location.href = backLink;
                  else window.history.back();
                }}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            ) : (
              <div className="h-10 w-10 rounded-2xl bg-slate-900 flex items-center justify-center shadow-lg shadow-slate-900/10">
                <LayoutGrid className="h-5 w-5 text-white" />
              </div>
            )}
            <div className="flex flex-col min-w-0">
               <h1 className="font-black text-[15px] text-slate-900 truncate leading-tight tracking-tight">
                 {title || "ElevatorPro"}
               </h1>
               {!showBackButton && !backLink && (
                 <span className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
                   <Globe className="h-3 w-3" /> {activeTenant?.name?.split(' ')[0] || "Hệ thống"}
                 </span>
               )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-2xl relative bg-slate-50/50">
              <Bell className="h-5 w-5 text-slate-600" />
              <span className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
            </Button>
            <button 
              onClick={() => setIsAccountOpen(true)}
              className="flex items-center p-1 rounded-2xl hover:bg-slate-50 transition-colors focus:outline-none"
            >
              <Avatar className="h-8 w-8 border border-white shadow-sm ring-1 ring-slate-100">
                <AvatarFallback className="bg-indigo-50 text-indigo-600 text-[10px] font-black italic">
                   {initials}
                </AvatarFallback>
              </Avatar>
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto pb-32 scrollbar-hide bg-slate-50">
          <MobilePortalProvider container={portalNode}>
            {children}
          </MobilePortalProvider>
        </main>

        {/* Global Overlays (Menu / Auth) */}
        {(isMenuOpen || isAccountOpen) && (
          <div className="absolute inset-0 bg-slate-50/95 backdrop-blur-2xl z-[100] animate-in fade-in slide-in-from-bottom-10 duration-300 flex flex-col p-8 pt-16">
              <div className="flex items-center justify-between mb-10">
                <div className="flex flex-col">
                  <h2 className="text-2xl font-black text-slate-900 tracking-tighter italic uppercase">
                    {isAccountOpen ? "WORKSPACE" : "COMMAND HUB"}
                  </h2>
                  <p className="text-[10px] font-black text-slate-400 tracking-widest mt-1">SUPER APP INTEGRATION V2.0</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsAccountOpen(false);
                  }}
                  className="rounded-2xl h-12 w-12 bg-white shadow-xl border border-slate-100 active:scale-90"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>

              {isAccountOpen ? (
                <div className="space-y-10">
                  {/* Tenant Switcher */}
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] px-1">CHỌN TỔ CHỨC</h3>
                    <div className="space-y-3">
                      {mockTenants.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => {
                            setTenantId(t.id);
                            const directorId = t.id === "t-1" ? "u-director-1" : "u-director-2";
                            setUserId(directorId);
                            setIsAccountOpen(false);
                          }}
                          className={cn(
                            "w-full flex items-center justify-between p-5 rounded-3xl transition-all border-2",
                            activeTenantId === t.id 
                            ? "bg-slate-900 border-slate-900 text-white shadow-2xl shadow-slate-900/20" 
                            : "bg-white border-slate-100 text-slate-600 hover:border-slate-200"
                          )}
                        >
                          <div className="flex items-center gap-4">
                            <div className={cn("h-10 w-10 rounded-2xl flex items-center justify-center", activeTenantId === t.id ? "bg-white/10" : "bg-slate-50")}>
                               <Building2 className="h-5 w-5" />
                            </div>
                            <span className="font-black text-sm uppercase tracking-tight">{t.name}</span>
                          </div>
                          {activeTenantId === t.id && <Check className="h-5 w-5 text-emerald-400" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Account Options */}
                  <div className="space-y-3">
                    <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] px-1">QUẢN TRỊ VIÊN</h3>
                    <div className="p-6 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-4">
                        <Avatar className="h-14 w-14">
                           <AvatarFallback className="bg-primary text-white font-black text-sm italic">{initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                           <p className="text-sm font-black text-slate-900 truncate">{user.name}</p>
                           <p className="text-[10px] font-bold text-slate-400">ID: {user.id}</p>
                        </div>
                        <Button size="icon" variant="ghost" className="h-10 w-10 rounded-xl bg-slate-50"><LogOut className="h-4 w-4" /></Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-6 scrollbar-hide flex-1 pb-10">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex flex-col items-center gap-3 active:scale-90 transition-transform"
                      >
                        <div
                          className={cn(
                            "h-16 w-16 rounded-[1.75rem] flex items-center justify-center text-white shadow-2xl",
                            item.color,
                          )}
                        >
                          <Icon className="h-7 w-7" />
                        </div>
                        <span className="text-[10px] font-black text-slate-900 text-center leading-tight uppercase tracking-widest h-8 flex items-center">
                          {item.label}
                        </span>
                      </Link>
                    );
                  })}
                  <div className="flex flex-col items-center gap-3 opacity-30">
                     <div className="h-16 w-16 rounded-[1.75rem] bg-slate-200 flex items-center justify-center text-slate-400 border-2 border-dashed border-slate-300">
                        <HelpCircle className="h-7 w-7" />
                     </div>
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center leading-tight">SẮP TỚI</span>
                  </div>
                </div>
              )}
              
              <div className="mt-auto pt-6 flex flex-col gap-3">
                 <Link to="/admin" className="w-full">
                    <Button variant="outline" className="w-full rounded-2xl h-14 border-slate-200 text-slate-400 font-black text-[10px] uppercase gap-2">
                      QUAY LẠI TRÌNH QUẢN TRỊ <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                 </Link>
                 <p className="text-center text-[9px] font-black text-slate-300 uppercase tracking-widest italic flex items-center justify-center gap-2">
                    <ShieldCheck className="h-3 w-3" /> SECURED BY ELEVATORPRO CLOUD
                 </p>
              </div>
          </div>
        )}

        {/* Bottom Tab Bar - Premium Glassmorphism */}
        <nav className="h-[84px] bg-white/70 backdrop-blur-3xl border-t border-slate-100/50 flex items-center justify-around px-4 absolute bottom-0 w-full z-[110] pb-8 shadow-[0_-10px_40px_-15px_rgba(30,41,59,0.1)]">
          <Link to="/mobile" className="flex flex-col items-center gap-1.5 active:scale-90 transition-all">
            <div className={cn(
              "h-1 w-1 rounded-full mb-1 transition-all",
              location.pathname === "/mobile" ? "bg-primary w-4" : "bg-transparent"
            )} />
            <Home className={cn("h-5 w-5", location.pathname === "/mobile" ? "text-primary" : "text-slate-400")} />
            <span className={cn("text-[8px] font-black uppercase tracking-tighter font-mono", location.pathname === "/mobile" ? "text-primary" : "text-slate-400")}>HOME</span>
          </Link>

          <Link to="/mobile/projects" className="flex flex-col items-center gap-1.5 active:scale-90 transition-all">
            <div className={cn(
              "h-1 w-1 rounded-full mb-1 transition-all",
              isActive("/mobile/projects") ? "bg-primary w-4" : "bg-transparent"
            )} />
            <Building className={cn("h-5 w-5", isActive("/mobile/projects") ? "text-primary" : "text-slate-400")} />
            <span className={cn("text-[8px] font-black uppercase tracking-tighter font-mono", isActive("/mobile/projects") ? "text-primary" : "text-slate-400")}>PROJECTS</span>
          </Link>

          {/* Central Floating Action */}
          <Link to="/mobile/scanner" className="relative -mt-10 group">
            <div className="h-16 w-16 rounded-[1.75rem] bg-slate-900 text-white shadow-2xl shadow-slate-900/30 flex items-center justify-center border-[4px] border-white active:scale-90 transition-all group-hover:bg-primary group-hover:shadow-primary/30">
              <QrCode className="h-7 w-7" />
            </div>
          </Link>

          <Link to="/mobile/jobs" className="flex flex-col items-center gap-1.5 active:scale-90 transition-all">
            <div className={cn(
              "h-1 w-1 rounded-full mb-1 transition-all",
              isActive("/mobile/jobs") ? "bg-primary w-4" : "bg-transparent"
            )} />
            <Briefcase className={cn("h-5 w-5", isActive("/mobile/jobs") ? "text-primary" : "text-slate-400")} />
            <span className={cn("text-[8px] font-black uppercase tracking-tighter font-mono", isActive("/mobile/jobs") ? "text-primary" : "text-slate-400")}>SERVICE</span>
          </Link>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex flex-col items-center gap-1.5 active:scale-90 transition-all"
          >
            <div className={cn(
              "h-1 w-1 rounded-full mb-1 transition-all",
              isMenuOpen ? "bg-primary w-4" : "bg-transparent"
            )} />
            <LayoutGrid className={cn("h-5 w-5", isMenuOpen ? "text-primary" : "text-slate-400")} />
            <span className={cn("text-[8px] font-black uppercase tracking-tighter font-mono", isMenuOpen ? "text-primary" : "text-slate-400")}>COMMAND</span>
          </button>
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
        
        <div className="w-px h-24 bg-gradient-to-b from-slate-200 to-transparent mr-4" />

        <Link to="/admin">
          <Button variant="outline" className="h-16 px-8 rounded-[1.5rem] bg-white border-2 border-slate-100 shadow-2xl shadow-slate-900/5 hover:bg-slate-50 transition-all group font-black text-xs uppercase tracking-widest gap-3">
            Exit Mobile View <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
