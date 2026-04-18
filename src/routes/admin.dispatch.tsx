import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/common/StatCard";
import { RouteMap } from "@/components/common/RouteMap";
import { StatusBadge, priorityLabel, priorityVariant } from "@/components/common/StatusBadge";
import { mockJobs, mockUsers, optimizeRoute, getCustomer, formatDateTime } from "@/lib/mock-data";
import { Users, Route as RouteIcon, Sparkles, Clock, MapPin } from "lucide-react";

export const Route = createFileRoute("/admin/dispatch")({
  head: () => ({ meta: [{ title: "Bản đồ & Điều phối" }] }),
  component: AdminDispatch,
});

const COLORS = ["var(--route-1)", "var(--route-2)"];

function AdminDispatch() {
  const technicians = mockUsers.filter(u => u.role === "technician");

  const data = useMemo(() => technicians.map((tech, i) => {
    const jobs = mockJobs.filter(
      j => j.assignedTo === tech.id && (j.status === "scheduled" || j.status === "in_progress"),
    );
    return {
      tech,
      color: COLORS[i % COLORS.length],
      route: optimizeRoute(tech.id, jobs),
      jobs,
    };
  }), [technicians]);

  const totalStops = data.reduce((s, d) => s + d.route.stops.length, 0);
  const totalKm = data.reduce((s, d) => s + d.route.totalKm, 0);
  const totalSaved = data.reduce((s, d) => s + d.route.savedKm, 0);

  return (
    <AppShell>
      <PageHeader
        title="Bản đồ & Điều phối"
        description="Theo dõi vị trí và tối ưu lộ trình của tất cả kỹ thuật viên"
      />

      <div className="grid gap-3 sm:grid-cols-4 mb-4">
        <StatCard label="Kỹ thuật viên đang hoạt động" value={data.length} icon={Users} accent="info" />
        <StatCard label="Tổng số điểm đến" value={totalStops} icon={MapPin} accent="primary" />
        <StatCard label="Tổng quãng đường tối ưu" value={`${totalKm.toFixed(1)} km`} icon={RouteIcon} accent="warning" />
        <StatCard label="Tiết kiệm" value={`${totalSaved.toFixed(1)} km`} icon={Sparkles} accent="success" />
      </div>

      <Card className="overflow-hidden mb-4">
        <RouteMap
          height={460}
          routes={data.map(d => ({
            id: d.tech.id,
            color: d.color,
            label: d.tech.name,
            route: d.route,
          }))}
        />
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {data.map(d => (
          <Card key={d.tech.id} className="overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b">
              <span className="inline-block h-3 w-3 rounded-sm" style={{ background: d.color }} />
              <div className="font-semibold text-sm">{d.tech.name}</div>
              <span className="ml-auto text-xs text-muted-foreground">
                {d.route.stops.length} điểm · {d.route.totalKm.toFixed(1)} km · {d.route.totalMinutes} phút
              </span>
            </div>
            <ol className="divide-y max-h-80 overflow-y-auto">
              {d.route.stops.map((s, idx) => {
                const job = mockJobs.find(j => j.id === s.jobId)!;
                const cus = getCustomer(s.customerId);
                return (
                  <li key={s.jobId} className="flex items-start gap-3 p-3">
                    <div
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white text-xs font-bold"
                      style={{ background: d.color }}
                    >
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium truncate">{job.title}</span>
                        <StatusBadge variant={priorityVariant[job.priority]}>{priorityLabel[job.priority]}</StatusBadge>
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {cus?.name} · {formatDateTime(job.scheduledFor)}
                      </div>
                    </div>
                    <div className="text-right text-[11px] shrink-0">
                      <div className="font-semibold">{s.legKm.toFixed(1)}km</div>
                      <div className="text-muted-foreground flex items-center gap-0.5"><Clock className="h-3 w-3" />{s.etaMinutes}p</div>
                    </div>
                  </li>
                );
              })}
              {d.route.stops.length === 0 && (
                <li className="p-6 text-center text-xs text-muted-foreground">Chưa có công việc</li>
              )}
            </ol>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
