import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/layout/MobileShell";
import { cn } from "@/lib/utils";
import { mockProjects, PROJECT_STAGES, PROJECT_STAGE_LABELS } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Building, ChevronRight, Plus, MapPin } from "lucide-react";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { useAppStore } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/mobile/projects")({
  head: () => ({ meta: [{ title: "Dự án — Mobile" }] }),
  component: MobileProjects,
});

const stageColors: Record<string, string> = {
  survey: "bg-blue-50 text-blue-600",
  design: "bg-indigo-50 text-indigo-600",
  procurement: "bg-violet-50 text-violet-600",
  in_transit: "bg-amber-50 text-amber-600",
  mechanic_install: "bg-orange-50 text-orange-600",
  electric_install: "bg-rose-50 text-rose-600",
  inspection: "bg-emerald-50 text-emerald-600",
  handover: "bg-slate-800 text-white",
};

function MobileProjects() {
  const [search, setSearch] = useState("");
  const activeTenantId = useAppStore((s) => s.activeTenantId);

  // Filter theo tenant đang active
  const tenantProjects = mockProjects.filter((p) => p.tenantId === activeTenantId);

  const filtered = tenantProjects.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.address.toLowerCase().includes(search.toLowerCase())
  );

  // Tính progress thực từ stage
  const getProgress = (stage: string) => {
    const idx = PROJECT_STAGES.indexOf(stage as any);
    if (idx === -1) return 0;
    return Math.round(((idx + 1) / PROJECT_STAGES.length) * 100);
  };

  const inProgress = filtered.filter((p) => p.status === "in_progress").length;
  const completed = filtered.filter((p) => p.status === "completed").length;

  return (
    <MobileShell title="Dự án lắp đặt">
      {/* Stats */}
      <div className="px-5 pt-5 pb-4 grid grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl p-3 border border-slate-50 shadow-sm text-center">
          <p className="text-xl font-black text-slate-900">{filtered.length}</p>
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Tổng</p>
        </div>
        <div className="bg-white rounded-2xl p-3 border border-slate-50 shadow-sm text-center">
          <p className="text-xl font-black text-primary">{inProgress}</p>
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Đang làm</p>
        </div>
        <div className="bg-white rounded-2xl p-3 border border-slate-50 shadow-sm text-center">
          <p className="text-xl font-black text-emerald-600">{completed}</p>
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Hoàn thành</p>
        </div>
      </div>

      {/* Search + Add */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-3xl z-20 px-5 py-3 border-b border-slate-100 flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Tìm dự án, địa chỉ..."
            className="pl-11 h-11 bg-slate-50 border-none shadow-none rounded-2xl text-xs font-bold"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button
          className="h-11 rounded-2xl bg-slate-900 text-white font-black text-[9px] gap-2 px-4 shrink-0"
          onClick={() => toast.info("Tạo dự án mới")}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-4 space-y-4">
        {filtered.map((project) => {
          const progress = getProgress(project.stage);
          const colorClass = stageColors[project.stage] || "bg-slate-50 text-slate-600";
          const isCompleted = project.status === "completed";

          return (
            <Link key={project.id} to="/mobile/projects/$projectId" params={{ projectId: project.id }}>
              <Card className="p-5 border-none shadow-sm bg-white rounded-[2rem] active:scale-[0.97] transition-all mb-4">
                {/* Header */}
                <div className="flex items-start gap-4">
                  <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center shrink-0", isCompleted ? "bg-emerald-50" : "bg-orange-50")}>
                    <Building className={cn("h-6 w-6", isCompleted ? "text-emerald-600" : "text-orange-600")} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-black text-[13px] text-slate-900 leading-tight line-clamp-2">{project.name}</h3>
                      <span className={cn("text-[8px] font-black px-2 py-0.5 rounded-full shrink-0 uppercase", colorClass)}>
                        {PROJECT_STAGE_LABELS[project.stage]}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-1.5 text-slate-400">
                      <MapPin className="h-3 w-3 shrink-0" />
                      <span className="text-[9px] font-bold line-clamp-1">{project.address}</span>
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <div className="mt-5 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Tiến độ thi công</span>
                    <span className="text-[10px] font-black text-slate-900">{progress}%</span>
                  </div>
                  <Progress value={progress} className={cn("h-1.5", isCompleted ? "[&>div]:bg-emerald-500" : "")} />
                </div>

                {/* Footer */}
                <div className="mt-4 flex items-center justify-between pt-4 border-t border-slate-50">
                  <span className="text-[9px] font-black text-slate-400 uppercase">
                    BĐ: {new Date(project.startDate).toLocaleDateString("vi-VN")}
                  </span>
                  <span className="text-primary font-black text-[10px] flex items-center gap-1">
                    XEM CHI TIẾT <ChevronRight className="h-3 w-3" />
                  </span>
                </div>
              </Card>
            </Link>
          );
        })}

        {filtered.length === 0 && (
          <div className="py-20 text-center">
            <Building className="h-12 w-12 text-slate-200 mx-auto mb-4" />
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Không tìm thấy dự án nào</p>
          </div>
        )}
      </div>
    </MobileShell>
  );
}
