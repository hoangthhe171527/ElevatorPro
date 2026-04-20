import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/layout/MobileShell";
import { mockElevators, getProject, formatDateTime } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { elevatorStatusVariant, elevatorStatusLabel } from "@/lib/status-variants";
import {
  Building2,
  MapPin,
  ChevronRight,
  Wrench,
  ShieldCheck,
  History,
  Settings,
  Info,
  Calendar,
  Layers,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/mobile/elevators/$elevatorId")({
  head: ({ params }) => ({ meta: [{ title: `Thang máy ${params.elevatorId} — Mobile` }] }),
  component: ElevatorDetailMobile,
});

function ElevatorDetailMobile() {
  const { elevatorId } = Route.useParams();
  const elevator = mockElevators.find((e) => e.id === elevatorId);

  if (!elevator) return <div>Elevator not found</div>;

  const project = getProject(elevator.projectId);

  const history = [
    { date: "15/03/2026", type: "Bảo trì", tech: "Nguyễn Văn A", result: "Tốt" },
    { date: "10/01/2026", type: "Sửa chữa", tech: "Trần Văn B", result: "Thay relay" },
    { date: "20/11/2025", type: "Kiểm định", tech: "Trung tâm 2", result: "Đạt" },
  ];

  return (
    <MobileShell title="Chi tiết thiết bị" showBackButton>
      <div className="p-4 space-y-5">
        {/* Basic Info Card */}
        <Card className="p-4 border-none shadow-sm flex gap-4">
          <div className="h-16 w-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100 shrink-0">
            <Building2 className="h-8 w-8" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="font-bold text-lg leading-tight">{elevator.building}</h2>
                <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase">
                  {elevator.code}
                </span>
              </div>
              <StatusBadge variant={elevatorStatusVariant[elevator.status]}>
                {elevatorStatusLabel[elevator.status]}
              </StatusBadge>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mt-2">
              <MapPin className="h-3 w-3" />
              {project?.name}
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button className="h-12 rounded-xl bg-primary shadow-lg shadow-primary/20 gap-2 font-bold text-xs">
            <Wrench className="h-4 w-4" /> BÁO HỎNG
          </Button>
          <Button
            variant="outline"
            className="h-12 rounded-xl border-slate-200 gap-2 font-bold text-xs bg-white"
          >
            <Calendar className="h-4 w-4 text-primary" /> ĐẶT LỊCH
          </Button>
        </div>

        {/* Tech Specs */}
        <section>
          <h3 className="text-xs font-bold uppercase text-muted-foreground mb-3 px-1">
            Thông số kỹ thuật
          </h3>
          <Card className="p-4 border-none shadow-sm grid grid-cols-2 gap-y-6 gap-x-4">
            <div>
              <span className="text-[9px] text-muted-foreground font-bold uppercase block mb-1">
                Thương hiệu
              </span>
              <p className="text-sm font-bold">{elevator.brand}</p>
            </div>
            <div>
              <span className="text-[9px] text-muted-foreground font-bold uppercase block mb-1">
                Dòng máy (Model)
              </span>
              <p className="text-sm font-bold">{elevator.model}</p>
            </div>
            <div>
              <span className="text-[9px] text-muted-foreground font-bold uppercase block mb-1">
                Số tầng
              </span>
              <p className="text-sm font-bold">{elevator.floors} Stop</p>
            </div>
            <div>
              <span className="text-[9px] text-muted-foreground font-bold uppercase block mb-1">
                Ngày lắp đặt
              </span>
              <p className="text-sm font-bold">{formatDateTime(elevator.installedAt)}</p>
            </div>
          </Card>
        </section>

        {/* Service History */}
        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-xs font-bold uppercase text-muted-foreground">Lịch sử tác động</h3>
            <History className="h-4 w-4 text-slate-400" />
          </div>
          <Card className="p-4 border-none shadow-sm divide-y divide-slate-50">
            {history.map((h, i) => (
              <div key={i} className="py-3 flex justify-between items-center first:pt-0 last:pb-0">
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center">
                    <Info className="h-4 w-4 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold">{h.type}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {h.tech} • {h.date}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase">
                  {h.result}
                </span>
              </div>
            ))}
            <Button variant="ghost" className="w-full text-[10px] font-bold text-primary mt-2 h-8">
              XEM TẤT CẢ LỊCH SỬ <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          </Card>
        </section>

        {/* Warranty/Contract */}
        <section>
          <h3 className="text-xs font-bold uppercase text-muted-foreground mb-3 px-1">
            Bảo hành & Hợp đồng
          </h3>
          <Card className="p-4 border-none shadow-sm bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
              <div>
                <p className="text-xs font-bold">Thời hạn bảo hành</p>
                <p className="text-[10px] opacity-70">
                  Hết hạn vào {formatDateTime(elevator.warrantyUntil)}
                </p>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-[9px] font-bold bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              HỢP ĐỒNG <FileText className="h-3 w-3 ml-1" />
            </Button>
          </Card>
        </section>
      </div>
    </MobileShell>
  );
}
