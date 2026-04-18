// src/routes/admin.elevators.$elevatorId.tsx  ← FILE MỚI HOÀN TOÀN
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  StatusBadge,
  elevatorStatusLabel,
  elevatorStatusVariant,
  jobStatusLabel,
  jobStatusVariant,
} from "@/components/common/StatusBadge";
import {
  mockElevators,
  mockJobs,
  getCustomer,
  getContract,
  formatDate,
  formatDateTime,
} from "@/lib/mock-data";
import { CreateJobModal } from "@/components/common/Modals";
import {
  ArrowLeft,
  Building2,
  QrCode,
  Calendar,
  Briefcase,
  FileText,
  MapPin,
  Shield,
  Plus,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/elevators/$elevatorId")({
  loader: ({ params }) => {
    const elevator = mockElevators.find((e) => e.id === params.elevatorId);
    if (!elevator) throw notFound();
    return { elevator };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.elevator.code ?? "Thang máy"} — ElevatorPro` }],
  }),
  notFoundComponent: () => (
    <AppShell>
      <div className="p-12 text-center">
        <p className="text-muted-foreground">Không tìm thấy thang máy</p>
        <Link to="/admin/elevators"><Button className="mt-4">Quay lại</Button></Link>
      </div>
    </AppShell>
  ),
  component: ElevatorDetail,
});

function ElevatorDetail() {
  const { elevator } = Route.useLoaderData();
  const [jobOpen, setJobOpen] = useState(false);

  const customer = getCustomer(elevator.customerId);
  const contract = elevator.contractId ? getContract(elevator.contractId) : undefined;
  const history = mockJobs
    .filter((j) => j.elevatorId === elevator.id)
    .sort((a, b) => b.scheduledFor.localeCompare(a.scheduledFor));

  const isDue = elevator.status === "maintenance_due";
  const isOut = elevator.status === "out_of_order";

  return (
    <AppShell>
      <Link
        to="/admin/elevators"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="h-4 w-4" /> Quay lại danh sách
      </Link>

      <PageHeader
        title={elevator.code}
        description={`${elevator.brand} ${elevator.model} · ${elevator.floors} tầng · ${elevator.building}`}
        actions={
          <div className="flex gap-2">
            <Link to="/qr/$elevatorId" params={{ elevatorId: elevator.id }}>
              <Button variant="outline">
                <QrCode className="h-4 w-4 mr-1.5" /> Xem QR
              </Button>
            </Link>
            <Button onClick={() => setJobOpen(true)}>
              <Plus className="h-4 w-4 mr-1.5" /> Tạo công việc
            </Button>
          </div>
        }
      />

      {(isDue || isOut) && (
        <div
          className={`flex items-center gap-3 p-4 rounded-lg mb-4 ${
            isOut ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning-foreground"
          }`}
        >
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <div>
            <div className="font-semibold text-sm">
              {isOut ? "Thang đang ngừng hoạt động" : "Thang đến hạn bảo trì"}
            </div>
            <div className="text-xs opacity-80">
              {isOut
                ? "Cần điều phối kỹ thuật xử lý ngay"
                : `Hạn bảo trì: ${formatDate(elevator.nextMaintenance)} — Vui lòng lên lịch sớm`}
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="ml-auto"
            onClick={() => setJobOpen(true)}
          >
            Tạo công việc
          </Button>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4">
          {/* Status + basic info */}
          <Card className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <div className="font-mono font-bold text-lg">{elevator.code}</div>
                <StatusBadge variant={elevatorStatusVariant[elevator.status]}>
                  {elevatorStatusLabel[elevator.status]}
                </StatusBadge>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <Row label="Hãng / Model" value={`${elevator.brand} ${elevator.model}`} />
              <Row label="Số tầng" value={`${elevator.floors} tầng`} />
              <Row label="Tòa nhà" value={elevator.building} />
              <div className="flex items-start gap-2 py-1.5">
                <span className="text-muted-foreground w-28 shrink-0">Địa chỉ</span>
                <span className="flex items-start gap-1 text-sm">
                  <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0 text-muted-foreground" />
                  {elevator.address}
                </span>
              </div>
            </div>
          </Card>

          {/* Dates */}
          <Card className="p-5">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4" /> Mốc thời gian
            </h3>
            <div className="space-y-2 text-sm">
              <Row label="Ngày lắp đặt" value={formatDate(elevator.installedAt)} />
              <Row
                label="Bảo hành đến"
                value={formatDate(elevator.warrantyUntil)}
              />
              <Row label="BT gần nhất" value={formatDate(elevator.lastMaintenance)} />
              <div className="flex items-center justify-between py-1.5 border-t mt-2">
                <span className="text-muted-foreground">BT tiếp theo</span>
                <span className={`font-semibold ${isDue ? "text-warning-foreground" : "text-primary"}`}>
                  {formatDate(elevator.nextMaintenance)}
                </span>
              </div>
            </div>
          </Card>

          {/* Legal / inspection mock */}
          <Card className="p-5">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Shield className="h-4 w-4" /> Kiểm định pháp lý
            </h3>
            <div className="space-y-2 text-sm">
              <Row label="Số KĐ" value="KD-2025-04821" />
              <Row label="Ngày KĐ" value="20/04/2025" />
              <Row label="KĐ tiếp theo" value="20/04/2026" highlight />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-3 w-full"
              onClick={() => toast.success("Đang tải giấy chứng nhận PDF...")}
            >
              Tải giấy chứng nhận
            </Button>
          </Card>

          {/* Contract */}
          {contract && (
            <Card className="p-5">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4" /> Hợp đồng
              </h3>
              <div className="space-y-1 text-sm">
                <div className="font-medium">{contract.code}</div>
                <div className="text-xs text-muted-foreground">
                  {formatDate(contract.startDate)} → {formatDate(contract.endDate)}
                </div>
                <div className="text-xs text-muted-foreground italic">
                  {contract.items.join(", ")}
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Maintenance history */}
        <div className="lg:col-span-2">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Clock className="h-4 w-4" /> Lịch sử bảo trì & sửa chữa ({history.length})
              </h3>
            </div>
            {history.length > 0 ? (
              <div className="space-y-3">
                {history.map((j) => (
                  <Link
                    key={j.id}
                    to="/admin/jobs/$jobId"
                    params={{ jobId: j.id }}
                    className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/30 transition-colors"
                  >
                    <div
                      className={`mt-0.5 h-2.5 w-2.5 rounded-full shrink-0 ${
                        j.status === "completed"
                          ? "bg-success"
                          : j.status === "in_progress"
                          ? "bg-warning"
                          : "bg-primary"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-sm truncate">{j.title}</span>
                        <StatusBadge variant={jobStatusVariant[j.status]}>
                          {jobStatusLabel[j.status]}
                        </StatusBadge>
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {formatDateTime(j.scheduledFor)}
                        {j.completedAt && ` · Xong ${formatDateTime(j.completedAt)}`}
                      </div>
                      {j.report && (
                        <p className="text-xs text-muted-foreground mt-1 italic">"{j.report}"</p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <Briefcase className="mx-auto h-10 w-10 text-muted-foreground/30 mb-2" />
                <p className="text-sm text-muted-foreground">Chưa có lịch sử công việc</p>
                <Button
                  size="sm"
                  className="mt-3"
                  onClick={() => setJobOpen(true)}
                >
                  Tạo công việc đầu tiên
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>

      <CreateJobModal
        open={jobOpen}
        onClose={() => setJobOpen(false)}
        defaultCustomerId={elevator.customerId}
        defaultElevatorId={elevator.id}
        defaultContractId={elevator.contractId}
      />
    </AppShell>
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
    <div className="flex items-center justify-between py-1">
      <span className="text-muted-foreground">{label}</span>
      <span className={highlight ? "font-semibold text-primary" : ""}>{value}</span>
    </div>
  );
}