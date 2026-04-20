import React from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { useMainRole, useCurrentUser } from "@/lib/store";
import { 
  Home, 
  Briefcase, 
  Navigation, 
  Settings, 
  Bell,
  Menu,
  ChevronLeft
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileShellProps {
  children: React.ReactNode;
  title?: string;
  hideHeader?: boolean;
}

export function MobileShell({ children, title, hideHeader = false }: MobileShellProps) {
  const role = useMainRole();
  const user = useCurrentUser();
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans relative overflow-hidden">
      {/* Dynamic Header */}
      {!hideHeader && (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-5 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
             <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 overflow-hidden">
                <span className="text-[10px] font-black text-slate-600 italic">CP</span>
             </div>
             <div>
                <h2 className="text-xs font-bold text-slate-900 leading-none">{title || "ElevatorPro"}</h2>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{role} Mode</p>
             </div>
          </div>
          <div className="flex items-center gap-2">
             <button className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100">
                <Bell className="h-4 w-4 text-slate-500" />
             </button>
          </div>
        </header>
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
        <button className="flex flex-col items-center gap-1 group">
           <div className="h-10 w-10 rounded-xl flex items-center justify-center text-slate-400">
              <Menu className="h-5 w-5" />
           </div>
        </button>
      </nav>
    </div>
  );
}
