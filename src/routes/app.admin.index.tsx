import { createFileRoute } from "@tanstack/react-router";
import { MobileAdminDashboard } from "@/components/dashboard/MobileAdminDashboard";

export const Route = createFileRoute("/app/admin/")({
  head: () => ({ meta: [{ title: "App — Dashboard — ElevatorPro" }] }),
  component: AppAdminDashboard,
});

function AppAdminDashboard() {
  return <MobileAdminDashboard />;
}
