import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/layout/MobileShell";
import { Card } from "@/components/ui/card";
import { mockJobs } from "@/lib/mock-data";
import { useAppStore, useMainRole } from "@/lib/store";
import { StatusBadge } from "@/components/common/StatusBadge";
import { jobStatusLabel, jobStatusVariant } from "@/lib/status-variants";
import { 
  ChevronRight, 
  MapPin, 
  Clock, 
  Search,
  Filter,
  CalendarDays,
  LayoutGrid,
  ListFilter
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/mobile/jobs")({
  component: MobileJobsList,
});

function MobileJobsList() {
   const role = useMainRole();
   const activeTenantId = useAppStore((s) => s.activeTenantId);
   const userId = useAppStore((s) => s.userId);

   const scopedJobs = mockJobs.filter((job) => job.tenantId === activeTenantId);
   const jobs = role === "tech" ? scopedJobs.filter((job) => job.assignedTo === userId) : scopedJobs;

  return (
    <MobileShell title="Danh sách tác vụ">
      <div className="flex flex-col pb-32 bg-slate-50 min-h-screen">
        {/* Sticky Search & Filter Header */}
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm px-5 py-4">
           <div className="flex items-center gap-3">
              <div className="flex-1 flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-2xl ring-1 ring-slate-100/50">
                 <Search className="h-4 w-4 text-slate-400" />
                 <input placeholder="Tìm số serial, tòa nhà..." className="bg-transparent border-none text-[13px] w-full focus:ring-0 font-medium" />
              </div>
              <button className="h-10 w-10 flex items-center justify-center bg-indigo-600 rounded-2xl active:scale-90 transition-all shadow-lg shadow-indigo-600/20">
                 <ListFilter className="h-5 w-5 text-white" />
              </button>
           </div>
           
           {/* Quick Tabs */}
           <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1 no-scrollbar">
              {["Tất cả", "Chờ xử lý", "Đang chạy", "Hoàn thành"].map((tab, i) => (
                 <button key={tab} className={cn(
                    "whitespace-nowrap px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                    i === 0 ? "bg-slate-900 text-white shadow-md" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                 )}>
                    {tab}
                 </button>
              ))}
           </div>
        </div>

        {/* Dynamic List with Better Spacing */}
        <div className="px-5 py-6 space-y-4">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-1">Lịch trình hiển thị ({jobs.length})</p>
          
               {jobs.map((job) => (
            <Link key={job.id} to={`/mobile/jobs/${job.id}`}>
              <Card className="p-5 border border-slate-100 shadow-sm rounded-[1.8rem] bg-white active:scale-[0.98] transition-all flex flex-col gap-4 relative overflow-hidden group">
                 {/* Left accent bar */}
                 <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-slate-100 group-active:bg-indigo-500 transition-colors" />
                 
                 <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                       <div className="h-12 w-12 flex flex-col items-center justify-center bg-slate-50 border border-slate-100 rounded-2xl group-active:border-indigo-100 transition-colors">
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">JOB</span>
                          <span className="text-sm font-black text-slate-900 italic">#{job.id.slice(0, 3)}</span>
                       </div>
                       <div>
                          <div className="flex items-center gap-2 mb-1">
                             <StatusBadge variant={jobStatusVariant[job.status]} className="h-4 px-2 text-[7px] font-black uppercase tracking-widest shadow-sm border-none">
                                {jobStatusLabel[job.status]}
                             </StatusBadge>
                          </div>
                          <h3 className="text-[14px] font-black text-slate-900 leading-tight italic truncate max-w-[180px]">{job.title}</h3>
                       </div>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 shadow-inner">
                       <ChevronRight className="h-4 w-4 text-slate-300" />
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-50">
                    <div className="flex items-center gap-2 text-slate-500 bg-slate-50/50 p-2 rounded-xl border border-slate-100/50">
                       <Clock className="h-3.5 w-3.5 text-indigo-400" />
                       <span className="text-[10px] font-bold">08:30 AM</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 bg-slate-50/50 p-2 rounded-xl border border-slate-100/50">
                       <MapPin className="h-3.5 w-3.5 text-amber-400" />
                       <span className="text-[10px] font-bold truncate">Vincom CTR</span>
                    </div>
                 </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Pagination Shadow UI */}
        <div className="px-5 py-8 flex flex-col items-center gap-4">
           <div className="flex items-center gap-2">
              <button className="h-9 w-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm opacity-50"><ChevronRight className="h-4 w-4 rotate-180" /></button>
              <div className="flex items-center gap-1">
                 <span className="h-9 w-9 rounded-xl bg-slate-900 text-white flex items-center justify-center text-[10px] font-black shadow-lg shadow-slate-900/20">1</span>
                 <span className="h-9 w-9 rounded-xl bg-white border border-slate-100 text-slate-400 flex items-center justify-center text-[10px] font-black">2</span>
                 <span className="h-9 w-9 rounded-xl bg-white border border-slate-100 text-slate-400 flex items-center justify-center text-[10px] font-black">3</span>
              </div>
              <button className="h-9 w-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm"><ChevronRight className="h-4 w-4" /></button>
           </div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Đang hiển thị {Math.min(jobs.length, 10)} trên {jobs.length} kết quả</p>
        </div>
      </div>
    </MobileShell>
  );
}
