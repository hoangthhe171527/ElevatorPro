import { createFileRoute } from "@tanstack/react-router";
import { MobileElevators } from "@/components/elevators/MobileElevators";

export const Route = createFileRoute("/app/admin/elevators/")({
  head: () => ({ meta: [{ title: "App — Thang máy — ElevatorPro" }] }),
  component: AppElevatorsRouter,
});

function AppElevatorsRouter() {
  return <MobileElevators />;
}
