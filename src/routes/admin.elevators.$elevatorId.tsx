import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Wrench,
  Info,
  CheckCircle2
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
        description="Quản lý chi tiết hồ sơ thang máy, lịch sử và hợp đồng."
        actions={
          <div className="flex gap-2">
            <Link to="/admin/elevators/$elevatorId/qr" params={{ elevatorId: elevator.id }}>
              <Button variant="outline">
                <QrCode className="h-4 w-4 mr-1.5" /> Xem QR thiết bị
              </Button>
            </Link>
            <Button onClick={() => setJobOpen(true)}>
              <Plus className="h-4 w-4 mr-1.5" /> Điều phối công việc
            </Button>
          </div>
        }
      />

      {/* EMERGENCY BANNER */}
      {(isDue || isOut) && (
        <div
          className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl border mb-6 shadow-sm ${
            isOut ? "bg-destructive/5 border-destructive/20 text-destructive" : "bg-warning/10 border-warning/30 text-warning-foreground"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`h-12 w-12 rounded-full flex items-center justify-center shrink-0 ${isOut ? "bg-destructive/10" : "bg-warning/20"}`}>
               <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <div className="font-bold text-base">
                {isOut ? "Thang đang ngừng hoạt động do sự cố!" : "Thang đã đến hạn bảo trì định kỳ!"}
              </div>
              <div className="text-sm opacity-90 mt-0.5">
                {isOut
                  ? "Vui lòng xem thông tin vé sự cố để xử lý tiếp."
                  : `Kế hoạch bảo trì dự kiến: ngày ${formatDate(elevator.nextMaintenance)}`}
              </div>
            </div>
          </div>
          <Button
            size="sm"
            variant="default"
            className={`shrink-0 shadow-md ${isOut ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : "bg-warning-foreground text-white hover:opacity-90"}`}
            onClick={() => setJobOpen(true)}
          >
            Tạo phiếu xử lý ngay
          </Button>
        </div>
      )}

      {/* HERO GLANCE */}
      <Card className="mb-6 p-6 md:p-8 bg-card shadow-sm border-muted overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <Building2 className="w-48 h-48" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
          <div className="flex gap-5">
            <div className="h-20 w-20 shrink-0 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-inner">
               <Building2 className="h-10 w-10" />
            </div>
            <div className="flex flex-col justify-center gap-1.5">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-bold font-mono tracking-tight">{elevator.code}</h1>
                <StatusBadge variant={elevatorStatusVariant[elevator.status]} className="px-2.5 py-0.5 text-xs">
                  {elevatorStatusLabel[elevator.status]}
                </StatusBadge>
              </div>
              <div className="text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                <span className="font-medium text-foreground">{elevator.brand} {elevator.model}</span>
                <span>•</span>
                <span>{elevator.floors} Tầng</span>
              </div>
              <div className="text-muted-foreground flex items-center gap-1.5 text-sm">
                <MapPin className="h-3.5 w-3.5" /> {elevator.building}, {elevator.address}
              </div>
            </div>
          </div>

          {customer && (
             <div className="p-4 rounded-xl border bg-muted/20 w-full md:w-auto shadow-sm">
               <div className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-2">Đơn vị chủ quản</div>
               <div className="font-semibold text-sm mb-1">{customer.name}</div>
               <div className="text-xs text-muted-foreground">{customer.contactPerson} · {customer.phone}</div>
             </div>
          )}
        </div>
      </Card>

      {/* CONTENT TABS */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full justify-start h-auto p-1 bg-transparent border-b rounded-none gap-4 overflow-x-auto hide-scrollbar mb-6">
          <TabsTrigger value="overview" className="data-[state=active]:bg-muted data-[state=active]:shadow-sm rounded-lg px-4 py-2 gap-2 text-sm">
            <Info className="h-4 w-4" /> Tổng quan
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-muted data-[state=active]:shadow-sm rounded-lg px-4 py-2 gap-2 text-sm">
             <Clock className="h-4 w-4" /> Lịch sử công việc ({history.length})
          </TabsTrigger>
          <TabsTrigger value="docs" className="data-[state=active]:bg-muted data-[state=active]:shadow-sm rounded-lg px-4 py-2 gap-2 text-sm">
            <FileText className="h-4 w-4" /> Hợp đồng & Pháp lý
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-5 border-muted/60 shadow-sm">
              <h3 className="font-semibold text-base mb-4 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" /> Thông số kỹ thuật
              </h3>
              <div className="space-y-3">
                <Row label="Dòng thiết bị" value={`${elevator.brand} / ${elevator.model}`} />
                <Row label="Số tầng phục vụ" value={`${elevator.floors} tầng`} />
                <Row label="Năm lắp đặt" value={new Date(elevator.installedAt).getFullYear().toString()} />
                <Row label="Ngày lắp đặt (Nghiệm thu)" value={formatDate(elevator.installedAt)} />
                <Row label="Thời hạn bảo hành" value={formatDate(elevator.warrantyUntil)} highlight />
              </div>
            </Card>

            <Card className="p-5 border-muted/60 shadow-sm">
              <h3 className="font-semibold text-base mb-4 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" /> Mốc thời gian bảo trì
              </h3>
              <div className="space-y-3">
                <Row label="Bảo trì gần nhất" value={formatDate(elevator.lastMaintenance)} />
                <div className="flex items-center justify-between py-1.5 mt-2 bg-muted/30 px-3 rounded-lg border">
                  <span className="text-sm font-medium">Bảo trì tiếp theo</span>
                  <span className={`font-bold ${isDue ? "text-warning-foreground" : "text-primary"}`}>
                    {formatDate(elevator.nextMaintenance)}
                  </span>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-dashed">
                 <h3 className="font-semibold text-base mb-3 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-success" /> Kiểm định an toàn
                </h3>
                <div className="space-y-3">
                  <Row label="Số GP Kiểm Định" value="KD-2025-04821" />
                  <Row label="Kiểm định gần nhất" value="20/04/2025" />
                  <div className="flex items-center justify-between py-1.5 mt-1 border border-success/20 bg-success/5 px-3 rounded-lg">
                    <span className="text-sm font-medium text-success">Hiệu lực an toàn đến</span>
                    <span className="font-bold text-success">20/04/2026</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-0">
          <Card className="border-muted/60 shadow-sm overflow-hidden">
            {history.length > 0 ? (
              <div className="divide-y divide-muted/50">
                {history.map((j) => (
                  <Link
                    key={j.id}
                    to="/admin/jobs/$jobId"
                    params={{ jobId: j.id }}
                    className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 hover:bg-muted/10 transition-colors group"
                  >
                    <div className="flex-1 min-w-0 flex items-start gap-3">
                      <div className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
                        j.status === "completed" ? "bg-success/10 border-success/20 text-success" 
                        : j.status === "in_progress" ? "bg-warning/10 border-warning/20 text-warning-foreground"
                        : "bg-primary/10 border-primary/20 text-primary"
                      }`}>
                         {j.status === "completed" ? <CheckCircle2 className="h-4 w-4" /> : <Wrench className="h-4 w-4" />}
                      </div>
                      <div>
                        <div className="font-semibold mb-1 group-hover:text-primary transition-colors">{j.title}</div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                          <span className="font-mono bg-muted px-1 rounded">{j.code}</span>
                          <span>•</span>
                          <span>{formatDateTime(j.scheduledFor)}</span>
                          {j.completedAt && (
                            <>
                              <span>•</span>
                              <span className="text-success font-medium">Hoàn thành {formatDateTime(j.completedAt)}</span>
                            </>
                          )}
                        </div>
                        {j.report && (
                          <div className="mt-2 text-sm text-muted-foreground italic border-l-2 border-muted pl-3 py-0.5">
                            "{j.report}"
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 mt-3 sm:mt-0">
                       <StatusBadge variant={jobStatusVariant[j.status]} className="h-6">
                         {jobStatusLabel[j.status]}
                       </StatusBadge>
                       <Button variant="ghost" size="sm" className="h-8 text-xs font-semibold px-2">Xem chi tiết →</Button>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center">
                <Briefcase className="mx-auto h-12 w-12 text-muted-foreground/20 mb-3" />
                <p className="text-base font-medium text-foreground">Chưa có lịch sử công việc</p>
                <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">Thang máy này chưa phát sinh lịch sử bảo trì hay sửa chữa nào trên hệ thống.</p>
                <Button className="mt-6" onClick={() => setJobOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" /> Khởi tạo công việc đầu tiên
                </Button>
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="docs" className="mt-0">
          <Card className="p-6 md:p-8 border-muted/60 shadow-sm text-center">
             {contract ? (
                <div className="max-w-2xl mx-auto text-left py-4">
                  <div className="flex items-center gap-4 mb-8 pb-6 border-b">
                     <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20">
                        <FileText className="h-8 w-8" />
                     </div>
                     <div>
                       <h3 className="text-xl font-bold">{contract.code}</h3>
                       <p className="text-muted-foreground">Hợp đồng liên quan đến thiết bị</p>
                     </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-y-6 gap-x-8 text-sm">
                    <div>
                       <div className="text-muted-foreground mb-1 uppercase tracking-wide text-xs font-semibold">Loại hợp đồng</div>
                       <div className="font-medium text-base capitalize">{contract.type}</div>
                    </div>
                    <div>
                       <div className="text-muted-foreground mb-1 uppercase tracking-wide text-xs font-semibold">Trạng thái</div>
                       <StatusBadge variant={contract.status === "active" ? "success" : "muted"}>{contract.status}</StatusBadge>
                    </div>
                    <div>
                       <div className="text-muted-foreground mb-1 uppercase tracking-wide text-xs font-semibold">Ngày bắt đầu</div>
                       <div className="font-medium">{formatDate(contract.startDate)}</div>
                    </div>
                    <div>
                       <div className="text-muted-foreground mb-1 uppercase tracking-wide text-xs font-semibold">Ngày kết thúc</div>
                       <div className="font-medium">{formatDate(contract.endDate)}</div>
                    </div>
                    <div className="sm:col-span-2">
                       <div className="text-muted-foreground mb-2 uppercase tracking-wide text-xs font-semibold">Hạng mục phục vụ</div>
                       <ul className="list-disc list-inside space-y-1 bg-muted/20 p-4 rounded-xl border border-dashed">
                          {contract.items.map((item, id) => <li key={id} className="font-medium">{item}</li>)}
                       </ul>
                    </div>
                  </div>
                  <div className="mt-8 pt-6 flex gap-3">
                     <Link to="/admin/contracts"><Button className="w-full sm:w-auto">Quản lý Hợp đồng</Button></Link>
                  </div>
                </div>
             ) : (
                <div className="py-12">
                   <FileText className="h-12 w-12 text-muted-foreground/20 mx-auto mb-3" />
                   <div className="font-medium">Chưa liên kết hợp đồng</div>
                   <p className="text-sm text-muted-foreground mt-1">Không tìm thấy hợp đồng bảo trì nào gắn với thang máy này.</p>
                </div>
             )}
          </Card>
        </TabsContent>
      </Tabs>

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

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-muted/30 last:border-0 last:pb-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`text-sm ${highlight ? "font-bold text-primary" : "font-medium"}`}>{value}</span>
    </div>
  );
}