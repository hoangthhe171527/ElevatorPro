import { createFileRoute } from "@tanstack/react-router";
import { MobileWorkbenchDetail } from "@/components/mobile/MobileWorkbenchPage";

export const Route = createFileRoute("/mobile/projects/$projectId")({
  component: Screen,
});

function Screen() {
  const { projectId } = Route.useParams();
  return <MobileWorkbenchDetail module="projects" entityId={projectId} />;
}
