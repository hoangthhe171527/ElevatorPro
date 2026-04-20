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
  Zap
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
    { label: "Tài chính", icon: CreditCard, color: "bg-emerald-50 text-emerald-600", path: "/mobile/accounting" },
    { label: "Nhân sự", icon: Users, color: "bg-indigo-50 text-indigo-600", path: "/mobile/hr" },
    { label: "Kho vận", icon: Warehouse, color: "bg-amber-50 text-amber-600", path: "/mobile/inventory" },
    { label: "Dự án", icon: SettingsIcon, color: "bg-blue-50 text-blue-600", path: "/mobile/projects" },
    { label: "Khách hàng", icon: Users, color: "bg-purple-50 text-purple-600", path: "/mobile/customers" },
    { label: "Báo cáo", icon: LineChart, color: "bg-rose-50 text-rose-600", path: "/mobile/reports" },
  ];

  const techModules = [
    { label: "Quét QR", icon: QrCode, color: "bg-indigo-600 text-white", path: "/mobile/scanner" },
    { label: "Lộ trình", icon: RouteIcon, color: "bg-emerald-50 text-emerald-600", path: "/mobile/tech/route-plan" },
    { label: "Công việc", icon: Briefcase, color: "bg-amber-50 text-amber-600", path: "/mobile/jobs" },
    { label: "Thiết bị", icon: SettingsIcon, color: "bg-blue-50 text-blue-600", path: "/mobile/elevators" },
    { label: "Vật tư", icon: Warehouse, color: "bg-slate-50 text-slate-600", path: "/mobile/inventory" },
    { label: "Hỗ trợ", icon: Zap, color: "bg-rose-50 text-rose-600", path: "/mobile/support" },
  ];

  const modules = role === "admin" ? adminModules : techModules;

  return (
    <MobileShell hideHeader={true}>
      <div className="flex flex-col min-h-screen bg-slate-50 font-sans pb-32">
        {/* Premium Header with Company Switcher */}
        <div className="px-6 pt-12 pb-14 bg-indigo-900 rounded-b-[3rem] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
          
          <div className="relative z-10 flex justify-between items-start mb-8">
            <div>
              <p className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em] mb-1">Hệ thống quản lý</p>
              <h1 className="text-2xl font-black text-white italic tracking-tighter leading-none">Elevator_Pro</h1>
            </div>
            <div className="flex bg-white/10 backdrop-blur-md p-1 rounded-xl border border-white/20">
               <button 
                  onClick={() => setCompanySize("large")}
                  className={cn("px-3 py-1 rounded-lg text-[9px] font-black uppercase transition-all", companySize === "large" ? "bg-white text-indigo-900 shadow-lg" : "text-white/60")}
               >Large</button>
               <button 
                  onClick={() => setCompanySize("small")}
                  className={cn("px-3 py-1 rounded-lg text-[9px] font-black uppercase transition-all", companySize === "small" ? "bg-white text-indigo-900 shadow-lg" : "text-white/60")}
               >Small</button>
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-2 gap-4">
             <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-xl">
                <div className="flex items-center gap-2 mb-2">
                   <TrendingUp className="h-4 w-4 text-emerald-400" />
                   <span className="text-[9px] font-bold text-white/70 uppercase">Hiệu suất</span>
                </div>
                <p className="text-xl font-black text-white italic">98.2%</p>
             </div>
             <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-xl">
                <div className="flex items-center gap-2 mb-2">
                   <AlertCircle className="h-4 w-4 text-amber-400" />
                   <span className="text-[9px] font-bold text-white/70 uppercase">Cần xử lý</span>
                </div>
                <p className="text-xl font-black text-white italic">04 <span className="text-[10px] uppercase font-bold text-white/50 not-italic ml-1">Jobs</span></p>
             </div>
          </div>
        </div>

        {/* Dynamic Module Grid */}
        <div className="px-6 -mt-8 relative z-20">
          <div className="bg-white rounded-[2.5rem] p-6 shadow-xl shadow-slate-900/5 grid grid-cols-3 gap-y-8 gap-x-4 border border-slate-100">
             {modules.map((m) => (
                <Link key={m.label} to={m.path} className="flex flex-col items-center group active:scale-90 transition-all">
                   <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center mb-2 shadow-sm border border-transparent transition-all group-hover:shadow-md", m.color)}>
                      <m.icon className="h-6 w-6" />
                   </div>
                   <span className="text-[10px] font-black text-slate-800 uppercase tracking-tight text-center leading-tight">{m.label}</span>
                </Link>
             ))}
          </div>
        </div>

        {/* Recent Jobs Section */}
        <section className="px-6 mt-10">
           <div className="flex items-center justify-between mb-5">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Nhiệm vụ gần đây</h3>
              <ChevronRight className="h-4 w-4 text-slate-300" />
           </div>
           
           <div className="space-y-3">
              {[1, 2].map((i) => (
                 <Card key={i} className="p-4 border-slate-100 shadow-sm rounded-2xl active:scale-[0.98] transition-all flex items-center gap-4">
                    <div className="h-12 w-12 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 italic font-black text-indigo-600">#0{i}</div>
                    <div className="flex-1 min-w-0">
                       <h4 className="text-[13px] font-black text-slate-900 leading-tight italic truncate mb-1 uppercase tracking-tight">Bảo trì định kỳ - Landmark 81</h4>
                       <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                             <MapPin className="h-3 w-3 text-slate-400" />
                             <span className="text-[10px] font-medium text-slate-500 uppercase">Q. Bình Thạnh</span>
                          </div>
                          <div className="flex items-center gap-1">
                             <Clock className="h-3 w-3 text-slate-400" />
                             <span className="text-[10px] font-medium text-slate-500">03:45 PM</span>
                          </div>
                       </div>
                    </div>
                 </Card>
              ))}
           </div>
        </section>
      </div>
    </MobileShell>
  );
}
