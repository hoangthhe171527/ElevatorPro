import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
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
  getUser,
  formatDateTime,
  type Job,
  type JobStatus,
} from "@/lib/mock-data";
import {
  ArrowLeft,
  Building2,
  Calendar,
  Clock,
  User,
  MapPin,
  ClipboardList,
  Camera,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  CreditCard,
  Wrench,
  ShieldCheck,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { DispatchJobModal } from "@/components/common/Modals";
import { cn } from "@/lib/utils";

export function MobileJobDetail({ job, readonly = false }: { job: Job; readonly?: boolean }) {
  const customer = getCustomer(job.customerId);
  const elevator = job.elevatorId ? getElevator(job.elevatorId) : undefined;
  const tech = job.assignedTo ? getUser(job.assignedTo) : undefined;

  const [status, setStatus] = useState<JobStatus>(job.status);
  const [isApproved, setIsApproved] = useState(job.isManagerApproved || false);
  const [techOpen, setTechOpen] = useState(false);

  const handleManagerApprove = () => {
    setIsApproved(true);
    setStatus("manager_approved");
    toast.success("Hồ sơ kỹ thuật đã được duyệt!");
  };

  const handleDispatch = (jobId: string, userId: string) => {
    const jobRef = mockJobs.find((j) => j.id === jobId);
    if (jobRef) {
      jobRef.assignedTo = userId;
      jobRef.status = "scheduled";
      setStatus("scheduled");
      toast.success("Đã phân công!");
    }
  };

  const STAGES = [
    { id: "scheduled", label: "Lịch" },
    { id: "in_progress", label: "Thi công" },
    ...(job.tenantId === "t-1" ? [{ id: "review", label: "QT duyệt" }] : []),
    ...(job.type === "repair" ? [{ id: "payment", label: "Thu tiền" }] : []),
    { id: "completed", label: "Đóng" },
  ];

  return (
    <AppShell>
      {/* Top Banner Context Area */}
      <div className="bg-slate-900 mx--4 px-4 pt-4 pb-8 mb-4 relative overflow-hidden rounded-b-[2rem] shadow-xl shadow-slate-900/10">
        <div className="absolute top-0 right-0 p-4 opacity-5">
          <ClipboardList className="h-32 w-32 text-white" />
        </div>
        <div className="relative z-10 flex items-center justify-between mb-6">
          <Link
            to="/app/admin/jobs"
            className="h-10 w-10 bg-white/10 rounded-full flex items-center justify-center text-white backdrop-blur-sm"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex gap-2">
            <StatusBadge
              variant={priorityVariant[job.priority]}
              className="text-[9px] px-2 uppercase font-black tracking-widest"
            >
              {priorityLabel[job.priority]}
            </StatusBadge>
          </div>
        </div>
        <div className="relative z-10 pr-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded uppercase font-black tracking-widest">
              ID: {job.code.split("-")[1] || job.code}
            </span>
          </div>
          <h1 className="text-2xl font-black text-white leading-tight mb-2">{job.title}</h1>
          <div className="flex items-center gap-2 text-white/50 text-[11px] font-bold">
            Cập nhật: {formatDateTime(job.createdAt)}
          </div>
        </div>
        {readonly && (
          <div className="absolute top-4 right-4 h-8 px-3 bg-blue-500/20 border border-blue-500/50 rounded-full flex items-center justify-center text-[9px] font-black uppercase tracking-widest text-blue-300 backdrop-blur-md">
            <ShieldCheck className="h-3 w-3 mr-1" /> View Only
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4 pb-8 relative z-20 -mt-8 mx-4">
        {/* Mobile Dots Tracker */}
        <div className="bg-white p-5 rounded-[24px] shadow-[0_2px_10px_rgba(0,0,0,0.06)] border border-slate-100">
          <div className="flex justify-between items-end mb-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Tiến trình
            </span>
            <span className="text-[11px] font-black text-primary uppercase tracking-widest">
              {jobStatusLabel[status]}
            </span>
          </div>
          <div className="flex justify-between relative px-2 py-4">
            <div className="absolute top-1/2 left-4 right-4 h-1 bg-slate-100 -translate-y-1/2 -z-0 rounded-full" />
            {STAGES.map((s, idx) => {
              const isDone =
                status === "completed" ||
                (s.id === "scheduled" &&
                  ["scheduled", "in_progress", "manager_approved", "completed"].includes(status)) ||
                (s.id === "in_progress" &&
                  ["in_progress", "manager_approved", "completed"].includes(status)) ||
                (s.id === "review" && isApproved);
              const isCurrent =
                (s.id === "scheduled" && status === "scheduled") ||
                (s.id === "in_progress" && status === "in_progress") ||
                (s.id === "review" && status === "in_progress" && job.report && !isApproved) ||
                (job.tenantId === "t-2" &&
                  s.id === "completed" &&
                  status === "in_progress" &&
                  job.report);

              return (
                <div key={s.id} className="relative z-10 flex flex-col items-center">
                  <div
                    className={cn(
                      "flex h-4 w-4 items-center justify-center rounded-full transition-all ring-4 ring-white shadow-sm mb-1",
                      isDone
                        ? "bg-primary scale-110"
                        : isCurrent
                          ? "bg-primary rounded-full animate-pulse border-none scale-150 shadow-primary/30"
                          : "bg-slate-200",
                    )}
                  />
                  <span
                    className={cn(
                      "text-[9px] font-black uppercase tracking-widest absolute top-6 whitespace-nowrap",
                      isCurrent ? "text-primary" : "text-slate-400 opacity-50",
                    )}
                  >
                    {isCurrent && s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Personnel Card */}
        <div className="bg-white p-5 rounded-[24px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {tech ? (
              <>
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-xl shadow-inner">
                  {tech.name.charAt(0)}
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">
                    Thợ bảo trì
                  </div>
                  <div className="font-black text-[15px] text-slate-800">{tech.name}</div>
                </div>
              </>
            ) : (
              <>
                <div className="h-12 w-12 rounded-2xl bg-rose-50 border-2 border-rose-100 border-dashed flex items-center justify-center text-rose-500">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[10px] text-rose-400 font-bold uppercase tracking-widest mb-0.5">
                    Chưa phân công
                  </div>
                  <div className="font-black text-[13px] text-rose-600">Leader cần chọn thợ</div>
                </div>
              </>
            )}
          </div>
          {!readonly && (
            <Button
              size="icon"
              variant="ghost"
              className="h-10 w-10 bg-slate-50 rounded-xl"
              onClick={() => setTechOpen(true)}
            >
              <ChevronRightIcon />
            </Button>
          )}
        </div>

        {/* Content Block */}
        <div className="bg-white p-5 rounded-[24px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-slate-100 space-y-4">
          <h3 className="font-black text-[12px] text-slate-800 uppercase tracking-widest flex items-center gap-2">
            <ClipboardList className="h-4 w-4 text-primary" /> Yêu cầu kỹ thuật
          </h3>
          <p className="text-slate-500 text-[13px] leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 line-clamp-4">
            {job.description || "Chưa có mô tả đính kèm."}
          </p>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="text-[9px] uppercase tracking-widest font-bold text-slate-400 mb-1 flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Lịch hẹn
              </div>
              <div className="font-black text-[11px] text-slate-800">
                {formatDateTime(job.scheduledFor).split(",")[0]}
              </div>
            </div>
            <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100/50 text-emerald-800">
              <div className="text-[9px] uppercase tracking-widest font-bold opacity-70 mb-1 flex items-center gap-1">
                <Clock className="h-3 w-3" /> Chốt mốc
              </div>
              <div className="font-black text-[11px]">
                {job.completedAt ? (
                  formatDateTime(job.completedAt).split(",")[0]
                ) : (
                  <span className="italic opacity-60">Chưa xong</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Photos Swipe Row */}
        <div className="bg-white p-5 rounded-[24px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-slate-100">
          <h3 className="font-black text-[12px] text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Camera className="h-4 w-4 text-primary" /> Ảnh Checklist nghiệm thu
          </h3>
          <div className="flex overflow-x-auto hide-scrollbar gap-3 snap-x pb-2 -mx-5 px-5">
            {job.afterPhotos && job.afterPhotos.length > 0 ? (
              job.afterPhotos.map((_, i) => (
                <div
                  key={i}
                  className="h-28 w-28 shrink-0 snap-center rounded-2xl bg-slate-100 border-[3px] border-emerald-400/20 flex flex-col items-center justify-center text-emerald-500 shadow-sm relative overflow-hidden"
                >
                  <ImageIcon className="h-6 w-6 opacity-30 mb-1" />
                  <span className="text-[9px] font-black uppercase tracking-widest opacity-50">
                    Sau #{i + 1}
                  </span>
                </div>
              ))
            ) : (
              <div className="h-28 w-full rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
                <Camera className="h-6 w-6 opacity-30 mb-1" />
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">
                  Chưa tải ảnh lên
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Approvals Mobile Native Layout */}
        <div className="mt-2 space-y-3">
          {job.tenantId === "t-1" ? (
            <div
              className={cn(
                "p-5 rounded-[24px] border flex items-center justify-between",
                isApproved
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800 shadow-sm"
                  : "bg-white border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)]",
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "h-12 w-12 rounded-xl flex items-center justify-center shadow-inner",
                    isApproved ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400",
                  )}
                >
                  <UserCheck className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-[13px] font-black uppercase tracking-wide mb-0.5">
                    Báo cáo QA/QC
                  </div>
                  <div className="text-[10px] opacity-70 font-bold tracking-wide uppercase">
                    {isApproved ? "Leader đã duyệt" : "Chờ QC"}
                  </div>
                </div>
              </div>
              {!readonly && !isApproved && job.report && (
                <Button
                  onClick={handleManagerApprove}
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-[10px] uppercase font-black px-4 rounded-xl shadow-md h-10"
                >
                  Duyệt Pass
                </Button>
              )}
            </div>
          ) : (
            <div
              className={cn(
                "p-6 rounded-[24px] border flex flex-col items-center justify-center gap-4 text-center",
                status === "completed"
                  ? "bg-emerald-50/50 border-emerald-200 shadow-sm"
                  : "bg-blue-50 border-blue-200",
              )}
            >
              {status === "completed" ? (
                <>
                  <div className="h-14 w-14 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <CheckCircle2 className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <div className="font-black text-emerald-600 text-[15px] uppercase tracking-wide">
                      Ca trực hoàn tất
                    </div>
                    <div className="text-[11px] text-emerald-600/70 font-bold mt-1">
                      Hồ sơ đã khóa (Auto Pass).
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="h-14 w-14 bg-blue-100 rounded-full flex items-center justify-center border-4 border-white">
                    <Wrench className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <div className="font-black text-blue-800 text-[15px] uppercase tracking-wide">
                      Sẵn sàng chốt (Auto Pass)
                    </div>
                    <div className="text-[11px] text-blue-800/60 font-bold mt-1">
                      Lead xác nhận ngay không cần duyệt chéo.
                    </div>
                  </div>
                  {!readonly && job.report && (
                    <Button
                      onClick={() => {
                        setStatus("completed");
                        toast.success("Đã hoàn tất!");
                      }}
                      className="h-12 w-full rounded-xl font-black bg-blue-600 text-white text-[12px] uppercase shadow-md shadow-blue-500/30"
                    >
                      Chốt hồ sơ ngay
                    </Button>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Link Cards (Customers & Assets) */}
        <div className="grid grid-cols-2 gap-3 mt-2">
          {customer && (
            <div className="bg-slate-800 rounded-[20px] p-4 text-white shadow-xl shadow-slate-900/10">
              <div className="h-8 w-8 bg-white/10 rounded-lg flex items-center justify-center mb-3 text-white/50">
                <User className="h-4 w-4" />
              </div>
              <div className="text-[12px] font-black leading-tight line-clamp-1 mb-1">
                {customer.name}
              </div>
              <div className="text-[10px] font-bold text-white/50 uppercase tracking-widest mt-auto shrink-0 flex items-center gap-1">
                Khách <ChevronRightIcon />
              </div>
            </div>
          )}
          {elevator && (
            <Link
              to="/app/admin/elevators/$elevatorId"
              params={{ elevatorId: elevator.id }}
              className="block"
            >
              <div className="bg-primary rounded-[20px] p-4 text-white shadow-xl shadow-primary/20">
                <div className="h-8 w-8 bg-white/20 rounded-lg flex items-center justify-center mb-3 text-white/80">
                  <Building2 className="h-4 w-4" />
                </div>
                <div className="text-[15px] font-black font-mono leading-tight line-clamp-1 mb-1">
                  {elevator.code}
                </div>
                <div className="text-[10px] font-bold text-white/70 uppercase tracking-widest mt-auto shrink-0 flex items-center gap-1">
                  Tài sản <ChevronRightIcon />
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>

      <DispatchJobModal
        open={techOpen}
        onClose={() => setTechOpen(false)}
        job={job}
        onDispatch={handleDispatch}
      />
    </AppShell>
  );
}

const ChevronRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);
