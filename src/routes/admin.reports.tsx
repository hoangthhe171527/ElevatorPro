import { createFileRoute } from "@tanstack/react-router";
import { useAppStore } from "@/lib/store";
import { WebReports } from "@/components/reports/WebReports";
import { MobileReports } from "@/components/reports/MobileReports";

export const Route = createFileRoute("/admin/reports")({
  head: () => ({ meta: [{ title: "Báo cáo — ElevatorPro" }] }),
  component: AdminReportsRouter,
});

function AdminReportsRouter() {
  return <WebReports />;
}
