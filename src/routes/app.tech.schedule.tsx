import { createFileRoute } from "@tanstack/react-router";
import { MobileTechSchedule } from "@/components/tech/mobile/MobileTechSchedule";

export const Route = createFileRoute("/app/tech/schedule")({
  head: () => ({ meta: [{ title: "App — Lịch — ElevatorPro" }] }),
  component: MobileTechSchedule,
});
