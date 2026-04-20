import { createFileRoute, Link } from "@tanstack/react-router";
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

export const Route = createFileRoute("/mobile/")({
  head: () => ({ meta: [{ title: "Mobile Dashboard — ElevatorPro" }] }),
  component: MobileDashboard,
});

function MobileDashboard() {
  const user = useCurrentUser();
  const role = useMainRole();
  const activeJobId = useAppStore((s) => s.activeJobCheckIn);
  
  const pendingApprovals = mockRequests.filter((r) => r.status === "pending");
  const totalRevenue = mockContracts.reduce((s, c) => s + c.paid, 0);
  const activeJobs = mockJobs.filter((j) => j.status === "in_progress" || j.status === "scheduled");
  const urgentJobs = mockJobs.filter((j) => j.priority === "urgent").slice(0, 2);
  const hotLeads = mockLeads.filter(l => l.status === "new" || l.status === "contacted").slice(0, 3);
  const lowStock = mockInventory.filter(i => i.stock <= i.reorderLevel).slice(0, 3);

  // Layout selection based on role
  return (
    <MobileShell title={role === "director" ? "Trung tâm điều hành" : role === "sales" ? "Kinh doanh & CRM" : "Điều hành kỹ thuật"}>
      <div className="flex flex-col pb-28">
        {/* Welcome Header */}
        <div className="px-6 py-6 bg-white flex items-center justify-between border-b border-slate-50">
          <div className="flex items-center gap-3">
             <div className="h-14 w-14 rounded-2xl bg-primary/10 p-0.5 border border-primary/20">
                <div className="h-full w-full rounded-[0.8rem] bg-primary flex items-center justify-center font-black text-white text-xl shadow-lg shadow-primary/20">
                  {user?.name[0]}
                </div>
             </div>
             <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  {role.toUpperCase()} • ONLINE
                </p>
                <h2 className="text-xl font-black text-slate-900 tracking-tighter">{user?.name.split(' ')[0]}</h2>
             </div>
          </div>
          <Link to="/mobile/approvals">
            <Button variant="ghost" size="icon" className="h-11 w-11 rounded-xl bg-slate-50 text-slate-400 border border-slate-100 relative group">
                <Bell className="h-5 w-5" />
                {pendingApprovals.length > 0 && role === "director" && (
                    <div className="absolute top-3 right-3 h-2.5 w-2.5 bg-rose-500 rounded-full border-2 border-white" />
                )}
            </Button>
          </Link>
        </div>

        <div className="p-5 space-y-6">
          {/* ROLE-SPECIFIC WIDGETS */}
          {role === "director" && (
            <>
              {/* Management Insight Banner */}
              <div className="bg-slate-900 rounded-[2rem] p-6 relative overflow-hidden shadow-2xl shadow-slate-900/20">
                <div className="relative z-10">
                    <p className="text-white/40 text-[9px] font-black uppercase tracking-widest mb-1 italic">TÌNH HÌNH TÀI CHÍNH</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-2xl font-black text-white leading-none">{formatVND(totalRevenue)}</h3>
                        <div className="bg-emerald-500/20 text-emerald-400 text-[8px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                            <ArrowUpRight className="h-2 w-2" /> +8.4%
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mt-6">
                        <div className="bg-white/5 backdrop-blur-md rounded-xl p-3 border border-white/10">
                            <h4 className="text-[14px] font-black text-white">{mockProjects.length}</h4>
                            <p className="text-[8px] font-black text-white/50 uppercase">Dự án thầu</p>
                        </div>
                        <div className="bg-white/5 backdrop-blur-md rounded-xl p-3 border border-white/10">
                            <h4 className="text-[14px] font-black text-white text-amber-400">{pendingApprovals.length}</h4>
                            <p className="text-[8px] font-black text-white/50 uppercase">Chờ phê duyệt</p>
                        </div>
                    </div>
                </div>
                <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <Link to="/mobile/accounting" className="p-4 bg-white rounded-3xl border border-slate-50 shadow-sm">
                    <div className="h-10 w-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                       <CreditCard className="h-5 w-5" />
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase">Dòng tiền</p>
                    <p className="text-[11px] font-black text-slate-900 mt-1">Quản lý thu chi</p>
                 </Link>
                 <Link to="/mobile/reports" className="p-4 bg-white rounded-3xl border border-slate-50 shadow-sm">
                    <div className="h-10 w-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                       <TrendingUp className="h-5 w-5" />
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase">Hiệu suất</p>
                    <p className="text-[11px] font-black text-slate-900 mt-1">Báo cáo chỉ số</p>
                 </Link>
              </div>
            </>
          )}

          {role === "sales" && (
            <>
              {/* Sales Pipeline Widget */}
              <Card className="p-5 border-none shadow-sm bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-[2rem] text-white overflow-hidden relative">
                <div className="relative z-10">
                  <p className="text-white/60 text-[9px] font-black uppercase tracking-widest mb-1 italic">PHỄU BÁN HÀNG</p>
                  <div className="flex justify-between items-end">
                    <div>
                      <h3 className="text-3xl font-black tracking-tight">{mockLeads.length} <span className="text-xs opacity-60">Leads</span></h3>
                      <div className="flex gap-2 mt-2">
                        <div className="px-2 py-0.5 bg-white/10 rounded-full text-[8px] font-black uppercase">Chờ xử lý: 3</div>
                        <div className="px-2 py-0.5 bg-emerald-500/30 rounded-full text-[8px] font-black uppercase text-emerald-300">Tỷ lệ chốt: 12%</div>
                      </div>
                    </div>
                    <Link to="/mobile/leads">
                      <Button size="icon" className="bg-white text-indigo-700 rounded-2xl h-12 w-12 shadow-xl active:scale-90">
                         <Users className="h-5 w-5" />
                      </Button>
                    </Link>
                  </div>
                </div>
                <Briefcase className="absolute -bottom-4 -right-2 h-24 w-24 opacity-10" />
              </Card>

              <div className="bg-white p-5 rounded-[2rem] border border-slate-100 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center">
                       <DollarSign className="h-5 w-5" />
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase">Dự kiến hoa hồng</p>
                       <p className="text-sm font-black text-slate-900 italic tracking-tight">{formatVND(12500000)}</p>
                    </div>
                 </div>
                 <Button variant="ghost" size="icon" className="rounded-xl"><ChevronRight className="h-4 w-4" /></Button>
              </div>

              <section>
                 <div className="flex items-center justify-between mb-3 px-1">
                    <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Tiềm năng cần chăm sóc</h3>
                 </div>
                 <div className="space-y-3">
                   {hotLeads.map(lead => (
                     <Card key={lead.id} className="p-3 border-none shadow-sm rounded-2xl flex items-center justify-between bg-white active:scale-95 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xs">
                            {lead.name[0]}
                          </div>
                          <div>
                            <h4 className="text-[11px] font-black text-slate-900">{lead.name}</h4>
                            <div className="flex items-center gap-1.5 mt-1 text-slate-400">
                               <DollarSign className="h-2.5 w-2.5 text-emerald-500" />
                               <span className="text-[9px] font-bold">{formatVND(lead.estimatedValue)}</span>
                            </div>
                          </div>
                        </div>
                        <StatusBadge variant={leadStatusVariant[lead.status]} className="h-5 text-[8px] px-2">{leadStatusLabel[lead.status]}</StatusBadge>
                     </Card>
                   ))}
                 </div>
              </section>
            </>
          )}

          {role === "tech" && (
            <>
              {/* Technician's Active Focus */}
              <div className="space-y-4">
                {activeJobId ? (
                  <Card className="p-5 border-none shadow-xl bg-primary text-white rounded-[2rem] relative overflow-hidden">
                    <div className="relative z-10">
                       <p className="text-white/60 text-[9px] font-black uppercase tracking-widest mb-1 flex items-center gap-1.5 italic">
                         <Zap className="h-3 w-3 animate-pulse text-yellow-300" /> NHIỆM VỤ HIỆN TẠI
                       </p>
                       <h3 className="text-lg font-black tracking-tight leading-tight mb-4">
                         {mockJobs.find(j => j.id === activeJobId)?.title}
                       </h3>
                       <div className="flex items-center gap-4 mb-4">
                          <div className="flex flex-col">
                             <span className="text-[8px] text-white/50 uppercase font-bold">Check-in lúc</span>
                             <span className="text-xs font-black">08:45 AM</span>
                          </div>
                          <div className="w-px h-6 bg-white/20" />
                          <div className="flex flex-col">
                             <span className="text-[8px] text-white/50 uppercase font-bold">Thời gian đã làm</span>
                             <span className="text-xs font-black">1h 20m</span>
                          </div>
                       </div>
                       <Link to={`/mobile/jobs/${activeJobId}`}>
                         <Button className="w-full bg-white text-primary font-black text-[10px] h-10 rounded-xl shadow-lg hover:bg-slate-50 uppercase">CẬP NHẬT TIẾN ĐỘ THI CÔNG</Button>
                       </Link>
                    </div>
                    <Briefcase className="absolute -top-4 -right-4 h-24 w-24 opacity-10" />
                  </Card>
                ) : (
                  <Card className="p-5 border-none shadow-sm bg-white rounded-[2rem] border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                         <Navigation className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-base font-black text-slate-900 tracking-tight">Cần lộ trình?</h3>
                        <p className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase tracking-tighter">BẮT ĐẦU DI CHUYỂN NGAY</p>
                      </div>
                    </div>
                    <Link to="/mobile/route-plan">
                      <Button size="icon" className="h-10 w-10 rounded-xl bg-slate-900 text-white shadow-lg active:scale-95 transition-all">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </Card>
                )}

                <div className="grid grid-cols-2 gap-4">
                   <Link to="/mobile/schedule">
                      <Card className="p-4 border-none shadow-sm bg-white rounded-3xl">
                        <Calendar className="h-5 w-5 text-indigo-500 mb-2" />
                        <p className="text-[10px] font-black text-slate-400 uppercase">Lịch bảo trì</p>
                        <p className="text-xs font-black text-slate-900 mt-1 italic tracking-tight">4 Việc hôm nay</p>
                      </Card>
                   </Link>
                   <Link to="/mobile/inventory">
                      <Card className="p-4 border-none shadow-sm bg-white rounded-3xl">
                        <Package className="h-5 w-5 text-amber-500 mb-2" />
                        <p className="text-[10px] font-black text-slate-400 uppercase">Yêu cầu vật tư</p>
                        <p className="text-xs font-black text-slate-900 mt-1 italic tracking-tight">{lowStock.length > 0 ? `${lowStock.length} Mã cạn` : "Dịu dàng"}</p>
                      </Card>
                   </Link>
                </div>
              </div>
            </>
          )}

          {/* SHARED MODULES GRID (Simplified for high density) */}
          <section>
            <div className="flex items-center justify-between mb-4 px-1">
               <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Trung tâm công việc</h3>
            </div>
            <div className="grid grid-cols-4 gap-3 text-center">
              {[
                { to: "/mobile/jobs", icon: Briefcase, label: "Tác vụ", color: "text-blue-500 bg-blue-50" },
                { to: "/mobile/projects", icon: Navigation, label: "Dự án", color: "text-indigo-500 bg-indigo-50" },
                { to: "/mobile/customers", icon: Users, label: "CRM", color: "text-emerald-500 bg-emerald-50" },
                { to: "/mobile/reports", icon: TrendingUp, label: "Báo cáo", color: "text-amber-500 bg-amber-50" },
              ].map((item, idx) => (
                <Link key={idx} to={item.to} className="flex flex-col items-center gap-2">
                  <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center transition-transform active:scale-90", item.color)}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">{item.label}</span>
                </Link>
              ))}
            </div>
          </section>

          {/* URGENT / ALERT SECTION (Unified & Dense) */}
          <section>
            <div className="flex items-center justify-between mb-4 px-1">
              <h3 className="text-[10px] font-black uppercase text-rose-500 tracking-widest flex items-center gap-1.5">
                <AlertTriangle className="h-3 w-3" /> Chú ý quan trọng
              </h3>
            </div>
            <div className="space-y-3">
              {urgentJobs.length > 0 ? (
                urgentJobs.map((job) => (
                  <Card key={job.id} className="p-3.5 border-none shadow-sm bg-white rounded-2xl flex items-center justify-between border-l-4 border-rose-500 active:scale-95 transition-all">
                    <div className="min-w-0">
                      <h4 className="font-black text-slate-900 text-[11px] truncate">{job.title}</h4>
                      <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase">SỰ CỐ KHẨN CẤP • {job.code}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-300 ml-3 shrink-0" />
                  </Card>
                ))
              ) : (
                <div className="py-8 text-center bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                  <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2 opacity-20" />
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Hệ thống ổn định</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </MobileShell>
  );
}

