// src/routes/admin.dispatch.tsx  ← THAY THẾ
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/common/StatCard";
import { RouteMap } from "@/components/common/RouteMap";
import { StatusBadge, priorityLabel, priorityVariant } from "@/components/common/StatusBadge";
import { mockJobs, mockUsers, optimizeRoute, getCustomer, formatDateTime } from "@/lib/mock-data";
import { Users, Route as RouteIcon, Sparkles, Clock, MapPin, Navigation, Phone, Briefcase } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/dispatch")({
  head: () => ({ meta: [{ title: "Bản đồ & Điều phối" }] }),
  component: AdminDispatch,
});

const COLORS = ["var(--route-1)", "var(--route-2)"];

function AdminDispatch() {
  const technicians = mockUsers.filter((u) => u.role === "technician");
  const [selectedTechId, setSelectedTechId] = useState<string | null>(null);

  const data = useMemo(
    () =>
      technicians.map((tech, i) => {
        const jobs = mockJobs.filter(
          (j) => j.assignedTo === tech.id && (j.status === "scheduled" || j.status === "in_progress"),
        );
        return { tech, color: COLORS[i % COLORS.length], route: optimizeRoute(tech.id, jobs), jobs };
      }),
    [technicians],
  );

  const totalStops = data.reduce((s, d) => s + d.route.stops.length, 0);
  const totalKm = data.reduce((s, d) => s + d.route.totalKm, 0);
  const totalSaved = data.reduce((s, d) => s + d.route.savedKm, 0);

  const openNavigationToStop = (lat: number, lng: number, label: string) => {
    const destination = `${lat},${lng}`;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}&travelmode=driving`;
    window.open(url, "_blank", "noopener,noreferrer");
    toast.success(`Mở chỉ đường tới ${label}`);
  };

  const displayData = selectedTechId
    ? data.filter((d) => d.tech.id === selectedTechId)
    : data;

  return (
    <AppShell>
      <PageHeader
        title="Bản đồ & Điều phối"
        description="Theo dõi và tối ưu lộ trình của tất cả kỹ thuật viên"
        actions={
          <div className="flex gap-2">
            <Button
              variant={selectedTechId === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTechId(null)}
            >
              Tất cả
            </Button>
            {data.map((d) => (
              <Button
                key={d.tech.id}
                variant={selectedTechId === d.tech.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTechId(d.tech.id === selectedTechId ? null : d.tech.id)}
                style={selectedTechId === d.tech.id ? { background: d.color } : {}}
              >
                {d.tech.name.split(" ").pop()}
              </Button>
            ))}
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-4 mb-4">
        <StatCard label="KTV đang hoạt động" value={data.length} icon={Users} accent="info" />
        <StatCard label="Tổng điểm đến" value={totalStops} icon={MapPin} accent="primary" />
        <StatCard label="Tổng quãng đường" value={`${totalKm.toFixed(1)} km`} icon={RouteIcon} accent="warning" />
        <StatCard label="Tiết kiệm" value={`${totalSaved.toFixed(1)} km`} icon={Sparkles} accent="success" />
      </div>

      <Card className="overflow-hidden mb-4">
        <RouteMap
          height={460}
          routes={displayData.map((d) => ({
            id: d.tech.id,
            color: d.color,
            label: d.tech.name,
            route: d.route,
          }))}
        />
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {data.map((d) => (
          <Card key={d.tech.id} className="overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b">
              <span className="inline-block h-3 w-3 rounded-sm shrink-0" style={{ background: d.color }} />
              <div className="font-semibold text-sm">{d.tech.name}</div>
              <a
                href={`tel:${d.tech.phone}`}
                className="text-xs text-primary flex items-center gap-1 hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                <Phone className="h-3 w-3" /> {d.tech.phone}
              </a>
              <span className="ml-auto text-xs text-muted-foreground">
                {d.route.stops.length} điểm · {d.route.totalKm.toFixed(1)} km · {d.route.totalMinutes} phút
              </span>
            </div>
            <ol className="divide-y max-h-80 overflow-y-auto">
              {d.route.stops.map((s, idx) => {
                const job = mockJobs.find((j) => j.id === s.jobId)!;
                const cus = getCustomer(s.customerId);
                return (
                  <li key={s.jobId} className="flex items-start gap-3 p-3 hover:bg-muted/30">
                    <div
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white text-xs font-bold"
                      style={{ background: d.color }}
                    >
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link to="/admin/jobs/$jobId" params={{ jobId: s.jobId }} className="hover:underline">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium truncate">{job.title}</span>
                          <StatusBadge variant={priorityVariant[job.priority]}>{priorityLabel[job.priority]}</StatusBadge>
                        </div>
                      </Link>
                      <div className="text-[11px] text-muted-foreground mt-0.5">
                        {cus?.name} · {formatDateTime(job.scheduledFor)}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <div className="text-right text-[11px]">
                        <div className="font-semibold">{s.legKm.toFixed(1)}km</div>
                        <div className="text-muted-foreground flex items-center gap-0.5">
                          <Clock className="h-3 w-3" />{s.etaMinutes}p
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 px-2 text-[10px] gap-1"
                        onClick={() => openNavigationToStop(s.lat, s.lng, s.label)}
                      >
                        <Navigation className="h-3 w-3" /> Chỉ đường
                      </Button>
                    </div>
                  </li>
                );
              })}
              {d.route.stops.length === 0 && (
                <li className="p-6 text-center text-xs text-muted-foreground">Chưa có công việc</li>
              )}
            </ol>
            {d.route.stops.length > 0 && (
              <div className="p-3 border-t flex gap-2">
                <Link to="/tech/jobs" className="flex-1">
                  <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs">
                    <Briefcase className="h-3.5 w-3.5" /> Xem công việc KTV
                  </Button>
                </Link>
                <Button
                  size="sm"
                  className="flex-1 gap-1.5 text-xs"
                  onClick={() => {
                    const first = d.route.stops[0];
                    openNavigationToStop(first.lat, first.lng, first.label);
                  }}
                >
                  <Navigation className="h-3.5 w-3.5" /> Chỉ đường điểm đầu
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </AppShell>
  );
}