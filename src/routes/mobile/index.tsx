import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { MobileShell } from "@/components/layout/MobileShell";
import { useMainRole, useAppStore, useCurrentPermissions } from "@/lib/store";
import { canAccessMobilePath } from "@/lib/mobile-policy";
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
  Zap,
  ShieldCheck,
  FileText,
  UserPlus,
  ArrowUpRight,
  ClipboardCheck,
   FolderKanban,
   HandCoins,
   Wrench,
   CalendarDays,
    Building2,
    Navigation,
    UserCheck,
    AlertTriangle,
    Plus,
    FileText as FileTextIcon,
    Calendar,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { CreateJobModal } from "@/components/common/Modals";
import { cn } from "@/lib/utils";
import {
   mockJobs,
   mockContracts,
   mockCustomers,
   mockElevators,
   mockLeads,
   getCustomer,
   formatDate,
   formatDateTime,
   formatVND,
} from "@/lib/mock-data";
import {
   contractStatusLabel,
   contractStatusVariant,
   jobStatusLabel,
   jobStatusVariant,
   priorityLabel,
   priorityVariant,
} from "@/lib/status-variants";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/mobile/")({
  component: MobileDashboard,
});

function MobileDashboard() {
   const navigate = useNavigate();
  const role = useMainRole();
   const permissions = useCurrentPermissions();
  const companySize = useAppStore((s) => s.companySize);
   const activeTenantId = useAppStore((s) => s.activeTenantId);
  const setCompanySize = (size: "large" | "small") => useAppStore.getState().setCompanySize(size);
   const [createJobOpen, setCreateJobOpen] = useState(false);

  const adminModules = [
    { label: "Approvals", icon: ClipboardCheck, color: "bg-indigo-600 text-white shadow-indigo-200", path: "/mobile/approvals", desc: "Duyệt yêu cầu ngay" },
    { label: "Accounting", icon: CreditCard, color: "bg-emerald-50 text-emerald-600", path: "/mobile/accounting", desc: "Dòng tiền & Lợi nhuận" },
    { label: "HR Admin", icon: Users, color: "bg-indigo-50 text-indigo-600", path: "/mobile/hr", desc: "Nhân sự & Chấm công" },
    { label: "Inventory", icon: Warehouse, color: "bg-amber-50 text-amber-600", path: "/mobile/inventory", desc: "Quản lý tồn kho" },
    { label: "Customers", icon: UserPlus, color: "bg-purple-50 text-purple-600", path: "/mobile/customers", desc: "CRM & Hợp đồng" },
      { label: "Projects", icon: FolderKanban, color: "bg-sky-50 text-sky-600", path: "/mobile/projects", desc: "Theo dõi dự án" },
      { label: "Leads", icon: HandCoins, color: "bg-lime-50 text-lime-600", path: "/mobile/leads", desc: "Cơ hội kinh doanh" },
    { label: "Advanced BI", icon: LineChart, color: "bg-rose-50 text-rose-600", path: "/mobile/reports", desc: "Báo cáo chuyên sâu" },
  ];

  const techModules = [
    { label: "Scanner", icon: QrCode, color: "bg-indigo-600 text-white shadow-indigo-200", path: "/mobile/scanner", desc: "Check-in thiết bị" },
      { label: "My Tasks", icon: Briefcase, color: "bg-amber-50 text-amber-600", path: "/mobile/tech/jobs/", desc: "Công việc hằng ngày" },
    { label: "Inventory", icon: Warehouse, color: "bg-slate-50 text-slate-600", path: "/mobile/inventory", desc: "Yêu cầu vật tư" },
      { label: "Schedule", icon: CalendarDays, color: "bg-cyan-50 text-cyan-600", path: "/mobile/tech/schedule", desc: "Lịch công tác" },
    { label: "Smart Route", icon: RouteIcon, color: "bg-emerald-50 text-emerald-600", path: "/mobile/tech/route-plan", desc: "Lộ trình tối ưu" },
    { label: "Emergency", icon: Zap, color: "bg-rose-50 text-rose-600", path: "/mobile/support", desc: "Cứu hộ khẩn cấp" },
    { label: "Assets", icon: SettingsIcon, color: "bg-blue-50 text-blue-600", path: "/mobile/elevators", desc: "Tra cứu thiết bị" },
      { label: "Reports", icon: LineChart, color: "bg-violet-50 text-violet-600", path: "/mobile/reports", desc: "Hiệu suất cá nhân" },
  ];

   const customerModules = [
      { label: "Portal Home", icon: Users, color: "bg-indigo-600 text-white shadow-indigo-200", path: "/mobile/portal", desc: "Tổng quan khách hàng" },
      { label: "My Elevators", icon: SettingsIcon, color: "bg-blue-50 text-blue-600", path: "/mobile/portal/elevators", desc: "Danh sách thiết bị" },
      { label: "Contracts", icon: FileText, color: "bg-emerald-50 text-emerald-600", path: "/mobile/portal/contracts", desc: "Theo dõi hợp đồng" },
      { label: "Billing", icon: CreditCard, color: "bg-amber-50 text-amber-600", path: "/mobile/portal/billing", desc: "Thanh toán & công nợ" },
      { label: "Issue Report", icon: Wrench, color: "bg-rose-50 text-rose-600", path: "/mobile/portal/issues", desc: "Báo lỗi nhanh" },
      { label: "Emergency", icon: Zap, color: "bg-fuchsia-50 text-fuchsia-600", path: "/mobile/support", desc: "Yêu cầu khẩn cấp" },
   ];

   const modules = (role === "admin" ? adminModules : role === "tech" ? techModules : customerModules).filter((module) =>
      canAccessMobilePath(module.path, role, permissions),
   );

   const isDirector = permissions.includes("director");

   const directorData = useMemo(() => {
      if (role !== "admin") return null;

      const tenantContracts = mockContracts.filter((c) => c.tenantId === activeTenantId);
      const tenantElevators = mockElevators.filter((e) => e.tenantId === activeTenantId);
      const tenantJobs = mockJobs.filter((j) => j.tenantId === activeTenantId);
      const tenantCustomers = mockCustomers.filter((c) => c.tenantId === activeTenantId);
      const tenantLeads = mockLeads.filter((l) => l.tenantId === activeTenantId);

      const totalRevenue = tenantContracts.reduce((sum, contract) => sum + contract.paid, 0);
      const expiringContracts = tenantContracts.filter((c) => c.status === "expiring").length;
      const overdueElevators = tenantElevators.filter(
         (e) => e.status === "maintenance_due" || e.status === "out_of_order",
      ).length;
      const activeJobs = tenantJobs.filter(
         (j) => j.status === "in_progress" || j.status === "scheduled",
      ).length;
      const newLeads = tenantLeads.filter((l) => l.status === "new" || l.status === "contacted").length;

      const upcomingJobs = [...tenantJobs]
         .filter((j) => j.status === "scheduled" || j.status === "in_progress")
         .sort((a, b) => a.scheduledFor.localeCompare(b.scheduledFor))
         .slice(0, 6);

      const recentContracts = [...tenantContracts]
         .sort((a, b) => b.signedAt.localeCompare(a.signedAt))
         .slice(0, 5);

      return {
         tenantCustomers,
         tenantElevators,
         totalRevenue,
         expiringContracts,
         overdueElevators,
         activeJobs,
         newLeads,
         upcomingJobs,
         recentContracts,
         totalJobs: tenantJobs.length,
      };
   }, [role, activeTenantId]);

   const techLocations = [
      { id: 1, name: "Nguyễn Văn A", status: "online", zone: "Q.1", job: "Bảo trì định kỳ #JOB-102" },
      { id: 2, name: "Trần Thị B", status: "online", zone: "Q.7", job: "Sửa chữa khẩn cấp #JOB-105" },
      { id: 3, name: "Lê Văn C", status: "away", zone: "Bình Thạnh", job: "Nghỉ trưa" },
   ] as const;

   if (role === "admin" && isDirector && directorData) {
      return (
         <MobileShell hideHeader={true}>
            <div className="min-h-screen bg-slate-50 pb-36">
               <section className="px-5 pt-8 pb-7 bg-indigo-950 rounded-b-[2.2rem] shadow-2xl shadow-indigo-950/20">
                  <div className="flex items-center justify-between gap-3">
                     <div>
                        <h1 className="text-xl font-black tracking-tight text-white">Tổng quan hệ thống</h1>
                        <p className="mt-1 text-xs text-indigo-200">Nắm bắt vận hành công việc, nhân sự, hợp đồng</p>
                     </div>
                     <Button
                        size="sm"
                        onClick={() => setCreateJobOpen(true)}
                        className="h-9 rounded-xl bg-white text-indigo-900 hover:bg-indigo-100"
                     >
                        <Plus className="mr-1.5 h-4 w-4" /> Tạo việc
                     </Button>
                  </div>

                  <div className="mt-4 rounded-2xl border border-white/15 bg-white/10 px-3.5 py-3">
                     <div className="text-[11px] font-semibold text-indigo-100">Doanh thu đã thu</div>
                     <div className="mt-1 text-2xl font-black tracking-tight text-white">{formatVND(directorData.totalRevenue)}</div>
                     <div className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-emerald-300">
                        <TrendingUp className="h-3.5 w-3.5" /> 12% so tháng trước
                     </div>
                  </div>
               </section>

               <section className="px-4 -mt-4">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                     <button
                        onClick={() => navigate({ to: "/mobile/reports" })}
                        className="rounded-2xl border border-slate-100 bg-white p-4 text-left shadow-sm"
                     >
                        <div className="flex items-center justify-between">
                           <span className="text-xs font-semibold text-slate-500">Doanh thu đã thu</span>
                           <TrendingUp className="h-4 w-4 text-emerald-600" />
                        </div>
                        <p className="mt-2 text-2xl font-black text-slate-900">{formatVND(directorData.totalRevenue)}</p>
                        <p className="mt-1 text-[11px] text-emerald-700">12% so tháng trước</p>
                     </button>

                     <button
                        onClick={() => navigate({ to: "/mobile/jobs" })}
                        className="rounded-2xl border border-slate-100 bg-white p-4 text-left shadow-sm"
                     >
                        <div className="flex items-center justify-between">
                           <span className="text-xs font-semibold text-slate-500">Công việc đang chạy</span>
                           <Briefcase className="h-4 w-4 text-indigo-600" />
                        </div>
                        <p className="mt-2 text-2xl font-black text-slate-900">{directorData.activeJobs}</p>
                        <p className="mt-1 text-[11px] text-slate-500">{directorData.totalJobs} công việc tổng</p>
                     </button>

                     <button
                        onClick={() => navigate({ to: "/mobile/contracts" })}
                        className="rounded-2xl border border-slate-100 bg-white p-4 text-left shadow-sm"
                     >
                        <div className="flex items-center justify-between">
                           <span className="text-xs font-semibold text-slate-500">HĐ sắp hết hạn</span>
                           <FileTextIcon className="h-4 w-4 text-amber-600" />
                        </div>
                        <p className="mt-2 text-2xl font-black text-slate-900">{directorData.expiringContracts}</p>
                        <p className="mt-1 text-[11px] text-slate-500">Cần liên hệ tái ký</p>
                     </button>

                     <button
                        onClick={() => navigate({ to: "/mobile/elevators" })}
                        className="rounded-2xl border border-slate-100 bg-white p-4 text-left shadow-sm"
                     >
                        <div className="flex items-center justify-between">
                           <span className="text-xs font-semibold text-slate-500">Thang cần chú ý</span>
                           <AlertTriangle className="h-4 w-4 text-rose-600" />
                        </div>
                        <p className="mt-2 text-2xl font-black text-slate-900">{directorData.overdueElevators}</p>
                        <p className="mt-1 text-[11px] text-slate-500">Đến hạn BT hoặc hỏng</p>
                     </button>
                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                     <button
                        onClick={() => navigate({ to: "/mobile/customers" })}
                        className="rounded-2xl border border-slate-100 bg-white p-4 text-left shadow-sm"
                     >
                        <div className="flex items-center justify-between">
                           <span className="text-xs font-semibold text-slate-500">Tổng khách hàng</span>
                           <Users className="h-4 w-4 text-emerald-600" />
                        </div>
                        <p className="mt-2 text-2xl font-black text-slate-900">{directorData.tenantCustomers.length}</p>
                     </button>

                     <button
                        onClick={() => navigate({ to: "/mobile/elevators" })}
                        className="rounded-2xl border border-slate-100 bg-white p-4 text-left shadow-sm"
                     >
                        <div className="flex items-center justify-between">
                           <span className="text-xs font-semibold text-slate-500">Tổng thang máy</span>
                           <Building2 className="h-4 w-4 text-indigo-600" />
                        </div>
                        <p className="mt-2 text-2xl font-black text-slate-900">{directorData.tenantElevators.length}</p>
                     </button>

                     <button
                        onClick={() => navigate({ to: "/mobile/leads" })}
                        className="rounded-2xl border border-slate-100 bg-white p-4 text-left shadow-sm"
                     >
                        <div className="flex items-center justify-between">
                           <span className="text-xs font-semibold text-slate-500">Lead đang theo dõi</span>
                           <ArrowUpRight className="h-4 w-4 text-indigo-600" />
                        </div>
                        <p className="mt-2 text-2xl font-black text-slate-900">{directorData.newLeads}</p>
                     </button>
                  </div>

                  <div className="mt-3 rounded-2xl border border-slate-100 bg-white p-4 text-left shadow-sm">
                     <p className="text-xs font-semibold text-slate-500">Cơ hội kinh doanh</p>
                     <p className="mt-2 text-[11px] text-slate-500">{directorData.newLeads} lead mới và đang liên hệ</p>
                     <button
                        onClick={() => navigate({ to: "/mobile/leads" })}
                        className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600"
                     >
                        Xem chi tiết <ChevronRight className="h-3.5 w-3.5" />
                     </button>
                  </div>
               </section>

               <section className="mt-5 px-4">
                  <Card className="rounded-2xl border-slate-100 p-4">
                     <div className="mb-3 flex items-center justify-between">
                        <div>
                           <h3 className="text-sm font-bold text-slate-900">Theo dõi kỹ thuật viên</h3>
                           <p className="text-[11px] text-slate-500">Vị trí và trạng thái thời gian thực</p>
                        </div>
                        <Button variant="outline" size="sm" className="h-8 rounded-lg px-3 text-[11px]">
                           <Navigation className="mr-1 h-3.5 w-3.5" /> Bản đồ
                        </Button>
                     </div>

                     <div className="mb-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
                        <div className="grid gap-2">
                           {techLocations.map((tech) => (
                              <div key={tech.id} className="flex items-center gap-3 rounded-xl bg-white p-2.5">
                                 <div
                                    className={cn(
                                       "flex h-9 w-9 items-center justify-center rounded-xl text-white",
                                       tech.status === "online" ? "bg-emerald-500" : "bg-slate-400",
                                    )}
                                 >
                                    <UserCheck className="h-4 w-4" />
                                 </div>
                                 <div className="min-w-0 flex-1">
                                    <p className="truncate text-[12px] font-semibold text-slate-800">{tech.name}</p>
                                    <p className="truncate text-[11px] text-slate-500">{tech.job}</p>
                                 </div>
                                 <div className="rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600">
                                    {tech.zone}
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  </Card>
               </section>

               <section className="mt-5 px-4">
                  <Card className="rounded-2xl border-slate-100 p-4">
                     <div className="mb-3 flex items-center justify-between">
                        <div>
                           <h3 className="text-sm font-bold text-slate-900">Công việc sắp tới</h3>
                           <p className="text-[11px] text-slate-500">Đã lên lịch hoặc đang thực hiện</p>
                        </div>
                        <Link to="/mobile/jobs" className="text-[11px] font-semibold text-indigo-600">
                           Tất cả
                        </Link>
                     </div>
                     <div className="space-y-2">
                        {directorData.upcomingJobs.map((job) => {
                           const customer = getCustomer(job.customerId);
                           return (
                              <Link
                                 key={job.id}
                                 to="/mobile/jobs/$jobId"
                                 params={{ jobId: job.id }}
                                 className="flex items-start gap-3 rounded-xl border border-slate-100 p-3"
                              >
                                 <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
                                    <Briefcase className="h-4 w-4" />
                                 </div>
                                 <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-1.5">
                                       <span className="truncate text-[12px] font-semibold text-slate-900">{job.title}</span>
                                       <StatusBadge variant={priorityVariant[job.priority]}>
                                          {priorityLabel[job.priority]}
                                       </StatusBadge>
                                    </div>
                                    <p className="mt-1 truncate text-[11px] text-slate-500">
                                       {customer?.name} · {formatDateTime(job.scheduledFor)}
                                    </p>
                                 </div>
                                 <StatusBadge variant={jobStatusVariant[job.status]}>{jobStatusLabel[job.status]}</StatusBadge>
                              </Link>
                           );
                        })}
                     </div>
                  </Card>
               </section>

               <section className="mt-5 px-4">
                  <Card className="rounded-2xl border-slate-100 p-4">
                     <div className="mb-3 flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-900">Hợp đồng gần đây</h3>
                        <Link to="/mobile/contracts" className="text-[11px] font-semibold text-indigo-600">
                           Tất cả
                        </Link>
                     </div>
                     <div className="space-y-2">
                        {directorData.recentContracts.map((contract) => {
                           const customer = getCustomer(contract.customerId);
                           return (
                              <Link
                                 key={contract.id}
                                 to="/mobile/contracts/$contractId"
                                 params={{ contractId: contract.id }}
                                 className="block rounded-xl border border-slate-100 p-3"
                              >
                                 <div className="flex items-center justify-between gap-2">
                                    <span className="text-[12px] font-semibold text-slate-900">{contract.code}</span>
                                    <StatusBadge variant={contractStatusVariant[contract.status]}>
                                       {contractStatusLabel[contract.status]}
                                    </StatusBadge>
                                 </div>
                                 <p className="mt-1 truncate text-[11px] text-slate-500">{customer?.name}</p>
                                 <div className="mt-2 flex items-center justify-between text-[11px]">
                                    <span className="text-slate-500">{formatDate(contract.endDate)}</span>
                                    <span className="font-semibold text-indigo-700">{formatVND(contract.value)}</span>
                                 </div>
                              </Link>
                           );
                        })}
                     </div>
                  </Card>
               </section>

               <section className="mt-5 px-4">
                  <Card className="rounded-2xl border-slate-100 p-4">
                     <div className="mb-3 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                        <h3 className="text-sm font-bold text-slate-900">Cảnh báo cần xử lý</h3>
                     </div>
                     <div className="grid grid-cols-1 gap-2.5">
                        {[
                           {
                              icon: Calendar,
                              label: "Thang đến hạn bảo trì",
                              count: directorData.overdueElevators,
                              to: "/mobile/elevators",
                           },
                           {
                              icon: FileTextIcon,
                              label: "Hợp đồng sắp hết hạn",
                              count: directorData.expiringContracts,
                              to: "/mobile/contracts",
                           },
                           {
                              icon: AlertTriangle,
                              label: "Sự cố đang mở",
                              count: 1,
                              to: "/mobile/jobs",
                           },
                        ].map((alert) => {
                           const Icon = alert.icon;
                           return (
                              <Link
                                 key={alert.label}
                                 to={alert.to}
                                 className="flex items-center justify-between rounded-xl border border-slate-100 p-3"
                              >
                                 <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                                       <Icon className="h-4 w-4" />
                                    </div>
                                    <span className="text-[12px] font-semibold text-slate-800">{alert.label}</span>
                                 </div>
                                 <span className="text-xl font-black text-slate-900">{alert.count}</span>
                              </Link>
                           );
                        })}
                     </div>
                  </Card>
               </section>

               <CreateJobModal open={createJobOpen} onClose={() => setCreateJobOpen(false)} />
            </div>
         </MobileShell>
      );
   }

  return (
    <MobileShell hideHeader={true}>
      <div className="flex flex-col min-h-screen bg-slate-50 font-sans pb-36">
        {/* Modern Compact Header */}
        <div className="px-6 pt-10 pb-12 bg-indigo-950 rounded-b-[2.5rem] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -mr-32 -mt-32 blur-3xl" />
          
          <div className="relative z-10 flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
               <div className="h-10 w-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                  <ShieldCheck className="h-6 w-6 text-indigo-300" />
               </div>
               <div>
                  <h1 className="text-lg font-black text-white italic tracking-tighter leading-none mb-1 uppercase">Cloud_Stack</h1>
                  <p className="text-[8px] font-bold text-indigo-400 uppercase tracking-[0.2em]">Management Suite v4.5</p>
               </div>
            </div>
            
            <div className="flex bg-black/20 backdrop-blur-xl p-1 rounded-xl border border-white/10 shadow-inner">
               <button 
                  onClick={() => setCompanySize("large")}
                  className={cn("px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all tracking-widest", companySize === "large" ? "bg-white text-indigo-950 shadow-[0_4px_12px_rgba(255,255,255,0.2)]" : "text-white/40")}
               >Large</button>
               <button 
                  onClick={() => setCompanySize("small")}
                  className={cn("px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all tracking-widest", companySize === "small" ? "bg-white text-indigo-950 shadow-[0_4px_12px_rgba(255,255,255,0.2)]" : "text-white/40")}
               >Small</button>
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-4 bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10">
             <div className="flex-1">
                <p className="text-[9px] font-bold text-indigo-300 uppercase mb-1 tracking-widest">{role === "admin" ? "Vận hành hệ thống" : "Năng suất cá nhân"}</p>
                <div className="flex items-baseline gap-2">
                   <p className="text-2xl font-black text-white italic tracking-tighter">98,2<span className="text-xs opacity-50 ml-0.5">%</span></p>
                   <div className="flex items-center text-[9px] font-bold text-emerald-400">
                      <TrendingUp className="h-3 w-3 mr-1" /> +2.4%
                   </div>
                </div>
             </div>
             <div className="w-px h-10 bg-white/10" />
             <div className="flex-1 pl-2">
                <p className="text-[9px] font-bold text-indigo-300 uppercase mb-1 tracking-widest">{role === "admin" ? "Cần phê duyệt" : "Task hoàn thành"}</p>
                <div className="flex items-center gap-2">
                    <p className="text-2xl font-black text-white italic tracking-tighter">{role === "admin" ? "03" : "12"}</p>
                    {role === "admin" && (
                        <div className="h-2 w-2 rounded-full bg-rose-500 animate-ping shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
                    )}
                </div>
             </div>
          </div>
        </div>

        {/* Action Modules Grid - Compact & Professional */}
        <div className="px-5 -mt-6 relative z-20">
          <div className="bg-white rounded-[2rem] p-5 shadow-2xl shadow-indigo-900/10 grid grid-cols-2 gap-4 border border-indigo-50">
             {modules.map((m) => (
                <Link key={m.label} to={m.path} className="group active:scale-[0.97] transition-all">
                   <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 group-hover:bg-white group-hover:border-indigo-100 group-hover:shadow-lg transition-all flex flex-col items-start gap-3">
                      <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shadow-sm border border-white/50", m.color)}>
                         <m.icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                         <h4 className="text-[12px] font-black text-slate-800 uppercase tracking-tight mb-0.5">{m.label}</h4>
                         <p className="text-[9px] font-bold text-slate-400 truncate leading-none">{m.desc}</p>
                      </div>
                   </div>
                </Link>
             ))}
          </div>
        </div>

        {/* Insights & Quick Status */}
        <section className="px-6 mt-10">
           <div className="flex items-center justify-between mb-5">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" /> Live Activity_
              </h3>
              <Link to={role === "tech" ? "/mobile/tech/jobs" : role === "customer" ? "/mobile/portal/issues" : "/mobile/jobs"} className="text-[10px] font-black text-indigo-600 uppercase flex items-center gap-1 group">
                 Tất cả <ArrowUpRight className="h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
           </div>
           
           <div className="space-y-4">
              {[1, 2].map((i) => (
                 <Link key={i} to={role === "tech" ? "/mobile/tech/jobs" : role === "customer" ? "/mobile/portal/elevators" : "/mobile/jobs"}>
                    <Card className="p-5 border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] rounded-[1.8rem] bg-white active:scale-[0.98] transition-all flex items-center gap-4 group">
                       <div className="h-12 w-12 bg-slate-900 rounded-2xl flex flex-col items-center justify-center shadow-lg group-hover:rotate-3 transition-transform">
                          <span className="text-[8px] font-bold text-white/40 uppercase">JOB</span>
                          <span className="text-sm font-black text-white italic">#0{i}</span>
                       </div>
                       <div className="flex-1 min-w-0">
                          <h4 className="text-[13px] font-black text-slate-900 leading-tight italic truncate mb-1.5 uppercase tracking-tight">Landmark 81 - Zone B</h4>
                          <div className="flex items-center gap-3">
                             <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-50 rounded-lg">
                                <MapPin className="h-2.5 w-2.5 text-emerald-500" />
                                <span className="text-[9px] font-black text-emerald-600 uppercase tracking-tighter">Running</span>
                             </div>
                             <div className="flex items-center gap-1 px-2 py-0.5 bg-indigo-50 rounded-lg">
                                <Clock className="h-2.5 w-2.5 text-indigo-500" />
                                <span className="text-[9px] font-black text-indigo-600 uppercase tracking-tighter">15:45</span>
                             </div>
                          </div>
                       </div>
                       <ChevronRight className="h-4 w-4 text-slate-200 group-active:text-indigo-400" />
                    </Card>
                 </Link>
              ))}
           </div>
        </section>

        {/* Global Stats Footer Line */}
        <div className="px-6 mt-10 opacity-30 select-none">
           <div className="h-[2px] w-full bg-slate-200 relative mb-2">
              <div className="absolute inset-y-0 left-0 w-1/3 bg-indigo-500" />
           </div>
           <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.5em] text-center italic">Advanced Elevator Control System</p>
        </div>
      </div>
    </MobileShell>
  );
}
