import { Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { useAppStore } from "@/lib/store";
import {
  ArrowLeft,
  Camera,
  MapPin,
  Phone,
  Calendar,
  CheckCircle2,
  FileText,
  Hammer,
  AlertTriangle,
  ChevronRight,
  Package,
  Wrench,
  Activity,
  ClipboardCheck,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function MobileTechJobDetail({ job }: { job: Job }) {
  const userId = useAppStore((s) => s.userId);
  const navigate = useNavigate();
  const cus = getCustomer(job.customerId);
  const elev = job.elevatorId ? getElevator(job.elevatorId) : undefined;

  const [report, setReport] = useState<string>(job.report || "");
  const [status, setStatus] = useState<typeof job.status>(job.status);
  const [beforeCount, setBeforeCount] = useState<number>(job.beforePhotos?.length || 0);
  const [afterCount, setAfterCount] = useState<number>(job.afterPhotos?.length || 0);

  const isCompleted = status === "completed";

  return (
    <AppShell
      secondaryNav={
        <div className="flex items-center justify-between px-4 py-2 bg-slate-900 text-white">
          <Link
            to="/app/tech/jobs"
            search={{ tab: job.type } as any}
            className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">
              Chi tiết công việc
            </span>
            <span className="text-xs font-black">{job.code}</span>
          </div>
          <div className="w-8 h-8" /> {/* Spacer */}
        </div>
      }
    >
      {/* Premium Header Banner */}
      <div className="bg-slate-900 px-4 pt-4 pb-12 rounded-b-[2.5rem] shadow-2xl shadow-slate-900/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
          <Activity className="h-48 w-48 text-white rotate-12" />
        </div>

        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2">
            <StatusBadge
              variant={priorityVariant[job.priority]}
              className="text-[9px] uppercase font-black px-2 py-0.5 h-auto leading-normal tracking-widest"
            >
              {priorityLabel[job.priority]}
            </StatusBadge>
            <StatusBadge
              variant={jobStatusVariant[status]}
              className="text-[9px] uppercase font-black px-2 py-0.5 h-auto leading-normal tracking-widest bg-white/10 text-white border-none"
            >
              {jobStatusLabel[status]}
            </StatusBadge>
          </div>
          <h1 className="text-2xl font-black text-white leading-tight mt-2">{job.title}</h1>
          <div className="flex items-center gap-4 text-white/50 text-[11px] font-bold">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" /> {formatDateTime(job.scheduledFor)}
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-6 space-y-4 pb-12">
        {/* Main Action Card */}
        {!isCompleted && (
          <Card className="p-5 rounded-[28px] border-none shadow-xl shadow-primary/10 bg-primary text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-70">
                  Trạng thái hiện tại
                </span>
                <span className="text-lg font-black">{jobStatusLabel[status]}</span>
              </div>
              <div className="h-10 w-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                <Wrench className="h-5 w-5" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {status === "scheduled" ? (
                <Button
                  className="h-12 rounded-xl bg-white text-primary font-black text-xs uppercase shadow-lg shadow-black/small hover:bg-white/90 col-span-2"
                  onClick={() => {
                    setStatus("in_progress");
                    toast.success("Bắt đầu thực hiện!");
                  }}
                >
                  BẮT ĐẦU CÔNG VIỆC
                </Button>
              ) : (
                <Button
                  className="h-12 rounded-xl bg-white text-primary font-black text-xs uppercase shadow-lg hover:bg-white/90 col-span-2"
                  onClick={() => {
                    if (!report.trim()) {
                      toast.error("Vui lòng nhập báo cáo chi tiết!");
                      return;
                    }
                    if (afterCount === 0) {
                      toast.error("BẮT BUỘC: Bạn phải chụp ảnh hiện trường sau khi hoàn thành!");
                      return;
                    }
                    setStatus("completed");
                    toast.success("Đã hoàn thành công việc!");
                  }}
                >
                  HOÀN THÀNH & GỬI BÁO CÁO
                </Button>
              )}
            </div>
          </Card>
        )}

        {/* Context Info Cards */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 rounded-[24px] border-none shadow-lg shadow-slate-900/5 bg-white">
            <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center mb-3">
              <Phone className="h-4 w-4" />
            </div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 line-clamp-1">
              {cus?.name}
            </div>
            <a
              href={`tel:${cus?.phone}`}
              className="text-sm font-black text-indigo-600 block truncate"
            >
              {cus?.phone}
            </a>
          </Card>
          <Card className="p-4 rounded-[24px] border-none shadow-lg shadow-slate-900/5 bg-white">
            <div className="h-8 w-8 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center mb-3">
              <MapPin className="h-4 w-4" />
            </div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
              Địa điểm
            </div>
            <div className="text-[11px] font-black text-slate-800 line-clamp-2 leading-tight">
              Xem bản đồ <ChevronRight className="h-2 w-2 inline ml-0.5" />
            </div>
          </Card>
        </div>

        {/* 8-Stage Tracker (Integrated for Install) */}
        {job.type === "install" && (
          <Card className="p-5 rounded-[28px] border-none shadow-lg shadow-slate-900/5 bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-black uppercase tracking-[0.1em] text-slate-800 flex items-center gap-2">
                <Hammer className="h-4 w-4 text-primary" /> Tiến độ 8 giai đoạn
              </h3>
              <Badge
                variant="outline"
                className="text-[9px] font-black opacity-50 px-1.5 py-0 h-4 border-slate-200"
              >
                #{job.code.split("-").pop()}
              </Badge>
            </div>

            <div className="flex justify-between relative px-1 pt-2 pb-6">
              <div className="absolute top-4 left-2 right-2 h-1 bg-slate-100 rounded-full" />
              {INSTALL_STAGES_TEMPLATE.slice(0, 8).map((stage, i) => {
                const idx = i + 1;
                const currentIdx = parseInt(job.code.split("-").pop() || "0");
                const isPast = idx < currentIdx;
                const isCurrent = idx === currentIdx;

                return (
                  <div key={idx} className="relative z-10 flex flex-col items-center">
                    <div
                      className={cn(
                        "h-4 w-4 rounded-full border-2 border-white shadow-sm ring-4 ring-white transition-all",
                        isPast
                          ? "bg-success"
                          : isCurrent
                            ? "bg-primary scale-125 shadow-primary/30"
                            : "bg-slate-200",
                      )}
                    />
                    {isCurrent && (
                      <div className="absolute top-8 text-[8px] font-black uppercase text-primary whitespace-nowrap bg-primary/5 px-1 rounded shadow-sm">
                        BẠN ĐANG Ở ĐÂY
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100/50">
              <p className="text-[10px] font-bold text-slate-500 leading-relaxed italic">
                Hãy hoàn thành giai đoạn hiện tại để kích hoạt giai đoạn tiếp theo trong hệ thống.
              </p>
            </div>
          </Card>
        )}

        {/* Photo Checklist */}
        <Card className="p-5 rounded-[28px] border-none shadow-lg shadow-slate-900/5 bg-white space-y-4">
          <h3 className="text-xs font-black uppercase tracking-[0.1em] text-slate-800 flex items-center gap-2">
            <Camera className="h-4 w-4 text-primary" /> Ảnh xác nhận hiện trường
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">
                Trước khi sửa ({beforeCount})
              </div>
              <Button
                variant="outline"
                className="w-full aspect-square rounded-[20px] flex-col gap-2 border-2 border-dashed border-slate-100 bg-slate-50 hover:bg-slate-100/50 text-slate-400"
                onClick={() => {
                  setBeforeCount((c) => c + 1);
                  toast.success("Đã lưu ảnh Trước");
                }}
              >
                <div className="h-10 w-10 bg-white rounded-xl shadow-sm flex items-center justify-center">
                  <Camera className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-black">CHỤP ẢNH</span>
              </Button>
            </div>
            <div>
              <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">
                Sau khi xong ({afterCount})
              </div>
              <Button
                variant="outline"
                className="w-full aspect-square rounded-[20px] flex-col gap-2 border-2 border-dashed border-slate-100 bg-slate-50 hover:bg-slate-100/50 text-slate-400"
                onClick={() => {
                  setAfterCount((c) => c + 1);
                  toast.success("Đã lưu ảnh Sau");
                }}
              >
                <div className="h-10 w-10 bg-white rounded-xl shadow-sm flex items-center justify-center">
                  <Camera className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-black">CHỤP ẢNH</span>
              </Button>
            </div>
          </div>
        </Card>

        {/* Report Editor */}
        <Card className="p-5 rounded-[28px] border-none shadow-lg shadow-slate-900/5 bg-white">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-4 w-4 text-primary" />
            <h3 className="text-xs font-black uppercase tracking-[0.1em] text-slate-800">
              Biên bản bàn giao
            </h3>
          </div>
          <Textarea
            placeholder="Ghi chú chi tiết kết quả xử lý..."
            className="min-h-[120px] rounded-2xl border-slate-100 bg-slate-50 focus-visible:ring-primary shadow-inner"
            value={report}
            onChange={(e) => setReport(e.target.value)}
            disabled={isCompleted}
          />
          {!isCompleted && (
            <div className="mt-4 p-3 rounded-xl bg-orange-50 border border-orange-100 flex items-start gap-2">
              <AlertTriangle className="h-3.5 w-3.5 text-orange-500 mt-0.5" />
              <p className="text-[10px] font-black text-orange-700 uppercase tracking-wide leading-tight">
                Yêu cầu đổi lịch? Hãy liên hệ Leader ngay.
              </p>
            </div>
          )}
        </Card>
      </div>
    </AppShell>
  );
}
