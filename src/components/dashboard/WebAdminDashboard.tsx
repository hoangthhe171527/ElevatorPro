import { Link, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/common/StatusBadge";
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

export function WebAdminDashboard() {
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

      {/* KPI Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6">
        <div className="cursor-pointer" onClick={() => navigate({ to: "/admin/contracts" })}>
          <StatCard
            label="HĐ sắp hết hạn"
            value={expiringContracts}
            icon={FileText}
            accent="warning"
            hint="Cần liên hệ tái ký"
          />
        </div>
        <div className="cursor-pointer" onClick={() => navigate({ to: "/admin/jobs" })}>
          <StatCard
            label="Sự cố khẩn cấp"
            value={tenantJobs.filter(j => j.priority === "urgent" && j.status !== "completed").length}
            icon={AlertTriangle}
            accent="destructive"
            hint="Đang chờ xử lý ngay"
          />
        </div>
        <StatCard
          label="Sản lượng tháng"
          value={`${completionRate}%`}
          icon={CheckCircle2}
          accent="success"
          trend={{ value: "4.2%", positive: true }}
        />
        <StatCard
          label="Doanh thu HĐ mới"
          value={formatVND(totalRevenue * 0.4)}
          icon={CircleDollarSign}
          accent="info"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mb-6">
        <Card className="p-6 shadow-xl shadow-slate-200/50 lg:col-span-2 border-none bg-white">
          <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <TrendingUp className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                      <h3 className="font-black text-slate-800 tracking-tight uppercase truncate text-sm">Hiệu suất tháng {currentMonth + 1}</h3>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5 truncate">Thống kê sản lượng</p>
                  </div>
              </div>
              <div className="flex gap-2 shrink-0">
                 <Badge className="bg-emerald-500 hover:bg-emerald-600 border-none px-2 py-0.5 text-[9px] uppercase font-black tracking-widest">
                    +{Math.floor(completionRate / 10)}%
                 </Badge>
              </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 md:gap-6">
              <div className="p-4 rounded-3xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center text-center">
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-tight mb-1">Tổng đơn</div>
                  <div className="font-black tracking-tighter text-slate-800 text-4xl">{monthlyJobs.length}</div>
              </div>
              
              <div className="p-4 rounded-3xl bg-emerald-50/50 border border-emerald-100/50 flex flex-col items-center justify-center text-center">
                  <div className="text-[9px] font-black text-emerald-600/60 uppercase tracking-tight mb-1">Xong</div>
                  <div className="font-black tracking-tighter text-emerald-600 text-4xl">{completedJobsThisMonth}</div>
              </div>

              <div className="p-4 rounded-3xl bg-warning/5 border border-warning/10 flex flex-col items-center justify-center text-center">
                  <div className="text-[9px] font-black text-warning-foreground/60 uppercase tracking-tight mb-1">Đang xử lý</div>
                  <div className="font-black tracking-tighter text-warning-foreground text-4xl">{pendingJobsThisMonth}</div>
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

        <Card className="p-6 shadow-xl shadow-slate-200/50 border-none bg-white">
           <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-600">
                    <UserCheck className="h-5 w-5" />
                </div>
                <div>
                    <h3 className="text-sm font-black text-slate-800 tracking-tight uppercase">Xếp hạng nhân sự</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Top thợ hoàn thiện đơn nhiều nhất</p>
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
                       <div className="text-[8px] font-bold text-slate-400 uppercase">Hoàn thành</div>
                    </div>
                 </div>
               ))}
            </div>

            <Button variant="ghost" className="w-full mt-4 text-[10px] font-black uppercase text-primary hover:bg-primary/5">
               Xem bảng lương & thưởng →
            </Button>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mb-6">
        <Card className="p-6 shadow-xl shadow-slate-200/50 lg:col-span-2 border-none bg-white">
          <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-2xl bg-destructive/10 flex items-center justify-center text-destructive shrink-0">
                  <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                  <h3 className="text-sm font-black text-slate-800 tracking-tight uppercase">Điểm nóng vận hành</h3>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Các vấn đề cần xử lý ngay lập tức</p>
              </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                icon: Calendar,
                label: "Hết hạn bảo trì",
                count: overdueElevators,
                href: "/admin/elevators",
                color: "bg-warning/10 text-warning-foreground border-warning/20",
                desc: "Cần kiểm tra định kỳ"
              },
              {
                icon: FileText,
                label: "Hết hạn hợp đồng",
                count: expiringContracts,
                href: "/admin/contracts",
                color: "bg-destructive/10 text-destructive border-destructive/20",
                desc: "Thủ tục tái ký khách"
              },
              {
                icon: AlertTriangle,
                label: "Sửa chữa chờ xử lý",
                count: tenantJobs.filter(j => j.type === 'repair' && j.status !== 'completed').length,
                href: "/admin/jobs",
                color: "bg-info/10 text-info border-info/20",
                desc: "Ca sửa chữa kỹ thuật"
              },
            ].map((a) => {
              const Icon = a.icon;
              return (
                <Link
                  key={a.label}
                  to={a.href}
                  className={`group flex flex-col justify-center items-center text-center transition-all hover:shadow-lg p-4 rounded-3xl border ${a.color}`}
                >
                  <div className="flex flex-col items-center justify-center mb-1">
                     <div className="text-xl font-black">{a.count}</div>
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-tight leading-tight">{a.label}</div>
                  <div className="text-[9px] opacity-70 font-bold mt-1 line-clamp-1">{a.desc}</div>
                </Link>
              );
            })}
          </div>
        </Card>

        <Card className="p-6 shadow-xl shadow-slate-200/50 border-none bg-primary/[0.03]">
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

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 p-6 border-none shadow-xl shadow-slate-200/50 bg-white">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600">
                    <Calendar className="h-5 w-5" />
                </div>
                <div>
                    <h3 className="text-sm font-black text-slate-800 tracking-tight uppercase">Công việc sắp tới</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Tiến độ thực hiện hôm nay</p>
                </div>
            </div>
            <Link to="/admin/jobs">
              <Button variant="outline" size="sm" className="h-9 px-4 rounded-xl text-[10px] font-black uppercase">Xem tất cả</Button>
            </Link>
          </div>
          <div className="space-y-2">
            {upcomingJobs.map((j) => {
              const cus = getCustomer(j.customerId);
              return (
                <Link
                  key={j.id}
                  to="/admin/jobs/$jobId"
                  params={{ jobId: j.id }}
                  className="flex items-center gap-4 p-4 rounded-2xl border border-slate-50 hover:bg-slate-50/50 hover:border-slate-100 transition-all group"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 group-hover:bg-primary group-hover:text-white transition-colors">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-[11px] uppercase text-slate-800 truncate">{j.title}</span>
                      <StatusBadge variant={priorityVariant[j.priority]} className="text-[8px] px-1.5 py-0">
                        {priorityLabel[j.priority]}
                      </StatusBadge>
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase truncate mt-0.5">
                      {cus?.name} · {formatDateTime(j.scheduledFor)}
                    </div>
                  </div>
                  <StatusBadge variant={jobStatusVariant[j.status]}>
                    {jobStatusLabel[j.status]}
                  </StatusBadge>
                </Link>
              );
            })}
          </div>
        </Card>

        <Card className="p-6 border-none shadow-xl shadow-slate-200/50 bg-white">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-black text-slate-800 tracking-tight uppercase">Hợp đồng mới</h3>
            <Link to="/admin/contracts">
              <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase">Tất cả</Button>
            </Link>
          </div>
          <div className="space-y-3">
            {recentContracts.map((c) => {
              const cus = getCustomer(c.customerId);
              return (
                <Link
                  key={c.id}
                  to="/admin/contracts"
                  className="block p-4 rounded-2xl border border-slate-50 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-black text-xs text-slate-800">{c.code}</span>
                    <StatusBadge variant={contractStatusVariant[c.status]}>
                      {contractStatusLabel[c.status]}
                    </StatusBadge>
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase truncate mb-3">{cus?.name}</div>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{formatDate(c.endDate)}</span>
                    <span className="text-sm font-black text-primary">{formatVND(c.value)}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </Card>
      </div>

      <CreateJobModal open={createJobOpen} onClose={() => setCreateJobOpen(false)} />
    </AppShell>
  );
}
