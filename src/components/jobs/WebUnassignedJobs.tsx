import { Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  mockJobs, 
  getCustomer, 
  getUser, 
  formatDateTime 
} from "@/lib/mock-data";
import { useAppStore } from "@/lib/store";
import { 
  AlertCircle, 
  Calendar, 
  MapPin, 
  ChevronRight, 
  Send,
  Clock,
  User,
  Wrench,
  Activity,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import { priorityLabel, priorityVariant } from "@/lib/status-variants";
import { StatusBadge } from "@/components/common/StatusBadge";
import { DataPagination } from "@/components/common/DataPagination";

export function WebUnassignedJobs() {
  const activeTenantId = useAppStore((s) => s.activeTenantId);
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const unassignedJobs = useMemo(() => {
    return mockJobs.filter(j => 
      j.tenantId === activeTenantId && 
      j.status === 'pending' && 
      j.type !== 'install' // Installation is in the Projects module
    ).sort((a, b) => {
       if (a.priority === 'urgent' && b.priority !== 'urgent') return -1;
       if (a.priority !== 'urgent' && b.priority === 'urgent') return 1;
       return a.scheduledFor.localeCompare(b.scheduledFor);
    });
  }, [activeTenantId]);

  const pagedJobs = useMemo(() => {
    return unassignedJobs.slice((page - 1) * pageSize, page * pageSize);
  }, [unassignedJobs, page]);

  return (
    <AppShell>
      <PageHeader
        title="Điều phối Công việc"
        description="Danh sách các công việc dịch vụ chưa có người thực hiện (Chờ điều phối thợ)"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {pagedJobs.map((job) => {
          const cus = getCustomer(job.customerId);
          const Icon = job.type === 'maintenance' ? Activity : job.type === 'warranty' ? ShieldCheck : Wrench;
          const isUrgent = job.priority === 'urgent';

          return (
            <Card key={job.id} className={cn(
              "overflow-hidden border-none shadow-xl shadow-slate-200/50 rounded-[2rem] transition-all hover:scale-[1.02] bg-white group",
              isUrgent ? "ring-2 ring-destructive/20" : ""
            )}>
              <CardHeader className="pb-4 relative">
                {isUrgent && (
                  <div className="absolute top-4 right-4 animate-pulse">
                    <AlertCircle className="h-5 w-5 text-destructive" />
                  </div>
                )}
                <div className="flex items-center gap-3 mb-4">
                   <div className={cn(
                     "h-10 w-10 rounded-xl flex items-center justify-center text-white shadow-lg",
                     job.type === 'maintenance' ? "bg-blue-500 shadow-blue-500/20" :
                     job.type === 'warranty' ? "bg-emerald-500 shadow-emerald-500/20" :
                     "bg-rose-500 shadow-rose-500/20"
                   )}>
                      <Icon className="h-5 w-5" />
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Mã: {job.code}</span>
                      <StatusBadge variant={priorityVariant[job.priority]} className="w-fit h-auto py-0.5 text-[8px] uppercase font-black">
                        {priorityLabel[job.priority]}
                      </StatusBadge>
                   </div>
                </div>
                <CardTitle className="text-[15px] font-black text-slate-800 leading-tight group-hover:text-primary transition-colors line-clamp-2 min-h-[2.5rem]">
                  {job.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4 pb-6">
                 <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                    <div className="flex items-center gap-2 text-[11px] font-bold text-slate-600">
                       <MapPin className="h-3.5 w-3.5 text-primary" />
                       <span className="truncate">{cus?.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-bold text-slate-600">
                       <Clock className="h-3.5 w-3.5 text-primary" />
                       <span>{formatDateTime(job.scheduledFor)}</span>
                    </div>
                 </div>
              </CardContent>

              <CardFooter className="pt-0 pb-6 px-6">
                <Link 
                  to="/admin/jobs/$jobId" 
                  params={{ jobId: job.id }}
                  className="w-full"
                >
                  <Button className="w-full h-11 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20 gap-2">
                    Giao việc ngay <Send className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          );
        })}

        {unassignedJobs.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
               <ShieldCheck className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-black text-slate-800">Tuyệt vời!</h3>
            <p className="text-sm text-slate-500 font-medium mt-1">Tất cả các công việc đã được điều phối hết.</p>
          </div>
        )}
      </div>

      <div className="mt-8">
        <DataPagination
          page={page}
          total={unassignedJobs.length}
          pageSize={pageSize}
          onPageChange={setPage}
        />
      </div>
    </AppShell>
  );
}
