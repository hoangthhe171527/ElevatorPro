import { createFileRoute, notFound } from "@tanstack/react-router";
import { mockElevators } from "@/lib/mock-data";
import { MobileElevatorDetail } from "@/components/elevators/MobileElevatorDetail";

export const Route = createFileRoute("/app/admin/elevators/$elevatorId")({
  loader: ({ params }) => {
    const elevator = mockElevators.find((e) => e.id === params.elevatorId);
    if (!elevator) throw notFound();
    return { elevator };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.elevator.code ?? "Thang máy"} — ElevatorPro` }],
  }),
  component: AppElevatorDetailRouter,
});

function AppElevatorDetailRouter() {
  const { elevator } = Route.useLoaderData();
  return <MobileElevatorDetail elevator={elevator} />;
}
