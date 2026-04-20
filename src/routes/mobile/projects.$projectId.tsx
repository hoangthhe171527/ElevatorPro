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
    <MobileShell title={project.name} showBackButton>
      <div className="flex flex-col pb-10">
        {/* Header Hero Section */}
        <div className="bg-primary pt-6 pb-12 px-6 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="flex flex-col gap-1">
                <StatusBadge variant="muted" className="bg-white/20 text-white border-none w-fit">
                  Đang thi công
                </StatusBadge>
                <h2 className="text-2xl font-bold text-white mt-1 leading-tight">{project.name}</h2>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                <Building2 className="h-6 w-6 text-white" />
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-white/70 text-xs mb-6">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{project.address}</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/20">
                <p className="text-[10px] uppercase font-bold text-white/50 tracking-wider">Khởi công</p>
                <p className="text-sm font-bold text-white mt-0.5">{formatDateTime(project.startDate)}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/20 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase font-bold text-white/50 tracking-wider">Tiến độ</p>
                  <p className="text-sm font-bold text-white mt-0.5">{Math.round(((currentStageIndex + 1) / stages.length) * 100)}%</p>
                </div>
                <TrendingUp className="h-4 w-4 text-emerald-400 shrink-0" />
              </div>
            </div>
          </div>
          
          {/* Abstract Decorations */}
          <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-[-50%] left-[-10%] w-48 h-48 bg-primary-foreground/10 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* Content Body - Overlapping slightly with hero */}
        <div className="px-6 -mt-6 relative z-20 space-y-8">
          {/* Main Action Card */}
          <Card className="p-4 border-none shadow-xl shadow-primary/5 flex items-center justify-between gap-4 bg-white rounded-3xl group active:scale-[0.98] transition-transform">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Giai đoạn hiện tại</p>
                <p className="text-sm font-bold text-slate-900">{PROJECT_STAGE_LABELS[project.stage]}</p>
              </div>
            </div>
            <Button 
               size="sm"
               className="rounded-xl font-bold bg-primary text-white text-[10px] h-9"
               onClick={() => setConfirmOpen(true)}
            >
              HOÀN TẤT
            </Button>
          </Card>

          <ConfirmationDialog
            open={confirmOpen}
            onOpenChange={setConfirmOpen}
            title="Xác nhận hoàn thành giai đoạn"
            description={`Bạn có chắc chắn muốn xác nhận hoàn thành giai đoạn ${PROJECT_STAGE_LABELS[project.stage]} cho dự án này không?`}
            onConfirm={handleAdvance}
            variant="success"
          />

          {/* Client Info */}
          <section>
            <div className="flex items-center justify-between mb-4 px-1">
              <h3 className="text-[11px] font-bold uppercase text-slate-400 tracking-widest">Khách hàng</h3>
              <div className="h-1 flex-1 bg-slate-100 mx-4 rounded-full opacity-50" />
            </div>
            <Card className="p-4 border-slate-100 shadow-sm rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-primary font-bold text-lg border border-white">
                  {customer?.name[0]}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{customer?.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{customer?.phone}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-primary/5 text-primary">
                <Clock className="h-5 w-5" />
              </Button>
            </Card>
          </section>

          {/* Timeline / Roadmap */}
          <section>
            <div className="flex items-center justify-between mb-4 px-1">
              <h3 className="text-[11px] font-bold uppercase text-slate-400 tracking-widest">Lộ trình triển khai</h3>
              <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                {currentStageIndex + 1} / {stages.length}
              </span>
            </div>
            <Card className="p-6 border-slate-100 shadow-sm rounded-2xl relative overflow-hidden">
              <div className="space-y-8">
                {stages.map(([key, label], index) => {
                  const isCompleted = index < currentStageIndex;
                  const isCurrent = index === currentStageIndex;

                  return (
                    <div key={key} className="flex gap-5 relative">
                      {index !== stages.length - 1 && (
                        <div
                          className={cn(
                            "absolute left-[13px] top-8 w-[2px] h-[calc(100%+32px)] transition-colors duration-500",
                            isPast(index, currentStageIndex) ? "bg-primary" : "bg-slate-100",
                          )}
                        />
                      )}

                      <div
                        className={cn(
                          "h-7 w-7 rounded-full flex items-center justify-center z-10 shrink-0 shadow-sm transition-all duration-500",
                          isCompleted
                            ? "bg-primary text-white ring-4 ring-primary/10"
                            : isCurrent
                              ? "bg-white border-2 border-primary text-primary ring-4 ring-primary/5"
                              : "bg-slate-100 text-slate-400",
                        )}
                      >
                        {isCompleted ? (
                          <Check className="h-3.5 w-3.5" />
                        ) : (
                          <span className="text-[10px] font-bold">{index + 1}</span>
                        )}
                      </div>

                      <div className={cn("flex-1 pt-0.5", !isCompleted && !isCurrent && "opacity-50")}>
                        <p className={cn("text-xs font-bold leading-tight", isCurrent ? "text-primary text-sm" : "text-slate-600")}>
                          {label}
                        </p>
                        {isCurrent && (
                          <p className="text-[10px] text-muted-foreground mt-1 animate-pulse">Đang triển khai...</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </section>

          {/* Related Jobs */}
          <section>
            <div className="flex items-center justify-between mb-4 px-1">
              <h3 className="text-[11px] font-bold uppercase text-slate-400 tracking-widest">Hạng mục công việc</h3>
              <Plus className="h-4 w-4 text-primary" />
            </div>
            <div className="space-y-4">
              {relatedJobs.length > 0 ? (
                relatedJobs.map((job) => (
                  <Link key={job.id} to="/mobile/jobs/$jobId" params={{ jobId: job.id }}>
                    <Card className="p-4 border-slate-100 shadow-sm rounded-2xl flex items-center justify-between bg-white active:bg-slate-50 active:scale-[0.98] transition-all">
                      <div className="flex gap-4 min-w-0">
                        <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                          <Briefcase className="h-6 w-6" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-[13px] font-bold text-slate-900 leading-tight truncate">
                            {job.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            <StatusBadge variant={jobStatusVariant[job.status]} className="px-2 py-0 h-4 text-[9px]">
                              {jobStatusLabel[job.status]}
                            </StatusBadge>
                            <span className="text-[10px] text-muted-foreground font-medium shrink-0">
                              {job.code}
                            </span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-slate-300 shrink-0 ml-2" />
                    </Card>
                  </Link>
                ))
              ) : (
                <div className="text-center py-8 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                  <p className="text-xs text-muted-foreground font-medium">Chưa có công việc phân công</p>
                </div>
              )}
            </div>
          </section>

          {/* Financial Breakdown */}
          <section>
            <div className="flex items-center justify-between mb-4 px-1">
              <h3 className="text-[11px] font-bold uppercase text-slate-400 tracking-widest">Tài chính</h3>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 border-none shadow-sm bg-emerald-500 text-white rounded-3xl overflow-hidden relative">
                  <CreditCard className="h-8 w-8 text-white/20 absolute -right-2 -bottom-2" />
                  <p className="text-[10px] font-bold uppercase text-white/70 tracking-wider">Đã thu</p>
                  <p className="text-sm font-black mt-1">1.25B đ</p>
                </Card>
                <Card className="p-4 border-none shadow-sm bg-orange-500 text-white rounded-3xl overflow-hidden relative">
                  <Clock className="h-8 w-8 text-white/20 absolute -right-2 -bottom-2" />
                  <p className="text-[10px] font-bold uppercase text-white/70 tracking-wider">Còn nợ</p>
                  <p className="text-sm font-black mt-1">350M đ</p>
                </Card>
              </div>
              <Card className="p-4 border-slate-100 bg-white rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold text-slate-400">Tổng giá trị hợp đồng</p>
                  <p className="text-lg font-black text-slate-900 mt-0.5">1.600.000.000đ</p>
                </div>
              </Card>
            </div>
          </section>
        </div>
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
