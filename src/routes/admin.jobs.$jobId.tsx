import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  StatusBadge,
  jobStatusLabel,
  jobStatusVariant,
  priorityLabel,
  priorityVariant,
} from "@/components/common/StatusBadge";
import { mockJobs, getCustomer, getElevator, getUser, formatDateTime } from "@/lib/mock-data";
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
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";

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
        <Link to="/admin/jobs"><Button className="mt-4">Quay lại danh sách</Button></Link>
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
  const [editOpen, setEditOpen] = useState(false);
  const [techOpen, setTechOpen] = useState(false);

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

            {/* Admin specific tracking view */}
            <div className="mt-6">
              <h3 className="font-semibold mb-4 text-sm uppercase tracking-wide text-muted-foreground">Tiến độ kỹ thuật</h3>
              {job.report ? (
                 <div className="p-4 rounded-lg bg-muted/30 border border-muted flex gap-3">
                    <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-sm">Biên bản nghiệm thu</div>
                      <div className="text-sm text-muted-foreground mt-1 italic">"{job.report}"</div>
                    </div>
                 </div>
              ) : (
                <div className="p-4 rounded-lg bg-warning/10 border border-warning/20 flex gap-3 text-warning-foreground">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <div className="text-sm">
                      Kỹ thuật viên chưa cập nhật biên bản nghiệm thu hoặc công việc đang diễn ra.
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
                <h4 className="text-sm font-medium mb-3 text-muted-foreground">Tình trạng sự cố (Trước)</h4>
                {job.beforePhotos?.length > 0 ? (
                  <div className="flex gap-2">
                    {job.beforePhotos.map((p, idx) => (
                      <div key={idx} className="h-20 w-20 rounded-md bg-muted flex items-center justify-center text-xs text-muted-foreground overflow-hidden">
                        Ảnh {idx+1}
                      </div>
                    ))}
                  </div>
                ) : <span className="text-sm text-muted-foreground italic">Không có hình ảnh báo cáo</span>}
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-3 text-muted-foreground">Nghiệm thu (Sau)</h4>
                {job.afterPhotos?.length > 0 ? (
                  <div className="flex gap-2">
                    {job.afterPhotos.map((p, idx) => (
                      <div key={idx} className="h-20 w-20 rounded-md bg-muted flex items-center justify-center text-xs text-muted-foreground overflow-hidden border-2 border-success/30">
                        Ảnh {idx+1}
                      </div>
                    ))}
                  </div>
                ) : <span className="text-sm text-muted-foreground italic">Kỹ thuật chưa chụp ảnh nghiệm thu</span>}
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Context Information */}
        <div className="space-y-6">
          
          {/* Assignment */}
          <Card className="p-5">
            <h3 className="font-semibold text-sm mb-4 text-muted-foreground uppercase tracking-wide">Điều phối nhân sự</h3>
            {tech ? (
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                   {tech.name.charAt(0)}
                </div>
                <div>
                  <div className="font-medium text-sm">{tech.name}</div>
                  <div className="text-xs text-muted-foreground">Kỹ thuật viên</div>
                </div>
                <Button size="sm" variant="ghost" className="ml-auto text-xs" onClick={()=>setTechOpen(true)}>Đổi</Button>
              </div>
            ) : (
               <Button className="w-full" variant="outline" onClick={()=>setTechOpen(true)}>Chỉ định Kỹ thuật viên</Button>
            )}
          </Card>

          {/* Customer */}
          <Card className="p-5">
            <h3 className="font-semibold text-sm mb-4 text-muted-foreground uppercase tracking-wide">Khách hàng</h3>
            {customer && (
              <div className="space-y-3 text-sm">
                <div className="flex gap-2">
                  <User className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <div className="font-medium">{customer.name}</div>
                    <div className="text-muted-foreground">{customer.contactPerson} · {customer.phone}</div>
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
            <h3 className="font-semibold text-sm mb-4 text-muted-foreground uppercase tracking-wide">thiết bị (Thang máy)</h3>
            <div className="p-4 rounded-lg border bg-card hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center text-primary">
                  <Building2 className="h-4 w-4" />
                </div>
                <div className="font-mono font-bold">{elevator.code}</div>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>Hiệu: {elevator.brand} {elevator.model}</div>
                <div>Vị trí: {elevator.building}</div>
              </div>
              <Link to="/admin/elevators/$elevatorId" params={{ elevatorId: elevator.id }}>
                <Button variant="link" className="px-0 mt-2 h-auto text-xs">Xem hồ sơ thiết bị →</Button>
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
      />
    </AppShell>
  );
}

function ConfirmationModals({ 
  editOpen, 
  setEditOpen, 
  techOpen, 
  setTechOpen 
}: { 
  editOpen: boolean, 
  setEditOpen: (o: boolean) => void, 
  techOpen: boolean, 
  setTechOpen: (o: boolean) => void 
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
      <ConfirmationDialog
        open={techOpen}
        onOpenChange={setTechOpen}
        title="Xác nhận thay đổi nhân sự"
        description="Bạn có chắc chắn muốn thay đổi kỹ thuật viên phụ trách cho công việc này không?"
        onConfirm={() => toast.info("Mở Modal thay đổi người")}
      />
    </>
  );
}