import { createFileRoute } from "@tanstack/react-router";
import { useAppStore } from "@/lib/store";
import { WebProjects } from "@/components/projects/WebProjects";
import { MobileProjects } from "@/components/projects/MobileProjects";

export const Route = createFileRoute("/admin/projects/")({
  head: () => ({ meta: [{ title: "Tiến độ Dự án Lắp đặt — ElevatorPro" }] }),
  component: AdminProjectsRouter,
});

function AdminProjectsRouter() {
  return <WebProjects />;
}
