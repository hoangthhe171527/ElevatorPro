// src/routes/portal.issues.tsx  ← THAY THẾ
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataPagination } from "@/components/common/DataPagination";
import { StatusBadge } from "@/components/common/StatusBadge";
import { mockIssues, mockElevators, formatDateTime, getElevator } from "@/lib/mock-data";
import { AlertTriangle, Send, CheckCircle2, Phone, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/portal/issues")({
  head: () => ({ meta: [{ title: "Báo lỗi" }] }),
  component: PortalIssues,
});

const CUSTOMER_ID = "c-1";
const PAGE_SIZE = 5;
const statusLabel: Record<string, string> = { open: "Đang mở", scheduled: "Đã tiếp nhận", resolved: "Đã giải quyết" };
const statusVariant = { open: "destructive", scheduled: "info", resolved: "success" } as const;

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

function PortalIssues() {
  const [page, setPage] = useState(1);
  const [elevatorId, setElevatorId] = useState("");
  const [issueType, setIssueType] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [ticketNo, setTicketNo] = useState("");

  const myElevators = mockElevators.filter((e) => {
    // filter by projectId belonging to CUSTOMER_ID
    return true; // all elevators accessible for now (real auth will scope this)
  });
  const myIssues = mockIssues.filter((i) => i.customerId === CUSTOMER_ID);
  const paged = myIssues.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const isUrgent = issueType === "Kẹt người trong thang";

  const submit = () => {
    if (!elevatorId || !issueType) {
      toast.error("Vui lòng chọn thang và loại sự cố");
      return;
    }
    if (!phone.trim()) {
      toast.error("Vui lòng nhập số điện thoại liên hệ");
      return;
    }
    const ticket = `YC-${Date.now().toString().slice(-6)}`;
    setTicketNo(ticket);
    setSubmitted(true);
  };

  const reset = () => {
    setSubmitted(false);
    setElevatorId("");
    setIssueType("");
    setDescription("");
    setPhone("");
    setTicketNo("");
  };

  const selectedElevator = getElevator(elevatorId);

  return (
    <AppShell>
      <PageHeader
        title="Báo lỗi & sự cố"
        description="Gửi yêu cầu kiểm tra hoặc sửa chữa nhanh"
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Form / Success */}
        <Card className="p-5 lg:col-span-1">
          {!submitted ? (
            <>
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="h-4 w-4 text-warning-foreground" />
                <h3 className="font-semibold">Báo lỗi mới</h3>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Chọn thang <span className="text-destructive">*</span></label>
                  <Select value={elevatorId} onValueChange={setElevatorId}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="Chọn thang máy..." /></SelectTrigger>
                    <SelectContent>
                      {myElevators.map((e) => (
                        <SelectItem key={e.id} value={e.id}>{e.code} — {e.building}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground">Loại sự cố <span className="text-destructive">*</span></label>
                  <Select value={issueType} onValueChange={setIssueType}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="Chọn loại sự cố..." /></SelectTrigger>
                    <SelectContent>
                      {issueTypes.map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {isUrgent && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive text-white text-sm">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    <span className="flex-1 font-medium">Tình huống khẩn cấp!</span>
                    <a href="tel:19001234">
                      <Button size="sm" variant="secondary">Gọi ngay</Button>
                    </a>
                  </div>
                )}

                <div>
                  <label className="text-xs font-medium text-muted-foreground">Mô tả chi tiết</label>
                  <Textarea
                    placeholder="Mô tả hiện tượng bạn gặp..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground">Số điện thoại liên hệ <span className="text-destructive">*</span></label>
                  <Input
                    className="mt-1"
                    placeholder="VD: 0901 234 567"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <Button onClick={submit} className="w-full gap-2">
                  <Send className="h-4 w-4" /> Gửi báo lỗi
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                  Khẩn cấp? Gọi <a href="tel:19001234" className="text-destructive font-semibold">1900 1234</a> (24/7)
                </p>
              </div>
            </>
          ) : (
            /* Success screen */
            <div className="text-center py-4">
              <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-full bg-success/10 mb-3">
                <CheckCircle2 className="h-7 w-7 text-success" />
              </div>
              <h3 className="font-bold text-lg">Đã gửi báo lỗi!</h3>
              <p className="text-sm text-muted-foreground mt-1">Yêu cầu đã được tiếp nhận</p>

              <div className="mt-4 p-3 rounded-lg bg-muted/50 text-sm text-left space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mã yêu cầu</span>
                  <span className="font-mono font-bold text-primary">{ticketNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Thang</span>
                  <span className="font-medium">{selectedElevator?.code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Loại sự cố</span>
                  <span className="font-medium text-right max-w-[55%]">{issueType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">SĐT liên hệ</span>
                  <span className="font-medium">{phone}</span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mt-3">
                KTV sẽ gọi xác nhận trong <strong>15 phút</strong>
              </p>

              <div className="mt-4 flex flex-col gap-2">
                <a href="tel:19001234">
                  <Button variant="outline" size="sm" className="w-full gap-1.5">
                    <Phone className="h-3.5 w-3.5" /> Gọi 1900 1234
                  </Button>
                </a>
                <Button variant="ghost" size="sm" onClick={reset} className="w-full gap-1.5">
                  <ArrowLeft className="h-3.5 w-3.5" /> Báo sự cố khác
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* History */}
        <Card className="lg:col-span-2 overflow-hidden">
          <div className="p-4 border-b">
            <h3 className="font-semibold">Lịch sử báo lỗi</h3>
          </div>
          <div className="divide-y">
            {paged.map((i) => {
              const elev = getElevator(i.elevatorId);
              return (
                <div key={i.id} className="p-4 hover:bg-muted/30">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-sm font-medium">{elev?.code}</span>
                        <StatusBadge variant={statusVariant[i.status]}>{statusLabel[i.status]}</StatusBadge>
                      </div>
                      <p className="mt-1 text-sm">{i.description}</p>
                      <div className="mt-1 text-xs text-muted-foreground">{formatDateTime(i.reportedAt)}</div>
                      {i.jobId && (
                        <Link
                          to="/portal"
                          className="mt-1 text-xs text-primary hover:underline inline-block"
                        >
                          Xem tiến độ xử lý →
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            {paged.length === 0 && (
              <div className="p-12 text-center text-sm text-muted-foreground">Chưa có báo lỗi nào</div>
            )}
          </div>
          <DataPagination page={page} pageSize={PAGE_SIZE} total={myIssues.length} onPageChange={setPage} />
        </Card>
      </div>
    </AppShell>
  );
}