import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RouteMap } from "@/components/common/RouteMap";
import {
  StatusBadge,
  jobStatusLabel,
  jobStatusVariant,
  priorityLabel,
  priorityVariant,
} from "@/components/common/StatusBadge";
import { mockJobs, getCustomer, getElevator, formatDateTime, optimizeRoute } from "@/lib/mock-data";
import { useAppStore } from "@/lib/store";
import {
  ArrowLeft,
  Camera,
  MapPin,
  Phone,
  Calendar,
  CheckCircle2,
  FileText,
  Plus,
  Map as MapIcon,
  Navigation,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/tech/jobs/$jobId")({
  loader: ({ params }) => {
    const job = mockJobs.find((j) => j.id === params.jobId);
    if (!job) throw notFound();
    return { job };
  },
  head: ({ loaderData }) => ({ meta: [{ title: `${loaderData?.job.code ?? "Công việc"}` }] }),
  notFoundComponent: () => (
    <AppShell>
      <div className="p-12 text-center">
        <p>Không tìm thấy</p>
        <Link to="/tech/jobs">
          <Button className="mt-4">Quay lại</Button>
        </Link>
      </div>
    </AppShell>
  ),
  component: TechJobDetail,
});

function TechJobDetail() {
  const { job } = Route.useLoaderData();
  const userId = useAppStore((s) => s.userId);
  const cus = getCustomer(job.customerId);
  const elev = job.elevatorId ? getElevator(job.elevatorId) : undefined;
  const [beforeCount, setBeforeCount] = useState<number>(job.beforePhotos.length);
  const [afterCount, setAfterCount] = useState<number>(job.afterPhotos.length);
  const [report, setReport] = useState<string>(job.report || "");
  const [status, setStatus] = useState<typeof job.status>(job.status);

  // Tính lộ trình tối ưu trong ngày của KTV để hiển thị vị trí công việc này trên bản đồ
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
      toast.warning("Thiết bị không hỗ trợ định vị, mở bản đồ theo điểm đích.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        launch(`${pos.coords.latitude},${pos.coords.longitude}`);
        toast.success("Đang mở chỉ đường từ vị trí hiện tại.");
      },
      () => {
        launch();
        toast.warning("Không lấy được vị trí hiện tại, mở bản đồ theo điểm đích.");
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  return (
    <AppShell>
      <Link
        to="/tech/jobs"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="h-4 w-4" /> Quay lại
      </Link>

      <PageHeader title={job.title} description={job.code} />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <StatusBadge variant={jobStatusVariant[status]}>{jobStatusLabel[status]}</StatusBadge>
              <StatusBadge variant={priorityVariant[job.priority]}>
                {priorityLabel[job.priority]}
              </StatusBadge>
            </div>
            <p className="text-sm text-muted-foreground">{job.description}</p>
            <div className="mt-4 text-sm flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="font-medium">{formatDateTime(job.scheduledFor)}</span>
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b">
              <MapIcon className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-sm">Vị trí trên lộ trình</h3>
              {myStop && (
                <span className="ml-auto text-xs text-muted-foreground">
                  Điểm dừng <span className="font-semibold text-foreground">#{stopIndex + 1}</span>{" "}
                  · {myStop.legKm.toFixed(1)} km · ~{myStop.etaMinutes} phút
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
              <Link to="/tech/jobs" className="text-xs text-primary hover:underline">
                Xem luồng công việc & lộ trình →
              </Link>
              <Button size="sm" variant="outline" className="gap-1.5" onClick={openMapToJob}>
                <Navigation className="h-3.5 w-3.5" /> Chỉ đường tới đây
              </Button>
            </div>
          </Card>

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
                      setBeforeCount((c: number) => c + 1);
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
                      setAfterCount((c: number) => c + 1);
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
              <Button
                variant="outline"
                onClick={() => {
                  setStatus("in_progress");
                  toast.success("Đã bắt đầu công việc");
                }}
              >
                Bắt đầu
              </Button>
              <Button
                onClick={() => {
                  setStatus("completed");
                  toast.success("Đã hoàn thành & gửi biên bản cho khách hàng");
                }}
                className="gap-1.5"
              >
                <CheckCircle2 className="h-4 w-4" /> Hoàn thành
              </Button>
            </div>
          </Card>
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
