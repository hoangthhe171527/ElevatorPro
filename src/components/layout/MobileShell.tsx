import React, { useState } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { useMainRole, useCurrentUser, setMainRole, useAppStore } from "@/lib/store";
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
  X,
  PlusSquare,
  Search
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
  const companySize = useAppStore((s) => s.companySize);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const switchRole = () => {
    const nextRole = role === "admin" ? "tech" : "admin";
    setMainRole(nextRole);
    setIsMenuOpen(false);
    window.location.reload(); 
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans relative overflow-hidden">
      {/* Phone Frame Desktop Simulation in __root.tsx already handles the outer frame */}
      
      {/* Header with Role Branding */}
      {!hideHeader && (
        <header className="sticky top-0 z-[60] bg-white/70 backdrop-blur-xl border-b border-slate-100 px-5 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
             <button onClick={() => window.history.back()} className="h-9 w-9 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200 active:scale-95 transition-all">
                <ChevronLeft className="h-5 w-5 text-slate-600" />
             </button>
             <div>
                <h2 className="text-[13px] font-black italic text-slate-900 leading-none uppercase tracking-tight">{title || "Cloud_Stack"}</h2>
                <div className="flex items-center gap-1.5 mt-1">
                   <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
                   <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em]">{role} ACTIVE</p>
                </div>
             </div>
          </div>
          <div className="flex items-center gap-2">
             <button className="h-9 w-9 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200 active:scale-95 transition-all relative">
                <Bell className="h-5 w-5 text-slate-500" />
                <span className="absolute top-2 right-2 h-2 w-2 bg-rose-500 rounded-full border-2 border-white shadow-sm" />
             </button>
             <button onClick={() => setIsMenuOpen(true)} className="h-9 w-9 rounded-xl bg-slate-900 flex items-center justify-center border border-slate-800 active:scale-95 shadow-lg shadow-slate-900/20 group">
                <Menu className="h-4 w-4 text-white group-active:rotate-90 transition-transform" />
             </button>
          </div>
        </header>
      )}

      {/* Modern Sidebar Drawer */}
      {isMenuOpen && (
        <>
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] animate-in fade-in duration-300" onClick={() => setIsMenuOpen(false)} />
          <div className="fixed inset-y-0 right-0 w-[300px] bg-white z-[101] shadow-2xl flex flex-col p-0 overflow-hidden animate-in slide-in-from-right duration-500 ease-out">
             {/* Profile Header */}
             <div className="p-8 pb-10 bg-indigo-950 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-24 -mt-24 blur-3xl" />
                <div className="relative z-10 flex justify-between items-start mb-8">
                   <div className="h-16 w-16 rounded-[1.5rem] bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-xl">
                      <UserCircle className="h-10 w-10 text-indigo-300" />
                   </div>
                   <button onClick={() => setIsMenuOpen(false)} className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center transition-all group active:scale-90">
                      <X className="h-5 w-5 text-white/50 group-active:rotate-90 transition-transform" />
                   </button>
                </div>
                <div className="relative z-10">
                   <h3 className="text-xl font-black italic tracking-tighter leading-none mb-2">{user?.name || "Nguyễn Văn Director"}</h3>
                   <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/10 w-fit">
                      <Shield className="h-3.5 w-3.5 text-indigo-400" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-indigo-100">{role === "admin" ? "Executive Admin" : "Field Engineer"}</span>
                   </div>
                </div>
             </div>

             <div className="flex-1 overflow-y-auto p-6 space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 pl-2">System Controls_</p>
                
                <button onClick={switchRole} className="w-full h-14 flex items-center gap-4 px-4 rounded-2xl hover:bg-slate-50 active:bg-slate-100 text-slate-700 transition-all border border-transparent active:border-slate-100 group">
                   <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <ArrowRightLeft className="h-5 w-5 text-indigo-600" />
                   </div>
                   <div className="text-left">
                      <span className="block text-[12px] font-black uppercase tracking-tighter">Switch Workspace</span>
                      <span className="block text-[9px] font-bold text-slate-400">Sang chế độ {role === "admin" ? "Kỹ thuật" : "Quản trị"}</span>
                   </div>
                </button>

                <button className="w-full h-14 flex items-center gap-4 px-4 rounded-2xl hover:bg-slate-50 text-slate-700 transition-all group">
                   <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Building2 className="h-5 w-5 text-emerald-600" />
                   </div>
                   <div className="text-left">
                      <span className="block text-[12px] font-black uppercase tracking-tighter">Company Level</span>
                      <span className="block text-[9px] font-bold text-slate-400 capitalize">{companySize} Scale Active</span>
                   </div>
                </button>

                <div className="h-6" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 pl-2">Personal_</p>
                
                <Link to="/mobile/profile" onClick={() => setIsMenuOpen(false)} className="w-full h-14 flex items-center gap-4 px-4 rounded-2xl hover:bg-slate-50 text-slate-700 transition-all group">
                   <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Settings className="h-5 w-5 text-slate-500" />
                   </div>
                   <span className="text-[12px] font-black uppercase tracking-tighter">My Account</span>
                </Link>

                <button className="w-full h-14 flex items-center gap-4 px-4 rounded-2xl hover:bg-rose-50 text-rose-600 transition-all group mt-10">
                   <div className="h-10 w-10 rounded-xl bg-rose-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <LogOut className="h-5 w-5" />
                   </div>
                   <span className="text-[12px] font-black uppercase tracking-tighter underline decoration-2 underline-offset-4">End Session</span>
                </button>
             </div>

             <div className="p-8 border-t border-slate-100 flex justify-center">
                <div className="flex flex-col items-center opacity-20">
                   <ShieldCheck className="h-8 w-8 text-slate-900 mb-2" />
                   <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.4em] italic">Encrypted Cloud_</p>
                </div>
             </div>
          </div>
        </>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        {children}
      </main>

      {/* Fixed Navigation Bar - Professional Rounded Design */}
      <nav className="fixed bottom-6 left-6 right-6 h-20 bg-slate-900/90 backdrop-blur-2xl rounded-[1.8rem] px-5 flex items-center justify-between z-50 shadow-[0_20px_40px_rgba(0,0,0,0.3)] border border-white/10 border-t-white/20">
        <Link to="/mobile/" className="flex flex-col items-center transition-all active:scale-75 group select-none">
          <Home className="h-6 w-6 text-white/50 group-data-[status=active]:text-white" />
          <span className="text-[8px] font-black text-white/30 uppercase tracking-widest mt-1.5 group-data-[status=active]:text-indigo-400">Home</span>
        </Link>
        <Link to="/mobile/jobs" className="flex flex-col items-center transition-all active:scale-75 group select-none">
          <Briefcase className="h-6 w-6 text-white/50 group-data-[status=active]:text-white" />
          <span className="text-[8px] font-black text-white/30 uppercase tracking-widest mt-1.5 group-data-[status=active]:text-indigo-400">Tasks</span>
        </Link>
        
        {/* Floating Scanner / Action Button */}
        <Link to="/mobile/scanner" className="h-16 w-16 -mt-16 bg-gradient-to-br from-indigo-500 to-indigo-700 text-white rounded-[1.5rem] flex items-center justify-center shadow-[0_8px_25px_rgba(79,70,229,0.5)] border-4 border-slate-50 active:scale-90 transition-all active:shadow-indigo-500/20">
          <PlusSquare className="h-8 w-8" />
        </Link>

        <Link to="/mobile/elevators" className="flex flex-col items-center transition-all active:scale-75 group select-none">
          <Settings className="h-6 w-6 text-white/50 group-data-[status=active]:text-white" />
          <span className="text-[8px] font-black text-white/30 uppercase tracking-widest mt-1.5 group-data-[status=active]:text-indigo-400">Asset</span>
        </Link>
        <button onClick={() => setIsMenuOpen(true)} className="flex flex-col items-center transition-all active:scale-75 group select-none outline-none">
           <Menu className="h-6 w-6 text-white/50 group-active:text-white" />
           <span className="text-[8px] font-black text-white/30 uppercase tracking-widest mt-1.5 group-active:text-indigo-400">More</span>
        </button>
      </nav>
    </div>
  );
}
