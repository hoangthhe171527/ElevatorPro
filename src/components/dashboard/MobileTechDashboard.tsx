import { Link, useLocation } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Badge } from "@/components/ui/badge";
import {
  jobStatusLabel,
  jobStatusVariant,
  priorityLabel,
  priorityVariant,
} from "@/lib/status-variants";
import { Briefcase, CheckCircle2, Clock, AlertTriangle, MapPin, Hammer } from "lucide-react";
import { mockProjects, mockJobs, getCustomer, formatDateTime, Job } from "@/lib/mock-data";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

function useAppPrefix() {
  const { pathname } = useLocation();
  return pathname.startsWith("/app") ? "/app" : "";
}

export function MobileTechDashboard() {
  const userId = useAppStore((s) => s.userId);
  const prefix = useAppPrefix();
  const myJobs = mockJobs.filter((j: Job) => j.assignedTo === userId);
  const today = myJobs.filter((j: Job) => j.status === "scheduled" || j.status === "in_progress");
  const completed = myJobs.filter((j: Job) => j.status === "completed").length;
  const urgent = myJobs.filter((j: Job) => j.priority === "urgent" && j.status !== "completed").length;

  const myProjectIds = Array.from(new Set(myJobs.map((j: Job) => j.projectId).filter(Boolean)));
  const myProjects = mockProjects.filter(p => myProjectIds.includes(p.id));

  return (
    <AppShell>
      <PageHeader 
        title="Hôm nay" 
        description="Công việc của bạn cần xử lý" 
        actions={
          <Link to={`${prefix}/tech/route-plan` as any}>
            <Button className="gap-2">
              <MapPin className="h-4 w-4" /> Bắt đầu lộ trình
            </Button>
          </Link>
        }
      />

      {/* TOP KPI: Horizontal scroll for Mobile */}
      <div className="flex overflow-x-auto hide-scrollbar gap-3 mb-6 pb-2 -mx-4 px-4 snap-x">
        {[
           { label: "Cần làm", value: today.length, icon: Briefcase, color: "bg-blue-500 text-white" },
           { label: "Đã xong", value: completed, icon: CheckCircle2, color: "bg-emerald-500 text-white" },
           { label: "Khẩn cấp", value: urgent, icon: AlertTriangle, color: "bg-rose-500 text-white" }
        ].map((item, idx) => {
           const Icon = item.icon;
           return (
             <div key={idx} className={cn("flex flex-col justify-between p-4 rounded-[24px] min-w-[120px] snap-center shrink-0 shadow-sm", item.color)}>
                <div className="flex items-start justify-between">
                   <Icon className="h-5 w-5 opacity-80" />
                </div>
                <div className="mt-4">
                   <div className="text-[28px] font-black leading-none mb-1">{item.value}</div>
                   <div className="text-[10px] font-black uppercase tracking-widest opacity-90">{item.label}</div>
                </div>
             </div>
           )
        })}
      </div>

      {/* NEW: My Active Projects Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Hammer className="h-5 w-5 text-primary" />
            Dự án đang triển khai
          </h3>
          <Link to={`${prefix}/tech/jobs` as any} search={{ tab: 'install' } as any} className="text-xs text-primary font-bold hover:underline">Xem tất cả</Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {myProjects.map(p => (
            <Link key={p.id} to={`${prefix}/tech/projects/$projectId` as any} params={{ projectId: p.id } as any}>
              <Card className="p-4 hover:shadow-md transition-all group border-l-4 border-l-primary">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold group-hover:text-primary transition-colors">{p.name}</h4>
                  <Badge variant="outline" className="text-[10px] uppercase font-bold">Giai đoạn: {p.stage}</Badge>
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-1.5 mb-3">
                  <MapPin className="h-3 w-3" /> {p.address}
                </div>
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-tight text-primary">
                  <span>Xem 8 giai đoạn lắp đặt</span>
                  <div className="flex gap-1">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className={`h-1.5 w-3 rounded-full ${i === 1 ? 'bg-primary' : i < 1 ? 'bg-success' : 'bg-muted'}`} />
                    ))}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
          {myProjects.length === 0 && (
            <div className="sm:col-span-2 p-6 text-center bg-muted/20 rounded-xl border-2 border-dashed">
              <p className="text-sm text-muted-foreground">Bạn chưa có dự án lắp đặt nào được gán.</p>
            </div>
          )}
        </div>
      </div>

      {/* Native-style Task List */}
      <h3 className="font-bold mb-3 text-sm text-slate-500 uppercase tracking-widest ml-1">
        Công việc tiếp theo
      </h3>
      <div className="space-y-3 mb-8">
        {today.map((j: Job) => {
          const cus = getCustomer(j.customerId);
          return (
            <Link
              key={j.id}
              to={`${prefix}/tech/jobs/$jobId` as any}
              params={{ jobId: j.id } as any}
              className="block transition-all bg-white p-4 rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-slate-100"
            >
              <div className="flex items-start gap-4">
                {/* Visual Priority Indicator mapped to Native Checkbox Style */}
                <div className={cn(
                  "flex shrink-0 items-center justify-center rounded-xl mt-1 h-8 w-8 text-primary shadow-sm",
                  j.priority === 'urgent' ? "bg-rose-100 text-rose-600" : "bg-blue-50"
                )}>
                  <Briefcase className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h4 className="font-semibold truncate text-[15px]">{j.title}</h4>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                     <span className={cn(
                       "text-[9px] font-black uppercase px-2 py-0.5 rounded-full border", 
                       j.priority === 'urgent' ? "text-rose-600 border-rose-200 bg-rose-50" : "text-slate-500 border-slate-200"
                     )}>{priorityLabel[j.priority]}</span>
                     <span className="text-[9px] font-black uppercase text-blue-600 px-2 py-0.5 rounded-full border border-blue-200 bg-blue-50">
                       {jobStatusLabel[j.status]}
                     </span>
                  </div>

                  <div className="text-muted-foreground text-[11px] leading-tight space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3 w-3" /> {formatDateTime(j.scheduledFor)}
                    </div>
                    <div className="flex items-start gap-1.5 line-clamp-2">
                      <MapPin className="h-3 w-3 shrink-0 mt-0.5" /> 
                      <span>{cus?.name} {cus?.address ? `— ${cus?.address}` : ''}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
        {today.length === 0 && (
          <div className="text-center py-10">
            <CheckCircle2 className="mx-auto h-10 w-10 text-success mb-2" />
            <p className="text-sm text-muted-foreground font-medium">
              Bạn đã hoàn thành tất cả công việc!
            </p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
