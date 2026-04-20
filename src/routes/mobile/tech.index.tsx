import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/layout/MobileShell";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/common/StatusBadge";
import { jobStatusLabel, jobStatusVariant, priorityLabel, priorityVariant } from "@/lib/status-variants";
import { formatDateTime, mockJobs } from "@/lib/mock-data";
import { useAppStore } from "@/lib/store";
import { Briefcase, MapPin, TriangleAlert, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/mobile/tech/")({
  head: () => ({ meta: [{ title: "Kỹ thuật hôm nay - Mobile" }] }),
  component: MobileTechHome,
});

function MobileTechHome() {
  const userId = useAppStore((s) => s.userId);
  const myJobs = mockJobs.filter((job) => job.assignedTo === userId);
  const today = myJobs.filter((job) => job.status === "scheduled" || job.status === "in_progress");
  const urgent = myJobs.filter((job) => job.priority === "urgent" && job.status !== "completed").length;
  const completed = myJobs.filter((job) => job.status === "completed").length;

  return (
    <MobileShell title="Tech Dashboard" showBackButton backLink="/mobile/">
      <div className="min-h-screen bg-slate-50 pb-28 p-4 space-y-4">
        <div className="grid grid-cols-3 gap-2">
          <Card className="p-3 rounded-2xl">
            <p className="text-[9px] font-black uppercase text-slate-400">Hôm nay</p>
            <p className="text-xl font-black italic text-slate-900">{today.length}</p>
          </Card>
          <Card className="p-3 rounded-2xl">
            <p className="text-[9px] font-black uppercase text-slate-400">Khẩn cấp</p>
            <p className="text-xl font-black italic text-rose-600">{urgent}</p>
          </Card>
          <Card className="p-3 rounded-2xl">
            <p className="text-[9px] font-black uppercase text-slate-400">Đã xong</p>
            <p className="text-xl font-black italic text-emerald-600">{completed}</p>
          </Card>
        </div>

        <div className="space-y-3">
          {today.map((job) => (
            <Link key={job.id} to="/mobile/tech/jobs/$jobId" params={{ jobId: job.id }}>
              <Card className="p-4 rounded-3xl border border-slate-100 bg-white shadow-sm active:scale-[0.99] transition">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="text-[12px] font-black uppercase italic text-slate-900 truncate">{job.title}</h3>
                    <p className="mt-1 text-[10px] text-slate-500 font-semibold">{formatDateTime(job.scheduledFor)}</p>
                    <div className="mt-2 flex items-center gap-1 text-[10px] text-slate-500">
                      <MapPin className="h-3 w-3" /> {job.code}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <StatusBadge variant={priorityVariant[job.priority]} className="text-[9px]">
                      {priorityLabel[job.priority]}
                    </StatusBadge>
                    <StatusBadge variant={jobStatusVariant[job.status]} className="text-[9px]">
                      {jobStatusLabel[job.status]}
                    </StatusBadge>
                  </div>
                </div>
              </Card>
            </Link>
          ))}

          {today.length === 0 && (
            <Card className="p-8 rounded-3xl text-center">
              <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-600 mb-2" />
              <p className="text-[11px] font-semibold text-slate-500">Bạn đã hoàn thành toàn bộ công việc hôm nay.</p>
            </Card>
          )}
        </div>

        <Link to="/mobile/tech/jobs" className="block">
          <Card className="p-4 rounded-2xl border border-indigo-100 bg-indigo-50 text-indigo-700 flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wide">Xem toàn bộ việc được giao</span>
            <Briefcase className="h-4 w-4" />
          </Card>
        </Link>

        <Link to="/mobile/support" className="block">
          <Card className="p-4 rounded-2xl border border-rose-100 bg-rose-50 text-rose-700 flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wide">Kích hoạt hỗ trợ khẩn cấp</span>
            <TriangleAlert className="h-4 w-4" />
          </Card>
        </Link>
      </div>
    </MobileShell>
  );
}
