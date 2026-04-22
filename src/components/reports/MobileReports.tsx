import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { mockContracts, mockJobs, mockCustomers, mockElevators, formatVND } from "@/lib/mock-data";
import { TrendingUp, Briefcase, FileText, ChevronRight, PieChart } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const months = ["T11/25", "T12/25", "T1/26", "T2/26", "T3/26", "T4/26"];
const monthlyJobs = [18, 22, 25, 19, 28, 24];
const monthlyRevenue = [320, 410, 480, 290, 560, 440];

export function MobileReports() {
  const [period, setPeriod] = useState("T4/26");
  const [activeTab, setActiveTab] = useState("overview");

  const totalRevenue = mockContracts.reduce((s, c) => s + c.paid, 0);
  const totalContractValue = mockContracts.reduce((s, c) => s + c.value, 0);
  const completionRate = Math.round(
    (mockJobs.filter((j) => j.status === "completed").length / mockJobs.length) * 100,
  );

  const maxJobs = Math.max(...monthlyJobs);
  const maxRevenue = Math.max(...monthlyRevenue);

  return (
    <AppShell>
      <PageHeader
        title="Báo cáo"
        description="Dữ liệu kinh doanh & vận hành"
        actions={
          <Button size="sm" variant="outline" className="h-8 rounded-full px-3 text-[10px] font-black uppercase text-primary border-primary bg-primary/5" onClick={() => toast.success("Đã xuất báo cáo gửi tới Zalo Chủ tịch.")}>
            Chia sẻ Zalo
          </Button>
        }
      />

      {/* Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-2xl mb-6 shadow-inner mx-1">
         <button className={cn("flex-1 py-2 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all", activeTab === "overview" ? "bg-white text-primary shadow-sm" : "text-slate-400")} onClick={() => setActiveTab("overview")}>
            Tổng quan
         </button>
         <button className={cn("flex-1 py-2 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all", activeTab === "charts" ? "bg-white text-primary shadow-sm" : "text-slate-400")} onClick={() => setActiveTab("charts")}>
            Biểu đồ
         </button>
      </div>

      {activeTab === "overview" ? (
         <div className="space-y-4 pb-8">
            {/* Giant Metrics Cards */}
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-[24px] p-6 text-white shadow-xl shadow-emerald-500/20 relative overflow-hidden">
               <div className="absolute -right-4 -top-4 opacity-10">
                  <TrendingUp className="h-32 w-32" />
               </div>
               <div className="text-[11px] font-bold text-emerald-100 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5" /> Dòng tiền thực thu
               </div>
               <div className="text-3xl font-black tracking-tight mb-2">{formatVND(totalRevenue)}</div>
               <div className="inline-flex items-center bg-white/20 px-2 py-0.5 rounded-full text-[10px] font-bold">+12% so với tháng trước</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="bg-white rounded-[24px] p-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-slate-100">
                  <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-3">
                     <FileText className="h-5 w-5" />
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Giá trị Hợp đồng</div>
                  <div className="text-lg font-black text-slate-800">{formatVND(totalContractValue)}</div>
               </div>
               <div className="bg-white rounded-[24px] p-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-slate-100">
                  <div className="h-10 w-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500 mb-3">
                     <Briefcase className="h-5 w-5" />
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Tỉ lệ hoàn thành</div>
                  <div className="text-[22px] font-black text-slate-800">{completionRate}%</div>
               </div>
            </div>

            {/* Quick KPI List (Accordion-style data) */}
            <div className="bg-white rounded-[24px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden mt-4">
               <div className="p-4 border-b border-slate-100 flex items-center gap-2">
                  <PieChart className="h-4 w-4 text-primary" />
                  <span className="font-black text-[12px] uppercase tracking-widest text-slate-800">Cơ cấu danh mục</span>
               </div>
               
               <div className="p-4 flex items-center justify-between border-b border-slate-50">
                  <div>
                     <div className="text-[13px] font-bold text-slate-800">Mảng Lắp đặt mới</div>
                     <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Doanh thu cốt lõi</div>
                  </div>
                  <div className="text-right">
                     <div className="text-[13px] font-black text-primary">60%</div>
                     <div className="text-[10px] text-slate-400 font-bold">12 Tỷ</div>
                  </div>
               </div>
               <div className="p-4 flex items-center justify-between border-b border-slate-50">
                  <div>
                     <div className="text-[13px] font-bold text-slate-800">Dịch vụ Bảo trì</div>
                     <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Dòng tiền đều</div>
                  </div>
                  <div className="text-right">
                     <div className="text-[13px] font-black text-emerald-500">25%</div>
                     <div className="text-[10px] text-slate-400 font-bold">5 Tỷ</div>
                  </div>
               </div>
               <div className="p-4 flex items-center justify-between">
                  <div>
                     <div className="text-[13px] font-bold text-slate-800">Sửa chữa & Phụ tùng</div>
                     <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Kênh lợi nhuận mỏng</div>
                  </div>
                  <div className="text-right">
                     <div className="text-[13px] font-black text-orange-500">15%</div>
                     <div className="text-[10px] text-slate-400 font-bold">3 Tỷ</div>
                  </div>
               </div>
            </div>
         </div>
      ) : (
         <div className="space-y-6 pb-8">
            {/* Filter */}
            <div className="flex overflow-x-auto hide-scrollbar gap-2 snap-x px-1">
               {months.map(m => (
                  <button 
                     key={m} 
                     onClick={() => setPeriod(m)}
                     className={cn("px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-widest snap-center whitespace-nowrap transition-all", period === m ? "bg-slate-800 text-white" : "bg-white border border-slate-200 text-slate-500")}
                  >
                     {m}
                  </button>
               ))}
            </div>

            <div className="bg-white rounded-[24px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-slate-100">
               <h3 className="font-black text-[11px] mb-8 text-slate-400 uppercase tracking-widest">
                  Sản lượng Việc Kỹ thuật
               </h3>
               <div className="flex items-end justify-between gap-2 h-40">
               {months.map((m, i) => {
                  const h = (monthlyJobs[i] / maxJobs) * 100;
                  const isSelected = m === period;
                  return (
                     <div key={m} className="flex-1 flex flex-col items-center gap-1.5">
                     <div className="w-full flex flex-col justify-end" style={{ height: "120px" }}>
                        <div
                           className={`w-full rounded-t-lg transition-all relative ${isSelected ? "bg-primary shadow-md shadow-primary/20" : "bg-primary/20"}`}
                           style={{ height: `${Math.max(10, h)}%` }}
                        >
                           {isSelected && <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-black text-primary">{monthlyJobs[i]}</div>}
                        </div>
                     </div>
                     <div className={`text-[9px] font-black ${isSelected ? "text-primary" : "text-slate-400 opacity-50"}`}>{m.split("/")[0]}</div>
                     </div>
                  );
               })}
               </div>
            </div>

            <div className="bg-white rounded-[24px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-slate-100">
               <h3 className="font-black text-[11px] mb-8 text-slate-400 uppercase tracking-widest">
                  Thu hồi tiền (Triệu VNĐ)
               </h3>
               <div className="flex items-end justify-between gap-2 h-40">
               {months.map((m, i) => {
                  const h = (monthlyRevenue[i] / maxRevenue) * 100;
                  const isSelected = m === period;
                  return (
                     <div key={m} className="flex-1 flex flex-col items-center gap-1.5">
                     <div className="w-full flex flex-col justify-end" style={{ height: "120px" }}>
                        <div
                           className={`w-full rounded-t-lg transition-all relative ${isSelected ? "bg-emerald-500 shadow-md shadow-emerald-500/20" : "bg-emerald-500/20"}`}
                           style={{ height: `${Math.max(10, h)}%` }}
                        >
                           {isSelected && <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-black text-emerald-600">{monthlyRevenue[i]}</div>}
                        </div>
                     </div>
                     <div className={`text-[9px] font-black ${isSelected ? "text-emerald-500" : "text-slate-400 opacity-50"}`}>{m.split("/")[0]}</div>
                     </div>
                  );
               })}
               </div>
            </div>
         </div>
      )}
    </AppShell>
  );
}
