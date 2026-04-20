import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/layout/MobileShell";
import { mockElevators, mockJobs, getProject } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Building2, QrCode, ChevronRight, MapPin, AlertCircle } from "lucide-react";
import { useState } from "react";
import { StatusBadge } from "@/components/common/StatusBadge";
import { elevatorStatusLabel, elevatorStatusVariant } from "@/lib/status-variants";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/mobile/elevators")({
  head: () => ({ meta: [{ title: "Thang máy — Mobile" }] }),
  component: MobileElevators,
});

function MobileElevators() {
  const [search, setSearch] = useState("");

  const filtered = mockElevators.filter(
    (e) =>
      e.building.toLowerCase().includes(search.toLowerCase()) ||
      e.code.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <MobileShell title="Danh sách thiết bị">
      <div className="sticky top-0 bg-slate-50/80 backdrop-blur-sm z-20 px-4 py-3 border-b">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm mã hoặc tòa nhà..."
              className="pl-9 bg-background border-none shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button
            size="icon"
            className="h-[42px] w-[42px] rounded-xl bg-primary text-white shadow-lg shadow-primary/20 shrink-0"
          >
            <QrCode className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {filtered.map((elevator) => {
          const project = getProject(elevator.projectId);
          return (
            <Card
              key={elevator.id}
              className="p-4 shadow-sm border-none bg-background active:scale-[0.98] transition-transform"
            >
              <div className="flex gap-4">
                <div className="h-14 w-14 rounded-2xl bg-blue-100 flex items-center justify-center shrink-0 border border-blue-200">
                  <Building2 className="h-7 w-7 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-sm leading-tight line-clamp-1">
                      {elevator.building}
                    </h3>
                    <StatusBadge variant={elevatorStatusVariant[elevator.status]}>
                      {elevatorStatusLabel[elevator.status]}
                    </StatusBadge>
                  </div>

                  <div className="mt-2 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span className="font-mono bg-muted px-1 rounded text-[10px]">
                        {elevator.id}
                      </span>
                      <span className="mx-1">|</span>
                      <span className="truncate">{project?.name}</span>
                    </div>
                    <div className="flex items-start gap-1.5 text-[10px] text-muted-foreground">
                      <MapPin className="h-3 w-3 mt-0.5 shrink-0" />
                      <span className="line-clamp-1">{project?.address}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <span className="text-[8px] uppercase text-muted-foreground font-bold leading-none">
                          Lần cuối
                        </span>
                        <span className="text-[10px] font-bold mt-1">
                          {elevator.lastMaintenance.split("-").slice(1).reverse().join("/")}
                        </span>
                      </div>
                      <div className="h-4 w-px bg-slate-200" />
                      <div className="flex flex-col">
                        <span className="text-[8px] uppercase text-muted-foreground font-bold leading-none">
                          Công việc
                        </span>
                        <span className="text-[10px] font-bold mt-1">
                          {mockJobs.find((j) => j.elevatorId === elevator.id)?.title || "N/A"}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full bg-slate-50 text-muted-foreground transition-colors hover:text-primary"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}

        {filtered.length === 0 && (
          <div className="py-20 text-center">
            <AlertCircle className="h-12 w-12 text-slate-200 mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">Không tìm thấy thiết bị nào</p>
          </div>
        )}
      </div>
    </MobileShell>
  );
}
