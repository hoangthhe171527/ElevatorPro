import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/layout/MobileShell";
import { Card } from "@/components/ui/card";
import { mockProjects } from "@/lib/mock-data";
import { StatusBadge } from "@/components/common/StatusBadge";
import { 
  Navigation, 
  Target, 
  Calendar, 
  Layers, 
  ChevronRight,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/mobile/projects")({
  component: MobileProjectsList,
});

function MobileProjectsList() {
  return (
    <MobileShell title="Quản lý dự án">
      <div className="flex flex-col pb-32">
        {/* Project Header */}
        <div className="px-6 pt-10 pb-20 bg-slate-900 border-b border-white/5">
           <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-[10px] font-black uppercase text-indigo-400 tracking-[0.2em] mb-1 italic">Theo dõi tiến trình</p>
                <h1 className="text-2xl font-black text-white uppercase italic tracking-tight">{mockProjects.length} Dự án</h1>
              </div>
              <Button className="h-12 w-12 rounded-2xl bg-indigo-600 shadow-xl shadow-indigo-500/20">
                 <Plus className="h-6 w-6 text-white" />
              </Button>
           </div>
        </div>

        {/* List Content */}
        <div className="px-6 -mt-10 space-y-4">
          {mockProjects.map((p) => (
            <Link key={p.id} to={`/mobile/projects/${p.id}`}>
              <Card className="p-6 border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] bg-white group active:scale-[0.98] transition-all border border-slate-50">
                <div className="flex justify-between items-start mb-6">
                   <div className="h-12 w-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                      <Target className="h-6 w-6 text-indigo-500" />
                   </div>
                   <StatusBadge variant="success" className="h-5 px-2 text-[8px]">
                      {p.status}
                   </StatusBadge>
                </div>

                <h3 className="text-sm font-black text-slate-900 uppercase italic tracking-tight mb-4 group-hover:text-indigo-600 transition-colors">
                  {p.name}
                </h3>

                <div className="space-y-4">
                   {/* Progress Logic */}
                   <div className="space-y-2">
                      <div className="flex justify-between text-[8px] font-black uppercase text-slate-400">
                         <span>Tiến độ hoàn thành</span>
                         <span className="text-indigo-600">75%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                         <div className="h-full bg-indigo-500 rounded-full w-[75%] shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                      </div>
                   </div>

                   <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 text-slate-400">
                           <Calendar className="h-3 w-3" />
                           <span className="text-[9px] font-black uppercase tracking-wider">12/2026</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400">
                           <Layers className="h-3 w-3" />
                           <span className="text-[9px] font-black uppercase tracking-wider">04 Thang</span>
                        </div>
                      </div>
                      <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-slate-900 transition-colors">
                         <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-white transition-colors" />
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
