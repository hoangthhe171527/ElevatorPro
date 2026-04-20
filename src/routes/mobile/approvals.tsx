import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/layout/MobileShell";
import { Card } from "@/components/ui/card";
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Package, 
  CreditCard, 
  Zap,
  ChevronRight,
  Filter,
  ArrowUpRight
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/mobile/approvals")({
  component: MobileApprovals,
});

function MobileApprovals() {
  const requests = [
    { id: "REQ-901", title: "Thay cáp tải - Toyota Showroom", type: "material", value: "45.000.000đ", requester: "Kỹ thuật An", time: "10 phút trước", priority: "high" },
    { id: "REQ-902", title: "Nghiệm thu định kỳ - VinHome G1", type: "service", value: "1.200.000đ", requester: "Kỹ thuật Bình", time: "1 giờ trước", priority: "normal" },
    { id: "REQ-903", title: "Tạm ứng vật tư sửa chữa máy kéo", type: "budget", value: "5.500.000đ", requester: "Kỹ thuật Cường", time: "3 giờ trước", priority: "high" },
  ];

  const getIcon = (type: string) => {
    switch(type) {
      case "material": return Package;
      case "budget": return CreditCard;
      default: return Zap;
    }
  };

  return (
    <MobileShell title="Trung tâm Phê duyệt">
      <div className="flex flex-col min-h-screen bg-slate-50 font-sans pb-32">
        {/* Quick Filter Tabs */}
        <div className="px-6 pt-6 pb-2 bg-white border-b border-slate-100 flex items-center gap-6 overflow-x-auto no-scrollbar sticky top-0 z-30">
           {["Tất cả", "Vật tư", "Tài chính", "Dịch vụ"].map((tab, i) => (
              <button key={tab} className={cn(
                 "text-[11px] font-black uppercase tracking-widest whitespace-nowrap pb-3 border-b-2 transition-all",
                 i === 0 ? "border-indigo-600 text-slate-900" : "border-transparent text-slate-400"
              )}>{tab}</button>
           ))}
        </div>

        {/* Dynamic List */}
        <section className="px-6 mt-6">
           <div className="flex items-center justify-between mb-5">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] flex items-center gap-2">
                 Chờ phê duyệt ({requests.length})_
              </h3>
              <Filter className="h-4 w-4 text-slate-300" />
           </div>

           <div className="space-y-4">
              {requests.map((req) => {
                 const Icon = getIcon(req.type);
                 return (
                    <Card key={req.id} className="p-0 border-none shadow-[0_8px_30px_rgba(0,0,0,0.04)] rounded-[1.8rem] bg-white overflow-hidden group">
                       <div className="p-5 flex items-start gap-4">
                          <div className={cn(
                             "h-12 w-12 rounded-2xl flex flex-col items-center justify-center shrink-0 shadow-lg",
                             req.priority === "high" ? "bg-rose-500 shadow-rose-200" : "bg-slate-900"
                          )}>
                             <Icon className={cn("h-6 w-6 text-white", req.priority === "high" && "animate-pulse")} />
                          </div>
                          <div className="flex-1 min-w-0">
                             <div className="flex items-center justify-between mb-1">
                                <span className="text-[8px] font-black text-indigo-500 uppercase tracking-widest">{req.id}</span>
                                <span className="text-[9px] font-bold text-slate-400 uppercase">{req.time}</span>
                             </div>
                             <h4 className="text-[14px] font-black text-slate-900 leading-tight italic truncate mb-2 uppercase tracking-tight">{req.title}</h4>
                             <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                   <div className="h-5 w-5 rounded-full bg-slate-100 flex items-center justify-center">
                                      <span className="text-[8px] font-black">{req.requester.charAt(8)}</span>
                                   </div>
                                   <span className="text-[10px] font-bold text-slate-500 uppercase">{req.requester}</span>
                                </div>
                                <div className="text-right">
                                   <p className="text-[12px] font-black text-rose-600 italic leading-none mb-0.5">{req.value}</p>
                                   <p className="text-[7px] font-bold text-slate-400 uppercase leading-none">Ước tính</p>
                                </div>
                             </div>
                          </div>
                       </div>
                       
                       {/* Action Bar - Fast Approve/Reject */}
                       <div className="flex border-t border-slate-50 bg-slate-50/50 p-3 gap-3">
                          <button className="flex-1 h-12 bg-white rounded-xl border border-slate-200 text-[10px] font-black uppercase text-rose-500 flex items-center justify-center gap-2 active:bg-rose-50 transition-all shadow-sm">
                             <XCircle className="h-4 w-4" /> Từ chối
                          </button>
                          <button className="flex-2 h-12 bg-indigo-600 rounded-xl text-[10px] font-black uppercase text-white flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-lg shadow-indigo-200">
                             <CheckCircle2 className="h-4 w-4" /> Phê duyệt ngay
                          </button>
                       </div>
                    </Card>
                 );
              })}
           </div>
        </section>

        {/* BI Widget Recommendation */}
        <div className="px-6 mt-10">
           <Card className="p-5 bg-gradient-to-br from-slate-900 to-indigo-950 rounded-[2rem] border-none shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
              <div className="relative z-10">
                 <div className="flex justify-between items-start mb-4">
                    <p className="text-[9px] font-black text-indigo-300 uppercase tracking-[0.3em]">Insights_</p>
                    <ArrowUpRight className="h-4 w-4 text-white/50" />
                 </div>
                 <h3 className="text-lg font-black text-white italic leading-tight mb-1 uppercase tracking-tighter">Budget Utilization</h3>
                 <div className="flex items-end gap-3 mb-4">
                    <p className="text-2xl font-black text-white italic">72<span className="text-sm opacity-50 ml-0.5">%</span></p>
                    <div className="h-10 flex-1 flex items-end gap-1 pb-1">
                       {[0.4, 0.7, 0.5, 0.9, 0.6, 0.8, 0.72].map((v, i) => (
                          <div key={i} className="flex-1 bg-white/10 rounded-t-sm relative" style={{ height: `${v * 100}%` }}>
                             {i === 6 && <div className="absolute inset-0 bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.5)]" />}
                          </div>
                       ))}
                    </div>
                 </div>
                 <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest leading-relaxed">
                    Ngân sách vật tư tháng 4 đang ở mức kiểm soát. <br/>Dự kiến tăng +12% vào tuần sau.
                 </p>
              </div>
           </Card>
        </div>
      </div>
    </MobileShell>
  );
}
