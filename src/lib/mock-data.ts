// Centralised mock data for the elevator service management prototype.
// All entities are kept simple and string-id'd so they can be swapped with
// a real backend later without changing UI code.

export type Permission =
  | "director" // Ban Giám đốc (Full quyền)
  | "sales" // Kinh doanh (Thang mới)
  | "sales_maintenance" // Kinh doanh bảo trì
  | "tech_survey" // Kỹ thuật - Khảo sát
  | "install_mgmt" // Kỹ thuật - Quản lý lắp đặt
  | "maintenance_mgmt" // Kỹ thuật - Quản lý bảo trì
  | "accounting" // Kế toán
  | "hr_admin" // Hành chính nhân sự
  | "field_tech" // Kỹ thuật viên hiện trường
  | "customer"; // Khách hàng

export type LeadStatus = "new" | "contacted" | "quoted" | "negotiating" | "won" | "lost";
export type ContractStatus = "active" | "expiring" | "expired" | "draft";
export type ContractType = "install" | "maintenance" | "repair";
export type JobStatus = "pending" | "scheduled" | "in_progress" | "completed" | "cancelled";
export type JobType = "install" | "maintenance" | "repair" | "inspection";
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
}

// New model: Project (Công trình)
export type ProjectStage =
  | "survey" // Khảo sát & Ký HĐ
  | "design" // Bản vẽ & Kỹ thuật
  | "procurement" // Đặt hàng nhà máy
  | "in_transit" // Hàng đang về
  | "mechanic_install" // Thi công cơ khí
  | "electric_install" // Thi công điện
  | "inspection" // Kiểm định an toàn
  | "handover"; // Bàn giao

export type RequestType = "material" | "budget" | "project_advance" | "completion";
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
  "survey",
  "design",
  "procurement",
  "in_transit",
  "mechanic_install",
  "electric_install",
  "inspection",
  "handover",
];

export const PROJECT_STAGE_LABELS: Record<ProjectStage, string> = {
  survey: "Khảo sát",
  design: "Bản vẽ",
  procurement: "Đặt hàng",
  in_transit: "Hàng về",
  mechanic_install: "Lắp cơ khí",
  electric_install: "Lắp điện",
  inspection: "Kiểm định",
  handover: "Bàn giao",
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
}

export const mockProjects: Project[] = [
  {
    tenantId: "t-1",
    id: "p-1",
    name: "Dự án Vinhomes Ocean Park",
    address: "Đa Tốn, Gia Lâm, Hà Nội",
    customerId: "c-1",
    startDate: "2024-01-01",
    status: "in_progress",
    stage: "electric_install",
  },
  {
    tenantId: "t-1",
    id: "p-2",
    name: "Dự án Sunshine Tower",
    address: "16 Phạm Hùng, Nam Từ Liêm, Hà Nội",
    customerId: "c-2",
    startDate: "2023-11-01",
    status: "completed",
    stage: "handover",
  },
  {
    tenantId: "t-1",
    id: "p-3",
    name: "Dự án Mường Thanh Hà Đông",
    address: "78 Trần Phú, Hà Đông, Hà Nội",
    customerId: "c-3",
    startDate: "2024-06-01",
    status: "in_progress",
    stage: "mechanic_install",
  },
  {
    tenantId: "t-1",
    id: "p-4",
    name: "Nhà phố Nguyễn Văn An",
    address: "Số 12, ngõ 45 Đào Tấn, Ba Đình",
    customerId: "c-4",
    startDate: "2025-01-10",
    status: "in_progress",
    stage: "in_transit",
  },
];

export interface Lead {
  tenantId: string;
  id: string;
  name: string;
  phone: string;
  email: string;
  source: string;
  address: string;
  note: string;
  status: LeadStatus;
  assignedTo: string;
  estimatedValue: number;
  nextFollowUp: string;
  createdAt: string;
  customerId?: string; // optional link to existing Customer
}

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

