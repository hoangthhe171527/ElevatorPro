import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/common/StatCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockContracts, mockJobs, mockCustomers, mockElevators, formatVND } from "@/lib/mock-data";
import { TrendingUp, Briefcase, Users, FileText, Download } from "lucide-react";
import { toast } from "sonner";

const months = ["T11/2025", "T12/2025", "T1/2026", "T2/2026", "T3/2026", "T4/2026"];
const monthlyJobs = [18, 22, 25, 19, 28, 24];
const monthlyRevenue = [320, 410, 480, 290, 560, 440];

export function WebReports() {
  const [period, setPeriod] = useState("T4/2026");

  const totalRevenue = mockContracts.reduce((s, c) => s + c.paid, 0);
  const totalContractValue = mockContracts.reduce((s, c) => s + c.value, 0);
  const completionRate = Math.round(
    (mockJobs.filter((j) => j.status === "completed").length / mockJobs.length) * 100,
  );

  const byType = mockContracts.reduce(
    (acc, c) => {
      acc[c.type] = (acc[c.type] || 0) + c.value;
      return acc;
    },
    {} as Record<string, number>,
  );

  const typeLabel: Record<string, string> = {
    install: "Lắp đặt",
    maintenance: "Bảo trì",
    repair: "Sửa chữa",
  };
  const typeColor: Record<string, string> = {
    install: "bg-primary",
    maintenance: "bg-success",
    repair: "bg-warning",
  };

  const jobByStatus = mockJobs.reduce(
    (acc, j) => {
      acc[j.status] = (acc[j.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const statusLabel: Record<string, string> = {
    pending: "Chờ",
    scheduled: "Đã lên lịch",
    in_progress: "Đang làm",
    completed: "Hoàn thành",
    cancelled: "Hủy",
  };
  const statusColor: Record<string, string> = {
    pending: "bg-muted-foreground",
    scheduled: "bg-info",
    in_progress: "bg-warning",
    completed: "bg-success",
    cancelled: "bg-destructive",
  };

  const maxJobs = Math.max(...monthlyJobs);
  const maxRevenue = Math.max(...monthlyRevenue);

  return (
    <AppShell>
      <PageHeader
        title="Báo cáo & phân tích"
        description="Tổng quan hiệu suất kinh doanh và vận hành dành cho Ban Giám Đốc"
        actions={
          <div className="flex gap-3">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-40 border-slate-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {months.map((m) => (
                  <SelectItem key={m} value={m}>
                    Kỳ {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => toast.success(`Đang xuất báo cáo tài chính ${period} ra PDF...`)}
              className="border-slate-200 shadow-sm"
            >
              <Download className="h-4 w-4 mr-1.5" /> Xuất PDF
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard
          label="Dòng tiền thực thu"
          value={formatVND(totalRevenue)}
          icon={TrendingUp}
          accent="success"
          trend={{ value: "12% so với tháng trước", positive: true }}
        />
        <StatCard
          label="Tổng giá trị Hợp đồng"
          value={formatVND(totalContractValue)}
          icon={FileText}
          accent="primary"
        />
        <StatCard
          label="Hiệu suất hoàn thành"
          value={`${completionRate}%`}
          icon={Briefcase}
          accent="warning"
        />
        <StatCard
          label="Khách hàng / Thang máy"
          value={`${mockCustomers.length} / ${mockElevators.length}`}
          icon={Users}
          accent="info"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        {/* Revenue by type */}
        <Card className="p-8 shadow-sm border-slate-100 rounded-3xl">
          <h3 className="font-black text-lg mb-6 text-slate-800">Cơ cấu Doanh thu</h3>
          <div className="space-y-6">
            {Object.entries(byType).map(([type, value]) => {
              const percent = Math.round((value / totalContractValue) * 100);
              return (
                <div key={type}>
                  <div className="flex justify-between text-sm mb-2 text-slate-700">
                    <span className="font-bold">{typeLabel[type]}</span>
                    <span className="font-bold text-slate-500">
                      {formatVND(value)} · {percent}%
                    </span>
                  </div>
                  <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full ${typeColor[type]} rounded-full transition-all duration-1000`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Jobs by status */}
        <Card className="p-8 shadow-sm border-slate-100 rounded-3xl">
          <h3 className="font-black text-lg mb-6 text-slate-800">Tiến độ Khối kỹ thuật</h3>
          <div className="space-y-5">
            {Object.entries(jobByStatus).map(([status, count]) => {
              const percent = Math.round((count / mockJobs.length) * 100);
              return (
                <div key={status}>
                  <div className="flex justify-between text-sm mb-2 text-slate-700">
                    <span className="font-bold">{statusLabel[status]}</span>
                    <span className="font-bold text-slate-500">
                      {count} việc · {percent}%
                    </span>
                  </div>
                  <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full ${statusColor[status]} rounded-full transition-all duration-1000`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Monthly charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-8 shadow-sm border-slate-100 rounded-3xl">
          <h3 className="font-black text-lg mb-8 text-slate-800">Sản lượng Công việc (6 Tháng)</h3>
          <div className="flex items-end justify-between gap-3 h-48 mt-4">
            {months.map((m, i) => {
              const h = (monthlyJobs[i] / maxJobs) * 100;
              const isSelected = m === period;
              return (
                <div key={m} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex flex-col justify-end" style={{ height: "160px" }}>
                    <div
                      className={`w-full rounded-t-xl transition-all relative group cursor-pointer ${isSelected ? "bg-primary shadow-lg shadow-primary/20" : "bg-primary/20 hover:bg-primary/40"}`}
                      style={{ height: `${Math.max(10, h)}%` }}
                      onClick={() => setPeriod(m)}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[13px] font-black opacity-0 group-hover:opacity-100 whitespace-nowrap text-slate-700">
                        {monthlyJobs[i]} Job
                      </div>
                    </div>
                  </div>
                  <div
                    className={`text-[11px] font-bold mt-2 uppercase tracking-tight ${isSelected ? "text-primary" : "text-slate-400"}`}
                  >
                    {m.replace("T", "")}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-8 shadow-sm border-slate-100 rounded-3xl">
          <h3 className="font-black text-lg mb-8 text-slate-800">Dòng tiền thu về (Triệu VNĐ)</h3>
          <div className="flex items-end justify-between gap-3 h-48 mt-4">
            {months.map((m, i) => {
              const h = (monthlyRevenue[i] / maxRevenue) * 100;
              const isSelected = m === period;
              return (
                <div key={m} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex flex-col justify-end" style={{ height: "160px" }}>
                    <div
                      className={`w-full rounded-t-xl transition-all relative group cursor-pointer ${isSelected ? "bg-emerald-500 shadow-lg shadow-emerald-500/20" : "bg-emerald-500/20 hover:bg-emerald-500/40"}`}
                      style={{ height: `${Math.max(10, h)}%` }}
                      onClick={() => setPeriod(m)}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[13px] font-black opacity-0 group-hover:opacity-100 whitespace-nowrap text-emerald-700">
                        {monthlyRevenue[i]}M
                      </div>
                    </div>
                  </div>
                  <div
                    className={`text-[11px] font-bold mt-2 uppercase tracking-tight ${isSelected ? "text-emerald-600" : "text-slate-400"}`}
                  >
                    {m.replace("T", "")}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
