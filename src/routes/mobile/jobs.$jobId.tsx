import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { MobileShell } from "@/components/layout/MobileShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  jobStatusLabel,
  jobStatusVariant,
} from "@/lib/status-variants";
import {
  mockJobs,
  mockElevators,
  formatDate,
  formatDateTime,
} from "@/lib/mock-data";
import {
  Wrench,
  Calendar,
  Clock,
  MapPin,
  User,
  ShieldCheck,
  ChevronRight,
  Camera,
  Signature as SignatureIcon,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/mobile/jobs/$jobId")({
  loader: ({ params }) => {
    const job = mockJobs.find((j) => j.id === params.jobId);
    if (!job) throw notFound();
    const elevator = mockElevators.find(e => e.id === job.elevatorId);
    return { job, elevator };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `Công việc ${loaderData?.job.title ?? ""} — Mobile` }],
  }),
  component: JobDetail,
});

function JobDetail() {
  const { job, elevator } = Route.useLoaderData();

  return (
    <MobileShell 
        title="Chi tiết công việc"
        backLink="/mobile/jobs"
    >
      <div className="flex flex-col pb-24">
        {/* Header Section */}
        <div className="bg-slate-900 px-6 pt-10 pb-20 relative overflow-hidden">
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div className="h-14 w-14 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                        <Wrench className="h-7 w-7 text-indigo-400" />
                    </div>
                    <StatusBadge variant={jobStatusVariant[job.status]} className="px-3 py-1 text-[10px]">
                        {jobStatusLabel[job.status]}
                    </StatusBadge>
                </div>
                <h1 className="text-xl font-black text-white leading-tight uppercase italic tracking-tight mb-2">{job.title}</h1>
                <div className="flex items-center gap-2 text-slate-400">
                    <Calendar className="h-3 w-3" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{formatDate(job.scheduledFor)}</span>
                </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
        </div>

        {/* Content Section */}
        <div className="px-6 -mt-10 relative z-20 space-y-6">
            <Card className="bg-white border-none shadow-2xl shadow-indigo-900/5 rounded-[2.5rem] p-6 space-y-6">
                <div>
                    <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-4">Thông tin địa điểm</h3>
                    <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0">
                            <MapPin className="h-5 w-5 text-slate-400" />
                        </div>
                        <div>
                            <p className="text-[12px] font-black text-slate-800 uppercase italic leading-tight">{elevator?.building}</p>
                            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">{elevator?.address}</p>
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-50">
                    <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-4">Kỹ thuật viên</h3>
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-sm">
                            NB
                        </div>
                        <div>
                            <p className="text-[11px] font-black text-slate-800 uppercase">Nguyễn Văn B</p>
                            <p className="text-[9px] font-bold text-indigo-500 uppercase">Kỹ thuật viên chính</p>
                        </div>
                    </div>
                </div>
            </Card>

            <section className="space-y-4">
                <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] px-1">Danh mục kiểm tra</h3>
                <div className="space-y-2">
                    {[
                        "Kiểm tra hệ thống phanh an toàn",
                        "Vệ sinh ray dẫn hướng và cáp tải",
                        "Kiểm tra bảng điều khiển cabin",
                        "Kiểm tra độ ồn và rung lắc"
                    ].map((item, i) => (
                        <div key={i} className="bg-white p-4 rounded-3xl flex items-center justify-between border border-slate-50 shadow-sm">
                            <span className="text-[11px] font-bold text-slate-600 uppercase">{item}</span>
                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        </div>
                    ))}
                </div>
            </section>

            {/* Proof of Work */}
            <section className="space-y-4">
                <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] px-1">Xác nhận hoàn tất</h3>
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-100 aspect-video rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-slate-200">
                        <Camera className="h-6 w-6 text-slate-300 mb-1" />
                        <span className="text-[9px] font-black text-slate-400 uppercase">Ảnh hiện trường</span>
                    </div>
                    <div className="bg-slate-100 aspect-video rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-slate-200">
                        <SignatureIcon className="h-6 w-6 text-slate-300 mb-1" />
                        <span className="text-[9px] font-black text-slate-400 uppercase">Chữ ký khách hàng</span>
                    </div>
                </div>
            </section>

            <div className="pt-4 pb-12">
                <Button className="w-full h-14 rounded-2xl bg-indigo-600 text-white font-black uppercase tracking-widest italic flex items-center justify-center gap-2">
                    XUẤT BIÊN BẢN (PDF)
                </Button>
            </div>
        </div>
      </div>
    </MobileShell>
  );
}
