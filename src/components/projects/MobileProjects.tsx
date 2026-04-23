import { Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronRight, Building, AlertCircle } from "lucide-react";
import {
  mockProjects,
  PROJECT_STAGES,
  PROJECT_STAGE_LABELS,
  advanceProjectStage,
} from "@/lib/mock-data";
import { useState } from "react";
import { useAppStore, useCanWrite } from "@/lib/store";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { cn } from "@/lib/utils";

export function MobileProjects() {
  const activeTenantId = useAppStore((s) => s.activeTenantId);
  const canModify = useCanWrite("projects");
  const [projects, setProjects] = useState(mockProjects);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const confirmAdvance = (id: string) => {
    setConfirmId(id);
  };

  const handleAdvance = () => {
    if (!confirmId) return;
    advanceProjectStage(confirmId);
    setProjects([...mockProjects]);
    setConfirmId(null);
  };

  return (
    <AppShell>
      <PageHeader
        title="Dự án đang triển khai"
        description="Nắm bắt tiến độ 8 kỳ lắp đặt thang máy"
      />

      <div className="flex flex-col gap-4 pb-8">
        {projects.map((proj) => {
          const currentStageIndex = PROJECT_STAGES.indexOf(proj.stage);
          const isCompleted = proj.status === "completed";

          return (
            <div
              key={proj.id}
              className="relative bg-white p-5 rounded-[24px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-slate-100/50"
            >
              {/* Header Area */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-3">
                  <div className="h-10 w-10 shrink-0 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                    <Building className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-[15px] text-slate-800 leading-tight mb-1 pr-6">
                      {proj.name}
                    </h3>
                    <p className="text-[11px] font-medium text-slate-500 line-clamp-1">
                      {proj.address}
                    </p>
                  </div>
                </div>
                {isCompleted && (
                  <Badge
                    variant="outline"
                    className="bg-emerald-50 text-emerald-600 border-none px-2 py-0.5 rounded-full text-[9px] uppercase font-black uppercase absolute right-4 top-4"
                  >
                    Hoàn tất
                  </Badge>
                )}
              </div>

              {/* Mobile Segmented Progress Bar instead of Stepper */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-4">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    Tiến độ kỳ {currentStageIndex + 1}/8
                  </span>
                  <span className="text-[12px] font-black text-primary">
                    {PROJECT_STAGE_LABELS[proj.stage]}
                  </span>
                </div>

                <div className="flex gap-1 h-2 w-full mb-3">
                  {PROJECT_STAGES.map((_, idx) => {
                    const isPast = idx < currentStageIndex;
                    const isCurrent = idx === currentStageIndex;
                    return (
                      <div
                        key={idx}
                        className={cn(
                          "flex-1 rounded-full transition-all",
                          isPast ? "bg-primary" : isCurrent ? "bg-primary/50" : "bg-slate-200",
                        )}
                      />
                    );
                  })}
                </div>

                {!isCompleted && (
                  <div className="flex items-start gap-2 bg-primary/5 p-2 rounded-xl text-primary mt-3">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                    <span className="text-[10px] font-medium leading-relaxed">
                      {proj.stage === "lead" && "Cần khảo sát nhu cầu ban đầu."}
                      {proj.stage === "contract" && "Cần hoàn tất đàm phán hợp đồng."}
                      {proj.stage === "waiting_for_equipment" &&
                        "Chờ xác nhận thiết bị đã về công trình."}
                      {proj.stage === "installation" && "Thi công cơ & điện ngoài công trình."}
                      {proj.stage === "completion" && "Chờ nghiệm thu và kiểm định an toàn."}
                      {proj.stage === "transition" && "Chuyển giao cho đội bảo trì."}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Link
                  to="/app/admin/projects/$projectId"
                  params={{ projectId: proj.id }}
                  className="flex-1"
                >
                  <Button
                    variant="outline"
                    className="w-full h-10 rounded-xl text-[11px] font-black uppercase text-slate-600 bg-white border-slate-200 hover:bg-slate-50 shadow-sm"
                  >
                    Mở dự án
                  </Button>
                </Link>
                {!isCompleted && canModify && (
                  <Button
                    onClick={() => confirmAdvance(proj.id)}
                    className="flex-[1.5] h-10 rounded-xl text-[11px] font-black uppercase text-white shadow-md shadow-primary/20"
                  >
                    <Check className="h-4 w-4 mr-1" /> Duyệt xong kỳ {currentStageIndex + 1}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <ConfirmationDialog
        open={!!confirmId}
        onOpenChange={(open) => !open && setConfirmId(null)}
        title="Duyệt hoàn tất thiết kế/thi công"
        description="Xác nhận dự án đã xong kỳ này để mở khóa công việc ở giai đoạn tiếp theo?"
        onConfirm={handleAdvance}
        confirmText="Hoàn tất & Chuyển kỳ"
        variant="success"
      />
    </AppShell>
  );
}
