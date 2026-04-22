import { createFileRoute } from "@tanstack/react-router";
import { MobileLeads } from "@/components/leads/MobileLeads";

export const Route = createFileRoute("/app/admin/leads")({
  head: () => ({ meta: [{ title: "App — Leads — ElevatorPro" }] }),
  component: AppLeadsRouter,
});

function AppLeadsRouter() {
  return <MobileLeads />;
}
