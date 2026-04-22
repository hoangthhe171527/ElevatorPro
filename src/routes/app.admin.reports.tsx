import { createFileRoute } from "@tanstack/react-router";
import { MobileReports } from "@/components/reports/MobileReports";

export const Route = createFileRoute("/app/admin/reports")({
  head: () => ({ meta: [{ title: "App — Báo cáo — ElevatorPro" }] }),
  component: AppReportsRouter,
});

function AppReportsRouter() {
  return <MobileReports />;
}
