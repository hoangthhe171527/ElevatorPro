import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";;
import {
  elevatorStatusLabel,
  elevatorStatusVariant,
  jobStatusLabel,
  jobStatusVariant,
} from "@/lib/status-variants";
import {
  mockJobs,
  getCustomer,
  getProject,
  formatDate,
  formatDateTime,
  type Elevator,
} from "@/lib/mock-data";
import { CreateJobModal } from "@/components/common/Modals";
import {
  ArrowLeft,
  Building2,
  Calendar,
  Briefcase,
  MapPin,
  Plus,
  AlertTriangle,
  Clock,
  Wrench,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileElevatorDetail({ elevator }: { elevator: Elevator }) {
  const [jobOpen, setJobOpen] = useState(false);
  const project = getProject(elevator.projectId);
  const customer = project ? getCustomer(project.customerId) : undefined;
  const history = mockJobs
    .filter((j) => j.elevatorId === elevator.id)
    .sort((a, b) => b.scheduledFor.localeCompare(a.scheduledFor));

  const isDue = elevator.status === "maintenance_due";
  const isOut = elevator.status === "out_of_order";

  return (
    <AppShell>
      {/* Top Banner */}
      <div
        className={cn(
          "mx--4 px-4 pt-4 pb-8 mb-4 relative overflow-hidden rounded-b-[2rem] shadow-xl transition-colors",
          isOut
            ? "bg-rose-600 shadow-rose-500/20"
            : isDue
              ? "bg-amber-500 shadow-amber-500/20"
              : "bg-slate-900 shadow-slate-900/10",
        )}
      >
        <div className="absolute top-0 right-0 p-4 opacity-5">
          <Building2 className="h-40 w-40 text-white" />
        </div>
        <div className="relative z-10 flex items-center justify-between mb-8">
          <Link
            to="/app/admin/elevators"
            className="h-10 w-10 bg-white/10 rounded-full flex items-center justify-center text-white backdrop-blur-sm"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <StatusBadge
            variant={elevatorStatusVariant[elevator.status]}
            className={cn(
              "text-[9px] px-2 uppercase font-black tracking-widest border-none shadow-sm",
              isOut
                ? "bg-rose-100 text-rose-600"
                : isDue
                  ? "bg-amber-100 text-amber-600"
                  : "bg-emerald-500 text-white",
            )}
          >
            {elevatorStatusLabel[elevator.status]}
          </StatusBadge>
        </div>
        <div className="relative z-10 pr-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-white/20 text-white px-2 py-0.5 rounded uppercase font-black text-[10px] tracking-widest">
              Mã TB: {elevator.code}
            </span>
          </div>
          <h1 className="text-3xl font-black text-white leading-tight mb-2">
            {elevator.brand} {elevator.model}
          </h1>
          <div className="flex items-center gap-1.5 text-white/70 text-[12px] font-bold">
            <MapPin className="h-3.5 w-3.5" /> {elevator.building}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 pb-8 relative z-20 -mt-8 mx-4">
        {/* Action Card */}
        {(isOut || isDue) && (
          <div
            className={cn(
              "p-5 rounded-[24px] shadow-lg flex flex-col gap-4",
              isOut ? "bg-rose-50 border border-rose-100" : "bg-amber-50 border border-amber-100",
            )}
          >
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center shrink-0",
                  isOut ? "bg-rose-500 text-white" : "bg-amber-500 text-white",
                )}
              >
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <div
                  className={cn(
                    "font-black text-[14px]",
                    isOut ? "text-rose-700" : "text-amber-700",
                  )}
                >
                  {isOut ? "CẢNH BÁO: THANG ĐANG HỎNG" : "CHÚ Ý: ĐẾN HẠN BẢO TRÌ"}
                </div>
                <p
                  className={cn(
                    "text-[11px] font-bold opacity-70",
                    isOut ? "text-rose-600" : "text-amber-600",
                  )}
                >
                  {isOut
                    ? "Cần điều phối đội kỹ thuật xử lý ngay lập tức."
                    : "Kế hoạch bảo trì định kỳ đã quá hạn."}
                </p>
              </div>
            </div>
            <Button
              className={cn(
                "w-full h-12 rounded-xl font-black uppercase text-[11px] shadow-sm",
                isOut ? "bg-rose-600" : "bg-amber-600",
              )}
              onClick={() => setJobOpen(true)}
            >
              Khởi tạo phiếu xử lý khẩn
            </Button>
          </div>
        )}

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 mt-2">
          <div className="bg-white rounded-[24px] p-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-col justify-between">
            <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-3">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                Số tầng
              </div>
              <div className="text-xl font-black text-slate-800">{elevator.floors} Tầng</div>
            </div>
          </div>
          <div className="bg-white rounded-[24px] p-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-col justify-between">
            <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500 mb-3">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                Bảo hành
              </div>
              <div className="text-[13px] font-black text-emerald-600">
                {formatDate(elevator.warrantyUntil)}
              </div>
            </div>
          </div>
        </div>

        {/* Maintenance Status Section */}
        <div className="bg-white rounded-[24px] p-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-slate-100">
          <h3 className="font-black text-[12px] text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" /> Bảo trì định kỳ
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl text-[12px]">
              <span className="text-slate-500 font-bold">Lần gần nhất</span>
              <span className="font-black text-slate-800">
                {formatDate(elevator.lastMaintenance)}
              </span>
            </div>
            <div
              className={cn(
                "flex items-center justify-between p-3 rounded-xl text-[12px] border",
                isDue
                  ? "bg-amber-50 border-amber-200 text-amber-700"
                  : "bg-emerald-50 border-emerald-100 text-emerald-700",
              )}
            >
              <span className="font-bold">Lần tiếp theo</span>
              <span className="font-black">{formatDate(elevator.nextMaintenance)}</span>
            </div>
          </div>
        </div>

        {/* Job History Section */}
        <div className="mt-2">
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="font-black text-[12px] text-slate-800 uppercase tracking-widest flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-primary" /> Nhật ký sửa chữa
            </h3>
            <span className="text-[10px] font-black text-slate-400">{history.length} bản ghi</span>
          </div>
          <div className="flex flex-col gap-3">
            {history.map((j) => (
              <Link
                key={j.id}
                to="/app/admin/jobs/$jobId"
                params={{ jobId: j.id }}
                search={{ readonly: "true" }}
              >
                <div className="bg-white p-4 rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-slate-100 flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "h-10 w-10 rounded-2xl flex items-center justify-center",
                        j.status === "completed"
                          ? "bg-emerald-50 text-emerald-500"
                          : "bg-primary/5 text-primary",
                      )}
                    >
                      <Wrench className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-black text-[13px] text-slate-800 line-clamp-1">
                        {j.title}
                      </div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {formatDate(j.scheduledFor)}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-primary transition-colors" />
                </div>
              </Link>
            ))}
            {history.length === 0 && (
              <div className="py-8 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200 text-slate-400">
                <p className="text-[11px] font-bold uppercase tracking-widest">Chưa có lịch sử</p>
              </div>
            )}
          </div>
        </div>

        {/* Customer Quick Link */}
        {customer && (
          <div className="bg-slate-800 rounded-[24px] p-5 text-white shadow-xl shadow-slate-900/20 mt-2">
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center text-white/50">
                <Building2 className="h-5 w-5" />
              </div>
              <div className="text-[9px] font-black uppercase tracking-widest text-white/40">
                Khách hàng chủ quản
              </div>
            </div>
            <div className="font-black text-[16px] mb-1">{customer.name}</div>
            <div className="text-[11px] font-medium text-white/60 mb-6">{customer.address}</div>
            <Button
              variant="ghost"
              className="w-full justify-between h-10 px-4 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] uppercase font-black tracking-widest"
            >
              Liên hệ Hotline <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <CreateJobModal
        open={jobOpen}
        onClose={() => setJobOpen(false)}
        defaultElevatorId={elevator.id}
        defaultCustomerId={project?.customerId}
      />
    </AppShell>
  );
}
