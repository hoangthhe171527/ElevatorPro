import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatCard } from "@/components/common/StatCard";
import { StatusBadge, priorityLabel, priorityVariant } from "@/components/common/StatusBadge";
import { RouteMap } from "@/components/common/RouteMap";
import { mockJobs, optimizeRoute, formatDateTime, getCustomer } from "@/lib/mock-data";
import { useAppStore } from "@/lib/store";
import { Route as RouteIcon, Clock, MapPin, Navigation, Sparkles, Zap, Phone } from "lucide-react";

export const Route = createFileRoute("/tech/route-plan")({
  head: () => ({ meta: [{ title: "Lộ trình tối ưu — Kỹ thuật" }] }),
  component: TechRoute,
});

function TechRoute() {
  const userId = useAppStore((s) => s.userId);
  const [day, setDay] = useState<string>("all");

  const myActive = useMemo(
    () => mockJobs.filter(j => j.assignedTo === userId && (j.status === "scheduled" || j.status === "in_progress")),
    [userId],
  );

  const days = useMemo(() => {
    const set = new Set(myActive.map(j => j.scheduledFor.split("T")[0]));
    return Array.from(set).sort();
  }, [myActive]);

  const jobs = day === "all" ? myActive : myActive.filter(j => j.scheduledFor.startsWith(day));
  const route = useMemo(() => optimizeRoute(userId, jobs), [userId, jobs]);

  return (
    <AppShell>
      <PageHeader
        title="Lộ trình tối ưu"
        description="Hệ thống tự động sắp xếp thứ tự điểm đến giúp bạn di chuyển ngắn nhất"
        actions={
          <Select value={day} onValueChange={setDay}>
            <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả công việc</SelectItem>
              {days.map(d => <SelectItem key={d} value={d}>{new Date(d).toLocaleDateString("vi-VN")}</SelectItem>)}
            </SelectContent>
          </Select>
        }
      />

      <div className="grid gap-3 sm:grid-cols-4 mb-4">
        <StatCard label="Số điểm đến" value={route.stops.length} icon={MapPin} accent="info" />
        <StatCard label="Tổng quãng đường" value={`${route.totalKm.toFixed(1)} km`} icon={RouteIcon} accent="primary" />
        <StatCard label="Thời gian di chuyển" value={`${route.totalMinutes} phút`} icon={Clock} accent="warning" />
        <StatCard label="Tiết kiệm so với gốc" value={`${route.savedKm.toFixed(1)} km`} icon={Sparkles} accent="success" />
      </div>

      <Card className="overflow-hidden mb-4">
        <RouteMap
          height={420}
          routes={[{ id: userId, color: "var(--route-1)", label: "Tuyến của bạn", route }]}
        />
      </Card>

      <Card className="overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b">
          <Navigation className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-sm">Trình tự đề xuất</h3>
          <span className="ml-auto text-xs text-muted-foreground">
            Xuất phát: <span className="font-medium text-foreground">{route.base.name}</span>
          </span>
        </div>
        <ol className="divide-y">
          {route.stops.map((s, idx) => {
            const job = mockJobs.find(j => j.id === s.jobId)!;
            const cus = getCustomer(s.customerId);
            return (
              <li key={s.jobId}>
                <Link
                  to="/tech/jobs/$jobId"
                  params={{ jobId: s.jobId }}
                  className="flex items-start gap-3 p-4 hover:bg-muted/40 transition-colors"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold truncate">{job.title}</span>
                      <StatusBadge variant={priorityVariant[job.priority]}>
                        {job.priority === "urgent" && <Zap className="h-3 w-3 mr-0.5 inline" />}
                        {priorityLabel[job.priority]}
                      </StatusBadge>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground space-y-0.5">
                      <div className="flex items-center gap-1.5"><MapPin className="h-3 w-3" /> {cus?.name} — {cus?.address}</div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span>{formatDateTime(job.scheduledFor)}</span>
                        {cus?.phone && (
                          <a href={`tel:${cus.phone}`} className="flex items-center gap-1 text-primary" onClick={(e) => e.stopPropagation()}>
                            <Phone className="h-3 w-3" /> {cus.phone}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs font-semibold">{s.legKm.toFixed(1)} km</div>
                    <div className="text-[11px] text-muted-foreground">~{s.etaMinutes} phút</div>
                  </div>
                </Link>
              </li>
            );
          })}
          {route.stops.length === 0 && (
            <li className="p-12 text-center text-sm text-muted-foreground">Không có công việc nào để tối ưu</li>
          )}
        </ol>
        {route.stops.length > 0 && (
          <div className="flex items-center justify-between gap-2 p-3 border-t bg-muted/30">
            <div className="text-xs text-muted-foreground">
              <Sparkles className="h-3 w-3 inline mr-1 text-success" />
              Thuật toán nearest-neighbor + ưu tiên urgent
            </div>
            <Button size="sm" className="gap-1.5">
              <Navigation className="h-3.5 w-3.5" /> Bắt đầu chỉ đường
            </Button>
          </div>
        )}
      </Card>
    </AppShell>
  );
}
