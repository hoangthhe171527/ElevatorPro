import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/layout/MobileShell";
import { cn } from "@/lib/utils";
import { 
  mockJobs, 
  mockContracts, 
  mockElevators, 
  formatVND, 
  formatDateTime,
  getCustomer
} from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge, jobStatusLabel, jobStatusVariant, priorityLabel, priorityVariant } from "@/components/common/StatusBadge";
import { 
  Briefcase, 
  AlertTriangle, 
  ChevronRight, 
  TrendingUp,
  Clock,
  MapPin
} from "lucide-react";

export const Route = createFileRoute("/mobile/")({
  head: () => ({ meta: [{ title: "Mobile Dashboard — ElevatorPro" }] }),
  component: MobileDashboard,
});

function MobileDashboard() {
  const activeJobs = mockJobs.filter(j => j.status === "in_progress" || j.status === "scheduled");
  const urgentJobs = mockJobs.filter(j => j.priority === "urgent").slice(0, 2);
  const totalRevenue = mockContracts.reduce((s, c) => s + c.paid, 0);

  return (
    <MobileShell title="Tổng quan">
      <div className="p-4 space-y-6">
        
        {/* Quick Stats - Horizontal Scroll */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
           <StatCardMobile 
                title="Doanh thu" 
                value={formatVND(totalRevenue)} 
                icon={TrendingUp} 
                color="bg-emerald-500" 
            />
           <StatCardMobile 
                title="Đang chạy" 
                value={activeJobs.length} 
                icon={Briefcase} 
                color="bg-blue-500" 
            />
           <StatCardMobile 
                title="Sự cố" 
                value="2" 
                icon={AlertTriangle} 
                color="bg-amber-500" 
            />
        </div>

        {/* Urgent Alerts */}
        {urgentJobs.length > 0 && (
          <section className="space-y-3">
             <h3 className="text-sm font-bold flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-4 w-4" /> Cảnh báo khẩn cấp
             </h3>
             <div className="space-y-3">
                {urgentJobs.map(job => (
                   <Link key={job.id} to={"/mobile/jobs" as any}>
                       <Card className="p-4 border-l-4 border-l-destructive shadow-sm">
                           <div className="flex justify-between items-start">
                               <span className="text-xs font-bold text-destructive uppercase tracking-wider">Urgent Action</span>
                               <span className="text-[10px] text-muted-foreground">{formatDateTime(job.createdAt)}</span>
                           </div>
                           <h4 className="font-semibold text-sm mt-1">{job.title}</h4>
                           <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                               {getCustomer(job.customerId)?.name} · {getCustomer(job.customerId)?.address}
                           </p>
                       </Card>
                   </Link>
                ))}
             </div>
          </section>
        )}

        {/* Daily Tasks */}
        <section className="space-y-3">
           <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                 <Clock className="h-4 w-4 text-blue-500" /> Công việc hôm nay
              </h3>
              <Link to={"/mobile/jobs" as any} className="text-xs text-primary font-medium">Xem tất cả</Link>
           </div>
           
           <div className="space-y-3">
              {activeJobs.slice(0, 3).map(job => {
                  const cus = getCustomer(job.customerId);
                  return (
                    <Link key={job.id} to={"/mobile/jobs" as any}>
                        <Card className="p-4 hover:bg-muted/30 transition-colors">
                            <div className="flex gap-3">
                                <div className={cn(
                                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                                    job.status === "in_progress" ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-600"
                                )}>
                                    <Briefcase className="h-5 w-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                        <h4 className="font-semibold text-sm truncate">{job.title}</h4>
                                        <StatusBadge variant={jobStatusVariant[job.status]}>{jobStatusLabel[job.status]}</StatusBadge>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1 truncate">
                                        {cus?.name}
                                    </p>
                                    <div className="mt-2 flex items-center gap-3 text-[10px] text-muted-foreground">
                                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {formatDateTime(job.scheduledFor).split(" ")[1]}</span>
                                        <span className="flex items-center gap-1 line-clamp-1"><MapPin className="h-3 w-3" /> {cus?.address}</span>
                                    </div>
                                </div>
                                <ChevronRight className="h-4 w-4 self-center text-muted-foreground/30" />
                            </div>
                        </Card>
                    </Link>
                  )
              })}
           </div>
        </section>

        {/* Quick Actions */}
        <section className="bg-primary/5 rounded-2xl p-4 border border-primary/10">
            <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-3">Phím tắt nhanh</h3>
            <div className="grid grid-cols-2 gap-3">
                 <Button variant="outline" className="bg-background h-auto py-3 flex-col gap-2 font-semibold text-xs border-primary/20">
                    <AlertTriangle className="h-5 w-5 text-amber-500" /> Báo sự cố
                 </Button>
                 <Button variant="outline" className="bg-background h-auto py-3 flex-col gap-2 font-semibold text-xs border-primary/20">
                    <TrendingUp className="h-5 w-5 text-emerald-500" /> Xem báo cáo
                 </Button>
            </div>
        </section>
      </div>
    </MobileShell>
  );
}

function StatCardMobile({ 
    title, 
    value, 
    icon: Icon, 
    color 
}: { 
    title: string; 
    value: string | number; 
    icon: any; 
    color: string 
}) {
    return (
        <Card className="shrink-0 w-[140px] p-4 flex flex-col gap-3 shadow-sm border-none bg-background">
            <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center text-white", color)}>
                <Icon className="h-4.5 w-4.5" />
            </div>
            <div>
                <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">{title}</div>
                <div className="text-sm font-bold truncate mt-0.5">{value}</div>
            </div>
        </Card>
    )
}
