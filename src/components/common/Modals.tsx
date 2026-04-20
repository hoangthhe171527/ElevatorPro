// src/components/common/Modals.tsx
// =====================================================================
// Táº¤T Cáº¢ CÃC MODAL DÃ™NG CHUNG â€” thÃªm vÃ o project
// =====================================================================
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
  type JobType,
  type JobPriority,
  type ContractType,
  type LeadStatus,
  type Job,
  type User,
} from "@/lib/mock-data";
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
} from "lucide-react";

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// 1. MODAL Táº O CÃ”NG VIá»†C Má»šI
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
interface CreateJobModalProps {
  open: boolean;
  onClose: () => void;
  defaultCustomerId?: string;
  defaultElevatorId?: string;
  defaultContractId?: string;
  defaultProjectId?: string;
}

const typeOptions: { value: JobType; label: string }[] = [
  { value: "maintenance", label: "Báº£o trÃ¬ Ä‘á»‹nh ká»³" },
  { value: "repair", label: "Sá»­a chá»¯a" },
  { value: "install", label: "Láº¯p Ä‘áº·t" },
  { value: "inspection", label: "Kháº£o sÃ¡t" },
];

const priorityOptions: { value: JobPriority; label: string }[] = [
  { value: "low", label: "Tháº¥p" },
  { value: "normal", label: "BÃ¬nh thÆ°á»ng" },
  { value: "high", label: "Cao" },
  { value: "urgent", label: "Kháº©n cáº¥p" },
];

