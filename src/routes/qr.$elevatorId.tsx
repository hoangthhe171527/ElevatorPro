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
import { StatusBadge } from "@/components/common/StatusBadge";
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
} from "lucide-react";
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
  const isStaff = !permissions.includes("customer");
  const isAdmin = permissions.some((p) =>
    ["director", "maintenance_mgmt", "install_mgmt", "accounting", "hr_admin", "sales"].includes(p),
  );

  // Report form state
  const [issueType, setIssueType] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [photoCount, setPhotoCount] = useState(0);
  const [ticketNo, setTicketNo] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
        {/* ── STEP: HOME ── */}
        {step === "home" && (
          <div className="space-y-4">
            {/* Elevator hero */}
            <Card className="p-5 text-center bg-gradient-to-br from-primary to-primary/80 text-primary-foreground relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-20">
                <Shield className="w-24 h-24" />
              </div>
              <div className="relative z-10">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-foreground/20 mb-3">
                  <Building2 className="h-7 w-7" />
                </div>
                <h1 className="text-2xl font-bold font-mono">{elevator.code}</h1>
                <p className="text-sm opacity-90 mt-0.5">
                  {elevator.brand} {elevator.model} · {elevator.floors} tầng
                </p>
                <p className="text-xs opacity-70 mt-0.5">{elevator.building}</p>
                <div className="mt-3 flex justify-center">
                  <StatusBadge
                    variant={elevatorStatusVariant[elevator.status]}
                    className="bg-white/20 border-white/30 text-white"
                  >
                    {elevatorStatusLabel[elevator.status]}
                  </StatusBadge>
                </div>
              </div>
            </Card>

            {/* Staff shortcut */}
            {isStaff && (
              <div className="mt-4">
                <Link
                  to={isAdmin ? "/admin/elevators/$elevatorId" : "/tech"}
                  params={isAdmin ? { elevatorId: elevator.id } : {}}
                >
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-orange-500 text-white shadow-md hover:opacity-90 transition-opacity">
                    <Shield className="h-6 w-6 shrink-0" />
                    <div className="flex-1">
                      <div className="text-sm font-semibold">Quyền nhân viên nội bộ</div>
                      <div className="text-xs opacity-90">Mở trong bảng điều khiển ngay</div>
                    </div>
                    <ArrowLeft className="h-5 w-5 rotate-180" />
                  </div>
                </Link>
              </div>
            )}

            {/* 2 main actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setStep("report")}
                className="flex flex-col items-center gap-3 p-5 rounded-xl border-2 border-destructive/30 bg-destructive/5 hover:bg-destructive/10 hover:border-destructive/50 transition-colors text-center"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-semibold text-sm">Báo sự cố</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Gửi yêu cầu xử lý</div>
                </div>
              </button>

              <button
                onClick={() => setStep("info")}
                className="flex flex-col items-center gap-3 p-5 rounded-xl border-2 border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 transition-colors text-center"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Info className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-semibold text-sm">Xem thông tin</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Kỹ thuật & kiểm định</div>
                </div>
              </button>
            </div>

            {/* Hotline card */}
            <Card className="p-4 border-destructive/20 bg-destructive/5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                  <Phone className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold">Khẩn cấp? Gọi ngay</div>
                  <div className="text-xs text-muted-foreground">Hỗ trợ 24/7 — có người trực</div>
                </div>
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
                onClick={() => setHistoryOpen((v) => !v)}
              >
                <span className="font-medium text-sm flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-muted-foreground" />
                  Lịch sử bảo trì ({history.length})
                </span>
                {historyOpen ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
              {historyOpen && (
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
