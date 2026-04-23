import { createFileRoute, Link, useLocation } from "@tanstack/react-router";
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
import { DataPagination } from "@/components/common/DataPagination";
import { RouteMap } from "@/components/common/RouteMap";
import { StatCard } from "@/components/common/StatCard";
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
  ShieldCheck,
  Wrench,
  Activity,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
} from "lucide-react";

export const Route = createFileRoute("/tech/jobs/")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      tab: (search.tab as string) || undefined,
    } as { tab?: string };
  },
  head: () => ({ meta: [{ title: "Công việc của tôi" }] }),
  component: TechJobsContainer,
});

function TechJobsContainer() {
  const search = Route.useSearch();
  return <TechJobs search={search} />;
}

const PAGE_SIZE = 6;

function useAppPrefix() {
  const { pathname } = useLocation();
  return pathname.startsWith("/app") ? "/app" : "";
}

export function TechJobs({ search }: { search: { tab?: string } }) {
  const permissions = useCurrentPermissions();
  const isInstallTech = permissions.some((p) => TECH_INSTALLATION_PERMISSIONS.includes(p));
  const isMaintTech = permissions.some((p) => TECH_MAINTENANCE_PERMISSIONS.includes(p));
  const isSurveyTech = permissions.some((p) => TECH_SURVEY_PERMISSIONS.includes(p));
  const isCEO =
    permissions.includes("tech_manager") ||
    permissions.includes("tech_manager") ||
    permissions.includes("tech_manager");

  // Determine initial tab based on role if not provided
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
  const prefix = useAppPrefix();
  const [page, setPage] = useState(1);
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

  // Base filtering by search and status
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

  // Tab specific filtering and pagination
  const tabFiltered = useMemo(() => {
    if (tab === "install") return []; // Installation uses projects instead of flat job list
    return baseFiltered.filter((j) => j.type === tab);
  }, [baseFiltered, tab]);

  const paged = useMemo(() => {
    return tabFiltered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  }, [tabFiltered, page]);

  const renderJobList = (jobs: typeof mockJobs) => {
    if (jobs.length === 0) {
      return (
        <div className="p-12 text-center">
          <div className="h-12 w-12 rounded-full bg-muted/20 flex items-center justify-center mx-auto mb-4">
            <Calendar className="h-6 w-6 text-muted-foreground/40" />
          </div>
          <p className="text-sm text-muted-foreground">Không có dữ liệu trong mục này.</p>
        </div>
      );
    }
    return (
      <div className="divide-y border-t">
        {jobs.map((j) => {
          const cus = getCustomer(j.customerId);
          const Icon =
            j.type === "inspection"
              ? ClipboardCheck
              : j.type === "maintenance"
                ? Activity
                : j.type === "warranty"
                  ? ShieldCheck
                  : j.type === "install"
                    ? Hammer
                    : Wrench;
          return (
            <div key={j.id} className="p-4 hover:bg-muted/20 transition-colors group">
              <div className="flex items-center gap-4">
                {/* Compact Icon */}
                <div
                  className={`h-10 w-10 shrink-0 rounded-lg flex items-center justify-center ${
                    j.priority === "urgent"
                      ? "bg-destructive/10 text-destructive"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                {/* Content Area */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4 mb-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-[10px] font-mono font-bold text-muted-foreground tracking-tighter bg-muted px-1.5 py-0.5 rounded uppercase">
                        {j.code}
                      </span>
                      <Link
                        to={
                          (j.type === "inspection"
                            ? `${prefix}/tech/survey/$jobId`
                            : j.type === "maintenance" ||
                                j.type === "warranty" ||
                                j.type === "repair"
                              ? `${prefix}/tech/maint/$jobId`
                              : `${prefix}/tech/jobs/$jobId`) as any
                        }
                        params={{ jobId: j.id } as any}
                        className="font-bold text-sm truncate hover:text-primary transition-colors"
                      >
                        {j.title}
                      </Link>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <StatusBadge variant={priorityVariant[j.priority]}>
                        {priorityLabel[j.priority]}
                      </StatusBadge>
                      <StatusBadge variant={jobStatusVariant[j.status]}>
                        {jobStatusLabel[j.status]}
                      </StatusBadge>
                    </div>
                  </div>

                  {/* Secondary info in a clean row */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" /> {formatDateTime(j.scheduledFor)}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" />
                      <span className="font-medium text-foreground">{cus?.name}</span>
                      <span className="opacity-70 truncate max-w-[200px]"> — {cus?.address}</span>
                    </div>
                  </div>
                </div>

                {/* Action Arrow */}
                <Link
                  to={
                    (j.type === "inspection"
                      ? `${prefix}/tech/survey/$jobId`
                      : j.type === "maintenance" || j.type === "warranty" || j.type === "repair"
                        ? `${prefix}/tech/maint/$jobId`
                        : `${prefix}/tech/jobs/$jobId`) as any
                  }
                  params={{ jobId: j.id } as any}
                  className="p-2 hover:bg-muted rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <AppShell>
      <PageHeader
        title="Công việc của tôi"
        description="Quản lý lịch trình và trạng thái các nhiệm vụ được giao"
      />

      <Card className="overflow-hidden border-none shadow-none sm:border-solid sm:shadow-sm">
        <Tabs
          value={tab}
          className="w-full"
          onValueChange={(v) => {
            window.history.pushState(null, "", `?tab=${v}`);
            setPage(1);
          }}
        >
          <div className="border-b bg-muted/20 px-4 pt-4">
            <TabsList className="grid w-full grid-cols-5 h-12 bg-transparent gap-2 p-0">
              {(isInstallTech || isCEO) && (
                <TabsTrigger
                  value="install"
                  className="data-[state=active]:bg-background data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-orange-500 rounded-none h-full border-b-2 border-transparent font-bold"
                >
                  Lắp đặt
                </TabsTrigger>
              )}
              {(isSurveyTech || isCEO) && (
                <TabsTrigger
                  value="inspection"
                  className="data-[state=active]:bg-background data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-indigo-500 rounded-none h-full border-b-2 border-transparent font-bold"
                >
                  Khảo sát
                </TabsTrigger>
              )}
              {(isMaintTech || isCEO) && (
                <TabsTrigger
                  value="maintenance"
                  className="data-[state=active]:bg-background data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none h-full border-b-2 border-transparent font-bold"
                >
                  Bảo trì
                </TabsTrigger>
              )}
              {(isMaintTech || isCEO) && (
                <TabsTrigger
                  value="warranty"
                  className="data-[state=active]:bg-background data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-green-600 rounded-none h-full border-b-2 border-transparent font-bold"
                >
                  Bảo hành
                </TabsTrigger>
              )}
              {(isMaintTech || isCEO) && (
                <TabsTrigger
                  value="repair"
                  className="data-[state=active]:bg-background data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-red-500 rounded-none h-full border-b-2 border-transparent font-bold"
                >
                  Sửa chữa
                </TabsTrigger>
              )}
            </TabsList>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 p-4 bg-background">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm dự án hoặc công việc..."
                className="pl-9 h-10 border-muted-foreground/20"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(v) => {
                setStatusFilter(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-44 h-10 border-muted-foreground/20">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                {Object.entries(jobStatusLabel).map(([k, v]) => (
                  <SelectItem key={k} value={k}>
                    {v}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <TabsContent value="install" className="mt-0">
            <div className="flex flex-col p-4 gap-3 border-t">
              {myProjects.map((p) => (
                <Link
                  key={p.id}
                  to={`${prefix}/tech/projects/$projectId` as any}
                  params={{ projectId: p.id } as any}
                >
                  <Card className="p-4 hover:bg-muted/20 transition-all group border-l-4 border-l-orange-500 overflow-hidden flex items-center gap-4">
                    <div className="h-10 w-10 shrink-0 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-600">
                      <Hammer className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-sm truncate group-hover:text-primary transition-colors">
                          {p.name}
                        </h4>
                        <Badge variant="secondary" className="text-[10px] tracking-tight shrink-0">
                          KỲ: {p.stage}
                        </Badge>
                      </div>
                      <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-1">
                        <MapPin className="h-3 w-3" /> {p.address}
                      </div>
                      <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-tight text-orange-600 mt-2">
                        <span>Chi tiết 8 giai đoạn</span>
                        <div className="flex gap-0.5">
                          {Array.from({ length: 8 }).map((_, i) => (
                            <div
                              key={i}
                              className={`h-1 w-2.5 rounded-full ${i === 1 ? "bg-orange-500" : i < 1 ? "bg-success" : "bg-muted"}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Card>
                </Link>
              ))}
              {myProjects.length === 0 && (
                <div className="p-12 text-center border-2 border-dashed rounded-xl">
                  <Hammer className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Không có dự án lắp đặt nào đang triển khai.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="inspection" className="mt-0">
            {renderJobList(paged)}
          </TabsContent>

          <TabsContent value="maintenance" className="mt-0">
            {renderJobList(paged)}
          </TabsContent>

          <TabsContent value="warranty" className="mt-0">
            {renderJobList(paged)}
          </TabsContent>

          <TabsContent value="repair" className="mt-0">
            {renderJobList(paged)}
          </TabsContent>
        </Tabs>

        <div className="p-4 bg-muted/5 border-t">
          <DataPagination
            page={page}
            pageSize={PAGE_SIZE}
            total={tabFiltered.length}
            onPageChange={setPage}
          />
        </div>
      </Card>
    </AppShell>
  );
}
