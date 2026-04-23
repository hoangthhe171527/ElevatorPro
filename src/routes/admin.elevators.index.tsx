// src/routes/admin.elevators.tsx  ← THAY THẾ FILE CŨ
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataPagination } from "@/components/common/DataPagination";
import { StatusBadge } from "@/components/common/StatusBadge";;
import { elevatorStatusLabel, elevatorStatusVariant } from "@/lib/status-variants";
import { mockElevators, formatDate, getCustomer, getProject } from "@/lib/mock-data";
import { Plus, Search, Building2, QrCode, MapPin } from "lucide-react";
import { CreateElevatorModal } from "@/components/common/Modals";

export const Route = createFileRoute("/admin/elevators/")({
  head: () => ({ meta: [{ title: "Thang máy — ElevatorPro" }] }),
  component: ElevatorsPage,
});

const PAGE_SIZE = 8;

function ElevatorsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [createOpen, setCreateOpen] = useState(false);

  const filtered = mockElevators.filter((e) => {
    const project = getProject(e.projectId);
    const cus = project ? getCustomer(project.customerId) : undefined;
    const m1 =
      !search ||
      e.code.toLowerCase().includes(search.toLowerCase()) ||
      cus?.name.toLowerCase().includes(search.toLowerCase());
    const m2 = statusFilter === "all" || e.status === statusFilter;
    return m1 && m2;
  });
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <AppShell>
      <PageHeader
        title="Thang máy"
        description={`${mockElevators.length} thang đang quản lý — mỗi thang có QR riêng`}
        actions={
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4 mr-1.5" /> Thêm thang
          </Button>
        }
      />

      <Card className="overflow-hidden">
        <div className="flex flex-col sm:flex-row gap-3 p-4 border-b">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm mã thang, khách hàng..."
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
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              {Object.entries(elevatorStatusLabel).map(([k, v]) => (
                <SelectItem key={k} value={k}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
          {paged.map((e) => {
            const project = getProject(e.projectId);
            const cus = project ? getCustomer(project.customerId) : undefined;
            return (
              <Card key={e.id} className="p-4 hover:shadow-elevated transition-shadow">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-mono text-sm font-semibold">{e.code}</div>
                      <div className="text-xs text-muted-foreground">
                        {e.brand} {e.model}
                      </div>
                    </div>
                  </div>
                  <StatusBadge variant={elevatorStatusVariant[e.status]}>
                    {elevatorStatusLabel[e.status]}
                  </StatusBadge>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="text-muted-foreground">
                    Khách:{" "}
                    <span className="text-foreground font-medium">
                      {cus?.name ?? project?.name ?? "—"}
                    </span>
                  </div>
                  <div className="text-muted-foreground flex items-start gap-1">
                    <MapPin className="h-3 w-3 mt-0.5 shrink-0" /> {e.building}, {e.address}
                  </div>
                  <div className="text-muted-foreground">
                    {e.floors} tầng · BT gần nhất {formatDate(e.lastMaintenance)}
                  </div>
                  <div className="text-muted-foreground">
                    BT tiếp theo:{" "}
                    <span className="text-foreground font-medium">
                      {formatDate(e.nextMaintenance)}
                    </span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t flex gap-2">
                  <Link
                    to="/admin/elevators/$elevatorId/qr"
                    params={{ elevatorId: e.id }}
                    className="flex-1"
                  >
                    <Button variant="outline" size="sm" className="w-full">
                      <QrCode className="h-3.5 w-3.5 mr-1" /> Xem QR
                    </Button>
                  </Link>
                  <Link
                    to="/admin/elevators/$elevatorId"
                    params={{ elevatorId: e.id }}
                    className="flex-1"
                  >
                    <Button size="sm" className="w-full">
                      Chi tiết
                    </Button>
                  </Link>
                </div>
              </Card>
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

      <CreateElevatorModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </AppShell>
  );
}
