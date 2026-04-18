// src/routes/portal.index.tsx  ← THAY THẾ FILE CŨ
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/common/StatCard";
import { StatusBadge, elevatorStatusLabel, elevatorStatusVariant } from "@/components/common/StatusBadge";
import { mockElevators, mockContracts, mockJobs, formatDate, formatDateTime } from "@/lib/mock-data";
import { useAppStore } from "@/lib/store";
import { Building2, FileText, AlertTriangle, QrCode, ArrowRight } from "lucide-react";
import { ConfirmScheduleModal } from "@/components/common/Modals";

export const Route = createFileRoute("/portal/")({
  head: () => ({ meta: [{ title: "Cổng khách hàng" }] }),
  component: PortalIndex,
});

const CUSTOMER_ID = "c-1";

function PortalIndex() {
  useAppStore();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const myElevators = mockElevators.filter((e) => e.customerId === CUSTOMER_ID);
  const myContracts = mockContracts.filter((c) => c.customerId === CUSTOMER_ID);
  const myJobs = mockJobs.filter((j) => j.customerId === CUSTOMER_ID);
  const upcomingJob = myJobs.find((j) => j.status === "scheduled" || j.status === "in_progress");
  const dueElevators = myElevators.filter((e) => e.status === "maintenance_due").length;

  return (
    <AppShell>
      <PageHeader
        title="Tổng quan của bạn"
        description="Thông tin thang máy, hợp đồng và lịch bảo trì"
      />

      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <StatCard
          label="Thang máy của bạn"
          value={myElevators.length}
          icon={Building2}
          accent="primary"
        />
        <StatCard
          label="Hợp đồng đang hoạt động"
          value={myContracts.filter((c) => c.status === "active" || c.status === "expiring").length}
          icon={FileText}
          accent="success"
        />
        <StatCard
          label="Đến hạn bảo trì"
          value={dueElevators}
          icon={AlertTriangle}
          accent="warning"
        />
      </div>

      {upcomingJob && (
        <Card className="p-5 mb-6 border-l-4 border-l-primary bg-primary/5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-medium text-primary uppercase tracking-wider">
                Lịch tiếp theo
              </div>
              <div className="mt-1 font-semibold">{upcomingJob.title}</div>
              <div className="text-sm text-muted-foreground">
                {formatDateTime(upcomingJob.scheduledFor)}
              </div>
            </div>
            <Button onClick={() => setConfirmOpen(true)}>Xác nhận lịch</Button>
          </div>
        </Card>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Thang máy của bạn</h3>
            <Link to="/portal/elevators">
              <Button variant="ghost" size="sm">
                Tất cả <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="space-y-2">
            {myElevators.slice(0, 4).map((e) => (
              <div
                key={e.id}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/30"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-mono text-sm font-medium">{e.code}</div>
                    <div className="text-xs text-muted-foreground truncate">{e.building}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <StatusBadge variant={elevatorStatusVariant[e.status]}>
                    {elevatorStatusLabel[e.status]}
                  </StatusBadge>
                  <Link to="/qr/$elevatorId" params={{ elevatorId: e.id }}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <QrCode className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Hoạt động gần đây</h3>
            <Link to="/portal/issues">
              <Button variant="ghost" size="sm">
                Báo lỗi <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {myJobs.slice(0, 5).map((j) => (
              <div key={j.id} className="flex items-start gap-3 text-sm">
                <div className="mt-1 h-2 w-2 rounded-full bg-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{j.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {formatDate(j.scheduledFor)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {upcomingJob && (
        <ConfirmScheduleModal
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          jobTitle={upcomingJob.title}
          scheduledFor={formatDateTime(upcomingJob.scheduledFor)}
        />
      )}
    </AppShell>
  );
}