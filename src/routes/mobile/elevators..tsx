import { createFileRoute, useRouter } from "@tanstack/react-router";
import { MobileShell } from "@/components/layout/MobileShell";
import { Card } from "@/components/ui/card";
import { mockElevators } from "@/lib/mock-data";
import { StatusBadge } from "@/components/common/StatusBadge";
import { 
  ChevronLeft, 
  Settings, 
  MapPin, 
  Zap, 
  ChevronRight,
  Info,
  History,
  AlertTriangle,
  QrCode
} from "lucide-react";

export const Route = createFileRoute("/mobile/elevators/$elevatorId")({
  component: MobileElevatorDetail,
});

function MobileElevatorDetail() {
  const { elevatorId } = Route.useParams();
  const router = useRouter();
  const elevator = mockElevators.find((e) => e.id === elevatorId);

  if (!elevator) return <div>Không tìm thấy thiết bị</div>;

  return (
    <MobileShell title="Chi tiết thiết bị">
      <div className="flex flex-col pb-24 bg-slate-50 min-h-screen">
        {/* Compact Back Header */}
        <div className="px-5 py-4 bg-white flex items-center justify-between sticky top-0 z-30 border-b border-slate-100 shadow-sm">
           <button onClick={() => router.history.back()} className="h-9 w-9 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 active:scale-90">
              <ChevronLeft className="h-5 w-5 text-slate-600" />
           </button>
           <StatusBadge variant={elevator.status === "operational" ? "success" : "warning"} className="h-6 px-3 text-[9px] font-bold uppercase">
              {elevator.status.toUpperCase()}
           </StatusBadge>
        </div>

        <div className="p-5 space-y-4">
           {/* Visual Header */}
           <Card className="p-6 border-none shadow-sm rounded-2xl bg-white flex flex-col items-center text-center">
              <div className="h-16 w-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-4 shadow-xl">
                 <Settings className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-xl font-bold text-slate-900 leading-tight">{elevator.serialNumber}</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">{elevator.model} — {elevator.type}</p>
           </Card>

           {/* Quick Stats Grid */}
           <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-4 rounded-xl border border-slate-100">
                 <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-amber-500" />
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Tải trọng</span>
                 </div>
                 <p className="text-sm font-bold text-slate-900">1200 KVA</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-100">
                 <div className="flex items-center gap-2 mb-2">
                    <Info className="h-4 w-4 text-indigo-500" />
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Số tầng</span>
                 </div>
                 <p className="text-sm font-bold text-slate-900">12 Tầng</p>
              </div>
           </div>

           {/* Action Menu */}
           <div className="space-y-2">
              {[
                { i: History, l: "Lịch sử bảo trì", c: "text-blue-600 bg-blue-50" },
                { i: AlertTriangle, l: "Báo cáo sự cố", c: "text-rose-600 bg-rose-50" },
                { i: QrCode, l: "Mã định danh (QR)", c: "text-slate-600 bg-slate-50" }
              ].map((item, i) => (
                 <div key={i} className="bg-white p-4 rounded-xl border border-slate-100 flex items-center justify-between active:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                       <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center", item.c)}>
                          <item.i className="h-4 w-4" />
                       </div>
                       <span className="text-sm font-bold text-slate-700">{item.l}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-300" />
                 </div>
              ))}
           </div>
        </div>
      </div>
    </MobileShell>
  );
}
