import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { MobileShell } from "@/components/layout/MobileShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  elevatorStatusLabel,
  elevatorStatusVariant,
  jobStatusLabel,
  jobStatusVariant,
} from "@/lib/status-variants";
import { formatDate, formatDateTime, getContract, getProject, mockElevators, mockJobs } from "@/lib/mock-data";
import { Activity, AlertTriangle, Calendar, FileText, Wrench } from "lucide-react";

export const Route = createFileRoute("/mobile/elevators/$elevatorId")({
  loader: ({ params }) => {
    const elevator = mockElevators.find((e) => e.id === params.elevatorId);
    if (!elevator) {
      throw notFound();
    }
    return { elevator };
  },
  head: ({ params }) => ({ meta: [{ title: `Thang máy ${params.elevatorId} — Mobile` }] }),
  component: ElevatorDetailMobile,
});

function ElevatorDetailMobile() {
  const { elevator } = Route.useLoaderData();
  const project = getProject(elevator.projectId);
  const contract = elevator.contractId ? getContract(elevator.contractId) : undefined;
  const history = mockJobs
    .filter((job) => job.elevatorId === elevator.id)
    .sort((a, b) => b.scheduledFor.localeCompare(a.scheduledFor));

  const isAlert = elevator.status === "maintenance_due" || elevator.status === "out_of_order";

  return (
    <MobileShell title="Chi tiết thiết bị" showBackButton backLink="/mobile/elevators">
      <div className="min-h-screen bg-slate-50 pb-28">
        <div className="bg-slate-900 pt-8 pb-14 px-6 relative overflow-hidden text-white">
          <h2 className="text-2xl font-black uppercase italic tracking-tight">{elevator.building}</h2>
          <div className="flex items-center gap-2 text-white/40 text-[10px] uppercase font-black tracking-widest mt-2">
            {elevator.code}
          </div>
        </div>

        <div className="p-6 -mt-10 relative z-20 space-y-4">
          {isAlert && (
            <Card className="p-4 rounded-3xl border-amber-200 bg-amber-50 flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
              <p className="text-[11px] font-bold text-amber-700">
                Thiết bị đang cần kiểm tra. Vui lòng ưu tiên xử lý trong ca hiện tại.
              </p>
            </Card>
          )}

          <Card className="p-6 border-none shadow-2xl bg-white rounded-[2.8rem]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trạng thái vận hành</p>
                <div className="mt-1">
                  <StatusBadge variant={elevatorStatusVariant[elevator.status]}>
                    {elevatorStatusLabel[elevator.status]}
                  </StatusBadge>
                </div>
              </div>
              <Activity className="h-6 w-6 text-indigo-500" />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                <p className="text-[9px] font-black text-slate-400 uppercase">Bảo trì gần nhất</p>
                <p className="mt-1 text-[11px] font-black text-slate-900">{formatDate(elevator.lastMaintenance)}</p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                <p className="text-[9px] font-black text-slate-400 uppercase">Bảo trì tiếp theo</p>
                <p className="mt-1 text-[11px] font-black text-slate-900">{formatDate(elevator.nextMaintenance)}</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <Link to="/mobile/jobs" className="block">
                <Button variant="outline" className="w-full rounded-xl">Xem công việc</Button>
              </Link>
              <Link to="/mobile/scanner" className="block">
                <Button className="w-full rounded-xl">Mở scanner</Button>
              </Link>
            </div>
          </Card>

          <Card className="p-5 rounded-[2rem] border border-slate-100 bg-white">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">
              Hồ sơ thiết bị
            </h3>
            <div className="space-y-2 text-[11px] font-semibold">
              <Row label="Dự án" value={project?.name ?? "Không có"} />
              <Row label="Hãng/Model" value={`${elevator.brand} ${elevator.model}`} />
              <Row label="Số tầng" value={`${elevator.floors}`} />
              <Row label="Ngày lắp đặt" value={formatDate(elevator.installedAt)} />
              <Row label="Bảo hành" value={formatDate(elevator.warrantyUntil)} />
              <Row label="Hợp đồng" value={contract?.code ?? "Chưa liên kết"} />
            </div>
          </Card>

          <Card className="p-5 rounded-[2rem] border border-slate-100 bg-white">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Lịch sử gần đây
              </h3>
              <Wrench className="h-4 w-4 text-indigo-500" />
            </div>
            <div className="space-y-2">
              {history.length > 0 ? (
                history.slice(0, 4).map((job) => (
                  <div key={job.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <p className="text-[11px] font-black text-slate-900 uppercase truncate">{job.title}</p>
                      <StatusBadge variant={jobStatusVariant[job.status]} className="text-[9px]">
                        {jobStatusLabel[job.status]}
                      </StatusBadge>
                    </div>
                    <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-500 font-semibold">
                      <Calendar className="h-3 w-3" /> {formatDateTime(job.scheduledFor)}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-[11px] text-slate-400">Chưa có lịch sử công việc.</p>
              )}
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <Link to="/mobile/contracts" className="block">
                <Button variant="outline" className="w-full rounded-xl">
                  <FileText className="h-4 w-4 mr-1" /> Hợp đồng
                </Button>
              </Link>
              <Link to="/mobile/support" className="block">
                <Button variant="outline" className="w-full rounded-xl">Hỗ trợ</Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </MobileShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 py-1.5 last:border-b-0">
      <span className="text-slate-400">{label}</span>
      <span className="text-slate-900 text-right">{value}</span>
    </div>
  );
}
