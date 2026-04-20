import { createFileRoute, useRouter } from "@tanstack/react-router";
import { MobileShell } from "@/components/layout/MobileShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockJobs } from "@/lib/mock-data";
import { StatusBadge } from "@/components/common/StatusBadge";
import { jobStatusLabel, jobStatusVariant } from "@/lib/status-variants";
import { 
  ChevronLeft, 
  MapPin, 
  Clock, 
  Phone, 
  Calendar,
  Wrench,
  Camera,
  PenTool,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export const Route = createFileRoute("/mobile/jobs/$jobId")({
  component: MobileJobDetail,
});

function MobileJobDetail() {
  const { jobId } = Route.useParams();
  const router = useRouter();
  const job = mockJobs.find((j) => j.id === jobId);

  if (!job) return <div>Không tìm thấy công việc</div>;

  return (
    <MobileShell title="Chi tiết tác vụ">
      <div className="flex flex-col pb-32 bg-slate-50 min-h-screen">
        {/* Compact Back Header */}
        <div className="px-5 py-4 bg-white flex items-center justify-between sticky top-0 z-30 border-b border-slate-100 shadow-sm">
           <button onClick={() => router.history.back()} className="h-9 w-9 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 active:scale-90">
              <ChevronLeft className="h-5 w-5 text-slate-600" />
           </button>
           <StatusBadge variant={jobStatusVariant[job.status]} className="h-6 px-3 text-[9px] font-bold uppercase">
              {jobStatusLabel[job.status]}
           </StatusBadge>
        </div>

        {/* Content Section */}
        <div className="p-5 space-y-4">
           {/* Primary Info */}
           <Card className="p-5 border-none shadow-sm rounded-2xl bg-white space-y-4">
              <div className="space-y-1">
                 <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">#{job.id.slice(0, 8)}</p>
                 <h1 className="text-lg font-bold text-slate-900 leading-snug">{job.title}</h1>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                 <div className="flex items-center gap-2 text-slate-500">
                    <Clock className="h-4 w-4 text-slate-400" />
                    <span className="text-xs font-medium">08:00 — 10:30</span>
                 </div>
                 <div className="flex items-center gap-2 text-slate-500">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <span className="text-xs font-medium">20/04/2026</span>
                 </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between">
                 <div className="flex items-center gap-3 shrink-0">
                    <MapPin className="h-4 w-4 text-rose-500" />
                    <span className="text-xs font-bold text-slate-700">Vincom Center</span>
                 </div>
                 <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center border border-slate-200 shadow-sm">
                    <Phone className="h-4 w-4 text-indigo-500" />
                 </div>
              </div>
           </Card>

           {/* Checklist Section */}
           <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest px-1 flex items-center gap-2">
                 <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                 Hạng mục kiểm tra
              </h3>
              <div className="space-y-2">
                 {["Kiểm tra rãnh trượt", "Vệ sinh hố thang", "Kiểm tra thắng cơ", "Tra dầu cáp tời"].map((item, i) => (
                    <div key={i} className="bg-white p-3.5 rounded-xl border border-slate-100 flex items-center gap-3">
                       <div className="h-5 w-5 rounded-md border-2 border-slate-200" />
                       <span className="text-sm text-slate-600 font-medium">{item}</span>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Action Bar Floating */}
        <div className="fixed bottom-0 left-0 right-0 p-5 bg-white/80 backdrop-blur-lg border-t border-slate-100 z-40">
           <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
              <Button variant="outline" className="h-12 rounded-xl border-slate-200 text-slate-600 font-bold text-xs flex items-center gap-2">
                 <Camera className="h-4 w-4" />
                 CHỤP ẢNH
              </Button>
              <Button className="h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-500/20">
                 <PenTool className="h-4 w-4" />
                 BẮT ĐẦU
              </Button>
           </div>
        </div>
      </div>
    </MobileShell>
  );
}