export interface Job {
  tenantId: string;
  id: string;
  code: string;
  type: JobType;
  title: string;
  description: string;
  customerId: string;
  elevatorId?: string;
  projectId?: string; // new link to Project
  contractId?: string;
  assignedTo: string; // technician id
  priority: JobPriority;
  status: JobStatus;
  scheduledFor: string;
  completedAt?: string;
  beforePhotos: string[];
  afterPhotos: string[];
  report?: string;
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
export const mockTenants: Tenant[] = [
  { id: "t-1", name: "CÔNG TY LỚN (Chuyên môn hóa)" },
  { id: "t-2", name: "CÔNG TY NHỎ (Kiêm nhiệm)" },
];

// ---------- USERS ----------
export const mockUsers: User[] = [
  // --- T-1: CÔNG TY LỚN (Phân quyền chi tiết, chuyên môn hóa) ---
  {
    id: "u-director-1",
    name: "Nguyễn Tổng (Giám đốc)",
    email: "director@bigco.vn",
    phone: "0901 111 111",
    memberships: [{ tenantId: "t-1", permissions: ["director"] }],
  },
  {
    id: "u-sales-1",
    name: "Trần Trưởng Phòng Sales",
    email: "sales@bigco.vn",
    phone: "0901 222 222",
    memberships: [{ tenantId: "t-1", permissions: ["sales", "sales_maintenance"] }],
  },
  {
    id: "u-mgmt-install-1",
    name: "Lê Quản Lý Lắp Đặt",
    email: "install@bigco.vn",
    phone: "0901 333 333",
    memberships: [{ tenantId: "t-1", permissions: ["install_mgmt"] }],
  },
  {
    id: "u-mgmt-maint-1",
    name: "Phạm Quản Lý Bảo Trì",
    email: "maintenance@bigco.vn",
    phone: "0901 444 444",
    memberships: [{ tenantId: "t-1", permissions: ["maintenance_mgmt"] }],
  },
  {
    id: "u-accounting-1",
    name: "Lý Kế Toán Trưởng",
    email: "account@bigco.vn",
    phone: "0901 555 555",
    memberships: [{ tenantId: "t-1", permissions: ["accounting"] }],
  },
  {
    id: "u-hr-1",
    name: "Võ Hành Chính Nhân Sự",
    email: "hr@bigco.vn",
    phone: "0901 666 666",
    memberships: [{ tenantId: "t-1", permissions: ["hr_admin"] }],
  },
  {
    id: "u-tech-1",
    name: "Đinh Thợ Bảo Trì Hiện Trường",
    email: "tech1@bigco.vn",
    phone: "0901 777 777",
    memberships: [{ tenantId: "t-1", permissions: ["field_tech"] }],
  },

  // --- T-2: CÔNG TY NHỎ (Một người ôm nhiều việc) ---
  {
    id: "u-director-2",
    name: "Lâm Sếp Đa Năng",
    email: "boss@smallco.vn",
    phone: "0902 111 111",
    memberships: [
      {
        tenantId: "t-2",
        permissions: ["director", "sales", "hr_admin", "install_mgmt", "accounting"],
      },
    ],
  },
  {
    id: "u-tech-all-2",
    name: "Hoàng Kỹ Sư Đa Năng",
    email: "tech@smallco.vn",
    phone: "0902 222 222",
    memberships: [
      { tenantId: "t-2", permissions: ["maintenance_mgmt", "tech_survey", "field_tech"] },
    ],
  },
  {
    id: "u-accounting-2",
    name: "Chị Lan Kế Toán kiêm HC",
    email: "lan@smallco.vn",
    phone: "0902 333 333",
    memberships: [{ tenantId: "t-2", permissions: ["accounting", "hr_admin"] }],
  },

  // --- Khách hàng (Dùng chung cho demo dễ) ---
  {
    id: "u-cus-1",
    name: "Hoàng Văn Khách Hàng (Portal)",
    email: "customer@gmail.com",
    phone: "0987 654 321",
    memberships: [
      { tenantId: "t-1", permissions: ["customer"] },
      { tenantId: "t-2", permissions: ["customer"] },
    ],
  },
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
  },
];

