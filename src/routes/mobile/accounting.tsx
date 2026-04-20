import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/layout/MobileShell";
import { Card } from "@/components/ui/card";
import { 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Receipt, 
  Wallet,
  Calendar,
  Filter,
  Search,
  ChevronRight,
  TrendingUp,
  LayoutDashboard
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/mobile/accounting")({
  component: MobileAccounting,
});

function MobileAccounting() {
  const transactions = [
    { id: 1, title: "Hợp đồng Vincom", amount: "+45.000.000", type: "income", date: "Hôm nay", category: "Dịch vụ" },
    { id: 2, title: "Linh kiện thang máy", amount: "-12.500.000", type: "expense", date: "Hôm qua", category: "Vật tư" },
    { id: 3, title: "Lương kỹ thuật (T3)", amount: "-150.000.000", type: "expense", date: "15 Th04", category: "Nhân sự" },
    { id: 4, title: "Bitexco Maintenance", amount: "+8.200.000", type: "income", date: "12 Th04", category: "Bảo trì" },
  ];

  return (
    <MobileShell title="Quản lý Tài chính" hideHeader={true}>
      <div className="flex flex-col min-h-screen bg-slate-50 font-sans pb-32">
        {/* Balance Card */}
        <div className="px-6 pt-10 pb-16 bg-slate-900 rounded-b-[2.5rem] relative overflow-hidden shadow-2xl">
           <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -mr-32 -mt-32 blur-3xl" />
           
           <div className="relative z-10 flex flex-col items-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Tổng số dư khả dụng</p>
              <h2 className="text-3xl font-black text-white italic tracking-tighter mb-8">1.240.500.000<span className="text-sm font-bold text-emerald-400 ml-1">₫</span></h2>
              
              <div className="grid grid-cols-2 gap-4 w-full">
                 <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
                    <div className="flex items-center gap-2 mb-1">
                       <ArrowUpRight className="h-4 w-4 text-emerald-400" />
                       <span className="text-[9px] font-black text-slate-400 uppercase">Thu nhập</span>
                    </div>
                    <p className="text-sm font-black text-white tracking-tight">+540M <span className="text-[10px] text-emerald-400/60">↑</span></p>
                 </div>
                 <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
                    <div className="flex items-center gap-2 mb-1">
                       <ArrowDownLeft className="h-4 w-4 text-rose-400" />
                       <span className="text-[9px] font-black text-slate-400 uppercase">Chi phí</span>
                    </div>
                    <p className="text-sm font-black text-white tracking-tight">-162M <span className="text-[10px] text-rose-400/60">↓</span></p>
                 </div>
              </div>
           </div>
        </div>

        {/* Quick Actions */}
        <div className="px-6 -mt-8 relative z-20 mb-8">
           <div className="bg-white p-2 rounded-2xl shadow-xl shadow-slate-900/5 ring-1 ring-slate-200/50 grid grid-cols-4 gap-2">
              {[
                { label: "Thu tiền", icon: Wallet, color: "text-emerald-600 bg-emerald-50" },
                { label: "Chi phí", icon: Receipt, color: "text-rose-600 bg-rose-50" },
                { label: "Hóa đơn", icon: LayoutDashboard, color: "text-indigo-600 bg-indigo-50" },
                { label: "Báo cáo", icon: TrendingUp, color: "text-amber-600 bg-amber-50" },
              ].map((act, i) => (
                <button key={i} className="flex flex-col items-center gap-1.5 p-2 rounded-xl active:bg-slate-50 transition-colors">
                  <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center shadow-sm", act.color)}>
                    <act.icon className="h-5 w-5" />
                  </div>
                  <span className="text-[9px] font-bold text-slate-600 uppercase">{act.label}</span>
                </button>
              ))}
           </div>
        </div>

        {/* Transactions List */}
        <section className="px-6">
           <div className="flex items-center justify-between mb-5">
              <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest italic flex items-center gap-2">
                 <Calendar className="h-3.5 w-3.5 text-indigo-600" /> Giao dịch gần đây
              </h3>
              <button className="h-8 w-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                 <Filter className="h-3.5 w-3.5 text-slate-400" />
              </button>
           </div>

           <div className="space-y-3">
              {transactions.map((tx) => (
                 <Card key={tx.id} className="p-4 border border-slate-100 shadow-sm rounded-2xl bg-white active:scale-[0.98] transition-all flex items-center gap-4">
                    <div className={cn(
                       "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                       tx.type === "income" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                    )}>
                       {tx.type === "income" ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownLeft className="h-5 w-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                       <h4 className="text-[13px] font-black text-slate-900 leading-tight italic truncate mb-0.5">{tx.title}</h4>
                       <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{tx.date}</span>
                          <span className="text-[8px] font-black text-indigo-400 uppercase px-1.5 py-0.5 bg-indigo-50 rounded italic">{tx.category}</span>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className={cn(
                          "text-sm font-black italic",
                          tx.type === "income" ? "text-emerald-600" : "text-rose-600"
                       )}>{tx.amount}₫</p>
                       <ChevronRight className="h-3 w-3 text-slate-300 ml-auto mt-1" />
                    </div>
                 </Card>
              ))}
           </div>
        </section>
      </div>
    </MobileShell>
  );
}
