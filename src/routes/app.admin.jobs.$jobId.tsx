import { createFileRoute, notFound } from "@tanstack/react-router";
import { mockJobs } from "@/lib/mock-data";
import { MobileJobDetail } from "@/components/jobs/MobileJobDetail";

export const Route = createFileRoute("/app/admin/jobs/$jobId")({
  validateSearch: (search: Record<string, unknown>): { readonly?: string; tab?: string } => {
    return {
      readonly: (search.readonly as string) || undefined,
      tab: (search.tab as string) || undefined,
    };
  },
  loader: ({ params }) => {
    const job = mockJobs.find((j) => j.id === params.jobId);
    if (!job) throw notFound();
    return { job };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.job.code ?? "Công việc"} — App — ElevatorPro` }],
  }),
  component: AppJobDetailRouter,
});

function AppJobDetailRouter() {
  const { readonly: readonlyParam } = Route.useSearch();
  const readonly = readonlyParam === "true";
  const { job } = Route.useLoaderData();

  return <MobileJobDetail job={job} readonly={readonly} />;
}
