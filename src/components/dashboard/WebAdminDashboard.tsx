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
  mockInvoices,
  mockIssues,
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
import { useAppStore, useCurrentPermissions, useCurrentUser } from "@/lib/store";
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
  ShieldCheck,
  MapPin,
} from "lucide-react";
import { CreateJobModal } from "@/components/common/Modals";
import { useState } from "react";
import { useDashboardMetrics } from "@/hooks/useDashboardMetrics";

export function WebAdminDashboard() {
  const navigate = useNavigate();
  const activeTenantId = useAppStore((s) => s.activeTenantId);
  const currentUser = useCurrentUser();
  const permissions = useCurrentPermissions();
  const [createJobOpen, setCreateJobOpen] = useState(false);

  const {
    isCEO,
    currentMonth,
    tenantJobs,
    tenantCustomers,
    totalRevenue,
    expiringContracts,
    overdueElevators,
    upcomingJobs,
    recentContracts,
    monthlyJobs,
    completedJobsThisMonth,
    pendingJobsThisMonth,
    completionRate,
    techPerformance,
    headerTitle,
    headerDescription,
    focusMetrics,
    actionList,
    personalQueue,
    personalLinks,
    expiringWarranties
  } = useDashboardMetrics();

  return (
    <AppShell>
      <PageHeader
        title={headerTitle}
        description={headerDescription}
        actions={
          <Button onClick={() => setCreateJobOpen(true)}>
            <Plus className="h-4 w-4 mr-1.5" /> Tạo công việc
          </Button>
        }
      />

      {isCEO && expiringWarranties?.length > 0 && (
        <div className="mb-6 p-4 rounded-3xl bg-orange-50 border-2 border-orange-100 flex flex-col md:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-1000 shadow-sm">
           <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/30">
                 <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                 <h4 className="font-black text-orange-800 uppercase tracking-tight text-sm">Nhắc nhở: {expiringWarranties.length} thang sắp hết hạn bảo hành</h4>
                 <p className="text-xs text-orange-700/70 font-medium">Cần liên hệ khách hàng để tư vấn chuyển sang hợp đồng bảo trì định kỳ.</p>
              </div>
           </div>
           <Link to="/admin/customers">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white font-black text-xs rounded-xl px-6 h-10 shadow-lg shadow-orange-500/20">
                 XEM DANH SÁCH & LIÊN HỆ
              </Button>
           </Link>
        </div>
      )}

      <Card className="p-5 mb-6 border-none shadow-sm bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-black uppercase tracking-tight text-slate-800">Ưu tiên hôm nay của bạn</h3>
          <Badge variant="secondary" className="text-[10px]">{currentUser.name}</Badge>
        </div>
        <div className="grid gap-3 sm:grid-cols-3 mb-4">
          {focusMetrics.map((item) => (
            <div key={item.label} className="rounded-2xl border border-slate-100 bg-slate-50/60 p-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{item.label}</div>
              <div className="text-2xl font-black text-slate-800 mt-1">{item.value}</div>
              <div className="text-[10px] text-slate-500 mt-1">{item.hint}</div>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          {actionList.map((task) => (
            <div key={task} className="text-sm text-slate-700 flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
              <span>{task}</span>
            </div>
          ))}
        </div>
      </Card>

      {isCEO ? (
      <>
      {/* KPI Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6">
        <div className="cursor-pointer" onClick={() => navigate({ to: "/admin/jobs", search: { tab: "pending" } })}>
          <StatCard
            label="Việc chưa phân công"
            value={tenantJobs.filter(j => j.status === "pending").length}
            icon={Briefcase}
            accent="warning"
            hint="Từ hợp đồng tự động sinh"
          />
        </div>
        <div className="cursor-pointer" onClick={() => navigate({ to: "/admin/jobs", search: { priority: "urgent" } })}>
          <StatCard
            label="Sự cố khẩn cấp"
            value={tenantJobs.filter(j => j.priority === "urgent" && j.status !== "completed").length}
            icon={AlertTriangle}
            accent="destructive"
            hint="Cần xử lý ngay"
          />
        </div>
        <div className="cursor-pointer" onClick={() => navigate({ to: "/admin/contracts" })}>
          <StatCard
            label="Chờ duyệt tiền"
            value={mockContracts.filter(c => c.accountantVerified && !c.ceoVerified).length}
            icon={CircleDollarSign}
            accent="success"
            hint="Kế toán đã nộp đối soát"
          />
        </div>
        <div className="cursor-pointer" onClick={() => navigate({ to: "/admin/leads" })}>
          <StatCard
            label="Cơ hội (Leads)"
            value={mockLeads.filter(l => l.status === "new").length}
            icon={Navigation}
            accent="info"
            hint="Khách hàng tiềm năng mới"
          />
        </div>
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

          <Card className="p-6 shadow-xl shadow-slate-200/50 border-none bg-white lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-600">
                    <UserCheck className="h-5 w-5" />
                </div>
                <div>
                    <h3 className="text-sm font-black text-slate-800 tracking-tight uppercase">Điều phối thợ</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Tải trọng công việc</p>
                </div>
            </div>

            <div className="space-y-3">
               {techPerformance.map((tech, idx) => {
                 const minInProgress = Math.min(...techPerformance.map(t => t.inProgress));
                 const isRecommended = tech.inProgress === minInProgress;

                 return (
                   <div key={tech.id} className={`flex items-center justify-between p-3 rounded-2xl bg-slate-50/50 border ${isRecommended ? 'border-primary/40 bg-primary/[0.02]' : 'border-transparent'} hover:border-primary/20 hover:bg-white transition-all group`}>
                      <div className="flex items-center gap-3">
                         <div className={`h-8 w-8 rounded-full border shadow-sm flex items-center justify-center text-[10px] font-black ${isRecommended ? 'bg-primary text-white' : 'bg-white text-slate-400'}`}>
                            {isRecommended ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
                         </div>
                         <div>
                            <div className="text-[11px] font-black text-slate-800 uppercase group-hover:text-primary transition-colors flex items-center gap-1.5">
                               {tech.name}
                            </div>
                            <div className="text-[9px] text-slate-400 font-bold uppercase">{tech.inProgress} việc đang làm</div>
                         </div>
                      </div>
                      <div className="text-right">
                         <div className="text-sm font-black text-slate-800">{tech.completed}</div>
                         <div className="text-[8px] font-bold text-slate-400 uppercase">Xong</div>
                      </div>
                   </div>
                 );
               })}
            </div>
            
            <Button variant="ghost" className="w-full mt-4 text-[10px] font-black uppercase text-primary hover:bg-primary/5">
               Quản lý lịch thợ →
            </Button>
          </Card>
        </div>

        {/* Projects Overview Section for CEO */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black uppercase tracking-tight text-slate-800">Tiến độ Dự án lắp đặt trọn gói</h3>
            <Link to="/admin/projects" className="text-xs text-primary font-bold hover:underline">Tất cả dự án →</Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockProjects.filter(p => p.status === "in_progress" && p.tenantId === activeTenantId).slice(0, 3).map(p => {
               const projJobs = mockJobs.filter(j => j.projectId === p.id);
               const doneJobs = projJobs.filter(j => j.status === "completed").length;
               const progress = projJobs.length > 0 ? Math.round((doneJobs / projJobs.length) * 100) : 0;
               
               return (
                 <Link key={p.id} to="/admin/projects/$projectId" params={{ projectId: p.id }}>
                   <Card className="p-5 hover:shadow-xl transition-all group border-none shadow-md bg-white">
                      <div className="flex justify-between items-start mb-3">
                         <h4 className="font-black text-slate-800 group-hover:text-primary transition-colors line-clamp-1">{p.name}</h4>
                         <Badge variant="outline" className="text-[10px] uppercase font-bold shrink-0">{p.stage}</Badge>
                      </div>
                      <div className="text-[10px] text-slate-400 font-bold flex items-center gap-1 mb-4 uppercase tracking-widest">
                         <MapPin className="h-3 w-3" /> {p.address}
                      </div>
                      
                      <div className="space-y-2">
                         <div className="flex justify-between items-end">
                            <span className="text-[9px] font-black text-slate-400 uppercase">Tiến độ thực thi</span>
                            <span className="text-xs font-black text-primary">{progress}%</span>
                         </div>
                         <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary transition-all duration-500"
                              style={{ width: `${progress}%` }}
                            />
                         </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                         <div className="flex -space-x-2">
                            {Array.from({ length: 3 }).map((_, i) => (
                              <div key={i} className="h-6 w-6 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[8px] font-black text-slate-500 uppercase">NV</div>
                            ))}
                         </div>
                         <div className="text-[9px] font-black text-slate-400 uppercase">8 giai đoạn · {doneJobs}/8</div>
                      </div>
                   </Card>
                 </Link>
               );
            })}
          </div>
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
                icon: CircleDollarSign,
                label: "Duyệt thu tiền",
                count: mockContracts.filter(c => c.accountantVerified && !c.ceoVerified).length,
                href: "/admin/accounting",
                color: "bg-emerald-50 text-emerald-600 border-emerald-100",
                desc: "Kế toán chờ xác nhận"
              },
            ].map((a) => {
              const Icon = a.icon;
              return (
                <Link
                  key={a.label}
                  to={a.href}
                  className={`group flex flex-col justify-center items-center text-center transition-all hover:shadow-lg p-4 rounded-3xl border ${a.color} relative overflow-hidden`}
                >
                  {a.count > 0 && (
                    <div className="absolute top-1 right-1 h-2 w-2 rounded-full bg-current animate-ping" />
                  )}
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
                    <h3 className="text-sm font-black text-slate-800 tracking-tight uppercase">Trung tâm điều hành</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Vận hành hiện trường thời gian thực</p>
                </div>
            </div>
            <Link to="/admin/jobs">
              <Button variant="outline" size="sm" className="h-9 px-4 rounded-xl text-[10px] font-black uppercase">Xem tất cả</Button>
            </Link>
          </div>
          
          <div className="space-y-6">
            {['install', 'maintenance', 'repair'].map(type => {
              const typeJobs = upcomingJobs.filter(j => j.type === type);
              if (typeJobs.length === 0) return null;
              
              return (
                <div key={type} className="space-y-3">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    {type === 'install' ? 'Lắp đặt mới' : type === 'maintenance' ? 'Bảo trì định kỳ' : 'Xử lý sự cố'}
                    <span className="h-1 flex-1 bg-slate-100 rounded-full" />
                  </h4>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {typeJobs.map((j) => {
                      const cus = getCustomer(j.customerId);
                      return (
                        <Link
                          key={j.id}
                          to="/admin/jobs/$jobId"
                          params={{ jobId: j.id }}
                          className="flex items-center gap-3 p-3 rounded-2xl border border-slate-50 hover:bg-slate-50/50 hover:border-slate-100 transition-all group"
                        >
                          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-colors ${
                            j.priority === 'urgent' ? 'bg-destructive/10 text-destructive' : 'bg-slate-100 text-slate-600'
                          }`}>
                            <Briefcase className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-black text-[10px] uppercase text-slate-800 truncate">{j.title}</div>
                            <div className="text-[9px] font-bold text-slate-400 uppercase truncate mt-0.5">
                              {cus?.name}
                            </div>
                          </div>
                          <StatusBadge variant={jobStatusVariant[j.status]} className="px-1.5 py-0 text-[8px]">
                            {jobStatusLabel[j.status]}
                          </StatusBadge>
                        </Link>
                      );
                    })}
                  </div>
                </div>
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

      </>
      ) : (
      <div className="grid gap-6 lg:grid-cols-3 mb-6">
        <Card className="lg:col-span-2 p-6 border-none shadow-sm bg-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black uppercase tracking-tight text-slate-800">Việc bạn cần xử lý hôm nay</h3>
            <Badge variant="secondary" className="text-[10px]">{personalQueue.length} mục</Badge>
          </div>
          <div className="space-y-2">
            {personalQueue.length === 0 ? (
              <div className="text-sm text-muted-foreground py-8 text-center border border-dashed rounded-xl">
                Hôm nay bạn chưa có đầu việc cần xử lý.
              </div>
            ) : (
              personalQueue.map((item) => (
                <div key={item.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50/60">
                  <div className="text-sm font-semibold text-slate-800">{item.title}</div>
                  <div className="text-xs text-slate-500 mt-1">{item.subtitle}</div>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card className="p-6 border-none shadow-sm bg-white">
          <h3 className="text-sm font-black uppercase tracking-tight text-slate-800 mb-4">Hành động nhanh</h3>
          <div className="space-y-3">
            {personalLinks.map((item) => (
              <Link key={item.label} to={item.to}>
                <Button variant="outline" className="w-full justify-between">
                  <span>{item.label}</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </Link>
            ))}
          </div>
        </Card>
      </div>
      )}

      <CreateJobModal open={createJobOpen} onClose={() => setCreateJobOpen(false)} />
    </AppShell>
  );
}
