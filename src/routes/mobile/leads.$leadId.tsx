import { createFileRoute } from "@tanstack/react-router";
import { MobileWorkbenchDetail } from "@/components/mobile/MobileWorkbenchPage";

export const Route = createFileRoute("/mobile/leads/$leadId")({
  component: Screen,
});

function Screen() {
  const { leadId } = Route.useParams();
  return <MobileWorkbenchDetail module="leads" entityId={leadId} />;
}
