import { Link, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/common/StatusBadge";
import { cn } from "@/lib/utils";
import {
  jobStatusLabel,
  jobStatusVariant,
  contractStatusLabel,
  contractStatusVariant,
  priorityLabel,
  priorityVariant,
} from "@/lib/status-variants";
import { 
  mockProjects, 
  mockContracts, 
  mockElevators, 
  mockCustomers,
  formatVND,
  formatDate,
  formatDateTime,
  getCustomer,
  mockJobs,
  mockLeads,
  mockUsers,
  type Job,
  type User,
} from "@/lib/mock-data";
import { useAppStore } from "@/lib/store";
import {
  Briefcase,
  Users,
  FileText,
  AlertTriangle,
  Building2,
  TrendingUp,
  Calendar,
  Clock,
  ArrowUpRight,
  Plus,
  Navigation,
  UserCheck,
  PhoneCall,
  CheckCircle2,
  CircleDollarSign,
} from "lucide-react";
import { CreateJobModal } from "@/components/common/Modals";
import { useState } from "react";

export function MobileAdminDashboard() {
  const navigate = useNavigate();
  const activeTenantId = useAppStore((s) => s.activeTenantId);
  const [createJobOpen, setCreateJobOpen] = useState(false);

  // Filter all data by activeTenantId
  const tenantContracts = mockContracts.filter((c) => c.tenantId === activeTenantId);
  const tenantElevators = mockElevators.filter((e) => e.tenantId === activeTenantId);
  const tenantJobs = mockJobs.filter((j) => j.tenantId === activeTenantId);
  const tenantCustomers = mockCustomers.filter((c) => c.tenantId === activeTenantId);
  const tenantLeads = mockLeads.filter((l) => l.tenantId === activeTenantId);

  const totalRevenue = tenantContracts.reduce((s, c) => s + c.paid, 0);
  const expiringContracts = tenantContracts.filter((c) => c.status === "expiring").length;
  const overdueElevators = tenantElevators.filter(
    (e) => e.status === "maintenance_due" || e.status === "out_of_order",
  ).length;

  const upcomingJobs = [...tenantJobs]
    .filter((j) => j.status === "scheduled" || j.status === "in_progress")
    .sort((a, b) => a.scheduledFor.localeCompare(b.scheduledFor))
    .slice(0, 6);

  const recentContracts = [...tenantContracts]
    .sort((a, b) => b.signedAt.localeCompare(a.signedAt))
    .slice(0, 5);

  // --- PERFORMANCE METRICS CALCULATIONS ---
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthlyJobs = tenantJobs.filter(j => {
    const d = new Date(j.scheduledFor);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const completedJobsThisMonth = monthlyJobs.filter(j => j.status === "completed").length;
  const pendingJobsThisMonth = monthlyJobs.filter(j => j.status !== "completed").length;
  const completionRate = monthlyJobs.length > 0 
    ? Math.round((completedJobsThisMonth / monthlyJobs.length) * 100) 
    : 0;

  // Technician Performance Leaderboard
  const techPerformance = mockUsers
    .filter((u: User) => u.memberships.some(m => m.permissions.includes("field_tech")))
    .map((tech: User) => {
      const completed = tenantJobs.filter((j: Job) => j.assignedTo === tech.id && j.status === "completed").length;
      const inProgress = tenantJobs.filter((j: Job) => j.assignedTo === tech.id && j.status === "in_progress").length;
      return { ...tech, completed, inProgress };
    })
    .sort((a, b) => b.completed - a.completed)
    .slice(0, 5);

  return (
    <AppShell>
      <PageHeader
        title="Bảng điều khiển CEO"
        description="Theo dõi hiệu suất vận hành và tiến độ công việc trong tháng"
        actions={
          <Button onClick={() => setCreateJobOpen(true)}>
            <Plus className="h-4 w-4 mr-1.5" /> Tạo công việc
          </Button>
        }
      />

      {/* KPI Cards Section - M thuần */}
      <div className="flex overflow-x-auto hide-scrollbar gap-3 mb-6 pb-2 -mx-4 px-4 snap-x">
         {[
            { label: "Sự cố gấp", value: tenantJobs.filter(j => j.priority === "urgent" && j.status !== "completed").length, icon: AlertTriangle, color: "bg-rose-500", to: "/app/admin/jobs" },
            { label: "HĐ hết hạn", value: expiringContracts, icon: FileText, color: "bg-amber-500", to: "/app/admin/contracts" },
            { label: "Hoàn thiện", value: `${completionRate}%`, icon: CheckCircle2, color: "bg-emerald-500", to: undefined },
            { label: "Doanh thu", value: formatVND(totalRevenue * 0.4), icon: CircleDollarSign, color: "bg-blue-500", to: undefined },
         ].map((item, idx) => {
            const Icon = item.icon;
            return item.to ? (
              <Link key={idx} to={item.to} className={cn("flex flex-col justify-between p-4 rounded-[28px] min-w-[140px] snap-center shrink-0 text-white shadow-sm", item.color)}>
                <div className="flex items-start justify-between">
                   <Icon className="h-5 w-5 opacity-80" />
                </div>
                <div className="mt-5">
                   <div className="text-2xl font-black leading-none mb-1">{item.value}</div>
                   <div className="text-[10px] font-black uppercase tracking-widest opacity-90">{item.label}</div>
                </div>
              </Link>
            ) : (
              <div key={idx} className={cn("flex flex-col justify-between p-4 rounded-[28px] min-w-[140px] snap-center shrink-0 text-white shadow-sm", item.color)}>
                <div className="flex items-start justify-between">
                   <Icon className="h-5 w-5 opacity-80" />
                </div>
                <div className="mt-5">
                   <div className="text-2xl font-black leading-none mb-1">{item.value}</div>
                   <div className="text-[10px] font-black uppercase tracking-widest opacity-90">{item.label}</div>
                </div>
              </div>
            );
         })}
      </div>

      <div className="grid gap-6 mb-6 grid-cols-1">
        <Card className="overflow-hidden border-none bg-white p-4 rounded-[2rem] shadow-[0_2px_10px_rgba(0,0,0,0.03)] lg:col-span-1">
          <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <TrendingUp className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                      <h3 className="font-black text-slate-800 tracking-tight uppercase truncate text-[11px]">Hiệu suất tháng {currentMonth + 1}</h3>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5 truncate">Thống kê sản lượng</p>
                  </div>
              </div>
              <div className="flex gap-2 shrink-0">
                 <Badge className="bg-emerald-500 hover:bg-emerald-600 border-none px-2 py-0.5 text-[9px] uppercase font-black tracking-widest">
                    +{Math.floor(completionRate / 10)}%
                 </Badge>
              </div>
          </div>

          <div className="grid gap-4 grid-cols-3">
              <div className="p-3 rounded-3xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center text-center">
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-tight mb-1">Tổng đơn</div>
                  <div className="font-black tracking-tighter text-slate-800 text-2xl">{monthlyJobs.length}</div>
              </div>
              
              <div className="p-3 rounded-3xl bg-emerald-50/50 border border-emerald-100/50 flex flex-col items-center justify-center text-center">
                  <div className="text-[9px] font-black text-emerald-600/60 uppercase tracking-tight mb-1">Xong</div>
                  <div className="font-black tracking-tighter text-emerald-600 text-2xl">{completedJobsThisMonth}</div>
              </div>

              <div className="p-3 rounded-3xl bg-warning/5 border border-warning/10 flex flex-col items-center justify-center text-center">
                  <div className="text-[9px] font-black text-warning-foreground/60 uppercase tracking-tight mb-1">Đang xử lý</div>
                  <div className="font-black tracking-tighter text-warning-foreground text-2xl">{pendingJobsThisMonth}</div>
              </div>
          </div>

          <div className="mt-8 space-y-2">
             <div className="flex justify-between items-end">
                <span className="text-[11px] font-black text-slate-400 uppercase">Tiến độ mục tiêu tháng</span>
                <span className="text-sm font-black text-primary">{completionRate}%</span>
             </div>
             <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden p-1">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-blue-400 rounded-full transition-all duration-1000 shadow-sm"
                  style={{ width: `${completionRate}%` }}
                />
             </div>
          </div>
        </Card>

        <Card className="border-none bg-white p-4 rounded-[2rem] shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
           <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-600">
                    <UserCheck className="h-5 w-5" />
                </div>
                <div>
                    <h3 className="text-sm font-black text-slate-800 tracking-tight uppercase">Xếp hạng nhân sự</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Top thợ hoàn thiện đơn</p>
                </div>
            </div>

            <div className="space-y-3">
               {techPerformance.map((tech, idx) => (
                 <div key={tech.id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/50 border border-transparent hover:border-primary/20 hover:bg-white transition-all group">
                    <div className="flex items-center gap-3">
                       <div className="h-8 w-8 rounded-full bg-white border shadow-sm flex items-center justify-center text-[10px] font-black text-slate-400">
                          {idx + 1}
                       </div>
                       <div>
                          <div className="text-[11px] font-black text-slate-800 uppercase group-hover:text-primary transition-colors">{tech.name}</div>
                          <div className="text-[9px] text-slate-400 font-bold uppercase">{tech.inProgress} việc đang làm</div>
                       </div>
                    </div>
                    <div className="text-right">
                       <div className="text-sm font-black text-slate-800">{tech.completed}</div>
                       <div className="text-[8px] font-bold text-slate-400 uppercase">Xong</div>
                    </div>
                 </div>
               ))}
            </div>

            <Button variant="ghost" className="w-full mt-4 text-[10px] font-black uppercase text-primary hover:bg-primary/5">
               Xem bảng lương & thưởng →
            </Button>
        </Card>
      </div>

      <div className="grid gap-6 mb-6 grid-cols-1">
        <Card className="border-none bg-white p-4 rounded-[2rem] shadow-[0_2px_10px_rgba(0,0,0,0.03)] lg:col-span-1">
          <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-2xl bg-destructive/10 flex items-center justify-center text-destructive shrink-0">
                  <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                  <h3 className="text-xs sm:text-sm font-black text-slate-800 tracking-tight uppercase">Điểm nóng vận hành</h3>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Các vấn đề cần xử lý</p>
              </div>
          </div>

          <div className="flex flex-col gap-3">
            {[
              {
                icon: Calendar,
                label: "Hết hạn bảo trì",
                count: overdueElevators,
                href: "/app/admin/elevators",
                color: "bg-amber-50 text-amber-700 border-transparent shadow-[0_1px_3px_rgba(0,0,0,0.02)]",
                desc: "Cần kiểm tra định kỳ"
              },
              {
                icon: FileText,
                label: "Hết hạn hợp đồng",
                count: expiringContracts,
                href: "/app/admin/contracts",
                color: "bg-rose-50 text-rose-700 border-transparent shadow-[0_1px_3px_rgba(0,0,0,0.02)]",
                desc: "Thủ tục tái ký khách"
              },
              {
                icon: AlertTriangle,
                label: "Sửa chữa chờ xử lý",
                count: tenantJobs.filter(j => j.type === 'repair' && j.status !== 'completed').length,
                href: "/app/admin/jobs",
                color: "bg-blue-50 text-blue-700 border-transparent shadow-[0_1px_3px_rgba(0,0,0,0.02)]",
                desc: "Ca sửa chữa kỹ thuật"
              },
            ].map((a) => {
              const Icon = a.icon;
              return (
                <Link
                  key={a.label}
                  to={a.href}
                  className={cn(
                    "group flex items-center justify-between p-4 rounded-3xl transition-all",
                    a.color
                  )}
                >
                  <div className="flex items-center gap-3">
                     <div className="h-10 w-10 bg-white/70 rounded-2xl flex items-center justify-center shrink-0">
                        <Icon className="h-5 w-5" />
                     </div>
                     <div>
                        <div className="text-[12px] font-black uppercase tracking-tight">{a.label}</div>
                        <div className="text-[10px] font-bold opacity-70 mt-0.5">{a.desc}</div>
                     </div>
                  </div>
                  <div className="text-2xl font-black">{a.count}</div>
                </Link>
              );
            })}
          </div>
        </Card>

        <Card className="border-none bg-primary/[0.03] p-4 rounded-[2rem]">
            <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <PhoneCall className="h-5 w-5" />
                </div>
                <div>
                    <h3 className="text-sm font-black text-slate-800 tracking-tight uppercase">Chăm sóc định kỳ</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Ký HĐ được 6 tháng</p>
                </div>
            </div>
            
            <div className="space-y-3">
                {tenantCustomers.slice(0, 3).map((c, i) => (
                  <div key={c.id} className="group flex items-center justify-between p-3 rounded-2xl bg-white border border-slate-100 hover:border-primary/30 transition-all cursor-pointer">
                      <div className="min-w-0">
                        <div className="text-[11px] font-black text-slate-800 uppercase truncate">{c.name}</div>
                        <div className="text-[9px] text-slate-400 font-bold flex items-center gap-1 mt-0.5">
                            <Calendar className="h-3 w-3" /> Ngày ký: {20 - i}/10/2025
                        </div>
                      </div>
                      <Button size="icon" variant="ghost" className="h-8 w-8 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors">
                        <PhoneCall className="h-3.5 w-3.5" />
                      </Button>
                  </div>
                ))}
            </div>
            <Button variant="ghost" className="w-full mt-4 text-[10px] font-black uppercase text-primary hover:bg-primary/5">
                Xem toàn bộ {tenantCustomers.length} khách →
            </Button>
        </Card>
      </div>

      <CreateJobModal open={createJobOpen} onClose={() => setCreateJobOpen(false)} />
    </AppShell>
  );
}
