import { createFileRoute } from "@tanstack/react-router";
import { useAppStore } from "@/lib/store";
import { WebProfile } from "@/components/profile/WebProfile";
import { MobileProfile } from "@/components/profile/MobileProfile";

export const Route = createFileRoute("/admin/profile")({
  head: () => ({ meta: [{ title: "Hồ sơ cá nhân — ElevatorPro" }] }),
  component: AdminProfileRouter,
});

function AdminProfileRouter() {
  return <WebProfile />;
}
