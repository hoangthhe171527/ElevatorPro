import { createFileRoute } from "@tanstack/react-router";
import { useAppStore } from "@/lib/store";
import { WebContracts } from "@/components/contracts/WebContracts";
import { MobileContracts } from "@/components/contracts/MobileContracts";

export const Route = createFileRoute("/admin/contracts")({
  head: () => ({ meta: [{ title: "Hợp đồng — ElevatorPro" }] }),
  component: AdminContractsRouter,
});

function AdminContractsRouter() {
  const isAppPreview = useAppStore((s) => s.isAppPreview);

  if (isAppPreview) {
    return <MobileContracts />;
  }

  return <WebContracts />;
}
