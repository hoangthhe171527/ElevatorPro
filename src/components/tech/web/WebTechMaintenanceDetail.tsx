import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/common/StatusBadge";;
import {
  mockJobs,
  getCustomer,
  getElevator,
  getUser,
  formatDateTime,
  MAINTENANCE_STEPS_TEMPLATE,
  type Job,
  type JobStatus,
  type MaintenanceStep,
} from "@/lib/mock-data";
import {
  ArrowLeft,
  Building2,
  Calendar,
  Clock,
  User,
  MapPin,
  ClipboardCheck,
  Camera,
  CheckCircle2,
  AlertCircle,
  Wrench,
  ShieldCheck,
  Zap,
  Info,
  ChevronRight,
  HardHat,
  History,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";

export function WebMaintenanceJobDetail({
  job,
  readonly = false,
}: {
  job: Job;
  readonly?: boolean;
}) {
  const customer = getCustomer(job.customerId);
  const elevator = job.elevatorId ? getElevator(job.elevatorId) : undefined;
  const tech = job.assignedTo ? getUser(job.assignedTo) : undefined;

  const [steps, setSteps] = useState<MaintenanceStep[]>(
    (job.maintenanceSteps || MAINTENANCE_STEPS_TEMPLATE) as MaintenanceStep[],
  );
  const [status, setStatus] = useState<JobStatus>(job.status);

  const toggleStep = (id: string) => {
    if (readonly) return;
    setSteps((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, resolved: !s.resolved, result: !s.resolved ? "ok" : "pending" } : s,
      ),
    );
  };

  const handleComplete = () => {
    const allDone = steps.every((s) => s.resolved);
    if (!allDone) {
      toast.error("Vui lòng hoàn thành tất cả các hạng mục kiểm tra!");
      return;
    }
    setStatus("completed");
    toast.success("Đã hoàn tất bảo trì định kỳ!");
  };

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto">
        <Link
          to="/admin/jobs"
          search={{ tab: "maintenance" }}
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary mb-6 font-bold transition-all"
        >
          <ArrowLeft className="h-4 w-4" /> Quay lại danh sách Bảo trì
        </Link>

        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none px-3 py-1 rounded-lg font-black text-[10px] uppercase tracking-widest">
                Công việc Bảo trì
              </Badge>
              <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">
                Mã: {job.code}
              </span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">{job.title}</h1>
            <p className="text-slate-500 font-medium mt-1 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" /> {customer?.address}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {status !== "completed" && !readonly && (
              <Button
                onClick={handleComplete}
                className="h-14 px-8 bg-primary hover:bg-primary/90 text-white font-black rounded-2xl shadow-xl shadow-primary/20 gap-3"
              >
                <CheckCircle2 className="h-5 w-5" /> HOÀN TẤT BẢO TRÌ
              </Button>
            )}
            {status === "completed" && (
              <div className="flex items-center gap-3 bg-emerald-50 text-emerald-600 px-6 py-3 rounded-2xl border border-emerald-100 shadow-sm">
                <ShieldCheck className="h-6 w-6" />
                <span className="font-black uppercase tracking-widest text-xs">
                  Đã hoàn thành bàn giao
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Work Area */}
          <div className="lg:col-span-8 space-y-8">
            {/* Technical Checklist */}
            <Card className="rounded-[2.5rem] border-none shadow-xl shadow-slate-200/40 bg-white overflow-hidden">
              <CardHeader className="p-8 border-b border-slate-50">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-black text-slate-800 flex items-center gap-3">
                    <ClipboardCheck className="h-6 w-6 text-primary" /> Hạng mục Kiểm tra Kỹ thuật
                  </CardTitle>
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                    {steps.filter((s) => s.resolved).length} / {steps.length} Hoàn thành
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-4">
                {steps.map((step) => (
                  <div
                    key={step.id}
                    onClick={() => toggleStep(step.id)}
                    className={cn(
                      "group flex items-start gap-5 p-6 rounded-3xl border-2 transition-all cursor-pointer",
                      step.resolved
                        ? "bg-emerald-50/30 border-emerald-500/20 shadow-inner"
                        : "bg-slate-50 border-transparent hover:border-primary/20",
                    )}
                  >
                    <div
                      className={cn(
                        "h-8 w-8 rounded-xl flex items-center justify-center shrink-0 border-2 transition-all duration-300",
                        step.resolved
                          ? "bg-emerald-500 border-emerald-500 text-white scale-110 shadow-lg shadow-emerald-500/20"
                          : "bg-white border-slate-200 text-transparent group-hover:border-primary",
                      )}
                    >
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div
                        className={cn(
                          "font-black text-[15px] mb-1 transition-colors",
                          step.resolved
                            ? "text-emerald-900"
                            : "text-slate-800 group-hover:text-primary",
                        )}
                      >
                        {step.label}
                      </div>
                      <p className="text-sm text-slate-500 font-medium leading-relaxed line-clamp-2">
                        {step.description}
                      </p>
                    </div>
                    {step.resolved && (
                      <div className="flex items-center gap-2">
                        <Badge className="bg-emerald-100 text-emerald-700 border-none font-black text-[9px] uppercase">
                          OK
                        </Badge>
                        <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full">
                          <Camera className="h-4 w-4 text-emerald-600" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Technical Report & Notes */}
            <Card className="rounded-[2.5rem] border-none shadow-xl shadow-slate-200/40 bg-white p-8">
              <h3 className="font-black text-lg text-slate-800 mb-6 flex items-center gap-2">
                <History className="h-5 w-5 text-primary" /> Báo cáo Hiện trạng & Ghi chú
              </h3>
              <textarea
                className="w-full min-h-[150px] p-6 rounded-3xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-primary/20 outline-none font-medium text-slate-600 italic leading-relaxed"
                placeholder="Nhập các lưu ý đặc biệt, tiếng động lạ hoặc tình trạng thiết bị cần theo dõi..."
                defaultValue={job.report}
                readOnly={readonly}
              />
              <div className="mt-6 p-5 rounded-2xl bg-amber-50 border border-amber-100 flex items-start gap-4 text-amber-800">
                <Info className="h-5 w-5 shrink-0 text-amber-500 mt-0.5" />
                <p className="text-xs font-bold leading-relaxed">
                  Nếu phát sinh hư hỏng cần thay thế linh kiện, vui lòng tạo riêng một "Yêu cầu sửa
                  chữa" để đảm bảo đúng quy trình hạch toán vật tư.
                </p>
              </div>
            </Card>

            {/* Photo Evidence */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="rounded-[2.5rem] border-none shadow-xl shadow-slate-200/40 bg-white p-8">
                <h3 className="font-black text-[11px] uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                  <Camera className="h-4 w-4" /> Hình ảnh Tủ điện & Động cơ
                </h3>
                <div className="aspect-video rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 group hover:border-primary transition-colors cursor-pointer">
                  <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
                    <Plus className="h-6 w-6" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Tải ảnh hiện trường
                  </span>
                </div>
              </Card>
              <Card className="rounded-[2.5rem] border-none shadow-xl shadow-slate-200/40 bg-white p-8">
                <h3 className="font-black text-[11px] uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                  <Camera className="h-4 w-4" /> Hình ảnh Cabin & Cửa tầng
                </h3>
                <div className="aspect-video rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 group hover:border-primary transition-colors cursor-pointer">
                  <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
                    <Plus className="h-6 w-6" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Tải ảnh hiện trường
                  </span>
                </div>
              </Card>
            </div>
          </div>

          {/* Technical Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            {/* Technician Info */}
            <Card className="rounded-[2.5rem] border-none shadow-xl shadow-slate-200/40 bg-slate-900 text-white p-8 overflow-hidden relative">
              <div className="absolute -right-8 -top-8 h-32 w-32 bg-primary/20 rounded-full blur-3xl" />
              <h3 className="font-black text-[11px] uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2 relative z-10">
                <HardHat className="h-4 w-4" /> Kỹ thuật phụ trách
              </h3>
              <div className="flex items-center gap-5 relative z-10">
                <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-primary/20">
                  {tech?.name.charAt(0)}
                </div>
                <div>
                  <div className="font-black text-lg">{tech?.name}</div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                    Team Kỹ thuật Bảo trì
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-white/5 space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">Giờ đến:</span>
                  <span className="text-sm font-black">{formatDateTime(job.scheduledFor)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">Trạng thái:</span>
                  <StatusBadge
                    variant={status === "completed" ? "success" : "warning"}
                    className="h-5 text-[9px]"
                  >
                    {status === "completed" ? "Hoàn tất" : "Đang xử lý"}
                  </StatusBadge>
                </div>
              </div>
            </Card>

            {/* Elevator Specs */}
            <Card className="rounded-[2.5rem] border-none shadow-xl shadow-slate-200/40 bg-white p-8">
              <h3 className="font-black text-[11px] uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                <Building2 className="h-4 w-4" /> Thông tin Thiết bị
              </h3>
              {elevator && (
                <div className="space-y-6">
                  <div className="p-5 rounded-3xl bg-slate-50 border border-slate-100">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      Mã thang máy
                    </div>
                    <div className="text-2xl font-black text-slate-800 font-mono tracking-tight">
                      {elevator.code}
                    </div>
                  </div>
                  <div className="space-y-4 px-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-bold text-slate-400">Thương hiệu:</span>
                      <span className="font-black text-slate-800">{elevator.brand}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-bold text-slate-400">Số tầng:</span>
                      <span className="font-black text-slate-800">{elevator.floors} Tầng</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-bold text-slate-400">Tòa nhà:</span>
                      <span className="font-black text-slate-800 text-right">
                        {elevator.building}
                      </span>
                    </div>
                  </div>
                  <div className="pt-6 border-t border-slate-50">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                      Lịch sử bảo trì
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-emerald-500" />
                        <span className="text-xs font-bold text-slate-600">
                          Lần cuối: {formatDateTime(elevator.lastMaintenance).split(",")[0]}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-xs font-black text-primary">
                          Tiếp theo: {formatDateTime(elevator.nextMaintenance).split(",")[0]}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Link
                    to="/admin/elevators/$elevatorId"
                    params={{ elevatorId: elevator.id }}
                    className="block pt-4"
                  >
                    <Button
                      variant="ghost"
                      className="w-full text-primary font-black uppercase text-[10px] gap-2"
                    >
                      Xem hồ sơ kỹ thuật đầy đủ <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              )}
            </Card>

            {/* Customer Quick View */}
            <Card className="rounded-[2.5rem] border-none shadow-xl shadow-slate-200/40 bg-white p-8">
              <h3 className="font-black text-[11px] uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                <User className="h-4 w-4" /> Thông tin Khách hàng
              </h3>
              {customer && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                      <User className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="font-black text-slate-800 text-[15px]">{customer.name}</div>
                      <div className="text-xs text-slate-500 font-bold">{customer.phone}</div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full h-10 rounded-xl border-slate-200 text-slate-600 font-black uppercase text-[10px]"
                  >
                    Liên hệ Khách hàng
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
