import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/layout/MobileShell";
import { mockElevators } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Building2, Activity, Zap } from "lucide-react";

export const Route = createFileRoute("/mobile/elevators/$elevatorId")({
  head: ({ params }) => ({ meta: [{ title: `Thang máy ${params.elevatorId} — Mobile` }] }),
  component: ElevatorDetailMobile,
});

function ElevatorDetailMobile() {
  const { elevatorId } = Route.useParams();
  const elevator = mockElevators.find((e) => e.id === elevatorId);
  if (!elevator) return <div className="p-8 text-center text-slate-400">Elevator not found</div>;
  return (
    <MobileShell title="Chi tiết thiết bị" showBackButton>
      <div className="flex flex-col pb-24">
        <div className="bg-slate-900 pt-8 pb-14 px-6 relative overflow-hidden text-white">
          <h2 className="text-2xl font-black uppercase italic tracking-tight">{elevator.building}</h2>
          <div className="flex items-center gap-2 text-white/40 text-[10px] uppercase font-black tracking-widest mt-2">{elevator.code}</div>
        </div>
        <div className="p-6 -mt-10 relative z-20">
           <Card className="p-6 border-none shadow-2xl bg-white rounded-[2.8rem] flex items-center justify-between">
              <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trạng thái vận hành</p><p className="text-sm font-black text-emerald-500 uppercase italic">Hoạt động tốt</p></div>
              <Activity className="h-6 w-6 text-indigo-500" />
           </Card>
        </div>
      </div>
    </MobileShell>
  );
}
