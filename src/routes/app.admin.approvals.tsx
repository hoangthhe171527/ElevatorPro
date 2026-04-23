import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  Package,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  User,
} from "lucide-react";
import { mockRequests, getUser, getProject, formatVND, formatDate } from "@/lib/mock-data";
import { useAppStore, useIsSmallCompany } from "@/lib/store";
import { useState } from "react";
import { toast } from "sonner";
import { DataPagination } from "@/components/common/DataPagination";

export const Route = createFileRoute("/app/admin/approvals")({
  head: () => ({ meta: [{ title: "App — Phê duyệt — ElevatorPro" }] }),
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
      <PageHeader title="Trung tâm Phê duyệt" description="Quản lý và xét duyệt các yêu cầu" />

      <div className="flex flex-col gap-4 pb-8">
        {isSmall ? (
          <div className="bg-primary/5 border border-primary/20 rounded-[2rem] p-8 text-center">
            <ShieldCheck className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-black uppercase">Mô hình Tự động</h3>
            <p className="text-[13px] text-slate-500 mt-2 leading-relaxed">
              Hệ thống đang vận hành theo cơ chế tự động phê duyệt dựa trên bằng chứng hiện trường.
            </p>
          </div>
        ) : paged.length === 0 ? (
          <div className="py-20 text-center">
            <Clock className="h-12 w-12 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-400 font-bold uppercase text-[11px] tracking-widest">
              Trống. Không có đơn chờ
            </p>
          </div>
        ) : (
          paged.map((req) => {
            const requester = getUser(req.requestedBy);
            const project = req.targetId ? getProject(req.targetId) : null;
            const Icon = TYPE_ICONS[req.type as keyof typeof TYPE_ICONS] || FileText;

            return (
              <div
                key={req.id}
                className="relative bg-white p-5 rounded-[24px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-slate-100"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-3">
                    <div className="h-10 w-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-black text-[15px] text-slate-800 leading-tight mb-0.5">
                        {TYPE_LABELS[req.type as keyof typeof TYPE_LABELS]}
                      </h3>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Đơn #{req.id}
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant={
                      req.status === "pending"
                        ? "outline"
                        : req.status === "approved"
                          ? "default"
                          : "destructive"
                    }
                    className="text-[9px] uppercase font-black px-2 py-0.5 rounded-full"
                  >
                    {req.status === "pending"
                      ? "Chờ duyệt"
                      : req.status === "approved"
                        ? "Đã duyệt"
                        : "Từ chối"}
                  </Badge>
                </div>

                <div className="mb-4">
                  <div className="text-[14px] font-bold text-slate-700 mb-2">{req.title}</div>
                  <p className="text-[12px] text-slate-500 line-clamp-2 leading-relaxed">
                    {req.description}
                  </p>
                  {req.amount && (
                    <div className="mt-3 text-lg font-black text-rose-500">
                      {formatVND(req.amount)}
                    </div>
                  )}
                  {project && (
                    <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 text-slate-600 text-[10px] font-bold rounded-lg border border-slate-100 uppercase tracking-tight">
                      Dự án: {project.name}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-2">
                    <User className="h-3.5 w-3.5 text-slate-400" />
                    <span className="text-[11px] font-bold text-slate-500">{requester?.name}</span>
                  </div>
                  {req.status === "pending" && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-9 rounded-xl text-[10px] uppercase font-black border-slate-200 text-slate-600"
                        onClick={() => handleAction(req.id, "rejected")}
                      >
                        Bác bỏ
                      </Button>
                      <Button
                        size="sm"
                        className="h-9 rounded-xl text-[10px] uppercase font-black bg-emerald-500 hover:bg-emerald-600"
                        onClick={() => handleAction(req.id, "approved")}
                      >
                        Duyệt
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}

        {filtered.length > 5 && (
          <DataPagination page={page} pageSize={5} total={filtered.length} onPageChange={setPage} />
        )}
      </div>
    </AppShell>
  );
}
