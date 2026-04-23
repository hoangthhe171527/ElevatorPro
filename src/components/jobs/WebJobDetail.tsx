import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  jobStatusLabel,
  jobStatusVariant,
  priorityLabel,
  priorityVariant,
} from "@/lib/status-variants";
import { mockJobs, getCustomer, getElevator, getUser, formatDateTime, type Job, type JobStatus } from "@/lib/mock-data";
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
} from "lucide-react";
import { toast } from "sonner";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { DispatchJobModal } from "@/components/common/Modals";

export function WebJobDetail({ 
  job, 
  readonly = false 
}: { 
  job: Job; 
  readonly?: boolean 
}) {
  const customer = getCustomer(job.customerId);
  const elevator = job.elevatorId ? getElevator(job.elevatorId) : undefined;
  const tech = job.assignedTo ? getUser(job.assignedTo) : undefined;
  
  const [status, setStatus] = useState<JobStatus>(job.status);
  const [isApproved, setIsApproved] = useState(job.isManagerApproved || false);
  const [editOpen, setEditOpen] = useState(false);
  const [techOpen, setTechOpen] = useState(false);

  const handleManagerApprove = () => {
    setIsApproved(true);
    setStatus("manager_approved");
    toast.success("Hồ sơ kỹ thuật đã được duyệt!");
  };

  const handleDispatch = (jobId: string, userId: string) => {
    const jobRef = mockJobs.find(j => j.id === jobId);
    if (jobRef) {
      jobRef.assignedTo = userId;
      jobRef.status = "scheduled";
      setStatus("scheduled");
      toast.success("Đã phân công kỹ thuật viên thành công!");
    }
  };

  return (
    <AppShell>
      <Link
        to="/admin/jobs"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 font-medium transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Quay lại danh sách công việc
      </Link>

      <PageHeader
        title={job.title}
        description={`Mã việc: ${job.code} · Cập nhật lần cuối: ${formatDateTime(job.createdAt)}`}
        actions={!readonly && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setEditOpen(true)} className="shadow-sm">
              Sửa nội dung
            </Button>
          </div>
        )}
      />
      
      {job.status === "pending" && (
        <div className="mb-6 p-6 rounded-3xl bg-amber-500 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-amber-500/20 animate-in fade-in slide-in-from-top-4 duration-500">
           <div className="flex items-center gap-5">
              <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                 <UserCheck className="h-8 w-8" />
              </div>
              <div>
                 <h4 className="font-black text-xl uppercase tracking-tight">Cần phân công ngay</h4>
                 <p className="text-sm font-medium opacity-90 mt-0.5">Công việc này chưa có kỹ thuật viên phụ trách. Vui lòng chọn thợ phù hợp để bắt đầu.</p>
              </div>
           </div>
           <Button 
            className="bg-white text-amber-600 hover:bg-amber-50 font-black text-sm rounded-xl px-8 h-12 shadow-lg shrink-0"
            onClick={() => setTechOpen(true)}
           >
              CHỌN KỸ THUẬT VIÊN
           </Button>
        </div>
      )}

      {readonly && (
        <div className="mb-6 p-4 bg-blue-50/50 border border-blue-100 rounded-xl flex items-center gap-3 text-blue-700 shadow-sm">
          <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
             <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
             <div className="text-sm font-bold">Chế độ Giám sát (Chỉ đọc)</div>
             <div className="text-xs opacity-80 mt-0.5">Mọi thao tác thay đổi dữ liệu đã bị khóa để đảm bảo tính minh bạch.</div>
          </div>
        </div>
      )}

      {/* Web Horizontal Tracker */}
      <div className="mb-8 overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between">
          {[
            { id: "scheduled", label: "Lên lịch", icon: Calendar },
            { id: "in_progress", label: "Đang làm", icon: Wrench },
            ...(job.tenantId === "t-1" ? [{ id: "review", label: "QT duyệt", icon: UserCheck }] : []),
            ...(job.type === "repair" ? [{ id: "payment", label: "Thanh toán", icon: CreditCard }] : []),
            { id: "completed", label: "Hoàn thành", icon: CheckCircle2 },
          ].map((s, idx, arr) => {
            const isDone = (status === "completed") || 
                           (s.id === "scheduled" && ["scheduled", "in_progress", "manager_approved", "completed"].includes(status)) ||
                           (s.id === "in_progress" && ["in_progress", "manager_approved", "completed"].includes(status)) ||
                           (s.id === "review" && isApproved);
            
            const isCurrent = (s.id === "scheduled" && status === "scheduled") ||
                             (s.id === "in_progress" && status === "in_progress") ||
                             (s.id === "review" && (status === "in_progress" && job.report && !isApproved)) ||
                             (job.tenantId === "t-2" && s.id === "completed" && status === "in_progress" && job.report);

            return (
              <div key={s.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center gap-2 min-w-[120px] relative z-10 w-full">
                  <div className={`h-12 w-12 rounded-2xl flex items-center justify-center border-[3px] transition-all duration-500 shadow-sm ${
                    isDone ? "bg-primary border-primary text-white scale-110" : 
                    isCurrent ? "bg-white border-primary text-primary animate-pulse shadow-primary/20 scale-110" : 
                    "bg-slate-50 border-slate-200 text-slate-400"
                  }`}>
                    <s.icon className={`h-6 w-6 ${isCurrent && !isDone && "animate-bounce"}`} />
                  </div>
                  <span className={`text-[11px] uppercase tracking-widest font-bold mt-1 ${isCurrent ? "text-primary" : isDone ? "text-slate-800" : "text-slate-400"}`}>
                    {s.label}
                  </span>
                </div>
                {idx < arr.length - 1 && (
                  <div className={`h-1.5 flex-1 rounded-full mx-2 -ml-6 -mr-6 z-0 ${isDone ? "bg-primary" : "bg-slate-100"}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mt-6">
        {/* Left Column: Main Detail */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-8 shadow-sm border-slate-100 rounded-3xl">
            <div className="flex justify-between items-start mb-8 pb-6 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-black text-slate-800 flex items-center gap-3">
                  <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <ClipboardList className="h-5 w-5 text-primary" /> 
                  </div>
                  Mô tả & Yêu cầu Kỹ thuật
                </h2>
              </div>
              <div className="flex gap-2">
                <StatusBadge variant={jobStatusVariant[status]}>
                  {jobStatusLabel[status]}
                </StatusBadge>
                <StatusBadge variant={priorityVariant[job.priority]}>
                  {priorityLabel[job.priority]}
                </StatusBadge>
              </div>
            </div>

            <p className="text-slate-600 text-[15px] leading-relaxed mb-8 bg-slate-50 p-6 rounded-2xl border border-slate-100">
               {job.description || "Không có nội dung mô tả đính kèm."}
            </p>

            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex-1 flex items-start gap-4 bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
                <div className="h-12 w-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                  <Calendar className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-widest font-bold text-slate-400 mb-1">Lịch bắt đầu</div>
                  <div className="font-bold text-[15px] text-slate-800">{formatDateTime(job.scheduledFor)}</div>
                </div>
              </div>

              <div className="flex-1 flex items-start gap-4 bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
                <div className="h-12 w-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-widest font-bold text-slate-400 mb-1">Nghiệm thu thực tế</div>
                  <div className="font-bold text-[15px] text-slate-800">
                    {job.completedAt ? formatDateTime(job.completedAt) : <span className="text-slate-400 italic font-medium mt-1 inline-block">Chưa đo lường</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Technical Approvals */}
            <div className="mt-8 pt-8 border-t border-slate-100">
              <h3 className="font-black mb-6 text-sm uppercase tracking-widest text-slate-500">
                Phòng quản lý chất lượng (QC)
              </h3>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {job.tenantId === "t-1" ? (
                    <div className={`p-6 rounded-2xl border flex items-center justify-between ${isApproved ? "bg-emerald-50/50 border-emerald-200" : "bg-slate-50 border-slate-200"}`}>
                      <div className="flex items-center gap-4">
                        <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${isApproved ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20" : "bg-white border border-slate-200 text-slate-400"}`}>
                          <UserCheck className="h-6 w-6" />
                        </div>
                        <div>
                          <div className="text-[15px] font-bold text-slate-800">Phê duyệt Báo cáo</div>
                          <div className="text-xs text-slate-500 font-medium mt-0.5">{isApproved ? "Đã được kiểm tra bởi Trưởng phòng" : "Trạng thái: Đang chờ"}</div>
                        </div>
                      </div>
                      {!readonly && !isApproved && job.report && (
                        <Button onClick={handleManagerApprove} className="bg-primary hover:bg-primary/90 text-white font-bold h-10 px-6 rounded-xl shadow-md">Duyệt Báo cáo</Button>
                      )}
                    </div>
                ) : (
                  <div className={`col-span-2 p-8 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center gap-5 ${status === "completed" ? "bg-emerald-50/50 border-emerald-200" : "bg-blue-50 border-blue-200"}`}>
                    {status === "completed" ? (
                      <>
                        <div className="h-16 w-16 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20">
                          <CheckCircle2 className="h-8 w-8 text-white" />
                        </div>
                        <div className="text-center">
                          <div className="font-black text-emerald-600 text-lg">Ca trực đã khép lại</div>
                          <div className="text-sm text-slate-600 font-medium mt-1">Dữ liệu đã được lưu trữ vĩnh viễn trên đám mây.</div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                           <Wrench className="h-8 w-8 text-blue-500" />
                        </div>
                        <div className="text-center">
                          <div className="font-black text-blue-800 text-lg">Không yêu cầu duyệt tay (Auto-Pass)</div>
                          <div className="text-sm text-slate-600 font-medium mt-1">Khách thợ chỉ báo cáo là hệ thống sẽ đóng job cho công ty nhỏ.</div>
                        </div>
                        {!readonly && job.report && (
                           <Button onClick={() => {
                             setStatus("completed");
                             toast.success("Đã hoàn tất công việc!");
                           }} className="h-12 px-8 rounded-xl font-black bg-blue-600 hover:bg-blue-700 text-white shadow-md">Bấm khép hồ sơ ngay</Button>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>

              {job.type === "maintenance" && status !== "completed" && (
                <div className="mt-6 p-5 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-start gap-4 text-indigo-800 shadow-inner">
                  <AlertCircle className="h-6 w-6 shrink-0 text-indigo-500 mt-0.5" />
                  <div className="text-[13px] leading-relaxed font-medium">
                    <span className="font-bold uppercase tracking-wider block mb-1">Quy định thay thế linh kiện</span>
                    Nếu phát sinh hỏng hóc trong báo cáo bảo trì, bạn KHÔNG ĐƯỢC làm chung hóa đơn. Phải bấm "Tạo task sửa chữa" để hạch toán độc lập nhằm đảm bảo đúng luật kế toán.
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Photo Evidence */}
          <Card className="p-8 shadow-sm border-slate-100 rounded-3xl">
            <h2 className="text-lg font-black flex items-center gap-2 mb-6">
              <Camera className="h-5 w-5 text-primary" /> Bằng chứng hiện trường
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xs font-bold mb-4 text-slate-400 uppercase tracking-widest">
                  Tình trạng nhận việc
                </h4>
                {job.beforePhotos?.length > 0 ? (
                  <div className="grid grid-cols-3 gap-3">
                    {job.beforePhotos.map((p: string, idx: number) => (
                      <div
                        key={idx}
                        className="aspect-square rounded-2xl bg-slate-100 flex items-center justify-center text-[10px] uppercase font-bold text-slate-400 overflow-hidden border border-slate-200 hover:border-primary transition-colors cursor-pointer"
                      >
                        Bản in {idx + 1}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="aspect-[3/1] bg-slate-50 border border-dashed rounded-2xl flex items-center justify-center">
                    <span className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">
                      Trống
                    </span>
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-xs font-bold mb-4 text-slate-400 uppercase tracking-widest">Nghiệm thu (Ký nhận)</h4>
                {job.afterPhotos?.length > 0 ? (
                  <div className="grid grid-cols-3 gap-3">
                    {job.afterPhotos.map((p: string, idx: number) => (
                      <div
                        key={idx}
                        className="aspect-square rounded-2xl bg-slate-100 flex items-center justify-center text-[10px] uppercase font-bold text-slate-400 overflow-hidden border-2 border-emerald-500/30 hover:border-emerald-500 transition-colors cursor-pointer relative"
                      >
                        File {idx + 1}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="aspect-[3/1] bg-slate-50 border border-dashed rounded-2xl flex items-center justify-center">
                    <span className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">
                      Chờ upload ảnh
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Context Information */}
        <div className="space-y-6">
          <Card className="p-6 shadow-sm border-slate-100 rounded-3xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-primary" />
            <h3 className="font-black text-[11px] mb-6 text-slate-400 uppercase tracking-widest">
              Lực lượng phụ trách
            </h3>
            {tech ? (
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-xl shadow-inner">
                  {tech.name.charAt(0)}
                </div>
                <div>
                  <div className="font-black text-[15px] text-slate-800">{tech.name}</div>
                  <div className="text-xs font-medium text-slate-500 mt-0.5">Kỹ thuật viên</div>
                </div>
                {!readonly && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="ml-auto text-[11px] font-bold uppercase text-primary hover:bg-primary/10 h-8 rounded-lg"
                    onClick={() => setTechOpen(true)}
                  >
                    Thay Đổi
                  </Button>
                )}
              </div>
            ) : (
              !readonly && (
                <Button className="w-full h-12 rounded-xl font-bold uppercase text-xs" variant="outline" onClick={() => setTechOpen(true)}>
                  Hủy / Gán nhân sự
                </Button>
              )
            )}
          </Card>

          <Card className="p-6 shadow-sm border-slate-100 rounded-3xl">
            <h3 className="font-black text-[11px] mb-5 text-slate-400 uppercase tracking-widest">
              Hồ sơ Khách hàng
            </h3>
            {customer && (
              <div className="space-y-4">
                <div className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="h-10 w-10 shrink-0 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100">
                     <User className="h-4 w-4 text-slate-400" />
                  </div>
                  <div>
                    <div className="font-black text-sm text-slate-800 mb-1">{customer.name}</div>
                    <div className="text-[12px] font-medium text-slate-500">
                      ĐD: {customer.contactPerson} · TL: {customer.phone}
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="h-10 w-10 shrink-0 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100">
                     <MapPin className="h-4 w-4 text-slate-400" />
                  </div>
                  <div className="text-[12px] font-medium text-slate-600 self-center leading-relaxed">
                     {customer.address}
                  </div>
                </div>
              </div>
            )}
          </Card>

          {elevator && (
            <Card className="p-6 shadow-sm border-slate-100 rounded-3xl bg-slate-800 text-white">
              <h3 className="font-black text-[11px] mb-5 text-slate-400 uppercase tracking-widest">
                Tài sản (Thang máy)
              </h3>
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-4 mb-4 pb-4 border-b border-white/10">
                  <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                    <Building2 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                     <div className="font-black text-[11px] text-slate-400 uppercase tracking-widest mb-1">Mã định danh định vị</div>
                     <div className="font-mono font-black text-xl tracking-tight text-white">{elevator.code}</div>
                  </div>
                </div>
                <div className="text-[13px] text-slate-300 font-medium space-y-2 mb-6">
                  <div className="flex justify-between">
                     <span className="opacity-70">NSX:</span>
                     <span className="font-bold text-white">{elevator.brand} - {elevator.model}</span>
                  </div>
                  <div className="flex justify-between">
                     <span className="opacity-70">Tòa thi công:</span>
                     <span className="font-bold text-white text-right">{elevator.building}</span>
                  </div>
                </div>
                <Link to="/admin/elevators/$elevatorId" params={{ elevatorId: elevator.id }} className="block">
                  <Button variant="secondary" className="w-full h-10 rounded-xl bg-white text-slate-900 font-black uppercase text-[10px] hover:bg-slate-100">
                    Truy cập hồ sơ thiết bị
                  </Button>
                </Link>
              </div>
            </Card>
          )}
        </div>
      </div>
      <ConfirmationModals
        editOpen={editOpen}
        setEditOpen={setEditOpen}
        techOpen={techOpen}
        setTechOpen={setTechOpen}
        job={job}
        onDispatch={handleDispatch}
      />
    </AppShell>
  );
}

function ConfirmationModals({
  editOpen,
  setEditOpen,
  techOpen,
  setTechOpen,
  job,
  onDispatch,
}: {
  editOpen: boolean;
  setEditOpen: (o: boolean) => void;
  techOpen: boolean;
  setTechOpen: (o: boolean) => void;
  job: Job;
  onDispatch: (jobId: string, userId: string) => void;
}) {
  return (
    <>
      <ConfirmationDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        title="Form Edit Mode"
        description="Mở trình chỉnh sửa nội dung công việc?"
        onConfirm={() => toast.success("Not implemented in mockup")}
      />
      <DispatchJobModal 
        open={techOpen}
        onClose={() => setTechOpen(false)}
        job={job}
        onDispatch={onDispatch}
      />
    </>
  );
}
