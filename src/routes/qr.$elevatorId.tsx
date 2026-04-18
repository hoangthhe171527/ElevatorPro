import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge, elevatorStatusLabel, elevatorStatusVariant } from "@/components/common/StatusBadge";
import {
  mockElevators, mockJobs, getCustomer, formatDate
} from "@/lib/mock-data";
import { Building2, QrCode, AlertTriangle, History, Cog, ArrowLeft, Send, Phone } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/qr/$elevatorId")({
  loader: ({ params }) => {
    const elevator = mockElevators.find(e => e.id === params.elevatorId);
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
        <Link to="/"><Button className="mt-4">Về trang chủ</Button></Link>
      </Card>
    </div>
  ),
  component: QRPage,
});

function QRPage() {
  const { elevator } = Route.useLoaderData();
  const cus = getCustomer(elevator.customerId);
  const history = mockJobs.filter(j => j.elevatorId === elevator.id).slice(0, 5);
  const [issue, setIssue] = useState("");

  const submitIssue = () => {
    if (!issue.trim()) { toast.error("Vui lòng mô tả sự cố"); return; }
    toast.success("Đã gửi báo lỗi! Đội ngũ sẽ liên hệ sớm.");
    setIssue("");
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-sidebar text-sidebar-foreground">
        <div className="container max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link to="/" className="text-sidebar-foreground/70 hover:text-sidebar-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
            <Cog className="h-4 w-4 text-sidebar-primary-foreground" />
          </div>
          <div>
            <div className="font-semibold text-sm">ElevatorPro</div>
            <div className="text-[11px] text-sidebar-foreground/60">Quét QR thang máy</div>
          </div>
        </div>
      </header>

      <div className="container max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* Hero card */}
        <Card className="p-6 text-center bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-foreground/20 mb-3">
            <Building2 className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold font-mono">{elevator.code}</h1>
          <p className="text-sm opacity-90 mt-1">{elevator.brand} {elevator.model} · {elevator.floors} tầng</p>
          <div className="mt-3 flex justify-center">
            <StatusBadge variant={elevatorStatusVariant[elevator.status]} className="bg-white/20 border-white/30 text-white">
              {elevatorStatusLabel[elevator.status]}
            </StatusBadge>
          </div>
        </Card>

        {/* Info */}
        <Card className="p-5">
          <h2 className="font-semibold mb-3 flex items-center gap-2"><QrCode className="h-4 w-4" /> Thông tin thang</h2>
          <div className="space-y-2 text-sm">
            <Row label="Khách hàng" value={cus?.name || "—"} />
            <Row label="Vị trí" value={`${elevator.building}, ${elevator.address}`} />
            <Row label="Lắp đặt" value={formatDate(elevator.installedAt)} />
            <Row label="Bảo hành đến" value={formatDate(elevator.warrantyUntil)} />
            <Row label="BT gần nhất" value={formatDate(elevator.lastMaintenance)} />
            <Row label="BT tiếp theo" value={formatDate(elevator.nextMaintenance)} highlight />
          </div>
        </Card>

        {/* Quick actions */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <h2 className="font-semibold">Báo lỗi nhanh</h2>
          </div>
          <Textarea
            placeholder="Mô tả sự cố bạn gặp phải..."
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
            rows={3}
          />
          <div className="mt-3 flex flex-col sm:flex-row gap-2">
            <Button onClick={submitIssue} className="flex-1"><Send className="h-4 w-4 mr-1.5" /> Gửi báo lỗi</Button>
            <Button variant="outline" asChild>
              <a href="tel:1900xxxx"><Phone className="h-4 w-4 mr-1.5" /> Hotline 24/7</a>
            </Button>
          </div>
        </Card>

        {/* History */}
        <Card className="p-5">
          <h2 className="font-semibold mb-3 flex items-center gap-2"><History className="h-4 w-4" /> Lịch sử bảo trì</h2>
          <div className="space-y-3">
            {history.map(j => (
              <div key={j.id} className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0">
                <div className="mt-1 h-2 w-2 rounded-full bg-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{j.title}</div>
                  <div className="text-xs text-muted-foreground">{formatDate(j.scheduledFor)}</div>
                </div>
              </div>
            ))}
            {history.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">Chưa có lịch sử</p>
            )}
          </div>
        </Card>

        <div className="text-center text-xs text-muted-foreground py-4">
          Powered by <span className="font-semibold">ElevatorPro</span>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className={`text-right ${highlight ? "font-semibold text-primary" : ""}`}>{value}</span>
    </div>
  );
}
