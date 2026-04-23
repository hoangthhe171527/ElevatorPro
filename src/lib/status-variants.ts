export type StatusVariant = "success" | "warning" | "destructive" | "info" | "muted" | "primary";

// Dictionaries
export const jobStatusVariant: Record<string, StatusVariant> = {
  pending: "muted",
  scheduled: "info",
  appointment_confirmed: "primary",
  in_progress: "warning",
  completed: "success",
  manager_approved: "info",
  payment_pending: "warning",
  waiting_for_materials: "warning",
  waiting_approval: "warning",
  cancelled: "destructive",
};

export const jobStatusLabel: Record<string, string> = {
  pending: "Chờ xử lý",
  scheduled: "Đã lên lịch",
  appointment_confirmed: "Đã hẹn lịch",
  in_progress: "Đang thực hiện",
  completed: "Hoàn thành",
  manager_approved: "Chờ khách xác nhận",
  payment_pending: "Chờ thanh toán",
  waiting_for_materials: "Chờ vật tư về",
  waiting_approval: "Chờ khách duyệt",
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
  surveying: "primary",
  surveyed: "warning",
  quoted: "warning",
  signed: "success",
  lost: "destructive",
};

export const leadStatusLabel: Record<string, string> = {
  new: "Mới tạo",
  surveying: "Đang chờ khảo sát",
  surveyed: "Đã khảo sát",
  quoted: "Đã báo giá",
  signed: "Đã ký",
  lost: "Thất bại",
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

export const jobTypeLabel: Record<string, string> = {
  install: "Lắp đặt",
  maintenance: "Bảo trì",
  repair: "Sửa chữa",
  warranty: "Bảo hành",
  inspection: "Khảo sát",
};
