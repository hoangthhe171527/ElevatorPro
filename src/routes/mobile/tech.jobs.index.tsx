import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/layout/MobileShell";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/common/StatusBadge";
import { jobStatusLabel, jobStatusVariant, priorityLabel, priorityVariant } from "@/lib/status-variants";
import { formatDateTime, mockJobs } from "@/lib/mock-data";
import { useAppStore } from "@/lib/store";

export const Route = createFileRoute("/mobile/tech/jobs/")({
  head: () => ({ meta: [{ title: "Việc kỹ thuật - Mobile" }] }),
  component: MobileTechJobs,
});

function MobileTechJobs() {
  const userId = useAppStore((s) => s.userId);
  const activeTenantId = useAppStore((s) => s.activeTenantId);
  const jobs = mockJobs
    .filter((job) => job.tenantId === activeTenantId && job.assignedTo === userId)
    .sort((a, b) => b.scheduledFor.localeCompare(a.scheduledFor));

  return (
    <MobileShell title="Việc của tôi" showBackButton backLink="/mobile/tech/">
      <div className="min-h-screen bg-slate-50 pb-28 p-4 space-y-3">
        {jobs.map((job) => (
          <Link key={job.id} to="/mobile/tech/jobs/$jobId" params={{ jobId: job.id }}>
            <Card className="p-4 rounded-3xl border border-slate-100 bg-white shadow-sm active:scale-[0.99] transition">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-[12px] font-black uppercase italic text-slate-900 truncate">{job.title}</h3>
                  <p className="mt-1 text-[10px] font-semibold text-slate-500">{formatDateTime(job.scheduledFor)}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <StatusBadge variant={priorityVariant[job.priority]} className="text-[9px]">
                    {priorityLabel[job.priority]}
                  </StatusBadge>
                  <StatusBadge variant={jobStatusVariant[job.status]} className="text-[9px]">
                    {jobStatusLabel[job.status]}
                  </StatusBadge>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </MobileShell>
  );
}
