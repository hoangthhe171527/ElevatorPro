import { Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/common/StatCard";
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

export function WebTechDashboard() {
  const userId = useAppStore((s) => s.userId);
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
          <Link to="/tech/route-plan">
            <Button className="gap-2">
              <MapPin className="h-4 w-4" /> Bắt đầu lộ trình
            </Button>
          </Link>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3 mb-6">
        <StatCard label="Cần làm hôm nay" value={today.length} icon={Briefcase} accent="info" />
        <StatCard label="Đã hoàn thành" value={completed} icon={CheckCircle2} accent="success" />
        <StatCard label="Khẩn cấp" value={urgent} icon={AlertTriangle} accent="destructive" />
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Hammer className="h-5 w-5 text-primary" />
            Dự án đang triển khai
          </h3>
          <Link to="/tech/jobs" search={{ tab: 'install' }} className="text-xs text-primary font-bold hover:underline">Xem tất cả</Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {myProjects.map(p => (
            <Link key={p.id} to="/tech/projects/$projectId" params={{ projectId: p.id }}>
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

      <h3 className="font-bold mb-3 text-lg">
        Công việc tiếp theo
      </h3>
      <div className="space-y-3 mb-8">
        {today.map((j: Job) => {
          const cus = getCustomer(j.customerId);
          return (
            <Link
              key={j.id}
              to="/tech/jobs/$jobId"
              params={{ jobId: j.id }}
              className="block transition-all bg-white p-4 rounded-lg border hover:bg-slate-50"
            >
              <div className="flex items-start gap-4">
                <div className="flex shrink-0 items-center justify-center rounded-xl h-11 w-11 bg-primary/10 text-primary">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h4 className="font-semibold truncate">{j.title}</h4>
                    <StatusBadge variant={priorityVariant[j.priority]}>
                      {priorityLabel[j.priority]}
                    </StatusBadge>
                    <StatusBadge variant={jobStatusVariant[j.status]}>
                      {jobStatusLabel[j.status]}
                    </StatusBadge>
                  </div>

                  <div className="text-muted-foreground text-xs mt-1.5 space-y-0.5">
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
          <div className="text-center p-12 bg-white rounded-xl border">
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
