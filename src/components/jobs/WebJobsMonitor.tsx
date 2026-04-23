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
import { mockJobs, formatDateTime, getCustomer, mockProjects, getUser, mockIssues, mockElevators, type Job, type IssueReport } from "@/lib/mock-data";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
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
  AlertTriangle,
  ClipboardCheck,
  QrCode,
  Phone,
  Building2,
} from "lucide-react";
import { DispatchJobModal } from "@/components/common/Modals";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 8;

export function WebJobsMonitor({ tab: routeTab, initialPriority, initialStatus }: { tab?: string; initialPriority?: string; initialStatus?: string }) {
  const tab = routeTab || "maintenance";
  const setQuickIncidentOpen = useAppStore(s => s.setQuickIncidentOpen);
  const activeTenantId = useAppStore((s) => s.activeTenantId);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(initialStatus || "all");
  const [priorityFilter, setPriorityFilter] = useState(initialPriority || "all");
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (key: string) => {
    setExpandedGroups(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const allTenantJobs = useMemo(() => mockJobs.filter((j) => j.tenantId === activeTenantId), [activeTenantId]);
  const allProjects = useMemo(() => mockProjects.filter((p) => p.tenantId === activeTenantId), [activeTenantId]);

  const baseFiltered = useMemo(() => {
    return allTenantJobs.filter((j) => {
      const m1 = !search || j.title.toLowerCase().includes(search.toLowerCase()) || j.code.toLowerCase().includes(search.toLowerCase());
      const m2 = statusFilter === "all" || j.status === statusFilter;
      const m3 = priorityFilter === "all" || j.priority === priorityFilter;
      return m1 && m2 && m3;
    }).sort((a, b) => {
      if (a.priority === 'urgent' && b.priority !== 'urgent') return -1;
      if (a.priority !== 'urgent' && b.priority === 'urgent') return 1;
      return a.scheduledFor.localeCompare(b.scheduledFor);
    });
  }, [allTenantJobs, search, statusFilter, priorityFilter]);

  const tabFiltered = useMemo(() => {
    if (tab === "pending") return baseFiltered.filter((j) => j.status === "pending" && j.type !== 'install');
    // For specific types
    if (tab === "install") return baseFiltered.filter(j => j.type === 'install');
    if (tab === "maintenance") return baseFiltered.filter(j => j.type === 'maintenance');
    if (tab === "warranty") return baseFiltered.filter(j => j.type === 'warranty');
    if (tab === "repair") return baseFiltered.filter(j => j.type === 'repair');
    if (tab === "inspection") return baseFiltered.filter(j => j.type === 'inspection');
    if (tab === "incident") return baseFiltered.filter(j => j.type === 'incident' || j.title.toLowerCase().includes('sự cố'));
    return [];
  }, [baseFiltered, tab]);

  const paged = useMemo(() => {
    return tabFiltered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  }, [tabFiltered, page]);

  const renderJobList = (jobs: typeof mockJobs, hideActions = false) => {
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

    const getTabColor = (type: string) => {
      switch (type) {
        case "pending": return "border-l-amber-500 bg-amber-50/30";
        case "install": return "border-l-orange-500 bg-orange-50/30";
        case "maintenance": return "border-l-blue-500 bg-blue-50/30";
        case "warranty": return "border-l-green-600 bg-green-50/30";
        case "repair": return "border-l-red-500 bg-red-50/30";
        case "inspection": return "border-l-indigo-500 bg-indigo-50/30";
        default: return "border-l-slate-300";
      }
    };

    const getIconColor = (type: string, priority: string) => {
      if (priority === 'urgent') return 'bg-destructive text-white shadow-lg shadow-destructive/20';
      switch (type) {
        case "maintenance": return "bg-blue-500 text-white shadow-lg shadow-blue-500/20";
        case "warranty": return "bg-green-600 text-white shadow-lg shadow-green-600/20";
        case "install": return "bg-orange-500 text-white shadow-lg shadow-orange-500/20";
        case "repair": return "bg-red-500 text-white shadow-lg shadow-red-500/20";
        case "inspection": return "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20";
        default: return "bg-primary text-white shadow-lg shadow-primary/20";
      }
    };

    return (
      <div className="divide-y border-t bg-slate-50/20">
        {jobs.map((j) => {
          const cus = getCustomer(j.customerId);
          const tech = getUser(j.assignedTo);
          const Icon = j.type === 'maintenance' ? Activity : j.type === 'warranty' ? ShieldCheck : j.type === 'install' ? Hammer : Wrench;
          const isUrgent = j.priority === 'urgent';
          
          return (
            <div key={j.id} className={cn(
              "p-4 border-l-4 transition-all group relative",
              isUrgent ? "border-l-destructive bg-destructive/[0.03]" : getTabColor(j.type)
            )}>
              <div className="flex items-center gap-4">
                <div className={cn(
                  "h-12 w-12 shrink-0 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300",
                  getIconColor(j.type, j.priority)
                )}>
                  <Icon className="h-6 w-6" />
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

  const renderGroupedJobs = (jobs: typeof mockJobs) => {
    if (jobs.length === 0) return renderJobList([]);

    const groups = jobs.reduce((acc, j) => {
      const key = j.projectId || j.customerId || "other";
      if (!acc[key]) acc[key] = [];
      acc[key].push(j);
      return acc;
    }, {} as Record<string, typeof mockJobs>);

    return (
      <div className="bg-slate-50/20">
        {Object.entries(groups).map(([key, groupJobs]) => {
          const project = allProjects.find(p => p.id === key);
          const customer = getCustomer(groupJobs[0].customerId);
          const groupTitle = project ? `Dự án: ${project.name}` : `Khách hàng: ${customer?.name || "Khác"}`;
          const address = project?.address || customer?.address || "";
          const isExpanded = !!expandedGroups[key] && tab !== 'pending';
          const canExpand = tab !== 'pending';

          return (
            <div key={key} className="p-3">
              <div className={cn(
                "bg-white border shadow-sm transition-all rounded-[2rem] overflow-hidden",
                isExpanded ? "border-primary/20 shadow-md" : "border-slate-100",
                canExpand && "hover:shadow-md"
              )}>
                <div 
                  className={cn(
                    "px-5 py-5 flex items-center justify-between group/header relative select-none",
                    canExpand ? "cursor-pointer" : "cursor-default"
                  )}
                  onClick={() => canExpand && toggleGroup(key)}
                >
                  <div className="flex items-center gap-5">
                    <div className={cn(
                      "h-12 w-12 rounded-2xl flex items-center justify-center shadow-inner border transition-colors",
                      isExpanded ? "bg-primary/5 text-primary border-primary/10" : "bg-slate-50 text-slate-600 border-slate-100"
                    )}>
                        <Building2 className="h-6 w-6" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm font-black uppercase tracking-tight text-slate-800">{groupTitle}</span>
                          <Badge variant="secondary" className="text-[9px] font-black px-1.5 h-4 bg-slate-100 text-slate-600">
                            {groupJobs.length} {tab === 'pending' ? 'VIỆC CHỜ' : 'GIAI ĐOẠN'}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {address}
                        </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-6 mr-4">
                       {tab === 'pending' && (
                          <div className="flex items-center gap-2 pr-2">
                             <Link 
                               to="/admin/projects/$projectId" 
                               params={{ projectId: key }}
                               className="text-[11px] font-black text-primary hover:underline px-3"
                               onClick={(e) => e.stopPropagation()}
                             >
                               XEM CHI TIẾT
                             </Link>
                          </div>
                       )}
                       {canExpand && (
                         <div className={cn("transition-transform duration-300", isExpanded ? "rotate-180" : "rotate-0")}>
                            <ChevronRight className="h-6 w-6 text-slate-400" />
                         </div>
                       )}
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-slate-50 bg-slate-50/20 animate-in fade-in slide-in-from-top-1 duration-200">
                     {renderJobList(groupJobs, tab === 'pending')}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const isIsolated = !!routeTab;
  const tabLabels: Record<string, string> = {
    maintenance: "Theo dõi Bảo trì",
    warranty: "Theo dõi Bảo hành",
    repair: "Theo dõi Sửa chữa",
    inspection: "Theo dõi Khảo sát",
    incident: "Sự cố QR & Hotline"
  };

  return (
    <AppShell>
      <PageHeader
        title={isIsolated ? (tabLabels[tab] || "Theo dõi Công việc") : "Tổng quan Công việc"}
        description={isIsolated ? `Giám sát tiến độ thực hiện mảng ${(tabLabels[tab] || "Công việc").replace('Theo dõi ', '')}` : "CEO giám sát tiến độ thực hiện của các đội nhóm hiện trường"}
        actions={
          <Button onClick={() => setQuickIncidentOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Tạo sự cố nhanh
          </Button>
        }
      />

      <Card className="overflow-hidden sm:border-solid sm:shadow-sm">
        <Tabs value={tab} className="w-full">
          {!isIsolated && (
          <div className="border-b bg-muted/20 px-4 pt-4">
            <TabsList className="grid w-full grid-cols-5 h-12 bg-transparent gap-2 p-0">
              <TabsTrigger value="maintenance" className="data-[state=active]:bg-background data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none h-full border-b-2 border-transparent font-bold text-[10px] uppercase">
                Bảo trì
              </TabsTrigger>
              <TabsTrigger value="warranty" className="data-[state=active]:bg-background data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-green-600 rounded-none h-full border-b-2 border-transparent font-bold text-[10px] uppercase">
                Bảo hành
              </TabsTrigger>
              <TabsTrigger value="repair" className="data-[state=active]:bg-background data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-red-500 rounded-none h-full border-b-2 border-transparent font-bold text-[10px] uppercase">
                Sửa chữa
              </TabsTrigger>
              <TabsTrigger value="inspection" className="data-[state=active]:bg-background data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-indigo-500 rounded-none h-full border-b-2 border-transparent font-bold text-[10px] uppercase">
                Khảo sát
              </TabsTrigger>
              <TabsTrigger value="incident" className="data-[state=active]:bg-background data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-rose-500 rounded-none h-full border-b-2 border-transparent font-bold text-[10px] uppercase relative">
                Sự cố QR
                {mockIssues.filter(i => i.status === 'open').length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-destructive text-white text-[9px] font-black rounded-full flex items-center justify-center animate-pulse">
                    {mockIssues.filter(i => i.status === 'open').length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
          </div>
          )}

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
              <SelectTrigger className="w-full sm:w-40 h-10 border-muted-foreground/20">
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

            <Select
              value={priorityFilter}
              onValueChange={(v) => {
                setPriorityFilter(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-40 h-10 border-muted-foreground/20">
                <SelectValue placeholder="Độ ưu tiên" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả độ ưu tiên</SelectItem>
                {Object.entries(priorityLabel).map(([k, v]) => (
                  <SelectItem key={k} value={k}>
                    {v}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <TabsContent value="pending" className="mt-0">
             {renderGroupedJobs(paged)}
          </TabsContent>
          
          <TabsContent value="install" className="mt-0">
             {renderGroupedJobs(paged)}
          </TabsContent>

          <TabsContent value="maintenance" className="mt-0">
             {renderGroupedJobs(paged)}
          </TabsContent>

          <TabsContent value="warranty" className="mt-0">
             {renderGroupedJobs(paged)}
          </TabsContent>

          <TabsContent value="repair" className="mt-0">
             {renderGroupedJobs(paged)}
          </TabsContent>

          <TabsContent value="inspection" className="mt-0">
             {renderGroupedJobs(paged)}
          </TabsContent>

          {/* B6: Sự cố từ QR — CEO Inbox */}
          <TabsContent value="incident" className="mt-0">
            <div className="divide-y border-t">
              {mockIssues.map((issue) => {
                const elev = mockElevators.find(e => e.id === issue.elevatorId);
                const cus = getCustomer(issue.customerId);
                const statusMap: Record<string, { label: string; color: string }> = {
                  open: { label: 'Chờ phân công', color: 'bg-destructive/10 text-destructive' },
                  scheduled: { label: 'Đã phân công', color: 'bg-blue-500/10 text-blue-600' },
                  resolved: { label: 'Đã xử lý', color: 'bg-success/10 text-success' },
                };
                const st = statusMap[issue.status] || statusMap.open;
                return (
                  <div key={issue.id} className="p-4 hover:bg-muted/10 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className={`h-10 w-10 shrink-0 rounded-lg flex items-center justify-center ${issue.status === 'open' ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
                        {issue.status === 'open' ? <AlertTriangle className="h-5 w-5" /> : <QrCode className="h-5 w-5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-4 mb-1">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-[10px] font-mono font-bold text-muted-foreground tracking-tighter bg-muted px-1.5 py-0.5 rounded uppercase">
                              {elev?.code || 'N/A'}
                            </span>
                            <span className="font-bold text-sm truncate">{issue.description}</span>
                          </div>
                          <Badge className={`text-[10px] ${st.color}`}>{st.label}</Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            {formatDateTime(issue.reportedAt)}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5" />
                            <span className="font-medium text-foreground">{cus?.name}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <QrCode className="h-3.5 w-3.5" />
                            <span className="text-primary font-semibold text-[11px]">Qua QR Code</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <Button variant="ghost" size="icon" className="h-8 w-8 text-primary">
                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                         </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
              {mockIssues.length === 0 && (
                <div className="p-12 text-center">
                  <QrCode className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground">Không có sự cố nào từ QR Code.</p>
                </div>
              )}
            </div>
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
