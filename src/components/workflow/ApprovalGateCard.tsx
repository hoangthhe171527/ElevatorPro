import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ShieldCheck, 
  UserCheck, 
  AlertCircle, 
  FastForward, 
  Clock,
  CheckCircle2
} from "lucide-react";
import { Permission, WorkflowGate, formatVND } from "@/lib/mock-data";

interface ApprovalGateCardProps {
  gate: WorkflowGate;
  isCurrent: boolean;
  isPast: boolean;
  onBypass: () => void;
  onAdvance: () => void;
  tenantId: string;
  disabled?: boolean;
}

const PERMISSION_LABELS: Record<Permission, string> = {
  director: "Ban Giám đốc",
  sales: "Phòng Kinh doanh",
  sales_maintenance: "Kinh doanh bảo trì",
  tech_survey: "Kỹ thuật khảo sát",
  install_mgmt: "Quản lý lắp đặt",
  maintenance_mgmt: "Quản lý bảo trì",
  accounting: "Phòng Kế toán",
  hr_admin: "Hành chính & Pháp chế",
  field_tech: "Kỹ thuật viên",
};

export function ApprovalGateCard({ 
  gate, 
  isCurrent, 
  isPast, 
  onBypass, 
  onAdvance,
  tenantId,
  disabled 
}: ApprovalGateCardProps) {
  if (isPast) {
    return (
      <div className="flex items-center gap-2 text-success text-sm font-medium bg-success/5 p-3 rounded-lg border border-success/20">
        <CheckCircle2 className="h-4 w-4" />
        Đã phê duyệt: {gate.label}
      </div>
    );
  }

  if (!isCurrent) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground text-sm p-3 rounded-lg border border-dashed">
        <Clock className="h-4 w-4" />
        Chờ đến giai đoạn này...
      </div>
    );
  }

  return (
    <Card className="border-primary/20 bg-primary/5 shadow-none overflow-hidden underline-none">
      <CardHeader className="py-3 bg-primary/10 border-b border-primary/20">
        <CardTitle className="text-sm flex items-center gap-2 text-primary">
          <ShieldCheck className="h-4 w-4" />
          {gate.label}
        </CardTitle>
      </CardHeader>
      <CardContent className="py-4 space-y-4">
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">
            Yêu cầu phê duyệt từ:
          </label>
          <div className="flex flex-wrap gap-1.5">
            {gate.approvers.map((p) => (
              <Badge key={p} variant="secondary" className="bg-background border font-medium">
                <UserCheck className="h-3 w-3 mr-1 opacity-60" />
                {PERMISSION_LABELS[p]}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button size="sm" onClick={onAdvance} disabled={disabled} className="flex-1 shadow-sm">
            {gate.isFlexible ? "Xác nhận & Tiếp tục" : "Gửi yêu cầu & Tiếp tục"}
          </Button>
          {!gate.isFlexible && (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={onBypass}
              className="text-orange-600 border-orange-200 hover:bg-orange-50 hover:text-orange-700 h-9"
              title="Break Flow: Bỏ qua phê duyệt"
            >
              <FastForward className="h-4 w-4 mr-1.5" />
              Bypass
            </Button>
          )}
        </div>

        {gate.isFlexible && (
          <div className="flex items-start gap-2 text-[10px] text-blue-600 bg-blue-500/5 p-2 rounded border border-blue-500/10 italic">
            <AlertCircle className="h-3 w-3 shrink-0 mt-0.5" />
            Chế độ Công ty nhỏ: Sếp tự quyết định, không cần quy trình phê duyệt đa tầng.
          </div>
        )}
        
        <div className="flex items-start gap-2 text-[10px] text-muted-foreground bg-background/50 p-2 rounded">
          <AlertCircle className="h-3 w-3 mt-0.5 shrink-0" />
          <p>Hệ thống hỗ trợ "Break Flow". Bạn có thể bỏ qua bước này nếu cần triển khai gấp (yêu cầu quyền Giám đốc).</p>
        </div>
      </CardContent>
    </Card>
  );
}
