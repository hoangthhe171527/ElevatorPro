// src/routes/qr.$elevatorId.tsx  ← THAY THẾ FILE CŨ
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge, elevatorStatusLabel, elevatorStatusVariant } from "@/components/common/StatusBadge";
import { mockElevators, mockJobs, getCustomer, formatDate, formatDateTime } from "@/lib/mock-data";
import {
  Building2,
  QrCode,
  AlertTriangle,
  History,
  Cog,
  ArrowLeft,
  Send,
  Phone,
  Shield,
  CheckCircle2,
  Camera,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/qr/$elevatorId")({
  loader: ({ params }) => {
    const elevator = mockElevators.find((e) => e.id === params.elevatorId);
    if (!elevator) throw notFound();
    return { elevator };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.elevator.code ?? "Thang"} — QR ElevatorPro` }],
  }),
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="p-8 text-center max-w-md">
        <p>Không tìm thấy thang máy</p>
        <Link to="/">
          <Button className="mt-4">Về trang chủ</Button>
        </Link>
      </Card>
    </div>
  ),
  component: QRPage,
});

const issueTypes = [
  "Thang không di chuyển",
  "Cửa thang đóng mở bất thường",
  "Thang rung lắc, tiếng kêu lạ",
  "Đèn cabin bị hỏng",
  "Nút bấm không phản hồi",
  "Thang dừng không đúng tầng",
  "Vấn đề khác",
];

function QRPage() {
  const { elevator } = Route.useLoaderData();
  const customer = getCustomer(elevator.customerId);
  const history = mockJobs
    .filter((j) => j.elevatorId === elevator.id)
    .sort((a, b) => b.scheduledFor.localeCompare(a.scheduledFor))
    .slice(0, 6);

  const [issueType, setIssueType] = useState("");
  const [description, setDescription] = useState("");
  const [photoCount, setPhotoCount] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [ticketNo, setTicketNo] = useState("");
  const [showHistory, setShowHistory] = useState(false);

  const submitIssue = () => {
    if (!issueType) {
      toast.error("Vui lòng chọn loại sự cố");
      return;
    }
    const ticket = `YC-${Date.now().toString().slice(-6)}`;
    setTicketNo(ticket);
    setSubmitted(true);
  };

  const reset = () => {
    setSubmitted(false);
    setIssueType("");
    setDescription("");
    setPhotoCount(0);
    setTicketNo("");
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-sidebar text-sidebar-foreground sticky top-0 z-10">
        <div className="container max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link to="/" className="text-sidebar-foreground/70 hover:text-sidebar-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
            <Cog className="h-4 w-4 text-sidebar-primary-foreground" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-sm">ElevatorPro</div>
            <div className="text-[11px] text-sidebar-foreground/60">Quản lý dịch vụ thang máy</div>
          </div>
          {/* Hotline nổi bật ở header */}
          <a
            href="tel:19001234"
            className="flex items-center gap-1.5 bg-destructive text-white text-xs px-3 py-1.5 rounded-full font-medium hover:bg-destructive/90"
          >
            <Phone className="h-3 w-3" /> 1900 1234
          </a>
        </div>
      </header>

      <div className="container max-w-2xl mx-auto px-4 py-5 space-y-4">
        {/* Hero card */}
        <Card className="p-6 text-center bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-foreground/20 mb-3">
            <Building2 className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold font-mono">{elevator.code}</h1>
          <p className="text-sm opacity-90 mt-1">
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
        </Card>

        {/* Elevator info */}
        <Card className="p-5">
          <h2 className="font-semibold mb-3 flex items-center gap-2">
            <QrCode className="h-4 w-4" /> Thông tin thang
          </h2>
          <div className="space-y-2 text-sm">
            <Row label="Chủ sở hữu / BQL" value={customer?.name || "—"} />
            <Row label="Vị trí" value={`${elevator.building}, ${elevator.address}`} />
            <Row label="Ngày lắp đặt" value={formatDate(elevator.installedAt)} />
            <Row label="Bảo hành đến" value={formatDate(elevator.warrantyUntil)} />
            <Row label="BT gần nhất" value={formatDate(elevator.lastMaintenance)} />
            <Row label="BT tiếp theo" value={formatDate(elevator.nextMaintenance)} highlight />
          </div>
        </Card>

        {/* Legal */}
        <Card className="p-5">
          <h2 className="font-semibold mb-3 flex items-center gap-2">
            <Shield className="h-4 w-4 text-success" /> Kiểm định an toàn
          </h2>
          <div className="space-y-2 text-sm">
            <Row label="Số KĐ" value="KD-2025-04821" />
            <Row label="Ngày kiểm định" value="20/04/2025" />
            <Row label="Hiệu lực đến" value="20/04/2026" highlight />
            <Row label="Đơn vị KĐ" value="Trung tâm KĐ KTKT Hà Nội" />
          </div>
        </Card>

        {/* Report issue */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <h2 className="font-semibold">Báo sự cố</h2>
          </div>

          {submitted ? (
            /* ── Submission success ── */
            <div className="text-center py-4">
              <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-full bg-success/10 mb-3">
                <CheckCircle2 className="h-7 w-7 text-success" />
              </div>
              <h3 className="font-semibold text-lg">Đã gửi báo lỗi!</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Mã yêu cầu của bạn:
              </p>
              <div className="inline-block mt-2 px-4 py-2 bg-muted rounded-lg font-mono font-bold text-lg text-primary">
                {ticketNo}
              </div>
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                Đội kỹ thuật sẽ liên hệ với bạn trong vòng <strong>30 phút</strong>. Lưu mã yêu cầu để tra cứu.
              </p>
              <div className="mt-4 flex flex-col sm:flex-row gap-2">
                <Button variant="outline" className="flex-1" onClick={reset}>
                  Báo sự cố khác
                </Button>
                <Button asChild className="flex-1">
                  <a href="tel:19001234">
                    <Phone className="h-4 w-4 mr-1.5" /> Gọi hotline ngay
                  </a>
                </Button>
              </div>
            </div>
          ) : (
            /* ── Report form ── */
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  Loại sự cố <span className="text-destructive">*</span>
                </label>
                <Select value={issueType} onValueChange={setIssueType}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Chọn loại sự cố..." />
                  </SelectTrigger>
                  <SelectContent>
                    {issueTypes.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  Mô tả thêm (không bắt buộc)
                </label>
                <Textarea
                  className="mt-1"
                  placeholder="Mô tả chi tiết hiện tượng bạn gặp..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Photo attach (UI only) */}
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  Đính kèm ảnh (không bắt buộc)
                </label>
                <div className="mt-1 flex gap-2 flex-wrap">
                  {Array.from({ length: photoCount }).map((_, i) => (
                    <div
                      key={i}
                      className="h-14 w-14 rounded-lg bg-muted flex items-center justify-center"
                    >
                      <Camera className="h-5 w-5 text-muted-foreground" />
                    </div>
                  ))}
                  {photoCount < 3 && (
                    <button
                      onClick={() => { setPhotoCount((c) => c + 1); toast.success("Đã thêm ảnh"); }}
                      className="h-14 w-14 rounded-lg border-2 border-dashed flex items-center justify-center hover:bg-muted transition-colors"
                    >
                      <Camera className="h-5 w-5 text-muted-foreground" />
                    </button>
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">Tối đa 3 ảnh</p>
              </div>

              <Button onClick={submitIssue} className="w-full">
                <Send className="h-4 w-4 mr-1.5" /> Gửi báo lỗi
              </Button>

              <div className="text-center">
                <a
                  href="tel:19001234"
                  className="inline-flex items-center gap-1.5 text-sm text-destructive font-medium hover:underline"
                >
                  <Phone className="h-3.5 w-3.5" /> Khẩn cấp? Gọi hotline 1900 1234 (24/7)
                </a>
              </div>
            </div>
          )}
        </Card>

        {/* History collapsible */}
        <Card className="overflow-hidden">
          <button
            className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/30 transition-colors"
            onClick={() => setShowHistory((v) => !v)}
          >
            <h2 className="font-semibold flex items-center gap-2">
              <History className="h-4 w-4" /> Lịch sử bảo trì & sửa chữa
            </h2>
            {showHistory ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </button>

          {showHistory && (
            <div className="px-5 pb-5 space-y-3 border-t pt-4">
              {history.map((j) => {
                const typeLabel: Record<string, string> = {
                  maintenance: "Bảo trì",
                  repair: "Sửa chữa",
                  install: "Lắp đặt",
                  inspection: "Khảo sát",
                };
                return (
                  <div key={j.id} className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0">
                    <div
                      className={`mt-1 h-2.5 w-2.5 rounded-full shrink-0 ${
                        j.status === "completed" ? "bg-success" : "bg-primary"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-sm">{typeLabel[j.type]}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                          {j.status === "completed" ? "Hoàn thành" : "Đang xử lý"}
                        </span>
                      </div>
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
                );
              })}
              {history.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Chưa có lịch sử
                </p>
              )}
            </div>
          )}
        </Card>

        <div className="text-center text-xs text-muted-foreground py-4">
          Powered by <span className="font-semibold">ElevatorPro</span> · Hotline:{" "}
          <a href="tel:19001234" className="text-primary">
            1900 1234
          </a>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex justify-between gap-3 py-0.5">
      <span className="text-muted-foreground shrink-0">{label}</span>
      <span className={`text-right ${highlight ? "font-semibold text-primary" : ""}`}>
        {value}
      </span>
    </div>
  );
}