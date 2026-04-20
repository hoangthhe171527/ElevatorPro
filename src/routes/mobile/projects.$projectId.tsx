import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/layout/MobileShell";
import { mockProjects, PROJECT_STAGE_LABELS } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Building2, TrendingUp, Zap } from "lucide-react";

export const Route = createFileRoute("/mobile/projects/$projectId")({
  head: ({ params }) => ({ meta: [{ title: `Dự án ${params.projectId} — Mobile` }] }),
  component: ProjectDetailMobile,
});

function ProjectDetailMobile() {
  const { projectId } = Route.useParams();
  const project = mockProjects.find((p) => p.id === projectId);
  if (!project) return <div className="p-8 text-center text-slate-400">Project not found</div>;
  return (
    <MobileShell title={project.name} showBackButton>
      <div className="flex flex-col pb-24">
        <div className="bg-primary pt-6 pb-12 px-6 relative overflow-hidden text-white">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mt-1 leading-tight">{project.name}</h2>
            <div className="flex items-center gap-2 text-white/70 text-xs mt-2 italic"><Building2 className="h-4 w-4" /> <span>{project.address}</span></div>
          </div>
        </div>
        <div className="p-6 -mt-8 relative z-20">
           <Card className="p-6 border-none shadow-2xl shadow-slate-200 bg-white rounded-[2.5rem] space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Giai đoạn hiện tại</p>
                   <h4 className="text-sm font-black text-indigo-600 uppercase italic">{PROJECT_STAGE_LABELS[project.stage]}</h4>
                </div>
                <div className="h-10 w-10 rounded-2xl bg-indigo-50 flex items-center justify-center"><Zap className="h-5 w-5 text-indigo-600" /></div>
              </div>
           </Card>
        </div>
      </div>
    </MobileShell>
  );
}
