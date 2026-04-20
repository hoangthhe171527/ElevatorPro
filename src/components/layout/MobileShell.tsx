import React, { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useMainRole, useCurrentUser, useCurrentPermissions, setMainRole, useAppStore } from "@/lib/store";
import { 
  Home, 
  Briefcase, 
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
  ShieldCheck
} from "lucide-react";

interface MobileShellProps {
  children: React.ReactNode;
  title?: string;
  hideHeader?: boolean;
   showBackButton?: boolean;
   backLink?: string;
}

export function MobileShell({
   children,
   title,
   hideHeader = false,
   showBackButton = false,
   backLink,
}: MobileShellProps) {
   const navigate = useNavigate();
  const role = useMainRole();
   const permissions = useCurrentPermissions();
  const user = useCurrentUser();
  const companySize = useAppStore((s) => s.companySize);
   const setCompanySize = useAppStore((s) => s.setCompanySize);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

   const availableRoles: Array<"admin" | "tech" | "customer"> = [];
   if (permissions.some((p) => ["director", "sales", "sales_maintenance", "accounting", "hr_admin", "install_mgmt", "maintenance_mgmt"].includes(p))) {
      availableRoles.push("admin");
   }
   if (permissions.some((p) => ["field_tech", "tech_survey", "maintenance_mgmt", "install_mgmt"].includes(p))) {
      availableRoles.push("tech");
   }
   if (permissions.includes("customer")) {
      availableRoles.push("customer");
   }

   const roleLabel = role === "admin" ? "Executive Admin" : role === "tech" ? "Field Engineer" : "Portal Customer";
   const homePath = role === "tech" ? "/mobile/tech/" : role === "customer" ? "/mobile/portal" : "/mobile/";
   const tasksPath = role === "tech" ? "/mobile/tech/jobs/" : role === "customer" ? "/mobile/portal/issues" : "/mobile/jobs";

  const switchRole = () => {
      if (availableRoles.length <= 1) {
         setIsMenuOpen(false);
         return;
      }

      const currentIndex = Math.max(availableRoles.indexOf(role), 0);
      const nextRole = availableRoles[(currentIndex + 1) % availableRoles.length];
    setMainRole(nextRole);
    setIsMenuOpen(false);
  };

   const switchCompanyScale = () => {
      setCompanySize(companySize === "large" ? "small" : "large");
      setIsMenuOpen(false);
   };

   const handleBack = () => {
      if (backLink) {
         navigate({ to: backLink });
         return;
      }
      window.history.back();
   };

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 font-sans relative overflow-hidden">
      {/* Header with Role Branding */}
      {!hideHeader && (
        <header className="shrink-0 bg-white/70 backdrop-blur-xl border-b border-slate-100 px-5 py-4 flex items-center justify-between shadow-sm z-[60]">
          <div className="flex items-center gap-3">
                  {showBackButton ? (
                     <button onClick={handleBack} className="h-9 w-9 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200 active:scale-95 transition-all">
                        <ChevronLeft className="h-5 w-5 text-slate-600" />
                     </button>
                  ) : (
                     <div className="h-9 w-9" />
                  )}
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
               <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] animate-in fade-in duration-300" onClick={() => setIsMenuOpen(false)} />
               <div className="absolute inset-y-0 right-0 w-[85%] max-w-[300px] bg-white z-[101] shadow-2xl flex flex-col p-0 overflow-hidden animate-in slide-in-from-right duration-500 ease-out">
             {/* Profile Header */}
             <div className="p-8 pb-10 bg-indigo-950 text-white relative overflow-hidden shrink-0">
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
                   <h3 className="text-xl font-bold tracking-tight leading-none mb-2">{user?.name || "Nguyễn Văn Director"}</h3>
                   <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/10 w-fit">
                      <Shield className="h-3.5 w-3.5 text-indigo-400" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-indigo-100">{roleLabel}</span>
                   </div>
                </div>
             </div>

             <div className="flex-1 overflow-y-auto p-6 space-y-2 no-scrollbar">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 pl-2">System Controls_</p>
                
                <button onClick={switchRole} className="w-full h-14 flex items-center gap-4 px-4 rounded-2xl hover:bg-slate-50 active:bg-slate-100 text-slate-700 transition-all border border-transparent active:border-slate-100 group shrink-0">
                   <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <ArrowRightLeft className="h-5 w-5 text-indigo-600" />
                   </div>
                   <div className="text-left">
                      <span className="block text-[12px] font-bold uppercase tracking-tight">Switch Role</span>
                      <span className="block text-[9px] font-semibold text-slate-400">{availableRoles.length > 1 ? "Chuyển vai trò kế tiếp" : "Chỉ có 1 vai trò khả dụng"}</span>
                   </div>
                </button>

                <button onClick={switchCompanyScale} className="w-full h-14 flex items-center gap-4 px-4 rounded-2xl hover:bg-slate-50 text-slate-700 transition-all group shrink-0">
                   <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Building2 className="h-5 w-5 text-emerald-600" />
                   </div>
                   <div className="text-left">
                      <span className="block text-[12px] font-bold uppercase tracking-tight">Company Scale</span>
                      <span className="block text-[9px] font-semibold text-slate-400 capitalize">{companySize} mode (tap to switch)</span>
                   </div>
                </button>

                <div className="h-6" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 pl-2">Personal_</p>
                
                <Link to="/mobile/profile" onClick={() => setIsMenuOpen(false)} className="w-full h-14 flex items-center gap-4 px-4 rounded-2xl hover:bg-slate-50 text-slate-700 transition-all group shrink-0">
                   <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Settings className="h-5 w-5 text-slate-500" />
                   </div>
                   <span className="text-[12px] font-black uppercase tracking-tighter">My Account</span>
                </Link>

                <button className="w-full h-14 flex items-center gap-4 px-4 rounded-2xl hover:bg-rose-50 text-rose-600 transition-all group mt-10 shrink-0">
                   <div className="h-10 w-10 rounded-xl bg-rose-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <LogOut className="h-5 w-5" />
                   </div>
                   <span className="text-[12px] font-black uppercase tracking-tighter underline decoration-2 underline-offset-4">End Session</span>
                </button>
             </div>

             <div className="p-8 border-t border-slate-100 flex justify-center shrink-0">
                <div className="flex flex-col items-center opacity-20">
                   <ShieldCheck className="h-8 w-8 text-slate-900 mb-2" />
                   <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.4em] italic">Encrypted Cloud_</p>
                </div>
             </div>
          </div>
        </>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto no-scrollbar pb-32">
        {children}
      </main>

      {/* Fixed Navigation Bar - Professional Rounded Design with container constraints */}
         <div className="absolute bottom-0 left-0 right-0 p-5 pointer-events-none z-50">
        <nav className="max-w-md mx-auto h-20 bg-slate-900/90 backdrop-blur-2xl rounded-[1.8rem] px-5 flex items-center justify-between pointer-events-auto shadow-[0_20px_40px_rgba(0,0,0,0.3)] border border-white/10 border-t-white/20">
               <Link to={homePath} className="flex flex-col items-center transition-all active:scale-75 group select-none">
            <Home className="h-6 w-6 text-white/50 group-data-[status=active]:text-white" />
            <span className="text-[8px] font-black text-white/30 uppercase tracking-widest mt-1.5 group-data-[status=active]:text-indigo-400">Home</span>
          </Link>
               <Link to={tasksPath} className="flex flex-col items-center transition-all active:scale-75 group select-none">
            <Briefcase className="h-6 w-6 text-white/50 group-data-[status=active]:text-white" />
                  <span className="text-[8px] font-black text-white/30 uppercase tracking-widest mt-1.5 group-data-[status=active]:text-indigo-400">{role === "customer" ? "Support" : "Tasks"}</span>
          </Link>
          
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
    </div>
  );
}
