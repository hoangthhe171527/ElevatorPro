import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/layout/MobileShell";
import { mockJobs, getCustomer } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Navigation,
  Map as MapIcon,
  Clock,
  MapPin,
  ChevronRight,
  TrendingUp,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/mobile/route-plan")({
  head: () => ({ meta: [{ title: "Lộ trình kỹ thuật — Mobile" }] }),
  component: TechRoutePlanMobile,
});

function TechRoutePlanMobile() {
  const dailyJobs = mockJobs.slice(0, 4);

  return (
    <MobileShell title="Lộ trình trong ngày" showBackButton>
      {/* Map Simulation Area */}
      <div className="relative h-60 bg-slate-200 overflow-hidden shrink-0 border-b">
        {/* Simple Path Simulation with SVG */}
        <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 400 300">
          <path
            d="M50 250 Q 150 50 250 200 T 350 100"
            fill="none"
            stroke="#2563eb"
            strokeWidth="4"
            strokeDasharray="8 4"
          />
          {[
            { x: 50, y: 250, label: "START" },
            { x: 180, y: 120, label: "1" },
            { x: 250, y: 200, label: "2" },
            { x: 350, y: 100, label: "3" },
          ].map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="6" fill={i === 0 ? "#1e293b" : "#2563eb"} />
              <text
                x={p.x}
                y={p.y - 12}
                textAnchor="middle"
                fontSize="10"
                fontWeight="bold"
                fill="#1e293b"
              >
                {p.label}
              </text>
            </g>
          ))}
        </svg>

        <div className="absolute bottom-4 left-4 right-4 flex gap-2">
          <Card className="flex-1 p-3 border-none shadow-lg bg-white/95 backdrop-blur-sm">
            <span className="text-[8px] font-bold text-muted-foreground uppercase">Hành trình</span>
            <div className="flex items-center gap-2 mt-0.5">
              <Navigation className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold font-mono">12.5 KM • 45 PHÚT</span>
            </div>
          </Card>
          <Button size="icon" className="h-12 w-12 rounded-xl bg-primary text-white shadow-lg">
            <Zap className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <h3 className="text-xs font-bold uppercase text-muted-foreground px-1">
          Danh sách điểm đến
        </h3>
        {dailyJobs.map((job, i) => {
          const customer = getCustomer(job.customerId);
          return (
            <div key={job.id} className="flex gap-4 relative">
              {/* Timeline Line */}
              {i !== dailyJobs.length - 1 && (
                <div className="absolute left-6 top-10 bottom-0 w-px bg-slate-200 border-dashed border-l" />
              )}

              <div className="h-12 w-12 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center shrink-0 z-10">
                <span className="font-bold text-primary text-sm">{i + 1}</span>
              </div>

              <Card className="flex-1 p-4 border-none shadow-sm bg-white active:scale-[0.98] transition-all">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-xs line-clamp-1">{customer?.name}</h4>
                    <div className="flex items-center gap-1 mt-1 text-[10px] text-muted-foreground italic">
                      <Clock className="h-3 w-3" />
                      Dự kiến: {8 + i}:30
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg bg-slate-50">
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </div>

                <div className="mt-3 flex items-start gap-1.5 text-[10px] text-slate-500 leading-tight">
                  <MapPin className="h-3 w-3 shrink-0" />
                  <span className="line-clamp-1">{customer?.address}</span>
                </div>
              </Card>
            </div>
          );
        })}

        <Button
          variant="outline"
          className="w-full h-12 rounded-xl border-dashed border-slate-300 text-slate-500 font-bold text-xs gap-2"
        >
          XEM LỘ TRÌNH ĐÃ ĐI
        </Button>
      </div>
    </MobileShell>
  );
}
