import type { Permission } from "@/lib/mock-data";

export const ROLE_LABELS: Record<Permission, string> = {
  sales: "Sales",
  sales_admin: "Sales Admin",
  service_dispatcher: "Admin Service / Điều phối",
  accountant: "Kế toán",
  tech_manager: "Quản lý kỹ thuật Tech Manager, PM",
  tech_installation_lead: "Tổ trưởng lắp đặt/khảo sát",
  tech_maintenance_lead: "Tổ trưởng bảo trì",
  tech_survey: "Kỹ thuật khảo sát",
  tech_installation: "Kỹ thuật lắp đặt",
  tech_maintenance: "Nhân viên kỹ thuật bảo trì",
  tech_troubleshooter: "Kỹ thuật xử lý sự cố",
};

export const ADMIN_PERMISSIONS: Permission[] = [
  "sales",
  "sales_admin",
  "service_dispatcher",
  "accountant",
  "tech_manager",
];

export const TECH_MAINTENANCE_PERMISSIONS: Permission[] = [
  "tech_maintenance",
  "tech_maintenance_lead",
];

export const TECH_INSTALLATION_PERMISSIONS: Permission[] = [
  "tech_installation",
  "tech_installation_lead",
];

export const TECH_SURVEY_PERMISSIONS: Permission[] = ["tech_survey", "tech_installation_lead"];

export const TECH_PERMISSIONS: Permission[] = [
  ...TECH_MAINTENANCE_PERMISSIONS,
  ...TECH_INSTALLATION_PERMISSIONS,
  ...TECH_SURVEY_PERMISSIONS,
];
