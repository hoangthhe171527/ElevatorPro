import { createFileRoute, notFound } from "@tanstack/react-router";
import { MobileShell } from "@/components/layout/MobileShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { jobStatusLabel, jobStatusVariant, priorityLabel, priorityVariant } from "@/lib/status-variants";
import { formatDateTime, getCustomer, mockJobs } from "@/lib/mock-data";
import { Camera, MapPin, PencilLine, Signature } from "lucide-react";

export const Route = createFileRoute("/mobile/tech/jobs/$jobId")({
  loader: ({ params }) => {
    const job = mockJobs.find((item) => item.id === params.jobId);
    if (!job) {
      throw notFound();
    }
    return { job };
  },
  head: ({ params }) => ({ meta: [{ title: `Job ${params.jobId} - Tech Mobile` }] }),
  component: MobileTechJobDetail,
});

function MobileTechJobDetail() {
  const { job } = Route.useLoaderData();
  const customer = getCustomer(job.customerId);

  return (
    <MobileShell title={job.code} showBackButton backLink="/mobile/tech/jobs/">
      <div className="min-h-screen bg-slate-50 pb-28 p-4 space-y-4">
        <Card className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
          <h1 className="text-[13px] font-black uppercase italic text-slate-900">{job.title}</h1>
          <p className="mt-1 text-[10px] text-slate-500 font-semibold">{formatDateTime(job.scheduledFor)}</p>
          <p className="mt-3 text-[11px] text-slate-700 leading-relaxed">{job.description}</p>

          <div className="mt-3 flex gap-2 flex-wrap">
            <StatusBadge variant={priorityVariant[job.priority]}>{priorityLabel[job.priority]}</StatusBadge>
            <StatusBadge variant={jobStatusVariant[job.status]}>{jobStatusLabel[job.status]}</StatusBadge>
          </div>

          <div className="mt-3 rounded-2xl bg-slate-50 border border-slate-100 p-3 text-[10px] font-semibold text-slate-600">
            <div className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {customer?.address ?? "Không có địa chỉ"}</div>
            <div className="mt-1">Khách hàng: {customer?.name ?? "N/A"}</div>
          </div>
        </Card>

        <Card className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm space-y-2">
          <Button variant="outline" className="w-full justify-start rounded-xl">
            <Camera className="h-4 w-4 mr-2" /> Chụp ảnh trước/sau thi công
          </Button>
          <Button variant="outline" className="w-full justify-start rounded-xl">
            <Signature className="h-4 w-4 mr-2" /> Ký xác nhận khách hàng
          </Button>
          <Button className="w-full justify-start rounded-xl">
            <PencilLine className="h-4 w-4 mr-2" /> Cập nhật biên bản công việc
          </Button>
        </Card>
      </div>
    </MobileShell>
  );
}
