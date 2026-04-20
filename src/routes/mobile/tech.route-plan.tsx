import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/layout/MobileShell";
import { Card } from "@/components/ui/card";
import { mockJobs } from "@/lib/mock-data";
import { StatusBadge } from "@/components/common/StatusBadge";
import { jobStatusLabel, jobStatusVariant } from "@/lib/status-variants";
import { 
  MapPin, 
  Clock, 
  Phone,
  Navigation as NavIcon,
  ChevronRight
} from "lucide-react";

export const Route = createFileRoute("/mobile/tech/route-plan")({
  component: TechRoutePlan,
});

function TechRoutePlan() {
  return (
    <MobileShell title="Lộ trình di chuyển">
      <div className="flex flex-col pb-24 bg-slate-50 min-h-screen">
        {/* Compact Map Header Preview */}
        <div className="h-28 bg-slate-200 w-full relative overflow-hidden border-b border-slate-300">
           <div className="absolute inset-0 flex items-center justify-center bg-slate-100 italic text-[10px] font-bold text-slate-400 uppercase tracking-widest">
             [ MAP ENGINE PREVIEW_ ]
           </div>
           <div className="absolute bottom-2 left-4 px-3 py-1 bg-indigo-600 text-white text-[9px] font-black rounded-full shadow-lg">
             LIVE TRACKING
           </div>
        </div>

        {/* Vertical Simple Timeline */}
        <div className="px-5 py-6">
          <div className="relative border-l border-slate-200 ml-2 space-y-6">
            {mockJobs.slice(0, 4).map((job, idx) => (
              <div key={job.id} className="relative pl-7 text-left group">
                {/* Timeline Dot */}
                <div className={`absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full border-2 border-white shadow-sm ${idx === 0 ? "bg-indigo-600 ring-4 ring-indigo-50" : "bg-slate-300"}`} />
                
                <Link to={`/mobile/jobs/${job.id}`}>
                  <Card className="p-3.5 border border-slate-100 shadow-sm rounded-xl bg-white active:bg-slate-50 transition-all">
                    <div className="flex justify-between items-start mb-2">
                       <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-tight">Diem den #{idx + 1}</span>
                       <StatusBadge variant={jobStatusVariant[job.status]} className="h-3.5 px-1 text-[7px] font-bold uppercase">
                          {jobStatusLabel[job.status]}
                       </StatusBadge>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 leading-tight mb-2 truncate">{job.title}</h3>
                    
                    <div className="flex items-center gap-2 mb-3">
                       <div className="h-5 w-5 rounded-md bg-slate-50 flex items-center justify-center border border-slate-100">
                          <Clock className="h-3 w-3 text-slate-400" />
                       </div>
                       <span className="text-[10px] font-bold text-slate-500 uppercase">08:30 AM — 10:30 AM</span>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                       <div className="flex items-center gap-1.5 text-slate-400">
                          <MapPin className="h-3 w-3 text-rose-500" />
                          <span className="text-[9px] font-bold uppercase truncate max-w-[120px]">VINCOM CTR</span>
                       </div>
                       <div className="flex items-center gap-2">
                          <button className="h-7 w-7 rounded-lg bg-emerald-50 flex items-center justify-center border border-emerald-100 active:scale-90 transition-transform">
                             <Phone className="h-3.5 w-3.5 text-emerald-600" />
                          </button>
                          <button className="h-7 w-7 rounded-lg bg-indigo-50 flex items-center justify-center border border-indigo-100 active:scale-90 transition-transform">
                             <NavIcon className="h-3.5 w-3.5 text-indigo-600" />
                          </button>
                       </div>
                    </div>
                  </Card>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MobileShell>
  );
}
