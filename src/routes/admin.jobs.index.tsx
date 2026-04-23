import { createFileRoute } from "@tanstack/react-router";
import { useAppStore } from "@/lib/store";
import { WebJobsMonitor } from "@/components/jobs/WebJobsMonitor";
import { MobileJobsMonitor } from "@/components/jobs/MobileJobsMonitor";

export const Route = createFileRoute("/admin/jobs/")({
  head: () => ({ meta: [{ title: "Theo dõi công việc — CEO" }] }),
  component: AdminJobsRouter,
});

function AdminJobsRouter() {
  const { tab, priority, status } = Route.useSearch();
  return <WebJobsMonitor tab={tab} initialPriority={priority} initialStatus={status} />;
}
