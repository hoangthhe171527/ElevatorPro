import { Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  mockJobs,
  getCustomer,
  formatDate,
  type Project,
} from "@/lib/mock-data";
import {
  ArrowLeft,
  Calendar,
  ChevronRight,
  Hammer,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileTechProjectDetail({ project }: { project: any }) {
  const cus = getCustomer(project.customerId);
  const projectJobs = useMemo(() => mockJobs.filter(j => j.projectId === project.id), [project.id]);

  const STAGES = [
    "GĐ 1: Kiểm tra hố thang",
    "GĐ 2: Lắp đặt cơ khí (Khung, Rail)",
    "GĐ 3: Lắp đặt cơ khí (Máy kéo, Cáp)",
    "GĐ 4: Lắp đặt điện (Tủ ĐK, Button)",
    "GĐ 5: Vận hành chạy thử",
    "GĐ 6: Kiểm định an toàn",
    "GĐ 7: Bàn giao khách hàng",
    "GĐ 8: Hướng dẫn sử dụng"
  ];

  return (
    <AppShell secondaryNav={
        <div className="flex items-center gap-3 px-4 py-2 bg-slate-900 text-white">
          <Link to="/app/tech/jobs" search={{ tab: 'install' } as any} className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center">
              <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex flex-col">
             <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">Dự án thi công</span>
             <span className="text-xs font-black truncate max-w-[200px]">{project.name}</span>
          </div>
        </div>
      }>
      <div className="bg-slate-900 px-4 pt-4 pb-12 rounded-b-[2.5rem] shadow-2xl shadow-slate-900/20 relative overflow-hidden">
         <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
            <Hammer className="h-48 w-48 text-white rotate-12" />
         </div>
         
         <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2">
               <Badge className="bg-orange-500 text-white border-none text-[9px] font-black tracking-widest px-2 py-0.5">INSTALLATION</Badge>
               <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">ID: {project.code}</span>
            </div>
            <h1 className="text-2xl font-black text-white leading-tight mt-2">{project.name}</h1>
            <div className="flex items-center gap-4 text-white/50 text-[11px] font-bold">
               <div className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Bắt đầu: {formatDate(project.startDate)}</div>
            </div>
         </div>
      </div>

      <div className="px-4 -mt-6 space-y-4 pb-12">
         {/* Overall Progress Card */}
         <Card className="p-6 rounded-[28px] border-none shadow-xl bg-white space-y-4">
            <div className="flex justify-between items-end">
               <div className="space-y-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tiến độ tổng quát</span>
                  <div className="text-2xl font-black text-slate-800">Giai đoạn {projectJobs.filter(j => j.status === 'completed').length}/8</div>
               </div>
               <div className="h-14 w-14 rounded-full border-4 border-slate-50 flex items-center justify-center relative">
                  <svg className="h-12 w-12 -rotate-90">
                     <circle cx="24" cy="24" r="20" fill="transparent" stroke="currentColor" strokeWidth="4" className="text-slate-100" />
                     <circle cx="24" cy="24" r="20" fill="transparent" stroke="currentColor" strokeWidth="4" className="text-primary" strokeDasharray={`${(projectJobs.filter(j => j.status === 'completed').length / 8) * 125.6} 125.6`} strokeLinecap="round" />
                  </svg>
                  <span className="absolute text-[10px] font-black">{Math.round((projectJobs.filter(j => j.status === 'completed').length / 8) * 100)}%</span>
               </div>
            </div>
         </Card>

         <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.1em] text-slate-800 ml-2">Trình tự 8 giai đoạn</h3>
            
            <div className="space-y-3 relative before:absolute before:left-[17px] before:top-4 before:bottom-4 before:w-1 before:bg-slate-100 before:rounded-full">
               {STAGES.map((stageName, idx) => {
                  const stageNum = idx + 1;
                  const job = projectJobs.find(j => j.code.endsWith(`-${stageNum}`));
                  const isCompleted = job?.status === "completed";
                  const isCurrent = job?.status === "in_progress" || job?.status === "scheduled";
                  const isLocked = !isCompleted && !isCurrent;

                  return (
                    <Card key={idx} className={cn(
                       "relative ml-8 p-4 rounded-[22px] border-none transition-all",
                       isCurrent ? "shadow-xl shadow-primary/10 ring-2 ring-primary bg-white" : 
                       isCompleted ? "bg-emerald-50/50 shadow-sm opacity-80" : 
                       "bg-slate-50 opacity-50 shadow-none border border-slate-100"
                    )}>
                       {/* Timeline Marker */}
                       <div className={cn(
                          "absolute -left-[28px] top-1/2 -translate-y-1/2 h-6 w-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center transition-all",
                          isCompleted ? "bg-emerald-500 scale-110" : 
                          isCurrent ? "bg-primary scale-125 ring-2 ring-primary/20" : 
                          "bg-slate-200"
                       )}>
                          {isCompleted ? <CheckCircle2 className="h-3 w-3 text-white" /> : <div className="h-1 w-1 bg-white rounded-full" />}
                       </div>

                       <div className="flex items-center justify-between gap-4">
                          <div className="flex-1 min-w-0">
                             <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Giai đoạn {stageNum}</div>
                             <h4 className={cn("text-sm font-black truncate", isCurrent ? "text-primary" : "text-slate-800 font-bold")}>{stageName.split(': ')[1]}</h4>
                             
                             {isCurrent && job && (
                                <div className="mt-2 flex items-center gap-2 text-[10px] font-bold text-slate-500">
                                   <Clock className="h-3 w-3" /> {job.scheduledFor.split('T')[0]}
                                </div>
                             )}
                          </div>
                          
                          {isCurrent && job ? (
                             <Link to="/app/tech/jobs/$jobId" params={{ jobId: job.id }}>
                                <Button size="sm" className="h-8 rounded-xl text-[10px] font-black uppercase shadow-md shadow-primary/20">THỰC HIỆN</Button>
                             </Link>
                          ) : isCompleted && job ? (
                             <Link to="/app/tech/jobs/$jobId" params={{ jobId: job.id }}>
                                <ChevronRight className="h-4 w-4 text-slate-300" />
                             </Link>
                          ) : (
                             <AlertTriangle className="h-4 w-4 text-slate-200" />
                          )}
                       </div>
                    </Card>
                  );
               })}
            </div>
         </div>
      </div>
    </AppShell>
  );
}
