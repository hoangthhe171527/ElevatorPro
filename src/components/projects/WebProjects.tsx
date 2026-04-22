import { Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
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
import { DataPagination } from "@/components/common/DataPagination";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";

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

      <div className="space-y-6">
        {paginatedProjects.map((proj) => {
          const currentStageIndex = PROJECT_STAGES.indexOf(proj.stage);
          const isCompleted = proj.status === "completed";

          return (
            <Card key={proj.id} className="overflow-hidden shadow-sm border-slate-200">
              <CardHeader className="bg-slate-50/80 pb-4 border-b border-slate-100">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      <Link
                        to="/admin/projects/$projectId"
                        params={{ projectId: proj.id }}
                        className="flex items-center gap-2 hover:text-primary transition-colors text-slate-800 font-bold"
                      >
                        <Building className="h-5 w-5 text-primary" />
                        {proj.name}
                        {isCompleted && (
                          <Badge
                            variant="outline"
                            className="ml-2 bg-success/10 text-success border-success/20 font-bold uppercase tracking-widest text-[10px]"
                          >
                            Hoàn thành
                          </Badge>
                        )}
                      </Link>
                    </CardTitle>
                    <p className="text-sm text-slate-500 font-medium mt-1">{proj.address}</p>
                  </div>
                  <div className="flex gap-2">
                    <Link to="/admin/projects/$projectId" params={{ projectId: proj.id }}>
                      <Button variant="outline" size="sm" className="h-9 px-3 gap-1.5 focus-visible:ring-primary/20 hover:bg-slate-100">
                        <ChevronRight className="h-4 w-4" /> Chi tiết
                      </Button>
                    </Link>
                    {!isCompleted && canModify && (
                      <Button onClick={() => confirmAdvance(proj.id)} className="h-9 gap-2 shadow-sm focus-visible:ring-primary/20">
                        <Check className="h-4 w-4" />
                        Hoàn tất: {PROJECT_STAGE_LABELS[proj.stage]}
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-8 pb-8">
                <div className="relative">
                  {/* Stepper background line */}
                  <div className="absolute top-1/2 left-0 w-full h-1.5 bg-slate-100 -translate-y-1/2 rounded-full" />

                  {/* Stepper progress line */}
                  <div
                    className="absolute top-1/2 left-0 h-1.5 bg-primary -translate-y-1/2 rounded-full transition-all duration-500"
                    style={{ width: `${(currentStageIndex / (PROJECT_STAGES.length - 1)) * 100}%` }}
                  />

                  {/* Stepper nodes */}
                  <div className="relative flex justify-between">
                    {PROJECT_STAGES.map((stage, idx) => {
                      const isPast = idx < currentStageIndex;
                      const isCurrent = idx === currentStageIndex;
                      return (
                        <div key={stage} className="flex flex-col items-center gap-3 w-16 group">
                          <div
                            className={`
                            z-10 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold border-[3px] transition-all duration-300
                            ${
                              isPast
                                ? "bg-primary border-primary text-primary-foreground shadow-sm shadow-primary/30"
                                : isCurrent
                                  ? "bg-white border-primary text-primary shadow-md shadow-primary/20 scale-110"
                                  : "bg-white border-slate-200 text-slate-400 group-hover:border-slate-300"
                            }
                          `}
                          >
                            {isPast ? <Check className="h-4 w-4" /> : idx + 1}
                          </div>
                          <div
                            className={`text-[11px] text-center font-bold leading-tight ${isCurrent ? "text-primary" : isPast ? "text-slate-700" : "text-slate-400"}`}
                          >
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
                <CardFooter className="bg-primary/5 border-t border-primary/10 py-4">
                  <div className="flex items-start gap-3 text-sm">
                    <div className="mt-0.5 rounded-full bg-white p-1.5 text-primary shadow-sm">
                      <AlertCircle className="h-4 w-4" />
                    </div>
                    <div className="pt-0.5">
                      <span className="font-bold text-primary uppercase tracking-tight text-[11px] block mb-1">Việc cần làm hiện tại</span>
                      <span className="text-slate-700 font-medium">
                        {proj.stage === "lead" && "Liên hệ khách hàng, thu thập thông tin và khảo sát nhu cầu ban đầu."}
                        {proj.stage === "contract" && "Đàm phán chi tiết và hoàn tất ký kết hợp đồng theo báo giá đã duyệt."}
                        {proj.stage === "technical" && "Cử kỹ thuật khảo sát chi tiết hố thang và phát hành bản vẽ thiết kế."}
                        {proj.stage === "procurement" && "Xử lý đơn đặt hàng với nhà máy sản xuất (PO) và theo dõi tiến độ."}
                        {proj.stage === "warehouse" && "Kiểm tra hàng về kho, thực hiện QC và chuẩn bị vật tư lắp đặt."}
                        {proj.stage === "installation" && "Điều phối đội lắp đặt cơ khí và điện vào công trình thi công."}
                        {proj.stage === "completion" && "Đăng ký kiểm định an toàn, nghiệm thu bàn giao và quyết toán hợp đồng."}
                      </span>
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
