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
  Activity
} from "lucide-react";
import { useCurrentUser, useMainRole } from "@/lib/store";

function MobileDashboard() {
  const user = useCurrentUser();
  const role = useMainRole();
  const filteredJobs = role === "tech" 
    ? mockJobs.filter(j => j.technicianId === user.id)
    : mockJobs;

  const workCenterItems = [
    { to: "/mobile/jobs", icon: Briefcase, label: "Tác vụ", color: "text-blue-600 bg-blue-50", roles: ["admin", "tech"] },
    { to: "/mobile/projects", icon: Navigation, label: "Dự án", color: "text-indigo-600 bg-indigo-50", roles: ["admin", "tech"] },
    { to: "/mobile/customers", icon: Users, label: "Khách", color: "text-emerald-600 bg-emerald-50", roles: ["admin", "hr"] },
    { to: "/mobile/reports", icon: TrendingUp, label: "Báo cáo", color: "text-amber-600 bg-amber-50", roles: ["admin", "accounting"] },
  ].filter(item => item.roles.includes(role));

  return (
    <MobileShell hideHeader={true}>
      <div className="flex flex-col pb-24 font-sans bg-slate-50/50 min-h-screen">
        {/* Main Content Area */}
        <div className="flex flex-col">
          {/* Stats Bar Component - Integrated */}
          <div className="px-5 pt-8 pb-10 bg-white border-b border-slate-100 rounded-b-[2rem] shadow-sm mb-6">
            <div className="flex items-center gap-3 mb-6">
               <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <Activity className="h-4 w-4 text-indigo-600" />
               </div>
               <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest italic">Hệ thống đang chạy_</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                  <Clock className="h-4 w-4 text-indigo-500" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">Chờ xử lý</p>
                  <p className="text-sm font-bold text-slate-900">{filteredJobs.filter(j => j.status === "pending").length}</p>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">Hoàn thành</p>
                  <p className="text-sm font-bold text-slate-900">{filteredJobs.filter(j => j.status === "completed").length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search - Refined & Slim */}
          <div className="px-5 mb-8">
            <div className="bg-white border border-slate-100 p-1.5 rounded-2xl shadow-lg flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-100">
                <Search className="h-3.5 w-3.5 text-slate-400" />
                <input placeholder="Tìm nhanh..." className="bg-transparent border-none text-xs focus:ring-0 w-full" />
              </div>
              <button className="h-9 w-9 flex items-center justify-center bg-slate-900 rounded-xl active:scale-95 transition-transform shadow-md">
                <Filter className="h-4 w-4 text-white" />
              </button>
            </div>
          </div>

          {/* App Grid - Simple Icons */}
          <section className="px-5 mb-8">
            <div className="grid grid-cols-4 gap-4">
              {workCenterItems.map((item, idx) => (
                <Link key={idx} to={item.to} className="flex flex-col items-center group">
                  <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center mb-2 shadow-sm border border-white group-active:scale-90 transition-all", item.color)}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-600 tracking-tight">{item.label}</span>
                </Link>
              ))}
            </div>
          </section>

          {/* Job List - Low Profile */}
          <section className="px-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Lịch trình hôm nay</h3>
              <Link to="/mobile/jobs" className="text-[10px] font-bold text-indigo-600">XEM HẾT</Link>
            </div>
            
            <div className="space-y-3">
               {filteredJobs.slice(0, 3).map((job) => (
                  <Link key={job.id} to={`/mobile/jobs/${job.id}`}>
                    <Card className="p-4 border border-slate-100 shadow-sm rounded-2xl bg-white active:scale-[0.98] transition-all flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-slate-50 flex flex-col items-center justify-center shrink-0 border border-slate-100">
                        <span className="text-[8px] font-bold text-slate-400 uppercase">{formatDateTime(job.scheduledFor).split(" ")[1]}</span>
                        <span className="text-xs font-bold text-slate-900">{formatDateTime(job.scheduledFor).split(" ")[0].split("/")[0]}/{formatDateTime(job.scheduledFor).split(" ")[0].split("/")[1]}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <StatusBadge variant={jobStatusVariant[job.status]} className="h-4 px-1.5 text-[7px] font-bold uppercase tracking-tighter">
                            {jobStatusLabel[job.status]}
                          </StatusBadge>
                        </div>
                        <h2 className="text-[13px] font-bold text-slate-900 truncate mb-1">
                          {job.title}
                        </h2>
                        <div className="flex items-center gap-3 text-slate-400">
                           <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span className="text-[10px] font-medium truncate max-w-[100px]">Vincom Center</span>
                           </div>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-300 shrink-0" />
                    </Card>
                  </Link>
               ))}
            </div>
          </section>
        </div>
      </div>
    </MobileShell>
  );
}