// ---------- LEADS ----------
const _mockLeads: Omit<Lead, "tenantId">[] = [
  {
    id: "l-1",
    name: "Tòa nhà Goldmark City",
    phone: "0901 111 222",
    email: "info@goldmark.vn",
    source: "Giới thiệu",
    address: "136 Hồ Tùng Mậu, Bắc Từ Liêm",
    note: "Cần lắp 4 thang máy mới cho block C",
    status: "negotiating",
    assignedTo: "u-admin",
    estimatedValue: 2400000000,
    nextFollowUp: "2026-04-25",
    createdAt: "2026-03-12",
  },
  {
    id: "l-2",
    name: "Văn phòng Capital Tower",
    phone: "0922 333 444",
    email: "lan.nguyen@capital.vn",
    source: "Website",
    address: "109 Trần Hưng Đạo, Hoàn Kiếm",
    note: "Quan tâm dịch vụ bảo trì 6 thang",
    status: "quoted",
    assignedTo: "u-admin",
    estimatedValue: 540000000,
    nextFollowUp: "2026-04-22",
    createdAt: "2026-03-28",
  },
  {
    id: "l-3",
    name: "Anh Hoàng - nhà phố",
    phone: "0966 222 111",
    email: "",
    source: "Facebook Ads",
    address: "Mỹ Đình, Nam Từ Liêm",
    note: "Lắp 1 thang gia đình 5 tầng",
    status: "contacted",
    assignedTo: "u-admin",
    estimatedValue: 380000000,
    nextFollowUp: "2026-04-20",
    createdAt: "2026-04-05",
  },
  {
    id: "l-4",
    name: "Bệnh viện An Việt",
    phone: "0944 222 333",
    email: "lh@anviet.vn",
    source: "Khách cũ giới thiệu",
    address: "1E Trường Chinh, Thanh Xuân",
    note: "Cải tạo 3 thang cũ",
    status: "new",
    assignedTo: "u-admin",
    estimatedValue: 720000000,
    nextFollowUp: "2026-04-19",
    createdAt: "2026-04-15",
  },
  {
    id: "l-5",
    name: "Khách sạn Hanoi Pearl",
    phone: "0988 444 555",
    email: "info@hanoipearl.vn",
    source: "Cold call",
    address: "6 Bảo Khánh, Hoàn Kiếm",
    note: "Cần báo giá bảo trì",
    status: "won",
    assignedTo: "u-admin",
    estimatedValue: 180000000,
    nextFollowUp: "2026-04-30",
    createdAt: "2026-02-20",
  },
  {
    id: "l-6",
    name: "Văn phòng MB Bank chi nhánh",
    phone: "0977 555 666",
    email: "",
    source: "Triển lãm",
    address: "21 Cát Linh, Đống Đa",
    note: "Đang khảo sát",
    status: "lost",
    assignedTo: "u-admin",
    estimatedValue: 290000000,
    nextFollowUp: "",
    createdAt: "2026-01-15",
  },
  {
    id: "l-7",
    name: "Chung cư Mipec Riverside",
    phone: "0913 666 777",
    email: "bql@mipec.vn",
    source: "Giới thiệu",
    address: "Long Biên, Hà Nội",
    note: "Bảo trì 6 thang",
    status: "negotiating",
    assignedTo: "u-admin",
    estimatedValue: 432000000,
    nextFollowUp: "2026-04-23",
    createdAt: "2026-03-30",
  },
  {
    id: "l-8",
    name: "Resort FLC Sầm Sơn",
    phone: "0902 777 888",
    email: "kt@flc.vn",
    source: "Website",
    address: "Sầm Sơn, Thanh Hóa",
    note: "Lắp mới 8 thang",
    status: "quoted",
    assignedTo: "u-admin",
    estimatedValue: 5600000000,
    nextFollowUp: "2026-04-28",
    createdAt: "2026-02-10",
  },
  {
    id: "l-9",
    name: "Anh Vinh - biệt thự",
    phone: "0934 888 999",
    email: "",
    source: "Facebook Ads",
    address: "Vinhomes Riverside, Long Biên",
    note: "Thang gia đình 4 tầng",
    status: "contacted",
    assignedTo: "u-admin",
    estimatedValue: 320000000,
    nextFollowUp: "2026-04-21",
    createdAt: "2026-04-08",
  },
  {
    id: "l-10",
    name: "Trường Quốc tế UNIS",
    phone: "0945 999 000",
    email: "facility@unishanoi.org",
    source: "Khách cũ giới thiệu",
    address: "Tây Hồ, Hà Nội",
    note: "Cải tạo + bảo trì",
    status: "new",
    assignedTo: "u-admin",
    estimatedValue: 980000000,
    nextFollowUp: "2026-04-24",
    createdAt: "2026-04-14",
  },
  {
    id: "l-11",
    name: "Showroom Mercedes",
    phone: "0918 000 111",
    email: "",
    source: "Cold call",
    address: "Phạm Hùng, Cầu Giấy",
    note: "1 thang chở hàng",
    status: "new",
    assignedTo: "u-admin",
    estimatedValue: 450000000,
    nextFollowUp: "2026-04-26",
    createdAt: "2026-04-16",
  },
  {
    id: "l-12",
    name: "Khu nhà ở xã hội ECO",
    phone: "0967 111 222",
    email: "ql@ecoxa.vn",
    source: "Triển lãm",
    address: "Hoài Đức, Hà Nội",
    note: "12 thang block A,B,C",
    status: "quoted",
    assignedTo: "u-admin",
    estimatedValue: 7200000000,
    nextFollowUp: "2026-05-02",
    createdAt: "2026-03-01",
  },
];

