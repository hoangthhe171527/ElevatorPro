import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building,
  ArrowLeft,
  Calendar,
  MapPin,
  User,
  Check,
  Briefcase,
  Clock,
  Plus,
  ChevronRight,
  AlertCircle,
  HardHat,
} from "lucide-react";
import {
  mockProjects,
  mockJobs,
  getCustomer,
  PROJECT_STAGES,
  PROJECT_STAGE_LABELS,
  advanceProjectStage,
  formatDate,
  formatDateTime,
} from "@/lib/mock-data";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  jobStatusLabel,
  jobStatusVariant,
  priorityLabel,
  priorityVariant,
} from "@/lib/status-variants";
import { CreateJobModal } from "@/components/common/Modals";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { InstallationWorkflow } from "@/components/workflow/InstallationWorkflow";

export const Route = createFileRoute("/admin/projects/$projectId")({
  loader: ({ params }) => {
    const project = mockProjects.find((p) => p.id === params.projectId);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.project.name ?? "Dự án"} — ElevatorPro` }],
  }),
  component: ProjectDetailPage,
});

function ProjectDetailPage() {
  const { project: initialProject } = Route.useLoaderData();
  const [project, setProject] = useState(initialProject);
  const [createJobOpen, setCreateJobOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const customer = getCustomer(project.customerId);
  const jobs = mockJobs.filter((j) => j.projectId === project.id);
  const isCompleted = project.status === "completed";

  const handleAdvance = () => {
    advanceProjectStage(project.id);
    const updated = mockProjects.find((p) => p.id === project.id);
    if (updated) setProject({ ...updated });
  };

  return (
    <AppShell>
      <Link
        to="/admin/projects"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="h-4 w-4" /> Quay lại danh sách dự án
      </Link>

      <PageHeader
        title={project.name}
        description="Quản lý tiến độ thi công và các hạng mục công việc liên quan."
        actions={
          <div className="flex gap-2">
            <Button onClick={() => setCreateJobOpen(true)}>
              <Plus className="h-4 w-4 mr-1.5" /> Tạo công việc
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Basic Info */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Building className="h-4 w-4 text-primary" /> Thông tin chung
            </CardTitle>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Khách hàng
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium">{customer?.name}</div>
                    <div className="text-xs text-muted-foreground">{customer?.contactPerson}</div>
                  </div>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Địa chỉ thi công
                </label>
                <div className="flex items-start gap-2 mt-1 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                  {project.address}
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Ngày bắt đầu
                </label>
                <div className="flex items-center gap-2 mt-1 text-sm">
                  <Calendar className="h-4 w-4 text-primary" />
                  {formatDate(project.startDate)}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Trạng thái dự án
                </label>
                <div className="mt-1">
                  {isCompleted ? (
                    <Badge
                      className="bg-success/10 text-success border-success/20 hover:bg-success/20"
                      variant="outline"
                    >
                      Đã bàn giao
                    </Badge>
                  ) : (
                    <Badge
                      className="bg-primary/10 text-primary border-primary/20"
                      variant="outline"
                    >
                      Đang thi công
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <HardHat className="h-4 w-4 text-primary" /> Tổng quan hạng mục
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-dashed">
              <span className="text-sm text-muted-foreground">Công việc liên quan</span>
              <span className="font-bold text-lg">{jobs.length}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-dashed">
              <span className="text-sm text-muted-foreground">Đã hoàn thành</span>
              <span className="font-bold text-lg text-success">
                {jobs.filter((j) => j.status === "completed").length}
              </span>
            </div>
            <div className="flex justify-between items-center py-1.5 px-2 bg-muted/50 rounded-md">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Giai đoạn hiện tại</span>
              <span className="font-bold text-primary text-sm ml-auto">
                {PROJECT_STAGE_LABELS[project.stage as keyof typeof PROJECT_STAGE_LABELS]}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* NEW: Installation Workflow Stepper */}
      <div className="mb-8">
          <InstallationWorkflow 
            projectId={project.id}
            currentStage={project.stage}
            tenantId={project.tenantId}
            onStageChange={(newStage) => {
                // Update local state and mock data
                advanceProjectStage(project.id);
                const updated = mockProjects.find((p) => p.id === project.id);
                if (updated) setProject({ ...updated });
            }}
          />
      </div>

      {/* Jobs / Workloads List */}
      <Card>
        <CardHeader className="border-b">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-primary" /> Hạng mục công việc dự án
            </CardTitle>
            <Badge variant="secondary">{jobs.length} phiếu</Badge>
          </div>
        </CardHeader>
        <div className="divide-y divide-muted/50">
          {jobs.length > 0 ? (
            jobs.map((j) => (
              <Link
                key={j.id}
                to="/admin/jobs/$jobId"
                params={{ jobId: j.id }}
                className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 hover:bg-muted/10 transition-colors group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded text-muted-foreground border">
                      {j.code}
                    </span>
                    <StatusBadge
                      variant={priorityVariant[j.priority]}
                      className="text-[9px] px-1.5"
                    >
                      {priorityLabel[j.priority]}
                    </StatusBadge>
                  </div>
                  <h4 className="font-semibold group-hover:text-primary transition-colors">
                    {j.title}
                  </h4>
                  <div className="mt-1 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {formatDateTime(j.scheduledFor)}
                    </span>
                    {j.completedAt && (
                      <span className="text-success flex items-center gap-1 font-medium">
                        <Check className="h-3 w-3" /> Xong {formatDate(j.completedAt)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0 sm:justify-end">
                  <StatusBadge variant={jobStatusVariant[j.status]}>
                    {jobStatusLabel[j.status]}
                  </StatusBadge>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))
          ) : (
            <div className="py-12 text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground/20 mb-3" />
              <p className="text-muted-foreground">
                Chưa có hạng mục công việc nào được liên kết với dự án này.
              </p>
              <Button variant="outline" className="mt-4" onClick={() => setCreateJobOpen(true)}>
                Khởi tạo hạng mục đầu tiên
              </Button>
            </div>
          )}
        </div>
      </Card>

      <CreateJobModal
        open={createJobOpen}
        onClose={() => setCreateJobOpen(false)}
        defaultProjectId={project.id}
        defaultCustomerId={project.customerId}
      />
    </AppShell>
  );
}
