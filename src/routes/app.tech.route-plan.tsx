import { createFileRoute } from "@tanstack/react-router";
import { MobileTechRoutePlan } from "@/components/tech/mobile/MobileTechRoutePlan";

export const Route = createFileRoute("/app/tech/route-plan")({
  head: () => ({ meta: [{ title: "App — Lộ trình tối ưu — ElevatorPro" }] }),
  component: MobileTechRoutePlan,
});
