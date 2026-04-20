import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/layout/MobileShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Navigation, 
  Search, 
  Clock, 
  CheckCircle2, 
  Map as MapIcon,
  ChevronRight,
  Route as RouteIcon,
  ArrowLeft
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/mobile/tech/route-plan")({
  component: TechRoutePlan,
});

function TechRoutePlan() {
  const routes = [
    { id: 1, name: "Vincom Center", addr: "72 Lê Thánh Tôn", time: "08:30", status: "completed", type: "Bảo trì" },
    { id: 2, name: "Bitexco Tower", addr: "02 Hải Triều", time: "10:15", status: "active", type: "Sửa chữa" },
    { id: 3, name: "Landmark 81", addr: "Vinhomes Central Park", time: "14:00", status: "pending", type: "Kiểm định" },
  ];

  return (
    <MobileShell title="Lộ trình di chuyển" hideHeader={true}>
      <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
        {/* Map Header Preview */}
        <div className="h-72 bg-indigo-100 relative overflow-hidden">
           <div className="absolute inset-0 bg-slate-300" />
           <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent" />
           
           <div className="absolute top-10 left-6 right-6 flex items-center justify-between">
              <button onClick={() => window.history.back()} className="h-10 w-10 rounded-xl bg-white/90 backdrop-blur-md shadow-lg flex items-center justify-center border border-white active:scale-95">
                 <ArrowLeft className="h-5 w-5 text-slate-900" />
              </button>
              <div className="px-4 py-2 rounded-xl bg-slate-900 shadow-xl flex items-center gap-2 border border-slate-700">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[10px] font-black text-white uppercase tracking-widest">Đang hành trình</span>
              </div>
           </div>

           {/* Map UI Elements */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                 <div className="h-12 w-12 rounded-full bg-indigo-600/20 animate-ping absolute inset-0" />
                 <div className="h-12 w-12 rounded-full bg-indigo-600 flex items-center justify-center border-4 border-white shadow-2xl relative z-10">
                    <Navigation className="h-5 w-5 text-white" />
                 </div>
              </div>
           </div>
        </div>

        {/* Route Details Panel */}
        <div className="px-6 -mt-10 relative z-10 pb-32">
           <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-2xl bg-white shadow-xl flex items-center justify-center border border-slate-100">
                 <RouteIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                 <h2 className="text-lg font-black text-slate-900 italic leading-none mb-1">Tối ưu hóa_</h2>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">3 Điểm dừng • 12.5 KM</p>
              </div>
           </div>

           <div className="space-y-6 relative ml-4 border-l-2 border-dashed border-slate-200 pl-8">
              {routes.map((stop, idx) => (
                 <div key={stop.id} className="relative">
                    <div className={cn(
                       "absolute -left-[41px] top-0 h-4 w-4 rounded-full border-4 border-white shadow-sm ring-2",
                       stop.status === "completed" ? "bg-emerald-500 ring-emerald-100" : 
                       stop.status === "active" ? "bg-indigo-600 ring-indigo-100 scale-125" : "bg-slate-300 ring-slate-100"
                    )} />

                    <Link to={`/mobile/jobs/${stop.id}`}>
                       <Card className={cn(
                          "p-4 border shadow-sm rounded-2xl transition-all active:scale-[0.98]",
                          stop.status === "active" ? "bg-white border-indigo-200 shadow-xl shadow-indigo-900/5 ring-1 ring-indigo-50" : "bg-white/60 border-slate-100 opacity-80"
                       )}>
                          <div className="flex justify-between items-start mb-2">
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{stop.time}</span>
                             <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase bg-slate-100 text-slate-500">{stop.type}</span>
                          </div>
                          <h3 className="text-sm font-black text-slate-900 italic tracking-tight mb-1">{stop.name}</h3>
                          <p className="text-[10px] font-medium text-slate-500 truncate mb-3">{stop.addr}</p>
                          
                          {stop.status === "active" && (
                             <Button className="w-full h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20 text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                <Navigation className="h-4 w-4" />
                                Mở Google Maps
                             </Button>
                          )}
                       </Card>
                    </Link>
                 </div>
              ))}
           </div>
        </div>

        {/* Global Floating Actions */}
        <div className="fixed bottom-24 left-6 right-6 flex items-center gap-3">
           <Button className="flex-1 h-14 rounded-2xl bg-slate-900 text-white shadow-2xl flex items-center gap-2 border border-slate-700">
              <MapIcon className="h-5 w-5" />
              <span className="text-xs font-black uppercase tracking-widest">Xem bản đồ</span>
           </Button>
           <Button className="h-14 w-14 rounded-2xl bg-indigo-600 text-white shadow-2xl flex items-center justify-center ring-4 ring-white">
              <CheckCircle2 className="h-6 w-6" />
           </Button>
        </div>
      </div>
    </MobileShell>
  );
}
