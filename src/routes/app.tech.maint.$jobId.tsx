import { createFileRoute, notFound } from "@tanstack/react-router";
import { WebMaintenanceJobDetail } from "@/components/tech/web/WebTechMaintenanceDetail";
import { mockJobs } from "@/lib/mock-data";

export const Route = createFileRoute("/app/tech/maint/$jobId")({
  loader: ({ params }) => {
    const job = mockJobs.find((j) => j.id === params.jobId);
    if (!job) throw notFound();
    return { job };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `App — Bảo trì — ${(loaderData as any)?.job.code ?? "Công việc"}` }],
  }),
  component: () => {
    const { job } = Route.useLoaderData();
    return <WebMaintenanceJobDetail job={job} />;
  },
});
