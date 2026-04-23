// src/routes/qr.$elevatorId.tsx  ← THAY THẾ FILE CŨ
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/common/StatusBadge";;
import { elevatorStatusLabel, elevatorStatusVariant } from "@/lib/status-variants";
import {
  mockElevators,
  mockJobs,
  mockIssues,
  getCustomer,
  getProject,
  getUser,
  formatDate,
  formatDateTime,
  type IssueReport,
} from "@/lib/mock-data";
import { useAppStore, useCurrentPermissions } from "@/lib/store";
import {
  Building2,
  AlertTriangle,
  Info,
  Phone,
  Send,
  CheckCircle2,
  Camera,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Shield,
  Calendar,
  Wrench,
  Cog,
  RefreshCw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export const Route = createFileRoute("/qr/$elevatorId")({
  loader: ({ params }) => {
    const elevator = mockElevators.find((e) => e.id === params.elevatorId);
    if (!elevator) throw notFound();
    return { elevator };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.elevator.code ?? "Thang"} — ElevatorPro` }],
  }),
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="p-8 text-center max-w-sm w-full">
        <Building2 className="mx-auto h-12 w-12 text-muted-foreground/30 mb-3" />
        <p className="font-semibold">Không tìm thấy thang máy</p>
        <p className="text-sm text-muted-foreground mt-1">
          Mã QR không hợp lệ hoặc đã hết hiệu lực
        </p>
        <a href="tel:19001234">
          <Button className="mt-4 w-full gap-2">
            <Phone className="h-4 w-4" /> Gọi 1900 1234
          </Button>
        </a>
      </Card>
    </div>
  ),
  component: QRPage,
});

// ─── Step types ───────────────────────────────────────────────
type Step = "home" | "report" | "info" | "success";

const issueTypes = [
  "Thang không di chuyển",
  "Cửa đóng mở bất thường",
  "Thang rung lắc, tiếng kêu lạ",
  "Dừng không đúng tầng",
  "Đèn cabin hỏng",
  "Nút bấm không phản hồi",
  "Kẹt người trong thang",
  "Vấn đề khác",
];

// ─── Main component ───────────────────────────────────────────
function QRPage() {
  const { elevator } = Route.useLoaderData();
  const project = getProject(elevator.projectId);
  const customer = project ? getCustomer(project.customerId) : undefined;
  const history = mockJobs
    .filter((j) => j.elevatorId === elevator.id && j.status === "completed")
    .sort((a, b) => b.scheduledFor.localeCompare(a.scheduledFor))
    .slice(0, 5);

  const activeJob = mockJobs
    .filter(
      (j) =>
        j.elevatorId === elevator.id &&
        (j.status === "pending" || j.status === "scheduled" || j.status === "in_progress") &&
        (j.type === "repair" || j.type === "maintenance"),
    )
    .sort((a, b) => b.scheduledFor.localeCompare(a.scheduledFor))[0];

  const assignedTech = activeJob && activeJob.assignedTo ? getUser(activeJob.assignedTo) : null;

  const [step, setStep] = useState<Step>("home");
  const [historyOpen, setHistoryOpen] = useState(false);

  const permissions = useCurrentPermissions();
  const isStaff = permissions.length > 0;
  const isAdmin = permissions.some((p) =>
    [
      "tech_manager",
      "tech_manager",
      "sales",
      "sales_admin",
      "service_dispatcher",
      "service_dispatcher",
      "accountant",
      "tech_manager",
      "tech_maintenance_lead",
      "tech_maintenance",
      "tech_installation_lead",
      "tech_installation",
      "tech_survey",
    ].includes(p),
  );

  // Report form state
  const [issueType, setIssueType] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [photoCount, setPhotoCount] = useState(0);
  const [ticketNo, setTicketNo] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Verification state
  const [isVerified, setIsVerified] = useState(false);
  const [last6Digits, setLast6Digits] = useState("");
  const [verifying, setVerifying] = useState(false);

  const handleVerify = async () => {
    if (last6Digits.length < 6) {
      toast.error("Vui lòng nhập đủ 6 số");
      return;
    }
    setVerifying(true);
    await new Promise((r) => setTimeout(r, 600));
    setVerifying(false);

    const correctDigits = (customer?.phone || "").replace(/\D/g, "").slice(-6);
    if (last6Digits === correctDigits) {
      setIsVerified(true);
      toast.success("Xác thực chủ thang thành công!");
    } else {
      toast.error("Mã xác thực không đúng. Vui lòng kiểm tra lại số điện thoại đăng ký.");
    }
  };

  const isUrgent = issueType === "Kẹt người trong thang";

  const handleSubmit = async () => {
    if (!issueType) {
      toast.error("Vui lòng chọn loại sự cố");
      return;
    }
    if (!phone.trim()) {
      toast.error("Vui lòng nhập số điện thoại liên hệ");
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));
    setSubmitting(false);
    setTicketNo(`YC-${Date.now().toString().slice(-6)}`);
    setStep("success");
  };

  const handleReset = () => {
    setStep("home");
    setIssueType("");
    setDescription("");
    setPhone("");
    setPhotoCount(0);
    setTicketNo("");
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-sidebar text-sidebar-foreground sticky top-0 z-10">
        <div className="container max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          {step !== "home" && (
            <button
              onClick={() => setStep("home")}
              className="text-sidebar-foreground/70 hover:text-sidebar-foreground"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary shrink-0">
            <Cog className="h-4 w-4 text-sidebar-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm">ElevatorPro</div>
            <div className="text-[11px] text-sidebar-foreground/60 font-mono">{elevator.code}</div>
          </div>
          <a
            href="tel:19001234"
            className="flex items-center gap-1.5 bg-destructive text-white text-xs px-3 py-1.5 rounded-full font-semibold shrink-0 hover:bg-destructive/90"
          >
            <Phone className="h-3 w-3" /> 1900 1234
          </a>
        </div>
      </header>

      <div className="container max-w-lg mx-auto px-4 py-5">
        {/* ── STEP: VERIFICATION (MANDATORY) ── */}
        {!isVerified && (
          <div className="space-y-6 py-8 animate-in fade-in zoom-in duration-500">
            <div className="text-center space-y-2">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-primary/20">
                <Shield size={32} className="text-primary" />
              </div>
              <h2 className="text-2xl font-black tracking-tight">Xác thực chủ sở hữu</h2>
              <p className="text-sm text-muted-foreground px-6">
                Vui lòng nhập 6 số cuối của số điện thoại đã đăng ký với hệ thống để xem thông tin
                chi tiết thang máy.
              </p>
            </div>

            <Card className="p-6 shadow-xl border-t-4 border-t-primary">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Mã xác thực (6 số cuối SĐT)
                  </label>
                  <Input
                    type="password"
                    pattern="[0-9]*"
                    inputMode="numeric"
                    placeholder="••••••"
                    className="text-center text-2xl h-14 tracking-[0.5em] font-black"
                    maxLength={6}
                    value={last6Digits}
                    onChange={(e) => setLast6Digits(e.target.value.replace(/\D/g, ""))}
                  />
                </div>
                <Button
                  className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 font-bold shadow-lg shadow-primary/20"
                  onClick={handleVerify}
                  disabled={verifying}
                >
                  {verifying ? (
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                  )}
                  XÁC NHẬN TRUY CẬP
                </Button>
              </div>
            </Card>

            <div className="text-center">
              <a
                href="tel:19001234"
                className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-2"
              >
                <Phone size={14} /> Bạn gặp khó khăn? Liên hệ 1900 1234
              </a>
            </div>
          </div>
        )}

        {/* ── STEP: AUTHENTICATED DASHBOARD ── */}
        {isVerified && (step === "home" || step === "info") && (
          <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
            {/* Elevator hero */}
            <Card className="p-5 text-center bg-gradient-to-br from-sidebar to-sidebar/90 text-sidebar-foreground relative overflow-hidden shadow-xl border-0">
              <div className="relative z-10">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 mb-3 backdrop-blur-sm">
                  <Building2 className="h-6 w-6" />
                </div>
                <h1 className="text-2xl font-black font-mono tracking-tighter">{elevator.code}</h1>
                <p className="text-xs opacity-70 font-medium">{elevator.building}</p>
                <div className="mt-3 flex justify-center">
                  <StatusBadge
                    variant={elevatorStatusVariant[elevator.status]}
                    className="bg-white/10 border-white/20 text-white backdrop-blur-sm"
                  >
                    {elevatorStatusLabel[elevator.status]}
                  </StatusBadge>
                </div>
              </div>
            </Card>

            {/* Upcoming Schedule */}
            <Card className="p-4 border-l-4 border-l-primary bg-primary/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase text-muted-foreground leading-none mb-1">
                      Lịch bảo trì tiếp theo
                    </div>
                    <div className="text-sm font-black text-primary">
                      {formatDate(elevator.nextMaintenance)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-bold text-muted-foreground uppercase leading-none mb-1">
                    Trạng thái
                  </div>
                  <Badge variant="outline" className="text-[10px] bg-white">
                    Sắp tới
                  </Badge>
                </div>
              </div>
            </Card>

            {/* 2 main actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setStep("report")}
                className="group flex flex-col items-center gap-3 p-5 rounded-2xl border-2 border-destructive/20 bg-destructive/[0.02] hover:bg-destructive/10 hover:border-destructive/40 transition-all text-center"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive text-white shadow-lg shadow-destructive/20 group-hover:scale-110 transition-transform">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-black text-xs uppercase tracking-tight text-destructive">
                    Báo sự cố
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-0.5 font-medium">
                    Yêu cầu sửa chữa
                  </div>
                </div>
              </button>

              <button
                onClick={() => setHistoryOpen(!historyOpen)}
                className="group flex flex-col items-center gap-3 p-5 rounded-2xl border-2 border-primary/20 bg-primary/[0.02] hover:bg-primary/10 hover:border-primary/40 transition-all text-center"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                  <Wrench className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-black text-xs uppercase tracking-tight text-primary underline underline-offset-4 decoration-primary/30">
                    Lịch sử thang
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-0.5 font-medium">
                    Kỹ thuật & bảo trì
                  </div>
                </div>
              </button>
            </div>

            {/* Repair/Maintenance History Detail (Expandable) */}
            {historyOpen && (
              <div className="space-y-3 animate-in slide-in-from-top-2 duration-300 pt-2">
                <h4 className="text-[11px] font-black uppercase text-muted-foreground tracking-widest px-1">
                  Nhật ký vận hành
                </h4>
                <div className="space-y-2">
                  {history.map((j) => (
                    <Card
                      key={j.id}
                      className="p-3 shadow-sm hover:shadow-md transition-shadow border-muted/50"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-[10px]">
                            {j.type === "maintenance" ? "Bảo trì" : "Sửa chữa"}
                          </Badge>
                          <span className="text-xs font-mono font-bold">{j.code}</span>
                        </div>
                        <span className="text-[10px] font-medium text-muted-foreground">
                          {formatDate(j.scheduledFor)}
                        </span>
                      </div>
                      <div className="text-xs font-bold truncate mb-1">{j.title}</div>
                      <div className="text-[10px] text-muted-foreground line-clamp-2">
                        {j.report || "Hoàn thành quy trình tiêu chuẩn."}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Technical Detail Info Card */}
            {step === "info" && (
              <div className="space-y-4 pt-4">
                <Card className="p-4">
                  <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-primary" /> Thông số kỹ thuật
                  </h3>
                  <div className="space-y-2 text-sm">
                    <Row label="Thương hiệu" value={elevator.brand} />
                    <Row label="Model" value={elevator.model} />
                    <Row label="Số tầng" value={`${elevator.floors} tập tầng`} />
                    <Row label="Ngày lắp đặt" value={formatDate(elevator.installedAt)} />
                    <Row
                      label="Bảo hành đến"
                      value={formatDate(elevator.warrantyUntil)}
                      highlight
                    />
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-success" /> Kiểm định an toàn
                  </h3>
                  <div className="space-y-2 text-sm">
                    <Row label="Ngày kiểm định" value="20/04/2025" />
                    <Row label="Hiệu lực đến" value="20/04/2026" highlight />
                    <Row label="Đơn vị KĐ" value="Trung tâm Kiểm định KT" />
                  </div>
                </Card>
              </div>
            )}

            {/* Hotline card */}
            <Card className="p-4 border-destructive/20 bg-destructive/5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive text-white shadow-lg shadow-destructive/20 animate-pulse">
                  <Phone className="h-5 w-5" />
                </div>
                <div className="flex-1"></div>
                <a href="tel:19001234">
                  <Button size="sm" variant="destructive" className="gap-1.5">
                    <Phone className="h-3.5 w-3.5" /> 1900 1234
                  </Button>
                </a>
              </div>
            </Card>

            {/* History collapsible */}
            <Card className="overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors"
                onClick={() => {
                  if (!isVerified) {
                    toast.info("Vui lòng xác minh chủ thang để xem lịch sử bảo trì");
                    setStep("info"); // Redirect to verification card in info step
                  } else {
                    setHistoryOpen((v) => !v);
                  }
                }}
              >
                <span className="font-medium text-sm flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-muted-foreground" />
                  Lịch sử bảo trì ({history.length})
                  {!isVerified && <Shield className="h-3 w-3 text-muted-foreground/50" />}
                </span>
                {historyOpen ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
              {historyOpen && isVerified && (
                <div className="border-t divide-y">
                  {history.map((j) => (
                    <div key={j.id} className="flex items-start gap-3 px-4 py-3">
                      <div
                        className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${j.status === "completed" ? "bg-success" : "bg-primary"}`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{j.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatDateTime(j.scheduledFor)}
                        </div>
                        {j.report && (
                          <p className="text-xs text-muted-foreground mt-0.5 italic">
                            "{j.report}"
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                  {history.length === 0 && (
                    <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                      Chưa có lịch sử
                    </div>
                  )}
                </div>
              )}
            </Card>
          </div>
        )}

        {/* ── STEP: REPORT ── */}
        {step === "report" && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold">Báo sự cố</h2>
              <p className="text-sm text-muted-foreground">
                Thang {elevator.code} · {elevator.building}
              </p>
            </div>

            {activeJob && (
              <Card className="p-4 bg-primary/5 border-primary/20">
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                    <Wrench className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-primary">Đã ghi nhận sự cố!</h3>
                    <p className="text-sm text-muted-foreground leading-tight mt-0.5">
                      Thang máy này đang trong quá trình được xử lý.
                    </p>
                  </div>
                </div>

                <div className="space-y-3 relative before:absolute before:inset-0 before:ml-[1.125rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-primary/20 before:to-transparent">
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-white bg-success text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      <CheckCircle2 className="h-3 w-3" />
                    </div>
                    <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] ml-3 md:ml-0 p-3 rounded bg-white shadow-sm border text-sm">
                      <div className="font-semibold text-primary">Tiếp nhận yêu cầu</div>
                      <div className="text-xs text-muted-foreground">Hệ thống đã nhận tin báo.</div>
                    </div>
                  </div>

                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div
                      className={`flex items-center justify-center w-6 h-6 rounded-full border-2 border-white ${activeJob.status === "scheduled" || activeJob.status === "in_progress" ? "bg-success text-white" : "bg-muted text-muted-foreground"} shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10`}
                    >
                      {activeJob.status === "scheduled" || activeJob.status === "in_progress" ? (
                        <CheckCircle2 className="h-3 w-3" />
                      ) : (
                        <div className="h-2 w-2 rounded-full bg-current" />
                      )}
                    </div>
                    <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] ml-3 md:ml-0 p-3 rounded bg-white shadow-sm border text-sm">
                      <div
                        className={`font-semibold ${activeJob.assignedTo ? "text-primary" : "text-muted-foreground"}`}
                      >
                        Bố trí nhân sự
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {activeJob.assignedTo
                          ? `Đã phân công: ${assignedTech?.name || "Kỹ thuật viên"}`
                          : "Đang chờ Admin phân công thợ."}
                      </div>
                    </div>
                  </div>

                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div
                      className={`flex items-center justify-center w-6 h-6 rounded-full border-2 border-white ${activeJob.status === "in_progress" ? "bg-primary text-white" : "bg-muted text-muted-foreground"} shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10`}
                    >
                      {activeJob.status === "in_progress" ? (
                        <Cog className="h-3 w-3 animate-spin duration-3000" />
                      ) : (
                        <div className="h-2 w-2 rounded-full bg-current" />
                      )}
                    </div>
                    <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] ml-3 md:ml-0 p-3 rounded bg-white shadow-sm border text-sm">
                      <div
                        className={`font-semibold ${activeJob.status === "in_progress" ? "text-primary" : "text-muted-foreground"}`}
                      >
                        Đang xử lý
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {activeJob.status === "in_progress"
                          ? "Thợ đang làm việc tại hiện trường."
                          : "Chờ thợ di chuyển tới nơi."}
                      </div>
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full mt-4" onClick={() => setStep("home")}>
                  Quay lại
                </Button>
              </Card>
            )}

            {!activeJob && (
              <>
                {/* Urgent banner */}
                {isUrgent && (
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-destructive text-white">
                    <AlertTriangle className="h-5 w-5 shrink-0" />
                    <div className="flex-1 text-sm font-medium">
                      Tình huống khẩn cấp — Gọi ngay 1900 1234
                    </div>
                    <a href="tel:19001234">
                      <Button size="sm" variant="secondary" className="shrink-0">
                        Gọi ngay
                      </Button>
                    </a>
                  </div>
                )}

                <Card className="p-4 space-y-4">
                  {/* Issue type */}
                  <div>
                    <label className="text-sm font-medium">
                      Loại sự cố <span className="text-destructive">*</span>
                    </label>
                    <Select value={issueType} onValueChange={setIssueType}>
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Chọn loại sự cố..." />
                      </SelectTrigger>
                      <SelectContent>
                        {issueTypes.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="text-sm font-medium">Mô tả thêm</label>
                    <Textarea
                      className="mt-1.5"
                      placeholder="Mô tả chi tiết hiện tượng bạn gặp..."
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="text-sm font-medium">
                      Số điện thoại liên hệ <span className="text-destructive">*</span>
                    </label>
                    <Input
                      className="mt-1.5"
                      placeholder="VD: 0901 234 567"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Để kỹ thuật viên gọi xác nhận
                    </p>
                  </div>

                  {/* Photos */}
                  <div>
                    <label className="text-sm font-medium">
                      Đính kèm ảnh{" "}
                      <span className="text-muted-foreground font-normal">
                        (không bắt buộc, tối đa 3)
                      </span>
                    </label>
                    <div className="mt-1.5 flex gap-2 flex-wrap">
                      {Array.from({ length: photoCount }).map((_, i) => (
                        <div
                          key={i}
                          className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center"
                        >
                          <Camera className="h-5 w-5 text-muted-foreground" />
                        </div>
                      ))}
                      {photoCount < 3 && (
                        <button
                          onClick={() => {
                            setPhotoCount((c) => c + 1);
                            toast.success("Đã thêm ảnh");
                          }}
                          className="h-16 w-16 rounded-lg border-2 border-dashed flex items-center justify-center hover:bg-muted transition-colors"
                        >
                          <Camera className="h-5 w-5 text-muted-foreground" />
                        </button>
                      )}
                    </div>
                  </div>
                </Card>

                <Button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full gap-2"
                  size="lg"
                >
                  <Send className="h-4 w-4" />
                  {submitting ? "Đang gửi..." : "Gửi báo lỗi"}
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                  Hoặc gọi thẳng{" "}
                  <a href="tel:19001234" className="text-destructive font-semibold">
                    1900 1234
                  </a>{" "}
                  nếu khẩn cấp
                </p>
              </>
            )}
          </div>
        )}

        {/* ── STEP: INFO ── */}
        {step === "info" && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold">Thông tin thang máy</h2>
              <p className="text-sm text-muted-foreground">
                {elevator.code} · {elevator.building}
              </p>
            </div>

            {!isVerified && (
              <Card className="p-6 border-primary/20 bg-primary/5">
                <div className="text-center mb-4">
                  <Shield className="h-10 w-10 text-primary mx-auto mb-2" />
                  <h3 className="font-bold">Xác thực chủ sở hữu</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Để xem chi tiết lịch sử bảo trì và thông số kỹ thuật, vui lòng xác nhận bằng số
                    điện thoại đăng ký.
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="relative">
                    <Input
                      placeholder="Nhập 6 số cuối SĐT"
                      className="pl-3 pr-20 h-12 text-center text-lg font-mono tracking-[0.5em]"
                      maxLength={6}
                      type="tel"
                      value={last6Digits}
                      onChange={(e) => setLast6Digits(e.target.value.replace(/\D/g, ""))}
                    />
                    <Button
                      className="absolute right-1 top-1 bottom-1 px-3"
                      onClick={handleVerify}
                      disabled={verifying || last6Digits.length < 6}
                    >
                      {verifying ? "..." : "Xác nhận"}
                    </Button>
                  </div>
                  <p className="text-[10px] text-center text-muted-foreground italic">
                    Gợi ý: Số điện thoại đại diện của {customer?.name}
                  </p>
                </div>
              </Card>
            )}

            {isVerified && (
              <>
                {/* Technical info */}
                <Card className="p-4">
                  <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-primary" /> Thông số kỹ thuật
                  </h3>
                  <div className="space-y-2 text-sm">
                    <Row label="Hãng / Model" value={`${elevator.brand} ${elevator.model}`} />
                    <Row label="Số tầng" value={`${elevator.floors} tầng`} />
                    <Row label="Vị trí" value={`${elevator.building}, ${elevator.address}`} />
                    <Row label="Chủ sở hữu" value={customer?.name || "—"} />
                    <Row label="Ngày lắp đặt" value={formatDate(elevator.installedAt)} />
                    <Row label="Bảo hành đến" value={formatDate(elevator.warrantyUntil)} />
                  </div>
                </Card>

                {/* Maintenance schedule */}
                <Card className="p-4">
                  <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" /> Lịch bảo trì
                  </h3>
                  <div className="space-y-2 text-sm">
                    <Row label="Bảo trì gần nhất" value={formatDate(elevator.lastMaintenance)} />
                    <Row
                      label="Bảo trì tiếp theo"
                      value={formatDate(elevator.nextMaintenance)}
                      highlight
                    />
                  </div>
                  {elevator.status === "maintenance_due" && (
                    <div className="mt-3 flex items-center gap-2 p-2.5 rounded-lg bg-warning/10 text-warning-foreground text-xs">
                      <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                      Thang đã đến hạn bảo trì — vui lòng liên hệ đơn vị dịch vụ
                    </div>
                  )}
                </Card>

                {/* Legal inspection */}
                <Card className="p-4">
                  <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-success" /> Kiểm định an toàn
                  </h3>
                  <div className="space-y-2 text-sm">
                    <Row label="Số kiểm định" value="KD-2025-04821" />
                    <Row label="Ngày kiểm định" value="20/04/2025" />
                    <Row label="Hiệu lực đến" value="20/04/2026" highlight />
                    <Row label="Đơn vị KĐ" value="TT Kiểm định KTKT Hà Nội" />
                  </div>
                </Card>
              </>
            )}

            <Button onClick={() => setStep("report")} variant="outline" className="w-full gap-2">
              <AlertTriangle className="h-4 w-4" /> Phát hiện sự cố? Báo ngay
            </Button>
          </div>
        )}

        {/* ── STEP: SUCCESS ── */}
        {step === "success" && (
          <div className="flex flex-col items-center text-center py-8 space-y-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
              <CheckCircle2 className="h-10 w-10 text-success" />
            </div>

            <div>
              <h2 className="text-xl font-bold">Đã gửi báo lỗi!</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Yêu cầu của bạn đã được tiếp nhận
              </p>
            </div>

            <Card className="p-4 w-full text-left space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mã yêu cầu</span>
                <span className="font-mono font-bold text-primary text-base">{ticketNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Thang máy</span>
                <span className="font-medium">{elevator.code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Loại sự cố</span>
                <span className="font-medium text-right max-w-[60%]">{issueType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">SĐT liên hệ</span>
                <span className="font-medium">{phone}</span>
              </div>
            </Card>

            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 text-sm w-full">
              Kỹ thuật viên sẽ gọi xác nhận trong vòng <strong>15 phút</strong> và có mặt trong{" "}
              <strong>2 giờ</strong>. Lưu mã{" "}
              <span className="font-mono font-bold text-primary">{ticketNo}</span> để tra cứu.
            </div>

            <div className="flex flex-col gap-2 w-full">
              <a href="tel:19001234" className="w-full">
                <Button variant="outline" className="w-full gap-2">
                  <Phone className="h-4 w-4" /> Gọi 1900 1234 để hỏi thêm
                </Button>
              </a>
              <Button variant="ghost" className="w-full" onClick={handleReset}>
                Quay về trang thang máy
              </Button>
            </div>
          </div>
        )}

        <div className="text-center text-xs text-muted-foreground py-6">
          Powered by <span className="font-semibold">ElevatorPro</span> ·{" "}
          <a href="tel:19001234" className="text-primary">
            1900 1234
          </a>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between gap-3 py-0.5">
      <span className="text-muted-foreground shrink-0">{label}</span>
      <span className={`text-right ${highlight ? "font-semibold text-primary" : ""}`}>{value}</span>
    </div>
  );
}
