// src/routes/app.tech.survey.$jobId.tsx
import { createFileRoute, notFound } from "@tanstack/react-router";
import { mockJobs } from "@/lib/mock-data";
import { TechSurveyDetail } from "./tech.survey.$jobId"; // Re-use the same component

export const Route = createFileRoute("/app/tech/survey/$jobId")({
  loader: ({ params }) => {
    const job = mockJobs.find((j) => j.id === params.jobId);
    if (!job || job.type !== "inspection") throw notFound();
    return { job };
  },
  component: TechSurveyDetail,
});
