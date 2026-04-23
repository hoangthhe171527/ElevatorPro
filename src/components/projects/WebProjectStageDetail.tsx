import { Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";;
import {
  jobStatusLabel,
  jobStatusVariant,
  priorityLabel,
  priorityVariant,
} from "@/lib/status-variants";
import {
  mockJobs,
  getCustomer,
  getElevator,
  formatDateTime,
  INSTALL_STAGES_TEMPLATE,
  type Job,
} from "@/lib/mock-data";
import {
  ArrowLeft,
  Camera,
  MapPin,
  Calendar,
  CheckCircle2,
  FileText,
  Hammer,
  Clock,
  User,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function WebProjectStageDetail({ job, readonly = true }: { job: Job; readonly?: boolean }) {
  const cus = getCustomer(job.customerId);
  const elev = job.elevatorId ? getElevator(job.elevatorId) : undefined;
  const isCompleted = job.status === "completed";

  // Current stage index from the job code (e.g., INSTALL-3)
  const currentIdx = parseInt(job.code.split("-").pop() || "0");

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto">
        <Link
          to="/admin/projects/$projectId"
          params={{ projectId: job.projectId || "" }}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 font-medium transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Quay lại chi tiết Dự án
        </Link>

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
          <PageHeader
            title={job.title}
            description={`Mã giai đoạn: ${job.code} · Dự án: ${job.projectId}`}
          />
          <div className="flex items-center gap-3">
            <StatusBadge
              variant={priorityVariant[job.priority]}
              className="px-4 py-1.5 rounded-xl uppercase font-black tracking-widest text-[10px]"
            >
              {priorityLabel[job.priority]}
            </StatusBadge>
            <StatusBadge
              variant={jobStatusVariant[job.status]}
              className="px-4 py-1.5 rounded-xl uppercase font-black tracking-widest text-[10px]"
            >
              {jobStatusLabel[job.status]}
            </StatusBadge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Simplified Stage Status */}
            <Card className="rounded-[2.5rem] border-none shadow-xl shadow-slate-200/40 p-10 bg-white overflow-hidden relative">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div
                    className={cn(
                      "h-20 w-20 rounded-3xl flex items-center justify-center shadow-lg transition-all duration-500",
                      isCompleted
                        ? "bg-emerald-500 shadow-emerald-500/20"
                        : "bg-primary shadow-primary/20 animate-pulse",
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-10 w-10 text-white" />
                    ) : (
                      <Clock className="h-10 w-10 text-white" />
                    )}
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      Trạng thái kỹ thuật
                    </div>
                    <h3 className="font-black text-3xl text-slate-800 leading-none mb-2">
                      {isCompleted ? "Đã Hoàn Thành" : "Đang Thi Công"}
                    </h3>
                    <Badge
                      variant="outline"
                      className="bg-slate-50 text-slate-500 border-slate-200 font-bold px-3 py-1 rounded-lg"
                    >
                      Giai đoạn {currentIdx} / 8: {job.title}
                    </Badge>
                  </div>
                </div>

                {isCompleted && (
                  <div className="bg-emerald-50 border border-emerald-100 px-6 py-4 rounded-[2rem] flex items-center gap-3">
                    <ShieldCheck className="h-6 w-6 text-emerald-600" />
                    <div>
                      <div className="text-xs font-black text-emerald-800 uppercase tracking-wider">
                        Hệ thống xác nhận
                      </div>
                      <div className="text-[11px] text-emerald-600 font-bold">
                        Kỹ thuật đã chốt giai đoạn này.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Photos Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="rounded-[2.5rem] border-none shadow-xl shadow-slate-200/40 p-8 bg-white">
                <h3 className="font-black text-sm uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                  <Camera className="h-4 w-4" /> Hình ảnh Trước thi công
                </h3>
                <div className="aspect-video rounded-[2rem] bg-slate-100 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
                  <Camera className="h-10 w-10 mb-2 opacity-20" />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Ảnh thực tế kỹ thuật chụp
                  </span>
                </div>
              </Card>
              <Card className="rounded-[2.5rem] border-none shadow-xl shadow-slate-200/40 p-8 bg-white">
                <h3 className="font-black text-sm uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                  <Camera className="h-4 w-4 text-primary" /> Hình ảnh Sau hoàn thành
                </h3>
                <div className="aspect-video rounded-[2rem] bg-slate-100 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
                  <Camera className="h-10 w-10 mb-2 opacity-20" />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Ảnh xác nhận hoàn tất kỳ
                  </span>
                </div>
              </Card>
            </div>

            {/* Technical Report */}
            <Card className="rounded-[2.5rem] border-none shadow-xl shadow-slate-200/40 p-10 bg-white">
              <div className="flex items-center gap-3 mb-8">
                <FileText className="h-6 w-6 text-primary" />
                <h3 className="font-black text-lg text-slate-800">
                  Biên bản Bàn giao & Ghi chú Kỹ thuật
                </h3>
              </div>
              <div className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 min-h-[150px]">
                <p className="text-slate-600 font-medium leading-relaxed italic">
                  {job.report || "Kỹ thuật viên chưa cập nhật báo cáo chi tiết cho giai đoạn này."}
                </p>
              </div>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-8">
            <Card className="rounded-[2.5rem] border-none shadow-xl shadow-slate-200/40 p-8 bg-slate-900 text-white">
              <h3 className="font-black text-sm uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                <Clock className="h-4 w-4" /> Thời gian dự kiến
              </h3>
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
                    Lịch thực hiện
                  </div>
                  <div className="text-lg font-black text-white flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />{" "}
                    {formatDateTime(job.scheduledFor).split(",")[0]}
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
                    Trạng thái hiện trường
                  </div>
                  <div className="text-lg font-black text-white">{jobStatusLabel[job.status]}</div>
                </div>
              </div>
            </Card>

            <Card className="rounded-[2.5rem] border-none shadow-xl shadow-slate-200/40 p-8 bg-white">
              <h3 className="font-black text-sm uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                <User className="h-4 w-4" /> Khách hàng & Vị trí
              </h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-black text-slate-800 text-[15px]">{cus?.name}</div>
                    <div className="text-xs text-slate-500 font-bold">{cus?.phone}</div>
                  </div>
                </div>
                <div className="pt-6 border-t border-slate-100 flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-slate-400 shrink-0" />
                  <div className="text-xs text-slate-600 font-medium leading-relaxed">
                    {cus?.address}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
