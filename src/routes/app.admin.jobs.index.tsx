import { createFileRoute } from "@tanstack/react-router";
import { MobileJobsMonitor } from "@/components/jobs/MobileJobsMonitor";

export const Route = createFileRoute("/app/admin/jobs/")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      tab: (search.tab as string) || undefined,
    } as { tab?: string };
  },
  head: () => ({ meta: [{ title: "App — Jobs — ElevatorPro" }] }),
  component: AppJobsRouter,
});

function AppJobsRouter() {
  const { tab } = Route.useSearch();
  return <MobileJobsMonitor tab={tab || "install"} />;
}
