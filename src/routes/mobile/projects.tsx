import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/layout/MobileShell";
import { Card } from "@/components/ui/card";
import { mockProjects } from "@/lib/mock-data";
import { useAppStore } from "@/lib/store";
import { StatusBadge } from "@/components/common/StatusBadge";
import { 
  Target, 
  Calendar, 
  ChevronRight,
  Plus,
  Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/mobile/projects")({
  component: MobileProjectsList,
});

function MobileProjectsList() {
   const activeTenantId = useAppStore((s) => s.activeTenantId);
   const tenantProjects = mockProjects.filter((p) => p.tenantId === activeTenantId);

  return (
    <MobileShell title="Dự án">
      <div className="flex flex-col pb-24 bg-slate-50 min-h-screen">
        <div className="px-5 py-6 bg-slate-900 border-b border-indigo-500/10 mb-4 rounded-b-2xl shadow-lg">
           <div className="flex justify-between items-center">
              <div>
                <p className="text-[9px] font-bold uppercase text-indigo-400 tracking-widest mb-0.5">Tiến độ thi công</p>
                        <h1 className="text-xl font-bold text-white leading-none">{tenantProjects.length} Dự án</h1>
              </div>
              <Button className="h-9 w-9 rounded-xl bg-indigo-600 shadow-lg shadow-indigo-500/20 p-0 border border-indigo-400">
                 <Plus className="h-5 w-5 text-white" />
              </Button>
           </div>
        </div>
        <div className="px-4 space-y-3">
               {tenantProjects.map((p) => (
            <Link key={p.id} to={`/mobile/projects/${p.id}`}>
              <Card className="p-4 border border-slate-100 shadow-sm rounded-xl bg-white active:bg-slate-50 transition-colors">
                <div className="flex justify-between items-start mb-3">
                   <div className="h-10 w-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                      <Target className="h-5 w-5 text-indigo-600" />
                   </div>
                   <StatusBadge variant="success" className="h-4 px-1.5 text-[7px] font-bold uppercase">
                      {p.status}
                   </StatusBadge>
                </div>
                <h3 className="text-[13px] font-bold text-slate-900 mb-3 truncate leading-snug">{p.name}</h3>
                <div className="space-y-3">
                   <div className="space-y-1.5">
                      <div className="flex justify-between text-[8px] font-bold uppercase text-slate-400">
                         <span>Hệ thống ghi nhận</span>
                         <span className="text-indigo-600">75%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-50 rounded-full border border-slate-100 overflow-hidden">
                         <div className="h-full bg-indigo-500 w-[75%] rounded-full shadow-[0_0_8px_rgba(99,102,241,0.3)]" />
                      </div>
                   </div>
                   <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-slate-400">
                           <Calendar className="h-3 w-3" />
                           <span className="text-[9px] font-bold uppercase">12/26</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-400">
                           <Layers className="h-3 w-3" />
                           <span className="text-[9px] font-bold uppercase">04TH</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-[9px] font-bold text-indigo-600 uppercase tracking-wider">
                         Sổ dự án <ChevronRight className="h-3 w-3 ml-0.5" />
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
