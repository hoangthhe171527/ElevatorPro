import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/layout/MobileShell";
import { mockInventory, formatVND } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { 
  Package, Box, MapPin, History, Info, ArrowUpRight, 
  ArrowDownLeft, AlertCircle, ShoppingCart, Search, ChevronRight,
  Tool
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useState } from "react";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";

export const Route = createFileRoute("/mobile/inventory/$itemId")({
  head: ({ params }) => ({ meta: [{ title: `Vật tư ${params.itemId}` }] }),
  component: InventoryDetailMobile,
});

function InventoryDetailMobile() {
  const { itemId } = Route.useParams();
  const item = mockInventory.find((i) => i.id === itemId);
  const [requestOpen, setRequestOpen] = useState(false);

  if (!item) {
    return (
      <MobileShell title="Lỗi" showBackButton backLink="/mobile/inventory">
        <div className="p-8 text-center text-slate-400">Không tìm thấy vật tư</div>
      </MobileShell>
    );
  }

  const isLow = item.stock <= item.reorderLevel;

  const handleRequestStock = () => {
    toast.success("YÊU CẦU NHẬP KHO ĐÃ GỬI", {
      description: `Đã gửi yêu cầu nhập thêm ${item.reorderLevel * 2} ${item.unit} cho vật tư ${item.name}.`
    });
    setRequestOpen(false);
  };

  // Mock transaction history
  const transactions = [
    { type: "out", qty: 2, job: "JOB-782", date: "Hôm nay, 14:20", user: "Nguyễn Văn A" },
    { type: "in", qty: 20, job: "PO-991", date: "Hôm qua", user: "Kho tổng" },
    { type: "out", qty: 1, job: "JOB-771", date: "2 ngày trước", user: "Vũ Văn C" },
  ];

  return (
    <MobileShell title={item.name} showBackButton backLink="/mobile/inventory">
      <div className="flex flex-col pb-24">
        {/* Summary Card Header */}
        <div className="px-6 py-6 bg-white border-b border-slate-50">
           <div className="flex justify-between items-start mb-6">
              <div className={cn(
                "h-20 w-20 rounded-[2.5rem] flex items-center justify-center shadow-xl",
                isLow ? "bg-amber-50 text-amber-500 shadow-amber-500/10" : "bg-blue-50 text-blue-500 shadow-blue-500/10"
              )}>
                 <Package className="h-10 w-10" />
              </div>
              <div className="flex flex-col items-end gap-2 text-right">
                {isLow ? (
                  <StatusBadge variant="warning" className="h-6 px-3 text-[10px] font-black uppercase">SẮP HẾT HÀNG</StatusBadge>
                ) : (
                  <StatusBadge variant="secondary" className="h-6 px-3 text-[10px] font-black uppercase">CÒN HÀNG</StatusBadge>
                )}
                <span className="text-[10px] font-bold text-slate-400 font-mono italic tracking-tighter">{item.code}</span>
              </div>
           </div>
           
           <h2 className="text-xl font-black text-slate-900 tracking-tight leading-tight mb-2 uppercase">{item.name}</h2>
           <div className="flex items-center gap-2 text-slate-500 text-[11px] font-bold">
              <Box className="h-3.5 w-3.5 text-slate-400" />
              <span>Phân loại: <span className="text-slate-900 font-black tracking-tight">{item.category}</span></span>
           </div>
        </div>

        {/* Global Stock Stats */}
        <div className="p-6 bg-slate-900 mx-5 rounded-[2.5rem] mt-4 relative overflow-hidden shadow-2xl shadow-slate-900/10">
           <div className="relative z-10 flex justify-between items-end">
              <div>
                 <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.2em] mb-1">Tồn kho hiện tại</p>
                 <div className="flex items-baseline gap-2">
                    <h3 className="text-4xl font-black text-white">{item.stock}</h3>
                    <span className="text-white/60 text-xs font-bold uppercase">{item.unit}</span>
                 </div>
              </div>
              <div className="flex flex-col items-end text-right">
                <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.2em] mb-1">Đã đặt chỗ</p>
                <h4 className="text-xl font-black text-white/80">{item.reserved}</h4>
              </div>
           </div>
           <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        </div>

        <div className="p-6 space-y-8">
           {/* Technical Specs */}
           <section>
              <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1 mb-4 flex items-center gap-2">
                 <Info className="h-3.5 w-3.5" /> Thông số & Lưu kho
              </h3>
              <div className="grid grid-cols-2 gap-4">
                 {[
                    { icon: MapPin, label: "Vị trí kệ", value: item.location, color: "text-blue-500 bg-blue-50" },
                    { icon: AlertCircle, label: "Mức báo động", value: `${item.reorderLevel} ${item.unit}`, color: "text-amber-500 bg-amber-50" },
                    { icon: ShoppingCart, label: "Giá nhập gần nhất", value: formatVND(item.unitPrice), color: "text-emerald-500 bg-emerald-50" },
                    { icon: Search, label: "Mã vạch", value: "QR-TECH-77", color: "text-slate-500 bg-slate-50" },
                 ].map((spec, idx) => (
                    <div key={idx} className="p-4 bg-white rounded-3xl border border-slate-50 shadow-sm">
                       <div className={cn("h-8 w-8 rounded-xl flex items-center justify-center mb-3", spec.color)}>
                          <spec.icon className="h-4 w-4" />
                       </div>
                       <p className="text-[8px] font-black text-slate-400 uppercase tracking-tight">{spec.label}</p>
                       <p className="text-[10px] font-black text-slate-900 mt-1 break-words">{spec.value}</p>
                    </div>
                 ))}
              </div>
           </section>

           {/* Inventory Actions */}
           <section>
              <div className="grid grid-cols-2 gap-3">
                 <Button 
                   onClick={() => setRequestOpen(true)}
                   className="h-16 rounded-[1.5rem] bg-slate-900 text-white font-black text-[10px] uppercase gap-2 flex-col"
                 >
                    <ArrowUpRight className="h-4 w-4 text-emerald-400" /> Yêu cầu nhập
                 </Button>
                 <Button 
                   variant="outline" 
                   className="h-16 rounded-[1.5rem] bg-white border-slate-100 font-black text-[10px] uppercase gap-2 flex-col"
                   onClick={() => toast.info("Chọn phiếu việc để xuất vật tư...")}
                 >
                    <ArrowDownLeft className="h-4 w-4 text-rose-400" /> Xuất lắp đặt
                 </Button>
              </div>
           </section>

           <ConfirmationDialog
             open={requestOpen}
             onOpenChange={setRequestOpen}
             title="Xác nhận yêu cầu nhập hàng"
             description={`Bạn có muốn gửi yêu cầu bộ phận kho nhập thêm ${item.name} (${item.code}) không?`}
             onConfirm={handleRequestStock}
             variant="info"
             icon={<ShoppingCart className="h-5 w-5 text-blue-500" />}
           />

           {/* Recent Transactions */}
           <section className="pb-10">
              <div className="flex items-center justify-between mb-6 px-1">
                 <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                    <History className="h-3.5 w-3.5" /> Lịch sử luân chuyển
                 </h3>
                 <span className="text-[8px] font-black text-primary uppercase underline underline-offset-4 decoration-primary/20">Xem tất cả</span>
              </div>
              
              <div className="space-y-3">
                 {transactions.map((t, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-white rounded-3xl border border-slate-50 active:bg-slate-50 transition-colors">
                       <div className="flex items-center gap-3">
                          <div className={cn(
                            "h-10 w-10 rounded-2xl flex items-center justify-center",
                            t.type === "in" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                          )}>
                             {t.type === "in" ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownLeft className="h-5 w-5" />}
                          </div>
                          <div>
                             <h4 className="text-[11px] font-black text-slate-900">
                               {t.type === "in" ? "Nhập kho" : "Xuất kho"} • <span className="font-mono text-[9px]">{t.qty} {item.unit}</span>
                             </h4>
                             <p className="text-[9px] font-bold text-slate-400 mt-0.5">{t.job} • {t.user}</p>
                          </div>
                       </div>
                       <span className="text-[8px] font-black text-slate-300 uppercase shrink-0">{t.date}</span>
                    </div>
                 ))}
              </div>
           </section>
        </div>
      </div>
    </MobileShell>
  );
}
