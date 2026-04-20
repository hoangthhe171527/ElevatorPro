import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MobileShell } from "@/components/layout/MobileShell";
import { canAccessMobilePath } from "@/lib/mobile-policy";
import { useCurrentPermissions, useMainRole } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/common/StatCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { elevatorStatusLabel, elevatorStatusVariant } from "@/lib/status-variants";
import {
  mockContracts,
  mockElevators,
  mockIssues,
  mockJobs,
  mockProjects,
  formatDate,
  formatDateTime,
} from "@/lib/mock-data";
import { Building2, AlertTriangle, CreditCard, QrCode, ArrowRight } from "lucide-react";
import { ConfirmScheduleModal } from "@/components/common/Modals";

export const Route = createFileRoute("/mobile/portal")({
  component: Screen,
});

const CUSTOMER_ID = "c-1";

function Screen() {
  const role = useMainRole();
  const permissions = useCurrentPermissions();
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (!canAccessMobilePath("/mobile/portal", role, permissions)) {
    return (
      <MobileShell title="Không có quyền truy cập">
        <div className="min-h-screen bg-slate-50 px-4 pt-4 pb-36">
          <Card className="p-6 text-center rounded-2xl border-slate-100">
            <p className="text-sm font-semibold text-slate-900">Màn portal chỉ dành cho khách hàng.</p>
            <Link to="/mobile" className="inline-block mt-4">
              <Button className="rounded-xl">Về trang chính mobile</Button>
            </Link>
          </Card>
        </div>
      </MobileShell>
    );
  }

  const customerProjectIds = mockProjects
    .filter((p) => p.customerId === CUSTOMER_ID)
    .map((p) => p.id);
  const myElevators = mockElevators.filter((e) => customerProjectIds.includes(e.projectId));
  const myJobs = mockJobs.filter((j) => j.customerId === CUSTOMER_ID);
  const myContracts = mockContracts.filter((c) => c.customerId === CUSTOMER_ID);
  const recentIssues = mockIssues
    .filter((i) => i.customerId === CUSTOMER_ID)
    .sort((a, b) => b.reportedAt.localeCompare(a.reportedAt));
  const upcomingJob = myJobs.find((j) => j.status === "scheduled" || j.status === "in_progress");
  const dueElevators = myElevators.filter((e) => e.status === "maintenance_due").length;
  const outstanding = myContracts.reduce((sum, c) => sum + (c.value - c.paid), 0);

  return (
    <MobileShell hideHeader={true}>
      <div className="min-h-screen bg-slate-50 pb-36">
        <section className="px-5 pt-8 pb-7 bg-indigo-950 rounded-b-[2.2rem] shadow-2xl shadow-indigo-950/20">
          <h1 className="text-xl font-black tracking-tight text-white">Tổng quan của bạn</h1>
          <p className="mt-1 text-xs text-indigo-200">Thông tin thang máy, hợp đồng và lịch bảo trì</p>
        </section>

        <section className="px-4 -mt-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Link to="/mobile/portal/elevators">
              <StatCard
                label="Thang máy của bạn"
                value={myElevators.length}
                icon={Building2}
                accent="primary"
              />
            </Link>
            <Link to="/mobile/portal/issues">
              <StatCard
                label="Đến hạn bảo trì"
                value={dueElevators}
                icon={AlertTriangle}
                accent="warning"
              />
            </Link>
            <Link to="/mobile/portal/billing" className="sm:col-span-2">
              <StatCard
                label="Dư nợ cần theo dõi"
                value={outstanding.toLocaleString("vi-VN")}
                icon={CreditCard}
                accent="destructive"
              />
            </Link>
          </div>
        </section>

        {upcomingJob ? (
          <section className="px-4 mt-5">
            <Card className="p-4 rounded-2xl border-l-4 border-l-indigo-600 bg-indigo-50/50 border-slate-100">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-[11px] font-semibold text-indigo-700 uppercase tracking-wide">Lịch tiếp theo</div>
                  <div className="mt-1 text-[13px] font-semibold text-slate-900">{upcomingJob.title}</div>
                  <div className="text-[11px] text-slate-500">{formatDateTime(upcomingJob.scheduledFor)}</div>
                </div>
                <Button onClick={() => setConfirmOpen(true)} className="rounded-xl">Xác nhận lịch</Button>
              </div>
            </Card>
          </section>
        ) : null}

        <section className="px-4 mt-5 grid gap-4">
          <Card className="p-4 rounded-2xl border-slate-100">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Thang máy của bạn</h3>
              <Link to="/mobile/portal/elevators" className="inline-flex items-center text-[11px] font-semibold text-indigo-600">
                Tất cả <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Link>
            </div>
            <div className="space-y-2">
              {myElevators.slice(0, 4).map((e) => (
                <div key={e.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-white">
                  <Link to="/mobile/portal/elevators/$elevatorId" params={{ elevatorId: e.id }} className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-mono text-[12px] font-semibold text-slate-900">{e.code}</div>
                      <div className="text-[11px] text-slate-500 truncate">{e.building}</div>
                    </div>
                  </Link>
                  <div className="flex items-center gap-2 shrink-0 pl-2">
                    <StatusBadge variant={elevatorStatusVariant[e.status]}>{elevatorStatusLabel[e.status]}</StatusBadge>
                    <Link to="/qr/$elevatorId" params={{ elevatorId: e.id }}>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                        <QrCode className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4 rounded-2xl border-slate-100">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Hoạt động gần đây</h3>
              <Link to="/mobile/portal/issues" className="inline-flex items-center text-[11px] font-semibold text-indigo-600">
                Báo lỗi <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Link>
            </div>
            <div className="space-y-3">
              {recentIssues.slice(0, 5).map((issue) => (
                <Link key={issue.id} to="/mobile/portal/issues/$issueId" params={{ issueId: issue.id }} className="flex items-start gap-3 text-sm">
                  <div className="mt-1 h-2 w-2 rounded-full bg-indigo-600 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-semibold text-slate-900 truncate">{issue.description}</div>
                    <div className="text-[11px] text-slate-500">{formatDate(issue.reportedAt)}</div>
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        </section>

        {upcomingJob ? (
          <ConfirmScheduleModal
            open={confirmOpen}
            onClose={() => setConfirmOpen(false)}
            jobTitle={upcomingJob.title}
            scheduledFor={formatDateTime(upcomingJob.scheduledFor)}
          />
        ) : null}
      </div>
    </MobileShell>
  );
}
