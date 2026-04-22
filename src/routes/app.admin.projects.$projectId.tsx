import { createFileRoute, notFound } from "@tanstack/react-router";
import { mockProjects } from "@/lib/mock-data";
import { MobileProjectDetail } from "@/components/projects/MobileProjectDetail";

export const Route = createFileRoute("/app/admin/projects/$projectId")({
  validateSearch: (search: Record<string, unknown>): { readonly?: string } => {
    return {
      readonly: (search.readonly as string) || undefined,
    };
  },
  loader: ({ params }) => {
    const project = mockProjects.find((p) => p.id === params.projectId);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.project.name ?? "Dự án"} — App — ElevatorPro` }],
  }),
  component: AppProjectDetailRouter,
});

function AppProjectDetailRouter() {
  const { readonly: readonlyParam } = Route.useSearch();
  const readonly = readonlyParam === "true";
  const { project } = Route.useLoaderData();

  return <MobileProjectDetail initialProject={project} readonly={readonly} />;
}
