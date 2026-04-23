// Centralised mock data for the elevator service management prototype.
// All entities are kept simple and string-id'd so they can be swapped with
// a real backend later without changing UI code.

export type Permission =
  | "sales" // Sales (Người bán hàng)
  | "sales_admin" // Sales Admin (Hỗ trợ bán hàng)
  | "tech_survey" // Kỹ thuật khảo sát
  | "tech_manager" // Quản lý kỹ thuật Tech Manager, PM
  | "tech_installation_lead" // Tổ trưởng lắp đặt
  | "tech_installation" // Kỹ thuật lắp đặt
  | "accountant" // Kế toán
  | "tech_maintenance" // Kỹ thuật bảo trì
  | "tech_maintenance_lead" // Tổ trưởng bảo trì
  | "service_dispatcher" // Admin Service / Điều phối
  | "tech_troubleshooter"; // Kỹ thuật xử lý sự cố

export type LeadType = "install" | "maintenance";

export type LeadStatus =
  | "new" // Mới tạo
  | "surveying" // Đang chờ khảo sát
  | "surveyed" // Đã khảo sát (Chưa báo giá)
  | "quoted" // Đã báo giá (Chờ phản hồi)
  | "signed" // Đã ký hợp đồng
  | "lost"; // Thất bại

export interface Lead {
  id: string;
  tenantId: string;
  name: string;
  type: LeadType;
  phone: string;
  address: string;
  email?: string;
  source: string;
  estimatedValue: number;
  status: LeadStatus;
  note?: string;
  createdAt: string;
  assignedTo?: string;
  nextFollowUp?: string;
  quoteFileUrl?: string;
  contractFileUrl?: string;
  customerId?: string;
}

const _mockLeads_t2: Lead[] = [
  {
    id: "lead-1",
    tenantId: "t-2",
    name: "Khách sạn Sài Gòn Central",
    type: "install",
    phone: "0901234567",
    address: "123 Lê Lợi, Quận 1, TP.HCM",
    source: "Hotline",
    estimatedValue: 1200000000,
    status: "new",
    note: "Dự án khách sạn 4 sao, cần 2 thang máy tải khách 1000kg. Khách yêu cầu cabin trang trí gỗ và gương vàng.",
    createdAt: "2024-04-10T10:00:00Z",
  },
  {
    id: "lead-2",
    tenantId: "t-2",
    name: "Biệt thự Linh Đàm",
    type: "install",
    phone: "0912345678",
    address: "Bán đảo Linh Đàm, Hoàng Mai, Hà Nội",
    source: "Facebook Ads",
    estimatedValue: 450000000,
    status: "surveying",
    note: "Kỹ thuật Dũng đang trên đường tới khảo sát hố thang. Chủ nhà yêu cầu thang máy kính quan sát hướng hồ.",
    createdAt: "2024-04-12T14:30:00Z",
  },
  {
    id: "lead-3",
    tenantId: "t-2",
    name: "Tòa nhà 88 Láng Hạ",
    type: "install",
    phone: "0988776655",
    address: "88 Láng Hạ, Đống Đa, Hà Nội",
    source: "Website",
    estimatedValue: 850000000,
    status: "surveyed",
    note: "Đã có thông số khảo sát chi tiết (Pit 1.4m, OH 4.0m). Hố thang hơi nghiêng, cần CEO xử lý phương án ray đặc biệt.",
    createdAt: "2024-04-05T09:15:00Z",
  },
  {
    id: "lead-4",
    tenantId: "t-2",
    name: "Villa Ciputra - Khu K",
    type: "install",
    phone: "0977665544",
    address: "Khu đô thị Ciputra, Tây Hồ, Hà Nội",
    source: "Giới thiệu",
    estimatedValue: 650000000,
    status: "quoted",
    quoteFileUrl: "https://example.com/quote-ciputra.pdf",
    note: "Đã gửi báo giá 650tr (thang Fuji nhập khẩu). Khách đang xin thêm chiết khấu 5% cho gói bảo hành 2 năm.",
    createdAt: "2024-04-01T11:20:00Z",
  },
  {
    id: "lead-5",
    tenantId: "t-2",
    name: "Penhouse West Lake",
    type: "install",
    phone: "0966554433",
    address: "Lạc Long Quân, Tây Hồ, Hà Nội",
    source: "Hotline",
    estimatedValue: 700000000,
    status: "signed",
    quoteFileUrl: "https://example.com/quote-westlake.pdf",
    contractFileUrl: "https://example.com/contract-westlake.pdf",
    note: "HĐ đã ký. Khách đã thanh toán đợt 1 (30%). Chờ Kế toán và CEO kích hoạt dự án thi công.",
    createdAt: "2024-03-25T15:00:00Z",
  },
  {
    id: "lead-6",
    tenantId: "t-2",
    name: "Chung cư mini Bà Triệu",
    type: "maintenance",
    phone: "0909112233",
    address: "120 Bà Triệu, Hoàn Kiếm, Hà Nội",
    source: "Website",
    estimatedValue: 45000000,
    status: "new",
    note: "Nhu cầu bảo trì cho 2 thang máy gia đình. Khách ưu tiên gói bảo trì trọn gói có kèm vật tư tiêu hao.",
    createdAt: "2024-04-14T08:00:00Z",
  },
  {
    id: "lead-7",
    tenantId: "t-2",
    name: "Văn phòng Hạng A - Duy Tân",
    type: "maintenance",
    phone: "0911002299",
    address: "Số 5 Duy Tân, Cầu Giấy, Hà Nội",
    source: "Facebook Ads",
    estimatedValue: 120000000,
    status: "quoted",
    note: "Đã gửi báo giá bảo trì 120tr/năm. Đang cạnh tranh về thời gian phản hồi sự cố (cam kết < 30p).",
    createdAt: "2024-04-10T11:00:00Z",
  },
  {
    id: "lead-8",
    tenantId: "t-2",
    name: "Dự án Shophouse Vinhomes",
    type: "install",
    phone: "0933445566",
    address: "Vinhomes Grand Park, Quận 9, TP.HCM",
    source: "Website",
    estimatedValue: 500000000,
    status: "lost",
    note: "Khách chốt với bên khác do họ có sẵn hàng trong kho, giao ngay được trong 15 ngày.",
    createdAt: "2024-03-20T10:00:00Z",
  },
];

export type ContractStatus = "active" | "expiring" | "expired" | "draft";
export type ContractType = "install" | "maintenance" | "repair";
export type JobStatus =
  | "pending"
  | "scheduled"
  | "appointment_confirmed"
  | "in_progress"
  | "manager_approved"
  | "payment_pending"
  | "waiting_for_materials"
  | "completed"
  | "cancelled";
export type JobType = "install" | "maintenance" | "repair" | "warranty" | "inspection" | "incident";
export type JobPriority = "low" | "normal" | "high" | "urgent";
export type ElevatorStatus = "operational" | "maintenance_due" | "out_of_order" | "under_install";

export interface Tenant {
  id: string;
  name: string;
  domain?: string;
}

