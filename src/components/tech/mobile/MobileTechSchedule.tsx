import { Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/common/StatusBadge";;
import {
  jobStatusLabel,
  jobStatusVariant,
  priorityLabel,
  priorityVariant,
} from "@/lib/status-variants";
import { mockJobs, formatDate, formatDateTime, getCustomer } from "@/lib/mock-data";
import { useAppStore } from "@/lib/store";
import { Calendar, Briefcase, MapPin, ArrowLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileTechSchedule() {
  const userId = useAppStore((s) => s.userId);
  const myJobs = mockJobs
    .filter((j) => j.assignedTo === userId && j.status !== "completed" && j.status !== "cancelled")
    .sort((a, b) => a.scheduledFor.localeCompare(b.scheduledFor));

  const grouped = myJobs.reduce(
    (acc, j) => {
      const day = j.scheduledFor.split("T")[0];
      (acc[day] = acc[day] || []).push(j);
      return acc;
    },
    {} as Record<string, typeof myJobs>,
  );

  return (
    <AppShell
      secondaryNav={
        <div className="flex items-center justify-between px-4 py-2 bg-slate-900 text-white">
          <Link
            to="/app/tech"
            className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">
              Lịch làm việc
            </span>
            <span className="text-xs font-black">Của tôi</span>
          </div>
          <div className="w-8 h-8" />
        </div>
      }
    >
      <div className="p-4 space-y-6 pb-12">
        {Object.entries(grouped).map(([day, jobs], idx) => (
          <div key={day} className="space-y-3">
            <div className="flex items-center gap-2 px-2">
              <div
                className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                  idx === 0 ? "bg-primary text-white" : "bg-slate-100 text-slate-400",
                )}
              >
                {idx === 0 ? "Hôm nay" : formatDate(day)}
              </div>
              <div className="h-px bg-slate-100 flex-1 ml-2" />
            </div>

            <div className="space-y-3">
              {jobs.map((j) => {
                const cus = getCustomer(j.customerId);
                return (
                  <Link
                    key={j.id}
                    to={
                      (j.type === "inspection"
                        ? "/app/tech/survey/$jobId"
                        : "/app/tech/jobs/$jobId") as any
                    }
                    params={{ jobId: j.id } as any}
                    className="block"
                  >
                    <Card className="p-4 rounded-[24px] border-none shadow-lg shadow-slate-900/5 bg-white relative overflow-hidden group hover:scale-[1.01] transition-all">
                      <div className="flex items-start gap-4">
                        <div
                          className={cn(
                            "h-11 w-11 rounded-2xl flex items-center justify-center shadow-inner shrink-0",
                            j.priority === "urgent"
                              ? "bg-rose-50 text-rose-500"
                              : "bg-slate-50 text-slate-400",
                          )}
                        >
                          <Briefcase className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                              Ghé thăm: {formatDateTime(j.scheduledFor).split(",")[1]}
                            </span>
                            <StatusBadge
                              variant={priorityVariant[j.priority]}
                              className="text-[8px] h-4 px-1.5"
                            >
                              {priorityLabel[j.priority]}
                            </StatusBadge>
                          </div>
                          <h4 className="font-black text-sm text-slate-800 truncate mb-1">
                            {j.title}
                          </h4>
                          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                            <MapPin className="h-3 w-3" /> {cus?.name}
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-200 mt-1" />
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        {Object.keys(grouped).length === 0 && (
          <div className="p-20 text-center space-y-4">
            <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto opacity-50">
              <Calendar className="h-10 w-10 text-slate-300" />
            </div>
            <div>
              <h3 className="font-black text-slate-800">Trống lịch</h3>
              <p className="text-xs text-slate-400">Bạn không có công việc nào sắp tới.</p>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
