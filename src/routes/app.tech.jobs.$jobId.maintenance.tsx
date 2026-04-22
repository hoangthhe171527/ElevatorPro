import { createFileRoute } from "@tanstack/react-router";
import { mockJobs } from "@/lib/mock-data";
import { notFound } from "@tanstack/react-router";
import { MaintenanceWizard } from "./tech.jobs.$jobId.maintenance";

export const Route = createFileRoute("/app/tech/jobs/$jobId/maintenance")({
  loader: ({ params }) => {
    const job = mockJobs.find((j) => j.id === params.jobId);
    if (!job) throw notFound();
    return { job };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `App — Bảo trì — ${(loaderData as any)?.job.code ?? "Công việc"}` }],
  }),
  component: AppTechMaintenanceWizardContainer,
});

function AppTechMaintenanceWizardContainer() {
  const { job } = Route.useLoaderData();
  return <MaintenanceWizard job={job} />;
}
