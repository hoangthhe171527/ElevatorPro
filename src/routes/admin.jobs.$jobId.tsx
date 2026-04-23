import { createFileRoute, notFound } from "@tanstack/react-router";
import { useAppStore } from "@/lib/store";
import { mockJobs } from "@/lib/mock-data";
import { WebJobDetail } from "@/components/jobs/WebJobDetail";
import { WebUnassignedJobDetail } from "@/components/jobs/WebUnassignedJobDetail";
import { MobileJobDetail } from "@/components/jobs/MobileJobDetail";
import { WebProjectStageDetail } from "../components/projects/WebProjectStageDetail";
import { WebMaintenanceJobDetail } from "@/components/tech/web/WebTechMaintenanceDetail";
import { WebTechRepairDetail } from "@/components/tech/web/WebTechRepairDetail";
import { WebTechWarrantyDetail } from "@/components/tech/web/WebTechWarrantyDetail";

export const Route = createFileRoute("/admin/jobs/$jobId")({
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
    meta: [{ title: `${loaderData?.job.code ?? "Công việc"} — ElevatorPro` }],
  }),
  component: AdminJobDetailRouter,
});

function AdminJobDetailRouter() {
  const { readonly: readonlyParam } = Route.useSearch();
  const readonly = readonlyParam === "true";
  const { job } = Route.useLoaderData();

  if (job.type === "install") {
    return <WebProjectStageDetail job={job} readonly={readonly} />;
  }

  if (job.type === "maintenance") {
    return <WebMaintenanceJobDetail job={job} readonly={readonly} />;
  }

  if (job.type === "repair" || job.type === "incident") {
    return <WebTechRepairDetail job={job} readonly={readonly} />;
  }

  if (job.type === "warranty") {
    return <WebTechWarrantyDetail job={job} readonly={readonly} />;
  }

  if (job.status === "pending") {
    return <WebUnassignedJobDetail job={job} />;
  }

  return <WebJobDetail job={job} readonly={readonly} />;
}
