import { createFileRoute, Link, useLocation } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
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
import { Badge } from "@/components/ui/badge";
import { Calendar, Briefcase, MapPin, Clock, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/tech/schedule")({
  head: () => ({ meta: [{ title: "Lịch — Kỹ thuật" }] }),
  component: TechSchedule,
});

function useAppPrefix() {
  const { pathname } = useLocation();
  return pathname.startsWith("/app") ? "/app" : "";
}

export function TechSchedule() {
  const userId = useAppStore((s) => s.userId);
  const prefix = useAppPrefix();
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

  const getDayName = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date().toISOString().split("T")[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

    if (dateStr === today) return "Hôm nay";
    if (dateStr === tomorrow) return "Ngày mai";

    return date.toLocaleDateString("vi-VN", { weekday: "long" });
  };

  return (
    <AppShell className="bg-slate-50/50">
      <PageHeader
        title="Lịch công việc"
        description="Danh sách công việc của bạn theo ngày và tuần"
      />

      <div className="space-y-6 pb-20">
        {Object.entries(grouped).map(([day, jobs]) => (
          <div key={day} className="space-y-3 px-1">
            <div className="flex items-center justify-between px-2">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                  {formatDate(day)}
                </span>
                <span className="text-lg font-black text-slate-800 capitalize">
                  {getDayName(day)}
                </span>
              </div>
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none px-2 py-0.5 text-[10px] font-black">
                {jobs.length} VIỆC
              </Badge>
            </div>

            <div className="grid gap-3">
              {jobs.map((j) => {
                const cus = getCustomer(j.customerId);
                return (
                  <Link
                    key={j.id}
                    to={
                      (j.type === "inspection"
                        ? `${prefix}/tech/survey/$jobId`
                        : `${prefix}/tech/jobs/$jobId`) as any
                    }
                    params={{ jobId: j.id } as any}
                    className="group"
                  >
                    <Card className="overflow-hidden border-none shadow-sm hover:shadow-md transition-all active:scale-[0.98]">
                      <div className="flex">
                        {/* Type Indicator Bar */}
                        <div
                          className={`w-1.5 ${
                            j.type === "maintenance"
                              ? "bg-blue-500"
                              : j.type === "install"
                                ? "bg-orange-500"
                                : "bg-destructive"
                          }`}
                        />

                        <div className="flex-1 p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-black text-xs uppercase text-slate-800 truncate">
                                  {j.title}
                                </span>
                                {j.priority === "urgent" && (
                                  <div className="h-1.5 w-1.5 rounded-full bg-destructive animate-ping" />
                                )}
                              </div>
                              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold uppercase">
                                <Clock className="h-3 w-3" />{" "}
                                {formatDateTime(j.scheduledFor).split(" ")[1]}
                                <span className="mx-1 opacity-30">|</span>
                                <MapPin className="h-3 w-3" /> {cus?.name}
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <StatusBadge
                                variant={jobStatusVariant[j.status]}
                                className="text-[8px] px-1.5 py-0 uppercase font-black"
                              >
                                {jobStatusLabel[j.status]}
                              </StatusBadge>
                            </div>
                          </div>

                          <div className="mt-3 pt-3 border-t border-slate-50 flex items-center justify-between">
                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">
                              Mã: {j.code}
                            </div>
                            <div className="flex items-center gap-1 text-[9px] font-black text-primary uppercase">
                              Bắt đầu ngay <ChevronRight className="h-3 w-3" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
        {Object.keys(grouped).length === 0 && (
          <Card className="p-12 text-center border-dashed bg-transparent">
            <Calendar className="h-10 w-10 mx-auto text-slate-200 mb-3" />
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
              Không có lịch làm việc
            </p>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
