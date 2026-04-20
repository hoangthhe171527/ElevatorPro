import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/layout/MobileShell";
import { Card } from "@/components/ui/card";
import { mockJobs } from "@/lib/mock-data";
import { StatusBadge } from "@/components/common/StatusBadge";
import { jobStatusLabel, jobStatusVariant } from "@/lib/status-variants";
import { 
  ChevronRight, 
  MapPin, 
  Clock, 
  Search,
  Filter,
  CalendarDays
} from "lucide-react";

export const Route = createFileRoute("/mobile/jobs")({
  component: MobileJobsList,
});

function MobileJobsList() {
  return (
    <MobileShell title="Danh sách tác vụ">
      <div className="flex flex-col pb-24 bg-slate-50 min-h-screen">
        {/* Compact Filter Bar */}
        <div className="sticky top-0 z-20 px-4 py-3 bg-white border-b border-slate-100 flex items-center gap-2 shadow-sm">
           <div className="flex-1 flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg">
             <Search className="h-3.5 w-3.5 text-slate-400" />
             <input placeholder="Số serial, tên..." className="bg-transparent border-none text-[13px] w-full focus:ring-0" />
           </div>
           <button className="h-8 w-8 flex items-center justify-center bg-slate-100 rounded-lg active:scale-95">
             <Filter className="h-4 w-4 text-slate-600" />
           </button>
        </div>

        {/* High Density List */}
        <div className="px-4 py-4 space-y-2.5">
          {mockJobs.map((job) => (
            <Link key={job.id} to={`/mobile/jobs/${job.id}`}>
              <Card className="p-3.5 border border-slate-100 shadow-sm rounded-xl bg-white active:bg-slate-50 transition-colors flex items-center gap-3">
                 <div className="h-10 w-10 flex flex-col items-center justify-center bg-indigo-50/50 rounded-lg shrink-0 border border-indigo-100">
                    <CalendarDays className="h-3.5 w-3.5 text-indigo-500 mb-0.5" />
                    <span className="text-[10px] font-bold text-indigo-600">{job.id.split("-")[1].toUpperCase()}</span>
                 </div>

                 <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                       <StatusBadge variant={jobStatusVariant[job.status]} className="h-3.5 px-1 text-[8px] font-bold uppercase tracking-tighter">
                          {jobStatusLabel[job.status]}
                       </StatusBadge>
                       <span className="text-[10px] text-slate-400 font-medium tracking-tight truncate max-w-[120px]">REF: {job.id.slice(0, 8)}</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 truncate leading-tight mb-1">{job.title}</h3>
                    <div className="flex items-center gap-3 text-slate-400">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span className="text-[10px] font-medium">08:00 AM</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span className="text-[10px] font-medium truncate max-w-[140px]">Vincom CTR</span>
                      </div>
                    </div>
                 </div>
                 
                 <ChevronRight className="h-4 w-4 text-slate-200" />
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </MobileShell>
  );
}
