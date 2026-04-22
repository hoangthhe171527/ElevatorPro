import { createFileRoute } from "@tanstack/react-router";
import { MobileProfile } from "@/components/profile/MobileProfile";

export const Route = createFileRoute("/app/admin/profile")({
  head: () => ({ meta: [{ title: "App — Hồ sơ — ElevatorPro" }] }),
  component: AppProfileRouter,
});

function AppProfileRouter() {
  return <MobileProfile />;
}
