import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/common/StatusBadge";;
import { Badge } from "@/components/ui/badge";
import {
  jobStatusLabel,
  jobStatusVariant,
  priorityLabel,
  priorityVariant,
} from "@/lib/status-variants";
import { mockJobs, formatDateTime, getCustomer, mockProjects } from "@/lib/mock-data";
import { useAppStore, useCurrentPermissions } from "@/lib/store";
import {
  TECH_INSTALLATION_PERMISSIONS,
  TECH_MAINTENANCE_PERMISSIONS,
  TECH_SURVEY_PERMISSIONS,
} from "@/lib/roles";
import {
  Briefcase,
  Search,
  Calendar,
  MapPin,
  Hammer,
  Clock,
  ChevronRight,
  Filter,
  ClipboardCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileTechJobsList({ search }: { search: { tab?: string } }) {
  const permissions = useCurrentPermissions();
  const isInstallTech = permissions.some((p) => TECH_INSTALLATION_PERMISSIONS.includes(p));
  const isMaintTech = permissions.some((p) => TECH_MAINTENANCE_PERMISSIONS.includes(p));
  const isSurveyTech = permissions.some((p) => TECH_SURVEY_PERMISSIONS.includes(p));
  const isCEO = permissions.includes("tech_manager");

  const tab =
    search.tab ||
    (isSurveyTech
      ? "inspection"
      : isInstallTech
        ? "install"
        : isMaintTech
          ? "maintenance"
          : "install");
  const userId = useAppStore((s) => s.userId);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const myJobs = useMemo(() => mockJobs.filter((j) => j.assignedTo === userId), [userId]);
  const myProjectIds = useMemo(
    () => Array.from(new Set(myJobs.map((j) => j.projectId).filter(Boolean))),
    [myJobs],
  );
  const myProjects = useMemo(
    () => mockProjects.filter((p) => myProjectIds.includes(p.id)),
    [myProjectIds],
  );

  const baseFiltered = useMemo(() => {
    return myJobs
      .filter((j) => {
        const m1 =
          !searchQuery ||
          j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          j.code.toLowerCase().includes(searchQuery.toLowerCase());
        const m2 = statusFilter === "all" || j.status === statusFilter;
        return m1 && m2;
      })
      .sort((a, b) => b.scheduledFor.localeCompare(a.scheduledFor));
  }, [myJobs, searchQuery, statusFilter]);

  const tabFiltered = useMemo(() => {
    if (tab === "install") return [];
    return baseFiltered.filter((j) => j.type === tab);
  }, [baseFiltered, tab]);

  const isIsolated = !!search.tab;
  const tabLabels: Record<string, string> = {
    maintenance: "Danh sách Bảo trì",
    warranty: "Danh sách Bảo hành",
    repair: "Danh sách Sửa chữa",
    inspection: "Danh sách Khảo sát",
    install: "Dự án Lắp đặt",
  };

  return (
    <AppShell
      secondaryNav={
        !isIsolated && (
          <div className="px-4 py-2 bg-white border-b overflow-x-auto hide-scrollbar">
            <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest">
              {(isInstallTech || isCEO) && (
                <Link
                  to="/app/tech/jobs"
                  search={{ tab: "install" } as any}
                  className={cn(
                    "pb-2 border-b-2 transition-all whitespace-nowrap",
                    tab === "install"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground",
                  )}
                >
                  Lắp đặt
                </Link>
              )}
              {(isSurveyTech || isCEO) && (
                <Link
                  to="/app/tech/jobs"
                  search={{ tab: "inspection" } as any}
                  className={cn(
                    "pb-2 border-b-2 transition-all whitespace-nowrap",
                    tab === "inspection"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground",
                  )}
                >
                  Khảo sát
                </Link>
              )}
              {(isMaintTech || isCEO) && (
                <Link
                  to="/app/tech/jobs"
                  search={{ tab: "maintenance" } as any}
                  className={cn(
                    "pb-2 border-b-2 transition-all whitespace-nowrap",
                    tab === "maintenance"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground",
                  )}
                >
                  Bảo trì
                </Link>
              )}
              {(isMaintTech || isCEO) && (
                <Link
                  to="/app/tech/jobs"
                  search={{ tab: "repair" } as any}
                  className={cn(
                    "pb-2 border-b-2 transition-all whitespace-nowrap",
                    tab === "repair"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground",
                  )}
                >
                  Sửa chữa
                </Link>
              )}
              {(isMaintTech || isCEO) && (
                <Link
                  to="/app/tech/jobs"
                  search={{ tab: "warranty" } as any}
                  className={cn(
                    "pb-2 border-b-2 transition-all whitespace-nowrap",
                    tab === "warranty"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground",
                  )}
                >
                  Bảo hành
                </Link>
              )}
            </div>
          </div>
        )
      }
    >
      <div className="p-4 space-y-4">
        {isIsolated && (
          <PageHeader
            title={tabLabels[tab] || "Danh sách Công việc"}
            description={`Theo dõi và báo cáo tiến độ thực hiện mảng ${(tabLabels[tab] || "Công việc").replace("Danh sách ", "")}`}
          />
        )}
        {/* Search & Filter Bar */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm công việc..."
              className="pl-9 h-11 bg-white border-slate-100 rounded-2xl shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            className="h-11 w-11 rounded-2xl bg-white border-slate-100 shadow-sm"
          >
            <Filter className="h-4 w-4 text-slate-400" />
          </Button>
        </div>

        {tab === "install" ? (
          <div className="space-y-4">
            {myProjects.map((project) => {
              const projectJobs = myJobs.filter(
                (j) => j.projectId === project.id && j.type === "install",
              );
              const completedCount = projectJobs.filter((j) => j.status === "completed").length;
              const totalCount = 8; // Installation usually has 8 stages
              const progress = Math.round((completedCount / totalCount) * 100);

              return (
                <Link
                  key={project.id}
                  to="/app/tech/projects/$projectId"
                  params={{ projectId: project.id }}
                  className="block"
                >
                  <Card className="p-5 rounded-[28px] border-none shadow-xl shadow-slate-900/5 hover:scale-[1.02] transition-all overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                      <Briefcase className="h-24 w-24 text-slate-900" />
                    </div>

                    <div className="flex justify-between items-start mb-4">
                      <Badge
                        variant="outline"
                        className="text-[10px] uppercase font-black tracking-widest border-primary/20 text-primary bg-primary/5 px-2 py-0.5"
                      >
                        Dự án
                      </Badge>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        #{project.id}
                      </div>
                    </div>

                    <h3 className="text-lg font-black text-slate-800 leading-tight mb-2">
                      {project.name}
                    </h3>

                    <div className="space-y-4 mt-6">
                      <div className="flex justify-between items-end">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          Tiến độ thi công
                        </span>
                        <span className="text-xs font-black text-primary">{progress}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-1000"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex -space-x-1">
                          {Array.from({ length: totalCount }).map((_, i) => (
                            <div
                              key={i}
                              className={cn(
                                "h-1.5 w-4 rounded-full mr-1",
                                i < completedCount ? "bg-success" : "bg-slate-200",
                              )}
                            />
                          ))}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                          {completedCount}/{totalCount} Giai đoạn{" "}
                          <ChevronRight className="h-3 w-3" />
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="space-y-3">
            {tabFiltered.map((job) => {
              const cus = getCustomer(job.customerId);
              return (
                <Link
                  key={job.id}
                  to={
                    (job.type === "inspection"
                      ? "/app/tech/survey/$jobId"
                      : "/app/tech/jobs/$jobId") as any
                  }
                  params={{ jobId: job.id } as any}
                  className="block"
                >
                  <Card className="p-4 rounded-[24px] border-none shadow-lg shadow-slate-900/5 items-center flex gap-4 hover:bg-slate-50 transition-colors">
                    <div
                      className={cn(
                        "h-12 w-12 rounded-2xl flex items-center justify-center shadow-inner shrink-0",
                        job.type === "inspection"
                          ? "bg-indigo-50 text-indigo-500"
                          : job.type === "maintenance"
                            ? "bg-blue-50 text-blue-500"
                            : "bg-amber-50 text-amber-500",
                      )}
                    >
                      {job.type === "inspection" ? (
                        <ClipboardCheck className="h-5 w-5" />
                      ) : (
                        <Clock className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                          ID: {job.code.split("-").pop()}
                        </span>
                        <StatusBadge
                          variant={jobStatusVariant[job.status]}
                          className="text-[8px] px-1.5 py-0 h-4"
                        >
                          {jobStatusLabel[job.status]}
                        </StatusBadge>
                      </div>
                      <h4 className="font-black text-sm text-slate-800 truncate">{job.title}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="flex items-center gap-1 text-[10px] font-medium text-slate-500">
                          <MapPin className="h-3 w-3" /> {cus?.name}
                        </div>
                        <div className="text-[10px] font-medium text-slate-400">
                          {job.scheduledFor.split("T")[0]}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-300" />
                  </Card>
                </Link>
              );
            })}
            {tabFiltered.length === 0 && (
              <div className="p-12 text-center">
                <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 opacity-50">
                  <Briefcase className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="font-bold text-slate-800 mb-1">Không có công việc</h3>
                <p className="text-xs text-slate-400">
                  Bạn hiện không có nhiệm vụ nào trong mục này.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
