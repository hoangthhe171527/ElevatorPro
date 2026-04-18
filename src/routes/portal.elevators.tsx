// src/routes/portal.elevators.tsx  ← THAY THẾ
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataPagination } from "@/components/common/DataPagination";
import { StatusBadge, elevatorStatusLabel, elevatorStatusVariant } from "@/components/common/StatusBadge";
import { mockElevators, formatDate } from "@/lib/mock-data";
import { Building2, QrCode, MapPin, Search, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/portal/elevators")({
  head: () => ({ meta: [{ title: "Thang máy của tôi" }] }),
  component: PortalElevators,
});

const CUSTOMER_ID = "c-1";
const PAGE_SIZE = 6;

function PortalElevators() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const filtered = mockElevators
    .filter((e) => e.customerId === CUSTOMER_ID)
    .filter(
      (e) =>
        !search ||
        e.code.toLowerCase().includes(search.toLowerCase()) ||
        e.building.toLowerCase().includes(search.toLowerCase()),
    );
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const dueCount = filtered.filter((e) => e.status === "maintenance_due" || e.status === "out_of_order").length;

  return (
    <AppShell>
      <PageHeader
        title="Thang máy của bạn"
        description={`${filtered.length} thang đang được quản lý`}
      />

      {dueCount > 0 && (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-warning/10 text-warning-foreground mb-4">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <p className="text-sm font-medium">
            {dueCount} thang cần chú ý — đến hạn bảo trì hoặc đang hỏng
          </p>
        </div>
      )}

      <Card className="overflow-hidden">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm thang máy..."
              className="pl-9"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
        </div>

        <div className="grid gap-3 p-4 sm:grid-cols-2">
          {paged.map((e) => (
            <Card key={e.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <div>
                    <Link to="/portal/elevators/$elevatorId" params={{ elevatorId: e.id }}>
                      <div className="font-mono text-sm font-semibold text-primary hover:underline underline-offset-4">{e.code}</div>
                    </Link>
                    <div className="text-xs text-muted-foreground">{e.brand} {e.model}</div>
                  </div>
                </div>
                <StatusBadge variant={elevatorStatusVariant[e.status]}>
                  {elevatorStatusLabel[e.status]}
                </StatusBadge>
              </div>

              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="flex items-start gap-1">
                  <MapPin className="h-3 w-3 mt-0.5 shrink-0" /> {e.building}
                </div>
                <div>{e.floors} tầng · BT gần nhất {formatDate(e.lastMaintenance)}</div>
                <div>
                  BT tiếp:{" "}
                  <span className={`font-medium ${e.status === "maintenance_due" ? "text-warning-foreground" : "text-foreground"}`}>
                    {formatDate(e.nextMaintenance)}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t flex gap-2">
                <Link to="/portal/elevators/$elevatorId" params={{ elevatorId: e.id }} className="flex-1">
                  <Button variant="default" size="sm" className="w-full gap-1.5">
                    Chi tiết
                  </Button>
                </Link>
                <Link to="/qr/$elevatorId" params={{ elevatorId: e.id }} title="Xem QR" className="flex-none">
                  <Button variant="outline" size="sm" className="w-9 px-0">
                    <QrCode className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </Link>
                <Link to="/portal/issues" className="flex-1">
                  <Button
                    size="sm"
                    variant={e.status === "out_of_order" ? "destructive" : "outline"}
                    className="w-full gap-1.5"
                  >
                    <AlertTriangle className="h-4 w-4" /> Báo sự cố
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
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