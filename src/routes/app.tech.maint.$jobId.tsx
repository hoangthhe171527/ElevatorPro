import { createFileRoute, notFound } from "@tanstack/react-router";
import { mockJobs } from "@/lib/mock-data";
import { MaintenanceWizard } from "./tech.maint.$jobId";

export const Route = createFileRoute("/app/tech/maint/$jobId")({
  loader: ({ params }) => {
    const job = mockJobs.find((j) => j.id === params.jobId);
    if (!job) throw notFound();
    return { job };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `App — Bảo trì — ${(loaderData as any)?.job.code ?? "Công việc"}` }],
  }),
  component: AppTechMaintWizardContainer,
});

function AppTechMaintWizardContainer() {
  const { job } = Route.useLoaderData();
  return <MaintenanceWizard job={job} />;
}
