import { createFileRoute } from "@tanstack/react-router";
import { MobileWorkbenchDetail } from "@/components/mobile/MobileWorkbenchPage";

export const Route = createFileRoute("/mobile/inventory/$itemId")({
  component: Screen,
});

function Screen() {
  const { itemId } = Route.useParams();
  return <MobileWorkbenchDetail module="inventory" entityId={itemId} />;
}