export interface TenantMembership {
  tenantId: string;
  permissions: Permission[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  memberships: TenantMembership[];
  avatar?: string;
}

export interface Customer {
  tenantId: string;
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  type: "individual" | "business";
  elevatorCount: number;
  createdAt: string;
  lat: number;
  lng: number;
  referralPoints?: number;
  referredById?: string;
  convertedFromLeadId?: string;
  customerType: "buying" | "service_only";
}

export type InvoiceStatus = "draft" | "sent" | "partially_paid" | "paid" | "overdue" | "cancelled";

export interface Invoice {
  tenantId: string;
  id: string;
  code: string;
  customerId: string;
  targetType: "project" | "contract";
  targetId: string;
  amount: number;
  dueDate: string;
  status: InvoiceStatus;
  description: string;
  createdAt: string;
}

// New model: Project (Công trình)
export type ProjectStage =
  | "lead" // GĐ1: Lead + Khảo sát ban đầu
  | "contract" // GĐ2: Báo giá + Hợp đồng ký
  | "waiting_for_equipment" // GĐ3: Chờ thiết bị về công trình
  | "installation" // GĐ4: Lắp đặt theo 8 giai đoạn
  | "completion" // GĐ5: Nghiệm thu hoàn thành
  | "transition"; // GĐ6: Chuyển sang bảo hành

export type RequestType =
  | "material"
  | "budget"
  | "project_advance"
  | "completion"
  | "lead_quote"
  | "contract_approval";
export type RequestStatus = "pending" | "approved" | "rejected";

export interface ApprovalRequest {
  tenantId: string;
  id: string;
  type: RequestType;
  title: string;
  description: string;
  requestedBy: string; // User ID
  requestedAt: string;
  status: RequestStatus;
  urgency: "normal" | "high" | "critical";
  amount?: number; // Optional money
  targetId?: string; // ID of the related Project/Job/Contract
}

export const PROJECT_STAGES: ProjectStage[] = [
  "lead",
  "contract",
  "waiting_for_equipment",
  "installation",
  "completion",
  "transition",
];

export const PROJECT_STAGE_LABELS: Record<ProjectStage, string> = {
  lead: "Lead & Khảo sát",
  contract: "Báo giá & Hợp đồng",
  waiting_for_equipment: "Chờ thiết bị",
  installation: "Lắp đặt",
  completion: "Nghiệm thu",
  transition: "Chuyển bảo hành",
};

// Workflow Gate Configuration
export interface WorkflowGate {
  approvers: Permission[];
  label: string;
  isFlexible?: boolean; // If true, can bypass request/approve cycle for t-2
}

export const STRATEGIC_WORKFLOW: Record<string, Record<ProjectStage, WorkflowGate>> = {
  "t-2": {
    // SMALL COMPANY (Simplified - Flexible)
    lead: {
      approvers: ["tech_manager", "sales_admin"],
      label: "CEO/Sales Admin mở Lead và phát lệnh khảo sát",
      isFlexible: true,
    },
    contract: { approvers: ["tech_manager"], label: "CEO tải báo giá + hợp đồng đã ký", isFlexible: true },
    waiting_for_equipment: {
      approvers: ["tech_manager"],
      label: "CEO xác nhận thiết bị đã về công trình",
      isFlexible: true,
    },
    installation: {
      approvers: ["tech_installation", "tech_manager"],
      label: "Kỹ thuật thi công, CEO giám sát tiến độ",
      isFlexible: true,
    },
    completion: {
      approvers: ["tech_manager"],
      label: "CEO xác nhận hoàn tất và chốt bàn giao",
      isFlexible: true,
    },
    transition: {
      approvers: ["tech_manager", "tech_maintenance"],
      label: "Chuyển sang bảo hành cho đội bảo trì",
      isFlexible: true,
    },
  },
};

export interface StageTask {
  id: string;
  label: string;
  requiredRole: Permission | Permission[];
}

export const INSTALL_STAGES_TEMPLATE = [
  { id: "step-1", label: "Giai đoạn 1: Thả chì (Plumbing)", order: 1 },
  { id: "step-2", label: "Giai đoạn 2: Lắp ray (Rails)", order: 2 },
  { id: "step-3", label: "Giai đoạn 3: Máy kéo – thả cáp (Machine & Ropes)", order: 3 },
  { id: "step-4", label: "Giai đoạn 4: Lắp cửa tầng (Floor Doors)", order: 4 },
  { id: "step-5", label: "Giai đoạn 5: Lắp cabin (Cabin)", order: 5 },
  { id: "step-6", label: "Giai đoạn 6: Điện và hiệu chỉnh (Electrical)", order: 6 },
  { id: "step-7", label: "Giai đoạn 7: Kiểm định (Inspection)", order: 7 },
  { id: "step-8", label: "Giai đoạn 8: Bàn giao (Handover)", order: 8 },
];

export const MAINTENANCE_STEPS_TEMPLATE: MaintenanceStep[] = [
  {
    id: "m-step-1",
    label: "Kiểm tra sơ bộ",
    description: "Kiểm tra tổng quát vận hành, tiếng động lạ, rung lắc.",
    result: "pending",
    resolved: false,
  },
  {
    id: "m-step-2",
    label: "Kiểm tra phòng máy",
    description: "Kiểm tra động cơ, tủ điều khiển, phanh và cáp tải.",
    result: "pending",
    resolved: false,
  },
  {
    id: "m-step-3",
    label: "Kiểm tra Cabin",
    description: "Bảng điều khiển, nút bấm, đèn chiếu sáng, quạt thông gió.",
    result: "pending",
    resolved: false,
  },
  {
    id: "m-step-4",
    label: "An toàn & Vệ sinh",
    description: "Cảm biến cửa, cứu hộ tự động, vệ sinh rãnh dẫn hướng.",
    result: "pending",
    resolved: false,
  },
];

export const STAGE_SUB_TASKS: Record<ProjectStage, StageTask[]> = {
  lead: [
    {
      id: "lead_create",
      label: "CEO hoặc Sales Admin tạo Lead và nhập thông tin khách hàng",
      requiredRole: ["tech_manager", "sales_admin"],
    },
    {
      id: "survey_job_create",
      label: "CEO hoặc Sales Admin tạo công việc khảo sát",
      requiredRole: ["tech_manager", "sales_admin"],
    },
    {
      id: "survey_schedule_confirm",
      label: "Kỹ thuật liên hệ khách và xác nhận lịch khảo sát",
      requiredRole: ["tech_survey", "tech_installation_lead"],
    },
    {
      id: "survey_done_report",
      label: "Kỹ thuật khảo sát thực tế, hoàn thành job và gửi báo cáo",
      requiredRole: ["tech_survey", "tech_installation_lead"],
    },
  ],
  contract: [
    {
      id: "quote_upload",
      label: "CEO tạo báo giá ngoài hệ thống và upload file báo giá",
      requiredRole: "tech_manager",
    },
    { id: "contract_upload", label: "CEO tạo và upload hợp đồng đã ký", requiredRole: "tech_manager" },
    {
      id: "contract_confirm",
      label: "CEO xác nhận hợp đồng để hệ thống tự tạo project lắp đặt",
      requiredRole: "tech_manager",
    },
  ],
  waiting_for_equipment: [
    {
      id: "eq_arrival_confirm",
      label: "CEO xác nhận thiết bị về công trình để kích hoạt việc lắp đặt",
      requiredRole: "tech_manager",
    },
  ],
  installation: [
    {
      id: "work_assignment",
      label: "CEO phân công/kích hoạt các giai đoạn công việc",
      requiredRole: "tech_manager",
    },
    {
      id: "field_installation",
      label: "Kỹ thuật lắp đặt thực hiện từng giai đoạn",
      requiredRole: "tech_installation",
    },
    {
      id: "progress_update",
      label: "Kỹ thuật chụp ảnh hiện trường và cập nhật tiến độ",
      requiredRole: "tech_installation",
    },
  ],
  completion: [
    {
      id: "installation_done",
      label: "Kỹ thuật xác nhận đã hoàn tất toàn bộ các giai đoạn lắp đặt",
      requiredRole: "tech_installation",
    },
    {
      id: "ceo_acceptance",
      label: "CEO xác nhận hoàn thành để chuyển sang bảo hành",
      requiredRole: "tech_manager",
    },
  ],
  transition: [
    {
      id: "handover_maintenance",
      label: "Bàn giao hồ sơ cho đội kỹ thuật bảo trì",
      requiredRole: "tech_maintenance",
    },
    {
      id: "warranty_start",
      label: "CEO xác nhận khởi động giai đoạn bảo hành",
      requiredRole: "tech_manager",
    },
  ],
};

export interface Project {
  tenantId: string;
  id: string;
  name: string;
  address: string;
  customerId: string;
  startDate: string;
  endDate?: string;
  status: "planning" | "in_progress" | "completed";
  stage: ProjectStage;
  contractId?: string;
}

const _mockProjects: Omit<Project, "tenantId">[] = [
  {
    id: "p-sample",
    name: "Dự án Lắp đặt - Nhà Phố Anh Hoàng",
    address: "Khu đô thị Sala, Quận 2, TP.HCM",
    customerId: "c-11",
    startDate: "2026-04-09",
    status: "in_progress",
    stage: "installation",
    contractId: "ct-sample-sala",
  },
  {
    id: "p-new-1",
    name: "Lắp đặt Thang máy Biệt thự Gamuda",
    address: "Trần Phú, Hoàng Mai, Hà Nội",
    customerId: "c-11",
    startDate: "2026-03-20",
    status: "in_progress",
    stage: "installation",
  },
  {
    id: "p-new-2",
    name: "Dự án Shophouse Sun Group",
    address: "Bãi Cháy, Hạ Long",
    customerId: "c-8",
    startDate: "2026-04-01",
    status: "in_progress",
    stage: "installation",
  },
  {
    id: "p-1",
    name: "Vinhomes Ocean Park - GĐ1",
    address: "Gia Lâm, Hà Nội",
    customerId: "c-1",
    startDate: "2022-01-01",
    status: "completed",
    stage: "transition",
  },
  {
    id: "p-2",
    name: "Sunshine Tower Project",
    address: "16 Phạm Hùng, Cầu Giấy",
    customerId: "c-2",
    startDate: "2023-05-10",
    status: "completed",
    stage: "transition",
  },
  {
    id: "p-3",
    name: "Mường Thanh Grand",
    address: "Hà Đông, Hà Nội",
    customerId: "c-3",
    startDate: "2023-06-15",
    status: "completed",
    stage: "transition",
  },
];

export interface PaymentMilestone {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  status: "pending" | "paid" | "overdue";
  paidDate?: string;
}

export interface Contract {
  tenantId: string;
  id: string;
  code: string;
  customerId: string;
  projectId?: string; // optional link to Project
  elevatorId?: string; // optional link to Elevator
  phase?: LifecyclePhase; // lifecycle phase for multi‑stage contracts
  type: ContractType;
  value: number;
  paid: number;
  startDate: string;
  endDate: string;
  status: ContractStatus;
  items: string[];
  signedAt: string;
  milestones: PaymentMilestone[];
  contractFileUrl?: string;
  paymentStages: {
    stage1Paid: number; // Tạm ứng ký HĐ
    stage2Paid: number; // Thiết bị về công trình
    stage3Paid: number; // Quyết toán handover
  };
  accountantVerified: boolean;
  ceoVerified: boolean;
  totalMaintenanceValue?: number; // Accumulated maintenance service value
  totalMaterialCost?: number; // Accumulated cost of replaced parts
}

export type LifecyclePhase =
  | "sales"
  | "contract_signed"
  | "tech_survey"
  | "procurement"
  | "delivery"
  | "mechanic_install"
  | "electric_install"
  | "safety_inspection"
  | "handover"
  | "maintenance";

export interface Elevator {
  tenantId: string;
  id: string;
  code: string;
  projectId: string; // reference to Project
  contractId?: string;
  building: string;
  address: string;
  brand: string;
  model: string;
  floors: number;
  installedAt: string;
  warrantyUntil: string;
  lastMaintenance: string;
  nextMaintenance: string;
  status: ElevatorStatus;
  lifecyclePhase: LifecyclePhase;
}

export interface MaintenanceStep {
  id: string;
  label: string;
  description?: string;
  result: "ok" | "repair" | "replace" | "pending";
  photo?: string;
  resolved: boolean;
}

export interface Job {
  tenantId: string;
  id: string;
  code: string;
  type: JobType;
  title: string;
  description: string;
  customerId: string;
  elevatorId?: string;
  projectId?: string;
  contractId?: string;
  leadId?: string;
  assignedTo: string;
  priority: JobPriority;
  status: JobStatus;
  scheduledFor: string;
  completedAt?: string;
  beforePhotos: string[];
  afterPhotos: string[];
  report?: string;
  surveyReport?: {
    pitDepth?: string;
    overheadHeight?: string;
    shaftDimensions?: string;
    powerSupply?: string;
    specialNotes?: string;
  };
  appointmentConfirmed?: boolean;
  isManagerApproved?: boolean;
  hasIssues?: boolean;
  cost?: number;
  maintenanceSteps?: MaintenanceStep[];
  partsUsed?: {
    partId: string;
    quantity: number;
    priceAtPoint: number;
    status: "in_stock" | "out_of_stock";
  }[];
  isHotline?: boolean;
  customerConfirmed?: boolean;
  repairQuote?: {
    items: {
      id: string;
      name: string;
      price: number;
      quantity: number;
    }[];
    total: number;
    isApproved: boolean;
  };
  createdAt: string;
}

export interface InventoryItem {
  tenantId: string;
  id: string;
  code: string;
  name: string;
  category: string;
  unit: string;
  stock: number;
  reserved: number;
  reorderLevel: number;
  unitPrice: number;
  location: string;
}

export interface IssueReport {
  tenantId: string;
  id: string;
  elevatorId: string;
  customerId: string;
  description: string;
  reportedAt: string;
  status: "open" | "scheduled" | "resolved";
  jobId?: string;
}

// ---------- USERS ----------
// ---------- TENANTS ----------
export const mockTenants: Tenant[] = [{ id: "t-2", name: "CÔNG TY NHỎ (Kiêm nhiệm)" }];

// ---------- USERS ----------
export const mockUsers: User[] = [
  // --- T-2: CÔNG TY NHỎ (Một người ôm nhiều việc) ---
  {
    id: "u-director-2",
    name: "Lâm CEO",
    email: "boss@smallco.vn",
    phone: "0902 111 111",
    memberships: [
      {
        tenantId: "t-2",
        permissions: ["tech_manager"],
      },
    ],
  },
  {
    id: "u-sales-admin-2",
    name: "Trang Sales Admin",
    email: "sales-admin@smallco.vn",
    phone: "0902 119 119",
    memberships: [{ tenantId: "t-2", permissions: ["sales_admin"] }],
  },
  {
    id: "u-sales-2",
    name: "Nam Sales",
    email: "sales@smallco.vn",
    phone: "0902 117 117",
    memberships: [{ tenantId: "t-2", permissions: ["sales"] }],
  },
  {
    id: "u-pm-2",
    name: "Huy PM",
    email: "pm@smallco.vn",
    phone: "0902 116 116",
    memberships: [{ tenantId: "t-2", permissions: ["tech_manager"] }],
  },
  {
    id: "u-tech-manager-2",
    name: "Quang Trưởng bộ phận kỹ thuật",
    email: "tech-manager@smallco.vn",
    phone: "0902 223 223",
    memberships: [{ tenantId: "t-2", permissions: ["tech_manager"] }],
  },
  {
    id: "u-service-dispatch-2",
    name: "Hà Admin Service / Điều phối",
    email: "service-dispatch@smallco.vn",
    phone: "0902 115 115",
    memberships: [{ tenantId: "t-2", permissions: ["service_dispatcher"] }],
  },
  {
    id: "u-intake-2",
    name: "Minh Điều phối nhập liệu",
    email: "intake@smallco.vn",
    phone: "0902 118 118",
    memberships: [{ tenantId: "t-2", permissions: ["service_dispatcher"] }],
  },
  {
    id: "u-tech-maint-lead-2",
    name: "Long Tổ trưởng bảo trì",
    email: "tech-maint-lead@smallco.vn",
    phone: "0902 225 225",
    memberships: [{ tenantId: "t-2", permissions: ["tech_maintenance_lead"] }],
  },
  {
    id: "u-tech-maint-2",
    name: "Hoàng Kỹ thuật bảo trì",
    email: "tech-maint@smallco.vn",
    phone: "0902 222 222",
    memberships: [{ tenantId: "t-2", permissions: ["tech_maintenance"] }],
  },
  {
    id: "u-tech-install-lead-2",
    name: "Tuấn Tổ trưởng lắp đặt/khảo sát",
    email: "tech-install-lead@smallco.vn",
    phone: "0902 226 226",
    memberships: [{ tenantId: "t-2", permissions: ["tech_installation_lead"] }],
  },
  {
    id: "u-tech-survey-2",
    name: "Phúc Kỹ thuật khảo sát",
    email: "tech-survey@smallco.vn",
    phone: "0902 227 227",
    memberships: [{ tenantId: "t-2", permissions: ["tech_survey"] }],
  },
  {
    id: "u-tech-install-2",
    name: "Dũng Kỹ thuật lắp đặt",
    email: "tech-install@smallco.vn",
    phone: "0902 224 224",
    memberships: [{ tenantId: "t-2", permissions: ["tech_installation"] }],
  },
  {
    id: "u-accounting-2",
    name: "Chị Lan Kế Toán kiêm HC",
    email: "lan@smallco.vn",
    phone: "0902 333 333",
    memberships: [{ tenantId: "t-2", permissions: ["accountant"] }],
  },

  // --- Khách hàng đã bỏ ---
];

// ---------- CUSTOMERS ----------
const _mockCustomers: Omit<Customer, "tenantId">[] = [
  {
    id: "c-1",
    name: "Vinhomes Ocean Park",
    contactPerson: "Phạm Thị Hoa",
    phone: "0987 654 321",
    email: "hoa.pham@vinhome.vn",
    address: "Đa Tốn, Gia Lâm, Hà Nội",
    type: "business",
    elevatorCount: 4,
    createdAt: "2024-03-15",
    lat: 20.9796,
    lng: 105.9419,
    customerType: "buying",
  },
  {
    id: "c-2",
    name: "Tòa nhà Sunshine Tower",
    contactPerson: "Trần Đình Bảo",
    phone: "0911 223 344",
    email: "bao.td@sunshine.vn",
    address: "16 Phạm Hùng, Nam Từ Liêm, Hà Nội",
    type: "business",
    elevatorCount: 6,
    createdAt: "2023-11-02",
    lat: 21.015,
    lng: 105.7818,
    customerType: "buying",
  },
  {
    id: "c-3",
    name: "Khách sạn Mường Thanh",
    contactPerson: "Lý Hoàng Nam",
    phone: "0934 556 677",
    email: "nam.ly@muongthanh.vn",
    address: "78 Trần Phú, Hà Đông, Hà Nội",
    type: "business",
    elevatorCount: 3,
    createdAt: "2024-06-20",
    lat: 20.9712,
    lng: 105.7762,
    customerType: "service_only",
  },
  {
    id: "c-4",
    name: "Anh Nguyễn Văn An",
    contactPerson: "Nguyễn Văn An",
    phone: "0966 778 899",
    email: "an.nv@gmail.com",
    address: "Số 12, ngõ 45 Đào Tấn, Ba Đình",
    type: "individual",
    elevatorCount: 1,
    createdAt: "2025-01-10",
    lat: 21.0356,
    lng: 105.8118,
    customerType: "buying",
  },
  {
    id: "c-5",
    name: "Cao ốc Diamond Plaza",
    contactPerson: "Đỗ Minh Quân",
    phone: "0922 334 455",
    email: "quan.dm@diamond.vn",
    address: "25 Lê Duẩn, Hoàn Kiếm, Hà Nội",
    type: "business",
    elevatorCount: 5,
    createdAt: "2023-08-14",
    lat: 21.0245,
    lng: 105.8412,
    customerType: "service_only",
  },
  {
    id: "c-6",
    name: "Chung cư Times City",
    contactPerson: "Hoàng Thị Lan",
    phone: "0944 556 677",
    email: "lan.ht@timescity.vn",
    address: "458 Minh Khai, Hai Bà Trưng, Hà Nội",
    type: "business",
    elevatorCount: 8,
    createdAt: "2024-09-05",
    lat: 20.9961,
    lng: 105.8676,
    customerType: "service_only",
  },
  {
    id: "c-7",
    name: "Anh Trần Quang Dũng",
    contactPerson: "Trần Quang Dũng",
    phone: "0977 889 900",
    email: "dung.tq@gmail.com",
    address: "234 Cầu Giấy, Hà Nội",
    type: "individual",
    elevatorCount: 1,
    createdAt: "2025-02-20",
    lat: 21.0345,
    lng: 105.7905,
    customerType: "buying",
  },
  {
    id: "c-8",
    name: "Bệnh viện Hồng Ngọc",
    contactPerson: "BS. Lê Thị Mai",
    phone: "0988 776 655",
    email: "mai.lt@hongngoc.vn",
    address: "55 Yên Ninh, Ba Đình, Hà Nội",
    type: "business",
    elevatorCount: 4,
    createdAt: "2024-04-18",
    lat: 21.0438,
    lng: 105.8425,
    customerType: "service_only",
  },
  {
    id: "c-9",
    name: "Trường ĐH Bách Khoa",
    contactPerson: "PGS. Nguyễn Văn Thành",
    phone: "0902 113 224",
    email: "thanh.nv@hust.edu.vn",
    address: "1 Đại Cồ Việt, Hai Bà Trưng",
    type: "business",
    elevatorCount: 7,
    createdAt: "2023-05-12",
    lat: 21.005,
    lng: 105.843,
    customerType: "service_only",
  },
  {
    id: "c-10",
    name: "Tòa nhà Lotte Center",
    contactPerson: "Kim Min Soo",
    phone: "0933 445 566",
    email: "kim.ms@lotte.vn",
    address: "54 Liễu Giai, Ba Đình, Hà Nội",
    type: "business",
    elevatorCount: 12,
    createdAt: "2022-12-01",
    lat: 21.0335,
    lng: 105.8118,
    customerType: "service_only",
  },
  {
    id: "c-11",
    name: "Chị Đặng Thu Hương",
    contactPerson: "Đặng Thu Hương",
    phone: "0908 776 554",
    email: "huong.dt@gmail.com",
    address: "78 Trần Duy Hưng, Cầu Giấy",
    type: "individual",
    elevatorCount: 1,
    createdAt: "2025-03-08",
    lat: 21.0145,
    lng: 105.7985,
    customerType: "buying",
  },
  {
    id: "c-12",
    name: "Khu đô thị Ecopark",
    contactPerson: "Vũ Đình Tâm",
    phone: "0917 226 338",
    email: "tam.vd@ecopark.vn",
    address: "Văn Giang, Hưng Yên",
    type: "business",
    elevatorCount: 9,
    createdAt: "2024-07-22",
    lat: 20.965,
    lng: 105.943,
    customerType: "service_only",
  },
  {
    id: "c-custom-1",
    name: "Chung cư HPC Landmark",
    contactPerson: "Lê Anh Tuấn",
    phone: "0904 123 456",
    email: "tuan.le@hpc.vn",
    address: "Tố Hữu, Hà Đông, Hà Nội",
    type: "business",
    elevatorCount: 12,
    createdAt: "2024-01-10",
    lat: 20.9712,
    lng: 105.7533,
    customerType: "service_only",
  },
  {
    id: "c-custom-2",
    name: "Tòa nhà Keangnam",
    contactPerson: "Park Sang Hoon",
    phone: "0912 998 877",
    email: "park.sh@keangnam.vn",
    address: "Phạm Hùng, Nam Từ Liêm, Hà Nội",
    type: "business",
    elevatorCount: 48,
    createdAt: "2023-05-20",
    lat: 21.0173,
    lng: 105.784,
    customerType: "service_only",
  },
  {
    id: "c-custom-3",
    name: "Aeon Mall Long Biên",
    contactPerson: "Nguyễn Minh Đức",
    phone: "0989 555 666",
    email: "duc.nm@aeon.vn",
    address: "Cổ Linh, Long Biên, Hà Nội",
    type: "business",
    elevatorCount: 15,
    createdAt: "2024-02-15",
    lat: 21.0263,
    lng: 105.8975,
    customerType: "buying",
    referralPoints: 100,
  },
];

export const mockInvoices: Invoice[] = [
  {
    tenantId: "t-2",
    id: "inv-2",
    code: "INV-2026-0002",
    customerId: "c-1",
    targetType: "project",
    targetId: "p-sample",
    amount: 304000000, // 80% of 380M
    dueDate: "2026-04-15",
    status: "paid",
    description: "Thanh toán đợt 1 - Nhà Phố Anh Hoàng",
    createdAt: "2026-04-09",
  },
];

// ---------- LEADS ----------
const _mockLeads: Omit<Lead, "tenantId">[] = [
  {
    id: "l-demo-1",
    name: "Biệt thự Harmony (Chị Thảo)",
    type: "install",
    phone: "0912 888 999",
    email: "thao.harmony@gmail.com",
    source: "Website",
    address: "Bằng Lăng 3, Vinhomes Harmony",
    note: "Khách cần lắp thang máy gia đình kính 450kg",
    status: "new",
    assignedTo: "u-sales-2",
    estimatedValue: 480000000,
    nextFollowUp: "2026-04-24",
    createdAt: "2026-04-22",
  },
  {
    id: "l-demo-2",
    name: "Shophouse Sala (Anh Minh)",
    type: "install",
    phone: "0909 777 666",
    email: "minh.sala@sunshine.vn",
    source: "Giới thiệu",
    address: "B2-01 Saritown, KĐT Sala, Quận 2",
    note: "Đã khảo sát hiện trạng hố thang, cần báo giá gấp",
    status: "surveyed",
    assignedTo: "u-sales-admin-2",
    estimatedValue: 650000000,
    nextFollowUp: "2026-04-23",
    createdAt: "2026-04-20",
  },
  {
    id: "l-demo-3",
    name: "Penthouse Sky City (Chị Hằng)",
    type: "install",
    phone: "0988 555 444",
    email: "hang.sky@vantage.vn",
    source: "Facebook Ads",
    address: "88 Láng Hạ, Đống Đa, Hà Nội",
    note: "Đã gửi báo giá, khách đang cân nhắc ký HĐ trong tuần",
    status: "quoted",
    assignedTo: "u-sales-2",
    estimatedValue: 1200000000,
    nextFollowUp: "2026-04-24",
    createdAt: "2026-04-18",
    quoteFileUrl: "https://example.com/quote-demo3.pdf",
  },
  {
    id: "l-1",
    name: "Tòa nhà Goldmark City",
    type: "install",
    phone: "0901 111 222",
    email: "info@goldmark.vn",
    source: "Giới thiệu",
    address: "136 Hồ Tùng Mậu, Bắc Từ Liêm",
    note: "Cần lắp 4 thang máy mới cho block C",
    status: "surveyed",
    assignedTo: "u-sales-admin-2",
    estimatedValue: 2400000000,
    nextFollowUp: "2026-04-25",
    createdAt: "2026-03-12",
    quoteFileUrl: "https://example.com/quote-l1.pdf",
  },
  {
    id: "l-2",
    name: "Văn phòng Capital Tower",
    type: "maintenance",
    phone: "0922 333 444",
    email: "lan.nguyen@capital.vn",
    source: "Website",
    address: "109 Trần Hưng Đạo, Hoàn Kiếm",
    note: "Quan tâm dịch vụ bảo trì 6 thang",
    status: "quoted",
    assignedTo: "u-sales-2",
    estimatedValue: 540000000,
    nextFollowUp: "2026-04-22",
    createdAt: "2026-03-28",
  },
  {
    id: "l-3",
    name: "Anh Hoàng - nhà phố",
    type: "install",
    phone: "0966 222 111",
    email: "",
    source: "Facebook Ads",
    address: "Mỹ Đình, Nam Từ Liêm",
    note: "Lắp 1 thang gia đình 5 tầng",
    status: "surveying",
    assignedTo: "u-sales-admin-2",
    estimatedValue: 380000000,
    nextFollowUp: "2026-04-20",
    createdAt: "2026-04-05",
  },
  {
    id: "l-4",
    name: "Bệnh viện An Việt",
    type: "install",
    phone: "0944 222 333",
    email: "lh@anviet.vn",
    source: "Khách cũ giới thiệu",
    address: "1E Trường Chinh, Thanh Xuân",
    note: "Cải tạo 3 thang cũ",
    status: "new",
    assignedTo: "u-sales-2",
    estimatedValue: 720000000,
    nextFollowUp: "2026-04-19",
    createdAt: "2026-04-15",
  },
  {
    id: "l-5",
    name: "Khách sạn Hanoi Pearl",
    type: "maintenance",
    phone: "0988 444 555",
    email: "info@hanoipearl.vn",
    source: "Cold call",
    address: "6 Bảo Khánh, Hoàn Kiếm",
    note: "Cần báo giá bảo trì",
    status: "signed",
    assignedTo: "u-sales-admin-2",
    estimatedValue: 180000000,
    nextFollowUp: "2026-04-30",
    createdAt: "2026-02-20",
  },
  {
    id: "l-6",
    name: "Văn phòng MB Bank chi nhánh",
    type: "install",
    phone: "0977 555 666",
    email: "",
    source: "Triển lãm",
    address: "21 Cát Linh, Đống Đa",
    note: "Đang khảo sát",
    status: "lost",
    assignedTo: "u-sales-2",
    estimatedValue: 290000000,
    nextFollowUp: "",
    createdAt: "2026-01-15",
  },
  {
    id: "l-7",
    name: "Chung cư Mipec Riverside",
    type: "maintenance",
    phone: "0913 666 777",
    email: "bql@mipec.vn",
    source: "Giới thiệu",
    address: "Long Biên, Hà Nội",
    note: "Bảo trì 6 thang",
    status: "surveyed",
    assignedTo: "u-sales-admin-2",
    estimatedValue: 432000000,
    nextFollowUp: "2026-04-23",
    createdAt: "2026-03-30",
  },
  {
    id: "l-8",
    name: "Resort FLC Sầm Sơn",
    type: "install",
    phone: "0902 777 888",
    email: "kt@flc.vn",
    source: "Website",
    address: "Sầm Sơn, Thanh Hóa",
    note: "Lắp mới 8 thang",
    status: "quoted",
    assignedTo: "u-sales-2",
    estimatedValue: 5600000000,
    nextFollowUp: "2026-04-28",
    createdAt: "2026-02-10",
  },
  {
    id: "l-9",
    name: "Anh Vinh - biệt thự",
    type: "install",
    phone: "0934 888 999",
    email: "",
    source: "Facebook Ads",
    address: "Vinhomes Riverside, Long Biên",
    note: "Thang gia đình 4 tầng",
    status: "surveying",
    assignedTo: "u-sales-admin-2",
    estimatedValue: 320000000,
    nextFollowUp: "2026-04-21",
    createdAt: "2026-04-08",
  },
  {
    id: "l-10",
    name: "Trường Quốc tế UNIS",
    type: "maintenance",
    phone: "0945 999 000",
    email: "facility@unishanoi.org",
    source: "Khách cũ giới thiệu",
    address: "Tây Hồ, Hà Nội",
    note: "Cải tạo + bảo trì",
    status: "new",
    assignedTo: "u-sales-2",
    estimatedValue: 980000000,
    nextFollowUp: "2026-04-24",
    createdAt: "2026-04-14",
  },
  {
    id: "l-11",
    name: "Showroom Mercedes",
    type: "install",
    phone: "0918 000 111",
    email: "",
    source: "Cold call",
    address: "Phạm Hùng, Cầu Giấy",
    note: "1 thang chở hàng",
    status: "new",
    assignedTo: "u-sales-admin-2",
    estimatedValue: 450000000,
    nextFollowUp: "2026-04-26",
    createdAt: "2026-04-16",
  },
  {
    id: "l-12",
    name: "Khu nhà ở xã hội ECO",
    type: "install",
    phone: "0967 111 222",
    email: "ql@ecoxa.vn",
    source: "Triển lãm",
    address: "Hoài Đức, Hà Nội",
    note: "12 thang block A,B,C",
    status: "quoted",
    assignedTo: "u-sales-2",
    estimatedValue: 7200000000,
    nextFollowUp: "2026-05-02",
    createdAt: "2026-04-03",
  },
];

// ---------- CONTRACTS ----------
const _mockContracts: Omit<Contract, "tenantId">[] = [
  {
    id: "ct-1",
    code: "HD-2024-0142",
    customerId: "c-1",
    projectId: "p-1",
    type: "maintenance",
    value: 240000000,
    paid: 240000000,
    startDate: "2024-04-01",
    endDate: "2026-04-30",
    status: "expiring",
    items: ["Bảo trì 4 thang Mitsubishi định kỳ 1 tháng/lần"],
    signedAt: "2024-03-20",
    milestones: [],
    contractFileUrl: "https://example.com/contract-ct1.pdf",
    paymentStages: { stage1Paid: 240000000, stage2Paid: 0, stage3Paid: 0 },
    accountantVerified: true,
    ceoVerified: true,
  },
  {
    id: "ct-2",
    code: "HD-2023-0218",
    customerId: "c-2",
    projectId: "p-2",
    type: "install",
    value: 3600000000,
    paid: 3600000000,
    startDate: "2023-11-15",
    endDate: "2025-11-15",
    status: "active",
    items: ["Lắp đặt 6 thang máy Otis 21 tầng"],
    signedAt: "2023-11-10",
    milestones: [],
    contractFileUrl: "https://example.com/contract-ct2.pdf",
    paymentStages: { stage1Paid: 1000000000, stage2Paid: 2000000000, stage3Paid: 600000000 },
    accountantVerified: true,
    ceoVerified: true,
  },
  {
    id: "ct-3",
    code: "HD-2023-0912",
    customerId: "c-3",
    projectId: "p-3",
    type: "maintenance",
    value: 180000000,
    paid: 180000000,
    startDate: "2023-06-15",
    endDate: "2025-06-15",
    status: "active",
    items: ["Bảo trì 3 thang máy Hyundai"],
    signedAt: "2023-06-10",
    milestones: [],
    contractFileUrl: "https://example.com/contract-ct3.pdf",
    paymentStages: { stage1Paid: 180000000, stage2Paid: 0, stage3Paid: 0 },
    accountantVerified: true,
    ceoVerified: true,
  },
  {
    id: "ct-4",
    code: "HD-2025-0019",
    customerId: "c-4",
    type: "install",
    value: 320000000,
    paid: 160000000,
    startDate: "2025-01-15",
    endDate: "2027-01-15",
    status: "active",
    items: ["Lắp 1 thang gia đình 4 tầng"],
    signedAt: "2025-01-12",
    milestones: [
      {
        id: "ms-1",
        name: "Tạm ứng 30%",
        amount: 96000000,
        dueDate: "2025-01-15",
        status: "paid",
        paidDate: "2025-01-16",
      },
      {
        id: "ms-2",
        name: "Hàng về (Cơ khí) 50%",
        amount: 160000000,
        dueDate: "2025-04-10",
        status: "pending",
      },
      {
        id: "ms-3",
        name: "Quyết toán 20%",
        amount: 64000000,
        dueDate: "2025-06-01",
        status: "pending",
      },
    ],
    contractFileUrl: "https://example.com/contract-ct4.pdf",
    paymentStages: { stage1Paid: 160000000, stage2Paid: 0, stage3Paid: 0 },
    accountantVerified: true,
    ceoVerified: true,
  },
  {
    id: "ct-7",
    code: "HD-2025-0048",
    customerId: "c-7",
    type: "install",
    value: 290000000,
    paid: 90000000,
    startDate: "2025-03-01",
    endDate: "2027-03-01",
    status: "active",
    items: ["Lắp 1 thang gia đình"],
    signedAt: "2025-02-25",
    milestones: [
      {
        id: "ms-4",
        name: "Tạm ứng HĐ",
        amount: 90000000,
        dueDate: "2025-03-01",
        status: "paid",
        paidDate: "2025-03-02",
      },
      {
        id: "ms-5",
        name: "Giai đoạn thi công (Chờ thu)",
        amount: 120000000,
        dueDate: "2026-04-18",
        status: "overdue",
      },
    ],
    contractFileUrl: "https://example.com/contract-ct7.pdf",
    paymentStages: { stage1Paid: 90000000, stage2Paid: 0, stage3Paid: 0 },
    accountantVerified: true,
    ceoVerified: true,
  },
  {
    id: "ct-10",
    code: "HD-2023-0004",
    customerId: "c-4",
    type: "maintenance",
    value: 45000000,
    paid: 45000000,
    startDate: "2023-06-01",
    endDate: "2024-05-31",
    status: "active",
    items: ["Bảo trì 12 tháng", "Tặng 1 lần thay dầu"],
    signedAt: "2023-05-20",
    milestones: [],
    contractFileUrl: "https://example.com/contract-ct10.pdf",
    paymentStages: { stage1Paid: 45000000, stage2Paid: 0, stage3Paid: 0 },
    accountantVerified: true,
    ceoVerified: true,
  },
  {
    id: "ct-sample-sala",
    code: "HD-2026-0088",
    customerId: "c-11",
    projectId: "p-sample",
    type: "maintenance",
    value: 120000000,
    paid: 60000000,
    startDate: "2026-04-01",
    endDate: "2027-04-01",
    status: "active",
    items: ["Bảo trì trọn gói 2 thang Homelift"],
    signedAt: "2026-03-25",
    milestones: [],
    paymentStages: { stage1Paid: 60000000, stage2Paid: 0, stage3Paid: 0 },
    accountantVerified: true,
    ceoVerified: true,
  },
];

// ---------- ELEVATORS ----------
const _mockElevators: Omit<Elevator, "tenantId">[] = [
  {
    id: "e-1",
    code: "VHOP-A1-01",
    projectId: "p-1",
    contractId: "ct-1",
    building: "Tòa A1",
    address: "Vinhomes Ocean Park",
    brand: "Mitsubishi",
    model: "NEXIEZ-MR",
    floors: 25,
    installedAt: "2022-04-15",
    warrantyUntil: "2024-04-15",
    lastMaintenance: "2026-03-15",
    nextMaintenance: "2026-04-15",
    status: "maintenance_due",
    lifecyclePhase: "maintenance",
  },
  {
    id: "e-2",
    code: "VHOP-A1-02",
    projectId: "p-1",
    contractId: "ct-1",
    building: "Tòa A1",
    address: "Vinhomes Ocean Park",
    brand: "Mitsubishi",
    model: "NEXIEZ-MR",
    floors: 25,
    installedAt: "2022-04-15",
    warrantyUntil: "2024-04-15",
    lastMaintenance: "2026-03-15",
    nextMaintenance: "2026-04-15",
    status: "operational",
    lifecyclePhase: "maintenance",
  },
  {
    id: "e-3",
    code: "VHOP-B2-01",
    projectId: "p-1",
    contractId: "ct-1",
    building: "Tòa B2",
    address: "Vinhomes Ocean Park",
    brand: "Mitsubishi",
    model: "NEXIEZ-MR",
    floors: 22,
    installedAt: "2022-06-20",
    warrantyUntil: "2024-06-20",
    lastMaintenance: "2026-03-20",
    nextMaintenance: "2026-04-20",
    status: "operational",
    lifecyclePhase: "maintenance",
  },
  {
    id: "e-4",
    code: "VHOP-B2-02",
    projectId: "p-1",
    contractId: "ct-1",
    building: "Tòa B2",
    address: "Vinhomes Ocean Park",
    brand: "Mitsubishi",
    model: "NEXIEZ-MR",
    floors: 22,
    installedAt: "2022-06-20",
    warrantyUntil: "2024-06-20",
    lastMaintenance: "2026-03-20",
    nextMaintenance: "2026-04-20",
    status: "operational",
    lifecyclePhase: "maintenance",
  },
  {
    id: "e-5",
    code: "SST-01",
    projectId: "p-2",
    contractId: "ct-2",
    building: "Sunshine Tower",
    address: "16 Phạm Hùng",
    brand: "Otis",
    model: "GeN2",
    floors: 21,
    installedAt: "2024-02-10",
    warrantyUntil: "2026-02-10",
    lastMaintenance: "2026-03-25",
    nextMaintenance: "2026-04-25",
    status: "operational",
    lifecyclePhase: "maintenance",
  },
  {
    id: "e-6",
    code: "SST-02",
    projectId: "p-2",
    contractId: "ct-2",
    building: "Sunshine Tower",
    address: "16 Phạm Hùng",
    brand: "Otis",
    model: "GeN2",
    floors: 21,
    installedAt: "2024-02-10",
    warrantyUntil: "2026-02-10",
    lastMaintenance: "2026-03-25",
    nextMaintenance: "2026-04-25",
    status: "out_of_order",
    lifecyclePhase: "maintenance",
  },
  {
    id: "e-7",
    code: "SST-03",
    projectId: "p-2",
    contractId: "ct-2",
    building: "Sunshine Tower",
    address: "16 Phạm Hùng",
    brand: "Otis",
    model: "GeN2",
    floors: 21,
    installedAt: "2024-02-10",
    warrantyUntil: "2026-02-10",
    lastMaintenance: "2026-03-25",
    nextMaintenance: "2026-04-25",
    status: "operational",
    lifecyclePhase: "maintenance",
  },
  {
    id: "e-8",
    code: "MTH-01",
    projectId: "p-3",
    contractId: "ct-3",
    building: "Mường Thanh Hà Đông",
    address: "78 Trần Phú",
    brand: "Hyundai",
    model: "Luxen",
    floors: 18,
    installedAt: "2023-08-01",
    warrantyUntil: "2025-08-01",
    lastMaintenance: "2026-03-10",
    nextMaintenance: "2026-04-10",
    status: "maintenance_due",
    lifecyclePhase: "maintenance",
  },
  {
    id: "e-9",
    code: "MTH-02",
    projectId: "p-3",
    contractId: "ct-3",
    building: "Mường Thanh Hà Đông",
    address: "78 Trần Phú",
    brand: "Hyundai",
    model: "Luxen",
    floors: 18,
    installedAt: "2023-08-01",
    warrantyUntil: "2025-08-01",
    lastMaintenance: "2026-03-10",
    nextMaintenance: "2026-04-10",
    status: "operational",
    lifecyclePhase: "maintenance",
  },
  {
    id: "e-10",
    code: "DPL-01",
    projectId: "p-3",
    contractId: "ct-5",
    building: "Diamond Plaza",
    address: "25 Lê Duẩn",
    brand: "Kone",
    model: "MonoSpace",
    floors: 15,
    installedAt: "2023-03-15",
    warrantyUntil: "2025-03-15",
    lastMaintenance: "2026-03-30",
    nextMaintenance: "2026-04-30",
    status: "operational",
    lifecyclePhase: "safety_inspection",
  },
  {
    id: "e-11",
    code: "TC-A-01",
    projectId: "p-2",
    contractId: "ct-6",
    building: "Times City T1",
    address: "458 Minh Khai",
    brand: "Schindler",
    model: "5500",
    floors: 28,
    installedAt: "2024-09-10",
    warrantyUntil: "2026-09-10",
    lastMaintenance: "2026-04-01",
    nextMaintenance: "2026-05-01",
    status: "operational",
    lifecyclePhase: "maintenance",
  },
  {
    id: "e-12",
    code: "TC-A-02",
    projectId: "p-2",
    contractId: "ct-6",
    building: "Times City T1",
    address: "458 Minh Khai",
    brand: "Schindler",
    model: "5500",
    floors: 28,
    installedAt: "2024-09-10",
    warrantyUntil: "2026-09-10",
    lastMaintenance: "2026-04-01",
    nextMaintenance: "2026-05-01",
    status: "operational",
    lifecyclePhase: "maintenance",
  },
  {
    id: "e-13",
    code: "BVHN-01",
    projectId: "p-3",
    contractId: "ct-8",
    building: "Bệnh viện Hồng Ngọc",
    address: "55 Yên Ninh",
    brand: "Mitsubishi",
    model: "ELENESSA",
    floors: 12,
    installedAt: "2022-04-20",
    warrantyUntil: "2024-04-20",
    lastMaintenance: "2026-04-05",
    nextMaintenance: "2026-05-05",
    status: "operational",
    lifecyclePhase: "maintenance",
  },
  {
    id: "e-14",
    code: "LOTTE-01",
    projectId: "p-2",
    contractId: "ct-10",
    building: "Lotte Center",
    address: "54 Liễu Giai",
    brand: "Otis",
    model: "SkyRise",
    floors: 65,
    installedAt: "2022-12-01",
    warrantyUntil: "2024-12-01",
    lastMaintenance: "2026-04-08",
    nextMaintenance: "2026-05-08",
    status: "operational",
    lifecyclePhase: "maintenance",
  },
  {
    id: "e-15",
    code: "LOTTE-02",
    projectId: "p-2",
    contractId: "ct-10",
    building: "Lotte Center",
    address: "54 Liễu Giai",
    brand: "Otis",
    model: "SkyRise",
    floors: 65,
    installedAt: "2022-12-01",
    warrantyUntil: "2024-12-01",
    lastMaintenance: "2026-04-08",
    nextMaintenance: "2026-05-08",
    status: "operational",
    lifecyclePhase: "mechanic_install",
  },
  {
    id: "e-16",
    code: "NVA-01",
    projectId: "p-4",
    contractId: "ct-4",
    building: "Nhà phố Nguyễn Văn An",
    address: "Số 12 ngõ 45 Đào Tấn",
    brand: "Hyundai",
    model: "Luxen",
    floors: 5,
    installedAt: "2025-03-01",
    warrantyUntil: "2030-03-01",
    lastMaintenance: "",
    nextMaintenance: "2025-09-01",
    status: "under_install",
    lifecyclePhase: "electric_install",
  },
  {
    id: "e-sample-1",
    code: "SALA-01",
    projectId: "p-sample",
    building: "Nhà phố Sala",
    address: "KĐT Sala, Quận 2",
    brand: "Fuji",
    model: "Homelift",
    floors: 5,
    installedAt: "2026-01-10",
    warrantyUntil: "2028-01-10",
    lastMaintenance: "2026-03-10",
    nextMaintenance: "2026-04-10",
    status: "operational",
    lifecyclePhase: "maintenance",
  },
  {
    id: "e-sample-2",
    code: "SALA-02",
    projectId: "p-sample",
    building: "Nhà phố Sala",
    address: "KĐT Sala, Quận 2",
    brand: "Fuji",
    model: "Homelift",
    floors: 5,
    installedAt: "2026-04-15",
    warrantyUntil: "2028-04-15",
    lastMaintenance: "",
    nextMaintenance: "2026-05-15",
    status: "operational",
    lifecyclePhase: "handover",
  },
  {
    id: "e-sun-1",
    code: "SUN-BC-01",
    projectId: "p-new-2",
    building: "Shophouse Sun Group",
    address: "Bãi Cháy, Hạ Long",
    brand: "Schindler",
    model: "3300",
    floors: 4,
    installedAt: "2026-04-01",
    warrantyUntil: "2028-04-01",
    lastMaintenance: "",
    nextMaintenance: "2026-05-01",
    status: "operational",
    lifecyclePhase: "maintenance",
  },
];

// ---------- JOBS ----------
const _mockJobs: Omit<Job, "tenantId">[] = [
  {
    id: "j-1",
    code: "CV-2026-0418",
    type: "maintenance",
    title: "Bảo trì định kỳ tháng 4 - VHOP A1",
    description: "Bảo trì định kỳ 2 thang tòa A1",
    customerId: "c-1",
    elevatorId: "e-1",
    projectId: "p-1",
    contractId: "ct-1",
    assignedTo: "u-tech-maint-2",
    priority: "normal",
    status: "scheduled",
    scheduledFor: "2026-04-19T08:00:00",
    beforePhotos: [],
    afterPhotos: [],
    createdAt: "2026-04-15",
  },
  {
    id: "j-2",
    code: "CV-2026-0419",
    type: "repair",
    title: "Sửa lỗi cửa thang SST-02",
    description: "Cửa thang đóng mở chậm, cần kiểm tra cảm biến",
    customerId: "c-2",
    elevatorId: "e-6",
    assignedTo: "u-tech-maint-2",
    priority: "urgent",
    status: "in_progress",
    scheduledFor: "2026-04-18T09:30:00",
    beforePhotos: ["before1.jpg"],
    afterPhotos: [],
    createdAt: "2026-04-18",
  },
  {
    id: "j-3",
    code: "CV-2026-0420",
    type: "maintenance",
    title: "Bảo trì Mường Thanh Hà Đông",
    description: "Bảo trì định kỳ 3 thang",
    customerId: "c-3",
    elevatorId: "e-8",
    contractId: "ct-3",
    assignedTo: "u-tech-maint-2",
    priority: "normal",
    status: "scheduled",
    scheduledFor: "2026-04-20T08:00:00",
    beforePhotos: [],
    afterPhotos: [],
    createdAt: "2026-04-16",
  },
  {
    id: "j-4",
    code: "CV-2026-0411",
    type: "maintenance",
    title: "Bảo trì Diamond Plaza tháng 4",
    description: "Bảo trì 5 thang Kone",
    customerId: "c-5",
    elevatorId: "e-10",
    contractId: "ct-5",
    assignedTo: "u-tech-maint-2",
    priority: "normal",
    status: "completed",
    scheduledFor: "2026-04-11T08:00:00",
    completedAt: "2026-04-11T11:30:00",
    beforePhotos: ["b1.jpg", "b2.jpg"],
    afterPhotos: ["a1.jpg", "a2.jpg"],
    report: "Tất cả thang hoạt động bình thường. Đã thay dầu hộp số thang 1.",
    isManagerApproved: true,
    createdAt: "2026-04-08",
  },
  {
    id: "j-5",
    code: "CV-2026-0421",
    type: "install",
    title: "Lắp đặt thang anh Dũng - giai đoạn cơ khí",
    description: "Lắp khung, ray dẫn hướng",
    customerId: "c-7",
    projectId: "p-4",
    contractId: "ct-7",
    assignedTo: "u-tech-install-2",
    priority: "high",
    status: "in_progress",
    scheduledFor: "2026-04-15T07:30:00",
    beforePhotos: [],
    afterPhotos: [],
    createdAt: "2026-04-10",
  },
  {
    id: "j-6",
    code: "CV-2026-0422",
    type: "inspection",
    title: "Khảo sát thang Goldmark City",
    description: "Khảo sát hiện trạng để báo giá lắp mới",
    customerId: "c-1",
    assignedTo: "u-tech-survey-2",
    priority: "normal",
    status: "pending",
    scheduledFor: "2026-04-22T14:00:00",
    beforePhotos: [],
    afterPhotos: [],
    createdAt: "2026-04-17",
  },
  {
    id: "j-7",
    code: "CV-2026-0408",
    type: "maintenance",
    title: "Bảo trì Bệnh viện Hồng Ngọc",
    description: "Bảo trì 4 thang ưu tiên",
    customerId: "c-8",
    elevatorId: "e-13",
    contractId: "ct-8",
    assignedTo: "u-tech-maint-2",
    priority: "high",
    status: "completed",
    scheduledFor: "2026-04-05T06:00:00",
    completedAt: "2026-04-05T10:00:00",
    beforePhotos: ["b.jpg"],
    afterPhotos: ["a.jpg"],
    report: "Hoàn tất, hoạt động ổn định.",
    createdAt: "2026-04-01",
  },
  {
    id: "j-8",
    code: "CV-2026-0423",
    type: "maintenance",
    title: "Bảo trì Times City T1",
    description: "Bảo trì 8 thang Schindler",
    customerId: "c-6",
    elevatorId: "e-11",
    contractId: "ct-6",
    assignedTo: "u-tech-maint-2",
    priority: "normal",
    status: "scheduled",
    scheduledFor: "2026-04-25T07:00:00",
    beforePhotos: [],
    afterPhotos: [],
    createdAt: "2026-04-15",
  },
  {
    id: "j-9",
    code: "CV-2026-0424",
    type: "repair",
    title: "Thay biến tần SST-03",
    description: "Theo hợp đồng sửa chữa HD-2026-0008",
    customerId: "c-2",
    elevatorId: "e-7",
    contractId: "ct-13",
    assignedTo: "u-tech-maint-2",
    priority: "high",
    status: "scheduled",
    scheduledFor: "2026-04-23T08:00:00",
    beforePhotos: [],
    afterPhotos: [],
    createdAt: "2026-04-12",
  },
  {
    id: "j-10",
    code: "CV-2026-0425",
    type: "maintenance",
    title: "Bảo trì Lotte Center",
    description: "Bảo trì 12 thang",
    customerId: "c-10",
    elevatorId: "e-14",
    contractId: "ct-10",
    assignedTo: "u-tech-maint-2",
    priority: "high",
    status: "scheduled",
    scheduledFor: "2026-04-26T05:00:00",
    beforePhotos: [],
    afterPhotos: [],
    createdAt: "2026-04-16",
  },
  {
    id: "j-11",
    code: "CV-2026-0405",
    type: "repair",
    title: "Khắc phục thang kẹt Ecopark",
    description: "Khách báo thang T2 không di chuyển",
    customerId: "c-12",
    assignedTo: "u-tech-maint-2",
    priority: "urgent",
    status: "completed",
    scheduledFor: "2026-04-03T15:00:00",
    completedAt: "2026-04-03T17:30:00",
    beforePhotos: ["b.jpg"],
    afterPhotos: ["a.jpg"],
    report: "Đã thay relay điều khiển, vận hành bình thường.",
    createdAt: "2026-04-03",
  },
  {
    id: "j-12",
    code: "CV-2026-0426",
    type: "inspection",
    title: "Khảo sát BV An Việt",
    description: "Khảo sát cải tạo 3 thang cũ",
    customerId: "c-3",
    assignedTo: "u-tech-survey-2",
    priority: "normal",
    status: "pending",
    scheduledFor: "2026-04-24T14:00:00",
    beforePhotos: [],
    afterPhotos: [],
    createdAt: "2026-04-17",
  },
  {
    id: "j-13",
    code: "CV-2026-0428",
    type: "maintenance",
    title: "Bảo trì định kỳ - Goldmark City",
    description: "Bảo trì tháng 4 cho Block C",
    customerId: "c-1",
    elevatorId: "e-1",
    assignedTo: "u-tech-maint-2",
    priority: "normal",
    status: "manager_approved",
    scheduledFor: "2026-04-20T09:00:00",
    completedAt: "2026-04-20T11:00:00",
    beforePhotos: ["bt-1.jpg"],
    afterPhotos: ["at-1.jpg"],
    report: "Thang hoạt động tốt, đã vệ sinh cabin.",
    isManagerApproved: true,
    createdAt: "2026-04-18",
  },
  {
    id: "j-14",
    code: "CV-2026-0429",
    type: "repair",
    title: "Thay hiển thị tầng - Hà Đông",
    description: "Bộ hiển thị tầng 1 bị lỗi sọc",
    customerId: "c-3",
    elevatorId: "e-8",
    assignedTo: "u-tech-maint-2",
    priority: "high",
    status: "payment_pending",
    scheduledFor: "2026-04-21T14:00:00",
    completedAt: "2026-04-21T15:30:00",
    beforePhotos: ["err.jpg"],
    afterPhotos: ["fix.jpg"],
    report: "Đã thay card hiển thị mới.",
    isManagerApproved: true,
    cost: 1250000,
    createdAt: "2026-04-20",
  },
  // Sample Installation project stages for u-tech-install-2 (Kỹ thuật lắp đặt)
  {
    id: "j-auto-p-sample-step-1",
    code: "JOB-INSTALL-1",
    type: "install",
    title: "Giai đoạn 1: Thả chì (Plumbing)",
    description: "Khảo sát và thả dây chì định vị hố thang máy.",
    customerId: "c-1",
    projectId: "p-sample",
    assignedTo: "u-tech-install-2",
    priority: "normal",
    status: "completed",
    scheduledFor: "2026-04-10T08:00:00",
    beforePhotos: [],
    afterPhotos: [],
    createdAt: "2026-04-09",
  },
  {
    id: "j-auto-p-sample-step-2",
    code: "JOB-INSTALL-2",
    type: "install",
    title: "Giai đoạn 2: Lắp ray (Rails)",
    description: "Lắp đặt hệ thống ray dẫn hướng cabin và đối trọng.",
    customerId: "c-1",
    projectId: "p-sample",
    assignedTo: "u-tech-install-2",
    priority: "normal",
    status: "in_progress",
    scheduledFor: "2026-04-22T09:00:00",
    beforePhotos: [],
    afterPhotos: [],
    createdAt: "2026-04-09",
  },
  {
    id: "j-auto-p-sample-step-3",
    code: "JOB-INSTALL-3",
    type: "install",
    title: "Giai đoạn 3: Máy kéo – thả cáp (Machine & Ropes)",
    description: "Lắp đặt máy kéo và hệ thống cáp tải.",
    customerId: "c-1",
    projectId: "p-sample",
    assignedTo: "u-tech-install-2",
    priority: "normal",
    status: "scheduled",
    scheduledFor: "2026-04-29T08:00:00",
    beforePhotos: [],
    afterPhotos: [],
    createdAt: "2026-04-09",
  },
  {
    id: "j-auto-p-sample-step-4",
    code: "JOB-INSTALL-4",
    type: "install",
    title: "Giai đoạn 4: Lắp cửa tầng (Floor Doors)",
    description: "Lắp đặt hệ thống cửa tầng cho các tầng.",
    customerId: "c-1",
    projectId: "p-sample",
    assignedTo: "u-tech-install-2",
    priority: "normal",
    status: "pending",
    scheduledFor: "2026-05-06T08:00:00",
    beforePhotos: [],
    afterPhotos: [],
    createdAt: "2026-04-09",
  },
  {
    id: "j-auto-p-sample-step-5",
    code: "JOB-INSTALL-5",
    type: "install",
    title: "Giai đoạn 5: Lắp cabin (Cabin)",
    description: "Lắp khung cabin và vách cabin.",
    customerId: "c-1",
    projectId: "p-sample",
    assignedTo: "u-tech-install-2",
    priority: "normal",
    status: "pending",
    scheduledFor: "2026-05-13T08:00:00",
    beforePhotos: [],
    afterPhotos: [],
    createdAt: "2026-04-09",
  },
  {
    id: "j-auto-p-sample-step-6",
    code: "JOB-INSTALL-6",
    type: "install",
    title: "Giai đoạn 6: Điện và hiệu chỉnh (Electrical)",
    description: "Đấu nối tủ điều khiển và chạy thử hiệu chỉnh.",
    customerId: "c-1",
    projectId: "p-sample",
    assignedTo: "u-tech-install-2",
    priority: "normal",
    status: "pending",
    scheduledFor: "2026-05-20T08:00:00",
    beforePhotos: [],
    afterPhotos: [],
    createdAt: "2026-04-09",
  },
  {
    id: "j-auto-p-sample-step-7",
    code: "JOB-INSTALL-7",
    type: "install",
    title: "Giai đoạn 7: Kiểm định (Inspection)",
    description: "Thực hiện kiểm định an toàn cấp phép vận hành.",
    customerId: "c-1",
    projectId: "p-sample",
    assignedTo: "u-tech-install-2",
    priority: "normal",
    status: "pending",
    scheduledFor: "2026-05-27T08:00:00",
    beforePhotos: [],
    afterPhotos: [],
    createdAt: "2026-04-09",
  },
  {
    id: "j-auto-p-sample-step-8",
    code: "JOB-INSTALL-8",
    type: "install",
    title: "Giai đoạn 8: Bàn giao (Handover)",
    description: "Bàn giao chìa khóa và hướng dẫn sử dụng cho khách hàng.",
    customerId: "c-1",
    projectId: "p-sample",
    assignedTo: "u-tech-install-2",
    priority: "normal",
    status: "pending",
    scheduledFor: "2026-06-03T08:00:00",
    beforePhotos: [],
    afterPhotos: [],
    createdAt: "2026-04-09",
  },
  {
    id: "j-maint-3",
    code: "BT-2026-04-05",
    type: "maintenance",
    title: "Bảo trì: Kiểm tra định kỳ đột xuất",
    description: "Sếp yêu cầu kiểm tra kỹ thuật sau khi có phản ánh chất lượng.",
    customerId: "c-custom-3",
    elevatorId: "e-1",
    assignedTo: "u-tech-install-2",
    priority: "normal",
    status: "appointment_confirmed",
    scheduledFor: "2026-04-22T14:30:00",
    beforePhotos: [],
    afterPhotos: [],
    createdAt: "2026-04-20",
  },
  // --- ADDED NEW INDEPENDENT JOBS ---
  // INSTALLATION (Project p-new-1)
  {
    id: "j-install-p1-s1",
    code: "LD-GM-01",
    type: "install",
    title: "GĐ 1: Thả chì - Biệt thự Gamuda",
    description: "Thả dây dọi và kiểm tra hố thang.",
    customerId: "c-11",
    projectId: "p-new-1",
    assignedTo: "u-tech-install-2",
    priority: "normal",
    status: "completed",
    scheduledFor: "2026-04-01T08:00:00",
    beforePhotos: [],
    afterPhotos: [],
    createdAt: "2026-03-25",
  },
  {
    id: "j-install-p1-s2",
    code: "LD-GM-02",
    type: "install",
    title: "GĐ 2: Lắp ray - Biệt thự Gamuda",
    description: "Lắp đặt hệ thống ray dẫn hướng.",
    customerId: "c-11",
    projectId: "p-new-1",
    assignedTo: "u-tech-maint-2",
    priority: "high",
    status: "in_progress",
    scheduledFor: "2026-04-22T08:00:00",
    beforePhotos: [],
    afterPhotos: [],
    createdAt: "2026-03-25",
  },
  // MAINTENANCE
  {
    id: "j-maint-bulk-1",
    code: "BT-LC-01",
    type: "maintenance",
    title: "Bảo trì: Lotte Center - Thang S1",
    description: "Bảo trì định kỳ tháng 4.",
    customerId: "c-10",
    elevatorId: "e-15",
    assignedTo: "u-tech-maint-2",
    priority: "normal",
    status: "scheduled",
    scheduledFor: "2026-04-25T08:00:00",
    beforePhotos: [],
    afterPhotos: [],
    createdAt: "2026-04-10",
  },
  {
    id: "j-maint-bulk-2",
    code: "BT-BK-01",
    type: "maintenance",
    title: "Bảo trì: ĐH Bách Khoa - Thang Thư viện",
    description: "Kiểm tra hệ thống cứu hộ tự động.",
    customerId: "c-9",
    elevatorId: "e-16",
    assignedTo: "u-tech-maint-2",
    priority: "normal",
    status: "pending",
    scheduledFor: "2026-04-28T14:00:00",
    beforePhotos: [],
    afterPhotos: [],
    createdAt: "2026-04-10",
  },
  {
    id: "j-maint-bulk-3",
    code: "BT-DP-01",
    type: "maintenance",
    title: "Bảo trì: Diamond Plaza - Thang khách 1",
    description: "Vệ sinh hố thang và châm dầu.",
    customerId: "c-5",
    elevatorId: "e-10",
    assignedTo: "u-tech-maint-2",
    priority: "low",
    status: "scheduled",
    scheduledFor: "2026-04-26T10:00:00",
    beforePhotos: [],
    afterPhotos: [],
    createdAt: "2026-04-10",
  },
  // WARRANTY
  {
    id: "j-warranty-bulk-1",
    code: "BH-ECO-01",
    type: "warranty",
    title: "Bảo hành: Ecopark - Lỗi gọi tầng",
    description: "Bảng gọi tầng G không sáng đèn.",
    customerId: "c-12",
    elevatorId: "e-11",
    assignedTo: "u-tech-maint-2",
    priority: "high",
    status: "scheduled",
    scheduledFor: "2026-04-24T09:00:00",
    beforePhotos: [],
    afterPhotos: [],
    createdAt: "2026-04-20",
  },
  {
    id: "j-warranty-bulk-2",
    code: "BH-TC-01",
    type: "warranty",
    title: "Bảo hành: Times City - Tiếng rung cabin",
    description: "Cabin rung nhẹ khi qua tầng 15.",
    customerId: "c-6",
    elevatorId: "e-11",
    assignedTo: "u-tech-maint-2",
    priority: "normal",
    status: "pending",
    scheduledFor: "2026-04-27T15:00:00",
    beforePhotos: [],
    afterPhotos: [],
    createdAt: "2026-04-20",
  },
  // REPAIR
  {
    id: "j-repair-bulk-1",
    code: "SC-VH-01",
    type: "repair",
    title: "Sửa chữa: Thay biến tần Mitsubishi",
    description: "Biến tần cũ bị cháy do sụt áp.",
    customerId: "c-1",
    elevatorId: "e-1",
    assignedTo: "u-tech-maint-2",
    priority: "urgent",
    status: "scheduled",
    scheduledFor: "2026-04-23T08:30:00",
    beforePhotos: [],
    afterPhotos: [],
    createdAt: "2026-04-21",
  },
  {
    id: "j-repair-bulk-2",
    code: "SC-ST-01",
    type: "repair",
    title: "Sửa chữa: Sunshine Tower - Thay cáp tải",
    description: "Cáp tải bị tẽ sợi, cần thay thế cụm 4 sợi.",
    customerId: "c-2",
    elevatorId: "e-6",
    assignedTo: "u-tech-maint-2",
    priority: "high",
    status: "pending",
    scheduledFor: "2026-04-29T08:00:00",
    beforePhotos: [],
    afterPhotos: [],
    createdAt: "2026-04-21",
  },
  {
    id: "j-warranty-1",
    code: "BH-2026-0001",
    type: "warranty",
    title: "Bảo hành: Lỗi bảng gọi tầng 5",
    description: "Nút bấm tầng 5 không ăn, cần kiểm tra cáp tín hiệu.",
    customerId: "c-1",
    elevatorId: "e-1",
    assignedTo: "u-tech-maint-2",
    priority: "high",
    status: "scheduled",
    scheduledFor: "2026-04-22T08:00:00",
    beforePhotos: [],
    afterPhotos: [],
    createdAt: "2026-04-20",
  },
  {
    id: "j-maint-1",
    code: "BT-2026-04-01",
    type: "maintenance",
    title: "Bảo trì định kỳ tháng 4 - Thang 01",
    description: "Kiểm tra hố thang, cabin, bộ cứu hộ và châm dầu ray.",
    customerId: "c-custom-2",
    elevatorId: "e-1",
    assignedTo: "u-tech-maint-2",
    priority: "normal",
    status: "scheduled",
    scheduledFor: "2026-04-22T09:30:00",
    beforePhotos: [],
    afterPhotos: [],
    createdAt: "2026-04-01",
  },
  {
    id: "j-repair-1",
    code: "SC-2026-0032",
    type: "repair",
    title: "Sửa chữa: Thay cảm biến cửa",
    description: "Cửa không đóng được, nghi hỏng Photocell.",
    customerId: "c-custom-1",
    elevatorId: "e-1",
    assignedTo: "u-tech-maint-2",
    priority: "urgent",
    status: "in_progress",
    scheduledFor: "2026-04-22T11:00:00",
    beforePhotos: [],
    afterPhotos: [],
    createdAt: "2026-04-21",
  },
  {
    id: "j-maint-3",
    code: "BT-2026-04-05",
    type: "maintenance",
    title: "Bảo trì: Kiểm tra định kỳ đột xuất",
    description: "Sếp yêu cầu kiểm tra kỹ thuật sau khi có phản ánh chất lượng.",
    customerId: "c-custom-3",
    elevatorId: "e-1",
    assignedTo: "u-tech-maint-2",
    priority: "normal",
    status: "appointment_confirmed",
    scheduledFor: "2026-04-22T14:30:00",
    beforePhotos: [],
    afterPhotos: [],
    createdAt: "2026-04-20",
  },
  {
    id: "j-unassigned-maint-1",
    code: "BT-AUTO-001",
    type: "maintenance",
    title: "Bảo trì định kỳ: Anh Hoàng - SALA-01",
    description: "Công việc tự động sinh theo Hợp đồng HD-2026-0088. Cần phân công kỹ thuật viên.",
    customerId: "c-11",
    elevatorId: "e-sample-1",
    projectId: "p-sample",
    contractId: "ct-sample-sala",
    assignedTo: "",
    priority: "normal",
    status: "pending",
    scheduledFor: "2026-05-10T08:00:00",
    beforePhotos: [],
    afterPhotos: [],
    createdAt: "2026-04-20",
  },
  {
    id: "j-unassigned-maint-2",
    code: "BT-AUTO-002",
    type: "maintenance",
    title: "Bảo trì định kỳ: Vinhomes - VHOP-A1-01",
    description: "Công việc tự động sinh theo Hợp đồng HD-2024-0142. Cần phân công kỹ thuật viên.",
    customerId: "c-1",
    elevatorId: "e-1",
    projectId: "p-1",
    contractId: "ct-1",
    assignedTo: "",
    priority: "normal",
    status: "pending",
    scheduledFor: "2026-05-15T08:00:00",
    beforePhotos: [],
    afterPhotos: [],
    createdAt: "2026-04-20",
  },
  {
    id: "j-unassigned-repair-1",
    code: "SC-AUTO-001",
    type: "repair",
    title: "Sửa chữa: Thay cáp tải - Sunshine Tower",
    description: "Theo đề xuất từ biên bản bảo trì số 245. Cần phê duyệt và phân công.",
    customerId: "c-2",
    elevatorId: "e-5",
    projectId: "p-2",
    assignedTo: "",
    priority: "high",
    status: "pending",
    scheduledFor: "2026-04-25T09:00:00",
    beforePhotos: [],
    afterPhotos: [],
    createdAt: "2026-04-22",
  },
  {
    id: "j-unassigned-install-1",
    code: "LD-AUTO-001",
    type: "install",
    title: "Lắp đặt: Cơ khí hố thang - Golden Park",
    description:
      "Giai đoạn 2: Lắp đặt hệ thống ray dẫn hướng và khung đối trọng. Cần thợ lắp đặt chuyên nghiệp.",
    customerId: "c-3",
    elevatorId: "e-8",
    projectId: "p-3",
    assignedTo: "",
    priority: "normal",
    status: "pending",
    scheduledFor: "2026-04-30T08:00:00",
    beforePhotos: [],
    afterPhotos: [],
    createdAt: "2026-04-23",
  },
];

// ---------- INVENTORY ----------
const _mockInventory: Omit<InventoryItem, "tenantId">[] = [
  {
    id: "i-1",
    code: "MOTOR-MIT-15",
    name: "Mô tơ thang Mitsubishi 15kW",
    category: "Motor",
    unit: "Cái",
    stock: 4,
    reserved: 1,
    reorderLevel: 2,
    unitPrice: 45000000,
    location: "Kho A - Hà Nội",
  },
  {
    id: "i-2",
    code: "CTRL-OTIS-V8",
    name: "Tủ điều khiển Otis V8",
    category: "Tủ điều khiển",
    unit: "Cái",
    stock: 2,
    reserved: 0,
    reorderLevel: 1,
    unitPrice: 78000000,
    location: "Kho A - Hà Nội",
  },
  {
    id: "i-3",
    code: "CABLE-8X11",
    name: "Cáp thép 8x11mm",
    category: "Cáp",
    unit: "Mét",
    stock: 320,
    reserved: 50,
    reorderLevel: 100,
    unitPrice: 280000,
    location: "Kho A - Hà Nội",
  },
  {
    id: "i-4",
    code: "DOOR-AUTO-90",
    name: "Cửa tự động 900mm",
    category: "Cửa",
    unit: "Bộ",
    stock: 6,
    reserved: 2,
    reorderLevel: 3,
    unitPrice: 22000000,
    location: "Kho B - Hà Nội",
  },
  {
    id: "i-5",
    code: "BUTTON-LCD",
    name: "Bảng gọi tầng LCD",
    category: "Phụ kiện",
    unit: "Cái",
    stock: 45,
    reserved: 8,
    reorderLevel: 20,
    unitPrice: 1200000,
    location: "Kho A - Hà Nội",
  },
  {
    id: "i-6",
    code: "OIL-GEAR-20L",
    name: "Dầu hộp số 20L",
    category: "Vật tư bảo trì",
    unit: "Can",
    stock: 28,
    reserved: 5,
    reorderLevel: 10,
    unitPrice: 850000,
    location: "Kho A - Hà Nội",
  },
  {
    id: "i-7",
    code: "RAIL-T89",
    name: "Ray dẫn hướng T89",
    category: "Khung",
    unit: "Mét",
    stock: 180,
    reserved: 60,
    reorderLevel: 80,
    unitPrice: 320000,
    location: "Kho B - Hà Nội",
  },
  {
    id: "i-8",
    code: "INVERTER-30K",
    name: "Biến tần 30kW",
    category: "Điện tử",
    unit: "Cái",
    stock: 3,
    reserved: 1,
    reorderLevel: 2,
    unitPrice: 32000000,
    location: "Kho A - Hà Nội",
  },
  {
    id: "i-9",
    code: "SAFETY-BRAKE",
    name: "Phanh an toàn cơ khí",
    category: "Cơ khí",
    unit: "Bộ",
    stock: 8,
    reserved: 0,
    reorderLevel: 3,
    unitPrice: 15000000,
    location: "Kho A - Hà Nội",
  },
  {
    id: "i-10",
    code: "SENSOR-DOOR",
    name: "Cảm biến cửa hồng ngoại",
    category: "Cảm biến",
    unit: "Cái",
    stock: 24,
    reserved: 3,
    reorderLevel: 10,
    unitPrice: 980000,
    location: "Kho A - Hà Nội",
  },
  {
    id: "i-11",
    code: "BUFFER-OIL",
    name: "Bộ giảm chấn dầu",
    category: "An toàn",
    unit: "Bộ",
    stock: 5,
    reserved: 1,
    reorderLevel: 2,
    unitPrice: 8500000,
    location: "Kho B - Hà Nội",
  },
  {
    id: "i-12",
    code: "LIGHT-LED-CAB",
    name: "Đèn LED cabin",
    category: "Phụ kiện",
    unit: "Cái",
    stock: 60,
    reserved: 0,
    reorderLevel: 20,
    unitPrice: 350000,
    location: "Kho A - Hà Nội",
  },
];

// ---------- ISSUE REPORTS ----------
const _mockIssues: Omit<IssueReport, "tenantId">[] = [
  {
    id: "is-1",
    elevatorId: "e-6",
    customerId: "c-2",
    description: "Cửa thang đóng mở chậm, có tiếng kêu",
    reportedAt: "2026-04-18T08:15:00",
    status: "scheduled",
    jobId: "j-2",
  },
  {
    id: "is-2",
    elevatorId: "e-1",
    customerId: "c-1",
    description: "Thang rung lắc nhẹ khi lên xuống",
    reportedAt: "2026-04-17T16:30:00",
    status: "scheduled",
    jobId: "j-1",
  },
  {
    id: "is-3",
    elevatorId: "e-8",
    customerId: "c-3",
    description: "Đèn cabin số 2 bị hỏng",
    reportedAt: "2026-04-16T10:00:00",
    status: "open",
  },
];

export const mockCustomers = _mockCustomers.map((x) => ({ ...x, tenantId: "t-2" }) as Customer);
export const mockLeads: Lead[] = [
  ..._mockLeads_t2,
  ..._mockLeads.map((x) => ({ ...x, tenantId: "t-2" }) as Lead),
];
export const mockContracts = _mockContracts.map((x) => ({ ...x, tenantId: "t-2" }) as Contract);
export const mockProjects = _mockProjects.map((x) => ({ ...x, tenantId: "t-2" }) as Project);
export const mockElevators = _mockElevators.map((x) => ({ ...x, tenantId: "t-2" }) as Elevator);
export const mockJobs = _mockJobs.map((x) => ({ ...x, tenantId: "t-2" }) as Job);
export const mockInventory = _mockInventory.map(
  (x) => ({ ...x, tenantId: "t-2" }) as InventoryItem,
);
export const mockIssues = _mockIssues.map((x) => ({ ...x, tenantId: "t-2" }) as IssueReport);

export const mockRequests: ApprovalRequest[] = [
  {
    tenantId: "t-2",
    id: "req-4",
    type: "project_advance",
    title: "Xin duyệt giai đoạn Ray",
    description: "Cơ khí đã xong ray cho anh An",
    requestedBy: "u-tech-install-2",
    requestedAt: "2026-04-19T11:00:00",
    status: "pending",
    urgency: "normal",
    targetId: "p-sample",
  },
];

// Helper getters
export function getCustomer(id: string) {
  return mockCustomers.find((c) => c.id === id);
}
export function getElevator(id: string) {
  return mockElevators.find((e) => e.id === id);
}
export function getContract(id: string) {
  return mockContracts.find((c) => c.id === id);
}
export function getUser(id: string) {
  return mockUsers.find((u) => u.id === id);
}

// Additional helpers
export function getProject(id: string) {
  return mockProjects.find((p) => p.id === id);
}
export function getLeadsByCustomer(customerId: string) {
  return mockLeads.filter((l) => l.customerId === customerId);
}
export function getContractsByElevator(elevatorId: string) {
  return mockContracts.filter((c) => c.elevatorId === elevatorId);
}

export function createIssueReport(elevatorId: string, description: string) {
  const elevator = getElevator(elevatorId);
  if (!elevator) return null;
  const project = getProject(elevator.projectId);
  const customerId = project?.customerId ?? "";
  const newReport: IssueReport = {
    tenantId: "t-2",
    id: `ir-${Date.now()}`,
    elevatorId,
    customerId,
    description,
    reportedAt: new Date().toISOString(),
    status: "open",
  };
  mockIssues.push(newReport);
  // Auto‑create repair job linked to this issue
  const newJob: Job = {
    tenantId: "t-2",
    id: `j-${Date.now()}`,
    code: `JOB-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
    type: "repair",
    title: "Báo lỗi từ QR",
    description,
    customerId,
    elevatorId,
    projectId: elevator.projectId,
    contractId: undefined,
    assignedTo: "", // Admin will dispatch this
    priority: "high",
    status: "pending",
    scheduledFor: new Date().toISOString(),
    beforePhotos: [],
    afterPhotos: [],
    createdAt: new Date().toISOString(),
  };
  mockJobs.push(newJob);
  return newReport;
}

export function advanceProjectStage(projectId: string) {
  const proj = mockProjects.find((p) => p.id === projectId);
  if (!proj) return;
  const currentIndex = PROJECT_STAGES.indexOf(proj.stage);
  if (currentIndex < PROJECT_STAGES.length - 1) {
    proj.stage = PROJECT_STAGES[currentIndex + 1];
    if (proj.stage === "transition") proj.status = "completed";
  }
}

export function markMilestonePaid(contractId: string, milestoneId: string) {
  const contract = mockContracts.find((c) => c.id === contractId);
  if (!contract) return;
  const ms = contract.milestones.find((m) => m.id === milestoneId);
  if (ms && ms.status !== "paid") {
    ms.status = "paid";
    ms.paidDate = new Date().toISOString().split("T")[0];
    contract.paid += ms.amount;
  }
}

export function formatVND(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(value: string) {
  if (!value) return "—";
  const d = new Date(value);
  return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function formatDateTime(value: string) {
  if (!value) return "—";
  const d = new Date(value);
  return d.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ---------- GEO / DISPATCH ----------
export const techBases: Record<string, { name: string; lat: number; lng: number }> = {
  "u-tech-maint-2": { name: "Trung tâm bảo trì Cầu Giấy", lat: 21.0285, lng: 105.8 },
  "u-tech-install-2": { name: "Trung tâm lắp đặt Hà Đông", lat: 20.98, lng: 105.79 },
};

export const mapBounds = {
  minLat: 20.94,
  maxLat: 21.06,
  minLng: 105.76,
  maxLng: 105.96,
};

export function projectLatLng(lat: number, lng: number, width: number, height: number) {
  const x = ((lng - mapBounds.minLng) / (mapBounds.maxLng - mapBounds.minLng)) * width;
  const y = ((mapBounds.maxLat - lat) / (mapBounds.maxLat - mapBounds.minLat)) * height;
  return { x, y };
}

export function getTechnicianWorkload(userId: string): number {
  return mockJobs.filter((j) => j.assignedTo === userId && j.status !== "completed").length;
}

export function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export interface RouteStop {
  jobId: string;
  customerId: string;
  lat: number;
  lng: number;
  label: string;
  legKm: number;
  etaMinutes: number;
}

export interface OptimizedRoute {
  base: { name: string; lat: number; lng: number };
  stops: RouteStop[];
  totalKm: number;
  totalMinutes: number;
  savedKm: number;
}

// Tối ưu lộ trình bằng nearest-neighbor (greedy). Urgent luôn được xếp lên đầu.
export function optimizeRoute(technicianId: string, jobs: Job[], avgSpeedKmh = 25): OptimizedRoute {
  const base = techBases[technicianId] ?? { name: "Văn phòng", lat: 21.0285, lng: 105.8 };

  const points = jobs
    .map((j) => {
      const cus = getCustomer(j.customerId);
      if (!cus) return null;
      return { job: j, lat: cus.lat, lng: cus.lng, customer: cus };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  // Đường đi theo thứ tự thời gian (baseline để tính tiết kiệm)
  const sortedByTime = [...points].sort((a, b) =>
    a.job.scheduledFor.localeCompare(b.job.scheduledFor),
  );
  let baselineKm = 0;
  let prev: { lat: number; lng: number } = base;
  for (const p of sortedByTime) {
    baselineKm += haversineKm(prev, { lat: p.lat, lng: p.lng });
    prev = { lat: p.lat, lng: p.lng };
  }

  const urgent = points.filter((p) => p.job.priority === "urgent");
  const rest = points.filter((p) => p.job.priority !== "urgent");
  const ordered: typeof points = [];
  let cursor: { lat: number; lng: number } = base;

  const pickNearest = (pool: typeof points) => {
    let bestIdx = 0;
    let bestDist = Infinity;
    pool.forEach((p, i) => {
      const d = haversineKm(cursor, { lat: p.lat, lng: p.lng });
      if (d < bestDist) {
        bestDist = d;
        bestIdx = i;
      }
    });
    return pool.splice(bestIdx, 1)[0];
  };

  const ru = [...urgent];
  while (ru.length) {
    const c = pickNearest(ru);
    ordered.push(c);
    cursor = { lat: c.lat, lng: c.lng };
  }
  const rr = [...rest];
  while (rr.length) {
    const c = pickNearest(rr);
    ordered.push(c);
    cursor = { lat: c.lat, lng: c.lng };
  }

  let totalKm = 0;
  let prevPoint: { lat: number; lng: number } = base;
  const stops: RouteStop[] = ordered.map((p) => {
    const legKm = haversineKm(prevPoint, { lat: p.lat, lng: p.lng });
    totalKm += legKm;
    prevPoint = { lat: p.lat, lng: p.lng };
    return {
      jobId: p.job.id,
      customerId: p.customer.id,
      lat: p.lat,
      lng: p.lng,
      label: p.customer.name,
      legKm,
      etaMinutes: Math.round((legKm / avgSpeedKmh) * 60),
    };
  });

  return {
    base,
    stops,
    totalKm,
    totalMinutes: Math.round((totalKm / avgSpeedKmh) * 60),
    savedKm: Math.max(0, baselineKm - totalKm),
  };
}
