import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/layout/MobileShell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { jobStatusLabel, jobStatusVariant } from "@/lib/status-variants";
import { mockJobs, formatDateTime } from "@/lib/mock-data";
import { 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  MapPin, 
  ChevronRight,
  SlidersHorizontal,
  ChevronDown
} from "lucide-react";

export const Route = createFileRoute("/mobile/jobs/index")({
  component: MobileJobsList,
});

function MobileJobsList() {
  return (
    <MobileShell title="Danh sách công việc">
      <div className="flex flex-col pb-32">
        {/* Search & Filter Header */}
        <div className="px-6 pt-6 pb-20 bg-slate-900">
           <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input 
                placeholder="TÀM KIẾM CÔNG VIỆC..." 
                className="bg-white/10 border-white/10 text-white placeholder:text-slate-500 h-14 pl-12 rounded-2xl font-black uppercase italic text-xs tracking-widest focus-visible:ring-indigo-500"
              />
           </div>
           
           <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              <Button variant="outline" className="shrink-0 h-10 rounded-xl border-white/10 bg-white/5 text-white text-[9px] font-black uppercase tracking-widest gap-2">
                <Calendar className="h-3 w-3" /> Tất cả ngày
              </Button>
              <Button variant="outline" className="shrink-0 h-10 rounded-xl border-white/10 bg-white/5 text-white text-[9px] font-black uppercase tracking-widest gap-2">
                <SlidersHorizontal className="h-3 w-3" /> Trạng thái
              </Button>
              <Button variant="outline" className="shrink-0 h-10 rounded-xl border-white/10 bg-white/5 text-white text-[9px] font-black uppercase tracking-widest gap-2">
                Hợp đồng
              </Button>
           </div>
        </div>

        {/* List Content */}
        <div className="px-6 -mt-10 space-y-4">
          <div className="flex items-center justify-between px-1 mb-2">
             <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] italic">Tổng số: {mockJobs.length} công việc</h3>
             <div className="flex items-center gap-1 text-[10px] font-black text-indigo-500 uppercase italic">
                Sắp xếp <ChevronDown className="h-3 w-3" />
             </div>
          </div>

          {mockJobs.map((job) => (
            <Link key={job.id} to={`/mobile/jobs/${job.id}`}>
              <Card className="p-5 border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] bg-white group active:scale-[0.98] transition-all">
                <div className="flex justify-between items-start mb-4">
                  <StatusBadge variant={jobStatusVariant[job.status]} className="h-5 px-2 text-[8px]">
                    {jobStatusLabel[job.status]}
                  </StatusBadge>
                  <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center">
                    <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                  </div>
                </div>

                <h2 className="text-sm font-black text-slate-900 uppercase italic tracking-tight mb-4 group-hover:text-indigo-600 transition-colors">
                  {job.title}
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Calendar className="h-3.5 w-3.5 text-indigo-400" />
                      <span className="text-[9px] font-black uppercase tracking-wider">{formatDateTime(job.scheduledFor).split(" ")[0]}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Clock className="h-3.5 w-3.5 text-indigo-400" />
                      <span className="text-[9px] font-black uppercase tracking-wider">{formatDateTime(job.scheduledFor).split(" ")[1]}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-slate-400">
                      <MapPin className="h-3.5 w-3.5 text-rose-400" />
                      <span className="text-[9px] font-black uppercase tracking-wider truncate">Khu vực Q.1</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <div className="h-3.5 w-3.5 rounded-full bg-indigo-100 flex items-center justify-center text-[6px] font-bold text-indigo-600">NV</div>
                      <span className="text-[9px] font-black uppercase tracking-wider">Nguyễn Văn A</span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </MobileShell>
  );
}
