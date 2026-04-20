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
  Search,
  Filter
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
      color: "text-blue-500 bg-blue-50/50",
      roles: ["admin", "tech", "accounting"]
    },
    { 
      to: "/mobile/projects", 
      icon: Navigation, 
      label: "Dự án", 
      color: "text-indigo-500 bg-indigo-50/50",
      roles: ["admin", "tech"]
    },
    { 
      to: "/mobile/customers", 
      icon: Users, 
      label: "CRM", 
      color: "text-emerald-500 bg-emerald-50/50",
      roles: ["admin", "hr"]
    },
    { 
      to: "/mobile/reports", 
      icon: TrendingUp, 
      label: "Báo cáo", 
      color: "text-amber-500 bg-amber-50/50",
      roles: ["admin", "accounting"]
    },
  ].filter(item => item.roles.includes(role));

  return (
    <MobileShell title="Hệ thống">
      <div className="flex flex-col pb-32">
        {/* Modern Welcome Header */}
        <div className="px-6 pt-8 pb-10 bg-gradient-to-b from-slate-50/50 to-transparent">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-1 italic">Dashboard</p>
              <h1 className="text-2xl font-black text-slate-900 leading-tight uppercase italic tracking-tight">
                {user.name}
              </h1>
              <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-900 text-[8px] font-black text-white uppercase tracking-widest mt-1">
                {role} account
              </div>
            </div>
            <div className="relative group active:scale-95 transition-transform">
               <div className="h-12 w-12 rounded-[1.25rem] bg-white shadow-sm border border-slate-100 flex items-center justify-center">
                  <Bell className="h-5 w-5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                  <span className="absolute top-0 right-0 h-3.5 w-3.5 bg-rose-500 border-2 border-white rounded-full"></span>
               </div>
            </div>
          </div>
        </div>

        {/* Global Action Bar */}
        <div className="px-6 -mt-6 mb-8">
            <div className="bg-white/80 backdrop-blur-md border border-slate-100 p-2 rounded-[2rem] shadow-xl shadow-slate-200/50 flex items-center gap-2">
                <div className="flex-1 flex items-center gap-3 px-4 py-2 bg-slate-50/50 rounded-2xl">
                    <Search className="h-4 w-4 text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider italic">Tìm kiếm nhanh...</span>
                </div>
                <div className="h-10 w-10 flex items-center justify-center bg-slate-900 rounded-2xl shadow-lg shadow-slate-200">
                    <Filter className="h-4 w-4 text-white" />
                </div>
            </div>
        </div>

        {/* Active Session Banner (Technician Only) - Redesigned */}
        {role === "tech" && activeJob && (
          <div className="mx-6 mb-8">
            <Link to={`/mobile/jobs/${activeJob.id}`}>
              <Card className="bg-slate-900 p-5 border-none shadow-2xl shadow-indigo-200 rounded-[2.5rem] flex items-center justify-between group overflow-hidden relative border border-slate-800">
                <div className="relative z-10 flex items-center gap-5">
                  <div className="h-12 w-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                    <Zap className="h-6 w-6 text-indigo-400 animate-pulse" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-indigo-400 tracking-[0.15em] leading-none mb-1.5 italic">Đang thi công</p>
                    <p className="text-sm font-black text-white uppercase italic tracking-tight">{activeJob.title}</p>
                  </div>
                </div>
                <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center relative z-10 group-hover:bg-white/10 transition-colors">
                    <ChevronRight className="h-5 w-5 text-white/50 group-hover:text-white transition-transform group-hover:translate-x-0.5" />
                </div>
                <div className="absolute right-0 top-0 w-48 h-48 bg-indigo-600/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl" />
              </Card>
            </Link>
          </div>
        )}

        {/* Stats Grid - Larger and More Balanced */}
        <div className="grid grid-cols-2 gap-4 px-6 mb-8">
           <Card className="p-6 border-none shadow-sm rounded-[2.5rem] bg-white border border-slate-50">
             <div className="flex justify-between items-start mb-6">
                <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center">
                   <Clock className="h-6 w-6 text-indigo-500" />
                </div>
                <div className="px-2 py-0.5 rounded-lg bg-indigo-50 text-[8px] font-black text-indigo-500 uppercase italic">+12%</div>
             </div>
             <p className="text-3xl font-black text-slate-900 leading-none italic mb-2 tracking-tighter">
               {filteredJobs.filter(j => j.status === "pending").length}
             </p>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Công việc chờ</p>
           </Card>
           <Card className="p-6 border-none shadow-sm rounded-[2.5rem] bg-white border border-slate-50">
             <div className="flex justify-between items-start mb-6">
                <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
                   <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                </div>
                <div className="px-2 py-0.5 rounded-lg bg-emerald-50 text-[8px] font-black text-emerald-500 uppercase italic">MTD</div>
             </div>
             <p className="text-3xl font-black text-slate-900 leading-none italic mb-2 tracking-tighter">
                {filteredJobs.filter(j => j.status === "completed").length}
             </p>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Hoàn thành</p>
           </Card>
        </div>

        {/* Work Center - Polished UI */}
        {workCenterItems.length > 0 && (
          <section className="px-6 mb-10">
            <div className="flex items-center justify-between mb-6 px-1">
               <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] italic">Trung tâm công việc</h3>
            </div>
            <div className="grid grid-cols-4 gap-4 text-center">
              {workCenterItems.map((item, idx) => (
                <Link key={idx} to={item.to} className="group">
                  <div className={cn("h-14 w-14 mx-auto rounded-3xl flex items-center justify-center transition-all group-active:scale-95 shadow-sm border border-white/50 group-hover:shadow-md", item.color)}>
                    <item.icon className="h-6 w-6" />
                  </div>
                  <span className="mt-3 block text-[10px] font-black text-slate-600 uppercase tracking-tighter group-hover:text-slate-900 transition-colors uppercase italic">{item.label}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Recent Schedule - Modern List UI */}
        <section className="px-6 space-y-6">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] italic">Lịch trình hôm nay</h3>
            <Link to="/mobile/jobs" className="text-[10px] font-black uppercase text-indigo-600 tracking-wider">Xem tất cả</Link>
          </div>
          
          <div className="space-y-4">
             {filteredJobs.slice(0, 3).map((job) => (
                <Link key={job.id} to={`/mobile/jobs/${job.id}`}>
                  <Card className="p-5 border-none shadow-sm hover:shadow-md group active:bg-slate-50 transition-all rounded-[2rem] bg-white border border-slate-50">
                    <div className="flex items-center gap-5">
                      <div className="h-14 w-14 rounded-2xl bg-slate-50 flex flex-col items-center justify-center shrink-0 border border-slate-100 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors">
                        <span className="text-[9px] font-black text-slate-400 group-hover:text-indigo-400 uppercase tracking-widest">{formatDateTime(job.scheduledFor).split(" ")[0].split("/")[0]}</span>
                        <span className="text-sm font-black text-slate-700 group-hover:text-indigo-700 uppercase leading-none tracking-tighter italic">TH{formatDateTime(job.scheduledFor).split(" ")[0].split("/")[1]}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-[12px] font-black text-slate-900 uppercase truncate pr-2 italic tracking-tight">{job.title}</p>
                          <StatusBadge variant={jobStatusVariant[job.status]} className="h-4.5 px-2 text-[8px]">
                            {jobStatusLabel[job.status]}
                          </StatusBadge>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1.5 text-slate-400 group-hover:text-slate-500 transition-colors">
                             <Clock className="h-3 w-3" />
                             <span className="text-[9px] font-black uppercase tracking-wider italic">{formatDateTime(job.scheduledFor).split(" ")[1]}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-400 group-hover:text-slate-500 transition-colors">
                             <MapPin className="h-3 w-3" />
                             <span className="text-[9px] font-black uppercase tracking-wider truncate max-w-[120px] italic">Vincom Center</span>
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
