import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataPagination } from "@/components/common/DataPagination";
import { RouteMap } from "@/components/common/RouteMap";
import { StatCard } from "@/components/common/StatCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  jobStatusLabel,
  jobStatusVariant,
  priorityLabel,
  priorityVariant,
} from "@/lib/status-variants";
import { mockJobs, formatDateTime, getCustomer, optimizeRoute } from "@/lib/mock-data";
import { useAppStore } from "@/lib/store";
import {
  Briefcase,
  Search,
  Calendar,
  MapPin,
  Navigation,
  Route as RouteIcon,
  Clock,
  Sparkles,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/tech/jobs/")({
  head: () => ({ meta: [{ title: "Công việc của tôi" }] }),
  component: TechJobs,
});

const PAGE_SIZE = 6;

function TechJobs() {
  const userId = useAppStore((s) => s.userId);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const storageKey = `tech-route-completed-${userId}`;
  const [completedIds, setCompletedIds] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem(storageKey);
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      return [];
    }
  });

  const activeJobs = useMemo(
    () =>
      mockJobs.filter(
        (j) => j.assignedTo === userId && (j.status === "scheduled" || j.status === "in_progress"),
      ),
    [userId],
  );
  const route = useMemo(() => optimizeRoute(userId, activeJobs), [userId, activeJobs]);
  const nextStop = route.stops.find((s) => !completedIds.includes(s.jobId));

  const saveCompleted = (ids: string[]) => {
    setCompletedIds(ids);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(storageKey, JSON.stringify(ids));
    }
  };

  const markStopDone = (jobId: string) => {
    if (completedIds.includes(jobId)) return;
    const updated = [...completedIds, jobId];
    saveCompleted(updated);
    const next = route.stops.find((s) => !updated.includes(s.jobId));
    if (next) toast.success("Đã hoàn thành điểm hiện tại, chuyển sang điểm tiếp theo.");
    else toast.success("Tuyệt vời! Bạn đã hoàn thành toàn bộ tuyến hôm nay.");
  };

  const openMapToNextStop = () => {
    if (!nextStop) {
      toast.success("Không còn điểm nào cần chỉ đường.");
      return;
    }
    const destination = `${nextStop.lat},${nextStop.lng}`;
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
        toast.success(
          `Đang chỉ đường tới điểm ưu tiên #${route.stops.findIndex((s) => s.jobId === nextStop.jobId) + 1}`,
        );
      },
      () => {
        launch();
        toast.warning("Không lấy được vị trí hiện tại, mở bản đồ theo điểm đích.");
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  const filtered = mockJobs
    .filter((j) => j.assignedTo === userId)
    .filter((j) => {
      const m1 = !search || j.title.toLowerCase().includes(search.toLowerCase());
      const m2 = statusFilter === "all" || j.status === statusFilter;
      return m1 && m2;
    })
    .sort((a, b) => b.scheduledFor.localeCompare(a.scheduledFor));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <AppShell>
      <PageHeader
        title="Công việc & lộ trình của tôi"
        description="Một luồng xử lý: ưu tiên cảnh báo -> chỉ đường -> hoàn thành -> sang điểm tiếp theo"
      />

      <div className="grid gap-3 sm:grid-cols-4 mb-4">
        <StatCard label="Số điểm cần đi" value={route.stops.length} icon={MapPin} accent="info" />
        <StatCard
          label="Tổng quãng đường"
          value={`${route.totalKm.toFixed(1)} km`}
          icon={RouteIcon}
          accent="primary"
        />
        <StatCard
          label="Thời gian dự kiến"
          value={`${route.totalMinutes} phút`}
          icon={Clock}
          accent="warning"
        />
        <StatCard
          label="Đã xử lý trong tuyến"
          value={`${completedIds.filter((id) => route.stops.some((s) => s.jobId === id)).length}/${route.stops.length}`}
          icon={CheckCircle2}
          accent="success"
        />
      </div>

      <Card className="overflow-hidden mb-4">
        <RouteMap
          height={360}
          highlightJobId={nextStop?.jobId}
          routes={[{ id: userId, color: "var(--route-1)", label: "Tuyến của bạn", route }]}
        />
        <div className="flex items-center justify-between gap-2 p-3 border-t bg-muted/30">
          <div className="text-xs text-muted-foreground">
            <Sparkles className="h-3 w-3 inline mr-1 text-success" />
            Điểm được tô sáng là điểm cần làm đầu tiên theo ưu tiên + quãng đường
          </div>
          <Button size="sm" className="gap-1.5" onClick={openMapToNextStop}>
            <Navigation className="h-3.5 w-3.5" /> Chỉ đường tới điểm đầu tiên
          </Button>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="flex flex-col sm:flex-row gap-3 p-4 border-b">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm công việc..."
              className="pl-9"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(v) => {
              setStatusFilter(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              {Object.entries(jobStatusLabel).map(([k, v]) => (
                <SelectItem key={k} value={k}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="divide-y">
          {paged.map((j) => {
            const cus = getCustomer(j.customerId);
            const stopIdx = route.stops.findIndex((s) => s.jobId === j.id);
            const isInRoute = stopIdx >= 0;
            const isDoneInRoute = completedIds.includes(j.id);
            const isNext = nextStop?.jobId === j.id;
            const canMarkDone = isInRoute && (isNext || isDoneInRoute);
            return (
              <div key={j.id} className="p-4 hover:bg-muted/30">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <Link
                        to="/tech/jobs/$jobId"
                        params={{ jobId: j.id }}
                        className="font-semibold truncate hover:underline"
                      >
                        {j.title}
                      </Link>
                      <StatusBadge variant={priorityVariant[j.priority]}>
                        {priorityLabel[j.priority]}
                      </StatusBadge>
                      <StatusBadge variant={jobStatusVariant[j.status]}>
                        {jobStatusLabel[j.status]}
                      </StatusBadge>
                      {isInRoute && (
                        <StatusBadge
                          variant={isDoneInRoute ? "success" : isNext ? "info" : "warning"}
                        >
                          {isDoneInRoute
                            ? "Đã xong trên tuyến"
                            : isNext
                              ? `Điểm ưu tiên #${stopIdx + 1}`
                              : `Chờ điểm #${stopIdx + 1}`}
                        </StatusBadge>
                      )}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3 w-3" /> {formatDateTime(j.scheduledFor)}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3 w-3" /> {cus?.name}
                      </div>
                    </div>
                    {isInRoute && (
                      <div className="mt-3 flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 text-xs gap-1.5"
                          onClick={openMapToNextStop}
                        >
                          <Navigation className="h-3.5 w-3.5" /> Chỉ đường
                        </Button>
                        <Button
                          size="sm"
                          className="h-8 text-xs gap-1.5"
                          variant={isDoneInRoute ? "secondary" : "default"}
                          disabled={!canMarkDone}
                          onClick={() => markStopDone(j.id)}
                        >
                          {!canMarkDone && !isDoneInRoute && <Lock className="h-3.5 w-3.5" />}
                          {isDoneInRoute ? "Đã done" : "Done điểm này"}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <DataPagination
          page={page}
          pageSize={PAGE_SIZE}
          total={filtered.length}
          onPageChange={setPage}
        />
      </Card>
    </AppShell>
  );
}
