import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/layout/MobileShell";
import { mockElevators, mockJobs, formatDateTime } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { elevatorStatusVariant, elevatorStatusLabel } from "@/lib/status-variants";
import {
  PhoneCall,
  Settings,
  History,
  ShieldCheck,
  AlertCircle,
  Building2,
  ChevronRight,
  BellRing,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/mobile/portal")({
  head: () => ({ meta: [{ title: "Cổng khách hàng — Mobile" }] }),
  component: MobileCustomerPortal,
});

function MobileCustomerPortal() {
  // Mock customer focus
  const myElevators = mockElevators.slice(0, 2);
  const myNextJob = mockJobs.find((j) => j.status === "scheduled");

  const handleSOS = () => {
    toast.error("ĐÃ GỬI YÊU CẦU CỨU HỘ KHẨN CẤP!", {
      duration: 5000,
      description: "Đội kỹ thuật gần nhất đang được điều động đến vị trí của bạn.",
    });
  };

  return (
    <MobileShell title="Chào buổi sáng, Anh/Chị">
      <div className="p-4 space-y-6">
        {/* SOS Button Section */}
        <Card
          className="p-5 border-none shadow-xl bg-red-600 text-white relative overflow-hidden active:scale-[0.97] transition-all"
          onClick={handleSOS}
        >
          <div className="relative z-10">
            <h2 className="text-xl font-black tracking-tighter mb-1">CỨU HỘ TỨC THÌ</h2>
            <p className="text-xs opacity-90 font-bold uppercase tracking-wide">
              Nhấn để báo kẹt thang hoặc hỏng khẩn cấp
            </p>
            <div className="mt-8 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
                <PhoneCall className="h-5 w-5" />
              </div>
              <span className="text-sm font-bold">HOTLINE: 1900 6688</span>
            </div>
          </div>
          <AlertCircle className="absolute top-1/2 right-4 -translate-y-1/2 h-32 w-32 opacity-10 -rotate-12" />
        </Card>

        {/* My Elevators Status */}
        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-xs font-bold uppercase text-muted-foreground">Thang máy của tôi</h3>
            <span className="text-[10px] text-primary font-bold">2 THIẾT BỊ</span>
          </div>
          <div className="space-y-3">
            {myElevators.map((e) => (
              <Card
                key={e.id}
                className="p-4 border-none shadow-sm flex items-center gap-4 bg-white"
              >
                <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                  <Building2 className="h-6 w-6 text-slate-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm truncate">{e.building}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <StatusBadge variant={elevatorStatusVariant[e.status]}>
                      {elevatorStatusLabel[e.status]}
                    </StatusBadge>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-300" />
              </Card>
            ))}
          </div>
        </section>

        {/* Next Scheduled Service */}
        {myNextJob && (
          <section>
            <h3 className="text-xs font-bold uppercase text-muted-foreground mb-3 px-1">
              Lịch bảo trì sắp tới
            </h3>
            <Card className="p-4 border-none shadow-sm bg-blue-50 border border-blue-100">
              <div className="flex gap-4">
                <div className="h-12 w-12 rounded-xl bg-white flex flex-col items-center justify-center border border-blue-200 shrink-0">
                  <span className="text-[10px] font-bold text-blue-600 uppercase mt-1">THÁNG</span>
                  <span className="text-lg font-black text-blue-900 leading-none mb-1">04</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-blue-900">{myNextJob.title}</h4>
                  <p className="text-[10px] text-blue-700/70 mt-1">Dự kiến bắt đầu lúc 09:30</p>
                </div>
                <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <BellRing className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </Card>
          </section>
        )}

        {/* Quick Menu */}
        <div className="grid grid-cols-2 gap-3 pb-8">
          <Button
            variant="outline"
            className="h-16 rounded-2xl bg-white border-slate-100 flex-col gap-1 shadow-sm"
          >
            <History className="h-5 w-5 text-slate-400" />
            <span className="text-[10px] font-bold uppercase">Lịch sử sửa chữa</span>
          </Button>
          <Button
            variant="outline"
            className="h-16 rounded-2xl bg-white border-slate-100 flex-col gap-1 shadow-sm"
          >
            <ShieldCheck className="h-5 w-5 text-emerald-500" />
            <span className="text-[10px] font-bold uppercase">Hợp đồng bảo trì</span>
          </Button>
        </div>
      </div>
    </MobileShell>
  );
}
