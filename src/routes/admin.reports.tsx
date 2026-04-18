// src/routes/admin.reports.tsx  ← THAY THẾ
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/common/StatCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockContracts, mockJobs, mockCustomers, mockElevators, formatVND } from "@/lib/mock-data";
import { TrendingUp, Briefcase, Users, Building2, FileText, Download } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/reports")({
  head: () => ({ meta: [{ title: "Báo cáo — ElevatorPro" }] }),
  component: ReportsPage,
});

const months = ["T11/2025", "T12/2025", "T1/2026", "T2/2026", "T3/2026", "T4/2026"];
const monthlyJobs = [18, 22, 25, 19, 28, 24];
const monthlyRevenue = [320, 410, 480, 290, 560, 440];

function ReportsPage() {
  const [period, setPeriod] = useState("T4/2026");

  const totalRevenue = mockContracts.reduce((s, c) => s + c.paid, 0);
  const totalContractValue = mockContracts.reduce((s, c) => s + c.value, 0);
  const completionRate = Math.round(
    (mockJobs.filter((j) => j.status === "completed").length / mockJobs.length) * 100,
  );

  const byType = mockContracts.reduce(
    (acc, c) => { acc[c.type] = (acc[c.type] || 0) + c.value; return acc; },
    {} as Record<string, number>,
  );
  const typeLabel: Record<string, string> = { install: "Lắp đặt", maintenance: "Bảo trì", repair: "Sửa chữa" };
  const typeColor: Record<string, string> = { install: "bg-primary", maintenance: "bg-success", repair: "bg-warning" };

  const jobByStatus = mockJobs.reduce(
    (acc, j) => { acc[j.status] = (acc[j.status] || 0) + 1; return acc; },
    {} as Record<string, number>,
  );
  const statusLabel: Record<string, string> = { pending: "Chờ", scheduled: "Đã lên lịch", in_progress: "Đang làm", completed: "Hoàn thành", cancelled: "Hủy" };
  const statusColor: Record<string, string> = { pending: "bg-muted-foreground", scheduled: "bg-info", in_progress: "bg-warning", completed: "bg-success", cancelled: "bg-destructive" };

  const maxJobs = Math.max(...monthlyJobs);
  const maxRevenue = Math.max(...monthlyRevenue);

  return (
    <AppShell>
      <PageHeader
        title="Báo cáo & phân tích"
        description="Tổng quan hiệu suất kinh doanh và vận hành"
        actions={
          <div className="flex gap-2">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
              <SelectContent>
                {months.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => toast.success(`Đang xuất báo cáo ${period} ra PDF...`)}
            >
              <Download className="h-4 w-4 mr-1.5" /> Xuất PDF
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard label="Doanh thu đã thu" value={formatVND(totalRevenue)} icon={TrendingUp} accent="success" trend={{ value: "12% so tháng trước", positive: true }} />
        <StatCard label="Giá trị HĐ ký" value={formatVND(totalContractValue)} icon={FileText} accent="primary" />
        <StatCard label="Tỉ lệ hoàn thành" value={`${completionRate}%`} icon={Briefcase} accent="info" />
        <StatCard label="KH / Thang" value={`${mockCustomers.length} / ${mockElevators.length}`} icon={Users} accent="primary" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2 mb-4">
        {/* Revenue by type */}
        <Card className="p-5">
          <h3 className="font-semibold mb-4">Doanh thu theo loại hợp đồng</h3>
          <div className="space-y-4">
            {Object.entries(byType).map(([type, value]) => {
              const percent = Math.round((value / totalContractValue) * 100);
              return (
                <div key={type}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium">{typeLabel[type]}</span>
                    <span className="text-muted-foreground">{formatVND(value)} · {percent}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className={`h-full ${typeColor[type]} rounded-full`} style={{ width: `${percent}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Jobs by status */}
        <Card className="p-5">
          <h3 className="font-semibold mb-4">Phân bố trạng thái công việc</h3>
          <div className="space-y-3">
            {Object.entries(jobByStatus).map(([status, count]) => {
              const percent = Math.round((count / mockJobs.length) * 100);
              return (
                <div key={status}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium">{statusLabel[status]}</span>
                    <span className="text-muted-foreground">{count} · {percent}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className={`h-full ${statusColor[status]} rounded-full`} style={{ width: `${percent}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Monthly charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="font-semibold mb-4">Số lượng công việc 6 tháng</h3>
          <div className="flex items-end justify-between gap-2 h-40">
            {months.map((m, i) => {
              const h = (monthlyJobs[i] / maxJobs) * 100;
              const isSelected = m === period;
              return (
                <div key={m} className="flex-1 flex flex-col items-center gap-1.5">
                  <div className="w-full flex flex-col justify-end" style={{ height: "120px" }}>
                    <div
                      className={`w-full rounded-t-md transition-all relative group cursor-pointer ${isSelected ? "bg-primary" : "bg-primary/40 hover:bg-primary/60"}`}
                      style={{ height: `${h}%` }}
                      onClick={() => setPeriod(m)}
                    >
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold opacity-0 group-hover:opacity-100 whitespace-nowrap">
                        {monthlyJobs[i]} CV
                      </div>
                    </div>
                  </div>
                  <div className={`text-[10px] font-medium ${isSelected ? "text-primary" : "text-muted-foreground"}`}>{m}</div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold mb-4">Doanh thu 6 tháng (triệu VNĐ)</h3>
          <div className="flex items-end justify-between gap-2 h-40">
            {months.map((m, i) => {
              const h = (monthlyRevenue[i] / maxRevenue) * 100;
              const isSelected = m === period;
              return (
                <div key={m} className="flex-1 flex flex-col items-center gap-1.5">
                  <div className="w-full flex flex-col justify-end" style={{ height: "120px" }}>
                    <div
                      className={`w-full rounded-t-md transition-all relative group cursor-pointer ${isSelected ? "bg-success" : "bg-success/40 hover:bg-success/60"}`}
                      style={{ height: `${h}%` }}
                      onClick={() => setPeriod(m)}
                    >
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold opacity-0 group-hover:opacity-100 whitespace-nowrap">
                        {monthlyRevenue[i]}M
                      </div>
                    </div>
                  </div>
                  <div className={`text-[10px] font-medium ${isSelected ? "text-success" : "text-muted-foreground"}`}>{m}</div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}