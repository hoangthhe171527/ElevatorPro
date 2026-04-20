export type StatusVariant = "success" | "warning" | "destructive" | "info" | "muted" | "primary";

// Dictionaries
export const jobStatusVariant: Record<string, StatusVariant> = {
  pending: "muted",
  scheduled: "info",
  in_progress: "warning",
  completed: "success",
  cancelled: "destructive",
};

export const jobStatusLabel: Record<string, string> = {
  pending: "Chờ xử lý",
  scheduled: "Đã lên lịch",
  in_progress: "Đang thực hiện",
  completed: "Hoàn thành",
  cancelled: "Đã hủy",
};

export const contractStatusVariant: Record<string, StatusVariant> = {
  active: "success",
  expiring: "warning",
  expired: "destructive",
  draft: "muted",
};

export const contractStatusLabel: Record<string, string> = {
  active: "Đang hiệu lực",
  expiring: "Sắp hết hạn",
  expired: "Hết hạn",
  draft: "Bản nháp",
};

export const leadStatusVariant: Record<string, StatusVariant> = {
  new: "info",
  contacted: "primary",
  quoted: "warning",
  negotiating: "warning",
  won: "success",
  lost: "destructive",
};

export const leadStatusLabel: Record<string, string> = {
  new: "Mới",
  contacted: "Đã liên hệ",
  quoted: "Đã báo giá",
  negotiating: "Đang đàm phán",
  won: "Chốt",
  lost: "Mất",
};

export const elevatorStatusVariant: Record<string, StatusVariant> = {
  operational: "success",
  maintenance_due: "warning",
  out_of_order: "destructive",
  under_install: "info",
};

export const elevatorStatusLabel: Record<string, string> = {
  operational: "Hoạt động",
  maintenance_due: "Đến hạn BT",
  out_of_order: "Hỏng",
  under_install: "Đang lắp",
};

export const priorityVariant: Record<string, StatusVariant> = {
  low: "muted",
  normal: "info",
  high: "warning",
  urgent: "destructive",
};

export const priorityLabel: Record<string, string> = {
  low: "Thấp",
  normal: "Bình thường",
  high: "Cao",
  urgent: "Khẩn cấp",
};
