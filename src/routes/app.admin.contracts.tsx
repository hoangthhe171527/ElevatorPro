import { createFileRoute } from "@tanstack/react-router";
import { MobileContracts } from "@/components/contracts/MobileContracts";

export const Route = createFileRoute("/app/admin/contracts")({
  component: MobileContracts,
});
