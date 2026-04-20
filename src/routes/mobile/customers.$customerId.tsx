import { createFileRoute } from "@tanstack/react-router";
import { MobileWorkbenchDetail } from "@/components/mobile/MobileWorkbenchPage";

export const Route = createFileRoute("/mobile/customers/$customerId")({
  component: Screen,
});

function Screen() {
  const { customerId } = Route.useParams();
  return <MobileWorkbenchDetail module="customers" entityId={customerId} />;
}
