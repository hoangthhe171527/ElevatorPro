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
  Filter,
  Activity
} from "lucide-react";
import { useCurrentUser, useMainRole, useAppStore } from "@/lib/store";

function MobileDashboard() {
  const user = useCurrentUser();
  const role = useMainRole();
  const activeJobId = useAppStore((s) => s.activeJobCheckIn);
  const activeJob = mockJobs.find(j => j.id === activeJobId);
  
  const filteredJobs = role === "tech" 
    ? mockJobs.filter(j => j.technicianId === user.id)
    : mockJobs;

  const workCenterItems = [
    { 
      to: "/mobile/jobs", 
      icon: Briefcase, 
      label: "TÁC VỤ", 
      color: "text-blue-500 bg-blue-50/50",
      roles: ["admin", "tech", "accounting"]
    },
    { 
      to: "/mobile/projects", 
      icon: Navigation, 
      label: "DỰ ÁN", 
      color: "text-indigo-500 bg-indigo-50/50",
      roles: ["admin", "tech"]
    },
    { 
      to: "/mobile/customers", 
      icon: Users, 
      label: "KHÁCH HÀNG", 
      color: "text-emerald-500 bg-emerald-50/50",
      roles: ["admin", "hr"]
    },
    { 
      to: "/mobile/reports", 
      icon: TrendingUp, 
      label: "BÁO CÁO", 
      color: "text-amber-500 bg-amber-50/50",
      roles: ["admin", "accounting"]
    },
  ].filter(item => item.roles.includes(role));

  return (
    <MobileShell title="Hệ thống">
      <div className="flex flex-col pb-36 font-sans">
        {/* Header - Engineering Style */}
        <div className="px-6 pt-10 pb-12 bg-slate-900 text-white relative overflow-hidden">
          <div className="relative z-10 flex justify-between items-start">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-indigo-400">
                <Activity className="h-3 w-3" />
                <span className="text-[10px] font-bold tracking-[0.3em] uppercase">SYSTEM ONLINE</span>
              </div>
              <h1 className="text-3xl font-black italic tracking-tighter uppercase leading-none">
                {user.name}
              </h1>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{role} mode aktif</span>
              </div>
            </div>
            <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-xl relative">
              <Bell className="h-6 w-6 text-slate-300" />
              <span className="absolute top-3 right-3 h-2.5 w-2.5 bg-rose-500 rounded-full border-2 border-slate-900" />
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        </div>

        {/* Global Action Bar */}
        <div className="px-6 -mt-7 mb-10">
            <div className="bg-white border border-slate-100 p-2.5 rounded-3xl shadow-2xl flex items-center gap-3">
                <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-2xl">
                    <Search className="h-4 w-4 text-slate-400" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic font-mono">SEARCH ENGINE_</span>
                </div>
                <div className="h-12 w-12 flex items-center justify-center bg-slate-900 rounded-2xl shadow-lg shadow-slate-200 active:scale-95 transition-transform">
                    <Filter className="h-5 w-5 text-white" />
                </div>
            </div>
        </div>

        {/* Stats Grid - Balanced Spacing */}
        <div className="grid grid-cols-2 gap-5 px-6 mb-12">
           <Card className="p-6 border-none shadow-sm rounded-[3rem] bg-indigo-50/30 border border-indigo-100/50">
             <div className="h-12 w-12 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6">
                <Clock className="h-6 w-6 text-indigo-500" />
             </div>
             <p className="text-4xl font-black text-slate-900 italic tracking-tighter mb-1 leading-none font-mono">
               {filteredJobs.filter(j => j.status === "pending").length}
             </p>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">PENDING_</p>
           </Card>
           <Card className="p-6 border-none shadow-sm rounded-[3rem] bg-emerald-50/30 border border-emerald-100/50">
             <div className="h-12 w-12 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6">
                <CheckCircle2 className="h-6 w-6 text-emerald-500" />
             </div>
             <p className="text-4xl font-black text-slate-900 italic tracking-tighter mb-1 leading-none font-mono">
                {filteredJobs.filter(j => j.status === "completed").length}
             </p>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">COMPLETED_</p>
           </Card>
        </div>

        {/* Action Grid - High Spacing */}
        {workCenterItems.length > 0 && (
          <section className="px-6 mb-14">
            <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] italic mb-8 px-1">MAIN_OPERATIONS</h3>
            <div className="grid grid-cols-4 gap-6">
              {workCenterItems.map((item, idx) => (
                <Link key={idx} to={item.to} className="group flex flex-col items-center">
                  <div className={cn("h-16 w-16 rounded-[2rem] flex items-center justify-center transition-all group-active:scale-90 border-2 border-white shadow-md group-hover:shadow-xl group-hover:-translate-y-1", item.color)}>
                    <item.icon className="h-7 w-7" />
                  </div>
                  <span className="mt-4 text-[9px] font-black text-slate-500 uppercase tracking-tighter italic group-hover:text-slate-900">{item.label}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Schedule List - Improved Card Spacing and Modern Typography */}
        <section className="px-6 space-y-8">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] italic">TODAY_SCHEDULE</h3>
            <Link to="/mobile/jobs" className="text-[10px] font-black uppercase text-indigo-500 tracking-widest border-b-2 border-indigo-100 pb-1">VIEW ALL</Link>
          </div>
          
          <div className="space-y-6">
             {filteredJobs.slice(0, 3).map((job) => (
                <Link key={job.id} to={`/mobile/jobs/${job.id}`}>
                  <Card className="p-6 border-none shadow-xl shadow-slate-100/50 rounded-[2.5rem] bg-white border border-slate-50 group active:scale-[0.98] transition-all relative overflow-hidden">
                    <div className="flex items-start gap-6">
                      <div className="h-16 w-16 rounded-2xl bg-slate-900 flex flex-col items-center justify-center shrink-0 border border-slate-800 shadow-lg group-hover:bg-indigo-600 transition-colors">
                        <span className="text-[10px] font-black text-slate-400 group-hover:text-indigo-200 uppercase tracking-widest">{formatDateTime(job.scheduledFor).split(" ")[0].split("/")[0]}</span>
                        <span className="text-lg font-black text-white uppercase italic tracking-tighter leading-none">TH{formatDateTime(job.scheduledFor).split(" ")[0].split("/")[1]}</span>
                      </div>
                      <div className="flex-1 min-w-0 pt-1">
                        <div className="flex items-center justify-between mb-3">
                          <StatusBadge variant={jobStatusVariant[job.status]} className="h-5 px-2.5 text-[8px] font-mono tracking-widest">
                            {jobStatusLabel[job.status].toUpperCase()}
                          </StatusBadge>
                          <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                        </div>
                        <h2 className="text-[15px] font-black text-slate-900 uppercase italic tracking-tight mb-4 group-hover:text-indigo-600 transition-colors leading-snug">
                          {job.title}
                        </h2>
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                          <div className="flex items-center gap-1.5 text-slate-400">
                             <Clock className="h-3.5 w-3.5 text-indigo-400" />
                             <span className="text-[10px] font-black uppercase tracking-widest italic font-mono">{formatDateTime(job.scheduledFor).split(" ")[1]}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-400">
                             <MapPin className="h-3.5 w-3.5 text-rose-400" />
                             <span className="text-[10px] font-black uppercase tracking-widest italic truncate max-w-[120px]">VINCOM CTR</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Industrial line detail */}
                    <div className="absolute bottom-0 left-0 w-1.5 h-1/2 bg-slate-100 group-hover:bg-indigo-500 transition-colors" />
                  </Card>
                </Link>
             ))}
          </div>
        </section>
      </div>
    </MobileShell>
  );
}
