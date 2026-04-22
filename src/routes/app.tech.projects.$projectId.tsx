import { createFileRoute, notFound } from "@tanstack/react-router";
import { mockProjects } from "@/lib/mock-data";
import { MobileTechProjectDetail } from "@/components/tech/mobile/MobileTechProjectDetail";

export const Route = createFileRoute("/app/tech/projects/$projectId")({
  loader: ({ params }) => {
    const project = mockProjects.find((p) => p.id === params.projectId);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${(loaderData as any)?.project.name ?? "Chi tiết dự án"} — App` }],
  }),
  component: AppTechProjectDetailContainer,
});

function AppTechProjectDetailContainer() {
  const { project } = Route.useLoaderData();
  return <MobileTechProjectDetail project={project} />;
}
