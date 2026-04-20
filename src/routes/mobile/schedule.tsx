import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/layout/MobileShell";
import { mockJobs, formatDateTime, getCustomer } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { jobStatusVariant, jobStatusLabel } from "@/lib/status-variants";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  ArrowRight,
  Filter,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/mobile/schedule")({
  head: () => ({ meta: [{ title: "Lịch làm việc — Mobile" }] }),
  component: MobileSchedule,
});

function MobileSchedule() {
  const [selectedDay, setSelectedDay] = useState(20); // Simulating April 20th

  const days = [
    { day: "T2", date: 18 },
    { day: "T3", date: 19 },
    { day: "T4", date: 20, active: true },
    { day: "T5", date: 21 },
    { day: "T6", date: 22 },
    { day: "T7", date: 23 },
    { day: "CN", date: 24 },
  ];

  const jobsForDay = mockJobs.slice(0, 3); // Mock filtering

  return (
    <MobileShell title="Lịch của tôi">
      {/* Week View Header */}
      <div className="sticky top-0 bg-slate-50/80 backdrop-blur-md z-20 px-4 py-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold">Tháng 4, 2026</h3>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg bg-white border">
              <Filter className="h-4 w-4 text-slate-500" />
            </Button>
          </div>
        </div>

        <div className="flex justify-between">
          {days.map((d) => (
            <button
              key={d.date}
              onClick={() => setSelectedDay(d.date)}
              className={cn(
                "flex flex-col items-center gap-2 p-2 rounded-xl transition-all w-11",
                selectedDay === d.date
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "bg-white text-slate-400",
              )}
            >
              <span className="text-[9px] font-bold uppercase">{d.day}</span>
              <span className="text-sm font-black">{d.date}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            3 CÔNG VIỆC TRONG NGÀY
          </span>
          <div className="flex items-center gap-1 text-[10px] text-primary font-bold">
            XEM THÁNG <ChevronRight className="h-3 w-3" />
          </div>
        </div>

        <div className="space-y-4">
          {jobsForDay.map((job, idx) => {
            const customer = getCustomer(job.customerId);
            return (
              <Card
                key={job.id}
                className="overflow-hidden border-none shadow-sm relative group active:scale-[0.98] transition-all"
              >
                <div className="flex">
                  {/* Time Column */}
                  <div className="w-16 bg-slate-50 flex flex-col items-center justify-center border-r border-slate-100 p-2">
                    <span className="text-xs font-black">{8 + idx}:30</span>
                    <span className="text-[8px] font-bold text-muted-foreground uppercase mt-1">
                      SÁNG
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-4 bg-white">
                    <div className="flex justify-between items-start mb-2">
                      <StatusBadge variant={jobStatusVariant[job.status]}>
                        {jobStatusLabel[job.status]}
                      </StatusBadge>
                      <span className="text-[9px] font-mono text-muted-foreground">{job.code}</span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 leading-tight mb-2">
                      {job.title}
                    </h4>

                    <div className="space-y-2 mt-4 pt-4 border-t border-slate-50">
                      <div className="flex items-start gap-2 text-[10px] text-slate-500 font-medium leading-relaxed">
                        <MapPin className="h-3 w-3 mt-0.5 shrink-0" />
                        {customer?.name}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium">
                        <Clock className="h-3 w-3" />
                        Dự kiến: 2.5 tiếng
                      </div>
                    </div>

                    <Link to="/mobile/jobs/$jobId" params={{ jobId: job.id }}>
                      <Button className="w-full mt-4 h-9 rounded-lg bg-slate-900 text-white font-bold text-[10px] gap-2">
                        CHI TIẾT PHIẾU <ArrowRight className="h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </div>
                {/* Priority Indicator */}
                <div
                  className={cn(
                    "absolute top-0 right-0 w-1.5 h-full",
                    job.priority === "urgent"
                      ? "bg-red-500"
                      : job.priority === "high"
                        ? "bg-orange-500"
                        : "bg-slate-200",
                  )}
                />
              </Card>
            );
          })}
        </div>

        <div className="py-8 text-center opacity-50">
          <CalendarIcon className="h-8 w-8 mx-auto mb-2 text-slate-300" />
          <p className="text-[10px] uppercase font-bold tracking-widest italic">
            Hết danh sách trong ngày
          </p>
        </div>
      </div>
    </MobileShell>
  );
}
