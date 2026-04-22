import { createFileRoute } from "@tanstack/react-router";
import { useAppStore } from "@/lib/store";
import { WebLeads } from "@/components/leads/WebLeads";
import { MobileLeads } from "@/components/leads/MobileLeads";

export const Route = createFileRoute("/admin/leads")({
  head: () => ({ meta: [{ title: "Khách hàng tiềm năng — ElevatorPro" }] }),
  component: AdminLeadsRouter,
});

function AdminLeadsRouter() {
  return <WebLeads />;
}
