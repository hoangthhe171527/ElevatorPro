import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/layout/MobileShell";
import { mockContracts, mockJobs, mockCustomers, mockElevators, formatVND } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import {
  BarChart3, TrendingUp, TrendingDown, Users, Briefcase,
  Calendar, Filter, Download, FileText, Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/mobile/reports")({
  head: () => ({ meta: [{ title: "Báo cáo — Mobile" }] }),
  component: MobileReports,
});

const months = ["T11/25", "T12/25", "T1/26", "T2/26", "T3/26", "T4/26"];
const monthlyJobs = [18, 22, 25, 19, 28, 24];
const monthlyRevenue = [320, 410, 480, 290, 560, 440];

const typeLabel: Record<string, string> = { install: "Lắp đặt", maintenance: "Bảo trì", repair: "Sửa chữa" };
const typeColorBar: Record<string, string> = { install: "bg-primary", maintenance: "bg-emerald-500", repair: "bg-amber-500" };

const statusLabel: Record<string, string> = {
  pending: "Chờ", scheduled: "Đã lên lịch", in_progress: "Đang làm",
  completed: "Hoàn thành", cancelled: "Hủy",
};
const statusColorBar: Record<string, string> = {
  pending: "bg-slate-400", scheduled: "bg-blue-500", in_progress: "bg-amber-500",
  completed: "bg-emerald-500", cancelled: "bg-rose-500",
};

