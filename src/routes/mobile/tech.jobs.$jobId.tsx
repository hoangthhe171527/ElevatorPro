import { createFileRoute } from "@tanstack/react-router";
import { MobileWorkbenchDetail } from "@/components/mobile/MobileWorkbenchPage";

export const Route = createFileRoute("/mobile/tech/jobs/$jobId")({
  component: Screen,
});

function Screen() {
  const { jobId } = Route.useParams();
  return <MobileWorkbenchDetail module="techJobs" entityId={jobId} />;
}
