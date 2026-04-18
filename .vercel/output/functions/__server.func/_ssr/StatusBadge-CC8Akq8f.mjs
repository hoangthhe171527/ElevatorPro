import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { c as cn } from "./button-Cz8PAkJh.mjs";
const styles = {
  success: "bg-success/10 text-success border-success/20",
  warning: "bg-warning/15 text-warning-foreground border-warning/30",
  destructive: "bg-destructive/10 text-destructive border-destructive/20",
  info: "bg-info/10 text-info border-info/20",
  muted: "bg-muted text-muted-foreground border-border",
  primary: "bg-primary/10 text-primary border-primary/20"
};
function StatusBadge({ children, variant = "muted", className }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium", styles[variant], className), children });
}
const jobStatusVariant = {
  pending: "muted",
  scheduled: "info",
  in_progress: "warning",
  completed: "success",
  cancelled: "destructive"
};
const jobStatusLabel = {
  pending: "Chờ xử lý",
  scheduled: "Đã lên lịch",
  in_progress: "Đang thực hiện",
  completed: "Hoàn thành",
  cancelled: "Đã hủy"
};
const contractStatusVariant = {
  active: "success",
  expiring: "warning",
  expired: "destructive",
  draft: "muted"
};
const contractStatusLabel = {
  active: "Đang hiệu lực",
  expiring: "Sắp hết hạn",
  expired: "Hết hạn",
  draft: "Bản nháp"
};
const leadStatusVariant = {
  new: "info",
  contacted: "primary",
  quoted: "warning",
  negotiating: "warning",
  won: "success",
  lost: "destructive"
};
const leadStatusLabel = {
  new: "Mới",
  contacted: "Đã liên hệ",
  quoted: "Đã báo giá",
  negotiating: "Đang đàm phán",
  won: "Chốt",
  lost: "Mất"
};
const elevatorStatusVariant = {
  operational: "success",
  maintenance_due: "warning",
  out_of_order: "destructive",
  under_install: "info"
};
const elevatorStatusLabel = {
  operational: "Hoạt động",
  maintenance_due: "Đến hạn BT",
  out_of_order: "Hỏng",
  under_install: "Đang lắp"
};
const priorityVariant = {
  low: "muted",
  normal: "info",
  high: "warning",
  urgent: "destructive"
};
const priorityLabel = {
  low: "Thấp",
  normal: "Bình thường",
  high: "Cao",
  urgent: "Khẩn cấp"
};
export {
  StatusBadge as S,
  priorityVariant as a,
  jobStatusVariant as b,
  elevatorStatusVariant as c,
  contractStatusLabel as d,
  elevatorStatusLabel as e,
  contractStatusVariant as f,
  leadStatusVariant as g,
  jobStatusLabel as j,
  leadStatusLabel as l,
  priorityLabel as p
};
