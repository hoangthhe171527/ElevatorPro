import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/common/StatCard";
import { mockContracts, mockJobs, mockCustomers, mockElevators, formatVND } from "@/lib/mock-data";
import { TrendingUp, Briefcase, Users, Building2, FileText } from "lucide-react";

export const Route = createFileRoute("/admin/reports")({
  head: () => ({ meta: [{ title: "Báo cáo — ElevatorPro" }] }),
  component: ReportsPage,
});

function ReportsPage() {
  const totalRevenue = mockContracts.reduce((s, c) => s + c.paid, 0);
  const totalContractValue = mockContracts.reduce((s, c) => s + c.value, 0);
  const completionRate = Math.round((mockJobs.filter(j => j.status === "completed").length / mockJobs.length) * 100);

  // Revenue by type
  const byType = mockContracts.reduce((acc, c) => {
    acc[c.type] = (acc[c.type] || 0) + c.value;
    return acc;
  }, {} as Record<string, number>);
  const typeLabel: Record<string, string> = { install: "Lắp đặt", maintenance: "Bảo trì", repair: "Sửa chữa" };

  // Jobs by status
  const jobByStatus = mockJobs.reduce((acc, j) => {
    acc[j.status] = (acc[j.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const statusLabel: Record<string, string> = { pending: "Chờ", scheduled: "Đã lên lịch", in_progress: "Đang làm", completed: "Hoàn thành", cancelled: "Hủy" };
  const statusColor: Record<string, string> = { pending: "bg-muted-foreground", scheduled: "bg-info", in_progress: "bg-warning", completed: "bg-success", cancelled: "bg-destructive" };

  // Monthly trend (mock)
  const months = ["T11", "T12", "T1", "T2", "T3", "T4"];
  const monthlyJobs = [18, 22, 25, 19, 28, 24];
  const maxMonth = Math.max(...monthlyJobs);

  return (
    <AppShell>
      <PageHeader title="Báo cáo & phân tích" description="Tổng quan hiệu suất kinh doanh và vận hành" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard label="Doanh thu đã thu" value={formatVND(totalRevenue)} icon={TrendingUp} accent="success" />
        <StatCard label="Giá trị HĐ ký" value={formatVND(totalContractValue)} icon={FileText} accent="primary" />
        <StatCard label="Tỉ lệ hoàn thành" value={`${completionRate}%`} icon={Briefcase} accent="info" />
        <StatCard label="Khách + Thang" value={`${mockCustomers.length} / ${mockElevators.length}`} icon={Users} accent="primary" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
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
                    <div className="h-full bg-primary rounded-full" style={{ width: `${percent}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

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

        <Card className="p-5 lg:col-span-2">
          <h3 className="font-semibold mb-4">Số lượng công việc 6 tháng gần nhất</h3>
          <div className="flex items-end justify-between gap-3 h-48">
            {months.map((m, i) => {
              const h = (monthlyJobs[i] / maxMonth) * 100;
              return (
                <div key={m} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex flex-col justify-end" style={{ height: "160px" }}>
                    <div className="w-full bg-primary rounded-t-md transition-all relative group cursor-pointer hover:bg-primary/80" style={{ height: `${h}%` }}>
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-semibold opacity-0 group-hover:opacity-100">{monthlyJobs[i]}</div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground font-medium">{m}</div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
