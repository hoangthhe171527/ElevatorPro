import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/layout/MobileShell";
import { mockElevators, mockJobs, mockContracts, mockProjects } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { elevatorStatusVariant, elevatorStatusLabel } from "@/lib/status-variants";
import {
  PhoneCall,
  AlertCircle,
  Building2,
  ChevronRight,
  ArrowRight,
  FileText
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/mobile/portal")({
  head: () => ({ meta: [{ title: "Cổng khách hàng — Mobile" }] }),
  component: MobileCustomerPortal,
});

const CUSTOMER_ID = "c-1";

function MobileCustomerPortal() {
  const customerProjectIds = mockProjects
    .filter((p) => p.customerId === CUSTOMER_ID)
    .map((p) => p.id);
  const myElevators = mockElevators.filter((e) => customerProjectIds.includes(e.projectId));
  const myContracts = mockContracts.filter((c) => c.customerId === CUSTOMER_ID);
  const myJobs = mockJobs.filter((j) => j.customerId === CUSTOMER_ID);
  
  const upcomingJob = myJobs.find((j) => j.status === "scheduled" || j.status === "in_progress");
  const dueElevators = myElevators.filter((e) => e.status === "maintenance_due").length;

  const handleSOS = () => {
    toast.error("ĐÃ GỬI YÊU CẦU CỨU HỘ KHẨN CẤP!", {
      duration: 5000,
      description: "Đội kỹ thuật gần nhất đang được điều động đến vị trí của bạn.",
    });
  };

  return (
    <MobileShell title="Xin chào, Anh/Chị">
      <div className="flex flex-col pb-24">
        {/* Quick Stats Grid */}
        <div className="bg-slate-900 px-6 pt-6 pb-12 relative overflow-hidden">
            <div className="relative z-10 grid grid-cols-2 gap-3">
                <Card className="bg-white/10 border-white/10 p-4 rounded-3xl backdrop-blur-sm">
                    <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">Thang máy</p>
                    <p className="text-2xl font-black text-white">{myElevators.length}</p>
                </Card>
                <Card className="bg-white/10 border-white/10 p-4 rounded-3xl backdrop-blur-sm">
                    <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">Hợp đồng</p>
                    <p className="text-2xl font-black text-white">{myContracts.length}</p>
                </Card>
            </div>
            {dueElevators > 0 && (
                <div className="relative z-10 mt-4 bg-amber-500/20 border border-amber-500/30 p-3 rounded-2xl flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-500" />
                    <p className="text-[11px] font-bold text-amber-200">
                        Bạn có {dueElevators} thiết bị đang đến hạn bảo trì
                    </p>
                </div>
            )}
            <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
        </div>

        <div className="px-6 -mt-6 relative z-20 space-y-6">
            {/* SOS Button */}
            <Card
              className="p-6 border-none shadow-2xl bg-rose-600 text-white rounded-[2.5rem] relative overflow-hidden active:scale-[0.97] transition-all"
              onClick={handleSOS}
            >
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                    <PhoneCall className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black tracking-tight leading-none uppercase italic">CỨU HỘ TỨC THÌ</h2>
                    <p className="text-[10px] opacity-80 font-bold uppercase tracking-wider mt-1">GỬI YÊU CẦU KHẨN CẤP (24/7)</p>
                  </div>
                </div>
                <div className="bg-white/10 p-3 rounded-2xl inline-block">
                    <span className="text-sm font-black italic">HOTLINE: 1900 6688</span>
                </div>
              </div>
              <AlertCircle className="absolute top-1/2 right-[-10%] -translate-y-1/2 h-40 w-40 opacity-10 -rotate-12" />
            </Card>

            {/* Upcoming Job */}
            {upcomingJob && (
                <section>
                    <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-4 px-1">Lịch làm việc sắp tới</h3>
                    <Link to="/mobile/jobs/$jobId" params={{ jobId: upcomingJob.id }}>
                      <Card className="p-5 border-none shadow-xl shadow-indigo-900/5 bg-white rounded-[2.2rem] border-l-8 border-l-indigo-600">
                        <div className="flex gap-4">
                          <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex flex-col items-center justify-center shrink-0">
                            <span className="text-[9px] font-black text-indigo-400 uppercase leading-none">THÁNG</span>
                            <span className="text-xl font-black text-indigo-600 leading-none mt-1 italic">05</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-black text-sm text-slate-900 uppercase italic truncate">{upcomingJob.title}</h4>
                            <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">Dự kiến: 09:30 | {upcomingJob.status}</p>
                          </div>
                          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-slate-50">
                              <ArrowRight className="h-4 w-4 text-slate-400" />
                          </Button>
                        </div>
                      </Card>
                    </Link>
                </section>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
                <Link to="/mobile/portal/contracts">
                  <Button variant="outline" className="w-full h-20 rounded-[1.8rem] bg-white border-slate-100 flex-col gap-1.5 shadow-sm active:scale-95 transition-all text-indigo-600 hover:bg-white/80">
                      <FileText className="h-6 w-6" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Hợp đồng</span>
                  </Button>
                </Link>
                <Link to="/mobile/portal/issues">
                  <Button variant="outline" className="w-full h-20 rounded-[1.8rem] bg-white border-slate-100 flex-col gap-1.5 shadow-sm active:scale-95 transition-all text-rose-600 hover:bg-white/80">
                      <AlertCircle className="h-6 w-6" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Báo sự cố</span>
                  </Button>
                </Link>
            </div>

            {/* Assets Summary */}
            <section>
                <div className="flex items-center justify-between mb-4 px-1">
                    <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Thang máy của bạn</h3>
                  <Link to="/mobile/portal/elevators">
                        <span className="text-[10px] font-black text-indigo-600 uppercase">Tất cả</span>
                    </Link>
                </div>
                <div className="space-y-3">
                    {myElevators.slice(0, 3).map((e) => (
                    <Link key={e.id} to="/mobile/portal/elevators/$elevatorId" params={{ elevatorId: e.id }}>
                          <Card
                              className="p-4 border-none shadow-sm flex items-center gap-4 bg-white rounded-[1.8rem] active:bg-slate-50 transition-colors"
                          >
                              <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0">
                                  <Building2 className="h-6 w-6 text-slate-300" />
                              </div>
                              <div className="flex-1 min-w-0">
                                  <h4 className="font-black text-[13px] text-slate-900 uppercase italic truncate">{e.building}</h4>
                                  <div className="flex items-center gap-2 mt-1">
                                      <span className="text-[10px] font-black text-slate-400 uppercase">{e.code}</span>
                                      <StatusBadge variant={elevatorStatusVariant[e.status]} className="h-4 px-1 text-[8px]">
                                          {elevatorStatusLabel[e.status]}
                                      </StatusBadge>
                                  </div>
                              </div>
                              <ChevronRight className="h-4 w-4 text-slate-200" />
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
