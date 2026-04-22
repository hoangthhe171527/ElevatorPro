import { createFileRoute } from "@tanstack/react-router";
import { useAppStore } from "@/lib/store";
import { WebAdminDashboard } from "@/components/dashboard/WebAdminDashboard";
import { MobileAdminDashboard } from "@/components/dashboard/MobileAdminDashboard";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Dashboard — ElevatorPro" }] }),
  component: AdminDashboard,
});

function AdminDashboard() {
  return <WebAdminDashboard />;
}
