import { createFileRoute } from "@tanstack/react-router";
import { useAppStore } from "@/lib/store";
import { WebTechDashboard } from "@/components/dashboard/WebTechDashboard";
import { MobileTechDashboard } from "@/components/dashboard/MobileTechDashboard";

export const Route = createFileRoute("/tech/")({
  head: () => ({ meta: [{ title: "Hôm nay — Kỹ thuật" }] }),
  component: TechToday,
});

function TechToday() {
  return <WebTechDashboard />;
}
