import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronRight, HardHat, Building, AlertCircle } from "lucide-react";
import { mockProjects, PROJECT_STAGES, PROJECT_STAGE_LABELS, advanceProjectStage } from "@/lib/mock-data";
import { useState } from "react";
import { useAppStore, useCanWrite } from "@/lib/store";
import { DataPagination } from "@/components/common/DataPagination";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export const Route = createFileRoute("/admin/projects")({
  head: () => ({ meta: [{ title: "Tiến độ Dự án Lắp đặt — ElevatorPro" }] }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const activeTenantId = useAppStore(s => s.activeTenantId);
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
    advanceProjectStage(confirmId);
    setProjects([...mockProjects]);
    setConfirmId(null);
  };

  return (
    <AppShell>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <PageHeader title="Tiến độ Dự án (Lắp mới)" description="Theo dõi và chuyển đổi trạng thái thi công dự án." />
      </div>

      <div className="space-y-6">
        {paginatedProjects.map((proj) => {
          const currentStageIndex = PROJECT_STAGES.indexOf(proj.stage);
          const isCompleted = proj.status === "completed";

          return (
            <Card key={proj.id} className="overflow-hidden">
              <CardHeader className="bg-muted/30 pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      <Link 
                        to="/admin/projects/$projectId" 
                        params={{ projectId: proj.id }}
                        className="flex items-center gap-2 hover:text-primary transition-colors"
                      >
                        <Building className="h-5 w-5 text-primary" />
                        {proj.name}
                        {isCompleted && <Badge variant="outline" className="ml-2 bg-success/10 text-success border-success/20">Hoàn thành</Badge>}
                      </Link>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{proj.address}</p>
                  </div>
                  <div className="flex gap-2">
                    <Link to="/admin/projects/$projectId" params={{ projectId: proj.id }}>
                      <Button variant="outline" size="sm" className="h-9 px-3 gap-1.5">
                        <ChevronRight className="h-4 w-4" /> Chi tiết
                      </Button>
                    </Link>
                    {(!isCompleted && canModify) && (
                      <Button 
                        onClick={() => confirmAdvance(proj.id)}
                        className="h-9 gap-2"
                      >
                        <Check className="h-4 w-4" /> 
                        Hoàn tất: {PROJECT_STAGE_LABELS[proj.stage]}
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-6">
                <div className="relative">
                  {/* Stepper background line */}
                  <div className="absolute top-1/2 left-0 w-full h-1 bg-muted -translate-y-1/2 rounded" />
                  
                  {/* Stepper progress line */}
                  <div 
                    className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 rounded transition-all duration-500" 
                    style={{ width: `${(currentStageIndex / (PROJECT_STAGES.length - 1)) * 100}%` }}
                  />

                  {/* Stepper nodes */}
                  <div className="relative flex justify-between">
                    {PROJECT_STAGES.map((stage, idx) => {
                      const isPast = idx < currentStageIndex;
                      const isCurrent = idx === currentStageIndex;
                      return (
                        <div key={stage} className="flex flex-col items-center gap-2 w-16">
                          <div className={`
                            z-10 flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium border-2 transition-colors
                            ${isPast ? "bg-primary border-primary text-primary-foreground" : 
                              isCurrent ? "bg-background border-primary text-primary" : 
                              "bg-background border-muted text-muted-foreground"}
                          `}>
                            {isPast ? <Check className="h-3 w-3" /> : idx + 1}
                          </div>
                          <div className={`text-[10px] text-center font-medium leading-tight ${isCurrent ? "text-primary" : "text-muted-foreground"}`}>
                            {PROJECT_STAGE_LABELS[stage]}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>

              {/* Suggestions / Next Actions Panel */}
              {!isCompleted && (
                <CardFooter className="bg-primary/5 border-t py-3">
                  <div className="flex items-start gap-3 text-sm">
                    <div className="mt-0.5 rounded-full bg-primary/20 p-1 text-primary">
                      <AlertCircle className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-semibold text-primary">Việc cần làm hiện tại: </span>
                      {proj.stage === "survey" && "Cử kỹ thuật khảo sát hiện trường và báo cáo sai lệch so với hợp đồng."}
                      {proj.stage === "design" && "Lên bản vẽ hố thang và chờ khách hàng ký duyệt bản cứng."}
                      {proj.stage === "procurement" && "Tạo đơn đặt hàng (PO) gửi nhà máy sản xuất."}
                      {proj.stage === "in_transit" && "Theo dõi tàu biển. Cảnh báo khách hàng chuẩn bị mặt bằng tập kết."}
                      {proj.stage === "mechanic_install" && "Điều phối đội thầu phụ cơ khí vào công trình."}
                      {proj.stage === "electric_install" && "Điều phối kỹ thuật viên điện nội bộ để đấu nối tủ điện."}
                      {proj.stage === "inspection" && "Đăng ký cơ quan kiểm định độc lập đến dán tem an toàn."}
                      {proj.stage === "handover" && "Ký biên bản bàn giao, kích hoạt bảo hành, báo kế toán thu tiền đợt cuối."}
                    </div>
                  </div>
                </CardFooter>
              )}
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

      <Dialog open={!!confirmId} onOpenChange={(open) => !open && setConfirmId(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Xác nhận chuyển giai đoạn thi công</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            Bạn có chắc chắn dự án <span className="font-bold">{projects.find(p => p.id === confirmId)?.name}</span> đã hoàn tất bước này? Lịch sử sẽ được ghi nhận và báo cáo lên Giám đốc.
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmId(null)}>Hủy</Button>
            <Button className="bg-success text-success-foreground hover:bg-success/90" onClick={handleAdvance}>Đồng ý, chuyển trạng thái</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
