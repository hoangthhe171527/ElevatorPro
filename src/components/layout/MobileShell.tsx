import React, { useState } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { useMainRole, useCurrentUser, setMainRole } from "@/lib/store";
import { 
  Home, 
  Briefcase, 
  Navigation, 
  Settings, 
  Bell,
  Menu,
  ChevronLeft,
  UserCircle,
  Building2,
  LogOut,
  Shield,
  ArrowRightLeft,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface MobileShellProps {
  children: React.ReactNode;
  title?: string;
  hideHeader?: boolean;
}

export function MobileShell({ children, title, hideHeader = false }: MobileShellProps) {
  const role = useMainRole();
  const user = useCurrentUser();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const switchRole = () => {
    const nextRole = role === "admin" ? "tech" : "admin";
    setMainRole(nextRole);
    setIsMenuOpen(false);
    window.location.reload(); // Refresh to update dashboard modules
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans relative overflow-hidden">
      {/* Dynamic Header */}
      {!hideHeader && (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-5 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
             <button onClick={() => window.history.back()} className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 active:scale-95">
                <ChevronLeft className="h-4 w-4 text-slate-600" />
             </button>
             <div>
                <h2 className="text-xs font-bold text-slate-900 leading-none">{title || "ElevatorPro"}</h2>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{role} Mode</p>
             </div>
          </div>
          <div className="flex items-center gap-2">
             <button className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100">
                <Bell className="h-4 w-4 text-slate-500" />
             </button>
             <button onClick={() => setIsMenuOpen(true)} className="h-8 w-8 rounded-lg bg-slate-900 flex items-center justify-center border border-slate-800 active:scale-95 shadow-lg shadow-slate-900/20">
                <Menu className="h-4 w-4 text-white" />
             </button>
          </div>
        </header>
      )}

      {/* Side Menu Drawer */}
      {isMenuOpen && (
        <>
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100]" onClick={() => setIsMenuOpen(false)} />
          <div className="fixed inset-y-0 right-0 w-[280px] bg-white z-[101] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
             <div className="p-6 border-b border-slate-50 bg-slate-50/50">
                <div className="flex justify-between items-start mb-6">
                   <div className="h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
                      <UserCircle className="h-7 w-7" />
                   </div>
                   <button onClick={() => setIsMenuOpen(false)} className="h-8 w-8 rounded-full bg-white border border-slate-200 flex items-center justify-center">
                      <X className="h-4 w-4 text-slate-400" />
                   </button>
                </div>
                <h3 className="text-base font-black text-slate-900 italic leading-none truncate">{user?.name || "Người dùng"}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 flex items-center gap-1.5">
                   <Shield className="h-3 w-3 text-indigo-500" /> {role} Account
                </p>
             </div>

             <div className="flex-1 overflow-y-auto p-4 space-y-1">
                <div className="px-3 py-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Hệ thống</div>
                
                <button onClick={switchRole} className="w-full h-12 flex items-center gap-3 px-4 rounded-xl hover:bg-slate-50 active:bg-slate-100 text-slate-700 transition-colors border border-transparent active:border-slate-100">
                   <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                      <ArrowRightLeft className="h-4 w-4 text-indigo-600" />
                   </div>
                   <span className="text-xs font-bold uppercase tracking-tight">Chuyển sang {role === "admin" ? "Kỹ thuật" : "Quản trị"}</span>
                </button>

                <button className="w-full h-12 flex items-center gap-3 px-4 rounded-xl hover:bg-slate-50 text-slate-700 transition-colors">
                   <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                      <Building2 className="h-4 w-4 text-emerald-600" />
                   </div>
                   <span className="text-xs font-bold uppercase tracking-tight">Chi nhánh chính</span>
                </button>

                <div className="h-4" />
                <div className="px-3 py-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Người dùng</div>
                
                <Link to="/mobile/profile" className="w-full h-12 flex items-center gap-3 px-4 rounded-xl hover:bg-slate-50 text-slate-700 transition-colors">
                   <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center">
                      <Settings className="h-4 w-4 text-slate-500" />
                   </div>
                   <span className="text-xs font-bold uppercase tracking-tight">Cài đặt cá nhân</span>
                </Link>

                <button className="w-full h-12 flex items-center gap-3 px-4 rounded-xl hover:bg-rose-50 text-rose-600 transition-colors">
                   <div className="h-8 w-8 rounded-lg bg-rose-50 flex items-center justify-center">
                      <LogOut className="h-4 w-4" />
                   </div>
                   <span className="text-xs font-bold uppercase tracking-tight">Đăng xuất</span>
                </button>
             </div>

             <div className="p-6 border-t border-slate-100">
                <div className="bg-slate-900 rounded-2xl p-4 flex items-center gap-3 shadow-xl">
                   <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-white" />
                   </div>
                   <div>
                      <p className="text-[10px] font-bold text-white leading-none">Global Elevator Corp</p>
                      <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">Enterprise Plan</p>
                   </div>
                </div>
             </div>
          </div>
        </>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        {children}
      </main>

      {/* Modern Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-[440px] mx-auto bg-white/90 backdrop-blur-xl border-t border-slate-100 px-6 py-3 pb-6 flex items-center justify-between z-50 shadow-[0_-4px_12px_rgba(0,0,0,0.03)] rounded-t-[1.5rem]">
        <Link to="/mobile/" className="flex flex-col items-center gap-1 group">
          <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center transition-all group-active:scale-90", "text-slate-400")}>
            <Home className="h-5 w-5" />
          </div>
        </Link>
        <Link to="/mobile/jobs" className="flex flex-col items-center gap-1 group">
          <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center transition-all group-active:scale-90", "text-slate-400")}>
            <Briefcase className="h-5 w-5" />
          </div>
        </Link>
        <Link to="/mobile/tech/route-plan" className="flex flex-col items-center gap-1 group">
          <div className={cn("h-12 w-12 -mt-8 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/40 border-4 border-slate-50 transition-all active:scale-95")}>
            <Navigation className="h-6 w-6" />
          </div>
        </Link>
        <Link to="/mobile/elevators" className="flex flex-col items-center gap-1 group">
          <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center transition-all group-active:scale-90", "text-slate-400")}>
             <Settings className="h-5 w-5" />
          </div>
        </Link>
        <button onClick={() => setIsMenuOpen(true)} className="flex flex-col items-center gap-1 group">
           <div className="h-10 w-10 rounded-xl flex items-center justify-center text-slate-400 group-active:scale-90 transition-all">
              <Menu className="h-5 w-5" />
           </div>
        </button>
      </nav>
    </div>
  );
}
