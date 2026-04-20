import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/layout/MobileShell";
import { mockRequests, getUser, getProject, formatCurrency } from "@/lib/mock-data";
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
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";

export const Route = createFileRoute("/mobile/approvals")({
  head: () => ({ meta: [{ title: "Phê duyệt — Mobile" }] }),
  component: MobileApprovals,
});

function MobileApprovals() {
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const pending = mockRequests.filter((r) => r.status === "pending");

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "material":
        return Package;
      case "budget":
        return CreditCard;
      case "completion":
        return FileCheck;
      default:
        return AlertCircle;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "material":
        return "bg-blue-100 text-blue-600";
      case "budget":
        return "bg-purple-100 text-purple-600";
      case "completion":
        return "bg-emerald-100 text-emerald-600";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  return (
    <MobileShell title="Trung tâm phê duyệt">
      <div className="p-4 space-y-4">
        {pending.length === 0 && (
          <div className="py-20 text-center">
            <CheckCircle2 className="h-16 w-16 text-emerald-100 mx-auto mb-4" />
            <h3 className="font-bold text-slate-900">Đã sạch yêu cầu</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Không có yêu cầu nào đang chờ bạn xử lý.
            </p>
          </div>
        )}

        {pending.map((req) => {
          const Icon = getTypeIcon(req.type);
          const user = getUser(req.requestedBy);
          const project = req.targetId ? getProject(req.targetId) : null;

          return (
            <Card
              key={req.id}
              className="p-4 shadow-sm border-none bg-background active:scale-[0.98] transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={cn(
                    "h-10 w-10 rounded-xl flex items-center justify-center shrink-0",
                    getTypeColor(req.type),
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm leading-tight line-clamp-1">{req.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <User className="h-3 w-3 text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground font-medium">
                      {user?.name}
                    </span>
                    <span className="text-[8px] text-muted-foreground opacity-50">•</span>
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground font-medium">1h trước</span>
                  </div>
                </div>
                {req.urgency === "critical" && (
                  <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                )}
              </div>

              <div className="text-xs text-slate-600 leading-relaxed mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100 italic">
                "{req.description}"
                {req.amount && (
                  <div className="mt-2 text-foreground font-bold not-italic">
                    Dự chi: {formatVND(req.amount)}
                  </div>
                )}
                {project && (
                  <div className="mt-1 text-[10px] text-primary font-bold uppercase tracking-tight not-italic">
                    {project.name}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  className="flex-1 h-10 rounded-xl border-slate-200 text-destructive hover:bg-red-50 font-bold text-xs"
                  onClick={() => toast.error("Đã từ chối yêu cầu")}
                >
                  <XCircle className="h-4 w-4 mr-2" /> TỪ CHỐI
                </Button>
                <Button
                  className="flex-1 h-10 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs shadow-md shadow-primary/20"
                  onClick={() => setConfirmId(req.id)}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" /> PHÊ DUYỆT
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      <ConfirmationDialog
        open={!!confirmId}
        onOpenChange={(o) => !o && setConfirmId(null)}
        title="Xác nhận phê duyệt"
        description="Bạn có chắc chắn muốn phê duyệt yêu cầu này không? Thao tác này sẽ giải ngân hoặc cho thực thi giai đoạn tiếp theo của dự án ngay lập tức."
        onConfirm={() => {
          toast.success("Đã phê duyệt yêu cầu thành công!");
          setConfirmId(null);
        }}
        variant="success"
      />
    </MobileShell>
  );
}
