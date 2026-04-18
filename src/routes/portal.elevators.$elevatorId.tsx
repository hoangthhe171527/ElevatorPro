import { createFileRoute, Link, notFound } from "@tanstack/react-router";
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
  getProject,
  getCustomer,
  formatDate,
  formatDateTime,
} from "@/lib/mock-data";
import {
  ArrowLeft,
  Building2,
  Calendar,
  Briefcase,
  MapPin,
  AlertTriangle,
  QrCode,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

const CUSTOMER_ID = "c-1"; 

export const Route = createFileRoute("/portal/elevators/$elevatorId")({
  loader: ({ params }) => {
    const elevator = mockElevators.find((e) => e.id === params.elevatorId);
    if (!elevator) throw notFound();
    return { elevator };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.elevator.code ?? "Chi tiết thang máy"}` }],
  }),
  notFoundComponent: () => (
    <AppShell>
      <div className="p-12 text-center">
        <p className="text-muted-foreground">Không tìm thấy thang máy hoặc bạn không có quyền truy cập</p>
        <Link to="/portal/elevators">
          <Button className="mt-4">Quay lại</Button>
        </Link>
      </div>
    </AppShell>
  ),
  component: PortalElevatorDetail,
});

function PortalElevatorDetail() {
  const { elevator } = Route.useLoaderData();

  const history = mockJobs
    .filter((j) => j.elevatorId === elevator.id && j.customerId === CUSTOMER_ID)
    .sort((a, b) => b.scheduledFor.localeCompare(a.scheduledFor));

  const isOut = elevator.status === "out_of_order";
  const isDue = elevator.status === "maintenance_due";

  return (
    <AppShell>
      <Link
        to="/portal/elevators"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Quay lại danh sách
      </Link>

      <PageHeader
        title={`Chi tiết thang: ${elevator.code}`}
        description={`${elevator.building} - ${elevator.brand} ${elevator.model}`}
        actions={
          <div className="flex gap-2">
            <Link to="/qr/$elevatorId" params={{ elevatorId: elevator.id }}>
              <Button variant="outline" className="bg-background">
                <QrCode className="h-4 w-4 mr-2" /> Xem QR
              </Button>
            </Link>
            <Link to="/portal/issues">
              <Button variant={isOut ? "destructive" : "default"}>
                <AlertTriangle className="h-4 w-4 mr-2" /> Báo sự cố
              </Button>
            </Link>
          </div>
        }
      />

      {(isDue || isOut) && (
        <div
          className={`flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl mb-6 border ${
            isOut ? "bg-destructive/10 text-destructive border-destructive/20" : "bg-warning/10 text-warning-foreground border-warning/20"
          }`}
        >
          <div className="flex items-center gap-3 flex-1">
            <div className={`p-2 rounded-full ${isOut ? "bg-destructive/20" : "bg-warning/20"}`}>
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <div className="font-semibold text-lg">
                {isOut ? "Thang máy đang tạm ngừng hoạt động!" : "Thang máy đã đến hạn bảo trì!"}
              </div>
              <div className="text-sm opacity-90 mt-0.5">
                {isOut
                  ? "Xin lỗi vì sự bất tiện này. Chúng tôi khuyên bạn nên báo sự cố ngay nếu chưa có kỹ thuật viên liên hệ."
                  : `Hạn bảo trì tiếp theo là ${formatDate(elevator.nextMaintenance)}. Vui lòng sắp xếp lịch để đảm bảo hoạt động.`}
              </div>
            </div>
          </div>
        </div>
      )}

      {elevator.status === "operational" && !isDue && (
         <div className="flex items-center gap-3 p-4 rounded-xl mb-6 bg-success/10 text-success-foreground border border-success/20">
             <div className="p-2 rounded-full bg-success/20">
               <CheckCircle2 className="h-6 w-6 text-success" />
             </div>
             <div>
               <div className="font-semibold text-lg">Hoạt động bình thường</div>
               <div className="text-sm opacity-90 mt-0.5">Thang máy đang trong trạng thái tốt. Lần bảo trì tiếp theo: {formatDate(elevator.nextMaintenance)}</div>
             </div>
         </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Thông tin thang máy */}
        <Card className="p-6 lg:col-span-1 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{elevator.code}</h3>
                <p className="text-sm text-muted-foreground">{elevator.floors} tầng</p>
              </div>
            </div>
            <StatusBadge variant={elevatorStatusVariant[elevator.status]}>
              {elevatorStatusLabel[elevator.status]}
            </StatusBadge>
          </div>

          <div className="space-y-4 text-sm mt-2">
            <Row label="Hãng sản xuất" value={elevator.brand} />
            <Row label="Model" value={elevator.model} />
            <Row label="Tòa nhà" value={elevator.building} />
            <div className="flex items-start gap-2 pt-1 border-t mt-3 border-border/50">
              <span className="text-muted-foreground w-32 shrink-0 pt-1">Địa chỉ</span>
              <span className="flex items-start gap-1 font-medium pt-1">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
                {elevator.address}
              </span>
            </div>
          </div>
        </Card>

        {/* Thông tin bảo hành & thời gian */}
        <Card className="p-6 lg:col-span-1 shadow-sm hover:shadow-md transition-all duration-200">
          <h3 className="font-semibold text-lg mb-5 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" /> Mốc thời gian
          </h3>
          <div className="space-y-4 text-sm">
            <Row label="Ngày lắp đặt" value={formatDate(elevator.installedAt)} />
            <Row
              label="Hạn bảo hành"
              value={formatDate(elevator.warrantyUntil)}
            />
            <Row label="Bảo trì gần nhất" value={formatDate(elevator.lastMaintenance)} />
            
            <div className="pt-4 border-t mt-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Bảo trì tiếp theo</span>
                <span className={`font-semibold text-base py-1 px-3 rounded-md ${isDue ? "bg-warning/20 text-warning-foreground" : "bg-primary/10 text-primary"}`}>
                  {formatDate(elevator.nextMaintenance)}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Thông tin chứng nhận */}
         <Card className="p-6 lg:col-span-1 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="h-full flex flex-col">
            <h3 className="font-semibold text-lg mb-5 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-success" /> Tình trạng kiểm định
            </h3>
            
            <div className="space-y-4 text-sm flex-1">
               <Row label="Trạng thái" value="Đạt tiêu chuẩn an toàn" highlightClassName="text-success font-semibold" />
               <Row label="Số kiểm định" value="KD-2025-04821" />
               <Row label="Ngày kiểm định" value="20/04/2025" />
               <Row label="Hạn kiểm định" value="20/04/2026" />
            </div>

            <div className="pt-4 mt-auto">
               <Button variant="secondary" className="w-full">
                  Tải giấy chứng nhận
               </Button>
            </div>
          </div>
        </Card>

        {/* Lịch sử công việc */}
        <Card className="p-6 lg:col-span-3 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" /> Lịch sử bảo trì & sửa chữa
            </h3>
          </div>
          
          {history.length > 0 ? (
            <div className="space-y-3">
              {history.map((j) => (
                <div
                  key={j.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border border-border/50 hover:bg-muted/30 transition-colors"
                >
                  <div
                    className={`hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                      j.status === "completed"
                        ? "bg-success/20 text-success"
                        : j.status === "in_progress"
                        ? "bg-warning/20 text-warning"
                        : "bg-primary/20 text-primary"
                    }`}
                  >
                    {j.status === "completed" ? <CheckCircle2 className="h-5 w-5" /> : <Briefcase className="h-5 w-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-semibold text-base truncate">{j.title}</span>
                      <StatusBadge variant={jobStatusVariant[j.status]}>
                        {jobStatusLabel[j.status]}
                      </StatusBadge>
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                      <span>Lên lịch: {formatDateTime(j.scheduledFor)}</span>
                      {j.completedAt && (
                        <>
                           <span>•</span>
                           <span>Hoàn thành: {formatDateTime(j.completedAt)}</span>
                        </>
                      )}
                    </div>
                    {j.report && (
                      <div className="bg-muted p-3 rounded-lg text-sm text-foreground/80 mt-3 italic border-l-2 border-primary/50">
                        "{j.report}"
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center border rounded-xl bg-muted/20 border-dashed">
              <Briefcase className="mx-auto h-12 w-12 text-muted-foreground/30 mb-3" />
              <h3 className="text-lg font-medium text-foreground mb-1">Chưa có dữ liệu</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Thang máy này hiện chưa có lịch sử bảo trì hoặc sửa chữa nào được ghi nhận trên hệ thống.
              </p>
            </div>
          )}
        </Card>
      </div>
    </AppShell>
  );
}

function Row({
  label,
  value,
  highlightClassName,
}: {
  label: string;
  value: string;
  highlightClassName?: string;
}) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-border/30 last:border-0 last:pb-0">
      <span className="text-muted-foreground">{label}</span>
      <span className={highlightClassName || "font-medium"}>{value}</span>
    </div>
  );
}
