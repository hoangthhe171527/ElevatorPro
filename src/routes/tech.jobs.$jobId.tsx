// src/routes/tech.jobs.$jobId.tsx  ← THAY THẾ FILE CŨ
import { createFileRoute, Link, notFound, useLocation } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { RouteMap } from "@/components/common/RouteMap";
import { StatusBadge } from "@/components/common/StatusBadge";;
import {
  jobStatusLabel,
  jobStatusVariant,
  priorityLabel,
  priorityVariant,
} from "@/lib/status-variants";
import {
  mockJobs,
  getCustomer,
  getElevator,
  formatDateTime,
  optimizeRoute,
  mockInventory,
  mockLeads,
  formatVND,
  INSTALL_STAGES_TEMPLATE,
  type Job,
} from "@/lib/mock-data";
import { useAppStore, useIsSmallCompany } from "@/lib/store";
import {
  ArrowLeft,
  Camera,
  MapPin,
  Phone,
  Calendar,
  CheckCircle2,
  FileText,
  ClipboardCheck,
  Hammer,
  AlertTriangle,
  Check,
  Plus,
  Map as MapIcon,
  Navigation,
  Package,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { WebMaintenanceJobDetail } from "@/components/tech/web/WebTechMaintenanceDetail";
import { WebTechRepairDetail } from "@/components/tech/web/WebTechRepairDetail";
import { WebTechWarrantyDetail } from "@/components/tech/web/WebTechWarrantyDetail";

export const Route = createFileRoute("/tech/jobs/$jobId")({
  loader: ({ params }) => {
    const job = mockJobs.find((j) => j.id === params.jobId);
    if (!job) throw notFound();
    return { job };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.job.code ?? "Công việc"}` }],
  }),
  notFoundComponent: () => (
    <AppShell>
      <div className="p-12 text-center">
        <p>Không tìm thấy</p>
        <Link to="/tech/jobs" search={{ tab: "install" }}>
          <Button className="mt-4">Quay lại</Button>
        </Link>
      </div>
    </AppShell>
  ),
  component: TechJobDetailContainer,
});

function TechJobDetailContainer() {
  const { job } = Route.useLoaderData();

  if (job.type === "maintenance") {
    return <WebMaintenanceJobDetail job={job} />;
  }

  if (job.type === "repair" || job.type === "incident") {
    return <WebTechRepairDetail job={job} />;
  }

  if (job.type === "warranty") {
    return <WebTechWarrantyDetail job={job} />;
  }

  return <TechJobDetail job={job} />;
}

function useAppPrefix() {
  const { pathname } = useLocation();
  return pathname.startsWith("/app") ? "/app" : "";
}

export function TechJobDetail({ job }: { job: Job }) {
  const userId = useAppStore((s) => s.userId);
  const prefix = useAppPrefix();
  const cus = getCustomer(job.customerId);
  const elev = job.elevatorId ? getElevator(job.elevatorId) : undefined;

  const [beforeCount, setBeforeCount] = useState<number>(job.beforePhotos.length);
  const [afterCount, setAfterCount] = useState<number>(job.afterPhotos.length);
  const [report, setReport] = useState<string>(job.report || "");
  const [status, setStatus] = useState<typeof job.status>(job.status);
  const [surveyData, setSurveyData] = useState(
    job.surveyReport || {
      pitDepth: "",
      overheadHeight: "",
      shaftDimensions: "",
      powerSupply: "",
      specialNotes: "",
    },
  );
  const [appointmentConfirmed, setAppointmentConfirmed] = useState(
    job.appointmentConfirmed || false,
  );
  const [usedParts, setUsedParts] = useState<{ id: string; qty: number }[]>([]);
  const [selectedPartId, setSelectedPartId] = useState("");
  const [repairQuoteMode, setRepairQuoteMode] = useState(false);
  const [repairItems, setRepairItems] = useState<
    { id: string; name: string; price: number; qty: number }[]
  >([]);
  const [awaitingApproval, setAwaitingApproval] = useState(false);

  const addPart = () => {
    if (!selectedPartId) return;
    if (usedParts.find((p) => p.id === selectedPartId)) {
      toast.error("Vật tư này đã có trong danh sách");
      return;
    }
    setUsedParts([...usedParts, { id: selectedPartId, qty: 1 }]);
    setSelectedPartId("");
  };

  const updatePartQty = (id: string, qty: number) => {
    if (qty < 1) return;
    setUsedParts(usedParts.map((p) => (p.id === id ? { ...p, qty } : p)));
  };

  const removePart = (id: string) => {
    setUsedParts(usedParts.filter((p) => p.id !== id));
  };

  const route = useMemo(() => {
    const dayKey = job.scheduledFor.split("T")[0];
    const sameDayJobs = mockJobs.filter(
      (j) =>
        j.assignedTo === (job.assignedTo || userId) &&
        (j.status === "scheduled" || j.status === "in_progress") &&
        j.scheduledFor.startsWith(dayKey),
    );
    const list = sameDayJobs.length > 0 ? sameDayJobs : [job];
    return optimizeRoute(job.assignedTo || userId, list);
  }, [job, userId]);

  const stopIndex = route.stops.findIndex((s) => s.jobId === job.id);
  const myStop = stopIndex >= 0 ? route.stops[stopIndex] : null;
  const destination = cus ? `${cus.lat},${cus.lng}` : undefined;

  const openMapToJob = () => {
    if (!destination) {
      toast.error("Không có tọa độ điểm đến.");
      return;
    }
    const launch = (origin?: string) => {
      const url = origin
        ? `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&travelmode=driving`
        : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}&travelmode=driving`;
      window.open(url, "_blank", "noopener,noreferrer");
    };
    if (!navigator.geolocation) {
      launch();
      toast.warning("Thiết bị không hỗ trợ định vị.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        launch(`${pos.coords.latitude},${pos.coords.longitude}`);
        toast.success("Đang mở chỉ đường từ vị trí hiện tại.");
      },
      () => {
        launch();
        toast.warning("Không lấy được vị trí, mở bản đồ theo điểm đích.");
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  return (
    <AppShell>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <Link
          to={`${prefix}/tech/jobs` as any}
          search={{ tab: "install" } as any}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Quay lại danh sách
        </Link>

        {job.projectId && (
          <Link
            to={`${prefix}/tech/projects/$projectId` as any}
            params={{ projectId: job.projectId } as any}
            className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-colors"
          >
            <Hammer className="h-3 w-3" /> Xem 8 giai đoạn dự án
          </Link>
        )}
      </div>

      <PageHeader title={job.title} description={job.code} />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <StatusBadge variant={jobStatusVariant[status]}>{jobStatusLabel[status]}</StatusBadge>
              <StatusBadge variant={priorityVariant[job.priority]}>
                {priorityLabel[job.priority]}
              </StatusBadge>
            </div>
            <div className="mt-4 text-sm flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="font-medium">{formatDateTime(job.scheduledFor)}</span>
            </div>
          </Card>

          {/* Maintenance Wizard Link */}
          {job.type === "maintenance" && (
            <Card className="p-5 border-2 border-primary/20 bg-primary/[0.02]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <h3 className="font-bold text-sm uppercase tracking-wide">
                    Quy trình bảo trì định kỳ
                  </h3>
                </div>
                <Badge variant="outline" className="text-[10px]">
                  Chuyên sâu
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                Công việc bảo trì định kỳ yêu cầu thực hiện theo checklist 7 bước tiêu chuẩn (Phòng
                máy, Cabin, Hố thang, PIT...) để đảm bảo an toàn vận hành.
              </p>
              <Link to={`${prefix}/tech/maint/${job.id}` as any}>
                <Button className="w-full h-12 rounded-xl font-black shadow-lg shadow-primary/20">
                  MỞ WIZARD BẢO TRÌ →
                </Button>
              </Link>
            </Card>
          )}

          {/* Installation Progress for Tech */}
          {job.type === "install" && (
            <Card className="p-5 overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
                    <Hammer className="h-4 w-4" />
                  </div>
                  <h3 className="font-bold text-sm uppercase tracking-wide">
                    Tiến độ lắp đặt (8 giai đoạn)
                  </h3>
                </div>
                <Badge variant="outline" className="text-[10px]">
                  Đang thực hiện
                </Badge>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {INSTALL_STAGES_TEMPLATE.map((stage, idx) => {
                  const isCurrent =
                    job.title.includes(stage.label) || job.code.includes(`INSTALL-${idx + 1}`);
                  const isPast =
                    !isCurrent &&
                    (job.code.match(/INSTALL-(\d+)/)?.[1]
                      ? parseInt(job.code.match(/INSTALL-(\d+)/)![1]) > idx + 1
                      : false);

                  return (
                    <div key={stage.id} className="flex flex-col items-center gap-1">
                      <div
                        className={`
                          w-full h-1.5 rounded-full transition-all duration-500
                          ${isCurrent ? "bg-primary animate-pulse" : isPast ? "bg-success" : "bg-muted"}
                        `}
                      />
                      <span
                        className={`text-[8px] font-bold text-center leading-tight truncate w-full ${isCurrent ? "text-primary" : "text-muted-foreground"}`}
                      >
                        {stage.label.split(": ")[1] || stage.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 p-3 rounded-lg bg-muted/30 border border-dashed flex items-center justify-between">
                <div className="text-[10px] text-muted-foreground italic">
                  Giai đoạn hiện tại của bạn:{" "}
                  <span className="font-bold text-foreground">
                    #{job.code.split("-").pop()} - {job.title}
                  </span>
                </div>
                <Link
                  to={`${prefix}/tech/jobs` as any}
                  search={{ tab: "install" } as any}
                  className="text-[10px] font-bold text-primary hover:underline"
                >
                  Chi tiết dự án →
                </Link>
              </div>
            </Card>
          )}

          {/* Survey Workflow (Sales Support) */}
          {job.type === "inspection" && (
            <Card className="p-5 border-l-4 border-l-indigo-500 bg-indigo-50/30">
              <div className="flex items-center gap-2 mb-4">
                <ClipboardCheck className="h-5 w-5 text-indigo-600" />
                <h3 className="font-black text-sm uppercase tracking-widest text-indigo-900">
                  Thông số khảo sát hiện trường
                </h3>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-indigo-700/60">
                      Hố PIT (mm)
                    </label>
                    <Input
                      placeholder="VD: 1200"
                      className="bg-white rounded-xl"
                      value={surveyData.pitDepth}
                      onChange={(e) => setSurveyData({ ...surveyData, pitDepth: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-indigo-700/60">
                      Overhead (mm)
                    </label>
                    <Input
                      placeholder="VD: 4200"
                      className="bg-white rounded-xl"
                      value={surveyData.overheadHeight}
                      onChange={(e) =>
                        setSurveyData({ ...surveyData, overheadHeight: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-indigo-700/60">
                    Kích thước thông thủy hố thang (mm)
                  </label>
                  <Input
                    placeholder="VD: 1500 x 1500"
                    className="bg-white rounded-xl"
                    value={surveyData.shaftDimensions}
                    onChange={(e) =>
                      setSurveyData({ ...surveyData, shaftDimensions: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-indigo-700/60">
                    Nguồn điện (Pha/Volts)
                  </label>
                  <Select
                    value={surveyData.powerSupply}
                    onValueChange={(v) => setSurveyData({ ...surveyData, powerSupply: v })}
                  >
                    <SelectTrigger className="bg-white rounded-xl">
                      <SelectValue placeholder="Chọn loại nguồn điện..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3phase">3 Pha - 380V</SelectItem>
                      <SelectItem value="1phase">1 Pha - 220V</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-indigo-700/60">
                    Ghi chú hiện trường
                  </label>
                  <Textarea
                    placeholder="VD: Lối vào công trình hẹp, cần xe cẩu nhỏ..."
                    className="bg-white rounded-xl min-h-[80px]"
                    value={surveyData.specialNotes}
                    onChange={(e) => setSurveyData({ ...surveyData, specialNotes: e.target.value })}
                  />
                </div>

                <div className="p-3 bg-indigo-600/10 rounded-xl border border-indigo-200 flex items-center gap-2">
                  <Camera className="h-4 w-4 text-indigo-600" />
                  <span className="text-[10px] font-bold text-indigo-900 uppercase">
                    Yêu cầu ít nhất 4 ảnh hiện trường
                  </span>
                </div>
              </div>
            </Card>
          )}

          <Card className="overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b">
              <MapIcon className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-sm">Vị trí trên lộ trình</h3>
              {myStop && (
                <span className="ml-auto text-xs text-muted-foreground">
                  Điểm <span className="font-semibold text-foreground">#{stopIndex + 1}</span>
                  {" · "}
                  {myStop.legKm.toFixed(1)} km · ~{myStop.etaMinutes} phút
                </span>
              )}
            </div>
            <RouteMap
              height={280}
              highlightJobId={job.id}
              routes={[
                { id: route.base.name, color: "var(--route-1)", label: "Tuyến trong ngày", route },
              ]}
            />
            <div className="flex items-center justify-between gap-2 p-3 border-t bg-muted/30">
              <Link
                to={`${prefix}/tech/jobs` as any}
                search={{ tab: "install" } as any}
                className="text-xs text-primary hover:underline"
              >
                Xem lộ trình hôm nay →
              </Link>
              <Button size="sm" variant="outline" className="gap-1.5" onClick={openMapToJob}>
                <Navigation className="h-3.5 w-3.5" /> Chỉ đường tới đây
              </Button>
            </div>
          </Card>

          {/* Photos */}
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Camera className="h-4 w-4" />
              <h3 className="font-semibold">Ảnh hiện trường</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-medium mb-2">Trước ({beforeCount})</div>
                <div className="grid grid-cols-2 gap-2">
                  {Array.from({ length: beforeCount }).map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-lg bg-muted flex items-center justify-center"
                    >
                      <Camera className="h-5 w-5 text-muted-foreground" />
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const mockPhoto =
                        "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=400";
                      job.beforePhotos.push(mockPhoto);
                      setBeforeCount(job.beforePhotos.length);
                      toast.success("Đã thêm ảnh trước");
                    }}
                    className="aspect-square rounded-lg border-2 border-dashed flex items-center justify-center hover:bg-muted transition-colors"
                  >
                    <Plus className="h-5 w-5 text-muted-foreground" />
                  </button>
                </div>
              </div>
              <div>
                <div className="text-xs font-medium mb-2">Sau ({afterCount})</div>
                <div className="grid grid-cols-2 gap-2">
                  {Array.from({ length: afterCount }).map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-lg bg-muted flex items-center justify-center"
                    >
                      <Camera className="h-5 w-5 text-muted-foreground" />
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const mockPhoto =
                        "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=400";
                      job.afterPhotos.push(mockPhoto);
                      setAfterCount(job.afterPhotos.length);
                      toast.success("Đã thêm ảnh sau");
                    }}
                    className="aspect-square rounded-lg border-2 border-dashed flex items-center justify-center hover:bg-muted transition-colors"
                  >
                    <Plus className="h-5 w-5 text-muted-foreground" />
                  </button>
                </div>
              </div>
            </div>
          </Card>

          {/* Parts Used - Hide for Installation and Inspection jobs */}
          {job.type !== "install" && job.type !== "inspection" && (
            <Card className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  <h3 className="font-semibold">Vật tư thay thế</h3>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <Select value={selectedPartId} onValueChange={setSelectedPartId}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Chọn vật tư từ kho..." />
                  </SelectTrigger>
                  <SelectContent>
                    {mockInventory.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name} ({item.stock} {item.unit} sẵn có)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={addPart} variant="secondary">
                  Thêm
                </Button>
              </div>

              {usedParts.length > 0 ? (
                <div className="border rounded-lg overflow-hidden">
                  {usedParts.map((p, idx) => {
                    const part = mockInventory.find((i) => i.id === p.id);
                    if (!part) return null;
                    return (
                      <div
                        key={p.id}
                        className={`flex items-center justify-between p-3 ${idx < usedParts.length - 1 ? "border-b" : ""}`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-sm truncate">{part.name}</div>
                          <div className="text-xs text-muted-foreground">{part.code}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-7 w-7"
                              onClick={() => updatePartQty(p.id, p.qty - 1)}
                            >
                              -
                            </Button>
                            <span className="w-6 text-center text-sm font-medium">{p.qty}</span>
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-7 w-7"
                              onClick={() => updatePartQty(p.id, p.qty + 1)}
                            >
                              +
                            </Button>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => removePart(p.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground text-center py-4 bg-muted/30 rounded border border-dashed">
                  Chưa thêm vật tư nào.
                </div>
              )}
            </Card>
          )}
          {/* Reparation/Incident Workflow */}
          {(job.type === "repair" || job.type === "warranty") && status === "in_progress" && (
            <Card className="p-5 border-l-4 border-l-destructive shadow-lg bg-destructive/[0.02]">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <h3 className="font-black text-sm uppercase tracking-wider">
                  Xử lý sự cố / Sửa chữa
                </h3>
              </div>

              <div className="space-y-6">
                {/* Stage 1: Confirmation */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-background border shadow-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-6 w-6 rounded-full flex items-center justify-center ${job.customerConfirmed ? "bg-success text-white" : "bg-muted text-muted-foreground"}`}
                    >
                      <Check className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-sm font-bold">Xác nhận với khách hàng</span>
                  </div>
                  {!job.customerConfirmed && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-[10px] font-bold"
                      onClick={() =>
                        toast.success("Đã ghi nhận xác nhận với khách qua điện thoại/trực tiếp.")
                      }
                    >
                      XÁC NHẬN NGAY
                    </Button>
                  )}
                </div>

                {/* Stage 2: Photos */}
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    Hiện trạng lỗi (Chụp ảnh)
                  </p>
                  <Button
                    variant="outline"
                    className="w-full h-12 border-dashed border-2 border-muted-foreground/30 hover:border-primary hover:bg-primary/5 transition-all"
                  >
                    <Camera className="h-5 w-5 mr-2" /> Chụp ảnh lỗi
                  </Button>
                </div>

                {/* Stage 3: Decision */}
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    className="h-16 flex flex-col items-center justify-center rounded-2xl bg-success hover:bg-success/90 shadow-lg shadow-success/10 border-b-4 border-success-foreground/20"
                    onClick={() => toast.success("Đã ghi nhận: Lỗi nhẹ, khắc phục ngay.")}
                  >
                    <CheckCircle2 className="h-5 w-5 mb-1" />
                    <span className="text-[10px] font-bold">LỖI NHẸ</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-16 flex flex-col items-center justify-center rounded-2xl border-2 border-destructive text-destructive hover:bg-destructive/5"
                    onClick={() => setRepairQuoteMode(true)}
                  >
                    <Package className="h-5 w-5 mb-1" />
                    <span className="text-[10px] font-bold">LỖI NẶNG (QUOTATION)</span>
                  </Button>
                </div>

                {/* Repair Quote Builder */}
                {repairQuoteMode && (
                  <div className="mt-4 p-4 rounded-2xl bg-background border-2 border-destructive/20 animate-in slide-in-from-top-2 duration-300">
                    <h4 className="text-xs font-black text-destructive uppercase mb-3 flex items-center gap-2">
                      <FileText className="h-4 w-4" /> Báo giá thay thế tại chỗ
                    </h4>

                    <div className="flex gap-2 mb-3">
                      <Select value={selectedPartId} onValueChange={setSelectedPartId}>
                        <SelectTrigger className="grow h-10">
                          <SelectValue placeholder="Chọn vật tư từ kho..." />
                        </SelectTrigger>
                        <SelectContent>
                          {mockInventory.map((item) => (
                            <SelectItem key={item.id} value={item.id}>
                              {item.name} ({formatVND(item.unitPrice)})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        size="icon"
                        onClick={() => {
                          if (!selectedPartId) return;
                          const part = mockInventory.find((i) => i.id === selectedPartId);
                          if (part) {
                            setRepairItems([
                              ...repairItems,
                              { id: part.id, name: part.name, price: part.unitPrice, qty: 1 },
                            ]);
                            setSelectedPartId("");
                          }
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-2 mb-4 max-h-[150px] overflow-y-auto">
                      {repairItems.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 rounded-lg bg-muted/30 text-xs"
                        >
                          <span className="font-bold">{item.name}</span>
                          <span className="font-mono text-destructive">
                            {formatVND(item.price)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-destructive/5 mb-4 border border-destructive/10">
                      <span className="text-xs font-bold uppercase">Tổng cộng:</span>
                      <span className="text-lg font-black text-destructive">
                        {formatVND(repairItems.reduce((s, i) => s + i.price, 0))}
                      </span>
                    </div>

                    <Button
                      className="w-full h-12 rounded-xl bg-destructive hover:bg-destructive/90 font-black shadow-lg shadow-destructive/20"
                      onClick={() => {
                        toast.success("Báo giá đã lập! Vui lòng cho khách xem và duyệt trực tiếp.");
                        setAwaitingApproval(true);
                      }}
                    >
                      CHỐT BÁO GIÁ VỚI KHÁCH
                    </Button>
                  </div>
                )}

                {/* Awaiting Approval Action */}
                {awaitingApproval && (
                  <div className="mt-4 p-4 rounded-2xl bg-warning/10 border-2 border-dashed border-warning/30 flex flex-col items-center gap-3 text-center">
                    <div className="text-xs font-bold text-warning-foreground uppercase tracking-widest">
                      Đang chờ khách duyệt báo giá...
                    </div>
                    <Button
                      className="w-full h-12 rounded-xl bg-warning hover:bg-warning/90 text-warning-foreground font-black shadow-lg shadow-warning/20"
                      onClick={() => {
                        toast.success("Đã ghi nhận khách duyệt báo giá bên ngoài hệ thống!");
                        setAwaitingApproval(false);
                        setRepairQuoteMode(false);
                        setStatus("in_progress");
                      }}
                    >
                      KHÁCH ĐÃ DUYỆT (CHỐT SỬA)
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Report + action buttons */}
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="h-4 w-4" />
              <h3 className="font-semibold">Biên bản nghiệm thu</h3>
            </div>
            <Textarea
              placeholder="Nhập kết quả kiểm tra, các hạng mục đã thực hiện, đề xuất..."
              value={report}
              onChange={(e) => setReport(e.target.value)}
              rows={5}
            />
            <div className="mt-3 flex flex-wrap gap-2">
              {status !== "completed" && status !== "cancelled" && (
                <Button
                  variant="outline"
                  className="bg-warning/10 border-warning/30 text-warning-foreground hover:bg-warning/20 shadow-sm"
                  onClick={() => {
                    toast.info("Gửi yêu cầu đổi lịch lên CEO...");
                    setTimeout(() => {
                      toast.success(
                        "Đã gửi yêu cầu! CEO sẽ kiểm tra và điều chỉnh lại lịch bảo trì.",
                      );
                    }, 1000);
                  }}
                >
                  <Calendar className="h-4 w-4 mr-2" /> Yêu cầu đổi lịch
                </Button>
              )}

              {job.type === "inspection" && status === "scheduled" && !appointmentConfirmed && (
                <Button
                  variant="outline"
                  className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                  onClick={() => {
                    toast.success("Đang liên hệ với khách hàng...");
                    setTimeout(() => {
                      setAppointmentConfirmed(true);
                      setStatus("appointment_confirmed");
                      toast.success("Khách hàng đã xác nhận lịch khảo sát!");
                    }, 1000);
                  }}
                >
                  <Phone className="h-4 w-4 mr-2" /> Gọi điện & Hẹn lịch
                </Button>
              )}

              {status === "appointment_confirmed" && (
                <Button
                  className="flex-1 bg-success hover:bg-success/90 text-white font-bold h-12 rounded-xl shadow-lg shadow-success/20"
                  onClick={() => {
                    if (job.type === "inspection" && beforeCount + afterCount < 1) {
                      toast.error(
                        "Vui lòng chụp ít nhất 1 ảnh hiện trường trước khi hoàn thành khảo sát.",
                      );
                      return;
                    }
                    setStatus("completed");
                    toast.success(
                      job.type === "inspection"
                        ? "Đã hoàn thành khảo sát! Dữ liệu đã được chuyển cho bộ phận Sales/Sales Admin."
                        : "Đã cập nhật trạng thái Hoàn thành.",
                    );
                  }}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  {job.type === "inspection" ? "HOÀN THÀNH KHẢO SÁT" : "XÁC NHẬN HOÀN THÀNH"}
                </Button>
              )}

              {status === "scheduled" && job.type !== "inspection" && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setStatus("in_progress");
                    job.status = "in_progress";
                    toast.success("Đã bắt đầu công việc");
                  }}
                >
                  Bắt đầu
                </Button>
              )}

              {status !== "completed" &&
                (status === "in_progress" ||
                  (job.type !== "inspection" && status !== "scheduled")) && (
                  <Button
                    onClick={() => {
                      if (job.type === "inspection") {
                        if (!surveyData.pitDepth || !surveyData.shaftDimensions) {
                          toast.error("Vui lòng nhập đầy đủ thông số khảo sát quan trọng");
                          return;
                        }
                      } else if (!report.trim()) {
                        toast.error("Vui lòng điền biên bản trước khi hoàn thành");
                        return;
                      }

                      if (job.type === "install" && (beforeCount === 0 || afterCount === 0)) {
                        toast.error("BẮT BUỘC: Chụp ảnh hiện trường lắp đặt trước khi hoàn thành!");
                        return;
                      }

                      setStatus("completed");
                      job.status = "completed";
                      job.report = report;
                      job.surveyReport = surveyData;
                      job.completedAt = new Date().toISOString();

                      // Automatically update Lead status if this was a survey job
                      if (job.type === "inspection" && job.leadId) {
                        const lead = mockLeads.find((l) => l.id === job.leadId);
                        if (lead) {
                          lead.status = "surveyed";
                          toast.success(`Đã cập nhật trạng thái Lead: ${lead.name} -> Đã khảo sát`);
                        }
                      }

                      toast.success(
                        "Đã hoàn thành công việc. Kết quả đã được ghi nhận vào hệ thống.",
                      );
                      if (useIsSmallCompany()) {
                        toast.info(
                          "Ghi chú: Kết quả khảo sát đã được gửi cho CEO để chuẩn bị báo giá.",
                        );
                      }
                    }}
                    className="gap-1.5"
                  >
                    <CheckCircle2 className="h-4 w-4" /> Hoàn thành
                  </Button>
                )}
              {status === "completed" && (
                <div className="flex items-center gap-2 text-success text-sm">
                  <CheckCircle2 className="h-4 w-4" /> Đã hoàn thành
                </div>
              )}
            </div>
          </Card>

          {job.type === "inspection" && status === "in_progress" && (
            <Card className="p-5 border-blue-200 bg-blue-50/30">
              <div className="flex items-center gap-2 mb-4">
                <ClipboardCheck className="h-4 w-4 text-primary" />
                <h3 className="font-semibold">Chi tiết thông số khảo sát</h3>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold uppercase text-muted-foreground mb-1 block">
                    Chiều sâu hố Pit (mm)
                  </label>
                  <Input
                    type="number"
                    placeholder="VD: 1200"
                    value={surveyData.pitDepth}
                    onChange={(e) => setSurveyData({ ...surveyData, pitDepth: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-muted-foreground mb-1 block">
                    Chiều cao OH (mm)
                  </label>
                  <Input
                    type="number"
                    placeholder="VD: 4200"
                    value={surveyData.overheadHeight}
                    onChange={(e) =>
                      setSurveyData({ ...surveyData, overheadHeight: e.target.value })
                    }
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold uppercase text-muted-foreground mb-1 block">
                    Kích thước thông thủy hố thang (RxS mm)
                  </label>
                  <Input
                    placeholder="VD: 1600 x 1800"
                    value={surveyData.shaftDimensions}
                    onChange={(e) =>
                      setSurveyData({ ...surveyData, shaftDimensions: e.target.value })
                    }
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold uppercase text-muted-foreground mb-1 block">
                    Nguồn điện sẵn có
                  </label>
                  <Select
                    value={surveyData.powerSupply}
                    onValueChange={(v) => setSurveyData({ ...surveyData, powerSupply: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại nguồn điện..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1phase">1 Pha (220V)</SelectItem>
                      <SelectItem value="3phase">3 Pha (380V)</SelectItem>
                      <SelectItem value="none">Chưa có nguồn điện</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold uppercase text-muted-foreground mb-1 block">
                    Ghi chú đặc biệt
                  </label>
                  <Textarea
                    placeholder="Các vấn đề vướng mắc, lưu ý khi thi công..."
                    value={surveyData.specialNotes}
                    onChange={(e) => setSurveyData({ ...surveyData, specialNotes: e.target.value })}
                  />
                </div>
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="font-semibold mb-3">Khách hàng</h3>
            {cus && (
              <div className="space-y-2 text-sm">
                <div className="font-medium">{cus.name}</div>
                <div className="text-xs text-muted-foreground">{cus.contactPerson}</div>
                <a
                  href={`tel:${cus.phone}`}
                  className="flex items-center gap-1.5 text-xs text-primary"
                >
                  <Phone className="h-3 w-3" /> {cus.phone}
                </a>
                <div className="flex items-start gap-1.5 text-xs">
                  <MapPin className="h-3 w-3 mt-0.5" /> {cus.address}
                </div>
                <Button variant="outline" size="sm" className="w-full mt-2" onClick={openMapToJob}>
                  <MapPin className="h-3.5 w-3.5 mr-1.5" /> Chỉ đường
                </Button>
              </div>
            )}
          </Card>

          {elev && (
            <Card className="p-5">
              <h3 className="font-semibold mb-3">Thang máy</h3>
              <div className="space-y-1 text-sm">
                <div className="font-mono font-medium">{elev.code}</div>
                <div className="text-xs text-muted-foreground">
                  {elev.brand} {elev.model} — {elev.floors} tầng
                </div>
                <div className="text-xs text-muted-foreground">{elev.building}</div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </AppShell>
  );
}
