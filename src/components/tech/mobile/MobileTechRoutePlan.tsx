import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/common/StatusBadge";
import { priorityLabel, priorityVariant } from "@/lib/status-variants";
import { RouteMap } from "@/components/common/RouteMap";
import { mockJobs, optimizeRoute, formatDateTime, getCustomer } from "@/lib/mock-data";
import { useAppStore } from "@/lib/store";
import {
  Route as RouteIcon,
  Clock,
  MapPin,
  Navigation,
  Sparkles,
  Zap,
  Phone,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function MobileTechRoutePlan() {
  const userId = useAppStore((s) => s.userId);
  const [day, setDay] = useState<string>("all");
  const [completedStops, setCompletedStops] = useState<string[]>([]);

  const myActive = useMemo(
    () =>
      mockJobs.filter(
        (j) => j.assignedTo === userId && (j.status === "scheduled" || j.status === "in_progress"),
      ),
    [userId],
  );

  const days = useMemo(() => {
    const set = new Set(myActive.map((j) => j.scheduledFor.split("T")[0]));
    return Array.from(set).sort();
  }, [myActive]);

  const jobs = day === "all" ? myActive : myActive.filter((j) => j.scheduledFor.startsWith(day));
  const route = useMemo(() => optimizeRoute(userId, jobs), [userId, jobs]);
  const nextStop = route.stops.find((s) => !completedStops.includes(s.jobId));

  const openMapToStop = (lat: number, lng: number, label: string) => {
    const destination = `${lat},${lng}`;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}&travelmode=driving`;
    window.open(url, "_blank", "noopener,noreferrer");
    toast.success(`Đang chỉ đường tới ${label}`);
  };

  const markDone = (jobId: string) => {
    if (completedStops.includes(jobId)) return;
    setCompletedStops([...completedStops, jobId]);
    toast.success("Đã hoàn thành điểm dừng này!");
  };

  return (
    <AppShell secondaryNav={
        <div className="flex items-center justify-between px-4 py-2 bg-slate-900 text-white">
          <Link to="/app/tech" className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center">
              <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex flex-col items-center">
             <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">Lộ trình tối ưu</span>
             <span className="text-xs font-black">Hôm nay</span>
          </div>
          <div className="w-8 h-8" />
        </div>
      }>
      <Card className="m-4 rounded-[28px] overflow-hidden border-none shadow-2xl shadow-slate-900/10">
        <div className="h-[300px] relative">
            <RouteMap
              height={300}
              routes={[{ id: userId, color: "var(--route-1)", label: "Tuyến của bạn", route }]}
            />
            <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                <Button className="flex-1 h-12 rounded-xl bg-primary shadow-lg shadow-primary/20 gap-2 font-black text-xs" onClick={() => nextStop && openMapToStop(nextStop.lat, nextStop.lng, nextStop.label)}>
                   <Navigation className="h-4 w-4" /> BẮT ĐẦU CHỈ ĐƯỜNG
                </Button>
            </div>
        </div>
      </Card>

      <div className="px-4 space-y-4 pb-12">
         {/* Stats Row */}
         <div className="grid grid-cols-3 gap-2">
            <Card className="p-3 rounded-2xl bg-white border-none shadow-sm flex flex-col items-center text-center">
               <MapPin className="h-4 w-4 text-primary mb-1" />
               <span className="text-[14px] font-black">{route.stops.length}</span>
               <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Điểm đến</span>
            </Card>
            <Card className="p-3 rounded-2xl bg-white border-none shadow-sm flex flex-col items-center text-center">
               <RouteIcon className="h-4 w-4 text-indigo-500 mb-1" />
               <span className="text-[14px] font-black">{route.totalKm.toFixed(1)}</span>
               <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">KM Tổng</span>
            </Card>
            <Card className="p-3 rounded-2xl bg-white border-none shadow-sm flex flex-col items-center text-center">
               <Sparkles className="h-4 w-4 text-success mb-1" />
               <span className="text-[14px] font-black">-{route.savedKm.toFixed(1)}</span>
               <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Tiết kiệm</span>
            </Card>
         </div>

         <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-[0.1em] text-slate-800 ml-2">Thứ tự di chuyển</h3>
            {route.stops.map((s, idx) => {
               const job = mockJobs.find((j) => j.id === s.jobId)!;
               const isDone = completedStops.includes(s.jobId);
               const isNext = nextStop?.jobId === s.jobId;
               
               return (
                 <Card key={s.jobId} className={cn(
                    "p-4 rounded-[24px] border-none shadow-md transition-all",
                    isNext ? "ring-2 ring-primary bg-white" : isDone ? "opacity-50 grayscale bg-slate-50" : "bg-white"
                 )}>
                    <div className="flex items-start gap-4">
                       <div className={cn(
                          "h-8 w-8 rounded-full flex items-center justify-center text-xs font-black shadow-sm shrink-0",
                          isDone ? "bg-success text-white" : isNext ? "bg-primary text-white" : "bg-slate-100 text-slate-400"
                       )}>
                          {isDone ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
                       </div>
                       <div className="flex-1 min-w-0">
                          <Link to="/app/tech/jobs/$jobId" params={{ jobId: s.jobId }} className="block mb-1">
                             <div className="flex items-center gap-2">
                                <h4 className="font-black text-sm text-slate-800 truncate">{job.title}</h4>
                                {isNext && <span className="h-4 px-2 rounded-full bg-primary/10 text-primary text-[8px] font-black uppercase flex items-center">TIẾP THEO</span>}
                             </div>
                          </Link>
                          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 truncate">
                             <MapPin className="h-3 w-3" /> {s.label}
                          </div>
                          
                          {isNext && (
                             <div className="flex gap-2 mt-3">
                                <Button size="sm" className="h-8 flex-1 rounded-xl bg-slate-900 text-white font-black text-[10px] gap-2" onClick={() => openMapToStop(s.lat, s.lng, s.label)}>
                                   <Navigation className="h-3 w-3" /> CHỈ ĐƯỜNG
                                </Button>
                                <Button size="sm" variant="outline" className="h-8 flex-1 rounded-xl border-slate-100 font-black text-[10px] gap-2" onClick={() => markDone(s.jobId)}>
                                   <CheckCircle2 className="h-3 w-3" /> XONG ĐIỂM
                                </Button>
                             </div>
                          )}
                       </div>
                       <div className="text-right shrink-0">
                          <div className="text-xs font-black text-slate-800">{s.legKm.toFixed(1)}km</div>
                          <div className="text-[9px] font-bold text-slate-400">~{s.etaMinutes}m</div>
                       </div>
                    </div>
                 </Card>
               );
            })}
         </div>
      </div>
    </AppShell>
  );
}