function MobileReports() {
  const [activePeriod, setActivePeriod] = useState(5); // index T4/26
  const activeTenantId = useAppStore((s) => s.activeTenantId);

  // Dữ liệu thực theo tenant
  const tenantContracts = mockContracts.filter((c) => c.tenantId === activeTenantId);
  const tenantJobs = mockJobs.filter((j) => j.tenantId === activeTenantId);
  const tenantCustomers = mockCustomers.filter((c) => c.tenantId === activeTenantId);
  const tenantElevators = mockElevators.filter((e) => e.tenantId === activeTenantId);

  const totalRevenue = tenantContracts.reduce((s, c) => s + c.paid, 0);
  const totalContractValue = tenantContracts.reduce((s, c) => s + c.value, 0);
  const completionRate = tenantJobs.length > 0
    ? Math.round((tenantJobs.filter((j) => j.status === "completed").length / tenantJobs.length) * 100)
    : 0;

  // Doanh thu theo loại HĐ
  const byType = tenantContracts.reduce((acc, c) => {
    acc[c.type] = (acc[c.type] || 0) + c.value;
    return acc;
  }, {} as Record<string, number>);

  // Jobs theo status
  const jobByStatus = tenantJobs.reduce((acc, j) => {
    acc[j.status] = (acc[j.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const maxJobs = Math.max(...monthlyJobs);
  const maxRevenue = Math.max(...monthlyRevenue);

  const kpis = [
    { label: "Doanh thu thu được", value: formatVND(totalRevenue), icon: TrendingUp, color: "bg-emerald-50 text-emerald-600", trend: "+12%" },
    { label: "Giá trị HĐ ký", value: formatVND(totalContractValue), icon: FileText, color: "bg-primary/10 text-primary", trend: "+5%" },
    { label: "Tỉ lệ hoàn thành", value: `${completionRate}%`, icon: Briefcase, color: "bg-blue-50 text-blue-600", trend: completionRate > 70 ? "+tốt" : "-cần cải thiện" },
    { label: "KH / Thang", value: `${tenantCustomers.length} / ${tenantElevators.length}`, icon: Building2, color: "bg-violet-50 text-violet-600", trend: "" },
  ];

  return (
    <MobileShell title="Báo cáo & Phân tích">
      {/* Header Bar */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-3xl z-20 px-5 py-3 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
            <Calendar className="h-4 w-4 text-primary" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-700">{months[activePeriod]}</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-[9px] font-black text-slate-500 gap-1.5 rounded-xl border-slate-200 uppercase"
          onClick={() => toast.success(`Đang xuất báo cáo ${months[activePeriod]} ra PDF...`)}
        >
          <Download className="h-3 w-3" /> Xuất PDF
        </Button>
      </div>

      <div className="p-5 space-y-6">
        {/* 4 KPI Cards (dữ liệu thực) */}
        <div className="grid grid-cols-2 gap-3">
          {kpis.map((kpi, idx) => {
            const Icon = kpi.icon;
            const isPositive = kpi.trend.startsWith("+");
            return (
              <Card key={idx} className="p-4 border-none shadow-sm bg-white rounded-[1.5rem]">
                <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center mb-3", kpi.color)}>
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-tight">{kpi.label}</p>
                <p className="text-sm font-black text-slate-900 mt-1 leading-tight">{kpi.value}</p>
                {kpi.trend && (
                  <div className={cn(
                    "flex items-center gap-1 mt-2 text-[8px] font-black",
                    isPositive ? "text-emerald-600" : "text-orange-500"
                  )}>
                    {isPositive ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
                    {kpi.trend}
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Bar Chart: Jobs 6 tháng (interactive) */}
        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Công việc 6 tháng</h3>
            <span className="text-[9px] text-primary font-black">{monthlyJobs[activePeriod]} CV</span>
          </div>
          <Card className="p-5 border-none shadow-sm bg-white rounded-[2rem] overflow-hidden">
            <div className="h-32 flex items-end justify-between gap-1.5 px-1">
              {months.map((m, i) => {
                const h = (monthlyJobs[i] / maxJobs) * 100;
                const isSelected = i === activePeriod;
                return (
                  <button key={m} className="flex-1 flex flex-col items-center gap-1.5 group" onClick={() => setActivePeriod(i)}>
                    <div className="w-full flex flex-col justify-end" style={{ height: "96px" }}>
                      <div
                        className={cn("w-full rounded-t-lg transition-all", isSelected ? "bg-primary" : "bg-primary/20 group-hover:bg-primary/40")}
                        style={{ height: `${h}%` }}
                      />
                    </div>
                    <span className={cn("text-[7px] font-black leading-none", isSelected ? "text-primary" : "text-slate-300")}>{m}</span>
                  </button>
                );
              })}
            </div>
          </Card>
        </section>

        {/* Bar Chart: Doanh thu 6 tháng */}
        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Doanh thu 6 tháng (triệu)</h3>
            <span className="text-[9px] text-emerald-600 font-black">{monthlyRevenue[activePeriod]}M</span>
          </div>
          <Card className="p-5 border-none shadow-sm bg-white rounded-[2rem] overflow-hidden">
            <div className="h-32 flex items-end justify-between gap-1.5 px-1">
              {months.map((m, i) => {
                const h = (monthlyRevenue[i] / maxRevenue) * 100;
                const isSelected = i === activePeriod;
                return (
                  <button key={m} className="flex-1 flex flex-col items-center gap-1.5 group" onClick={() => setActivePeriod(i)}>
                    <div className="w-full flex flex-col justify-end" style={{ height: "96px" }}>
                      <div
                        className={cn("w-full rounded-t-lg transition-all", isSelected ? "bg-emerald-500" : "bg-emerald-400/25 group-hover:bg-emerald-400/50")}
                        style={{ height: `${h}%` }}
                      />
                    </div>
                    <span className={cn("text-[7px] font-black leading-none", isSelected ? "text-emerald-600" : "text-slate-300")}>{m}</span>
                  </button>
                );
              })}
            </div>
          </Card>
        </section>

        {/* Doanh thu theo loại HĐ (dữ liệu thực) */}
        {Object.keys(byType).length > 0 && (
          <section>
            <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3 px-1">Doanh thu theo loại HĐ</h3>
            <Card className="p-5 border-none shadow-sm bg-white rounded-[2rem]">
              <div className="space-y-4">
                {Object.entries(byType).map(([type, value]) => {
                  const percent = totalContractValue > 0 ? Math.round((value / totalContractValue) * 100) : 0;
                  return (
                    <div key={type}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[10px] font-black text-slate-700 uppercase">{typeLabel[type] || type}</span>
                        <span className="text-[9px] font-black text-slate-400">{formatVND(value)} · {percent}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className={cn("h-full rounded-full transition-all", typeColorBar[type] || "bg-slate-400")} style={{ width: `${percent}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </section>
        )}

        {/* Phân bố trạng thái Job (dữ liệu thực) */}
        {Object.keys(jobByStatus).length > 0 && (
          <section>
            <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3 px-1">Phân bố trạng thái công việc</h3>
            <Card className="p-5 border-none shadow-sm bg-white rounded-[2rem]">
              <div className="space-y-4">
                {Object.entries(jobByStatus).map(([status, count]) => {
                  const percent = tenantJobs.length > 0 ? Math.round((count / tenantJobs.length) * 100) : 0;
                  return (
                    <div key={status}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[10px] font-black text-slate-700 uppercase">{statusLabel[status] || status}</span>
                        <span className="text-[9px] font-black text-slate-400">{count} · {percent}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className={cn("h-full rounded-full transition-all", statusColorBar[status] || "bg-slate-400")} style={{ width: `${percent}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </section>
        )}
      </div>
    </MobileShell>
  );
}
