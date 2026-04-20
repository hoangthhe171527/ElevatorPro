import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/layout/MobileShell";
import { Card } from "@/components/ui/card";
import { mockElevators } from "@/lib/mock-data";
import { StatusBadge } from "@/components/common/StatusBadge";
import { 
  Search, 
  Settings, 
  MapPin, 
  Zap, 
  ChevronRight,
  Info
} from "lucide-react";

export const Route = createFileRoute("/mobile/elevators/index")({
  component: MobileElevatorsList,
});

function MobileElevatorsList() {
  return (
    <MobileShell title="Thiết bị">
      <div className="flex flex-col pb-24 bg-slate-50 min-h-screen">
        {/* Search Header */}
        <div className="px-5 py-6 bg-white border-b border-slate-100 rounded-b-2xl shadow-sm mb-4">
           <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl">
             <Search className="h-4 w-4 text-slate-400" />
             <input placeholder="Số Serial, Tòa nhà..." className="bg-transparent border-none text-[13px] w-full focus:ring-0" />
           </div>
        </div>

        <div className="px-4 space-y-3">
          {mockElevators.map((e) => (
            <Link key={e.id} to={`/mobile/elevators/${e.id}`}>
              <Card className="p-4 border border-slate-100 shadow-sm rounded-xl bg-white active:bg-slate-50 transition-colors">
                <div className="flex justify-between items-start mb-3">
                   <div className="flex items-center gap-2.5">
                      <div className="h-9 w-9 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200">
                         <Settings className="h-4 w-4 text-slate-600" />
                      </div>
                      <div>
                         <h3 className="text-[13px] font-bold text-slate-900 leading-none mb-1">{e.serialNumber}</h3>
                         <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium tracking-tight">
                            <MapPin className="h-2.5 w-2.5" />
                            <span>VINCOM CENTER</span>
                         </div>
                      </div>
                   </div>
                   <StatusBadge variant={e.status === "operational" ? "success" : "warning"} className="h-4 px-1.5 text-[7px] font-bold uppercase">
                      {e.status}
                   </StatusBadge>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-50">
                   <div className="bg-slate-50 px-2.5 py-1.5 rounded-lg flex items-center justify-between border border-slate-100">
                      <div className="flex items-center gap-1.5">
                         <Zap className="h-3 w-3 text-amber-500" />
                         <span className="text-[9px] font-bold text-slate-500 uppercase">CS</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-900">1200KVA</span>
                   </div>
                   <div className="bg-slate-50 px-2.5 py-1.5 rounded-lg flex items-center justify-between border border-slate-100">
                      <div className="flex items-center gap-1.5">
                         <Info className="h-3 w-3 text-indigo-500" />
                         <span className="text-[9px] font-bold text-slate-500 uppercase">Tầng</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-900">{e.specifications?.floors || 12}</span>
                   </div>
                </div>

                <div className="flex justify-end mt-3">
                   <div className="flex items-center gap-1 text-[9px] font-bold text-indigo-600 uppercase tracking-wider">
                      Chi tiết <ChevronRight className="h-3 w-3 text-indigo-300" />
                   </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </MobileShell>
  );
}
