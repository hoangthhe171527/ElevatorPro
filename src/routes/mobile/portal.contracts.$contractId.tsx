import { createFileRoute } from "@tanstack/react-router";
import { MobileWorkbenchDetail } from "@/components/mobile/MobileWorkbenchPage";

export const Route = createFileRoute("/mobile/portal/contracts/$contractId")({
  component: Screen,
});

function Screen() {
  const { contractId } = Route.useParams();
  return <MobileWorkbenchDetail module="portalContracts" entityId={contractId} />;
}
