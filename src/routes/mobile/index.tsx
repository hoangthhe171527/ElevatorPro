import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/layout/MobileShell";
import { useMainRole, useAppStore } from "@/lib/store";
import { 
  Briefcase, 
  Settings as SettingsIcon, 
  MapPin, 
  Clock, 
  ChevronRight,
  TrendingUp,
  AlertCircle,
  QrCode,
  LineChart,
  Users,
  CreditCard,
  Warehouse,
  Route as RouteIcon,
  Zap,
  ShieldCheck,
  FileText,
  UserPlus,
  ArrowUpRight,
  ClipboardCheck,
   FolderKanban,
   HandCoins,
   Wrench,
   CalendarDays,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/mobile/")({
  component: MobileDashboard,
});

function MobileDashboard() {
  const role = useMainRole();
  const companySize = useAppStore((s) => s.companySize);
  const setCompanySize = (size: "large" | "small") => useAppStore.getState().setCompanySize(size);

  const adminModules = [
    { label: "Approvals", icon: ClipboardCheck, color: "bg-indigo-600 text-white shadow-indigo-200", path: "/mobile/approvals", desc: "Duyệt yêu cầu ngay" },
    { label: "Accounting", icon: CreditCard, color: "bg-emerald-50 text-emerald-600", path: "/mobile/accounting", desc: "Dòng tiền & Lợi nhuận" },
    { label: "HR Admin", icon: Users, color: "bg-indigo-50 text-indigo-600", path: "/mobile/hr", desc: "Nhân sự & Chấm công" },
    { label: "Inventory", icon: Warehouse, color: "bg-amber-50 text-amber-600", path: "/mobile/inventory", desc: "Quản lý tồn kho" },
    { label: "Customers", icon: UserPlus, color: "bg-purple-50 text-purple-600", path: "/mobile/customers", desc: "CRM & Hợp đồng" },
      { label: "Projects", icon: FolderKanban, color: "bg-sky-50 text-sky-600", path: "/mobile/projects", desc: "Theo dõi dự án" },
      { label: "Leads", icon: HandCoins, color: "bg-lime-50 text-lime-600", path: "/mobile/leads", desc: "Cơ hội kinh doanh" },
    { label: "Advanced BI", icon: LineChart, color: "bg-rose-50 text-rose-600", path: "/mobile/reports", desc: "Báo cáo chuyên sâu" },
  ];

  const techModules = [
    { label: "Scanner", icon: QrCode, color: "bg-indigo-600 text-white shadow-indigo-200", path: "/mobile/scanner", desc: "Check-in thiết bị" },
      { label: "My Tasks", icon: Briefcase, color: "bg-amber-50 text-amber-600", path: "/mobile/tech/jobs/", desc: "Công việc hằng ngày" },
    { label: "Inventory", icon: Warehouse, color: "bg-slate-50 text-slate-600", path: "/mobile/inventory", desc: "Yêu cầu vật tư" },
      { label: "Schedule", icon: CalendarDays, color: "bg-cyan-50 text-cyan-600", path: "/mobile/schedule", desc: "Lịch công tác" },
    { label: "Smart Route", icon: RouteIcon, color: "bg-emerald-50 text-emerald-600", path: "/mobile/tech/route-plan", desc: "Lộ trình tối ưu" },
    { label: "Emergency", icon: Zap, color: "bg-rose-50 text-rose-600", path: "/mobile/support", desc: "Cứu hộ khẩn cấp" },
    { label: "Assets", icon: SettingsIcon, color: "bg-blue-50 text-blue-600", path: "/mobile/elevators", desc: "Tra cứu thiết bị" },
      { label: "Reports", icon: LineChart, color: "bg-violet-50 text-violet-600", path: "/mobile/reports", desc: "Hiệu suất cá nhân" },
  ];

   const customerModules = [
      { label: "Portal Home", icon: Users, color: "bg-indigo-600 text-white shadow-indigo-200", path: "/mobile/portal", desc: "Tổng quan khách hàng" },
      { label: "My Elevators", icon: SettingsIcon, color: "bg-blue-50 text-blue-600", path: "/mobile/portal/elevators", desc: "Danh sách thiết bị" },
      { label: "Contracts", icon: FileText, color: "bg-emerald-50 text-emerald-600", path: "/mobile/portal/contracts", desc: "Theo dõi hợp đồng" },
      { label: "Billing", icon: CreditCard, color: "bg-amber-50 text-amber-600", path: "/mobile/portal/billing", desc: "Thanh toán & công nợ" },
      { label: "Issue Report", icon: Wrench, color: "bg-rose-50 text-rose-600", path: "/mobile/portal/issues", desc: "Báo lỗi nhanh" },
      { label: "Emergency", icon: Zap, color: "bg-fuchsia-50 text-fuchsia-600", path: "/mobile/support", desc: "Yêu cầu khẩn cấp" },
   ];

   const modules = role === "admin" ? adminModules : role === "tech" ? techModules : customerModules;

  return (
    <MobileShell hideHeader={true}>
      <div className="flex flex-col min-h-screen bg-slate-50 font-sans pb-36">
        {/* Modern Compact Header */}
        <div className="px-6 pt-10 pb-12 bg-indigo-950 rounded-b-[2.5rem] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -mr-32 -mt-32 blur-3xl" />
          
          <div className="relative z-10 flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
               <div className="h-10 w-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                  <ShieldCheck className="h-6 w-6 text-indigo-300" />
               </div>
               <div>
                  <h1 className="text-lg font-black text-white italic tracking-tighter leading-none mb-1 uppercase">Cloud_Stack</h1>
                  <p className="text-[8px] font-bold text-indigo-400 uppercase tracking-[0.2em]">Management Suite v4.5</p>
               </div>
            </div>
            
            <div className="flex bg-black/20 backdrop-blur-xl p-1 rounded-xl border border-white/10 shadow-inner">
               <button 
                  onClick={() => setCompanySize("large")}
                  className={cn("px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all tracking-widest", companySize === "large" ? "bg-white text-indigo-950 shadow-[0_4px_12px_rgba(255,255,255,0.2)]" : "text-white/40")}
               >Large</button>
               <button 
                  onClick={() => setCompanySize("small")}
                  className={cn("px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all tracking-widest", companySize === "small" ? "bg-white text-indigo-950 shadow-[0_4px_12px_rgba(255,255,255,0.2)]" : "text-white/40")}
               >Small</button>
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-4 bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10">
             <div className="flex-1">
                <p className="text-[9px] font-bold text-indigo-300 uppercase mb-1 tracking-widest">{role === "admin" ? "Vận hành hệ thống" : "Năng suất cá nhân"}</p>
                <div className="flex items-baseline gap-2">
                   <p className="text-2xl font-black text-white italic tracking-tighter">98,2<span className="text-xs opacity-50 ml-0.5">%</span></p>
                   <div className="flex items-center text-[9px] font-bold text-emerald-400">
                      <TrendingUp className="h-3 w-3 mr-1" /> +2.4%
                   </div>
                </div>
             </div>
             <div className="w-px h-10 bg-white/10" />
             <div className="flex-1 pl-2">
                <p className="text-[9px] font-bold text-indigo-300 uppercase mb-1 tracking-widest">{role === "admin" ? "Cần phê duyệt" : "Task hoàn thành"}</p>
                <div className="flex items-center gap-2">
                    <p className="text-2xl font-black text-white italic tracking-tighter">{role === "admin" ? "03" : "12"}</p>
                    {role === "admin" && (
                        <div className="h-2 w-2 rounded-full bg-rose-500 animate-ping shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
                    )}
                </div>
             </div>
          </div>
        </div>

        {/* Action Modules Grid - Compact & Professional */}
        <div className="px-5 -mt-6 relative z-20">
          <div className="bg-white rounded-[2rem] p-5 shadow-2xl shadow-indigo-900/10 grid grid-cols-2 gap-4 border border-indigo-50">
             {modules.map((m) => (
                <Link key={m.label} to={m.path} className="group active:scale-[0.97] transition-all">
                   <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 group-hover:bg-white group-hover:border-indigo-100 group-hover:shadow-lg transition-all flex flex-col items-start gap-3">
                      <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shadow-sm border border-white/50", m.color)}>
                         <m.icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                         <h4 className="text-[12px] font-black text-slate-800 uppercase tracking-tight mb-0.5">{m.label}</h4>
                         <p className="text-[9px] font-bold text-slate-400 truncate leading-none">{m.desc}</p>
                      </div>
                   </div>
                </Link>
             ))}
          </div>
        </div>

        {/* Insights & Quick Status */}
        <section className="px-6 mt-10">
           <div className="flex items-center justify-between mb-5">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" /> Live Activity_
              </h3>
              <Link to={role === "tech" ? "/mobile/tech/jobs/" : role === "customer" ? "/mobile/portal/issues" : "/mobile/jobs"} className="text-[10px] font-black text-indigo-600 uppercase flex items-center gap-1 group">
                 Tất cả <ArrowUpRight className="h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
           </div>
           
           <div className="space-y-4">
              {[1, 2].map((i) => (
                 <Link key={i} to={role === "tech" ? "/mobile/tech/jobs/1" : role === "customer" ? "/mobile/portal/elevators/e-1" : "/mobile/jobs/1"}>
                    <Card className="p-5 border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] rounded-[1.8rem] bg-white active:scale-[0.98] transition-all flex items-center gap-4 group">
                       <div className="h-12 w-12 bg-slate-900 rounded-2xl flex flex-col items-center justify-center shadow-lg group-hover:rotate-3 transition-transform">
                          <span className="text-[8px] font-bold text-white/40 uppercase">JOB</span>
                          <span className="text-sm font-black text-white italic">#0{i}</span>
                       </div>
                       <div className="flex-1 min-w-0">
                          <h4 className="text-[13px] font-black text-slate-900 leading-tight italic truncate mb-1.5 uppercase tracking-tight">Landmark 81 - Zone B</h4>
                          <div className="flex items-center gap-3">
                             <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-50 rounded-lg">
                                <MapPin className="h-2.5 w-2.5 text-emerald-500" />
                                <span className="text-[9px] font-black text-emerald-600 uppercase tracking-tighter">Running</span>
                             </div>
                             <div className="flex items-center gap-1 px-2 py-0.5 bg-indigo-50 rounded-lg">
                                <Clock className="h-2.5 w-2.5 text-indigo-500" />
                                <span className="text-[9px] font-black text-indigo-600 uppercase tracking-tighter">15:45</span>
                             </div>
                          </div>
                       </div>
                       <ChevronRight className="h-4 w-4 text-slate-200 group-active:text-indigo-400" />
                    </Card>
                 </Link>
              ))}
           </div>
        </section>

        {/* Global Stats Footer Line */}
        <div className="px-6 mt-10 opacity-30 select-none">
           <div className="h-[2px] w-full bg-slate-200 relative mb-2">
              <div className="absolute inset-y-0 left-0 w-1/3 bg-indigo-500" />
           </div>
           <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.5em] text-center italic">Advanced Elevator Control System</p>
        </div>
      </div>
    </MobileShell>
  );
}
