import { createFileRoute } from "@tanstack/react-router";
import { MobileSimplePage } from "@/components/mobile/MobileWorkbenchPage";

export const Route = createFileRoute("/mobile/settings")({
  component: Screen,
});

function Screen() {
  return <MobileSimplePage module="settings" />;
}
