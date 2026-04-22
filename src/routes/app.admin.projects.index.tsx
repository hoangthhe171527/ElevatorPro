import { createFileRoute } from "@tanstack/react-router";
import { MobileProjects } from "@/components/projects/MobileProjects";

export const Route = createFileRoute("/app/admin/projects/")({
  head: () => ({ meta: [{ title: "App — Dự án — ElevatorPro" }] }),
  component: AppProjectsRouter,
});

function AppProjectsRouter() {
  return <MobileProjects />;
}
