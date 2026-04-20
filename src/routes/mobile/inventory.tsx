import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/layout/MobileShell";
import { mockInventory } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Package,
  Search,
  AlertTriangle,
  ChevronRight,
  Filter,
  ArrowDownToLine,
  Navigation,
  Box,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/mobile/inventory")({
  head: () => ({ meta: [{ title: "Kho vật tư — Mobile" }] }),
  component: MobileInventory,
});

function MobileInventory() {
  const [search, setSearch] = useState("");

  const filtered = mockInventory.filter(
    (i) =>
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.code.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <MobileShell title="Quản lý kho">
      {/* Search & Header Stats */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-md z-20 px-5 py-4 border-b">
         <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
               <Box className="h-4 w-4 text-primary" />
               <h3 className="text-sm font-black tracking-tight">{mockInventory.length} Mã vật tư</h3>
            </div>
            <div className="flex gap-2">
               <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl bg-slate-50 border">
                  <Filter className="h-4 w-4 text-slate-500" />
               </Button>
               <Button className="h-9 rounded-xl bg-slate-900 text-white font-black text-[10px] gap-2 px-4 shadow-lg shadow-slate-900/20">
                  NHẬP KHO
               </Button>
            </div>
         </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-50" />
          <Input
            placeholder="Mã hoặc tên vật tư..."
            className="pl-9 h-11 bg-slate-50 border-none shadow-inner rounded-xl text-xs font-bold"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="p-5 space-y-4">
        {filtered.map((item) => {
          const isLow = item.stock <= item.reorderLevel;
          return (
            <Link key={item.id} to="/mobile/inventory/$itemId" params={{ itemId: item.id }}>
              <Card
                className="p-4 shadow-sm border-none bg-white rounded-[1.5rem] active:scale-[0.97] transition-all mb-4"
              >
                <div className="flex gap-4">
                  <div
                    className={cn(
                      "h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 border shadow-inner",
                      isLow
                        ? "bg-amber-50 border-amber-100 text-amber-500"
                        : "bg-blue-50 border-blue-100 text-blue-500",
                    )}
                  >
                    <Package className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-black text-slate-900 text-[13px] leading-tight truncate uppercase">{item.name}</h3>
                        <div className="flex items-center gap-2 mt-1.5 opacity-50">
                           <span className="text-[10px] font-mono font-bold tracking-tight">{item.code}</span>
                        </div>
                      </div>
                      {isLow && <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4 py-3 border-y border-slate-50">
                      <div className="flex flex-col">
                        <span className="text-[8px] text-slate-400 font-black uppercase tracking-widest">
                          Tồn kho
                        </span>
                        <div className="flex items-baseline gap-1 mt-0.5">
                          <span
                            className={cn(
                              "text-sm font-black",
                              isLow ? "text-amber-600" : "text-slate-900",
                            )}
                          >
                            {item.stock}
                          </span>
                          <span className="text-[9px] text-slate-400 font-bold uppercase">
                            {item.unit}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[8px] text-slate-400 font-black uppercase tracking-widest">
                          Vị trí
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                           <Navigation className="h-2.5 w-2.5 text-slate-300" />
                           <span className="text-[10px] font-black text-slate-500 uppercase tracking-tight">
                              {item.location}
                           </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                       {isLow ? (
                         <div className="flex items-center gap-1.5 text-amber-600 animate-pulse">
                            <AlertTriangle className="h-3.5 w-3.5" />
                            <span className="text-[9px] font-black uppercase italic tracking-tighter">Cần nhập thêm</span>
                         </div>
                       ) : (
                         <div className="flex items-center gap-1.5 text-emerald-500">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span className="text-[9px] font-black uppercase tracking-tighter">Sẵn sàng</span>
                         </div>
                       )}
                       <div className="flex gap-2">
                          {isLow && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-8 rounded-xl border-amber-200 bg-amber-50 text-amber-600 text-[9px] font-black uppercase px-3 shadow-sm active:scale-95 transition-all"
                              onClick={(e) => {
                                e.preventDefault();
                                toast.success("Đã gửi yêu cầu nhập vật tư!");
                              }}
                            >
                              Yêu cầu
                            </Button>
                          )}
                          <div className="text-primary font-black text-[10px] flex items-center gap-1 uppercase tracking-tighter bg-primary/5 px-3 py-1.5 rounded-xl">
                             CHI TIẾT <ChevronRight className="h-3 w-3" />
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
            </Card>
          </Link>
          );
        })}
      </div>
    </MobileShell>
  );
}
