import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/layout/MobileShell";
import { cn } from "@/lib/utils";
import {
  mockJobs,
  mockContracts,
  mockElevators,
  mockRequests,
  formatVND,
  formatDateTime,
  getCustomer,
} from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  jobStatusLabel,
  jobStatusVariant,
} from "@/lib/status-variants";
import {
  Briefcase,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  Clock,
  MapPin,
  LucideIcon,
  CreditCard,
  Users,
  Bell,
  ArrowUpRight,
} from "lucide-react";
import { useCurrentUser } from "@/lib/store";

export const Route = createFileRoute("/mobile/")({
  head: () => ({ meta: [{ title: "Mobile Dashboard — ElevatorPro" }] }),
  component: MobileDashboard,
});

function MobileDashboard() {
  const activeJobs = mockJobs.filter((j) => j.status === "in_progress" || j.status === "scheduled");
  const urgentJobs = mockJobs.filter((j) => j.priority === "urgent").slice(0, 2);
  const pendingApprovals = mockRequests.filter((r) => r.status === "pending");
  const totalRevenue = mockContracts.reduce((s, c) => s + c.paid, 0);
  const user = useCurrentUser();

  return (
    <MobileShell title="Trung tâm điều hành">
      <div className="flex flex-col pb-24">
        {/* User Welcome Section - Premium Header */}
        <div className="px-6 py-8 bg-white flex items-center justify-between border-b border-slate-50">
          <div className="flex items-center gap-4">
             <div className="h-16 w-16 rounded-[2rem] bg-primary/5 p-1.5 border border-primary/10">
                <div className="h-full w-full rounded-[1.5rem] bg-primary flex items-center justify-center font-black text-white text-2xl shadow-xl shadow-primary/30">
                  {user?.name[0]}
                </div>
             </div>
             <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Welcome back,</p>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">{user?.name}</h2>
             </div>
          </div>
          <Link to="/mobile/approvals">
            <Button variant="ghost" size="icon" className="h-14 w-14 rounded-3xl bg-slate-50 text-slate-400 border border-slate-100 relative group">
                <Bell className="h-6 w-6 group-hover:text-primary transition-colors" />
                {pendingApprovals.length > 0 && (
                    <div className="absolute top-4 right-4 h-3 w-3 bg-rose-500 rounded-full border-[3px] border-white animate-pulse" />
                )}
            </Button>
          </Link>
        </div>

        <div className="p-6 space-y-8">
            {/* Main Stats - Large Banner Style */}
            <div className="bg-slate-900 rounded-[2.5rem] p-6 relative overflow-hidden shadow-2xl shadow-slate-900/40">
                <div className="relative z-10">
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">Doanh thu hệ thống</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-black text-white leading-none">{formatVND(totalRevenue)}</h3>
                        <div className="bg-emerald-500/20 text-emerald-400 text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                            <ArrowUpRight className="h-2.5 w-2.5" /> +12.5%
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mt-8">
                        <Link to="/mobile/accounting" className="bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <CreditCard className="h-4 w-4 text-primary" />
                                <ChevronRight className="h-3 w-3 text-white/20" />
                            </div>
                            <p className="text-[9px] font-black text-white/50 uppercase tracking-tight">Kế toán</p>
                            <p className="text-xs font-black text-white mt-0.5">Quản lý dòng tiền</p>
                        </Link>
                        <Link to="/mobile/approvals" className="bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <AlertTriangle className="h-4 w-4 text-amber-400" />
                                <ChevronRight className="h-3 w-3 text-white/20" />
                            </div>
                            <p className="text-[9px] font-black text-white/50 uppercase tracking-tight">Phê duyệt</p>
                            <p className="text-xs font-black text-white mt-0.5">{pendingApprovals.length} Yêu cầu mới</p>
                        </Link>
                    </div>
                </div>
                {/* Visual Flair */}
                <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
            </div>

            {/* Core Modules Grid */}
            <section>
                <div className="flex items-center justify-between mb-4">
                   <h3 className="text-[11px] font-black uppercase text-slate-400 tracking-[0.1em]">Module nghiệp vụ</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <Link to="/mobile/jobs">
                        <Card className="p-4 border-none shadow-sm bg-white rounded-3xl hover:bg-slate-50 transition-colors active:scale-95">
                            <div className="h-10 w-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 mb-3">
                                <Briefcase className="h-5 w-5" />
                            </div>
                            <p className="text-xs font-black text-slate-900">Điều hành</p>
                            <p className="text-[10px] font-bold text-slate-400 mt-0.5">Lộ trình & Công việc</p>
                        </Card>
                    </Link>
                    <Link to="/mobile/customers">
                        <Card className="p-4 border-none shadow-sm bg-white rounded-3xl hover:bg-slate-50 transition-colors active:scale-95">
                            <div className="h-10 w-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500 mb-3">
                                <Users className="h-5 w-5" />
                            </div>
                            <p className="text-xs font-black text-slate-900">Khách hàng</p>
                            <p className="text-[10px] font-bold text-slate-400 mt-0.5">CRM & Assets</p>
                        </Card>
                    </Link>
                </div>
            </section>

          {/* Urgent Tasks Section */}
          {urgentJobs.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[11px] font-black uppercase text-rose-500 tracking-widest flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" /> Khẩn cấp / Sự cố
                </h3>
              </div>
              <div className="space-y-3">
                {urgentJobs.map((job) => (
                  <Link key={job.id} to="/mobile/jobs">
                    <Card className="p-4 border-none shadow-xl shadow-rose-200/20 bg-white rounded-3xl relative overflow-hidden group active:scale-[0.98] transition-all border-l-4 border-rose-500">
                      <div className="flex justify-between items-start">
                        <div className="min-w-0 flex-1">
                          <h4 className="font-black text-slate-900 text-[13px] tracking-tight truncate pr-4">{job.title}</h4>
                          <div className="flex items-center gap-2 mt-2 text-slate-400">
                             <MapPin className="h-3 w-3" />
                             <p className="text-[10px] font-bold truncate">
                               {getCustomer(job.customerId)?.name}
                             </p>
                          </div>
                        </div>
                        <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full bg-rose-50 text-rose-600 shrink-0">
                            <ChevronRight className="h-5 w-5" />
                        </Button>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Upcoming Schedule */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[11px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                Lịch trình sắp tới
              </h3>
              <Link to="/mobile/jobs" className="text-[9px] font-black text-primary uppercase">
                Tất cả
              </Link>
            </div>

            <div className="space-y-4">
              {activeJobs.slice(0, 3).map((job) => {
                const cus = getCustomer(job.customerId);
                return (
                  <Link key={job.id} to="/mobile/jobs">
                    <Card className="p-4 border-none shadow-sm rounded-3xl active:bg-slate-50 transition-all flex items-center justify-between bg-white">
                      <div className="flex gap-4 min-w-0">
                        <div className={cn(
                          "h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner",
                          job.status === "in_progress"
                            ? "bg-blue-50 text-blue-500"
                            : "bg-slate-50 text-slate-400",
                        )}>
                          <Clock className="h-6 w-6" />
                        </div>
                        <div className="min-w-0 flex flex-col justify-center">
                          <div className="flex items-center gap-2">
                            <h4 className="font-black text-[13px] text-slate-900 truncate tracking-tight">{job.title}</h4>
                            <StatusBadge variant={jobStatusVariant[job.status]} className="h-4 text-[8px] px-1.5 shrink-0">
                              {jobStatusLabel[job.status]}
                            </StatusBadge>
                          </div>
                          <div className="flex items-center gap-2 mt-1.5">
                             <div className="text-[10px] font-bold text-slate-400">
                                {formatDateTime(job.scheduledFor).split(" ")[1]}
                             </div>
                             <div className="w-1 h-1 rounded-full bg-slate-200" />
                             <div className="text-[10px] font-bold text-slate-400 truncate">
                               {cus?.name}
                             </div>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-200 shrink-0 ml-4" />
                    </Card>
                  </Link>
                );
              })}
              {activeJobs.length === 0 && (
                  <p className="text-[10px] font-bold text-slate-400 text-center py-6 italic underline underline-offset-4 decoration-slate-100">Không có lịch trình hôm nay</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </MobileShell>
  );
}

