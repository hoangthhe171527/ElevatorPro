import { createFileRoute } from "@tanstack/react-router";
import { MobileWorkbenchList } from "@/components/mobile/MobileWorkbenchPage";

export const Route = createFileRoute("/mobile/inventory")({
  component: Screen,
});

function Screen() {
  return <MobileWorkbenchList module="inventory" />;
}