export function CreateJobModal({
  open,
  onClose,
  defaultCustomerId = "",
  defaultElevatorId = "",
  defaultContractId = "",
  defaultProjectId = "",
}: CreateJobModalProps) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<JobType>("maintenance");
  const [customerId, setCustomerId] = useState(defaultCustomerId || "");
  const [projectId, setProjectId] = useState(defaultProjectId || "");
  const [elevatorId, setElevatorId] = useState(defaultElevatorId || "");
  const [contractId, setContractId] = useState(defaultContractId || "");
  const [techId, setTechId] = useState("");
  const [scheduledFor, setScheduledFor] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(8, 0, 0, 0);
    return d.toISOString().slice(0, 16);
  });
  const [priority, setPriority] = useState<JobPriority>("normal");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const technicians = mockUsers.filter((u) =>
    u.memberships?.some((m) => m.permissions.includes("field_tech")),
  );
  // Filter elevators belonging to customer's projects
  const customerProjects = mockProjects.filter((p) => p.customerId === customerId);
  const customerProjectIds = customerProjects.map((p) => p.id);
  const customerElevators = customerId
    ? mockElevators.filter((e) => customerProjectIds.includes(e.projectId))
    : mockElevators;
  const customerContracts = mockContracts.filter((c) => c.customerId === customerId);

  const handleSubmit = async () => {
    if (!title.trim() || !customerId || !techId || !scheduledFor) {
      toast.error("Vui lÃ²ng Ä‘iá»n Ä‘áº§y Ä‘á»§ thÃ´ng tin báº¯t buá»™c");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    toast.success(
      `ÄÃ£ táº¡o cÃ´ng viá»‡c "${title}" â€” giao cho ${mockUsers.find((u) => u.id === techId)?.name}`,
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
            <Briefcase className="h-5 w-5 text-primary" /> Táº¡o cÃ´ng viá»‡c má»›i
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* TiÃªu Ä‘á» */}
          <div>
            <label className="text-sm font-medium">
              TiÃªu Ä‘á» cÃ´ng viá»‡c <span className="text-destructive">*</span>
            </label>
            <Input
              className="mt-1"
              placeholder="VD: Báº£o trÃ¬ Ä‘á»‹nh ká»³ thÃ¡ng 5 â€” Vinhomes A1"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">
                Loáº¡i cÃ´ng viá»‡c <span className="text-destructive">*</span>
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
              <label className="text-sm font-medium">Má»©c Æ°u tiÃªn</label>
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

          {/* KhÃ¡ch hÃ ng */}
          <div>
            <label className="text-sm font-medium">
              KhÃ¡ch hÃ ng <span className="text-destructive">*</span>
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
                <SelectValue placeholder="Chá»n khÃ¡ch hÃ ng..." />
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
              <label className="text-sm font-medium">Dá»± Ã¡n liÃªn quan</label>
              <Select
                value={projectId || "none"}
                onValueChange={(v) => {
                  setProjectId(v === "none" ? "" : v);
                  setElevatorId("");
                }}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Chá»n dá»± Ã¡n..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">â€” KhÃ´ng chá»n â€”</SelectItem>
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
                <label className="text-sm font-medium">Thang mÃ¡y (náº¿u cÃ³)</label>
                <Select
                  value={elevatorId || "none"}
                  onValueChange={(v) => setElevatorId(v === "none" ? "" : v)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Chá»n thang..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">â€” KhÃ´ng chá»n â€”</SelectItem>
                    {customerElevators.map((e) => (
                      <SelectItem key={e.id} value={e.id}>
                        {e.code} â€” {e.building}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Há»£p Ä‘á»“ng liÃªn quan</label>
                <Select
                  value={contractId || "none"}
                  onValueChange={(v) => setContractId(v === "none" ? "" : v)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Chá»n HÄ..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">â€” KhÃ´ng chá»n â€”</SelectItem>
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
                Ká»¹ thuáº­t viÃªn phá»¥ trÃ¡ch <span className="text-destructive">*</span>
              </label>
              <Select value={techId} onValueChange={setTechId}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Chá»n ká»¹ thuáº­t..." />
                </SelectTrigger>
                <SelectContent>
                  {technicians.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">
                NgÃ y giá» thá»±c hiá»‡n <span className="text-destructive">*</span>
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
            <label className="text-sm font-medium">MÃ´ táº£ / Ghi chÃº</label>
            <Textarea
              className="mt-1"
              placeholder="MÃ´ táº£ chi tiáº¿t cÃ´ng viá»‡c cáº§n thá»±c hiá»‡n..."
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Há»§y
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Äang táº¡o..." : "Táº¡o cÃ´ng viá»‡c"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// 2. MODAL Cáº¬P NHáº¬T TRáº NG THÃI CÃ”NG VIá»†C
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
interface UpdateJobStatusModalProps {
  open: boolean;
  onClose: () => void;
  jobTitle: string;
  currentStatus: string;
  onConfirm: (newStatus: string, note: string) => void;
}

const jobStatusOptions = [
  { value: "pending", label: "â³ Chá» xá»­ lÃ½" },
  { value: "scheduled", label: "ðŸ“… ÄÃ£ lÃªn lá»‹ch" },
  { value: "in_progress", label: "ðŸ”§ Äang thá»±c hiá»‡n" },
  { value: "completed", label: "âœ… HoÃ n thÃ nh" },
  { value: "cancelled", label: "âŒ Há»§y" },
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
      toast.info("Tráº¡ng thÃ¡i khÃ´ng thay Ä‘á»•i");
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
          <DialogTitle>Cáº­p nháº­t tráº¡ng thÃ¡i cÃ´ng viá»‡c</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <p className="text-sm text-muted-foreground">
            CÃ´ng viá»‡c: <span className="font-medium text-foreground">{jobTitle}</span>
          </p>
          <div>
            <label className="text-sm font-medium">Tráº¡ng thÃ¡i má»›i</label>
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
            <label className="text-sm font-medium">Ghi chÃº (khÃ´ng báº¯t buá»™c)</label>
            <Textarea
              className="mt-1"
              placeholder="VD: ÄÃ£ hoÃ n táº¥t thay tháº¿ biáº¿n táº§n..."
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
          {newStatus === "completed" && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-success/10 text-success text-sm">
              <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
              BiÃªn báº£n sáº½ Ä‘Æ°á»£c tá»± Ä‘á»™ng gá»­i Ä‘áº¿n khÃ¡ch hÃ ng khi hoÃ n thÃ nh.
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Há»§y
          </Button>
          <Button onClick={handle}>XÃ¡c nháº­n cáº­p nháº­t</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// 3. MODAL GHI NHáº¬N THANH TOÃN
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
      toast.error("Vui lÃ²ng nháº­p sá»‘ tiá»n");
      return;
    }
    if (numAmount > remaining) {
      toast.error("Sá»‘ tiá»n vÆ°á»£t quÃ¡ sá»‘ cÃ²n ná»£");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setLoading(false);
    toast.success(`ÄÃ£ ghi nháº­n thu ${formatVND(numAmount)} â€” há»£p Ä‘á»“ng ${contractCode}`);
    setAmount("");
    setNote("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Banknote className="h-5 w-5 text-success" /> Ghi nháº­n thanh toÃ¡n
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="p-3 rounded-lg bg-muted/50 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Há»£p Ä‘á»“ng</span>
              <span className="font-medium">{contractCode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tá»•ng giÃ¡ trá»‹</span>
              <span className="font-medium">{formatVND(totalValue)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">ÄÃ£ thu</span>
              <span className="text-success font-medium">{formatVND(alreadyPaid)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">CÃ²n ná»£</span>
              <span className="text-warning-foreground font-semibold">{formatVND(remaining)}</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">
              Sá»‘ tiá»n thu (VNÄ) <span className="text-destructive">*</span>
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
              <label className="text-sm font-medium">HÃ¬nh thá»©c</label>
              <Select value={method} onValueChange={setMethod}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="transfer">Chuyá»ƒn khoáº£n</SelectItem>
                  <SelectItem value="cash">Tiá»n máº·t</SelectItem>
                  <SelectItem value="check">SÃ©c</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">NgÃ y thu</label>
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
                <span className="text-muted-foreground">Tiáº¿n Ä‘á»™ sau khi ghi nháº­n</span>
                <span className="font-medium">{newPercent}%</span>
              </div>
              <Progress value={newPercent} className="h-2" />
            </div>
          )}

          <div>
            <label className="text-sm font-medium">Ghi chÃº</label>
            <Input
              className="mt-1"
              placeholder="VD: Äá»£t 2 theo tiáº¿n Ä‘á»™"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Há»§y
          </Button>
          <Button onClick={handle} disabled={loading} className="bg-success hover:bg-success/90">
            {loading ? "Äang lÆ°u..." : "Ghi nháº­n thu tiá»n"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// 4. MODAL CHUYá»‚N LEAD â†’ KHÃCH HÃ€NG
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
interface ConvertLeadModalProps {
  open: boolean;
  onClose: () => void;
  lead: {
    id: string;
    name: string;
    phone: string;
    email: string;
    address: string;
  };
}

export function ConvertLeadModal({ open, onClose, lead }: ConvertLeadModalProps) {
  const [name, setName] = useState(lead.name);
  const [contactPerson, setContactPerson] = useState(lead.name);
  const [phone, setPhone] = useState(lead.phone);
  const [email, setEmail] = useState(lead.email);
  const [address, setAddress] = useState(lead.address);
  const [type, setType] = useState<"business" | "individual">("business");
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    if (!name.trim() || !phone.trim()) {
      toast.error("Vui lÃ²ng nháº­p tÃªn vÃ  sá»‘ Ä‘iá»‡n thoáº¡i");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);
    toast.success(`ÄÃ£ chuyá»ƒn lead thÃ nh khÃ¡ch hÃ ng: "${name}" â€” cÃ³ thá»ƒ táº¡o há»£p Ä‘á»“ng ngay`);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCog className="h-5 w-5 text-primary" /> Chuyá»ƒn Lead thÃ nh KhÃ¡ch hÃ ng
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="p-3 rounded-lg bg-primary/5 text-sm text-primary">
            Lead "<span className="font-medium">{lead.name}</span>" sáº½ Ä‘Æ°á»£c chuyá»ƒn sang danh sÃ¡ch
            KhÃ¡ch hÃ ng. Kiá»ƒm tra vÃ  bá»• sung thÃ´ng tin bÃªn dÆ°á»›i.
          </div>
          <div>
            <label className="text-sm font-medium">Loáº¡i khÃ¡ch hÃ ng</label>
            <Select value={type} onValueChange={(v) => setType(v as "business" | "individual")}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="business">Doanh nghiá»‡p / TÃ²a nhÃ </SelectItem>
                <SelectItem value="individual">CÃ¡ nhÃ¢n / Há»™ gia Ä‘Ã¬nh</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">
              TÃªn {type === "business" ? "cÃ´ng ty / tÃ²a nhÃ " : "khÃ¡ch hÃ ng"}{" "}
              <span className="text-destructive">*</span>
            </label>
            <Input className="mt-1" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">NgÆ°á»i liÃªn há»‡</label>
              <Input
                className="mt-1"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">
                Sá»‘ Ä‘iá»‡n thoáº¡i <span className="text-destructive">*</span>
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
            <label className="text-sm font-medium">Äá»‹a chá»‰</label>
            <Input className="mt-1" value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Há»§y
          </Button>
          <Button onClick={handle} disabled={loading}>
            {loading ? "Äang chuyá»ƒn..." : "XÃ¡c nháº­n chuyá»ƒn KH"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// 5. MODAL Táº O Há»¢P Äá»’NG
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
interface CreateContractModalProps {
  open: boolean;
  onClose: () => void;
  defaultCustomerId?: string;
}

export function CreateContractModal({
  open,
  onClose,
  defaultCustomerId = "",
}: CreateContractModalProps) {
  const [customerId, setCustomerId] = useState(defaultCustomerId);
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

  const autoCode = `HD-${new Date().getFullYear()}-${String(mockContracts.length + 1).padStart(4, "0")}`;

  const handle = async () => {
    if (!customerId || !value || !items.trim()) {
      toast.error("Vui lÃ²ng Ä‘iá»n Ä‘áº§y Ä‘á»§ cÃ¡c trÆ°á»ng báº¯t buá»™c");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    toast.success(`ÄÃ£ táº¡o há»£p Ä‘á»“ng ${autoCode} â€” Há»‡ thá»‘ng sáº½ tá»± sinh cÃ´ng viá»‡c theo lá»‹ch há»£p Ä‘á»“ng`);
    onClose();
  };

  const contractTypeOptions: { value: ContractType; label: string }[] = [
    { value: "maintenance", label: "Báº£o trÃ¬ Ä‘á»‹nh ká»³" },
    { value: "install", label: "Láº¯p Ä‘áº·t" },
    { value: "repair", label: "Sá»­a chá»¯a / Cáº£i táº¡o" },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" /> Táº¡o há»£p Ä‘á»“ng má»›i
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="flex items-center gap-2 p-2 rounded bg-muted/50 text-xs text-muted-foreground">
            MÃ£ há»£p Ä‘á»“ng (tá»± Ä‘á»™ng):{" "}
            <span className="font-mono font-semibold text-foreground ml-1">{autoCode}</span>
          </div>
          <div>
            <label className="text-sm font-medium">
              KhÃ¡ch hÃ ng <span className="text-destructive">*</span>
            </label>
            <Select value={customerId} onValueChange={setCustomerId}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Chá»n khÃ¡ch hÃ ng..." />
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
            <label className="text-sm font-medium">Loáº¡i há»£p Ä‘á»“ng</label>
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
              GiÃ¡ trá»‹ há»£p Ä‘á»“ng (VNÄ) <span className="text-destructive">*</span>
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
              <label className="text-sm font-medium">NgÃ y báº¯t Ä‘áº§u</label>
              <Input
                type="date"
                className="mt-1"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">NgÃ y káº¿t thÃºc</label>
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
              Háº¡ng má»¥c dá»‹ch vá»¥ <span className="text-destructive">*</span>
            </label>
            <Textarea
              className="mt-1"
              placeholder="VD: Báº£o trÃ¬ 4 thang Mitsubishi Ä‘á»‹nh ká»³ 1 thÃ¡ng/láº§n"
              rows={2}
              value={items}
              onChange={(e) => setItems(e.target.value)}
            />
          </div>
          {type === "maintenance" && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-info/10 text-info text-sm">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              Há»£p Ä‘á»“ng báº£o trÃ¬ sáº½ tá»± Ä‘á»™ng sinh cÃ´ng viá»‡c theo chu ká»³ sau khi táº¡o.
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Há»§y
          </Button>
          <Button onClick={handle} disabled={loading}>
            {loading ? "Äang táº¡o..." : "Táº¡o há»£p Ä‘á»“ng"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// 6. MODAL THÃŠM THANG MÃY
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
    : "â€”";

  const handle = async () => {
    if (!customerId || !building || !model) {
      toast.error("Vui lÃ²ng Ä‘iá»n Ä‘áº§y Ä‘á»§ thÃ´ng tin");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setLoading(false);
    toast.success(`ÄÃ£ thÃªm thang mÃ¡y ${autoCode} â€” ${brand} ${model} táº¡i ${building}`);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" /> ThÃªm thang mÃ¡y má»›i
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div>
            <label className="text-sm font-medium">
              KhÃ¡ch hÃ ng <span className="text-destructive">*</span>
            </label>
            <Select value={customerId} onValueChange={setCustomerId}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Chá»n khÃ¡ch hÃ ng..." />
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
              MÃ£ thang tá»± Ä‘á»™ng:{" "}
              <span className="font-mono font-semibold text-foreground">{autoCode}</span>
            </div>
          )}
          <div>
            <label className="text-sm font-medium">
              TÃªn tÃ²a nhÃ  / vá»‹ trÃ­ <span className="text-destructive">*</span>
            </label>
            <Input
              className="mt-1"
              placeholder="VD: TÃ²a A1, MÆ°á»ng Thanh HÃ  ÄÃ´ng..."
              value={building}
              onChange={(e) => setBuilding(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">HÃ£ng sáº£n xuáº¥t</label>
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
              <label className="text-sm font-medium">Sá»‘ táº§ng</label>
              <Input
                type="number"
                className="mt-1"
                min={1}
                value={floors}
                onChange={(e) => setFloors(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Báº£o hÃ nh (nÄƒm)</label>
              <Input
                type="number"
                className="mt-1"
                min={1}
                value={warrantyYears}
                onChange={(e) => setWarrantyYears(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Chu ká»³ BT (thÃ¡ng)</label>
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
            <label className="text-sm font-medium">NgÃ y láº¯p Ä‘áº·t</label>
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
            Há»§y
          </Button>
          <Button onClick={handle} disabled={loading}>
            {loading ? "Äang thÃªm..." : "ThÃªm thang mÃ¡y"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// 7. MODAL THÃŠM KHÃCH HÃ€NG Má»šI
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
      toast.error("Vui lÃ²ng nháº­p tÃªn vÃ  sá»‘ Ä‘iá»‡n thoáº¡i");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setLoading(false);
    toast.success(`ÄÃ£ thÃªm khÃ¡ch hÃ ng "${name}"`);
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
            <UserIcon className="h-5 w-5 text-primary" /> ThÃªm khÃ¡ch hÃ ng má»›i
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div>
            <label className="text-sm font-medium">Loáº¡i khÃ¡ch hÃ ng</label>
            <Select value={type} onValueChange={(v) => setType(v as "business" | "individual")}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="business">Doanh nghiá»‡p / TÃ²a nhÃ </SelectItem>
                <SelectItem value="individual">CÃ¡ nhÃ¢n / Há»™ gia Ä‘Ã¬nh</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">
              TÃªn {type === "business" ? "cÃ´ng ty / tÃ²a nhÃ " : "khÃ¡ch hÃ ng"}{" "}
              <span className="text-destructive">*</span>
            </label>
            <Input
              className="mt-1"
              placeholder={
                type === "business" ? "VD: Vinhomes Ocean Park" : "VD: Anh Nguyá»…n VÄƒn An"
              }
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">NgÆ°á»i liÃªn há»‡</label>
              <Input
                className="mt-1"
                placeholder="TÃªn ngÆ°á»i liÃªn há»‡"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">
                Sá»‘ Ä‘iá»‡n thoáº¡i <span className="text-destructive">*</span>
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
            <label className="text-sm font-medium">Äá»‹a chá»‰</label>
            <Input
              className="mt-1"
              placeholder="Äá»‹a chá»‰ Ä‘áº§y Ä‘á»§"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Há»§y
          </Button>
          <Button onClick={handle} disabled={loading}>
            {loading ? "Äang thÃªm..." : "ThÃªm khÃ¡ch hÃ ng"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// 8. MODAL NHáº¬P KHO Váº¬T TÆ¯
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
      toast.error("Sá»‘ lÆ°á»£ng pháº£i lá»›n hÆ¡n 0");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    setLoading(false);
    toast.success(`ÄÃ£ nháº­p ${qty} ${itemName} vÃ o kho`);
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
          <DialogTitle>Nháº­p kho váº­t tÆ°</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          {itemName && (
            <div className="p-2 rounded bg-muted/50 text-sm">
              Váº­t tÆ°: <span className="font-medium">{itemName}</span>
              {itemCode && (
                <span className="text-muted-foreground ml-2 font-mono text-xs">{itemCode}</span>
              )}
            </div>
          )}
          <div>
            <label className="text-sm font-medium">
              Sá»‘ lÆ°á»£ng nháº­p <span className="text-destructive">*</span>
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
            <label className="text-sm font-medium">NhÃ  cung cáº¥p</label>
            <Input
              className="mt-1"
              placeholder="TÃªn nhÃ  cung cáº¥p"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Sá»‘ hÃ³a Ä‘Æ¡n</label>
            <Input
              className="mt-1"
              placeholder="VD: INV-2026-001"
              value={invoiceNo}
              onChange={(e) => setInvoiceNo(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Ghi chÃº</label>
            <Input
              className="mt-1"
              placeholder="Ghi chÃº náº¿u cÃ³"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Há»§y
          </Button>
          <Button onClick={handle} disabled={loading}>
            {loading ? "Äang lÆ°u..." : "XÃ¡c nháº­n nháº­p kho"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// 9. MODAL XÃC NHáº¬N Lá»ŠCH (Portal khÃ¡ch hÃ ng)
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
    toast.success("ÄÃ£ xÃ¡c nháº­n lá»‹ch â€” Ká»¹ thuáº­t viÃªn sáº½ Ä‘áº¿n Ä‘Ãºng giá»");
    onClose();
  };

  const handleReschedule = () => {
    toast.info("YÃªu cáº§u Ä‘á»•i lá»‹ch Ä‘Ã£ Ä‘Æ°á»£c ghi nháº­n â€” NhÃ¢n viÃªn sáº½ liÃªn há»‡ trong 30 phÃºt");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>XÃ¡c nháº­n lá»‹ch báº£o trÃ¬</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <div className="font-medium">{jobTitle}</div>
            <div className="text-sm text-muted-foreground mt-1">{scheduledFor}</div>
          </div>
          <p className="text-sm text-muted-foreground">
            Vui lÃ²ng xÃ¡c nháº­n báº¡n cÃ³ thá»ƒ tiáº¿p Ä‘Ã³n ká»¹ thuáº­t viÃªn vÃ o thá»i Ä‘iá»ƒm trÃªn. Náº¿u cáº§n thay
            Ä‘á»•i, nháº¥n "Äá»•i lá»‹ch".
          </p>
          <div>
            <label className="text-sm font-medium">Ghi chÃº cho ká»¹ thuáº­t viÃªn (náº¿u cÃ³)</label>
            <Textarea
              className="mt-1"
              placeholder="VD: Gá»i trÆ°á»›c 30 phÃºt, vÃ o cá»•ng B..."
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleReschedule} className="sm:mr-auto">
            Äá» xuáº¥t Ä‘á»•i ngÃ y
          </Button>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Há»§y
          </Button>
          <Button onClick={handle} disabled={loading}>
            {loading ? "Äang xÃ¡c nháº­n..." : "âœ“ Äá»“ng Ã½ lá»‹ch"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// 10. MODAL THÃŠM LEAD Má»šI
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
interface CreateLeadModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateLeadModal({ open, onClose }: CreateLeadModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [source, setSource] = useState("Website");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    if (!name.trim() || !phone.trim()) {
      toast.error("Vui lÃ²ng nháº­p tÃªn vÃ  sá»‘ Ä‘iá»‡n thoáº¡i lead");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setLoading(false);
    toast.success(`ÄÃ£ thÃªm lead má»›i: "${name}"`);
    setName("");
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
            <UserCog className="h-5 w-5 text-primary" /> ThÃªm Lead Má»›i
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div>
            <label className="text-sm font-medium">
              TÃªn khÃ¡ch hÃ ng / Tá»• chá»©c <span className="text-destructive">*</span>
            </label>
            <Input
              className="mt-1"
              placeholder="VD: TÃ²a nhÃ  Sunshine"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">
                Sá»‘ Ä‘iá»‡n thoáº¡i <span className="text-destructive">*</span>
              </label>
              <Input
                className="mt-1"
                placeholder="0901 234 567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Nguá»“n liÃªn há»‡</label>
              <Select value={source} onValueChange={setSource}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Website">Website</SelectItem>
                  <SelectItem value="Facebook Ads">Facebook Ads</SelectItem>
                  <SelectItem value="Giá»›i thiá»‡u">KhÃ¡ch giá»›i thiá»‡u</SelectItem>
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
            <label className="text-sm font-medium">Äá»‹a chá»‰</label>
            <Input
              className="mt-1"
              placeholder="Äá»‹a chá»‰ dá»± kiáº¿n láº¯p Ä‘áº·t/báº£o trÃ¬"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Ghi chÃº nhu cáº§u</label>
            <Textarea
              className="mt-1"
              placeholder="VD: KhÃ¡ch cáº§n láº¯p 2 thang mÃ¡y gia Ä‘Ã¬nh 5 táº§ng"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Há»§y
          </Button>
          <Button onClick={handle} disabled={loading}>
            {loading ? "Äang thÃªm..." : "ThÃªm Lead"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// 11. MODAL ÄIá»€U PHá»I (DISPATCH)
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
interface DispatchJobModalProps {
  open: boolean;
  onClose: () => void;
  job: Job;
  onDispatch: (jobId: string, techId: string) => void;
}

export function DispatchJobModal({ open, onClose, job, onDispatch }: DispatchJobModalProps) {
  const [techId, setTechId] = useState("");
  const [loading, setLoading] = useState(false);

  const technicians = mockUsers.filter((u) =>
    u.memberships?.some((m) => m.permissions.includes("field_tech")),
  );

  const handle = async () => {
    if (!techId) {
      toast.error("Vui lÃ²ng chá»n ká»¹ thuáº­t viÃªn Ä‘á»ƒ phÃ¢n cÃ´ng");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    onDispatch(job.id, techId);
    toast.success(`ÄÃ£ giao viá»‡c cho ${mockUsers.find((u) => u.id === techId)?.name}`);
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
            <Briefcase className="h-5 w-5 text-primary" /> PhÃ¢n cÃ´ng cÃ´ng viá»‡c (Dispatch)
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
              Ká»¹ thuáº­t viÃªn phá»¥ trÃ¡ch <span className="text-destructive">*</span>
            </label>
            <Select value={techId} onValueChange={setTechId}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Chá»n thá»£ Ä‘ang ráº£nh..." />
              </SelectTrigger>
              <SelectContent>
                {technicians.map((u) => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1.5 flex items-start gap-1">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-info" />
              Giao viá»‡c sáº½ chuyá»ƒn tráº¡ng thÃ¡i cÃ´ng viá»‡c sang "ÄÃ£ lÃªn lá»‹ch" vÃ  bÃ¡o cho thá»£.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Há»§y
          </Button>
          <Button onClick={handle} disabled={loading}>
            {loading ? "Äang phÃ¢n cÃ´ng..." : "XÃ¡c nháº­n Dispatch"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// 12. MODAL THANH TOÃN LÆ¯Æ NG
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
      `ÄÃ£ thanh toÃ¡n tá»•ng cá»™ng ${new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(total)} cho ${users.length} nhÃ¢n viÃªn`,
    );
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-success">
            <Wallet className="h-5 w-5" /> XÃ¡c nháº­n thanh toÃ¡n lÆ°Æ¡ng
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="p-4 rounded-xl bg-success/5 border border-success/20 text-center">
            <div className="text-sm text-muted-foreground uppercase tracking-wider">
              Tá»•ng quá»¹ lÆ°Æ¡ng tráº£ Ä‘á»£t nÃ y
            </div>
            <div className="text-3xl font-bold text-success mt-1">
              {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(total)}
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              Dá»± kiáº¿n chi tráº£ cho {users.length} nhÃ¢n sá»±
            </div>
          </div>
          <p className="text-sm text-balance text-center text-muted-foreground">
            Há»‡ thá»‘ng sáº½ thá»±c hiá»‡n lá»‡nh chuyá»ƒn khoáº£n hÃ ng loáº¡t Ä‘áº¿n tÃ i khoáº£n ngÃ¢n hÃ ng cá»§a tá»«ng nhÃ¢n
            sá»±. HÃ nh Ä‘á»™ng nÃ y khÃ´ng thá»ƒ hoÃ n tÃ¡c.
          </p>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} disabled={loading} className="flex-1">
            Há»§y
          </Button>
          <Button
            onClick={handle}
            disabled={loading}
            className="flex-1 bg-success hover:bg-success/90"
          >
            {loading ? "Äang xá»­ lÃ½..." : "XÃ¡c nháº­n Chi tráº£"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// 13. MODAL TÃI KÃ Há»¢P Äá»’NG
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
interface RenewContractModalProps {
  open: boolean;
  onClose: () => void;
  contractCode: string;
}

export function RenewContractModal({ open, onClose, contractCode }: RenewContractModalProps) {
  const [loading, setLoading] = useState(false);
  const [newTotal, setNewTotal] = useState("0");

  const handle = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    toast.success(`ÄÃ£ táº¡o báº£n nhÃ¡p tÃ¡i kÃ½ cho HÄ ${contractCode}`);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-primary" /> TÃ¡i kÃ½ há»£p Ä‘á»“ng
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="text-sm">
            Báº¡n Ä‘ang yÃªu cáº§u táº¡o báº£n nhÃ¡p tÃ¡i kÃ½ cho há»£p Ä‘á»“ng{" "}
            <span className="font-bold underline">{contractCode}</span>.
          </div>
          <div>
            <label className="text-sm font-medium">GiÃ¡ trá»‹ há»£p Ä‘á»“ng má»›i dá»± kiáº¿n (VND)</label>
            <Input
              type="number"
              className="mt-1"
              placeholder="VD: 50000000"
              value={newTotal}
              onChange={(e) => setNewTotal(e.target.value)}
            />
          </div>
          <p className="text-xs text-muted-foreground italic">
            * Sau khi xÃ¡c nháº­n, há»‡ thá»‘ng sáº½ sinh 1 há»£p Ä‘á»“ng nhÃ¡p má»›i vá»›i cÃ¡c thÃ´ng tin káº¿ thá»«a vÃ 
            chuyá»ƒn sang tráº¡ng thÃ¡i "ThÆ°Æ¡ng tháº£o".
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Há»§y
          </Button>
          <Button onClick={handle} disabled={loading}>
            {loading ? "Äang táº¡o..." : "XÃ¡c nháº­n táº¡o nhÃ¡p"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// 14. MODAL CHUYá»‚N KHO
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function TransferInventoryModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [target, setTarget] = useState("");

  const handle = async () => {
    if (!target) {
      toast.error("Vui lÃ²ng nháº­p kho Ä‘Ã­ch");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    toast.success(`Lá»‡nh chuyá»ƒn kho Ä‘Ã£ Ä‘Æ°á»£c táº¡o â€” Äang chá» kho Ä‘Ã­ch xÃ¡c nháº­n`);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5 text-primary" /> YÃªu cáº§u chuyá»ƒn kho
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <label className="text-sm font-medium">Kho Ä‘Ã­ch</label>
            <Select value={target} onValueChange={setTarget}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Chá»n kho nháº­n..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Kho B - HÃ  ÄÃ´ng">Kho B - HÃ  ÄÃ´ng</SelectItem>
                <SelectItem value="Kho C - Gia LÃ¢m">Kho C - Gia LÃ¢m</SelectItem>
                <SelectItem value="Kho Mobile - Ká»¹ thuáº­t">Kho Mobile - Xe ká»¹ thuáº­t 01</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">Ghi chÃº váº­n chuyá»ƒn</label>
            <Input className="mt-1" placeholder="LÃ½ do chuyá»ƒn..." />
          </div>
          <p className="text-xs text-muted-foreground">
            * Sau khi xÃ¡c nháº­n, sá»‘ lÆ°á»£ng váº­t tÆ° sáº½ Ä‘Æ°á»£c Ä‘Æ°a vÃ o tráº¡ng thÃ¡i "Äang trung chuyá»ƒn" vÃ 
            trá»« khá»i kho hiá»‡n táº¡i.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Há»§y
          </Button>
          <Button onClick={handle} disabled={loading}>
            {loading ? "Äang xá»­ lÃ½..." : "XÃ¡c nháº­n chuyá»ƒn"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

