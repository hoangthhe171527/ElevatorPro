import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/layout/MobileShell";
import { mockJobs, getCustomer } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Navigation,
  Clock,
  MapPin,
  ChevronRight,
  TrendingUp,
  Zap,
  CheckCircle2,
  PlayCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/mobile/route-plan")({
  head: () => ({ meta: [{ title: "Lộ trình kỹ thuật — Mobile" }] }),
  component: TechRoutePlanMobile,
});

function TechRoutePlanMobile() {
  const activeJobId = useAppStore((s) => s.activeJobCheckIn);
  const setJobCheckIn = useAppStore((s) => s.setJobCheckIn);
  const dailyJobs = mockJobs.slice(0, 4);

  const handleStartJob = (jobId: string) => {
    setJobCheckIn(jobId);
    toast.success("BẮT ĐẦU CÔNG VIỆC", {
      description: "Hệ thống đã ghi nhận thời gian bắt đầu tại điểm đến này."
    });
  };

  const handleOpenMap = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    // Generic Google Maps URL or iOS Maps URL
    const url = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    window.open(url, "_blank");
  };

  return (
    <MobileShell title="Lộ trình trong ngày" showBackButton backLink="/mobile/">
      {/* Map Simulation Area - Refined */}
      <div className="relative h-64 bg-slate-100 overflow-hidden shrink-0 border-b">
        {/* Abstract Map UI */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px]" />
        
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300">
          <path
            d="M50 250 Q 150 50 250 200 T 350 100"
            fill="none"
            stroke="#2563eb"
            strokeWidth="3"
            strokeDasharray="6 3"
            className="opacity-40"
          />
          {[
            { x: 50, y: 250, label: "YOU", active: true },
            { x: 180, y: 120, label: "1" },
            { x: 250, y: 200, label: "2" },
            { x: 350, y: 100, label: "3" },
          ].map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r={p.active ? "8" : "6"} fill={p.active ? "#ef4444" : "#2563eb"} className={p.active ? "animate-pulse" : ""} />
              <text
                x={p.x}
                y={p.y - 14}
                textAnchor="middle"
                fontSize="9"
                fontWeight="black"
                fill="#1e293b"
                className="uppercase tracking-tighter"
              >
                {p.label}
              </text>
            </g>
          ))}
        </svg>

        <div className="absolute bottom-5 left-5 right-5 flex gap-3">
              <Button 
                size="icon" 
                onClick={() => handleOpenMap("123 Lộ trình thông minh, TP.HCM")}
                className="h-12 w-12 rounded-2xl bg-primary text-white shadow-xl shadow-primary/20 shrink-0"
              >
                <Navigation className="h-5 w-5" />
              </Button>
            </div>
          </Card>
          <Button 
            size="icon" 
            onClick={() => handleOpenMap("123 Lộ trình thông minh, TP.HCM")}
            className="h-12 w-12 rounded-2xl bg-primary text-white shadow-xl shadow-primary/20 shrink-0"
          >
            <TrendingUp className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
            Thứ tự điểm đến
          </h3>
          <span className="text-[9px] font-black text-emerald-500 uppercase">Đang di chuyển</span>
        </div>

        <div className="space-y-6">
          {dailyJobs.map((job, i) => {
            const customer = getCustomer(job.customerId);
            const isCurrent = activeJobId === job.id;
            
            return (
              <div key={job.id} className="flex gap-5 relative group">
                {/* Timeline Line */}
                {i !== dailyJobs.length - 1 && (
                  <div className="absolute left-[20px] top-10 bottom-[-24px] w-0.5 bg-slate-100" />
                )}

                <div className={cn(
                  "h-10 w-10 rounded-2xl border-2 flex items-center justify-center shrink-0 z-10 transition-all",
                  isCurrent ? "bg-primary border-primary text-white shadow-lg shadow-primary/30" : "bg-white border-slate-100 text-slate-300"
                )}>
                  {isCurrent ? <Zap className="h-5 w-5 fill-current" /> : <span className="font-black text-xs">{i + 1}</span>}
                </div>

                <div className="flex-1 min-w-0">
                  <Link to={`/mobile/jobs/${job.id}`}>
                    <Card className={cn(
                      "p-4 border-none shadow-sm transition-all rounded-[1.5rem] active:scale-95",
                      isCurrent ? "bg-white ring-2 ring-primary/10" : "bg-white"
                    )}>
                      <div className="flex justify-between items-start">
                        <div className="min-w-0">
                          <h4 className="font-black text-[13px] text-slate-900 tracking-tight truncate">{customer?.name}</h4>
                          <div className="flex items-center gap-1.5 mt-1.5 text-slate-400">
                            <Clock className="h-3 w-3" />
                            <span className="text-[9px] font-bold uppercase tracking-tighter">Dự kiến: {8 + i}:30 AM</span>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-200 mt-1" />
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-2 overflow-hidden">
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold leading-none min-w-0 flex-1">
                          <MapPin className="h-3 w-3 shrink-0 text-slate-300" />
                          <span className="truncate">{customer?.address}</span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-full bg-slate-50 shrink-0"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleOpenMap(customer?.address || "");
                          }}
                        >
                           <Navigation className="h-3.5 w-3.5 text-primary" />
                        </Button>
                      </div>
                    </Card>
                  </Link>

                  {/* Contextual Actions in list */}
                  {!activeJobId && i === 0 && (
                    <div className="mt-3 px-1">
                       <Button 
                         onClick={() => handleStartJob(job.id)}
                         className="w-full h-10 rounded-xl bg-orange-500 text-white font-black text-[10px] gap-2 uppercase tracking-widest shadow-lg shadow-orange-500/20"
                       >
                          <PlayCircle className="h-4 w-4" /> Bắt đầu điểm này
                       </Button>
                    </div>
                  )}

                  {isCurrent && (
                    <div className="mt-3 px-1">
                       <div className="flex items-center gap-2 text-[9px] font-black text-primary uppercase animate-pulse">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Bạn đang ở đây
                       </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <Button
          variant="outline"
          className="w-full h-14 rounded-2xl border-dashed border-2 border-slate-200 text-slate-400 font-black text-[10px] gap-2 uppercase tracking-widest mt-6"
        >
          XEM LỊCH SỬ DI CHUYỂN
        </Button>
      </div>
    </MobileShell>
  );
}
