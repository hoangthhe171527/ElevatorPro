import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/layout/MobileShell";
import { useMainRole } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { 
  Package, 
  Search, 
  ArrowRightLeft, 
  AlertTriangle, 
  Plus,
  ChevronRight,
  Filter,
  BarChart3,
  Box,
  Truck
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/mobile/inventory")({
  component: MobileInventory,
});

function MobileInventory() {
  const role = useMainRole();
  
  const items = [
    { name: "Cáp tải 12mm", code: "CBD-12", stock: 450, unit: "m", status: "ok" },
    { name: "Biến tần Yaskawa", code: "INV-Y10", stock: 2, unit: "bộ", status: "low" },
    { name: "Cảm biến tầng", code: "SNS-T1", stock: 15, unit: "cái", status: "ok" },
    { name: "Dầu ray 140", code: "OIL-R", stock: 0, unit: "lít", status: "out" },
  ];

  return (
    <MobileShell title="Kho & Vật tư">
      <div className="flex flex-col min-h-screen bg-slate-50 font-sans pb-32">
        {/* Header Dashboard */}
        <div className="px-6 pt-10 pb-12 bg-indigo-950 rounded-b-[2.5rem] shadow-2xl relative overflow-hidden">
           <div className="relative z-10 grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                 <Box className="h-4 w-4 text-indigo-300 mb-2" />
                 <p className="text-xl font-black text-white italic">1.240</p>
                 <span className="text-[8px] font-bold text-white/50 uppercase tracking-widest">Mã linh kiện</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                 <AlertTriangle className="h-4 w-4 text-amber-400 mb-2" />
                 <p className="text-xl font-black text-white italic">08</p>
                 <span className="text-[8px] font-bold text-white/50 uppercase tracking-widest">Sắp hết hàng</span>
              </div>
           </div>
        </div>

        {/* Search & Actions */}
        <div className="px-6 -mt-6 mb-8 relative z-20">
           <div className="bg-white p-2 rounded-2xl shadow-xl flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                 <Search className="h-4 w-4 text-slate-400" />
                 <input placeholder="Tìm mã linh kiện..." className="bg-transparent border-none text-[13px] font-medium focus:ring-0 w-full" />
              </div>
              <button className="h-10 w-10 flex items-center justify-center bg-indigo-600 rounded-xl shadow-lg active:scale-95 transition-all">
                 <Filter className="h-5 w-5 text-white" />
              </button>
           </div>
        </div>

        {/* Inventory Actions - Role-based */}
        <div className="px-6 grid grid-cols-3 gap-3 mb-8">
           {[
              { label: "Nhập kho", icon: Plus, show: role === "admin" },
              { label: "Điều chuyển", icon: ArrowRightLeft, show: role === "admin" },
              { label: "Yêu cầu", icon: Truck, show: true },
           ].filter(a => a.show).map(act => (
              <button key={act.label} className="p-3 bg-white rounded-2xl border border-slate-100 flex flex-col items-center gap-2 shadow-sm active:bg-slate-50 transition-all">
                 <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <act.icon className="h-4 w-4" />
                 </div>
                 <span className="text-[9px] font-black uppercase text-slate-700">{act.label}</span>
              </button>
           ))}
        </div>

        {/* Items List */}
        <section className="px-6">
           <div className="flex items-center justify-between mb-5">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Tồn kho chi tiết_</h3>
              <BarChart3 className="h-4 w-4 text-slate-300" />
           </div>

           <div className="space-y-3">
              {items.map((item) => (
                 <Card key={item.code} className="p-4 border-slate-100 shadow-sm rounded-2xl bg-white active:scale-[0.98] transition-all flex items-center gap-4 group">
                    <div className={cn(
                       "h-12 w-12 rounded-xl flex items-center justify-center shrink-0 shadow-inner italic font-black text-xs",
                       item.status === "ok" ? "bg-emerald-50 text-emerald-600" : 
                       item.status === "low" ? "bg-amber-50 text-amber-600" : "bg-rose-50 text-rose-600"
                    )}>
                       {item.stock}
                    </div>
                    <div className="flex-1 min-w-0">
                       <h4 className="text-[13px] font-black text-slate-900 leading-tight italic truncate mb-1 uppercase tracking-tight">{item.name}</h4>
                       <div className="flex items-center gap-2">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.code}</span>
                          <span className="text-slate-200">•</span>
                          <span className="text-[9px] font-bold text-slate-500 uppercase">{item.unit}</span>
                       </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-200 group-active:text-indigo-400" />
                 </Card>
              ))}
           </div>
        </section>

        {/* Low Stock Banner */}
        <div className="mt-10 px-6">
           <div className="p-5 bg-rose-50 border border-rose-100 rounded-[2rem] flex items-center gap-4">
              <div className="h-10 w-10 bg-rose-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-rose-200">
                 <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-rose-600 uppercase mb-0.5">Cảnh báo hệ thống</p>
                 <p className="text-[11px] font-medium text-rose-900 leading-tight">Có 8 linh kiện đang dưới mức tồn kho an toàn. Cần nhập hàng!</p>
              </div>
           </div>
        </div>
      </div>
    </MobileShell>
  );
}
