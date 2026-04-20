import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/layout/MobileShell";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/common/StatusBadge";
import { elevatorStatusLabel, elevatorStatusVariant } from "@/lib/status-variants";
import { formatDate, mockElevators, mockProjects } from "@/lib/mock-data";
import { Building2, ChevronRight, TriangleAlert } from "lucide-react";

export const Route = createFileRoute("/mobile/portal/elevators")({
  head: () => ({ meta: [{ title: "Thiết bị của tôi - Mobile" }] }),
  component: MobilePortalElevators,
});

const CUSTOMER_ID = "c-1";

function MobilePortalElevators() {
  const projectIds = mockProjects.filter((p) => p.customerId === CUSTOMER_ID).map((p) => p.id);
  const elevators = mockElevators.filter((e) => projectIds.includes(e.projectId));
  const dueCount = elevators.filter(
    (e) => e.status === "maintenance_due" || e.status === "out_of_order",
  ).length;

  return (
    <MobileShell title="Thang máy của tôi" showBackButton backLink="/mobile/portal">
      <div className="min-h-screen bg-slate-50 pb-28">
        {dueCount > 0 && (
          <div className="m-4 rounded-2xl border border-amber-200 bg-amber-50 p-3 flex items-start gap-2">
            <TriangleAlert className="h-4 w-4 text-amber-600 mt-0.5" />
            <p className="text-[11px] font-bold text-amber-700">
              Có {dueCount} thiết bị cần chú ý về trạng thái bảo trì/sự cố.
            </p>
          </div>
        )}

        <div className="p-4 space-y-3">
          {elevators.map((elevator) => (
            <Link
              key={elevator.id}
              to="/mobile/portal/elevators/$elevatorId"
              params={{ elevatorId: elevator.id }}
              className="block"
            >
              <Card className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm active:scale-[0.99] transition">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-11 w-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate text-[12px] font-black uppercase italic text-slate-900">
                        {elevator.code}
                      </h3>
                      <p className="text-[10px] text-slate-500 font-semibold mt-1 truncate">
                        {elevator.building}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1">BT tiếp: {formatDate(elevator.nextMaintenance)}</p>
                    </div>
                  </div>
                  <StatusBadge variant={elevatorStatusVariant[elevator.status]} className="text-[9px]">
                    {elevatorStatusLabel[elevator.status]}
                  </StatusBadge>
                </div>

                <div className="mt-3 flex items-center justify-end text-indigo-600 text-[10px] font-black uppercase tracking-widest">
                  Chi tiết <ChevronRight className="ml-1 h-3.5 w-3.5" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </MobileShell>
  );
}
