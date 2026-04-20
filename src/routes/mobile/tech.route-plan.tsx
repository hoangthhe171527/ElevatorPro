import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/layout/MobileShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Navigation, 
  Clock, 
  ChevronRight, 
  Phone,
  AlertCircle,
  CheckCircle2,
  MoreVertical,
  ExternalLink
} from "lucide-react";
import { mockJobs, formatDate, formatDateTime } from "@/lib/mock-data";
import { jobStatusLabel, jobStatusVariant } from "@/lib/status-variants";
import { StatusBadge } from "@/components/common/StatusBadge";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/mobile/tech/route-plan")({
  component: RoutePlan,
});

function RoutePlan() {
  const todayJobs = mockJobs.slice(0, 4);

  const handleOpenMaps = (address: string) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, "_blank");
  };

  return (
    <MobileShell title="Lộ trình hôm nay">
      <div className="flex flex-col pb-32">
        {/* Route Header Info */}
        <div className="px-6 pt-6 pb-12 bg-slate-900 relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase text-indigo-400 tracking-[0.2em] mb-2 italic">Tối ưu hóa hành trình</p>
            <h1 className="text-2xl font-black text-white uppercase italic tracking-tight mb-4">4 Điểm dừng</h1>
            
            <div className="flex gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 border border-white/10 backdrop-blur-md">
                <Clock className="h-3 w-3 text-indigo-300" />
                <span className="text-[9px] font-black text-white uppercase tracking-wider">6.5 Giờ dự kiến</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 border border-white/10 backdrop-blur-md">
                <Navigation className="h-3 w-3 text-indigo-300" />
                <span className="text-[9px] font-black text-white uppercase tracking-wider">24 KM tổng</span>
              </div>
            </div>
          </div>
          <div className="absolute right-0 bottom-0 w-64 h-64 bg-indigo-500/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />
        </div>

        {/* Vertical Timeline */}
        <div className="px-6 -mt-6 space-y-2 relative z-20">
          {todayJobs.map((job, idx) => (
            <div key={job.id} className="relative pl-8 pb-8 last:pb-0">
              {/* Timeline Connector */}
              {idx !== todayJobs.length - 1 && (
                <div className="absolute left-[11px] top-6 bottom-0 w-1 bg-slate-100 rounded-full" />
              )}
              
              {/* Timeline Node */}
              <div className={cn(
                "absolute left-0 top-1 h-6 w-6 rounded-full border-4 border-white shadow-md flex items-center justify-center z-10",
                idx === 0 ? "bg-indigo-600 animate-pulse" : "bg-slate-200"
              )}>
                {idx === 0 ? (
                  <Navigation className="h-2.5 w-2.5 text-white" />
                ) : (
                  <div className="h-1.5 w-1.5 rounded-full bg-white" />
                )}
              </div>

              {/* Job Card - Fix: Wrap the content in Link except for action buttons */}
              <Card className="p-5 border-none shadow-xl shadow-slate-200/50 rounded-[2rem] bg-white group active:scale-[0.98] transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-slate-50 px-3 py-1 rounded-xl">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Điểm {idx + 1}</span>
                  </div>
                  <StatusBadge variant={jobStatusVariant[job.status]} className="text-[8px] h-5">
                    {jobStatusLabel[job.status]}
                  </StatusBadge>
                </div>

                <Link to={`/mobile/jobs/${job.id}`} className="block mb-6">
                    <h2 className="text-sm font-black text-slate-900 uppercase italic tracking-tight mb-2 group-hover:text-indigo-600 transition-colors">
                      {job.title}
                    </h2>
                    <div className="flex items-center gap-4 text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3 w-3" />
                        <span className="text-[9px] font-black uppercase tracking-wider">{formatDateTime(job.scheduledFor).split(" ")[1]}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3 w-3" />
                        <span className="text-[9px] font-black uppercase tracking-wider truncate max-w-[150px]">Vincom Center - Lê Thánh Tôn</span>
                      </div>
                    </div>
                </Link>

                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-50">
                   <Button 
                    onClick={(e) => { e.preventDefault(); handleOpenMaps("Vincom Center, 72 Lê Thánh Tôn, Bến Nghé, Quận 1"); }}
                    variant="outline" 
                    className="h-10 rounded-2xl border-slate-100 bg-slate-50/50 text-[9px] font-black uppercase tracking-wider gap-2"
                   >
                     <Navigation className="h-3 w-3 text-indigo-500" />
                     Chỉ đường
                   </Button>
                   <Button 
                    onClick={(e) => { e.preventDefault(); window.location.href = "tel:0901234567"; }}
                    variant="outline" 
                    className="h-10 rounded-2xl border-slate-100 bg-slate-50/50 text-[9px] font-black uppercase tracking-wider gap-2"
                   >
                     <Phone className="h-3 w-3 text-emerald-500" />
                     Liên hệ
                   </Button>
                </div>
              </Card>
            </div>
          ))}
        </div>

        {/* Optimize Button Floating */}
        <div className="fixed bottom-24 left-6 right-6 z-40">
            <Button className="w-full h-14 rounded-2xl bg-indigo-600 text-white font-black uppercase tracking-[0.2em] italic text-xs shadow-xl shadow-indigo-200 gap-3">
                <Navigation className="h-4 w-4" />
                Bắt đầu di chuyển
            </Button>
        </div>
      </div>
    </MobileShell>
  );
}
