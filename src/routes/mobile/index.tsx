import { createFileRoute, Link } from "@tanstack/react-router";
export const Route = createFileRoute("/mobile/")({
  head: () => ({ meta: [{ title: "Dashboard — ElevatorPro" }] }),
  component: MobileDashboard,
});

import { MobileShell } from "@/components/layout/MobileShell";
import { cn } from "@/lib/utils";
import {
  mockJobs,
  formatDateTime,
} from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/common/StatusBadge";
import { jobStatusLabel, jobStatusVariant } from "@/lib/status-variants";
import {
  Briefcase,
  ChevronRight,
  TrendingUp,
  Clock,
  MapPin,
  Users,
  Navigation,
  CheckCircle2,
  Search,
  Filter,
  Activity,
  Scan,
  LayoutGrid,
  ShieldCheck,
  CreditCard,
  FileText,
  Package,
  Calendar,
  Settings2
} from "lucide-react";
import { useCurrentUser, useMainRole } from "@/lib/store";

function MobileDashboard() {
  const user = useCurrentUser();
  const role = useMainRole();
  const filteredJobs = role === "tech" 
    ? mockJobs.filter(j => j.technicianId === user.id)
    : mockJobs;

  const adminModules = [
    { to: "/mobile/jobs", icon: Briefcase, label: "Công việc", color: "text-blue-600 bg-blue-50" },
    { to: "/mobile/projects", icon: Navigation, label: "Dự án", color: "text-indigo-600 bg-indigo-50" },
    { to: "/mobile/customers", icon: Users, label: "Khách hàng", color: "text-emerald-600 bg-emerald-50" },
    { to: "/mobile/accounting", icon: CreditCard, label: "Tài chính", color: "text-amber-600 bg-amber-50" },
    { to: "/mobile/inventory", icon: Package, label: "Kho vận", color: "text-purple-600 bg-purple-50" },
    { to: "/mobile/hr", icon: ShieldCheck, label: "Nhân sự", color: "text-rose-600 bg-rose-50" },
    { to: "/mobile/approvals", icon: CheckCircle2, label: "Phê duyệt", color: "text-cyan-600 bg-cyan-50" },
    { to: "/mobile/reports", icon: TrendingUp, label: "Thống kê", color: "text-slate-600 bg-slate-50" },
  ];

  const techModules = [
    { to: "/mobile/jobs", icon: Briefcase, label: "Việc hôm nay", color: "text-blue-600 bg-blue-50" },
    { to: "/mobile/tech/route-plan", icon: Navigation, label: "Lộ trình", color: "text-indigo-600 bg-indigo-50" },
    { to: "/mobile/scanner", icon: Scan, label: "Quét QR", color: "text-emerald-600 bg-emerald-50" },
    { to: "/mobile/inventory", icon: Package, label: "Lấy linh kiện", color: "text-amber-600 bg-amber-50" },
    { to: "/mobile/schedule", icon: Calendar, label: "Lịch trực", color: "text-purple-600 bg-purple-50" },
    { to: "/mobile/reports", icon: FileText, label: "Báo cáo", color: "text-rose-600 bg-rose-50" },
  ];

  const modules = role === "admin" ? adminModules : techModules;

  return (
    <MobileShell hideHeader={true}>
      <div className="flex flex-col pb-32 font-sans bg-slate-50/50 min-h-screen">
        {/* Modern Header / Greeting */}
        <div className="px-6 pt-10 pb-12 bg-indigo-900 rounded-b-[2.5rem] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-800/20 rounded-full -mr-24 -mt-24 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/10 rounded-full -ml-16 -mb-16 blur-2xl" />
          
          <div className="relative z-10 flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center overflow-hidden">
                <img src={user?.avatar || "v5"} className="h-full w-full object-cover opacity-80" alt="avatar" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest leading-none mb-1">Chào buổi sáng</p>
                <h1 className="text-lg font-black text-white leading-none italic">{user?.name || "Kỹ thuật viên"}</h1>
              </div>
            </div>
            <button className="h-10 w-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white active:scale-90 transition-all">
              <Settings2 className="h-5 w-5 opacity-70" />
            </button>
          </div>

          <div className="relative z-10 grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-7 w-7 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <Activity className="h-4 w-4 text-emerald-400" />
                </div>
                <span className="text-[9px] font-bold text-white/60 uppercase">Hiệu suất</span>
              </div>
              <p className="text-xl font-black text-white italic tracking-tight">98%</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-7 w-7 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-amber-400" />
                </div>
                <span className="text-[9px] font-bold text-white/60 uppercase">Việc chờ</span>
              </div>
              <p className="text-xl font-black text-white italic tracking-tight">{filteredJobs.filter(j => j.status === "pending").length}</p>
            </div>
          </div>
        </div>

        {/* Search - High End */}
        <div className="px-6 -mt-6 mb-8 relative z-20">
          <div className="bg-white p-2 rounded-2xl shadow-xl shadow-indigo-900/5 ring-1 ring-slate-200/50 flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
              <Search className="h-4 w-4 text-slate-400" />
              <input placeholder="Tìm kiếm hệ thống..." className="bg-transparent border-none text-[13px] font-medium focus:ring-0 w-full text-slate-900" />
            </div>
            <button className="h-10 w-10 flex items-center justify-center bg-indigo-600 rounded-xl active:scale-95 transition-all shadow-lg shadow-indigo-600/20">
              <Scan className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>

        {/* Dynamic Modules Grid */}
        <section className="px-6 mb-10">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Trung tâm điều hành</h3>
            <LayoutGrid className="h-4 w-4 text-slate-300" />
          </div>
          <div className="grid grid-cols-4 gap-y-6 gap-x-4">
            {modules.map((item, idx) => (
              <Link key={idx} to={item.to} className="flex flex-col items-center group">
                <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center mb-2.5 shadow-md border border-white group-active:scale-90 transition-all", item.color)}>
                  <item.icon className="h-6 w-6" />
                </div>
                <span className="text-[10px] font-bold text-slate-700 tracking-tight text-center leading-tight">{item.label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Priority Timeline */}
        <section className="px-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
               <div className="w-1.5 h-4 bg-indigo-600 rounded-full" />
               <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Việc ưu tiên</h3>
            </div>
            <Link to="/mobile/jobs" className="text-[10px] font-black text-indigo-600 italic border-b-2 border-indigo-100 pb-0.5">XEM TẤT CẢ</Link>
          </div>
          
          <div className="space-y-4">
             {filteredJobs.slice(0, 3).map((job) => (
                <Link key={job.id} to={`/mobile/jobs/${job.id}`}>
                  <Card className="p-4 border border-slate-100 shadow-sm rounded-[1.5rem] bg-white active:scale-[0.98] transition-all flex items-center gap-4 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 h-full w-1 bg-slate-100 group-hover:bg-indigo-400 transition-colors" />
                    <div className="h-12 w-12 rounded-xl bg-slate-50 flex flex-col items-center justify-center shrink-0 border border-slate-100">
                      <span className="text-[8px] font-bold text-slate-400 uppercase">{formatDateTime(job.scheduledFor).split(" ")[1]}</span>
                      <span className="text-sm font-black text-slate-900 italic leading-none mt-0.5">{formatDateTime(job.scheduledFor).split(" ")[0].split("/")[0]}</span>
                      <span className="text-[8px] font-bold text-slate-500 uppercase">Th.{formatDateTime(job.scheduledFor).split(" ")[0].split("/")[1]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <StatusBadge variant={jobStatusVariant[job.status]} className="h-4 px-2 text-[7px] font-black uppercase tracking-widest border-none shadow-sm">
                          {jobStatusLabel[job.status]}
                        </StatusBadge>
                        <span className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter">JOB-{job.id.slice(0, 4)}</span>
                      </div>
                      <h2 className="text-[14px] font-black text-slate-900 truncate mb-1.5 italic leading-tight">
                        {job.title}
                      </h2>
                      <div className="flex items-center gap-3 text-slate-400">
                         <div className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-50 rounded-md border border-slate-100">
                            <MapPin className="h-2.5 w-2.5 text-slate-400" />
                            <span className="text-[9px] font-bold text-slate-500 truncate max-w-[120px]">VINCOM CTR B</span>
                         </div>
                      </div>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0 ring-1 ring-slate-100">
                       <ChevronRight className="h-4 w-4 text-slate-400" />
                    </div>
                  </Card>
                </Link>
             ))}
          </div>
        </section>
      </div>
    </MobileShell>
  );
}
