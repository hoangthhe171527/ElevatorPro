import { createFileRoute, Link, notFound, useLocation } from "@tanstack/react-router";
import { useMemo } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";;
import {
  mockProjects,
  mockJobs,
  INSTALL_STAGES_TEMPLATE,
  getCustomer,
  type ProjectStage,
  PROJECT_STAGE_LABELS,
} from "@/lib/mock-data";
import { jobStatusLabel, jobStatusVariant } from "@/lib/status-variants";
import {
  ArrowLeft,
  Hammer,
  CheckCircle2,
  Clock,
  ChevronRight,
  MapPin,
  Calendar,
} from "lucide-react";

export const Route = createFileRoute("/tech/projects/$projectId")({
  loader: ({ params }) => {
    const project = mockProjects.find((p) => p.id === params.projectId);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `Dự án: ${loaderData?.project.name}` }],
  }),
  component: TechProjectDetailContainer,
});

function TechProjectDetailContainer() {
  const { project } = Route.useLoaderData();
  return <TechProjectDetail project={project} />;
}

function useAppPrefix() {
  const { pathname } = useLocation();
  return pathname.startsWith("/app") ? "/app" : "";
}

export function TechProjectDetail({ project }: { project: any }) {
  const prefix = useAppPrefix();
  const cus = getCustomer(project.customerId);
  const projectJobs = useMemo(
    () => mockJobs.filter((j) => j.projectId === project.id),
    [project.id],
  );

  return (
    <AppShell>
      <Link
        to={`${prefix}/tech` as any}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="h-4 w-4" /> Quay lại Dashboard
      </Link>

      <PageHeader
        title={project.name}
        description={`Mã dự án: ${project.id}`}
        actions={
          <Badge
            variant="outline"
            className="h-8 px-4 bg-primary/5 text-primary border-primary/20 font-bold"
          >
            GIAI ĐOẠN LẮP ĐẶT
          </Badge>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-5 bg-gradient-to-br from-primary/5 to-transparent border-primary/10">
            <h3 className="font-bold text-sm uppercase tracking-widest text-muted-foreground mb-4">
              Quy trình 8 bước thi công
            </h3>
            <div className="space-y-3">
              {INSTALL_STAGES_TEMPLATE.map((stage, idx) => {
                const job = projectJobs.find(
                  (j) => j.title.includes(stage.label) || j.code.includes(`INSTALL-${idx + 1}`),
                );
                const isCurrent = job?.status === "in_progress" || job?.status === "scheduled";
                const isCompleted = job?.status === "completed";
                const isPending = !job || job.status === "pending";

                return (
                  <div key={stage.id} className="relative">
                    {idx < INSTALL_STAGES_TEMPLATE.length - 1 && (
                      <div className="absolute left-6 top-10 bottom-0 w-0.5 bg-muted -z-0" />
                    )}

                    <div
                      className={`
                      flex items-start gap-4 p-4 rounded-xl border transition-all
                      ${isCurrent ? "bg-background border-primary shadow-md ring-1 ring-primary/10 scale-[1.02]" : "bg-muted/30 border-transparent opacity-80"}
                      ${isCompleted ? "bg-success/5 border-success/20 opacity-100" : ""}
                    `}
                    >
                      <div
                        className={`
                        z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl font-black text-lg
                        ${
                          isCurrent
                            ? "bg-primary text-primary-foreground"
                            : isCompleted
                              ? "bg-success text-success-foreground"
                              : "bg-muted text-muted-foreground"
                        }
                      `}
                      >
                        {isCompleted ? <CheckCircle2 className="h-6 w-6" /> : idx + 1}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h4
                            className={`font-bold transition-colors ${isCurrent ? "text-primary text-base" : "text-sm"}`}
                          >
                            {stage.label.split(": ")[1] || stage.label}
                          </h4>
                          {job && (
                            <StatusBadge variant={jobStatusVariant[job.status]}>
                              {jobStatusLabel[job.status]}
                            </StatusBadge>
                          )}
                        </div>

                        {job ? (
                          <div className="mt-2 flex items-center justify-between">
                            <div className="text-xs text-muted-foreground flex items-center gap-2">
                              <Clock className="h-3 w-3" /> {job.scheduledFor.split("T")[0]}
                            </div>
                            <Link
                              to={`${prefix}/tech/jobs/$jobId` as any}
                              params={{ jobId: job.id } as any}
                            >
                              <Button
                                size="sm"
                                variant={isCurrent ? "default" : "outline"}
                                className="h-7 text-[10px] font-bold uppercase tracking-tight"
                              >
                                {isCompleted
                                  ? "Xem lại BC"
                                  : isCurrent
                                    ? "Thực hiện ngay"
                                    : "Chi tiết"}
                                <ChevronRight className="h-3 w-3 ml-1" />
                              </Button>
                            </Link>
                          </div>
                        ) : (
                          <div className="mt-1 text-[10px] text-muted-foreground italic">
                            Chưa có lịch làm việc cho giai đoạn này
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              Thông tin công trình
            </h3>
            {cus && (
              <div className="space-y-3 text-sm">
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-0.5">
                    Khách hàng
                  </label>
                  <p className="font-bold">{cus.name}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-0.5">
                    Địa chỉ thi công
                  </label>
                  <p className="text-muted-foreground leading-relaxed">{project.address}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-0.5">
                    Ngày khởi công
                  </label>
                  <div className="flex items-center gap-2 font-medium">
                    <Calendar className="h-4 w-4 text-primary" />
                    {project.startDate}
                  </div>
                </div>
              </div>
            )}
            <hr className="my-4 border-dashed" />
            <div className="p-3 rounded-lg bg-orange-50 border border-orange-100 text-[11px] text-orange-700 leading-relaxed italic">
              * Chú ý: Kỹ thuật viên thực hiện đúng trình tự các bước. Giai đoạn sau chỉ được phép
              thực hiện khi giai đoạn trước đã được xác nhận hoàn thành/nghiệm thu.
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
