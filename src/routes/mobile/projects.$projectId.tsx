import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/layout/MobileShell";
import {
  mockProjects,
  mockJobs,
  getCustomer,
  PROJECT_STAGE_LABELS,
  formatDateTime,
} from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Building2,
  MapPin,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  ChevronRight,
  TrendingUp,
  CreditCard,
  Plus,
  Briefcase,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { StatusBadge } from "@/components/common/StatusBadge";
import { jobStatusLabel, jobStatusVariant } from "@/lib/status-variants";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/mobile/projects/$projectId")({
  head: ({ params }) => ({ meta: [{ title: `Dự án ${params.projectId} — Mobile` }] }),
  component: ProjectDetailMobile,
});

function ProjectDetailMobile() {
  const isPast = (idx: number, current: number) => idx < current;
  const { projectId } = Route.useParams();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const project = mockProjects.find((p) => p.id === projectId);

  if (!project) return <div>Project not found</div>;

  const customer = getCustomer(project.customerId);
  const stages = Object.entries(PROJECT_STAGE_LABELS);
  const currentStageIndex = stages.findIndex(([k]) => k === project.stage);
  const relatedJobs = mockJobs.filter((j) => j.projectId === project.id);

  const handleAdvance = () => {
    // In a real app we would call advanceProjectStage(project.id)
    toast.success(`Đã hoàn thành giai đoạn ${PROJECT_STAGE_LABELS[project.stage]}`);
    setConfirmOpen(false);
  };

  return (
    <MobileShell title="Chi tiết dự án" showBackButton>
      <div className="p-4 space-y-5">
        {/* Hero Card */}
        <Card className="p-5 border-none shadow-sm bg-primary text-white overflow-hidden relative">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">
                Đang thi công
              </span>
              <Building2 className="h-5 w-5 opacity-40" />
            </div>
            <h2 className="text-xl font-bold mb-1">{project.name}</h2>
            <div className="flex items-center gap-2 text-[11px] opacity-90">
              <MapPin className="h-3 w-3" />
              {project.address}
            </div>

            <div className="mt-6 flex justify-between items-end">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase font-bold opacity-70">Khởi công</span>
                <span className="text-sm font-bold">{formatDateTime(project.startDate)}</span>
              </div>
              <div className="h-10 w-10 rounded-full border-2 border-white/20 flex items-center justify-center font-bold text-xs">
                {Math.round(((currentStageIndex + 1) / stages.length) * 100)}%
              </div>
            </div>
          </div>
          {/* Abstract Background Decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        </Card>

        {/* Client Quick View */}
        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-xs font-bold uppercase text-muted-foreground">Chủ đầu tư</h3>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-[10px] font-bold text-primary px-1"
            >
              GỌI NGAY
            </Button>
          </div>
          <Card className="p-4 border-none shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-primary font-bold">
                {customer?.name[0]}
              </div>
              <div>
                <p className="text-sm font-bold">{customer?.name}</p>
                <p className="text-[10px] text-muted-foreground">{customer?.phone}</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-300" />
          </Card>
        </section>

        {/* Action Button: Advance Stage */}
        <Button
          className="w-full h-14 rounded-2xl bg-primary text-white font-bold shadow-lg shadow-primary/20 gap-3"
          onClick={() => setConfirmOpen(true)}
        >
          <CheckCircle2 className="h-5 w-5" /> CHỐT XONG: {PROJECT_STAGE_LABELS[project.stage]}
        </Button>

        {/* Timeline Stage View */}
        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-xs font-bold uppercase text-muted-foreground">Lộ trình 8 bước</h3>
            <TrendingUp className="h-4 w-4 text-primary opacity-50" />
          </div>
          <Card className="p-5 border-none shadow-sm h-48 overflow-y-auto no-scrollbar relative">
            <div className="space-y-6">
              {stages.map(([key, label], index) => {
                const isCompleted = index < currentStageIndex;
                const isCurrent = index === currentStageIndex;

                return (
                  <div key={key} className="flex gap-4 relative">
                    {index !== stages.length - 1 && (
                      <div
                        className={cn(
                          "absolute left-[11px] top-6 w-[2px] h-[calc(100%+24px)]",
                          isPast(index, currentStageIndex) ? "bg-primary" : "bg-slate-100",
                        )}
                      />
                    )}

                    <div
                      className={cn(
                        "h-6 w-6 rounded-full flex items-center justify-center z-10 shrink-0",
                        isCompleted
                          ? "bg-primary text-white"
                          : isCurrent
                            ? "bg-white border-2 border-primary text-primary"
                            : "bg-slate-100 text-slate-400",
                      )}
                    >
                      {isCompleted ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <div className="h-1.5 w-1.5 rounded-full bg-current" />
                      )}
                    </div>

                    <div className={cn("flex-1", !isCompleted && !isCurrent && "opacity-50")}>
                      <span className={cn("text-xs font-bold", isCurrent && "text-primary")}>
                        {label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Fade at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none" />
          </Card>
        </section>

        {/* Related Jobs List */}
        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-xs font-bold uppercase text-muted-foreground">
              Hạng mục công việc ({relatedJobs.length})
            </h3>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 text-[10px] font-bold text-primary gap-1"
            >
              <Plus className="h-3 w-3" /> THÊM
            </Button>
          </div>
          <div className="space-y-3">
            {relatedJobs.map((job) => (
              <Link key={job.id} to="/mobile/jobs/$jobId" params={{ jobId: job.id }}>
                <Card className="p-4 border-none shadow-sm flex items-center justify-between bg-white active:bg-slate-50 transition-colors">
                  <div className="flex gap-3">
                    <div className="h-9 w-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                      <Briefcase className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-bold text-slate-900 leading-tight">
                        {job.title}
                      </h4>
                      <div className="flex items-center gap-1.5 mt-1">
                        <StatusBadge variant={jobStatusVariant[job.status]}>
                          {jobStatusLabel[job.status]}
                        </StatusBadge>
                        <span className="text-[9px] text-muted-foreground font-medium">
                          {job.code}
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-300" />
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Financial Overview */}
        <section>
          <h3 className="text-xs font-bold uppercase text-muted-foreground mb-3 px-1">
            Tài chính & Thanh toán
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-4 border-none shadow-sm bg-emerald-50 border-emerald-100">
              <CreditCard className="h-4 w-4 text-emerald-600 mb-2" />
              <p className="text-[10px] text-emerald-700 font-bold uppercase">Đã thu</p>
              <p className="text-sm font-bold text-emerald-900 mt-0.5">1.250.000.000đ</p>
            </Card>
            <Card className="p-4 border-none shadow-sm bg-orange-50 border-orange-100">
              <Clock className="h-4 w-4 text-orange-600 mb-2" />
              <p className="text-[10px] text-orange-700 font-bold uppercase">Còn nợ</p>
              <p className="text-sm font-bold text-orange-900 mt-0.5">350.000.000đ</p>
            </Card>
          </div>
        </section>
      </div>

      <ConfirmationDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Xác nhận giai đoạn hoàn tất"
        description={`Bạn có chắc chắn muốn xác nhận hoàn tất giai đoạn "${PROJECT_STAGE_LABELS[project.stage]}" cho dự án này không?`}
        onConfirm={handleAdvance}
        variant="success"
      />
    </MobileShell>
  );
}
