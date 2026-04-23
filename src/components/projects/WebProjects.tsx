import { Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronRight, Building, AlertCircle, MapPin } from "lucide-react";
import {
  mockProjects,
  PROJECT_STAGES,
  PROJECT_STAGE_LABELS,
  advanceProjectStage,
  mockJobs,
} from "@/lib/mock-data";
import { useState } from "react";
import { useAppStore, useCanWrite } from "@/lib/store";
import { DataPagination } from "@/components/common/DataPagination";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { handleEquipmentArrival } from "@/lib/workflow-utils";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function WebProjects() {
  const activeTenantId = useAppStore((s) => s.activeTenantId);
  const canModify = useCanWrite("projects");
  const [projects, setProjects] = useState(mockProjects);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3;
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const paginatedProjects = projects.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const confirmAdvance = (id: string) => {
    setConfirmId(id);
  };

  const handleAdvance = () => {
    if (!confirmId) return;
    
    const proj = projects.find(p => p.id === confirmId);
    if (proj?.stage === "waiting_for_equipment") {
      const { jobs } = handleEquipmentArrival(proj, mockJobs);
      jobs.forEach(updatedJob => {
        const idx = mockJobs.findIndex(j => j.id === updatedJob.id);
        if (idx !== -1) mockJobs[idx] = updatedJob;
      });
      toast.success("Thiết bị đã về công trình. Kích hoạt công việc lắp đặt!");
    } else if (proj?.stage === "installation") {
      toast.success("Đã xác nhận hoàn thành lắp đặt!");
    } else if (proj?.stage === "completion") {
      toast.success("Đã nghiệm thu, chuẩn bị chuyển sang bảo hành.");
    }
    
    advanceProjectStage(confirmId);
    setProjects([...mockProjects]);
    setConfirmId(null);
  };

  return (
    <AppShell>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <PageHeader
          title="Tiến độ Dự án (Lắp mới)"
          description="Theo dõi và chuyển đổi trạng thái thi công dự án."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedProjects.map((proj) => {
          const isCompleted = proj.status === "completed";

          return (
            <Card key={proj.id} className="overflow-hidden shadow-xl shadow-slate-200/50 border-none rounded-[2rem] hover:scale-[1.02] transition-all group bg-white">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-4">
                   <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                      <Building className="h-6 w-6" />
                   </div>
                   <Badge variant="outline" className={cn(
                     "font-black uppercase tracking-widest text-[10px] px-3 py-1 rounded-lg border-none",
                     isCompleted ? "bg-emerald-500/10 text-emerald-600" : "bg-primary/10 text-primary"
                   )}>
                     {PROJECT_STAGE_LABELS[proj.stage] || proj.stage}
                   </Badge>
                </div>
                <CardTitle className="text-xl font-black text-slate-800 tracking-tight group-hover:text-primary transition-colors">
                  {proj.name}
                </CardTitle>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium mt-2">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" /> {proj.address}
                </div>
              </CardHeader>

              <CardContent className="pb-6">
                 <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                       <span>Tiến độ tổng quát</span>
                       <span>{proj.stage === 'completion' ? '95%' : proj.stage === 'installation' ? '60%' : '20%'}</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/50">
                       <div 
                         className="h-full bg-primary rounded-full transition-all duration-1000"
                         style={{ width: proj.stage === 'completion' ? '95%' : proj.stage === 'installation' ? '60%' : '20%' }}
                       />
                    </div>
                 </div>
              </CardContent>

              <CardFooter className="pt-0 pb-6 px-6">
                <Link 
                  to="/admin/projects/$projectId" 
                  params={{ projectId: proj.id }}
                  className="w-full"
                >
                  <Button className="w-full h-12 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-lg shadow-primary/20 gap-2">
                    Xem chi tiết giai đoạn <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <div className="mt-6">
        <DataPagination
          page={currentPage}
          total={projects.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      </div>

      <ConfirmationDialog
        open={!!confirmId}
        onOpenChange={(open) => !open && setConfirmId(null)}
        title="Xác nhận chuyển giai đoạn thi công"
        description={`Bạn có chắc chắn dự án ${projects.find((p) => p.id === confirmId)?.name} đã hoàn tất bước này? Lịch sử sẽ được ghi nhận. Nên được thao tác bởi Trưởng phòng/GĐ.`}
        onConfirm={handleAdvance}
        confirmText="Đồng ý, nâng giai đoạn"
        variant="success"
      />
    </AppShell>
  );
}
