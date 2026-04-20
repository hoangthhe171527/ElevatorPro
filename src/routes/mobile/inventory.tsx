import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/layout/MobileShell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Package, 
  Search, 
  Scan, 
  ArrowRightLeft, 
  History, 
  AlertTriangle,
  ChevronRight,
  Filter,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/mobile/inventory")({
  component: MobileInventory,
});

function MobileInventory() {
  const items = [
    { id: "M01", name: "Cáp tải 12mm", stock: 45, unit: "m", status: "ok" },
    { id: "M02", name: "Biến tần Fuji 15kW", stock: 3, unit: "bộ", status: "low" },
    { id: "M03", name: "Nút bấm cabin", stock: 120, unit: "cái", status: "ok" },
    { id: "M04", name: "Dầu máy ray", stock: 15, unit: "lít", status: "low" },
  ];

  return (
    <MobileShell title="Kho vật tư" hideHeader={true}>
      <div className="flex flex-col min-h-screen bg-slate-50 font-sans pb-32">
        {/* Header Section */}
        <div className="px-6 pt-10 pb-12 bg-indigo-900 rounded-b-[2.5rem] shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-24 -mt-24 blur-3xl" />
           
           <div className="relative z-10 flex justify-between items-center mb-6">
              <div>
                 <h2 className="text-xl font-black text-white italic tracking-tighter leading-none mb-1">Quản lý Kho_</h2>
                 <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">1,240 linh kiện trong kho</p>
              </div>
              <button className="h-10 w-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white active:scale-95 transition-all">
                 <Plus className="h-5 w-5" />
              </button>
           </div>

           <div className="relative z-10 grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                 <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-amber-400" />
                    <span className="text-[9px] font-bold text-white/70 uppercase">Sắp hết</span>
                 </div>
                 <p className="text-lg font-black text-white italic leading-none">12 <span className="text-[10px] font-bold text-amber-400 uppercase ml-1 tracking-tighter">mục</span></p>
              </div>
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                 <div className="flex items-center gap-2 mb-2">
                    <ArrowRightLeft className="h-4 w-4 text-emerald-400" />
                    <span className="text-[9px] font-bold text-white/70 uppercase">Đang chuyển</span>
                 </div>
                 <p className="text-lg font-black text-white italic leading-none">05 <span className="text-[10px] font-bold text-emerald-400 uppercase ml-1 tracking-tighter">đơn</span></p>
              </div>
           </div>
        </div>

        {/* Quick Search & Actions */}
        <div className="px-6 -mt-6 mb-8 relative z-20">
           <div className="bg-white p-2 rounded-2xl shadow-xl shadow-slate-900/5 ring-1 ring-slate-200/50 flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                 <Search className="h-4 w-4 text-slate-400" />
                 <input placeholder="Tên, mã linh kiện..." className="bg-transparent border-none text-[13px] font-medium focus:ring-0 w-full text-slate-900" />
              </div>
              <Link to="/mobile/scanner" className="h-10 w-10 flex items-center justify-center bg-slate-900 rounded-xl active:scale-95 transition-all shadow-md">
                 <Scan className="h-5 w-5 text-white" />
              </Link>
           </div>
        </div>

        {/* Inventory Items */}
        <section className="px-6">
           <div className="flex items-center justify-between mb-5">
              <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.15em] italic flex items-center gap-2">
                 <Package className="h-4 w-4 text-indigo-600" /> Vật tư tồn kho
              </h3>
              <button className="h-8 w-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                 <Filter className="h-3.5 w-3.5 text-slate-400" />
              </button>
           </div>

           <div className="space-y-3">
              {items.map((item) => (
                 <Link key={item.id} to={`/mobile/inventory/${item.id}`}>
                    <Card className="p-4 border border-slate-100 shadow-sm rounded-2xl bg-white active:scale-[0.98] transition-all flex items-center gap-4">
                       <div className={cn(
                          "h-12 w-12 rounded-xl flex items-center justify-center shrink-0 border",
                          item.status === "low" ? "bg-amber-50 border-amber-100 text-amber-600" : "bg-slate-50 border-slate-100 text-slate-500"
                       )}>
                          <Package className="h-6 w-6" />
                       </div>
                       <div className="flex-1 min-w-0">
                          <h4 className="text-[13px] font-black text-slate-900 leading-tight italic truncate mb-1 uppercase tracking-tight">{item.name}</h4>
                          <div className="flex items-center gap-2">
                             <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.id}</span>
                             {item.status === "low" && (
                                <span className="text-[8px] font-black text-amber-600 uppercase px-1.5 py-0.5 bg-amber-50 rounded italic ring-1 ring-amber-100">Cần nhập kho</span>
                             )}
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-sm font-black italic text-slate-900 leading-none mb-1">{item.stock}</p>
                          <p className="text-[9px] font-black text-slate-400 uppercase">{item.unit}</p>
                       </div>
                       <ChevronRight className="h-4 w-4 text-slate-200 ml-1" />
                    </Card>
                 </Link>
              ))}
           </div>
        </section>

        {/* Floating Stock History Link */}
        <div className="fixed bottom-24 left-6 right-6">
           <button className="w-full h-12 bg-white rounded-2xl border border-slate-200 shadow-lg flex items-center justify-center gap-3 active:bg-slate-50 transition-colors">
              <History className="h-4 w-4 text-indigo-600" />
              <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Lịch sử xuất nhập kho</span>
           </button>
        </div>
      </div>
    </MobileShell>
  );
}
