// src/components/common/Modals.tsx
// =====================================================================
// TẤT CẢ CÁC MODAL DÙNG CHUNG — thêm vào project
// =====================================================================
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  mockCustomers,
  mockElevators,
  mockContracts,
  mockUsers,
  mockJobs,
  mockProjects,
  getProject,
  formatVND,
  mockLeads,
  type JobType,
  type JobPriority,
  type ContractType,
  type LeadStatus,
  type Job,
  type User,
  getUser,
  getElevator,
  type Lead,
} from "@/lib/mock-data";
import { TECH_PERMISSIONS } from "@/lib/roles";
import { useAppStore, useIsSmallCompany } from "@/lib/store";
import {
  handleLeadConversion,
  handleMaintenanceLeadConversion,
  getTechnicianWorkload,
  handleContractActivation,
  initiateWarrantyFlow,
  handleEquipmentArrival,
  handleFinalVerification,
} from "@/lib/workflow-utils";
import {
  CheckCircle2,
  AlertTriangle,
  User as UserIcon,
  Building2,
  FileText,
  Banknote,
  Briefcase,
  UserCog,
  X,
  Wallet,
  RefreshCw,
  ArrowRightLeft,
  Upload,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  Package,
  Calendar,
  ArrowLeft,
  Camera,
  MapPin,
  Phone,
  Plus,
  Map as MapIcon,
  Navigation,
  Trash2,
  ClipboardCheck,
  Hammer,
  Check,
  Activity,
  Wrench,
  Send,
} from "lucide-react";

// ─────────────────────────────────────────────
// 1. MODAL TẠO CÔNG VIỆC MỚI
// ─────────────────────────────────────────────
interface CreateJobModalProps {
  open: boolean;
  onClose: () => void;
  defaultCustomerId?: string;
  defaultElevatorId?: string;
  defaultContractId?: string;
  defaultProjectId?: string;
  defaultTitle?: string;
  defaultType?: JobType;
  defaultDescription?: string;
  defaultLeadId?: string;
  onSuccess?: (job: Job) => void;
}

const typeOptions: { value: JobType; label: string }[] = [
  { value: "maintenance", label: "Bảo trì định kỳ" },
  { value: "repair", label: "Sửa chữa" },
  { value: "install", label: "Lắp đặt" },
  { value: "inspection", label: "Khảo sát" },
];

const priorityOptions: { value: JobPriority; label: string }[] = [
  { value: "low", label: "Thấp" },
  { value: "normal", label: "Bình thường" },
  { value: "high", label: "Cao" },
  { value: "urgent", label: "Khẩn cấp" },
];

