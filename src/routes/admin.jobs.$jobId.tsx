import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  StatusBadge, jobStatusLabel, jobStatusVariant, priorityLabel, priorityVariant
} from "@/components/common/StatusBadge";
import {
  mockJobs, getCustomer, getUser, getElevator, getContract, formatDateTime
} from "@/lib/mock-data";
import { ArrowLeft, Briefcase, MapPin, Phone, Calendar, FileText, Camera, CheckCircle2, Building2, User } from "lucide-react";

export const Route = createFileRoute("/admin/jobs/$jobId")({
  loader: ({ params }) => {
    const job = mockJobs.find(j => j.id === params.jobId);
    if (!job) throw notFound();
    return { job };
  },
  head: ({ loaderData }) => ({ meta: [{ title: `${loaderData?.job.code ?? "Công việc"} — ElevatorPro` }] }),
  notFoundComponent: () => (
    <AppShell><div className="p-12 text-center"><p className="text-muted-foreground">Không tìm thấy công việc</p><Link to="/admin/jobs"><Button className="mt-4">Quay lại danh sách</Button></Link></div></AppShell>
  ),
  component: JobDetail,
});

const typeLabel: Record<string, string> = { install: "Lắp đặt", maintenance: "Bảo trì", repair: "Sửa chữa", inspection: "Khảo sát" };

function JobDetail() {
  const { job } = Route.useLoaderData();
  const cus = getCustomer(job.customerId);
  const tech = getUser(job.assignedTo);
  const elev = job.elevatorId ? getElevator(job.elevatorId) : undefined;
  const contract = job.contractId ? getContract(job.contractId) : undefined;

  return (
    <AppShell>
      <Link to="/admin/jobs" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="h-4 w-4" /> Quay lại danh sách
      </Link>

      <PageHeader
        title={job.title}
        description={`${job.code} · ${typeLabel[job.type]}`}
        actions={
          <div className="flex gap-2">
            <Button variant="outline">In biên bản</Button>
            <Button>Cập nhật trạng thái</Button>
          </div>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <StatusBadge variant={jobStatusVariant[job.status]}>{jobStatusLabel[job.status]}</StatusBadge>
              <StatusBadge variant={priorityVariant[job.priority]}>Ưu tiên: {priorityLabel[job.priority]}</StatusBadge>
            </div>
            <h3 className="font-semibold mb-2">Mô tả công việc</h3>
            <p className="text-sm text-muted-foreground">{job.description}</p>

            <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-xs text-muted-foreground">Lịch thực hiện</div>
                <div className="mt-0.5 font-medium flex items-center gap-1.5"><Calendar className="h-4 w-4 text-primary" /> {formatDateTime(job.scheduledFor)}</div>
              </div>
              {job.completedAt && (
                <div>
                  <div className="text-xs text-muted-foreground">Hoàn thành</div>
                  <div className="mt-0.5 font-medium flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-success" /> {formatDateTime(job.completedAt)}</div>
                </div>
              )}
            </div>
          </Card>

          {/* Photos */}
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Camera className="h-4 w-4" />
              <h3 className="font-semibold">Hình ảnh hiện trường</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-medium text-muted-foreground mb-2">Trước khi thực hiện ({job.beforePhotos.length})</div>
                <div className="grid grid-cols-2 gap-2">
                  {job.beforePhotos.length > 0 ? job.beforePhotos.map((_p: string, i: number) => (
                    <div key={i} className="aspect-square rounded-lg bg-muted flex items-center justify-center text-xs text-muted-foreground">
                      <Camera className="h-6 w-6" />
                    </div>
                  )) : <div className="col-span-2 aspect-video rounded-lg border-2 border-dashed border-border flex items-center justify-center text-xs text-muted-foreground">Chưa có ảnh</div>}
                </div>
              </div>
              <div>
                <div className="text-xs font-medium text-muted-foreground mb-2">Sau khi thực hiện ({job.afterPhotos.length})</div>
                <div className="grid grid-cols-2 gap-2">
                  {job.afterPhotos.length > 0 ? job.afterPhotos.map((_p: string, i: number) => (
                    <div key={i} className="aspect-square rounded-lg bg-muted flex items-center justify-center text-xs text-muted-foreground">
                      <Camera className="h-6 w-6" />
                    </div>
                  )) : <div className="col-span-2 aspect-video rounded-lg border-2 border-dashed border-border flex items-center justify-center text-xs text-muted-foreground">Chưa có ảnh</div>}
                </div>
              </div>
            </div>
          </Card>

          {/* Report */}
          {job.report && (
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-4 w-4" />
                <h3 className="font-semibold">Biên bản nghiệm thu</h3>
              </div>
              <p className="text-sm">{job.report}</p>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="font-semibold mb-3 flex items-center gap-2"><User className="h-4 w-4" /> Khách hàng</h3>
            {cus && (
              <div className="space-y-2 text-sm">
                <div className="font-medium">{cus.name}</div>
                <div className="text-xs text-muted-foreground">{cus.contactPerson}</div>
                <div className="flex items-center gap-1.5 text-xs"><Phone className="h-3 w-3" /> {cus.phone}</div>
                <div className="flex items-start gap-1.5 text-xs"><MapPin className="h-3 w-3 mt-0.5" /> {cus.address}</div>
              </div>
            )}
          </Card>

          <Card className="p-5">
            <h3 className="font-semibold mb-3">Kỹ thuật phụ trách</h3>
            {tech && (
              <div className="space-y-1 text-sm">
                <div className="font-medium">{tech.name}</div>
                <div className="text-xs text-muted-foreground">{tech.email}</div>
                <div className="flex items-center gap-1.5 text-xs"><Phone className="h-3 w-3" /> {tech.phone}</div>
              </div>
            )}
          </Card>

          {elev && (
            <Card className="p-5">
              <h3 className="font-semibold mb-3 flex items-center gap-2"><Building2 className="h-4 w-4" /> Thang máy</h3>
              <div className="space-y-1 text-sm">
                <div className="font-medium">{elev.code}</div>
                <div className="text-xs text-muted-foreground">{elev.brand} {elev.model} · {elev.floors} tầng</div>
                <div className="text-xs text-muted-foreground">{elev.building}</div>
              </div>
            </Card>
          )}

          {contract && (
            <Card className="p-5">
              <h3 className="font-semibold mb-3 flex items-center gap-2"><FileText className="h-4 w-4" /> Hợp đồng liên quan</h3>
              <div className="space-y-1 text-sm">
                <div className="font-medium">{contract.code}</div>
                <div className="text-xs text-muted-foreground">{contract.items.join(", ")}</div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </AppShell>
  );
}
