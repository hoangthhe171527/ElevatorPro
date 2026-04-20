import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/layout/MobileShell";
import { Card } from "@/components/ui/card";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Briefcase,
  Wrench,
  Users,
  ChevronRight,
  Filter
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from "recharts";
import { formatVND } from "@/lib/mock-data";

export const Route = createFileRoute("/mobile/reports")({
  head: () => ({ meta: [{ title: "Báo cáo phân tích — Mobile" }] }),
  component: MobileReports,
});

const revenueData = [
  { name: "T1", value: 400 },
  { name: "T2", value: 300 },
  { name: "T3", value: 500 },
  { name: "T4", value: 450 },
  { name: "T5", value: 600 },
];

const pieData = [
  { name: "Bảo trì", value: 45, color: "#6366f1" },
  { name: "Sửa chữa", value: 30, color: "#f59e0b" },
  { name: "Lắp mới", value: 25, color: "#10b981" },
];

function MobileReports() {
  return (
    <MobileShell title="Báo cáo & Phân tích">
      <div className="flex flex-col pb-24 px-6 space-y-6">
        {/* Filter Action */}
        <div className="flex justify-end pt-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600">
            <Filter className="h-4 w-4" /> THÁNG NÀY
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-5 border-none shadow-sm bg-indigo-600 text-white rounded-[2rem] space-y-2">
            <div className="h-10 w-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase opacity-60 tracking-widest">Doanh thu</p>
              <p className="text-lg font-black italic">{formatVND(1250000000)}</p>
              <div className="flex items-center gap-1 text-[8px] font-bold text-emerald-300 mt-1 uppercase">
                <TrendingUp className="h-3 w-3" /> +12.5%
              </div>
            </div>
          </Card>

          <Card className="p-5 border-none shadow-sm bg-white rounded-[2rem] space-y-2">
            <div className="h-10 w-10 rounded-2xl bg-amber-50 flex items-center justify-center">
              <Wrench className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Công việc</p>
              <p className="text-xl font-black text-slate-900 italic">142</p>
              <div className="flex items-center gap-1 text-[8px] font-bold text-rose-500 mt-1 uppercase">
                <TrendingDown className="h-3 w-3" /> -2.4%
              </div>
            </div>
          </Card>
        </div>

        {/* Real Chart 1: Revenue Trend */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] px-1">Xu hướng doanh thu</h3>
          <Card className="p-4 border-none shadow-sm bg-white rounded-[2.5rem] overflow-hidden">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 900, fill: "#94a3b8" }} 
                  />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{ fill: "#f8fafc" }}
                    contentStyle={{ borderRadius: "1rem", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                  />
                  <Bar dataKey="value" radius={[6, 6, 6, 6]} barSize={32}>
                    {revenueData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === revenueData.length - 1 ? "#6366f1" : "#e2e8f0"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </section>

        {/* Real Chart 2: Service Distribution */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] px-1">Phân bổ dịch vụ</h3>
          <Card className="p-6 border-none shadow-sm bg-white rounded-[2.5rem] flex items-center">
            <div className="h-40 w-40 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-3 pl-4">
              {pieData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-[10px] font-black text-slate-500 uppercase">{item.name}</span>
                  </div>
                  <span className="text-[11px] font-black text-slate-900 italic">{item.value}%</span>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* Operational Efficiency */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] px-1">Hiệu suất vận hành</h3>
          <Card className="p-5 border-none shadow-sm bg-white rounded-[2.2rem] space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-emerald-50 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-800 uppercase italic">Tỷ lệ hoàn thành</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase italic">Mục tiêu: 95%</p>
                </div>
              </div>
              <span className="text-xl font-black text-emerald-500 italic">98.2%</span>
            </div>
            <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 w-[98.2%] rounded-full" />
            </div>
          </Card>
        </section>
      </div>
    </MobileShell>
  );
}
