import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  Package,
  DollarSign,
  AlertTriangle,
  User,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { mockRequests, getUser, getProject, formatVND, formatDate } from "@/lib/mock-data";
import { useAppStore, useIsSmallCompany } from "@/lib/store";
import { useState } from "react";
import { toast } from "sonner";
import { DataPagination } from "@/components/common/DataPagination";

export const Route = createFileRoute("/admin/approvals")({
  head: () => ({ meta: [{ title: "Trung tâm Phê duyệt — ElevatorPro" }] }),
  component: ApprovalsPage,
});

const TYPE_ICONS = {
  material: Package,
  budget: DollarSign,
  project_advance: ArrowRight,
  completion: CheckCircle2,
  workflow_gate: ShieldCheck,
  lead_quote: TrendingUp,
  contract_approval: FileText,
};

const TYPE_LABELS = {
  material: "Cấp vật tư",
  budget: "Dự trù ngân sách",
  project_advance: "Đạt tiến độ",
  completion: "Nghiệm thu bản giao",
  workflow_gate: "Phê duyệt Giai đoạn",
  lead_quote: "Duyệt báo giá Lead",
  contract_approval: "Duyệt hợp đồng",
};

const URGENCY_STYLES = {
  normal: "bg-blue-500/10 text-blue-600 border-blue-200",
  high: "bg-orange-500/10 text-orange-600 border-orange-200",
  critical: "bg-red-500/10 text-red-600 border-red-200 animate-pulse",
};

function ApprovalsPage() {
  const activeTenantId = useAppStore((s) => s.activeTenantId);
  const isSmall = useIsSmallCompany();
  const [page, setPage] = useState(1);
  const [requests, setRequests] = useState(mockRequests);

  const filtered = requests.filter((r) => r.tenantId === activeTenantId);
  const paged = filtered.slice((page - 1) * 5, page * 5);

  const handleAction = async (id: string, action: "approved" | "rejected") => {
    const updated = requests.map((r) => (r.id === id ? { ...r, status: action } : r));
    setRequests(updated);
    toast.success(action === "approved" ? "Đã phê duyệt đơn" : "Đã từ chối đơn");
  };

  return (
    <AppShell>
      <PageHeader
        title="Trung tâm Phê duyệt"
        description="Quản lý và xét duyệt các yêu cầu, đề xuất từ nhân viên cấp dưới."
      />

      <div className="grid gap-6">
        <div className="flex items-center gap-4 text-sm font-medium border-b pb-2">
          <div className="text-primary border-b-2 border-primary pb-2 px-1 cursor-pointer">
            Chờ duyệt ({filtered.filter((r) => r.status === "pending").length})
          </div>
          <div className="text-muted-foreground px-1 cursor-pointer">Lịch sử</div>
        </div>

        {isSmall ? (
          <Card className="bg-primary/5 border-primary/20 p-8 text-center">
            <div className="max-w-md mx-auto">
              <ShieldCheck className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-bold">Mô hình Công ty Nhỏ</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Hệ thống đang vận hành theo cơ chế <strong>"Tự động hóa & Tin tưởng"</strong>. Các
                yêu cầu từ kỹ thuật được phê duyệt ngay lập tức dựa trên bằng chứng ảnh và log.
              </p>
              <p className="text-xs text-muted-foreground mt-4 italic">
                Cấu hình này giúp tăng tốc độ thực thi tại hiện trường. CEO có thể kiểm tra lại qua
                Nhật ký hệ thống bất cứ lúc nào.
              </p>
            </div>
          </Card>
        ) : paged.length === 0 ? (
          <Card className="flex items-center justify-center p-12 border-dashed">
            <div className="text-center text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>Hiện không có yêu cầu nào cần bạn phê duyệt.</p>
            </div>
          </Card>
        ) : (
          <div className="grid gap-4">
            {paged.map((req) => {
              const requester = getUser(req.requestedBy);
              const project = req.targetId ? getProject(req.targetId) : null;
              const Icon = TYPE_ICONS[req.type];

              return (
                <Card key={req.id} className="overflow-hidden group hover:shadow-md transition-all">
                  <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x">
                    <div className="p-4 md:w-64 bg-muted/20 flex flex-col justify-between">
                      <div>
                        <Badge
                          className={`${URGENCY_STYLES[req.urgency]} border mb-2`}
                          variant="outline"
                        >
                          {req.urgency === "critical"
                            ? "KHẨN CẤP"
                            : req.urgency === "high"
                              ? "Ưu tiên cao"
                              : "Bình thường"}
                        </Badge>
                        <div className="flex items-center gap-2 text-sm font-bold">
                          <Icon className="h-4 w-4 text-primary" />
                          {TYPE_LABELS[req.type]}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">Mã đơn: #{req.id}</div>
                      </div>
                      <div className="mt-4 flex items-center gap-2">
                        <User className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs font-medium">{requester?.name}</span>
                      </div>
                    </div>

                    <div className="flex-1 p-4 flex flex-col justify-between">
                      <div>
                        <h3 className="font-semibold text-base mb-1">{req.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {req.description}
                        </p>
                        {req.amount && (
                          <div className="mt-2 text-lg font-bold text-destructive">
                            {formatVND(req.amount)}
                          </div>
                        )}
                        {project && (
                          <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 bg-primary/5 text-primary text-xs rounded border border-primary/10">
                            <FileText className="h-3 w-3" /> Dự án: {project.name}
                          </div>
                        )}
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="text-[10px] text-muted-foreground">
                          Ngày gửi: {formatDate(req.requestedAt)}
                        </div>
                        {req.status === "pending" ? (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAction(req.id, "rejected")}
                            >
                              <XCircle className="h-4 w-4 mr-1 md:hidden lg:inline" /> Từ chối
                            </Button>
                            <Button
                              size="sm"
                              className="bg-success hover:bg-success/90"
                              onClick={() => handleAction(req.id, "approved")}
                            >
                              <CheckCircle2 className="h-4 w-4 mr-1 md:hidden lg:inline" /> Phê
                              duyệt
                            </Button>
                          </div>
                        ) : (
                          <Badge variant={req.status === "approved" ? "outline" : "destructive"}>
                            {req.status === "approved" ? "Đã duyệt" : "Đã bác bỏ"}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}

            <DataPagination
              page={page}
              pageSize={5}
              total={filtered.length}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </AppShell>
  );
}
