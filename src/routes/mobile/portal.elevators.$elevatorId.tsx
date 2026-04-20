import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { MobileShell } from "@/components/layout/MobileShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { elevatorStatusLabel, elevatorStatusVariant, jobStatusLabel, jobStatusVariant } from "@/lib/status-variants";
import { formatDate, formatDateTime, getProject, mockElevators, mockJobs } from "@/lib/mock-data";
import { AlertTriangle, Calendar, Wrench } from "lucide-react";

export const Route = createFileRoute("/mobile/portal/elevators/$elevatorId")({
  loader: ({ params }) => {
    const elevator = mockElevators.find((e) => e.id === params.elevatorId);
    if (!elevator) {
      throw notFound();
    }
    return { elevator };
  },
  component: MobilePortalElevatorDetail,
});

const CUSTOMER_ID = "c-1";

function MobilePortalElevatorDetail() {
  const { elevator } = Route.useLoaderData();
  const project = getProject(elevator.projectId);
  const history = mockJobs
    .filter((job) => job.elevatorId === elevator.id && job.customerId === CUSTOMER_ID)
    .sort((a, b) => b.scheduledFor.localeCompare(a.scheduledFor));

  return (
    <MobileShell title={elevator.code} showBackButton backLink="/mobile/portal/elevators">
      <div className="min-h-screen bg-slate-50 pb-28 p-4 space-y-4">
        {(elevator.status === "maintenance_due" || elevator.status === "out_of_order") && (
          <Card className="rounded-2xl border border-amber-200 bg-amber-50 p-3 flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
            <p className="text-[11px] font-bold text-amber-700">
              Thiết bị đang cần xử lý. Bạn có thể tạo yêu cầu hỗ trợ ngay.
            </p>
          </Card>
        )}

        <Card className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-black uppercase italic text-slate-900">{elevator.building}</h2>
              <p className="text-[10px] font-semibold text-slate-500 mt-1">{project?.name ?? "Không có dự án"}</p>
            </div>
            <StatusBadge variant={elevatorStatusVariant[elevator.status]}>
              {elevatorStatusLabel[elevator.status]}
            </StatusBadge>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 text-[10px] font-semibold">
            <div className="rounded-2xl bg-slate-50 border border-slate-100 p-3">
              <p className="text-slate-400 uppercase">Bảo trì gần nhất</p>
              <p className="mt-1 text-slate-900">{formatDate(elevator.lastMaintenance)}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 border border-slate-100 p-3">
              <p className="text-slate-400 uppercase">Bảo trì tiếp theo</p>
              <p className="mt-1 text-slate-900">{formatDate(elevator.nextMaintenance)}</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <Link to="/mobile/portal/issues" className="block">
              <Button className="w-full rounded-xl">Báo sự cố</Button>
            </Link>
            <Link to="/mobile/portal/contracts" className="block">
              <Button variant="outline" className="w-full rounded-xl">Xem hợp đồng</Button>
            </Link>
          </div>
        </Card>

        <Card className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Wrench className="h-4 w-4 text-indigo-600" />
            <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-500">Lịch sử công việc</h3>
          </div>
          <div className="space-y-3">
            {history.length > 0 ? (
              history.slice(0, 5).map((job) => (
                <div key={job.id} className="rounded-2xl border border-slate-100 p-3 bg-slate-50/50">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <h4 className="text-[11px] font-black text-slate-900 uppercase truncate">{job.title}</h4>
                    <StatusBadge variant={jobStatusVariant[job.status]} className="text-[9px]">
                      {jobStatusLabel[job.status]}
                    </StatusBadge>
                  </div>
                  <p className="mt-1 text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {formatDateTime(job.scheduledFor)}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-[11px] text-slate-400">Chưa có lịch sử công việc.</p>
            )}
          </div>
        </Card>
      </div>
    </MobileShell>
  );
}
