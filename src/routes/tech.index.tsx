import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/common/StatCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  jobStatusLabel,
  jobStatusVariant,
  priorityLabel,
  priorityVariant,
} from "@/lib/status-variants";
import { mockJobs, formatDateTime, getCustomer } from "@/lib/mock-data";
import { useAppStore } from "@/lib/store";
import { Briefcase, CheckCircle2, Clock, AlertTriangle, MapPin, Calendar } from "lucide-react";

export const Route = createFileRoute("/tech/")({
  head: () => ({ meta: [{ title: "Hôm nay — Kỹ thuật" }] }),
  component: TechToday,
});

function TechToday() {
  const userId = useAppStore((s) => s.userId);
  const myJobs = mockJobs.filter((j) => j.assignedTo === userId);
  const today = myJobs.filter((j) => j.status === "scheduled" || j.status === "in_progress");
  const completed = myJobs.filter((j) => j.status === "completed").length;
  const urgent = myJobs.filter((j) => j.priority === "urgent" && j.status !== "completed").length;

  return (
    <AppShell>
      <PageHeader title="Hôm nay" description="Công việc của bạn cần xử lý" />

      <div className="grid gap-3 sm:grid-cols-3 mb-6">
        <StatCard label="Cần làm hôm nay" value={today.length} icon={Briefcase} accent="info" />
        <StatCard label="Đã hoàn thành" value={completed} icon={CheckCircle2} accent="success" />
        <StatCard label="Khẩn cấp" value={urgent} icon={AlertTriangle} accent="destructive" />
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Công việc tiếp theo</h3>
        </div>
        <div className="divide-y">
          {today.map((j) => {
            const cus = getCustomer(j.customerId);
            return (
              <Link
                key={j.id}
                to="/tech/jobs/$jobId"
                params={{ jobId: j.id }}
                className="block p-4 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold truncate">{j.title}</h4>
                      <StatusBadge variant={priorityVariant[j.priority]}>
                        {priorityLabel[j.priority]}
                      </StatusBadge>
                      <StatusBadge variant={jobStatusVariant[j.status]}>
                        {jobStatusLabel[j.status]}
                      </StatusBadge>
                    </div>
                    <div className="mt-1.5 text-xs text-muted-foreground space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3 w-3" /> {formatDateTime(j.scheduledFor)}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3 w-3" /> {cus?.name} — {cus?.address}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
          {today.length === 0 && (
            <div className="p-12 text-center">
              <CheckCircle2 className="mx-auto h-10 w-10 text-success mb-2" />
              <p className="text-sm text-muted-foreground">
                Bạn đã hoàn thành tất cả công việc hôm nay!
              </p>
            </div>
          )}
        </div>
      </Card>
    </AppShell>
  );
}