export function CreateJobModal({
  open,
  onClose,
  defaultCustomerId = "",
  defaultElevatorId = "",
  defaultContractId = "",
  defaultProjectId = "",
  defaultTitle = "",
  defaultType = "maintenance",
  defaultDescription = "",
  defaultLeadId = "",
  onSuccess,
}: CreateJobModalProps) {
  const [title, setTitle] = useState(defaultTitle || "");
  const [type, setType] = useState<JobType>(defaultType || "maintenance");
  const [customerId, setCustomerId] = useState(defaultCustomerId || "");
  const [projectId, setProjectId] = useState(defaultProjectId || "");
  const [elevatorId, setElevatorId] = useState(defaultElevatorId || "");
  const [contractId, setContractId] = useState(defaultContractId || "");
  const [leadId] = useState(defaultLeadId || "");
  const [techId, setTechId] = useState("");
  const [scheduledFor, setScheduledFor] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(8, 0, 0, 0);
    return d.toISOString().slice(0, 16);
  });
  const [priority, setPriority] = useState<JobPriority>("normal");
  const [description, setDescription] = useState(defaultDescription || "");
  const [loading, setLoading] = useState(false);

  const technicians = mockUsers.filter((u) =>
    u.memberships?.some((m) => m.permissions.some((p) => TECH_PERMISSIONS.includes(p))),
  );
  // Filter elevators belonging to customer's projects
  const customerProjects = mockProjects.filter((p) => p.customerId === customerId);
  const customerProjectIds = customerProjects.map((p) => p.id);
  const customerElevators = customerId
    ? mockElevators.filter((e) => customerProjectIds.includes(e.projectId))
    : mockElevators;
  const customerContracts = mockContracts.filter((c) => c.customerId === customerId);

  const handleSubmit = async () => {
    if (!title.trim() || (!customerId && !defaultLeadId) || !techId || !scheduledFor) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));

    const newJob: Job = {
      tenantId: useAppStore.getState().activeTenantId || "t-2",
      id: `job-${Date.now()}`,
      code: `JOB-${Math.floor(Math.random() * 10000)}`,
      title,
      type,
      description,
      customerId: customerId || "unknown",
      leadId: defaultLeadId,
      assignedTo: techId,
      priority,
      status: "scheduled",
      scheduledFor,
      beforePhotos: [],
      afterPhotos: [],
      createdAt: new Date().toISOString(),
    };

    mockJobs.push(newJob);
    onSuccess?.(newJob);

    setLoading(false);
    toast.success(
      `Đã tạo công việc "${title}" — giao cho ${mockUsers.find((u) => u.id === techId)?.name}`,
    );
    onClose();
    // Reset
    setTitle("");
    setType("maintenance");
    setCustomerId("");
    setProjectId("");
    setElevatorId("");
    setContractId("");
    setTechId("");
    setPriority("normal");
    setDescription("");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" /> Tạo công việc mới
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Tiêu đề */}
          <div>
            <label className="text-sm font-medium">
              Tiêu đề công việc <span className="text-destructive">*</span>
            </label>
            <Input
              className="mt-1"
              placeholder="VD: Bảo trì định kỳ tháng 5 — Vinhomes A1"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">
                Loại công việc <span className="text-destructive">*</span>
              </label>
              <Select value={type} onValueChange={(v) => setType(v as JobType)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {typeOptions.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Mức ưu tiên</label>
              <Select value={priority} onValueChange={(v) => setPriority(v as JobPriority)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Khách hàng */}
          <div>
            <label className="text-sm font-medium">
              Khách hàng <span className="text-destructive">*</span>
            </label>
            <Select
              value={customerId}
              onValueChange={(v) => {
                setCustomerId(v);
                setProjectId("");
                setElevatorId("");
                setContractId("");
              }}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Chọn khách hàng..." />
              </SelectTrigger>
              <SelectContent>
                {mockCustomers.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {customerId && (
            <div>
              <label className="text-sm font-medium">Dự án liên quan</label>
              <Select
                value={projectId || "none"}
                onValueChange={(v) => {
                  setProjectId(v === "none" ? "" : v);
                  setElevatorId("");
                }}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Chọn dự án..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">— Không chọn —</SelectItem>
                  {customerProjects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {customerId && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Thang máy (nếu có)</label>
                <Select
                  value={elevatorId || "none"}
                  onValueChange={(v) => setElevatorId(v === "none" ? "" : v)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Chọn thang..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">— Không chọn —</SelectItem>
                    {customerElevators.map((e) => (
                      <SelectItem key={e.id} value={e.id}>
                        {e.code} — {e.building}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Hợp đồng liên quan</label>
                <Select
                  value={contractId || "none"}
                  onValueChange={(v) => setContractId(v === "none" ? "" : v)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Chọn HĐ..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">— Không chọn —</SelectItem>
                    {customerContracts.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">
                Kỹ thuật viên phụ trách <span className="text-destructive">*</span>
              </label>
              <Select value={techId} onValueChange={setTechId}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Chọn kỹ thuật..." />
                </SelectTrigger>
                <SelectContent>
                  {technicians.map((u) => {
                    const activeJobs = mockJobs.filter(
                      (j) =>
                        j.assignedTo === u.id &&
                        j.status !== "completed" &&
                        j.status !== "cancelled",
                    ).length;
                    return (
                      <SelectItem key={u.id} value={u.id}>
                        <span className="flex items-center gap-2 w-full">
                          {u.name}
                          <span
                            className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeJobs >= 5 ? "bg-destructive/10 text-destructive" : activeJobs >= 3 ? "bg-warning/10 text-warning-foreground" : "bg-success/10 text-success"}`}
                          >
                            {activeJobs} việc
                          </span>
                        </span>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {techId && (
                <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                  💡 Gợi ý: KTV này đang có{" "}
                  <span className="font-bold">
                    {
                      mockJobs.filter(
                        (j) =>
                          j.assignedTo === techId &&
                          j.status !== "completed" &&
                          j.status !== "cancelled",
                      ).length
                    }
                  </span>{" "}
                  việc chưa hoàn thành
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium">
                Ngày giờ thực hiện <span className="text-destructive">*</span>
              </label>
              <Input
                type="datetime-local"
                className="mt-1"
                value={scheduledFor}
                onChange={(e) => setScheduledFor(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Mô tả / Ghi chú</label>
            <Textarea
              className="mt-1"
              placeholder="Mô tả chi tiết công việc cần thực hiện..."
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Đang tạo..." : "Tạo công việc"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────
// 2. MODAL CẬP NHẬT TRẠNG THÁI CÔNG VIỆC
// ─────────────────────────────────────────────
interface UpdateJobStatusModalProps {
  open: boolean;
  onClose: () => void;
  jobTitle: string;
  currentStatus: string;
  onConfirm: (newStatus: string, note: string) => void;
}

const jobStatusOptions = [
  { value: "pending", label: "⏳ Chờ xử lý" },
  { value: "scheduled", label: "📅 Đã lên lịch" },
  { value: "in_progress", label: "🔧 Đang thực hiện" },
  { value: "completed", label: "✅ Hoàn thành" },
  { value: "cancelled", label: "❌ Hủy" },
];

export function UpdateJobStatusModal({
  open,
  onClose,
  jobTitle,
  currentStatus,
  onConfirm,
}: UpdateJobStatusModalProps) {
  const [newStatus, setNewStatus] = useState(currentStatus);
  const [note, setNote] = useState("");

  const handle = () => {
    if (newStatus === currentStatus) {
      toast.info("Trạng thái không thay đổi");
      return;
    }
    onConfirm(newStatus, note);
    setNote("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Cập nhật trạng thái công việc</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <p className="text-sm text-muted-foreground">
            Công việc: <span className="font-medium text-foreground">{jobTitle}</span>
          </p>
          <div>
            <label className="text-sm font-medium">Trạng thái mới</label>
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {jobStatusOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">Ghi chú (không bắt buộc)</label>
            <Textarea
              className="mt-1"
              placeholder="VD: Đã hoàn tất thay thế biến tần..."
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
          {newStatus === "completed" && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-success/10 text-success text-sm">
              <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
              Biên bản sẽ được tự động gửi đến khách hàng khi hoàn thành.
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handle}>Xác nhận cập nhật</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────
// 3. MODAL GHI NHẬN THANH TOÁN
// ─────────────────────────────────────────────
interface RecordPaymentModalProps {
  open: boolean;
  onClose: () => void;
  contractCode: string;
  totalValue: number;
  alreadyPaid: number;
}

export function RecordPaymentModal({
  open,
  onClose,
  contractCode,
  totalValue,
  alreadyPaid,
}: RecordPaymentModalProps) {
  const remaining = totalValue - alreadyPaid;
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("transfer");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const numAmount = parseInt(amount.replace(/\D/g, "")) || 0;
  const newTotal = alreadyPaid + numAmount;
  const newPercent = totalValue > 0 ? Math.min(100, Math.round((newTotal / totalValue) * 100)) : 0;

  const handle = async () => {
    if (!amount || numAmount <= 0) {
      toast.error("Vui lòng nhập số tiền");
      return;
    }
    if (numAmount > remaining) {
      toast.error("Số tiền vượt quá số còn nợ");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setLoading(false);
    toast.success(`Đã ghi nhận thu ${formatVND(numAmount)} — hợp đồng ${contractCode}`);
    setAmount("");
    setNote("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Banknote className="h-5 w-5 text-success" /> Ghi nhận thanh toán
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="p-3 rounded-lg bg-muted/50 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Hợp đồng</span>
              <span className="font-medium">{contractCode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tổng giá trị</span>
              <span className="font-medium">{formatVND(totalValue)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Đã thu</span>
              <span className="text-success font-medium">{formatVND(alreadyPaid)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Còn nợ</span>
              <span className="text-warning-foreground font-semibold">{formatVND(remaining)}</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">
              Số tiền thu (VNĐ) <span className="text-destructive">*</span>
            </label>
            <Input
              className="mt-1"
              placeholder="VD: 50000000"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
            />
            {numAmount > 0 && (
              <p className="text-xs text-muted-foreground mt-1">{formatVND(numAmount)}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Hình thức</label>
              <Select value={method} onValueChange={setMethod}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="transfer">Chuyển khoản</SelectItem>
                  <SelectItem value="cash">Tiền mặt</SelectItem>
                  <SelectItem value="check">Séc</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Ngày thu</label>
              <Input
                type="date"
                className="mt-1"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          {numAmount > 0 && (
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Tiến độ sau khi ghi nhận</span>
                <span className="font-medium">{newPercent}%</span>
              </div>
              <Progress value={newPercent} className="h-2" />
            </div>
          )}

          <div>
            <label className="text-sm font-medium">Ghi chú</label>
            <Input
              className="mt-1"
              placeholder="VD: Đợt 2 theo tiến độ"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Hủy
          </Button>
          <Button onClick={handle} disabled={loading} className="bg-success hover:bg-success/90">
            {loading ? "Đang lưu..." : "Ghi nhận thu tiền"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────
// 4. MODAL CHUYỂN LEAD → KHÁCH HÀNG
// ─────────────────────────────────────────────
interface ConvertLeadModalProps {
  open: boolean;
  onClose: () => void;
  lead: Lead;
  onConverted?: (payload: { leadId: string; customerId: string; contractId: string }) => void;
}

export function ConvertLeadModal({ open, onClose, lead, onConverted }: ConvertLeadModalProps) {
  const [name, setName] = useState(lead.name);
  const [contactPerson, setContactPerson] = useState(lead.name);
  const [phone, setPhone] = useState(lead.phone);
  const [email, setEmail] = useState(lead.email || "");
  const [address, setAddress] = useState(lead.address);
  const [type, setType] = useState<"business" | "individual">("business");
  const [conversionType, setConversionType] = useState<"install" | "maintenance">("install");
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    if (!name.trim() || !phone.trim()) {
      toast.error("Vui lòng nhập tên và số điện thoại");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);

    if (!lead.quoteFileUrl) {
      toast.error("Thiếu file báo giá. Chưa thể chuyển Lead sang khách hàng.");
      return;
    }
    if (!lead.contractFileUrl) {
      toast.error("Thiếu file hợp đồng đã ký. Chưa thể chuyển Lead sang khách hàng.");
      return;
    }

    // Call the automated logic
    const { customer, contract } =
      conversionType === "maintenance"
        ? handleMaintenanceLeadConversion(lead as any)
        : handleLeadConversion(lead as any);

    const existingCustomer = mockCustomers.find((c) => c.convertedFromLeadId === lead.id);
    const nextCustomer = existingCustomer || customer;
    if (!existingCustomer) {
      mockCustomers.push(nextCustomer);
    }

    const existingContract = mockContracts.find(
      (c) => c.customerId === nextCustomer.id && c.type === contract.type,
    );
    const nextContract: typeof contract = {
      ...contract,
      customerId: nextCustomer.id,
      signedAt: new Date().toISOString().split("T")[0],
      status: "active",
      contractFileUrl: lead.contractFileUrl,
    };
    if (!existingContract) {
      mockContracts.push(nextContract);
    }

    const leadRef = mockLeads.find((x) => x.id === lead.id);
    if (leadRef) {
      leadRef.customerId = nextCustomer.id;
      leadRef.status = "signed";
    }

    const isSmall = useAppStore.getState().activeTenantId === "t-2";

    if (isSmall) {
      toast.success(`Đã chuyển đổi thành công!`, {
        description: `Khách hàng "${customer.name}" đã được tạo.`,
      });

      if (conversionType === "install") {
        const { project, jobs } = handleContractActivation(
          nextContract,
          `Dự án lắp đặt - ${nextCustomer.name}`,
        );
        if (project) mockProjects.push(project);
        if (jobs) mockJobs.push(...jobs);

        toast.info(
          `Tự động khởi tạo Hợp đồng: ${nextContract.code} và Dự án Lắp đặt: ${project?.name}`,
        );
        setTimeout(() => {
          toast.success("Đã sinh ra toàn bộ các giai đoạn công việc (Trạng thái: Chờ thiết bị).");
        }, 1500);
      } else {
        const { jobs } = handleContractActivation(nextContract);
        if (jobs) mockJobs.push(...jobs);
        toast.info(`Tự động khởi tạo Hợp đồng Bảo trì: ${nextContract.code}`);
        setTimeout(() => {
          toast.success("Đã sinh ra các kỳ bảo trì theo hợp đồng.");
        }, 1500);
      }

      if (customer.referredById) {
        toast.success("Hệ thống Referral: Đã cộng 100 điểm cho người giới thiệu.");
      }
    } else {
      toast.success(`Đã chuyển lead thành khách hàng: "${nextCustomer.name}"`);
      toast.info(`Đã kích hoạt hợp đồng ${nextContract.code} theo flow bán hàng.`);
    }
    onConverted?.({ leadId: lead.id, customerId: nextCustomer.id, contractId: nextContract.id });

    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCog className="h-5 w-5 text-primary" /> Chuyển Lead thành Khách hàng
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="p-3 rounded-lg bg-primary/5 text-sm text-primary">
            Lead "<span className="font-medium">{lead.name}</span>" sẽ được chuyển sang danh sách
            Khách hàng. Kiểm tra và bổ sung thông tin bên dưới.
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Loại khách hàng</label>
              <Select value={type} onValueChange={(v) => setType(v as "business" | "individual")}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="business">Doanh nghiệp</SelectItem>
                  <SelectItem value="individual">Cá nhân</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Mục tiêu HĐ</label>
              <Select
                value={conversionType}
                onValueChange={(v) => setConversionType(v as "install" | "maintenance")}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="install">Lắp mới</SelectItem>
                  <SelectItem value="maintenance">Bảo trì</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">
              Tên {type === "business" ? "công ty / tòa nhà" : "khách hàng"}{" "}
              <span className="text-destructive">*</span>
            </label>
            <Input className="mt-1" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Người liên hệ</label>
              <Input
                className="mt-1"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">
                Số điện thoại <span className="text-destructive">*</span>
              </label>
              <Input className="mt-1" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <Input
              className="mt-1"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Địa chỉ</label>
            <Input className="mt-1" value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Hủy
          </Button>
          <Button onClick={handle} disabled={loading}>
            {loading ? "Đang chuyển..." : "Xác nhận chuyển KH"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────
// 5. MODAL TẠO HỢP ĐỒNG
// ─────────────────────────────────────────────
interface CreateContractModalProps {
  open: boolean;
  onClose: () => void;
  defaultCustomerId?: string;
  defaultElevatorId?: string;
}

export function CreateContractModal({
  open,
  onClose,
  defaultCustomerId = "",
  defaultElevatorId = "",
}: CreateContractModalProps) {
  const [customerId, setCustomerId] = useState(defaultCustomerId);
  const [elevatorId, setElevatorId] = useState(defaultElevatorId);
  const [type, setType] = useState<ContractType>("maintenance");
  const [value, setValue] = useState("");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    return d.toISOString().split("T")[0];
  });
  const [items, setItems] = useState("");
  const [loading, setLoading] = useState(false);

  // Sync state when props change (if modal is reused)
  useEffect(() => {
    if (open) {
      setCustomerId(defaultCustomerId || "");
      setElevatorId(defaultElevatorId || "");
    }
  }, [open, defaultCustomerId, defaultElevatorId]);

  const autoCode = `HD-${new Date().getFullYear()}-${String(mockContracts.length + 1).padStart(4, "0")}`;

  const isSmall = useIsSmallCompany();

  const handle = async () => {
    if (!customerId || !value || !items.trim()) {
      toast.error("Vui lòng điền đầy đủ các trường bắt buộc");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);

    if (isSmall) {
      toast.success(`Hợp đồng ${autoCode} đã được tạo!`);

      if (type === "install") {
        toast.info("Chế độ Công ty nhỏ: Đang chờ khách hàng ký xác nhận bản cứng/Zalo...");
        setTimeout(() => {
          toast.success("Hợp đồng đã chuyển sang trạng thái: Chờ ký (Contract Pending)");
        }, 1000);
      }
    } else {
      toast.success(
        `Đã tạo hợp đồng ${autoCode} — Hệ thống sẽ tự sinh công việc theo lịch hợp đồng`,
      );
    }

    onClose();
  };

  const contractTypeOptions: { value: ContractType; label: string }[] = [
    { value: "maintenance", label: "Bảo trì định kỳ" },
    { value: "install", label: "Lắp đặt" },
    { value: "repair", label: "Sửa chữa / Cải tạo" },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" /> Tạo hợp đồng mới
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="flex items-center gap-2 p-2 rounded bg-muted/50 text-xs text-muted-foreground">
            Mã hợp đồng (tự động):{" "}
            <span className="font-mono font-semibold text-foreground ml-1">{autoCode}</span>
          </div>
          <div>
            <label className="text-sm font-medium">
              Khách hàng <span className="text-destructive">*</span>
            </label>
            <Select value={customerId} onValueChange={setCustomerId}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Chọn khách hàng..." />
              </SelectTrigger>
              <SelectContent>
                {mockCustomers.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">Thang máy áp dụng</label>
            <Select value={elevatorId} onValueChange={setElevatorId}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Tất cả thang máy / Chọn thang..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả thang máy của khách hàng</SelectItem>
                {mockElevators
                  .filter((e) => {
                    const project = mockProjects.find((p) => p.id === e.projectId);
                    return project?.customerId === customerId;
                  })
                  .map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.code} ({e.brand})
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">Loại hợp đồng</label>
            <Select value={type} onValueChange={(v) => setType(v as ContractType)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {contractTypeOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">
              Giá trị hợp đồng (VNĐ) <span className="text-destructive">*</span>
            </label>
            <Input
              className="mt-1"
              placeholder="VD: 240000000"
              value={value}
              onChange={(e) => setValue(e.target.value.replace(/\D/g, ""))}
            />
            {value && (
              <p className="text-xs text-muted-foreground mt-1">{formatVND(parseInt(value))}</p>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Ngày bắt đầu</label>
              <Input
                type="date"
                className="mt-1"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Ngày kết thúc</label>
              <Input
                type="date"
                className="mt-1"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">
              Hạng mục dịch vụ <span className="text-destructive">*</span>
            </label>
            <Textarea
              className="mt-1"
              placeholder="VD: Bảo trì 4 thang Mitsubishi định kỳ 1 tháng/lần"
              rows={2}
              value={items}
              onChange={(e) => setItems(e.target.value)}
            />
          </div>
          {type === "maintenance" && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-info/10 text-info text-sm">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              Hợp đồng bảo trì sẽ tự động sinh công việc theo chu kỳ sau khi tạo.
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Hủy
          </Button>
          <Button onClick={handle} disabled={loading}>
            {loading ? "Đang tạo..." : "Tạo hợp đồng"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────
// 6. MODAL THÊM THANG MÁY
// ─────────────────────────────────────────────
interface CreateElevatorModalProps {
  open: boolean;
  onClose: () => void;
  defaultCustomerId?: string;
}

const brands = [
  "Mitsubishi",
  "Otis",
  "Kone",
  "Schindler",
  "Hyundai",
  "ThyssenKrupp",
  "Fuji",
  "Toshiba",
];

export function CreateElevatorModal({
  open,
  onClose,
  defaultCustomerId = "",
}: CreateElevatorModalProps) {
  const [customerId, setCustomerId] = useState(defaultCustomerId);
  const [building, setBuilding] = useState("");
  const [brand, setBrand] = useState("Mitsubishi");
  const [model, setModel] = useState("");
  const [floors, setFloors] = useState("10");
  const [installedAt, setInstalledAt] = useState(new Date().toISOString().split("T")[0]);
  const [warrantyYears, setWarrantyYears] = useState("2");
  const [maintenanceCycle, setMaintenanceCycle] = useState("1");
  const [loading, setLoading] = useState(false);

  const customer = mockCustomers.find((c) => c.id === customerId);
  const autoCode = customer
    ? `${customer.name
        .split(" ")
        .slice(-2)
        .map((w) => w[0])
        .join("")
        .toUpperCase()}-${String(mockElevators.length + 1).padStart(2, "0")}`
    : "—";

  const handle = async () => {
    if (!customerId || !building || !model) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setLoading(false);
    toast.success(`Đã thêm thang máy ${autoCode} — ${brand} ${model} tại ${building}`);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" /> Thêm thang máy mới
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div>
            <label className="text-sm font-medium">
              Khách hàng <span className="text-destructive">*</span>
            </label>
            <Select value={customerId} onValueChange={setCustomerId}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Chọn khách hàng..." />
              </SelectTrigger>
              <SelectContent>
                {mockCustomers.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {customerId && (
            <div className="text-xs text-muted-foreground p-2 bg-muted/50 rounded">
              Mã thang tự động:{" "}
              <span className="font-mono font-semibold text-foreground">{autoCode}</span>
            </div>
          )}
          <div>
            <label className="text-sm font-medium">
              Tên tòa nhà / vị trí <span className="text-destructive">*</span>
            </label>
            <Input
              className="mt-1"
              placeholder="VD: Tòa A1, Mường Thanh Hà Đông..."
              value={building}
              onChange={(e) => setBuilding(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Hãng sản xuất</label>
              <Select value={brand} onValueChange={setBrand}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((b) => (
                    <SelectItem key={b} value={b}>
                      {b}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">
                Model <span className="text-destructive">*</span>
              </label>
              <Input
                className="mt-1"
                placeholder="VD: NEXIEZ-MR"
                value={model}
                onChange={(e) => setModel(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-sm font-medium">Số tầng</label>
              <Input
                type="number"
                className="mt-1"
                min={1}
                value={floors}
                onChange={(e) => setFloors(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Bảo hành (năm)</label>
              <Input
                type="number"
                className="mt-1"
                min={1}
                value={warrantyYears}
                onChange={(e) => setWarrantyYears(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Chu kỳ BT (tháng)</label>
              <Input
                type="number"
                className="mt-1"
                min={1}
                value={maintenanceCycle}
                onChange={(e) => setMaintenanceCycle(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Ngày lắp đặt</label>
            <Input
              type="date"
              className="mt-1"
              value={installedAt}
              onChange={(e) => setInstalledAt(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Hủy
          </Button>
          <Button onClick={handle} disabled={loading}>
            {loading ? "Đang thêm..." : "Thêm thang máy"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────
// 7. MODAL THÊM KHÁCH HÀNG MỚI
// ─────────────────────────────────────────────
interface CreateCustomerModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateCustomerModal({ open, onClose }: CreateCustomerModalProps) {
  const [name, setName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [type, setType] = useState<"business" | "individual">("business");
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    if (!name.trim() || !phone.trim()) {
      toast.error("Vui lòng nhập tên và số điện thoại");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setLoading(false);
    toast.success(`Đã thêm khách hàng "${name}"`);
    setName("");
    setContactPerson("");
    setPhone("");
    setEmail("");
    setAddress("");
    setType("business");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserIcon className="h-5 w-5 text-primary" /> Thêm khách hàng mới
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div>
            <label className="text-sm font-medium">Loại khách hàng</label>
            <Select value={type} onValueChange={(v) => setType(v as "business" | "individual")}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="business">Doanh nghiệp / Tòa nhà</SelectItem>
                <SelectItem value="individual">Cá nhân / Hộ gia đình</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">
              Tên {type === "business" ? "công ty / tòa nhà" : "khách hàng"}{" "}
              <span className="text-destructive">*</span>
            </label>
            <Input
              className="mt-1"
              placeholder={
                type === "business" ? "VD: Vinhomes Ocean Park" : "VD: Anh Nguyễn Văn An"
              }
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Người liên hệ</label>
              <Input
                className="mt-1"
                placeholder="Tên người liên hệ"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">
                Số điện thoại <span className="text-destructive">*</span>
              </label>
              <Input
                className="mt-1"
                placeholder="0901 234 567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <Input
              className="mt-1"
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Địa chỉ</label>
            <Input
              className="mt-1"
              placeholder="Địa chỉ đầy đủ"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Hủy
          </Button>
          <Button onClick={handle} disabled={loading}>
            {loading ? "Đang thêm..." : "Thêm khách hàng"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────
// 8. MODAL NHẬP KHO VẬT TƯ
// ─────────────────────────────────────────────
interface ReceiveInventoryModalProps {
  open: boolean;
  onClose: () => void;
  itemName?: string;
  itemCode?: string;
}

export function ReceiveInventoryModal({
  open,
  onClose,
  itemName = "",
  itemCode = "",
}: ReceiveInventoryModalProps) {
  const [qty, setQty] = useState("1");
  const [supplier, setSupplier] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    if (!qty || parseInt(qty) <= 0) {
      toast.error("Số lượng phải lớn hơn 0");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    setLoading(false);
    toast.success(`Đã nhập ${qty} ${itemName} vào kho`);

    // Simulate checking for jobs waiting for this material
    const waitingJobsCount = Math.floor(Math.random() * 2);
    if (waitingJobsCount > 0) {
      setTimeout(() => {
        toast.info(
          `Hệ thống: Đã tự động báo cho kỹ thuật viên công việc đang chờ vật tư "${itemName}" nay đã có hàng.`,
        );
      }, 1500);
    }

    setQty("1");
    setSupplier("");
    setInvoiceNo("");
    setNote("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nhập kho vật tư</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          {itemName && (
            <div className="p-2 rounded bg-muted/50 text-sm">
              Vật tư: <span className="font-medium">{itemName}</span>
              {itemCode && (
                <span className="text-muted-foreground ml-2 font-mono text-xs">{itemCode}</span>
              )}
            </div>
          )}
          <div>
            <label className="text-sm font-medium">
              Số lượng nhập <span className="text-destructive">*</span>
            </label>
            <Input
              type="number"
              className="mt-1"
              min={1}
              value={qty}
              onChange={(e) => setQty(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Nhà cung cấp</label>
            <Input
              className="mt-1"
              placeholder="Tên nhà cung cấp"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Số hóa đơn</label>
            <Input
              className="mt-1"
              placeholder="VD: INV-2026-001"
              value={invoiceNo}
              onChange={(e) => setInvoiceNo(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Ghi chú</label>
            <Input
              className="mt-1"
              placeholder="Ghi chú nếu có"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Hủy
          </Button>
          <Button onClick={handle} disabled={loading}>
            {loading ? "Đang lưu..." : "Xác nhận nhập kho"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────
// 9. MODAL XÁC NHẬN LỊCH (Portal khách hàng)
// ─────────────────────────────────────────────
interface ConfirmScheduleModalProps {
  open: boolean;
  onClose: () => void;
  jobTitle: string;
  scheduledFor: string;
}

export function ConfirmScheduleModal({
  open,
  onClose,
  jobTitle,
  scheduledFor,
}: ConfirmScheduleModalProps) {
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    setLoading(false);
    toast.success("Đã xác nhận lịch — Kỹ thuật viên sẽ đến đúng giờ");
    onClose();
  };

  const handleReschedule = () => {
    toast.info("Yêu cầu đổi lịch đã được ghi nhận — Nhân viên sẽ liên hệ trong 30 phút");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Xác nhận lịch bảo trì</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <div className="font-medium">{jobTitle}</div>
            <div className="text-sm text-muted-foreground mt-1">{scheduledFor}</div>
          </div>
          <p className="text-sm text-muted-foreground">
            Vui lòng xác nhận bạn có thể tiếp đón kỹ thuật viên vào thời điểm trên. Nếu cần thay
            đổi, nhấn "Đổi lịch".
          </p>
          <div>
            <label className="text-sm font-medium">Ghi chú cho kỹ thuật viên (nếu có)</label>
            <Textarea
              className="mt-1"
              placeholder="VD: Gọi trước 30 phút, vào cổng B..."
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleReschedule} className="sm:mr-auto">
            Đề xuất đổi ngày
          </Button>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Hủy
          </Button>
          <Button onClick={handle} disabled={loading}>
            {loading ? "Đang xác nhận..." : "✓ Đồng ý lịch"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────
// 10. MODAL THÊM LEAD MỚI
// ─────────────────────────────────────────────
interface CreateLeadModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateLeadModal({ open, onClose }: CreateLeadModalProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<"install" | "maintenance">("install");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [source, setSource] = useState("Website");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    if (!name.trim() || !phone.trim()) {
      toast.error("Vui lòng nhập tên và số điện thoại lead");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setLoading(false);
    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      tenantId: useAppStore.getState().activeTenantId || "t-2",
      name,
      type,
      phone,
      email,
      address,
      source,
      status: "new",
      estimatedValue: 0,
      note,
      createdAt: new Date().toISOString(),
    };

    mockLeads.push(newLead);
    toast.success(`Đã thêm lead mới: "${name}" (${type === "install" ? "Lắp đặt" : "Bảo trì"})`);
    setName("");
    setType("install");
    setPhone("");
    setEmail("");
    setAddress("");
    setSource("Website");
    setNote("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCog className="h-5 w-5 text-primary" /> Thêm Lead Mới
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">
                Tên khách hàng / Tổ chức <span className="text-destructive">*</span>
              </label>
              <Input
                className="mt-1"
                placeholder="VD: Tòa nhà Sunshine"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Loại Lead</label>
              <Select value={type} onValueChange={(v) => setType(v as "install" | "maintenance")}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="install">Lắp mới (Dự án)</SelectItem>
                  <SelectItem value="maintenance">Bảo trì (Dịch vụ)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">
                Số điện thoại <span className="text-destructive">*</span>
              </label>
              <Input
                className="mt-1"
                placeholder="0901 234 567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Nguồn liên hệ</label>
              <Select value={source} onValueChange={setSource}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Website">Website</SelectItem>
                  <SelectItem value="Facebook Ads">Facebook Ads</SelectItem>
                  <SelectItem value="Giới thiệu">Khách giới thiệu</SelectItem>
                  <SelectItem value="Cold call">Cold call</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <Input
              className="mt-1"
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Địa chỉ</label>
            <Input
              className="mt-1"
              placeholder="Địa chỉ dự kiến lắp đặt/bảo trì"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Ghi chú nhu cầu</label>
            <Textarea
              className="mt-1"
              placeholder="VD: Khách cần lắp 2 thang máy gia đình 5 tầng"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Hủy
          </Button>
          <Button onClick={handle} disabled={loading}>
            {loading ? "Đang thêm..." : "Thêm Lead"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────
// 11. MODAL ĐIỀU PHỐI (DISPATCH)
// ─────────────────────────────────────────────
interface DispatchJobModalProps {
  open: boolean;
  onClose: () => void;
  job: Job;
  onDispatch: (jobId: string, techId: string) => void;
}

export function DispatchJobModal({ open, onClose, job, onDispatch }: DispatchJobModalProps) {
  const [techId, setTechId] = useState("");
  const [loading, setLoading] = useState(false);

  const technicians = mockUsers
    .filter((u) => {
      const perms = u.memberships?.flatMap((m) => m.permissions) || [];
      if (job.type === "install") {
        return perms.includes("tech_installation");
      }
      // For maintenance, repair, warranty, inspection, etc.
      return perms.includes("tech_maintenance");
    })
    .map((u) => ({
      ...u,
      workload: getTechnicianWorkload(u.id),
    }))
    .sort((a, b) => a.workload - b.workload);

  const suggestedTechId = technicians.length > 0 ? technicians[0].id : "";

  const handle = async () => {
    if (!techId) {
      toast.error("Vui lòng chọn kỹ thuật viên để phân công");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    onDispatch(job.id, techId);
    toast.success(`Đã giao việc cho ${mockUsers.find((u) => u.id === techId)?.name}`);
    setTechId("");
    onClose();
  };

  if (!job) return null;
  const cus = mockCustomers.find((c) => c.id === job.customerId);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" /> Phân công công việc (Dispatch)
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
            <div className="font-medium text-warning-foreground">{job.title}</div>
            <div className="text-sm mt-1">{job.description}</div>
            <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
              <UserIcon className="h-3 w-3" /> {cus?.name}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">
              Kỹ thuật viên phụ trách <span className="text-destructive">*</span>
            </label>
            <Select value={techId} onValueChange={setTechId}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Chọn thợ đang rảnh..." />
              </SelectTrigger>
              <SelectContent>
                {technicians.map((u) => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.name} {u.id === suggestedTechId && "(Đề xuất: Rảnh nhất)"} — {u.workload}{" "}
                    việc đang xử lý
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1.5 flex items-start gap-1">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-info" />
              Giao việc sẽ chuyển trạng thái công việc sang "Đã lên lịch" và báo cho thợ.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Hủy
          </Button>
          <Button onClick={handle} disabled={loading}>
            {loading ? "Đang phân công..." : "Xác nhận Dispatch"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────
// 12. MODAL THANH TOÁN LƯƠNG
// ─────────────────────────────────────────────
interface PaySalaryModalProps {
  open: boolean;
  onClose: () => void;
  users: (User & { salary?: number })[];
}

export function PaySalaryModal({ open, onClose, users }: PaySalaryModalProps) {
  const [loading, setLoading] = useState(false);
  const total = users.reduce((sum, u) => sum + (u.salary || 0), 0);

  const handle = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    toast.success(
      `Đã thanh toán tổng cộng ${new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(total)} cho ${users.length} nhân viên`,
    );
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-success">
            <Wallet className="h-5 w-5" /> Xác nhận thanh toán lương
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="p-4 rounded-xl bg-success/5 border border-success/20 text-center">
            <div className="text-sm text-muted-foreground uppercase tracking-wider">
              Tổng quỹ lương trả đợt này
            </div>
            <div className="text-3xl font-bold text-success mt-1">
              {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(total)}
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              Dự kiến chi trả cho {users.length} nhân sự
            </div>
          </div>
          <p className="text-sm text-balance text-center text-muted-foreground">
            Hệ thống sẽ thực hiện lệnh chuyển khoản hàng loạt đến tài khoản ngân hàng của từng nhân
            sự. Hành động này không thể hoàn tác.
          </p>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} disabled={loading} className="flex-1">
            Hủy
          </Button>
          <Button
            onClick={handle}
            disabled={loading}
            className="flex-1 bg-success hover:bg-success/90"
          >
            {loading ? "Đang xử lý..." : "Xác nhận Chi trả"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────
// 14. MODAL CHUYỂN KHO
// ─────────────────────────────────────────────
export function TransferInventoryModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [target, setTarget] = useState("");

  const handle = async () => {
    if (!target) {
      toast.error("Vui lòng nhập kho đích");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    toast.success(`Lệnh chuyển kho đã được tạo — Đang chờ kho đích xác nhận`);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5 text-primary" /> Yêu cầu chuyển kho
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <label className="text-sm font-medium">Kho đích</label>
            <Select value={target} onValueChange={setTarget}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Chọn kho nhận..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Kho B - Hà Đông">Kho B - Hà Đông</SelectItem>
                <SelectItem value="Kho C - Gia Lâm">Kho C - Gia Lâm</SelectItem>
                <SelectItem value="Kho Xe Kỹ thuật">Kho Xe kỹ thuật 01</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">Ghi chú vận chuyển</label>
            <Input className="mt-1" placeholder="Lý do chuyển..." />
          </div>
          <p className="text-xs text-muted-foreground">
            * Sau khi xác nhận, số lượng vật tư sẽ được đưa vào trạng thái "Đang trung chuyển" và
            trừ khỏi kho hiện tại.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Hủy
          </Button>
          <Button onClick={handle} disabled={loading}>
            {loading ? "Đang xử lý..." : "Xác nhận chuyển"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────
// 10. MODAL TẢI LÊN TÀI LIỆU (CEO)
// ─────────────────────────────────────────────
export function UploadDocumentModal({
  open,
  onClose,
  title,
  onUploadSuccess,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  onUploadSuccess: (url: string) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!file) {
      toast.error("Vui lòng chọn file trước");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    toast.success(`Đã tải lên ${title} thành công!`);
    onUploadSuccess(`https://example.com/mock-upload-${Date.now()}.pdf`);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" /> {title}
          </DialogTitle>
        </DialogHeader>
        <div className="py-6 flex flex-col items-center justify-center border-2 border-dashed rounded-xl border-muted-foreground/20 bg-muted/5">
          <input
            type="file"
            className="hidden"
            id="file-upload"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-2">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Upload className="h-6 w-6" />
            </div>
            <span className="text-sm font-medium">
              {file ? file.name : "Chọn file từ máy tính (PDF, DOCX)"}
            </span>
            <span className="text-xs text-muted-foreground">Dung lượng tối đa 10MB</span>
          </label>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleUpload} disabled={loading || !file}>
            {loading ? "Đang tải lên..." : "Tải lên ngay"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────
// 11. MODAL KẾ TOÁN NHẬP TIỀN
// ─────────────────────────────────────────────
export function AccountantPaymentModal({
  open,
  onClose,
  contract,
  stage, // 1 | 2 | 3
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  contract: any;
  stage: 1 | 2 | 3;
  onSuccess: (amount: number) => void;
}) {
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const lead = mockLeads.find((l) => l.customerId === contract.customerId);

  const handle = async () => {
    const numValue = parseFloat(amount);
    if (isNaN(numValue) || numValue <= 0) {
      toast.error("Vui lòng nhập số tiền hợp lệ");
      return;
    }
    if (!contract) {
      toast.error("Không tìm thấy dữ liệu hợp đồng");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    toast.success(`Đã cập nhận thanh toán giai đoạn ${stage}`);
    onSuccess(numValue);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Kế toán: Nhập tiền thanh toán - Giai đoạn {stage}</DialogTitle>
        </DialogHeader>
        {!contract ? (
          <div className="p-8 text-center text-muted-foreground">Không tìm thấy hợp đồng</div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="p-3 bg-primary/5 rounded-lg text-sm flex flex-col gap-1">
              <span className="text-muted-foreground uppercase font-black text-[10px]">
                Đang kiểm tra HĐ
              </span>
              <span className="font-bold">{contract.code}</span>
              <span className="text-xs">
                Tổng giá trị:{" "}
                {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                  contract.value,
                )}
              </span>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-muted-foreground">
                Hồ sơ đính kèm (CEO đã tải lên)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start text-xs h-8"
                  disabled={!lead?.quoteFileUrl}
                  onClick={() => window.open(lead?.quoteFileUrl, "_blank")}
                >
                  <FileText className="h-3.5 w-3.5 mr-1.5 text-orange-500" />
                  {lead?.quoteFileUrl ? "Xem Báo giá" : "Chưa có Báo giá"}
                  {lead?.quoteFileUrl && <ExternalLink className="h-3 w-3 ml-auto opacity-50" />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start text-xs h-8"
                  disabled={!contract.contractFileUrl}
                  onClick={() => window.open(contract.contractFileUrl, "_blank")}
                >
                  <FileText className="h-3.5 w-3.5 mr-1.5 text-blue-500" />
                  {contract.contractFileUrl ? "Xem Hợp đồng" : "Chưa có Hợp đồng"}
                  {contract.contractFileUrl && (
                    <ExternalLink className="h-3 w-3 ml-auto opacity-50" />
                  )}
                </Button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Số tiền thu thực tế (VNĐ)</label>
              <input
                type="number"
                placeholder="Ví dụ: 100000000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
              />
            </div>
            <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-100 rounded text-yellow-800 text-[11px]">
              <AlertCircle className="h-4 w-4 shrink-0" />
              Vui lòng kiểm tra kỹ file báo giá và hợp đồng CEO đã tải lên trước khi nhập số tiền.
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handle} disabled={!contract}>
            Xác nhận & Cập nhật
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────
// 12. MODAL CEO PHÊ DUYỆT TỔNG TIỀN CUỐI
// ─────────────────────────────────────────────
export function CEOFinalApprovalModal({
  open,
  onClose,
  contract,
  enteredTotal,
  onApproved,
}: {
  open: boolean;
  onClose: () => void;
  contract: any;
  enteredTotal: number;
  onApproved: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const result = contract
    ? handleFinalVerification(contract, enteredTotal)
    : { success: false, message: "Dữ liệu hợp đồng không hợp lệ" };
  const lead = contract ? mockLeads.find((l) => l.customerId === contract.customerId) : null;

  const handleApprove = async () => {
    if (!result.success) {
      toast.error(result.message);
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    onApproved();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" /> CEO Đối soát & Phê duyệt quyết toán
          </DialogTitle>
        </DialogHeader>
        {!contract ? (
          <div className="p-8 text-center text-muted-foreground">Không tìm thấy hồ sơ hợp đồng</div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-[10px] font-black uppercase text-muted-foreground mb-1">
                  Giá trị Hợp đồng
                </div>
                <div className="text-sm font-bold">
                  {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                    contract.value,
                  )}
                </div>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                <div className="text-[10px] font-black uppercase text-primary mb-1">
                  Kế toán đã nhập
                </div>
                <div className="text-sm font-bold text-primary">
                  {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                    enteredTotal,
                  )}
                </div>
              </div>
            </div>

            <div className="p-3 border rounded-lg bg-muted/30">
              <div className="text-[10px] font-black uppercase text-muted-foreground mb-2">
                Hồ sơ đối soát
              </div>
              <div className="flex gap-4">
                <a
                  href={lead?.quoteFileUrl}
                  target="_blank"
                  className={`text-xs flex items-center gap-1.5 ${lead?.quoteFileUrl ? "text-primary hover:underline" : "text-muted-foreground pointer-events-none"}`}
                >
                  <FileText className="h-3.5 w-3.5" /> File Báo giá
                </a>
                <a
                  href={contract.contractFileUrl}
                  target="_blank"
                  className={`text-xs flex items-center gap-1.5 ${contract.contractFileUrl ? "text-primary hover:underline" : "text-muted-foreground pointer-events-none"}`}
                >
                  <FileText className="h-3.5 w-3.5" /> File Hợp đồng đã ký
                </a>
              </div>
            </div>

            <div
              className={`p-4 rounded-xl border flex gap-3 ${result.success ? "bg-success/5 border-success/20 text-success" : "bg-destructive/5 border-destructive/20 text-destructive"}`}
            >
              {result.success ? (
                <CheckCircle2 className="h-5 w-5 shrink-0" />
              ) : (
                <AlertCircle className="h-5 w-5 shrink-0" />
              )}
              <div className="text-sm">
                <div className="font-bold mb-0.5">
                  {result.success ? "Khớp số liệu" : "Lệch số liệu"}
                </div>
                <div className="opacity-80">{result.message}</div>
              </div>
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          {contract &&
            (!result.success ? (
              <Button
                variant="destructive"
                onClick={() => toast.info("Đã gửi yêu cầu Kế toán kiểm tra lại hồ sơ.")}
              >
                Yêu cầu Kế toán sửa lại
              </Button>
            ) : (
              <Button className="bg-success hover:bg-success/90" onClick={handleApprove}>
                Phê duyệt & Chuyển Bảo hành
              </Button>
            ))}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function CreateHotlineIncidentModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const activeTenantId = useAppStore((s) => s.activeTenantId);
  const [loading, setLoading] = useState(false);
  const [selectedElevatorId, setSelectedElevatorId] = useState("");
  const [techId, setTechId] = useState("");
  const [issue, setIssue] = useState("");

  const filteredElevators = mockElevators.filter((e) => e.tenantId === activeTenantId);
  const technicians = mockUsers.filter((u) =>
    u.memberships.some(
      (m) =>
        m.tenantId === activeTenantId &&
        (m.permissions.includes("tech_maintenance") || m.permissions.includes("tech_installation")),
    ),
  );

  const handleCreate = async () => {
    if (!selectedElevatorId || !techId || !issue) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const elev = getElevator(selectedElevatorId);

    toast.success(`Đã tạo sự cố khẩn cấp ${elev?.code} và điều động kỹ thuật!`);
    setLoading(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <Phone className="h-5 w-5 animate-pulse" /> TIẾP NHẬN SỰ CỐ HOTLINE
          </DialogTitle>
          <DialogDescription>
            CEO tạo nhanh phiếu sửa chữa khẩn cấp và bàn giao thợ ngay.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-tight">
              Chọn Thang máy báo lỗi
            </label>
            <Select value={selectedElevatorId} onValueChange={setSelectedElevatorId}>
              <SelectTrigger>
                <SelectValue placeholder="-- Chọn thang máy --" />
              </SelectTrigger>
              <SelectContent>
                {filteredElevators.map((e) => (
                  <SelectItem key={e.id} value={e.id}>
                    {e.code} - {e.building}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-tight">
              Mô tả sự cố (HOTLINE)
            </label>
            <Textarea
              placeholder="Khách báo kẹt thang, thang rung lắc mạnh..."
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-tight">
              Điều phối thợ xử lý
            </label>
            <Select value={techId} onValueChange={setTechId}>
              <SelectTrigger>
                <SelectValue placeholder="-- Chọn kỹ thuật viên --" />
              </SelectTrigger>
              <SelectContent>
                {technicians.map((u) => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.name} (Sẵn sàng)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button variant="destructive" onClick={handleCreate} disabled={loading} className="gap-2">
            {loading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            XÁC NHẬN & ĐIỀU PHỐI GẤP
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
