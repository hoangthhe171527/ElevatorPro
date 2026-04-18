// src/routes/admin.index.tsx  ← THAY THẾ
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge, jobStatusLabel, jobStatusVariant, contractStatusLabel, contractStatusVariant, priorityLabel, priorityVariant } from "@/components/common/StatusBadge";
import { mockJobs, mockContracts, mockCustomers, mockElevators, mockLeads, formatVND, formatDate, formatDateTime, getCustomer } from "@/lib/mock-data";
import { Briefcase, Users, FileText, AlertTriangle, Building2, TrendingUp, Calendar, ArrowUpRight, Plus } from "lucide-react";
import { CreateJobModal } from "@/components/common/Modals";
import { useState } from "react";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Dashboard — ElevatorPro" }] }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const navigate = useNavigate();
  const [createJobOpen, setCreateJobOpen] = useState(false);

  const totalRevenue = mockContracts.reduce((s, c) => s + c.paid, 0);
  const expiringContracts = mockContracts.filter((c) => c.status === "expiring").length;
  const overdueElevators = mockElevators.filter((e) => e.status === "maintenance_due" || e.status === "out_of_order").length;
  const activeJobs = mockJobs.filter((j) => j.status === "in_progress" || j.status === "scheduled").length;
  const newLeads = mockLeads.filter((l) => l.status === "new" || l.status === "contacted").length;

  const upcomingJobs = [...mockJobs]
    .filter((j) => j.status === "scheduled" || j.status === "in_progress")
    .sort((a, b) => a.scheduledFor.localeCompare(b.scheduledFor))
    .slice(0, 6);

  const recentContracts = [...mockContracts]
    .sort((a, b) => b.signedAt.localeCompare(a.signedAt))
    .slice(0, 5);

  return (
    <AppShell>
      <PageHeader
        title="Tổng quan hệ thống"
        description="Xin chào, đây là tình hình hoạt động hôm nay"
        actions={
          <Button onClick={() => setCreateJobOpen(true)}>
            <Plus className="h-4 w-4 mr-1.5" /> Tạo công việc
          </Button>
        }
      />

      {/* Primary stats — all clickable */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <div className="cursor-pointer" onClick={() => navigate({ to: "/admin/reports" })}>
          <StatCard label="Doanh thu đã thu" value={formatVND(totalRevenue)} icon={TrendingUp} accent="success" trend={{ value: "12% so tháng trước", positive: true }} />
        </div>
        <div className="cursor-pointer" onClick={() => navigate({ to: "/admin/jobs" })}>
          <StatCard label="Công việc đang chạy" value={activeJobs} icon={Briefcase} accent="info" hint={`${mockJobs.length} công việc tổng`} />
        </div>
        <div className="cursor-pointer" onClick={() => navigate({ to: "/admin/contracts" })}>
          <StatCard label="HĐ sắp hết hạn" value={expiringContracts} icon={FileText} accent="warning" hint="Cần liên hệ tái ký" />
        </div>
        <div className="cursor-pointer" onClick={() => navigate({ to: "/admin/elevators" })}>
          <StatCard label="Thang cần chú ý" value={overdueElevators} icon={AlertTriangle} accent="destructive" hint="Đến hạn BT hoặc hỏng" />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3 mb-6">
        <div className="cursor-pointer" onClick={() => navigate({ to: "/admin/customers" })}>
          <StatCard label="Tổng khách hàng" value={mockCustomers.length} icon={Users} accent="primary" />
        </div>
        <div className="cursor-pointer" onClick={() => navigate({ to: "/admin/elevators" })}>
          <StatCard label="Tổng thang máy" value={mockElevators.length} icon={Building2} accent="primary" />
        </div>
        <div className="cursor-pointer" onClick={() => navigate({ to: "/admin/leads" })}>
          <StatCard label="Lead đang theo dõi" value={newLeads} icon={ArrowUpRight} accent="info" />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Upcoming jobs */}
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Công việc sắp tới</h3>
              <p className="text-xs text-muted-foreground">Đã lên lịch hoặc đang thực hiện</p>
            </div>
            <Link to="/admin/jobs">
              <Button variant="ghost" size="sm">Tất cả</Button>
            </Link>
          </div>
          <div className="divide-y">
            {upcomingJobs.map((j) => {
              const cus = getCustomer(j.customerId);
              return (
                <Link
                  key={j.id}
                  to="/admin/jobs/$jobId"
                  params={{ jobId: j.id }}
                  className="flex items-center gap-3 py-3 hover:bg-muted/50 -mx-2 px-2 rounded"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Briefcase className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm truncate">{j.title}</span>
                      <StatusBadge variant={priorityVariant[j.priority]}>{priorityLabel[j.priority]}</StatusBadge>
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {cus?.name} · {formatDateTime(j.scheduledFor)}
                    </div>
                  </div>
                  <StatusBadge variant={jobStatusVariant[j.status]}>{jobStatusLabel[j.status]}</StatusBadge>
                </Link>
              );
            })}
          </div>
        </Card>

        {/* Recent contracts */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Hợp đồng gần đây</h3>
            <Link to="/admin/contracts">
              <Button variant="ghost" size="sm">Tất cả</Button>
            </Link>
          </div>
          <div className="space-y-3">
            {recentContracts.map((c) => {
              const cus = getCustomer(c.customerId);
              return (
                <Link
                  key={c.id}
                  to="/admin/contracts"
                  className="block p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-sm">{c.code}</span>
                    <StatusBadge variant={contractStatusVariant[c.status]}>{contractStatusLabel[c.status]}</StatusBadge>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground truncate">{cus?.name}</div>
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{formatDate(c.endDate)}</span>
                    <span className="font-semibold text-primary">{formatVND(c.value)}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Alerts */}
      <Card className="mt-6 p-5">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="h-4 w-4 text-warning-foreground" />
          <h3 className="font-semibold">Cảnh báo cần xử lý</h3>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { icon: Calendar, label: "Thang đến hạn bảo trì", count: overdueElevators, href: "/admin/elevators", color: "text-warning-foreground bg-warning/15" },
            { icon: FileText, label: "Hợp đồng sắp hết hạn", count: expiringContracts, href: "/admin/contracts", color: "text-destructive bg-destructive/10" },
            { icon: AlertTriangle, label: "Sự cố đang mở", count: 1, href: "/admin/jobs", color: "text-info bg-info/10" },
          ].map((a) => {
            const Icon = a.icon;
            return (
              <Link key={a.label} to={a.href} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${a.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{a.label}</div>
                  <div className="text-2xl font-bold">{a.count}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </Card>

      <CreateJobModal open={createJobOpen} onClose={() => setCreateJobOpen(false)} />
    </AppShell>
  );
}