import { cn } from "@/lib/utils";

type Variant = "success" | "warning" | "destructive" | "info" | "muted" | "primary";

const styles: Record<Variant, string> = {
  success: "bg-success/10 text-success border-success/20",
  warning: "bg-warning/15 text-warning-foreground border-warning/30",
  destructive: "bg-destructive/10 text-destructive border-destructive/20",
  info: "bg-info/10 text-info border-info/20",
  muted: "bg-muted text-muted-foreground border-border",
  primary: "bg-primary/10 text-primary border-primary/20",
};

export function StatusBadge({ children, variant = "muted", className }: { children: React.ReactNode; variant?: Variant; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium", styles[variant], className)}>
      {children}
    </span>
  );
}

// Dictionaries
export const jobStatusVariant: Record<string, Variant> = {
  pending: "muted", scheduled: "info", in_progress: "warning", completed: "success", cancelled: "destructive",
};
export const jobStatusLabel: Record<string, string> = {
  pending: "Chờ xử lý", scheduled: "Đã lên lịch", in_progress: "Đang thực hiện", completed: "Hoàn thành", cancelled: "Đã hủy",
};
export const contractStatusVariant: Record<string, Variant> = {
  active: "success", expiring: "warning", expired: "destructive", draft: "muted",
};
export const contractStatusLabel: Record<string, string> = {
  active: "Đang hiệu lực", expiring: "Sắp hết hạn", expired: "Hết hạn", draft: "Bản nháp",
};
export const leadStatusVariant: Record<string, Variant> = {
  new: "info", contacted: "primary", quoted: "warning", negotiating: "warning", won: "success", lost: "destructive",
};
export const leadStatusLabel: Record<string, string> = {
  new: "Mới", contacted: "Đã liên hệ", quoted: "Đã báo giá", negotiating: "Đang đàm phán", won: "Chốt", lost: "Mất",
};
export const elevatorStatusVariant: Record<string, Variant> = {
  operational: "success", maintenance_due: "warning", out_of_order: "destructive", under_install: "info",
};
export const elevatorStatusLabel: Record<string, string> = {
  operational: "Hoạt động", maintenance_due: "Đến hạn BT", out_of_order: "Hỏng", under_install: "Đang lắp",
};
export const priorityVariant: Record<string, Variant> = {
  low: "muted", normal: "info", high: "warning", urgent: "destructive",
};
export const priorityLabel: Record<string, string> = {
  low: "Thấp", normal: "Bình thường", high: "Cao", urgent: "Khẩn cấp",
};
