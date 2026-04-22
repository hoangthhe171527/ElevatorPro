import { createFileRoute } from "@tanstack/react-router";
import { MobileTechDashboard } from "@/components/dashboard/MobileTechDashboard";

export const Route = createFileRoute("/app/tech/")({
  head: () => ({ meta: [{ title: "App — Kỹ thuật — ElevatorPro" }] }),
  component: AppTechToday,
});

function AppTechToday() {
  return <MobileTechDashboard />;
}
