import { createFileRoute } from "@tanstack/react-router";
import { WebUnassignedJobs } from "@/components/jobs/WebUnassignedJobs";

export const Route = createFileRoute("/admin/unassigned-jobs")({
  component: WebUnassignedJobs,
  head: () => ({
    meta: [{ title: "Điều phối Công việc — ElevatorPro" }],
  }),
});
