import { createFileRoute, notFound } from "@tanstack/react-router";
import { mockJobs } from "@/lib/mock-data";
import { MobileTechJobDetail } from "@/components/tech/mobile/MobileTechJobDetail";

export const Route = createFileRoute("/app/tech/jobs/$jobId")({
  loader: ({ params }) => {
    const job = mockJobs.find((j) => j.id === params.jobId);
    if (!job) throw notFound();
    return { job };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${(loaderData as any)?.job.title ?? "Chi tiết công việc"} — App` }],
  }),
  component: AppTechJobDetailContainer,
});

function AppTechJobDetailContainer() {
  const { job } = Route.useLoaderData();
  return <MobileTechJobDetail job={job} />;
}
