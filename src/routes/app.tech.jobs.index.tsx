import { createFileRoute } from "@tanstack/react-router";
import { MobileTechJobsList } from "@/components/tech/mobile/MobileTechJobsList";

export const Route = createFileRoute("/app/tech/jobs/")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      tab: (search.tab as string) || undefined,
    } as { tab?: string };
  },
  head: () => ({ meta: [{ title: "App — Công việc của tôi — ElevatorPro" }] }),
  component: AppTechJobsContainer,
});

function AppTechJobsContainer() {
  const search = Route.useSearch();
  return <MobileTechJobsList search={search} />;
}
