import { createFileRoute } from "@tanstack/react-router";
import { MobileWorkbenchDetail } from "@/components/mobile/MobileWorkbenchPage";

export const Route = createFileRoute("/mobile/portal/issues/$issueId")({
  component: Screen,
});

function Screen() {
  const { issueId } = Route.useParams();
  return <MobileWorkbenchDetail module="portalIssues" entityId={issueId} />;
}
