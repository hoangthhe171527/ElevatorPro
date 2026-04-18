import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataPagination } from "@/components/common/DataPagination";
import { StatusBadge } from "@/components/common/StatusBadge";
import { mockIssues, mockElevators, formatDateTime, getElevator } from "@/lib/mock-data";
import { AlertTriangle, Send } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/portal/issues")({
  head: () => ({ meta: [{ title: "Báo lỗi" }] }),
  component: PortalIssues,
});

const CUSTOMER_ID = "c-1";
const PAGE_SIZE = 5;
const statusLabel: Record<string, string> = { open: "Đang mở", scheduled: "Đã tiếp nhận", resolved: "Đã giải quyết" };
const statusVariant = { open: "destructive", scheduled: "info", resolved: "success" } as const;

function PortalIssues() {
  const [page, setPage] = useState(1);
  const [elevatorId, setElevatorId] = useState("");
  const [description, setDescription] = useState("");

  const myElevators = mockElevators.filter(e => e.customerId === CUSTOMER_ID);
  const myIssues = mockIssues.filter(i => i.customerId === CUSTOMER_ID);
  const paged = myIssues.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const submit = () => {
    if (!elevatorId || !description.trim()) {
      toast.error("Vui lòng chọn thang và mô tả sự cố");
      return;
    }
    toast.success("Đã gửi báo lỗi! Chúng tôi sẽ liên hệ trong vòng 30 phút.");
    setDescription("");
    setElevatorId("");
  };

  return (
    <AppShell>
      <PageHeader title="Báo lỗi & sự cố" description="Gửi yêu cầu kiểm tra hoặc sửa chữa nhanh" />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-4 w-4 text-warning-foreground" />
            <h3 className="font-semibold">Báo lỗi mới</h3>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Chọn thang</label>
              <Select value={elevatorId} onValueChange={setElevatorId}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Chọn thang máy..." /></SelectTrigger>
                <SelectContent>
                  {myElevators.map(e => (
                    <SelectItem key={e.id} value={e.id}>{e.code} — {e.building}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Mô tả sự cố</label>
              <Textarea
                placeholder="Mô tả chi tiết hiện tượng..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                className="mt-1"
              />
            </div>
            <Button onClick={submit} className="w-full"><Send className="h-4 w-4 mr-1.5" /> Gửi báo lỗi</Button>
          </div>
        </Card>

        <Card className="lg:col-span-2 overflow-hidden">
          <div className="p-4 border-b">
            <h3 className="font-semibold">Lịch sử báo lỗi</h3>
          </div>
          <div className="divide-y">
            {paged.map(i => {
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
