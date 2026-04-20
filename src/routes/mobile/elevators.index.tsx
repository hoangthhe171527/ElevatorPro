import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/layout/MobileShell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Settings, 
  MapPin, 
  Navigation, 
  ChevronRight, 
  Box, 
  ShieldCheck, 
  QrCode,
  ArrowUpRight
} from "lucide-react";
import { mockElevators } from "@/lib/mock-data";
import { StatusBadge } from "@/components/common/StatusBadge";
import { elevatorStatusLabel, elevatorStatusVariant } from "@/lib/status-variants";

export const Route = createFileRoute("/mobile/elevators/index")({
  component: MobileElevatorsList,
});

function MobileElevatorsList() {
  return (
    <MobileShell title="Danh sách thiết bị">
      <div className="flex flex-col pb-32">
        {/* Modern Search Header */}
        <div className="px-6 pt-6 pb-20 bg-slate-900 border-b border-white/5">
           <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input 
                placeholder="TÌM KIẾM THIẾT BỊ / MÃ QR..." 
                className="bg-white/10 border-white/10 text-white placeholder:text-slate-500 h-14 pl-12 rounded-2xl font-black uppercase italic text-xs tracking-[0.1em] focus-visible:ring-indigo-500"
              />
           </div>
        </div>

        {/* List Content */}
        <div className="px-6 -mt-10 space-y-4">
          <div className="flex items-center justify-between px-1 mb-2">
             <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] italic">Tổng số: {mockElevators.length} thang máy</h3>
             <div className="h-8 w-8 rounded-xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-200">
                <QrCode className="h-4 w-4 text-white" />
             </div>
          </div>

          {mockElevators.map((ev) => (
            <Link key={ev.id} to={`/mobile/elevators/${ev.id}`}>
              <Card className="p-0 border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] bg-white group active:scale-[0.98] transition-all overflow-hidden border border-slate-50">
                <div className="p-5 flex items-center gap-5">
                  <div className="h-14 w-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors">
                    <Box className="h-7 w-7 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <h4 className="text-[12px] font-black text-slate-900 uppercase italic tracking-tight truncate pr-4">{ev.name}</h4>
                      <StatusBadge variant={elevatorStatusVariant[ev.status]} className="h-4 px-1.5 text-[7px]">
                         {elevatorStatusLabel[ev.status]}
                      </StatusBadge>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-slate-400">
                         <Navigation className="h-3 w-3" />
                         <span className="text-[9px] font-bold uppercase truncate max-w-[120px]">{ev.building}</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-400">
                         <ShieldCheck className="h-3 w-3 text-emerald-500" />
                         <span className="text-[9px] font-bold uppercase">2026</span>
                      </div>
                    </div>
                  </div>
                  <div className="h-9 w-9 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-slate-900 transition-colors">
                    <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-white transition-colors" />
                  </div>
                </div>
                
                {/* Visual indicator bar */}
                <div className="h-1 w-full bg-slate-50 group-hover:bg-indigo-50 transition-colors">
                   <div className="h-full bg-indigo-500 w-1/3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </MobileShell>
  );
}