// ---------- CONTRACTS ----------
const _mockContracts: Omit<Contract, "tenantId">[] = [
  {
    id: "ct-1",
    code: "HD-2024-0142",
    customerId: "c-1",
    type: "maintenance",
    value: 240000000,
    paid: 240000000,
    startDate: "2024-04-01",
    endDate: "2026-04-30",
    status: "expiring",
    items: ["Bảo trì 4 thang Mitsubishi định kỳ 1 tháng/lần"],
    signedAt: "2024-03-20",
    milestones: [],
  },
  {
    id: "ct-2",
    code: "HD-2023-0218",
    customerId: "c-2",
    type: "install",
    value: 3600000000,
    paid: 3600000000,
    startDate: "2023-11-15",
    endDate: "2025-11-15",
    status: "active",
    items: ["Lắp đặt 6 thang máy Otis 21 tầng"],
    signedAt: "2023-11-10",
    milestones: [],
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
    assignedTo: "u-tech-1",
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
    assignedTo: "u-tech-1",
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
    assignedTo: "u-tech-2",
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
    assignedTo: "u-tech-2",
    priority: "normal",
    status: "completed",
    scheduledFor: "2026-04-11T08:00:00",
    completedAt: "2026-04-11T11:30:00",
    beforePhotos: ["b1.jpg", "b2.jpg"],
    afterPhotos: ["a1.jpg", "a2.jpg"],
    report: "Tất cả thang hoạt động bình thường. Đã thay dầu hộp số thang 1.",
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
    assignedTo: "u-tech-1",
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
    assignedTo: "u-tech-2",
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
    assignedTo: "u-tech-1",
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
    assignedTo: "u-tech-2",
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
    assignedTo: "u-tech-1",
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
    assignedTo: "u-tech-2",
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
    assignedTo: "u-tech-1",
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
    assignedTo: "u-tech-2",
    priority: "normal",
    status: "pending",
    scheduledFor: "2026-04-24T14:00:00",
    beforePhotos: [],
    afterPhotos: [],
    createdAt: "2026-04-17",
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

export const mockCustomers = _mockCustomers.map(
  (x, i) => ({ ...x, tenantId: i < 8 ? "t-1" : "t-2" }) as Customer,
);
export const mockLeads = _mockLeads.map(
  (x, i) => ({ ...x, tenantId: i < 8 ? "t-1" : "t-2" }) as Lead,
);
export const mockContracts = _mockContracts.map(
  (x, i) => ({ ...x, tenantId: i < 3 ? "t-1" : "t-2" }) as Contract,
);
export const mockElevators = _mockElevators.map(
  (x, i) => ({ ...x, tenantId: i < 10 ? "t-1" : "t-2" }) as Elevator,
);
export const mockJobs = _mockJobs.map((x, i) => ({ ...x, tenantId: i < 8 ? "t-1" : "t-2" }) as Job);
export const mockInventory = _mockInventory.map(
  (x, i) => ({ ...x, tenantId: i < 8 ? "t-1" : "t-2" }) as InventoryItem,
);
export const mockIssues = _mockIssues.map((x, i) => ({ ...x, tenantId: "t-1" }) as IssueReport);

export const mockRequests: ApprovalRequest[] = [
  {
    tenantId: "t-1",
    id: "req-1",
    type: "material",
    title: "Yêu cầu tủ điện Mitsubishi",
    description: "Cần gấp cho dự án Vinhomes block A1",
    requestedBy: "u-tech-1",
    requestedAt: "2026-04-18T10:00:00",
    status: "approved",
    urgency: "high",
    targetId: "p-1",
  },
  {
    tenantId: "t-1",
    id: "req-2",
    type: "budget",
    title: "Chi phí thuê cẩu 20 tấn",
    description: "Vận chuyển máy kéo lên sân thượng tòa SST",
    requestedBy: "u-mgmt-install-1",
    requestedAt: "2026-04-20T08:30:00",
    status: "pending",
    urgency: "critical",
    amount: 15000000,
    targetId: "p-2",
  },
  {
    tenantId: "t-1",
    id: "req-3",
    type: "completion",
    title: "Báo cáo hoàn tất electric_install",
    description: "Đã đấu nối xong 4 tủ điện",
    requestedBy: "u-tech-1",
    requestedAt: "2026-04-20T14:20:00",
    status: "pending",
    urgency: "normal",
    targetId: "p-1",
  },
  {
    tenantId: "t-2",
    id: "req-4",
    type: "project_advance",
    title: "Xin duyệt giai đoạn Ray",
    description: "Cơ khí đã xong ray cho anh An",
    requestedBy: "u-tech-all-2",
    requestedAt: "2026-04-19T11:00:00",
    status: "pending",
    urgency: "normal",
    targetId: "p-4",
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
    tenantId: "t-1",
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
    tenantId: "t-1",
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
    if (proj.stage === "handover") proj.status = "completed";
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
  "u-tech-1": { name: "Kho A - Cầu Giấy", lat: 21.0285, lng: 105.8 },
  "u-tech-2": { name: "Kho B - Hà Đông", lat: 20.98, lng: 105.79 },
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
