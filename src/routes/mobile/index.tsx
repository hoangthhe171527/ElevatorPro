import { createFileRoute, Link } from "@tanstack/react-router";
export const Route = createFileRoute("/mobile/")({
  head: () => ({ meta: [{ title: "Mobile Dashboard — ElevatorPro" }] }),
  component: MobileDashboard,
});

import { MobileShell } from "@/components/layout/MobileShell";
import { cn } from "@/lib/utils";
import {
  mockJobs,
  mockProjects,
  mockContracts,
  mockRequests,
  mockLeads,
  mockInventory,
  formatVND,
  formatDateTime,
  getCustomer,
} from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { jobStatusLabel, jobStatusVariant, leadStatusLabel, leadStatusVariant } from "@/lib/status-variants";
import {
  Briefcase,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  Clock,
  MapPin,
  CreditCard,
  Users,
  Bell,
  ArrowUpRight,
  Zap,
  Navigation,
  Package,
  Calendar,
  CheckCircle2,
  DollarSign,
} from "lucide-react";
import { useCurrentUser, useMainRole, useAppStore } from "@/lib/store";

function MobileDashboard() {
  const user = useCurrentUser();
  const role = useMainRole();
  const activeJobId = useAppStore((s) => s.activeJobCheckIn);
  const activeJob = mockJobs.find(j => j.id === activeJobId);
  
  const pendingApprovals = mockRequests.filter((r) => r.status === "pending");

  // Filter Jobs based on role
  const filteredJobs = role === "tech" 
    ? mockJobs.filter(j => j.technicianId === user.id)
    : mockJobs;

  // Navigation Items with Role-based Visibility
  const workCenterItems = [
    { 
      to: "/mobile/jobs", 
      icon: Briefcase, 
      label: "Tác vụ", 
      color: "text-blue-500 bg-blue-50",
      roles: ["admin", "tech", "accounting"]
    },
    { 
      to: "/mobile/projects", 
      icon: Navigation, 
      label: "Dự án", 
      color: "text-indigo-500 bg-indigo-50",
      roles: ["admin", "tech"]
    },
    { 
      to: "/mobile/customers", 
      icon: Users, 
      label: "CRM", 
      color: "text-emerald-500 bg-emerald-50",
      roles: ["admin", "hr"]
    },
    { 
      to: "/mobile/reports", 
      icon: TrendingUp, 
      label: "Báo cáo", 
      color: "text-amber-500 bg-amber-50",
      roles: ["admin", "accounting"]
    },
  ].filter(item => item.roles.includes(role));

  return (
    <MobileShell title="Hệ thống">
      <div className="flex flex-col gap-6 pb-24">
        {/* Welcome Header */}
        <div className="px-6 pt-4 flex justify-between items-center">
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1 italic">Chào buổi sáng</p>
            <h1 className="text-2xl font-black text-slate-900 leading-tight uppercase italic">{user.name}</h1>
          </div>
          <div className="relative">
             <div className="h-12 w-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center">
                <Bell className="h-5 w-5 text-slate-400" />
                <span className="absolute top-0 right-0 h-3 w-3 bg-rose-500 border-2 border-white rounded-full"></span>
             </div>
          </div>
        </div>

        {/* Active Session Banner (Technician Only) */}
        {role === "tech" && activeJob && (
          <div className="mx-6">
            <Link to={`/mobile/jobs/${activeJob.id}`}>
              <Card className="bg-indigo-600 p-4 border-none shadow-xl shadow-indigo-100 rounded-[2rem] flex items-center justify-between group overflow-hidden relative">
                <div className="relative z-10 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                    <Zap className="h-5 w-5 text-white animate-pulse" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase text-indigo-200 tracking-widest leading-none mb-1">Đang thực hiện</p>
                    <p className="text-xs font-black text-white uppercase italic">{activeJob.title}</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-white group-hover:translate-x-1 transition-transform relative z-10" />
                <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2" />
              </Card>
            </Link>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 px-6">
           <Card className="p-5 border-none shadow-sm rounded-[2.5rem] bg-indigo-50/50">
             <div className="flex justify-between items-start mb-4">
                <div className="h-10 w-10 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                   <Clock className="h-5 w-5 text-indigo-500" />
                </div>
                <span className="text-[10px] font-black text-indigo-500 uppercase italic">+12%</span>
             </div>
             <p className="text-2xl font-black text-slate-900 leading-none italic mb-1">{filteredJobs.filter(j => j.status === "pending").length}</p>
             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Đang chờ</p>
           </Card>
           <Card className="p-5 border-none shadow-sm rounded-[2.5rem] bg-emerald-50/50">
             <div className="flex justify-between items-start mb-4">
                <div className="h-10 w-10 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                   <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                </div>
                <span className="text-[10px] font-black text-emerald-500 uppercase italic">+5</span>
             </div>
             <p className="text-2xl font-black text-slate-900 leading-none italic mb-1">{filteredJobs.filter(j => j.status === "completed").length}</p>
             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Hoàn thành</p>
           </Card>
        </div>

        {/* Work Center - Filtered by Role */}
        {workCenterItems.length > 0 && (
          <section className="px-6">
            <div className="flex items-center justify-between mb-4 px-1">
               <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Trung tâm công việc</h3>
            </div>
            <div className="grid grid-cols-4 gap-3 text-center">
              {workCenterItems.map((item, idx) => (
                <Link key={idx} to={item.to} className="flex flex-col items-center gap-2">
                  <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center transition-transform active:scale-90 shadow-sm", item.color)}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">{item.label}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Recent Schedule (Context sensitive) */}
        <section className="px-6 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Lịch trình hôm nay</h3>
            <Link to="/mobile/jobs" className="text-[9px] font-black uppercase text-indigo-500">Xem tất cả</Link>
          </div>
          
          <div className="space-y-3">
             {filteredJobs.slice(0, 3).map((job) => (
                <Link key={job.id} to={`/mobile/jobs/${job.id}`}>
                  <Card className="p-4 border-none shadow-sm group active:bg-slate-50 transition-colors rounded-3xl">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-slate-50 flex flex-col items-center justify-center shrink-0 border border-slate-100">
                        <span className="text-[10px] font-black text-slate-400 uppercase">{formatDateTime(job.scheduledFor).split(" ")[0].split("/")[0]}</span>
                        <span className="text-xs font-black text-slate-700 uppercase leading-none">TH{formatDateTime(job.scheduledFor).split(" ")[0].split("/")[1]}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <p className="text-[11px] font-black text-slate-900 uppercase truncate pr-4 italic">{job.title}</p>
                          <StatusBadge variant={jobStatusVariant[job.status]} className="h-4 px-1.5 text-[8px]">
                            {jobStatusLabel[job.status]}
                          </StatusBadge>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1 text-slate-400">
                             <Clock className="h-3 w-3" />
                             <span className="text-[9px] font-bold uppercase">{formatDateTime(job.scheduledFor).split(" ")[1]}</span>
                          </div>
                          <div className="flex items-center gap-1 text-slate-400">
                             <MapPin className="h-3 w-3" />
                             <span className="text-[9px] font-bold uppercase truncate max-w-[100px]">Vincom Center</span>
                          </div>
                        </div>
                      </div>
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
