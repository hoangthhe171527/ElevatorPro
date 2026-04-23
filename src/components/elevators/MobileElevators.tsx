import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@tanstack/react-router";
import { StatusBadge } from "@/components/common/StatusBadge";;
import { elevatorStatusLabel, elevatorStatusVariant } from "@/lib/status-variants";
import { mockElevators, formatDate, getProject, getCustomer } from "@/lib/mock-data";
import {
  Plus,
  Search,
  Building2,
  QrCode,
  MapPin,
  ChevronRight,
  Activity,
  Calendar,
} from "lucide-react";
import { CreateElevatorModal } from "@/components/common/Modals";
import { cn } from "@/lib/utils";

export function MobileElevators() {
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);

  const filtered = mockElevators.filter((e) => {
    const project = getProject(e.projectId);
    const cus = project ? getCustomer(project.customerId) : undefined;
    return (
      !search ||
      e.code.toLowerCase().includes(search.toLowerCase()) ||
      cus?.name.toLowerCase().includes(search.toLowerCase()) ||
      e.address.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <AppShell>
      <PageHeader
        title="Danh sách thiết bị"
        description="Quản lý và giám sát tài sản thang máy"
        actions={
          <Button
            size="sm"
            className="h-8 rounded-full px-3 text-[11px] font-black uppercase"
            onClick={() => setCreateOpen(true)}
          >
            <Plus className="h-3.5 w-3.5 mr-1" /> Thêm mới
          </Button>
        }
      />

      <div className="flex items-center gap-2 mb-6 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
        <Search className="h-4 w-4 text-slate-400 ml-2" />
        <Input
          placeholder="Tìm mã thang, địa chỉ..."
          className="border-none shadow-none focus-visible:ring-0 text-sm h-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-4 pb-8">
        {filtered.map((e) => {
          const project = getProject(e.projectId);
          const cus = project ? getCustomer(project.customerId) : undefined;
          const isDue = e.status === "maintenance_due";

          return (
            <Link key={e.id} to="/app/admin/elevators/$elevatorId" params={{ elevatorId: e.id }}>
              <div className="relative bg-white p-5 rounded-[24px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-slate-100/50">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-3">
                    <div
                      className={cn(
                        "h-12 w-12 shrink-0 rounded-2xl flex items-center justify-center shadow-inner",
                        isDue ? "bg-amber-50 text-amber-500" : "bg-primary/10 text-primary",
                      )}
                    >
                      <Building2 className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-black text-[16px] text-slate-800 leading-tight mb-1">
                        {e.code}
                      </h3>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                        {e.brand} {e.model}
                      </p>
                    </div>
                  </div>
                  <StatusBadge
                    variant={elevatorStatusVariant[e.status]}
                    className="shrink-0 text-[9px] px-2 py-0.5"
                  >
                    {elevatorStatusLabel[e.status]}
                  </StatusBadge>
                </div>

                <div className="space-y-2.5 mb-4">
                  <div className="flex items-start gap-2 text-[12px] font-medium text-slate-500">
                    <MapPin className="h-4 w-4 shrink-0 text-slate-300" />
                    <span className="line-clamp-1">
                      {e.building}, {e.address}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                      <Activity className="h-3.5 w-3.5" /> {e.floors} Tầng
                    </div>
                    <div
                      className={cn(
                        "flex items-center gap-1.5 text-[11px] font-bold",
                        isDue ? "text-amber-600" : "text-slate-400",
                      )}
                    >
                      <Calendar className="h-3.5 w-3.5" /> BT: {formatDate(e.nextMaintenance)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <div className="text-[11px] font-black text-slate-800 truncate pr-4">
                    {cus?.name || project?.name || "—"}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-primary">
                    Chi tiết <ChevronRight className="h-3 w-3" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <CreateElevatorModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </AppShell>
  );
}
