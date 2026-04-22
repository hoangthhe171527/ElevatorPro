import { Link, Route } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataPagination } from "@/components/common/DataPagination";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Badge } from "@/components/ui/badge";
import {
  jobStatusLabel,
  jobStatusVariant,
  priorityLabel,
  priorityVariant,
} from "@/lib/status-variants";
import { mockJobs, formatDateTime, getCustomer, mockProjects, getUser, type Job } from "@/lib/mock-data";
import { useAppStore } from "@/lib/store";
import { toast } from "sonner";
import {
  Search,
  Calendar,
  MapPin,
  Hammer,
  ShieldCheck,
  Wrench,
  Activity,
  ChevronRight,
  User,
  Plus,
  Send,
} from "lucide-react";
import { DispatchJobModal } from "@/components/common/Modals";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 8;

export function WebJobsMonitor({ tab: routeTab }: { tab: string }) {
  const tab = routeTab || "install";
  const setQuickIncidentOpen = useAppStore(s => s.setQuickIncidentOpen);
  const [dispatchOpen, setDispatchOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const activeTenantId = useAppStore((s) => s.activeTenantId);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const allTenantJobs = useMemo(() => mockJobs.filter((j) => j.tenantId === activeTenantId), [activeTenantId]);
  const allProjects = useMemo(() => mockProjects.filter((p) => p.tenantId === activeTenantId), [activeTenantId]);

  const baseFiltered = useMemo(() => {
    return allTenantJobs.filter((j) => {
      const m1 = !search || j.title.toLowerCase().includes(search.toLowerCase()) || j.code.toLowerCase().includes(search.toLowerCase());
      const m2 = statusFilter === "all" || j.status === statusFilter;
      return m1 && m2;
    }).sort((a, b) => b.scheduledFor.localeCompare(a.scheduledFor));
  }, [allTenantJobs, search, statusFilter]);

  const tabFiltered = useMemo(() => {
    if (tab === 'install') return []; 
    return baseFiltered.filter(j => j.type === tab);
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
          <p className="text-sm text-muted-foreground">Không có dữ liệu công việc trong mục này.</p>
        </div>
      );
    }
    return (
      <div className="divide-y border-t">
        {jobs.map((j) => {
          const cus = getCustomer(j.customerId);
          const tech = getUser(j.assignedTo);
          const Icon = j.type === 'maintenance' ? Activity : j.type === 'warranty' ? ShieldCheck : j.type === 'install' ? Hammer : Wrench;
          return (
            <div key={j.id} className="p-4 hover:bg-muted/10 transition-colors group">
              <div className="flex items-center gap-4">
                <div className={`h-10 w-10 shrink-0 rounded-lg flex items-center justify-center ${
                  j.priority === 'urgent' ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'
                }`}>
                  <Icon className="h-5 w-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4 mb-1">
                    <div className="flex items-center gap-2 min-w-0">
                       <span className="text-[10px] font-mono font-bold text-muted-foreground tracking-tighter bg-muted px-1.5 py-0.5 rounded uppercase">
                        {j.code}
                       </span>
                       <span className="font-bold text-sm truncate">{j.title}</span>
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

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" /> 
                      {formatDateTime(j.scheduledFor)}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" /> 
                      <span className="font-medium text-foreground">{cus?.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-primary/5 px-2 py-0.5 rounded-full border border-primary/10">
                      <User className="h-3 w-3 text-primary" />
                      <span className="text-primary font-semibold text-[11px]">Thợ: {tech?.name || "Chưa giao"}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-primary" onClick={() => {
                    setSelectedJob(j);
                    setDispatchOpen(true);
                  }}>
                    <Send className="h-4 w-4" />
                  </Button>
                  <Link 
                    to="/admin/jobs/$jobId" 
                    params={{ jobId: j.id }}
                    search={{ tab: tab, readonly: "true" }}
                    className="p-2 hover:bg-muted rounded-full"
                  >
                     <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </Link>
                </div>
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
        title="Theo dõi công việc"
        description="CEO giám sát tiến độ thực hiện của các đội nhóm hiện trường"
        actions={
          <Button onClick={() => setQuickIncidentOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Tạo sự cố nhanh
          </Button>
        }
      />

      <Card className="overflow-hidden sm:border-solid sm:shadow-sm">
        <Tabs value={tab} className="w-full" onValueChange={(v) => {
          window.history.pushState(null, "", `?tab=${v}`);
          setPage(1);
        }}>
          <div className="border-b bg-muted/20 px-4 pt-4">
            <TabsList className="grid w-full grid-cols-4 h-12 bg-transparent gap-2 p-0">
              <TabsTrigger value="install" className="data-[state=active]:bg-background data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-orange-500 rounded-none h-full border-b-2 border-transparent font-bold">
                Lắp đặt
              </TabsTrigger>
              <TabsTrigger value="maintenance" className="data-[state=active]:bg-background data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none h-full border-b-2 border-transparent font-bold">
                Bảo trì
              </TabsTrigger>
              <TabsTrigger value="warranty" className="data-[state=active]:bg-background data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-green-600 rounded-none h-full border-b-2 border-transparent font-bold">
                Bảo hành
              </TabsTrigger>
              <TabsTrigger value="repair" className="data-[state=active]:bg-background data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-red-500 rounded-none h-full border-b-2 border-transparent font-bold">
                Sửa chữa
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 p-4 bg-background">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm mã việc, tiêu đề hoặc khách hàng..."
                className="pl-9 h-10 border-muted-foreground/20"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
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
                {allProjects.map(p => (
                  <Link 
                    key={p.id} 
                    to="/admin/projects/$projectId" 
                    params={{ projectId: p.id }}
                    search={{ readonly: "true" }}
                    className="block"
                  >
                    <Card className="p-4 hover:bg-muted/10 transition-all group border-l-4 border-l-orange-500 overflow-hidden flex items-center gap-4">
                       <div className="h-10 w-10 shrink-0 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-600">
                          <Hammer className="h-5 w-5" />
                       </div>
                       <div className="flex-1 min-w-0">
                         <div className="flex justify-between items-start">
                            <h4 className="font-bold text-sm truncate group-hover:text-primary transition-colors">{p.name}</h4>
                            <Badge variant="secondary" className="text-[10px] tracking-tight shrink-0">KỲ: {p.stage}</Badge>
                         </div>
                         <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-1">
                           <MapPin className="h-3 w-3" /> {p.address}
                         </div>
                         <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-tight text-orange-600 mt-2">
                            <span>Theo dõi 8 giai đoạn thi công</span>
                            <div className="flex gap-0.5">
                              {Array.from({ length: 8 }).map((_, i) => (
                                <div key={i} className={`h-1 w-2.5 rounded-full ${i === 1 ? 'bg-orange-500' : i < 1 ? 'bg-success' : 'bg-muted'}`} />
                              ))}
                            </div>
                          </div>
                       </div>
                       <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Card>
                  </Link>
                ))}
             </div>
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
      <DispatchJobModal 
        open={dispatchOpen} 
        onClose={() => {
          setDispatchOpen(false);
          setSelectedJob(null);
        }}
        job={selectedJob || allTenantJobs[0]}
        onDispatch={(jobId, userId) => {
          toast.success("Đã điều phối công việc thành công!");
          setDispatchOpen(false);
        }}
      />
    </AppShell>
  );
}
