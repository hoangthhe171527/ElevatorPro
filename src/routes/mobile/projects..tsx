import { createFileRoute, useRouter } from "@tanstack/react-router";
import { MobileShell } from "@/components/layout/MobileShell";
import { Card } from "@/components/ui/card";
import { mockProjects } from "@/lib/mock-data";
import { 
  ChevronLeft, 
  Target, 
  Calendar, 
  Layers, 
  Users,
  CheckCircle2,
  FileText
} from "lucide-react";

export const Route = createFileRoute("/mobile/projects/$projectId")({
  component: MobileProjectDetail,
});

function MobileProjectDetail() {
  const { projectId } = Route.useParams();
  const router = useRouter();
  const project = mockProjects.find((p) => p.id === projectId);

  if (!project) return <div>Không tìm thấy dự án</div>;

  return (
    <MobileShell title="Chi tiết dự án">
      <div className="flex flex-col pb-24 bg-slate-50 min-h-screen">
        {/* Compact Back Header */}
        <div className="px-5 py-4 bg-white flex items-center justify-between sticky top-0 z-30 border-b border-slate-100 shadow-sm">
           <button onClick={() => router.history.back()} className="h-9 w-9 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 active:scale-90">
              <ChevronLeft className="h-5 w-5 text-slate-600" />
           </button>
           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{project.id}</span>
        </div>

        <div className="p-5 space-y-4">
           {/* Summary Card */}
           <Card className="p-5 border-none shadow-sm rounded-2xl bg-indigo-600 text-white relative overflow-hidden">
              <div className="relative z-10 space-y-4">
                 <div>
                    <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest mb-1 italic">Dự án thi công_</p>
                    <h1 className="text-lg font-bold leading-tight">{project.name}</h1>
                 </div>

                 <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold uppercase">
                       <span className="opacity-70">Tiến độ tổng thể</span>
                       <span>75%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                       <div className="h-full bg-white w-[75%] rounded-full shadow-[0_0_8px_white/50]" />
                    </div>
                 </div>
              </div>
              <Target className="absolute -bottom-4 -right-4 h-24 w-24 text-white/10" />
           </Card>

           {/* Project Stats */}
           <div className="grid grid-cols-3 gap-3">
              <div className="bg-white p-3 rounded-xl border border-slate-100 flex flex-col items-center">
                 <Calendar className="h-4 w-4 text-indigo-500 mb-1" />
                 <span className="text-[9px] font-bold text-slate-400 uppercase">Hạn cuối</span>
                 <p className="text-xs font-bold text-slate-900">12/2026</p>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-100 flex flex-col items-center">
                 <Layers className="h-4 w-4 text-emerald-500 mb-1" />
                 <span className="text-[9px] font-bold text-slate-400 uppercase">Thiết bị</span>
                 <p className="text-xs font-bold text-slate-900">08 Unit</p>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-100 flex flex-col items-center">
                 <Users className="h-4 w-4 text-amber-500 mb-1" />
                 <span className="text-[9px] font-bold text-slate-400 uppercase">Nhân sự</span>
                 <p className="text-xs font-bold text-slate-900">12 Dev</p>
              </div>
           </div>

           {/* Milestone List */}
           <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest px-1">Lộ trình hoàn thành_</h3>
              <div className="space-y-2">
                 {[
                   { t: "Lắp đặt khung hố", s: "Xong" },
                   { t: "Kéo cáp tời & Động cơ", s: "Xong" },
                   { t: "Lắp đặt Cabin & Cửa", s: "Đang làm" },
                   { t: "Đấu nối tủ điện & Kiểm định", s: "Chưa" }
                 ].map((m, i) => (
                    <div key={i} className="bg-white p-4 rounded-xl border border-slate-100 flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <CheckCircle2 className={`h-4 w-4 ${m.s === "Chưa" ? "text-slate-200" : "text-indigo-500"}`} />
                          <span className="text-sm text-slate-600 font-medium">{m.t}</span>
                       </div>
                       <StatusBadge variant={m.s === "Xong" ? "success" : m.s === "Đang làm" ? "warning" : "default"} className="h-4 px-1.5 text-[7px] font-bold uppercase tracking-tighter">
                          {m.s}
                       </StatusBadge>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </MobileShell>
  );
}
