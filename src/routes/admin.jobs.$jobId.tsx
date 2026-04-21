import { createFileRoute, Link, notFound } from "@tanstack/react-router";
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
import { mockJobs, getCustomer, getElevator, getUser, formatDateTime, type Job } from "@/lib/mock-data";
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
  Send,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { DispatchJobModal } from "@/components/common/Modals";

export const Route = createFileRoute("/admin/jobs/$jobId")({
  loader: ({ params }) => {
    const job = mockJobs.find((j) => j.id === params.jobId);
    if (!job) throw notFound();
    return { job };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.job.code ?? "Công việc"} — ElevatorPro` }],
  }),
  notFoundComponent: () => (
    <AppShell>
      <div className="p-12 text-center">
        <p className="text-muted-foreground">Không tìm thấy công việc</p>
        <Link to="/admin/jobs">
          <Button className="mt-4">Quay lại danh sách</Button>
        </Link>
      </div>
    </AppShell>
  ),
  component: AdminJobDetail,
});

function AdminJobDetail() {
  const { job } = Route.useLoaderData();
  const customer = getCustomer(job.customerId);
  const elevator = job.elevatorId ? getElevator(job.elevatorId) : undefined;
  const tech = job.assignedTo ? getUser(job.assignedTo) : undefined;
  const [status, setStatus] = useState(job.status);
  const [isApproved, setIsApproved] = useState(job.isManagerApproved || false);
  const [isConfirmed, setIsConfirmed] = useState(job.isCustomerConfirmed || false);
  const [editOpen, setEditOpen] = useState(false);
  const [techOpen, setTechOpen] = useState(false);

  const handleManagerApprove = () => {
    setIsApproved(true);
    setStatus("manager_approved");
    toast.success("Hồ sơ kỹ thuật đã được duyệt!");
  };

  const handleSendToCustomer = () => {
    toast.info("Đã gửi thông báo yêu cầu khách hàng xác nhận trên Portal.");
  };

  const handleDispatch = (jobId: string, userId: string) => {
    // In a real app, this would be an API call. 
    // For the mock, we update the local job instance partially if needed, 
    // but the loader will re-fetch the mockJobs which is global.
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
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="h-4 w-4" /> Quay lại danh sách công việc
      </Link>

      <PageHeader
        title={job.title}
        description={`Mã việc: ${job.code} · Cập nhật lần cuối: ${formatDateTime(job.createdAt)}`}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setEditOpen(true)}>
              Sửa công việc
            </Button>
          </div>
        }
      />
      <div className="mb-6">
        <div className="flex items-center justify-between overflow-x-auto pb-4">
          {[
            { id: "scheduled", label: "Lên lịch", icon: Calendar },
            { id: "in_progress", label: "Thực hiện", icon: Wrench },
            ...(job.tenantId === "t-1" ? [
              { id: "review", label: "QT duyệt", icon: UserCheck },
              { id: "customer", label: "Khách ký", icon: Send }
            ] : []),
            ...(job.type === "repair" ? [{ id: "payment", label: "Thanh toán", icon: CreditCard }] : []),
            { id: "completed", label: "Hoàn thành", icon: CheckCircle2 },
          ].map((s, idx, arr) => {
            const isDone = (status === "completed") || 
                           (s.id === "scheduled" && ["scheduled", "in_progress", "manager_approved", "customer_confirmed", "completed"].includes(status)) ||
                           (s.id === "in_progress" && ["in_progress", "manager_approved", "customer_confirmed", "completed"].includes(status)) ||
                           (s.id === "review" && (isApproved || status === "completed")) ||
                           (s.id === "customer" && (isConfirmed || status === "completed"));
            
            const isCurrent = (s.id === "scheduled" && status === "scheduled") ||
                             (s.id === "in_progress" && status === "in_progress") ||
                             (s.id === "review" && (status === "in_progress" && job.report && !isApproved)) ||
                             (s.id === "customer" && status === "manager_approved") ||
                             (job.tenantId === "t-2" && s.id === "completed" && status === "in_progress" && job.report);

            return (
              <div key={s.id} className="flex items-center">
                <div className="flex flex-col items-center gap-1 min-w-[100px]">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                    isDone ? "bg-primary border-primary text-primary-foreground" : 
                    isCurrent ? "border-primary text-primary animate-pulse" : 
                    "border-muted text-muted-foreground"
                  }`}>
                    <s.icon className="h-5 w-5" />
                  </div>
                  <span className={`text-[10px] uppercase font-bold ${isCurrent ? "text-primary" : "text-muted-foreground"}`}>
                    {s.label}
                  </span>
                </div>
                {idx < arr.length - 1 && (
                  <div className={`h-[2px] w-8 sm:w-16 mx-2 ${isDone ? "bg-primary" : "bg-muted"}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-3 mt-6">
        {/* Left Column: Main Detail */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-primary" /> Mô tả sự cố / Yêu cầu
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

            <p className="text-muted-foreground">{job.description || "Không có mô tả chi tiết."}</p>

            <div className="mt-6 flex flex-col sm:flex-row gap-4 py-4 border-y border-muted">
              <div className="flex-1 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Lịch dự kiến</div>
                  <div className="font-medium">{formatDateTime(job.scheduledFor)}</div>
                </div>
              </div>

              <div className="flex-1 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center text-success">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Thời điểm hoàn thành</div>
                  <div className="font-medium">
                    {job.completedAt ? formatDateTime(job.completedAt) : "Chưa hoàn thành"}
                  </div>
                </div>
              </div>
            </div>

            {/* Technical Approvals */}
            <div className="mt-8 pt-6 border-t">
              <h3 className="font-semibold mb-4 text-sm uppercase tracking-wide text-muted-foreground">
                Phê duyệt & Chốt việc
              </h3>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {job.tenantId === "t-1" ? (
                  <>
                    <div className={`p-4 rounded-xl border flex items-center justify-between ${isApproved ? "bg-success/5 border-success/20" : "bg-muted/30 border-muted"}`}>
                      <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${isApproved ? "bg-success text-success-foreground" : "bg-muted-foreground/20"}`}>
                          <UserCheck className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold">Duyệt kỹ thuật</div>
                          <div className="text-xs text-muted-foreground">{isApproved ? "Quản lý đã duyệt" : "Đang chờ duyệt"}</div>
                        </div>
                      </div>
                      {!isApproved && job.report && (
                        <Button size="sm" onClick={handleManagerApprove}>Duyệt ngay</Button>
                      )}
                    </div>

                    <div className={`p-4 rounded-xl border flex items-center justify-between ${isConfirmed ? "bg-success/5 border-success/20" : "bg-muted/30 border-muted"}`}>
                      <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${isConfirmed ? "bg-success text-success-foreground" : "bg-muted-foreground/20"}`}>
                          <Send className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold">Xác nhận khách hàng</div>
                          <div className="text-xs text-muted-foreground">{isConfirmed ? "Khách đã xác nhận" : "Chưa xác nhận"}</div>
                        </div>
                      </div>
                      {isApproved && !isConfirmed && (
                        <Button size="sm" variant="outline" onClick={handleSendToCustomer}>Gửi yêu cầu</Button>
                      )}
                    </div>
                  </>
                ) : (
                  <div className={`col-span-2 p-6 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-4 ${status === "completed" ? "bg-success/5 border-success/20" : "bg-blue-500/5 border-blue-500/20"}`}>
                    {status === "completed" ? (
                      <>
                        <CheckCircle2 className="h-10 w-10 text-success" />
                        <div className="text-center">
                          <div className="font-bold text-success">Công việc đã hoàn tất</div>
                          <div className="text-sm text-muted-foreground font-medium">Báo cáo kỹ thuật đã được ghi nhận.</div>
                        </div>
                      </>
                    ) : (
                      <>
                        <Wrench className="h-10 w-10 text-blue-500 opacity-50" />
                        <div className="text-center">
                          <div className="font-bold text-blue-700">Chế độ linh hoạt (t-2)</div>
                          <div className="text-sm text-muted-foreground font-medium">Kỹ sư xác nhận xong báo cáo là có thể hoàn tất ngay.</div>
                        </div>
                        {job.report && (
                           <Button onClick={() => {
                             setStatus("completed");
                             toast.success("Đã hoàn tất công việc!");
                           }}>Xác nhận Hoàn thành</Button>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>

              {job.type === "maintenance" && !isConfirmed && (
                <div className="mt-4 p-4 rounded-lg bg-blue-500/5 border border-blue-500/10 flex gap-3 text-blue-700">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <div className="text-xs">
                    Lưu ý: Nếu phát sinh hư hỏng trong quá trình bảo trì, hãy bấm <strong>"Tạo task sửa chữa"</strong> để theo dõi chi phí riêng biệt.
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Photo Evidence */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <Camera className="h-5 w-5 text-primary" /> Bằng chứng hiện trường
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium mb-3 text-muted-foreground">
                  Tình trạng sự cố (Trước)
                </h4>
                {job.beforePhotos?.length > 0 ? (
                  <div className="flex gap-2">
                    {job.beforePhotos.map((p: string, idx: number) => (
                      <div
                        key={idx}
                        className="h-20 w-20 rounded-md bg-muted flex items-center justify-center text-xs text-muted-foreground overflow-hidden"
                      >
                        Ảnh {idx + 1}
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground italic">
                    Không có hình ảnh báo cáo
                  </span>
                )}
              </div>

              <div>
                <h4 className="text-sm font-medium mb-3 text-muted-foreground">Nghiệm thu (Sau)</h4>
                {job.afterPhotos?.length > 0 ? (
                  <div className="flex gap-2">
                    {job.afterPhotos.map((p: string, idx: number) => (
                      <div
                        key={idx}
                        className="h-20 w-20 rounded-md bg-muted flex items-center justify-center text-xs text-muted-foreground overflow-hidden border-2 border-success/30"
                      >
                        Ảnh {idx + 1}
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground italic">
                    Kỹ thuật chưa chụp ảnh nghiệm thu
                  </span>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Context Information */}
        <div className="space-y-6">
          {/* Assignment */}
          <Card className="p-5">
            <h3 className="font-semibold text-sm mb-4 text-muted-foreground uppercase tracking-wide">
              Điều phối nhân sự
            </h3>
            {tech ? (
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {tech.name.charAt(0)}
                </div>
                <div>
                  <div className="font-medium text-sm">{tech.name}</div>
                  <div className="text-xs text-muted-foreground">Kỹ thuật viên</div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="ml-auto text-xs"
                  onClick={() => setTechOpen(true)}
                >
                  Đổi
                </Button>
              </div>
            ) : (
              <Button className="w-full" variant="outline" onClick={() => setTechOpen(true)}>
                Chỉ định Kỹ thuật viên
              </Button>
            )}
          </Card>

          {/* Customer */}
          <Card className="p-5">
            <h3 className="font-semibold text-sm mb-4 text-muted-foreground uppercase tracking-wide">
              Khách hàng
            </h3>
            {customer && (
              <div className="space-y-3 text-sm">
                <div className="flex gap-2">
                  <User className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <div className="font-medium">{customer.name}</div>
                    <div className="text-muted-foreground">
                      {customer.contactPerson} · {customer.phone}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div className="text-muted-foreground">{customer.address}</div>
                </div>
              </div>
            )}
          </Card>

          {/* Elevator Context */}
          {elevator && (
            <Card className="p-5">
              <h3 className="font-semibold text-sm mb-4 text-muted-foreground uppercase tracking-wide">
                thiết bị (Thang máy)
              </h3>
              <div className="p-4 rounded-lg border bg-card hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center text-primary">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <div className="font-mono font-bold">{elevator.code}</div>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>
                    Hiệu: {elevator.brand} {elevator.model}
                  </div>
                  <div>Vị trí: {elevator.building}</div>
                </div>
                <Link to="/admin/elevators/$elevatorId" params={{ elevatorId: elevator.id }}>
                  <Button variant="link" className="px-0 mt-2 h-auto text-xs">
                    Xem hồ sơ thiết bị →
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
        title="Xác nhận chỉnh sửa"
        description="Bạn có chắc chắn muốn mở trình chỉnh sửa nội dung công việc này?"
        onConfirm={() => toast.success("Đã mở form chỉnh sửa")}
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
