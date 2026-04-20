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
  Info,
  SlidersHorizontal,
  History,
  Activity,
  Box
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/mobile/elevators")({
  component: MobileElevatorsList,
});

function MobileElevatorsList() {
  return (
    <MobileShell title="Hệ thống thiết bị">
      <div className="flex flex-col pb-32 bg-slate-50 min-h-screen">
        {/* Advanced Search Header */}
        <div className="px-5 pt-6 pb-8 bg-white border-b border-slate-100 rounded-b-[2rem] shadow-sm mb-6">
           <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-2xl ring-1 ring-slate-100/50 transition-all focus-within:ring-indigo-500/20 focus-within:bg-white">
                 <Search className="h-4 w-4 text-slate-400" />
                 <input placeholder="Tìm Serial, Model, Khách..." className="bg-transparent border-none text-[13px] w-full focus:ring-0 font-medium" />
              </div>
              <button className="h-10 w-10 flex items-center justify-center bg-slate-100 rounded-2xl active:scale-95 transition-all text-slate-600 border border-slate-200">
                 <SlidersHorizontal className="h-4 w-4" />
              </button>
           </div>
           
           <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Hoạt động", count: 24, color: "text-emerald-600 bg-emerald-50" },
                { label: "Lỗi/Dừng", count: 2, color: "text-rose-600 bg-rose-50" },
                { label: "Bảo trì", count: 5, color: "text-amber-600 bg-amber-50" },
              ].map((item) => (
                 <div key={item.label} className={cn("p-2 rounded-xl flex flex-col items-center justify-center border border-transparent shadow-sm", item.color)}>
                    <span className="text-[14px] font-black italic">{item.count}</span>
                    <span className="text-[8px] font-bold uppercase tracking-tighter opacity-70">{item.label}</span>
                 </div>
              ))}
           </div>
        </div>

        {/* List Content with Professional Spacing */}
        <div className="px-5 space-y-5">
          <div className="flex items-center justify-between px-1">
             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Cơ sở dữ liệu máy ({mockElevators.length})</h3>
             <button className="text-[10px] font-black text-indigo-600 uppercase italic">Tải lại</button>
          </div>

          {mockElevators.map((e) => (
            <Link key={e.id} to={`/mobile/elevators/${e.id}`}>
              <Card className="p-5 border border-slate-100 shadow-sm rounded-[2rem] bg-white active:scale-[0.98] transition-all flex flex-col relative overflow-hidden group">
                 {/* Real-time Status Light */}
                 <div className="absolute top-5 right-5 h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />

                 <div className="flex items-start gap-4 mb-4">
                    <div className="h-14 w-14 bg-slate-900 rounded-[1.2rem] flex items-center justify-center shadow-lg group-active:rotate-3 transition-transform">
                       <Box className="h-7 w-7 text-white opacity-80" />
                    </div>
                    <div className="flex-1 min-w-0">
                       <h3 className="text-[15px] font-black text-slate-900 leading-none mb-1.5 italic tracking-tight">{e.serialNumber}</h3>
                       <div className="flex flex-wrap gap-2">
                          <StatusBadge variant={e.status === "operational" ? "success" : "warning"} className="h-4 px-2 text-[7px] font-black uppercase tracking-widest rounded-md border-none">
                             {e.status}
                          </StatusBadge>
                          <div className="flex items-center gap-1 px-1.5 py-0.5 bg-slate-50 rounded border border-slate-100">
                             <MapPin className="h-2 w-2 text-slate-400" />
                             <span className="text-[8px] font-bold text-slate-500 uppercase">Tòa nhà A</span>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-50">
                    <div className="bg-slate-50/50 p-2 rounded-2xl flex flex-col items-center border border-slate-100/50">
                       <Zap className="h-3 w-3 text-amber-500 mb-1" />
                       <span className="text-[8px] font-black text-slate-400 uppercase">Tải trọng</span>
                       <span className="text-[11px] font-black text-slate-900 italic">1.2T</span>
                    </div>
                    <div className="bg-slate-50/50 p-2 rounded-2xl flex flex-col items-center border border-slate-100/50">
                       <Info className="h-3 w-3 text-indigo-500 mb-1" />
                       <span className="text-[8px] font-black text-slate-400 uppercase">Số tầng</span>
                       <span className="text-[11px] font-black text-slate-900 italic">{e.specifications?.floors || 12}F</span>
                    </div>
                    <div className="bg-slate-50/50 p-2 rounded-2xl flex flex-col items-center border border-slate-100/50">
                       <Activity className="h-3 w-3 text-emerald-500 mb-1" />
                       <span className="text-[8px] font-black text-slate-400 uppercase">Vận tốc</span>
                       <span className="text-[11px] font-black text-slate-900 italic">2.5m/s</span>
                    </div>
                 </div>

                 <div className="flex justify-between items-center mt-4">
                    <div className="flex -space-x-2">
                       {[1, 2].map(i => (
                          <div key={i} className="h-6 w-6 rounded-full border-2 border-white bg-slate-200" />
                       ))}
                       <div className="h-6 w-6 rounded-full border-2 border-white bg-indigo-50 flex items-center justify-center text-[7px] font-black text-indigo-600">+1</div>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 rounded-full">
                       <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">Xem hồ sơ</span>
                       <ChevronRight className="h-3 w-3 text-indigo-600" />
                    </div>
                 </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Dynamic Pagination Shadow UI */}
        <div className="px-5 py-8 mt-4">
           <div className="bg-slate-900 rounded-[2rem] p-5 flex items-center justify-between text-white shadow-2xl">
              <div className="flex flex-col">
                 <span className="text-[8px] font-bold text-indigo-300 uppercase leading-none">Trang chủ dữ liệu</span>
                 <span className="text-sm font-black italic">Trang 01<span className="text-slate-500 mx-2">/</span>05</span>
              </div>
              <div className="flex gap-2">
                 <button className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center active:bg-white/20 transition-all border border-white/10 shadow-lg">
                    <ChevronRight className="h-5 w-5 rotate-180" />
                 </button>
                 <button className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center active:bg-white/20 transition-all border border-white/10 shadow-lg">
                    <ChevronRight className="h-5 w-5" />
                 </button>
              </div>
           </div>
        </div>
      </div>
    </MobileShell>
  );
}
