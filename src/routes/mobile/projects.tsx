import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/layout/MobileShell";
import { cn } from "@/lib/utils";
import { mockProjects, PROJECT_STAGE_LABELS } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Building, ChevronRight, HardHat } from "lucide-react";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/mobile/projects")({
  head: () => ({ meta: [{ title: "Dự án — Mobile" }] }),
  component: MobileProjects,
});

function MobileProjects() {
  const [search, setSearch] = useState("");

  const filtered = mockProjects.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <MobileShell title="Dự án lắp đặt">
      <div className="sticky top-0 bg-slate-50/80 backdrop-blur-sm z-20 px-4 py-3 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm tên hoặc mã dự án..."
            className="pl-9 bg-background border-none shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="p-4 space-y-4">
        {filtered.map((project, idx) => {
          const stageIdx = idx % 8; // mock progress
          const progress = ((stageIdx + 1) / 8) * 100;

          return (
            <Card
              key={project.id}
              className="p-4 shadow-sm border-none bg-background active:scale-[0.98] transition-transform"
            >
              <div className="flex gap-4">
                <div className="h-12 w-12 rounded-2xl bg-orange-100 flex items-center justify-center shrink-0">
                  <Building className="h-6 w-6 text-orange-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-sm leading-tight line-clamp-2">{project.name}</h3>
                    <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded uppercase">
                      {project.id}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-muted-foreground font-medium uppercase tracking-wider">
                        Tiến độ: {Math.round(progress)}%
                      </span>
                      <span className="text-orange-600 font-bold">
                        {PROJECT_STAGE_LABELS[project.stage]}
                      </span>
                    </div>
                    <Progress value={progress} className="h-1.5" />
                  </div>

                  <div className="mt-4 flex items-center justify-between pt-3 border-t">
                    <div className="flex -space-x-2">
                      {[1, 2].map((i) => (
                        <div
                          key={i}
                          className="h-6 w-6 rounded-full bg-slate-200 border-2 border-background flex items-center justify-center text-[8px] font-bold"
                        >
                          <HardHat className="h-3 w-3" />
                        </div>
                      ))}
                      <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-[8px] font-bold">
                        +1
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-[10px] font-bold text-primary gap-1 group"
                    >
                      CHI TIẾT{" "}
                      <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}

        {filtered.length === 0 && (
          <div className="py-20 text-center">
            <Building className="h-12 w-12 text-slate-200 mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">Không tìm thấy dự án nào</p>
          </div>
        )}
      </div>
    </MobileShell>
  );
}
