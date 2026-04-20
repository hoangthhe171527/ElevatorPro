import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/layout/MobileShell";
import { mockRequests, getUser, getProject, formatVND, type ApprovalRequest } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Package,
  CreditCard,
  FileCheck,
  User,
  AlertCircle,
  History as HistoryIcon,
  CheckCircle,
  TrendingUp,
} from "lucide-react";
import { useCurrentPermissions } from "@/lib/store";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";

export const Route = createFileRoute("/mobile/approvals")({
  head: () => ({ meta: [{ title: "Phê duyệt — Mobile" }] }),
  component: MobileApprovals,
});

function MobileApprovals() {
  const permissions = useCurrentPermissions();
  const allowed = ["director", "install_mgmt", "maintenance_mgmt", "accounting", "hr_admin"];
  const canAccess = permissions.some(p => allowed.includes(p));

  const [activeTab, setActiveTab] = useState<"pending" | "history">("pending");
  const [confirmId, setConfirmId] = useState<string | null>(null);

  if (!canAccess) {
    return (
      <MobileShell title="Truy cập bị hạn chế">
        <div className="flex flex-col items-center justify-center p-12 text-center h-[60vh]">
          <div className="h-20 w-20 rounded-[2rem] bg-rose-50 text-rose-500 flex items-center justify-center mb-6">
            <XCircle className="h-10 w-10" />
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tighter mb-2 italic">KHÔNG CÓ QUYỀN TRUY CẬP</h2>
          <p className="text-xs text-slate-400 font-medium leading-relaxed mb-8">
            Bạn không có thẩm quyền để duyệt các yêu cầu/chi phí. Vui lòng liên hệ cấp quản lý.
          </p>
          <Link to="/mobile" className="w-full">
            <Button className="w-full h-12 rounded-2xl bg-slate-900 text-white font-black italic uppercase text-[10px] tracking-widest shadow-xl">
              QUAY LẠI TRANG CHỦ
            </Button>
          </Link>
        </div>
      </MobileShell>
    );
  }

  const pending = mockRequests.filter((r) => r.status === "pending");
  const history = mockRequests.filter((r) => r.status !== "pending");

  const displayList = activeTab === "pending" ? pending : history;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "material":
        return Package;
      case "budget":
        return CreditCard;
      case "project_advance":
        return TrendingUp;
      case "completion":
        return FileCheck;
      default:
        return AlertCircle;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "material":
        return "bg-blue-500/10 text-blue-600";
      case "budget":
        return "bg-purple-500/10 text-purple-600";
      case "project_advance":
        return "bg-amber-500/10 text-amber-600";
      case "completion":
        return "bg-emerald-500/10 text-emerald-600";
      default:
        return "bg-slate-500/10 text-slate-600";
    }
  };

  return (
    <MobileShell title="Phê duyệt">
      <div className="flex flex-col pb-20">
        {/* Tab Header */}
        <div className="bg-white border-b sticky top-0 z-20 px-6 py-4 flex gap-2">
            <button
                onClick={() => setActiveTab("pending")}
                className={cn(
                    "flex-1 h-11 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 border",
                    activeTab === "pending" 
                        ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                        : "bg-white text-slate-400 border-slate-100"
                )}
            >
                <Clock className="h-3.5 w-3.5" />
                Đang chờ ({pending.length})
            </button>
            <button
                onClick={() => setActiveTab("history")}
                className={cn(
                    "flex-1 h-11 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 border",
                    activeTab === "history" 
                        ? "bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/20" 
                        : "bg-white text-slate-400 border-slate-100"
                )}
            >
                <HistoryIcon className="h-3.5 w-3.5" />
                Lịch sử
            </button>
        </div>

        <div className="p-6 space-y-4">
          {displayList.length === 0 && (
            <div className="py-24 text-center">
              <div className={cn(
                  "h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4 bg-slate-50",
                  activeTab === "pending" ? "text-emerald-100" : "text-slate-100"
              )}>
                {activeTab === "pending" ? <CheckCircle className="h-10 w-10" /> : <HistoryIcon className="h-10 w-10" />}
              </div>
              <h3 className="font-black text-slate-900">
                {activeTab === "pending" ? "Đã sạch yêu cầu" : "Chưa có quyết định nào"}
              </h3>
              <p className="text-xs text-slate-400 mt-2 font-medium">
                {activeTab === "pending" ? "Không có yêu cầu nào đang chờ xử lý." : "Các yêu cầu đã xử lý sẽ hiện ở đây."}
              </p>
            </div>
          )}

          {displayList.map((req) => {
            const Icon = getTypeIcon(req.type);
            const user = getUser(req.requestedBy);
            const project = req.targetId ? getProject(req.targetId) : null;
            const isApproved = req.status === "approved";
            const isRejected = req.status === "rejected";

            return (
              <Card
                key={req.id}
                className="p-5 border-none shadow-sm shadow-slate-200/50 bg-white rounded-[2rem] active:scale-[0.98] transition-all relative overflow-hidden group"
              >
                <div className="flex items-center gap-4 mb-5">
                  <div className={cn(
                    "h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-current/5",
                    getTypeColor(req.type)
                  )}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-sm text-slate-900 leading-tight line-clamp-1">{req.title}</h3>
                    <div className="flex items-center gap-2 mt-1.5 font-medium">
                      <div className="h-5 w-5 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
                        <User className="h-3 w-3 text-slate-400" />
                      </div>
                      <span className="text-[10px] text-slate-500">
                        {user?.name}
                      </span>
                      <div className="h-1 w-1 rounded-full bg-slate-200" />
                      <span className="text-[10px] text-slate-400">1h trước</span>
                    </div>
                  </div>
                  {req.urgency === "critical" && (
                    <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                  )}
                </div>

                <div className="text-xs text-slate-600 bg-slate-50/50 p-4 rounded-2xl mb-5 italic border border-slate-100/50 relative">
                  <span className="absolute -top-2 left-4 px-2 bg-white text-[8px] font-black uppercase text-slate-300">Nội dung yêu cầu</span>
                  "{req.description}"
                  {(req.amount || project) && (
                    <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-end not-italic">
                      {req.amount && (
                        <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase">Dự chi</p>
                          <p className="text-sm font-black text-slate-900 mt-0.5">{formatVND(req.amount)}</p>
                        </div>
                      )}
                      {project && (
                        <div className="text-right">
                          <p className="text-[9px] font-black text-slate-400 uppercase">Dự án</p>
                          <p className="text-[10px] font-bold text-primary mt-0.5 uppercase tracking-tight">{project.name}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {activeTab === "pending" ? (
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1 h-11 rounded-2xl border-slate-100 text-slate-400 hover:text-red-500 hover:bg-red-50 hover:border-red-100 font-black text-[10px] tracking-widest transition-all"
                      onClick={() => toast.error("Đã từ chối yêu cầu")}
                    >
                      <XCircle className="h-4 w-4 mr-2" /> TỪ CHỐI
                    </Button>
                    <Button
                      className="flex-1 h-11 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-[10px] tracking-widest shadow-lg shadow-primary/20"
                      onClick={() => setConfirmId(req.id)}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" /> PHÊ DUYỆT
                    </Button>
                  </div>
                ) : (
                  <div className={cn(
                    "flex items-center justify-center gap-2 py-3 rounded-2xl font-black text-[10px] tracking-widest uppercase",
                    isApproved ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                  )}>
                    {isApproved ? (
                        <>
                            <CheckCircle2 className="h-4 w-4" /> ĐÃ PHÊ DUYỆT
                        </>
                    ) : (
                        <>
                            <XCircle className="h-4 w-4" /> ĐÃ TỪ CHỐI
                        </>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>

      <ConfirmationDialog
        open={!!confirmId}
        onOpenChange={(o) => !o && setConfirmId(null)}
        title="Xác nhận phê duyệt"
        description="Bạn có chắc chắn muốn phê duyệt yêu cầu này? Hệ thống sẽ tự động cập nhật tiến độ dự án và thông báo cho các bên liên quan."
        onConfirm={() => {
          toast.success("Đã phê duyệt yêu cầu thành công!");
          setConfirmId(null);
        }}
        variant="success"
      />
    </MobileShell>
  );
}

