import { Link, Route } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Input } from "@/components/ui/input";
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
import {
  mockJobs,
  formatDateTime,
  getCustomer,
  mockProjects,
  getUser,
  type Job,
} from "@/lib/mock-data";
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
  User,
  Plus,
  Send,
} from "lucide-react";
import { DispatchJobModal } from "@/components/common/Modals";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Mobile doesn't benefit from standard page sizes if scrolling. But we'll limit it for now.
const PAGE_SIZE = 15;

export function MobileJobsMonitor({ tab: routeTab }: { tab: string }) {
  const tab = routeTab || "install";
  const setQuickIncidentOpen = useAppStore((s) => s.setQuickIncidentOpen);
  const [dispatchOpen, setDispatchOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const activeTenantId = useAppStore((s) => s.activeTenantId);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const allTenantJobs = useMemo(
    () => mockJobs.filter((j) => j.tenantId === activeTenantId),
    [activeTenantId],
  );
  const allProjects = useMemo(
    () => mockProjects.filter((p) => p.tenantId === activeTenantId),
    [activeTenantId],
  );

  const baseFiltered = useMemo(() => {
    return allTenantJobs
      .filter((j) => {
        const m1 =
          !search ||
          j.title.toLowerCase().includes(search.toLowerCase()) ||
          j.code.toLowerCase().includes(search.toLowerCase());
        const m2 = statusFilter === "all" || j.status === statusFilter;
        return m1 && m2;
      })
      .sort((a, b) => b.scheduledFor.localeCompare(a.scheduledFor));
  }, [allTenantJobs, search, statusFilter]);

  const tabFiltered = useMemo(() => {
    if (tab === "install") return [];
    return baseFiltered.filter((j) => j.type === tab);
  }, [baseFiltered, tab]);

  // Just render all for Mobile view (could use infinite scroll later)
  const paged = useMemo(() => {
    return tabFiltered.slice(0, PAGE_SIZE);
  }, [tabFiltered]);

  const setTab = (v: string) => {
    window.history.pushState(null, "", `?tab=${v}`);
  };

  const renderJobList = (jobs: typeof mockJobs) => {
    if (jobs.length === 0) {
      return (
        <div className="py-20 text-center">
          <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-sm mx-auto mb-4">
            <Calendar className="h-6 w-6 text-slate-300" />
          </div>
          <p className="text-[13px] text-slate-400 font-medium">Trống. Không có nhiệm vụ nào.</p>
        </div>
      );
    }
    return (
      <div className="flex flex-col gap-3 pb-8">
        {jobs.map((j) => {
          const cus = getCustomer(j.customerId);
          const tech = getUser(j.assignedTo);
          const isUrgent = j.priority === "urgent";
          const Icon =
            j.type === "maintenance"
              ? Activity
              : j.type === "warranty"
                ? ShieldCheck
                : j.type === "install"
                  ? Hammer
                  : Wrench;

          return (
            <div
              key={j.id}
              className="block relative bg-white p-4 rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-slate-100"
            >
              <div className="absolute right-4 top-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-primary bg-primary/5 rounded-full"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedJob(j);
                    setDispatchOpen(true);
                  }}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              <Link
                to="/app/admin/jobs/$jobId"
                params={{ jobId: j.id }}
                search={{ tab: tab, readonly: "true" }}
              >
                <div className="flex items-start gap-4 pr-10">
                  <div
                    className={cn(
                      "h-10 w-10 shrink-0 rounded-2xl flex items-center justify-center shadow-sm",
                      isUrgent ? "bg-rose-50 text-rose-500" : "bg-primary/5 text-primary",
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span
                        className={cn(
                          "text-[9px] font-black tracking-widest px-1.5 py-0.5 rounded-full uppercase",
                          isUrgent ? "bg-rose-600 text-white" : "bg-slate-100 text-slate-500",
                        )}
                      >
                        {j.code.split("-")[1]}
                      </span>
                      <h4 className="font-bold text-[14px] truncate leading-tight text-slate-800">
                        {j.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className={cn(
                          "text-[9px] font-black uppercase px-2 py-0.5 rounded-full border",
                          isUrgent
                            ? "text-rose-600 border-rose-200 bg-rose-50"
                            : "text-slate-500 border-slate-200",
                        )}
                      >
                        {priorityLabel[j.priority]}
                      </span>
                      <span className="text-[9px] font-black uppercase text-blue-600 px-2 py-0.5 rounded-full border border-blue-200 bg-blue-50">
                        {jobStatusLabel[j.status]}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                        <DropdownIcon icon={Calendar} />
                        {formatDateTime(j.scheduledFor).split(",")[0]}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                        <DropdownIcon icon={MapPin} />
                        <span className="truncate">{cus?.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-primary bg-primary/5 w-fit px-2 py-0.5 rounded-lg border border-primary/10">
                        <User className="h-3 w-3" />
                        <span>{tech?.name || "Chưa giao cho thợ"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    );
  };

  const DropdownIcon = ({ icon: Icon }: any) => (
    <div className="w-4 flex justify-center">
      <Icon className="h-3 w-3 opacity-70" />
    </div>
  );

  return (
    <AppShell>
      <PageHeader
        title="Quản lý công việc"
        description="Theo dõi toàn bộ luồng vận hành hiện trường"
        actions={
          <Button
            size="sm"
            className="h-8 rounded-full px-3 text-[11px] uppercase font-black"
            onClick={() => setQuickIncidentOpen(true)}
          >
            <Plus className="mr-1 h-3 w-3" /> Nhanh
          </Button>
        }
      />

      {/* Modern App Search & Filter Row */}
      <div className="flex items-center gap-2 mb-4 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Tìm mã, tiêu đề..."
            className="pl-9 h-10 border-transparent bg-transparent shadow-none focus-visible:ring-0 text-xs font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-px h-6 bg-slate-100" />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[100px] h-10 border-none shadow-none text-xs font-bold text-slate-600 focus:ring-0">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            {Object.entries(jobStatusLabel).map(([k, v]) => (
              <SelectItem key={k} value={k}>
                {v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Floating Chips for Tabs */}
      <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-4 snap-x pb-1 -mx-4 px-4">
        {[
          { id: "install", label: "Lắp đặt" },
          { id: "maintenance", label: "Bảo trì" },
          { id: "warranty", label: "Bảo hành" },
          { id: "repair", label: "Sửa chữa" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest whitespace-nowrap snap-center transition-all",
              tab === t.id
                ? "bg-slate-800 text-white shadow-md transform scale-105"
                : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-2">
        {tab === "install" && (
          <div className="flex flex-col gap-3 pb-8">
            {allProjects.map((p) => (
              <Link
                key={p.id}
                to="/app/admin/projects/$projectId"
                params={{ projectId: p.id }}
                search={{ readonly: "true" }}
                className="block relative bg-white p-4 rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-slate-100"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 shrink-0 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20">
                    <Hammer className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-black text-sm text-slate-800 truncate">{p.name}</h4>
                      <Badge
                        variant="secondary"
                        className="text-[9px] tracking-tight shrink-0 px-1.5 bg-orange-100 text-orange-700"
                      >
                        KỲ {p.stage}
                      </Badge>
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5 mt-1 truncate">
                      <MapPin className="h-3 w-3 shrink-0" /> {p.address}
                    </div>
                    <div className="mt-3">
                      <div className="flex justify-between items-end mb-1.5">
                        <span className="text-[9px] font-black uppercase text-orange-600 tracking-widest">
                          Tiến độ thi công
                        </span>
                      </div>
                      <div className="flex gap-1">
                        {Array.from({ length: 8 }).map((_, i) => (
                          <div
                            key={i}
                            className={`h-1.5 flex-1 rounded-full ${i === 1 ? "bg-orange-500" : i < 1 ? "bg-orange-500/30" : "bg-slate-100"}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {tab === "maintenance" && renderJobList(paged)}
        {tab === "warranty" && renderJobList(paged)}
        {tab === "repair" && renderJobList(paged)}
      </div>

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
