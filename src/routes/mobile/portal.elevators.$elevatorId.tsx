import { createFileRoute } from "@tanstack/react-router";
import { MobileWorkbenchDetail } from "@/components/mobile/MobileWorkbenchPage";

export const Route = createFileRoute("/mobile/portal/elevators/$elevatorId")({
  component: Screen,
});

function Screen() {
  const { elevatorId } = Route.useParams();
  return <MobileWorkbenchDetail module="portalElevators" entityId={elevatorId} />;
}
