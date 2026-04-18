import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import {
  StatusBadge, jobStatusLabel, jobStatusVariant, priorityLabel, priorityVariant
} from "@/components/common/StatusBadge";
import { mockJobs, formatDate, formatDateTime, getCustomer } from "@/lib/mock-data";
import { useAppStore } from "@/lib/store";
import { Calendar, Briefcase, MapPin } from "lucide-react";

export const Route = createFileRoute("/tech/schedule")({
  head: () => ({ meta: [{ title: "Lịch — Kỹ thuật" }] }),
  component: TechSchedule,
});

function TechSchedule() {
  const userId = useAppStore((s) => s.userId);
  const myJobs = mockJobs
    .filter(j => j.assignedTo === userId && j.status !== "completed" && j.status !== "cancelled")
    .sort((a, b) => a.scheduledFor.localeCompare(b.scheduledFor));

  const grouped = myJobs.reduce((acc, j) => {
    const day = j.scheduledFor.split("T")[0];
    (acc[day] = acc[day] || []).push(j);
    return acc;
  }, {} as Record<string, typeof myJobs>);

  return (
    <AppShell>
      <PageHeader title="Lịch của tôi" description="Các công việc sắp tới được nhóm theo ngày" />

      <div className="space-y-4">
        {Object.entries(grouped).map(([day, jobs]) => (
          <Card key={day} className="overflow-hidden">
            <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 border-b">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="font-semibold text-sm">{formatDate(day)}</span>
              <span className="text-xs text-muted-foreground ml-auto">{jobs.length} công việc</span>
            </div>
            <div className="divide-y">
              {jobs.map(j => {
                const cus = getCustomer(j.customerId);
                return (
                  <Link key={j.id} to="/tech/jobs/$jobId" params={{ jobId: j.id }} className="block p-4 hover:bg-muted/30">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Briefcase className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium truncate">{j.title}</span>
                          <StatusBadge variant={priorityVariant[j.priority]}>{priorityLabel[j.priority]}</StatusBadge>
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground space-y-0.5">
                          <div>{formatDateTime(j.scheduledFor)}</div>
                          <div className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {cus?.name}</div>
                        </div>
                      </div>
                      <StatusBadge variant={jobStatusVariant[j.status]}>{jobStatusLabel[j.status]}</StatusBadge>
                    </div>
                  </Link>
                );
              })}
            </div>
          </Card>
        ))}
        {Object.keys(grouped).length === 0 && (
          <Card className="p-12 text-center text-muted-foreground">Không có công việc sắp tới</Card>
        )}
      </div>
    </AppShell>
  );
}
