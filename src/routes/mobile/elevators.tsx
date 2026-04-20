import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/layout/MobileShell";
import { mockElevators, mockJobs, getProject } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Building2, QrCode, ChevronRight, MapPin, AlertCircle, Calendar } from "lucide-react";
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
    <MobileShell title="Thiết bị & Phụ tùng">
      <div className="sticky top-0 bg-white/90 backdrop-blur-md z-20 px-6 py-4 border-b border-slate-100">
        <div className="flex gap-3">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Mã ID hoặc Tòa nhà..."
              className="pl-11 h-12 bg-slate-50 border-none rounded-2xl shadow-inner focus-visible:ring-2 focus-visible:ring-primary/20 transition-all text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button
            size="icon"
            className="h-12 w-12 rounded-2xl bg-primary text-white shadow-lg shadow-primary/20 shrink-0 active:scale-95 transition-all"
          >
            <QrCode className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {filtered.length > 0 ? (
          filtered.map((elevator) => {
            const project = getProject(elevator.projectId);
            const activeJob = mockJobs.find((j) => j.elevatorId === elevator.id && j.status !== "completed");
            
            return (
              <Card
                key={elevator.id}
                className="group border-none shadow-xl shadow-slate-200/40 bg-white rounded-[2rem] overflow-hidden active:scale-[0.98] transition-all"
              >
                <div className="p-5">
                  <div className="flex gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 relative">
                      <Building2 className="h-7 w-7 text-primary/40" />
                      {activeJob && (
                         <div className="absolute -top-1 -right-1 h-4 w-4 bg-orange-500 rounded-full border-2 border-white animate-pulse" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-black text-slate-900 text-sm leading-tight truncate">
                          {elevator.building}
                        </h3>
                        <StatusBadge variant={elevatorStatusVariant[elevator.status]} className="h-5 text-[9px] px-2">
                          {elevatorStatusLabel[elevator.status]}
                        </StatusBadge>
                      </div>
                      
                      <div className="flex items-center gap-1.5 text-xs font-bold text-primary mb-2">
                         <span className="bg-primary/5 px-1.5 py-0.5 rounded text-[10px] tracking-wider uppercase">{elevator.code}</span>
                         <span className="text-slate-300 font-normal">/</span>
                         <span className="text-slate-500 font-medium truncate">{project?.name}</span>
                      </div>

                      <div className="flex items-start gap-1.5 text-[10px] text-muted-foreground bg-slate-50 p-2 rounded-xl border border-white">
                        <MapPin className="h-3 w-3 mt-0.5 shrink-0 text-slate-400" />
                        <span className="line-clamp-1">{project?.address}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-4 pt-4 border-t border-slate-100/50">
                    <div className="flex flex-col">
                      <span className="text-[9px] uppercase text-slate-400 font-black tracking-widest leading-none">
                        Bảo trì định kỳ
                      </span>
                      <div className="flex items-center gap-1.5 mt-2">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        <span className="text-xs font-bold text-slate-700">
                          {elevator.lastMaintenance.split("-").slice(1).reverse().join("/")}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col pl-4 border-l border-slate-100">
                      <span className="text-[9px] uppercase text-slate-400 font-black tracking-widest leading-none">
                        Trạng thái kỹ thuật
                      </span>
                      <div className="flex items-center gap-1.5 mt-2">
                        <Search className="h-3.5 w-3.5 text-slate-400" />
                        <span className="text-xs font-bold text-slate-700 truncate">
                          {activeJob ? activeJob.title : "Hoạt động tốt"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button 
                  variant="ghost" 
                  className="w-full h-10 bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-primary/5 hover:text-primary transition-colors rounded-none border-t border-slate-50"
                >
                  XEM HỒ SƠ THIẾT BỊ <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              </Card>
            );
          })
        ) : (
          <div className="py-24 text-center bg-slate-50/50 rounded-[3rem] border border-dashed border-slate-200 mx-2">
            <div className="h-20 w-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-10 w-10 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Không tìm thấy thiết bị</h3>
            <p className="text-xs text-slate-400 max-w-[200px] mx-auto leading-relaxed">
              Hãy thử lại với mã định danh hoặc tên tòa nhà khác.
            </p>
          </div>
        )}
      </div>
    </MobileShell>
  );
}
