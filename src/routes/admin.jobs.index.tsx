// src/routes/admin.jobs.tsx  ← THAY THẾ FILE CŨ
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataPagination } from "@/components/common/DataPagination";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  jobStatusLabel,
  jobStatusVariant,
  priorityLabel,
  priorityVariant,
} from "@/lib/status-variants";
import { mockJobs, formatDateTime, getCustomer, getUser, type Job } from "@/lib/mock-data";
import { Plus, Search, Briefcase, Calendar, User, ArrowRight } from "lucide-react";
import { CreateJobModal, DispatchJobModal } from "@/components/common/Modals";

export const Route = createFileRoute("/admin/jobs/")({
  head: () => ({ meta: [{ title: "Công việc — ElevatorPro" }] }),
  component: JobsPage,
});

const PAGE_SIZE = 8;
const typeLabel: Record<string, string> = {
  install: "Lắp đặt",
  maintenance: "Bảo trì",
  repair: "Sửa chữa",
  inspection: "Khảo sát",
};

function JobsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [dispatchJob, setDispatchJob] = useState<Job | null>(null);

  // Mở modal
  const openDispatch = (job: Job, e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setDispatchJob(job);
  };

  // Xử lý logic dispatch (mô phỏng)
  const handleDispatch = (jobId: string, techId: string) => {
    const job = mockJobs.find((j) => j.id === jobId);
    if (job) {
      job.assignedTo = techId;
      job.status = "scheduled";
    }
    // force re-render bằng cách trigger state. Trong React Router, có thể gọi router.invalidate() hoặc set lại page.
    setPage((p) => p);
  };

  const filtered = mockJobs
    .filter((j) => {
      const cus = getCustomer(j.customerId);
      const m1 =
        !search ||
        j.code.toLowerCase().includes(search.toLowerCase()) ||
        j.title.toLowerCase().includes(search.toLowerCase()) ||
        cus?.name.toLowerCase().includes(search.toLowerCase());
      const m2 = statusFilter === "all" || j.status === statusFilter;
      const m3 = typeFilter === "all" || j.type === typeFilter;
      return m1 && m2 && m3;
    })
    .sort((a, b) => b.scheduledFor.localeCompare(a.scheduledFor));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <AppShell>
      <PageHeader
        title="Công việc"
        description="Lắp đặt, bảo trì, sửa chữa, khảo sát"
        actions={
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4 mr-1.5" /> Tạo công việc
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-4 mb-6">
        {Object.entries(jobStatusLabel)
          .slice(0, 4)
          .map(([k, v]) => (
            <Card
              key={k}
              className="p-4 cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => {
                setStatusFilter(k);
                setPage(1);
              }}
            >
              <div className="text-xs text-muted-foreground">{v}</div>
              <div className="mt-1 text-2xl font-bold">
                {mockJobs.filter((j) => j.status === k).length}
              </div>
            </Card>
          ))}
      </div>

      <Card className="overflow-hidden">
        <div className="flex flex-col sm:flex-row gap-3 p-4 border-b">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm công việc..."
              className="pl-9"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <Select
            value={typeFilter}
            onValueChange={(v) => {
              setTypeFilter(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Loại" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả loại</SelectItem>
              {Object.entries(typeLabel).map(([k, v]) => (
                <SelectItem key={k} value={k}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={statusFilter}
            onValueChange={(v) => {
              setStatusFilter(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue />
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

        <div className="divide-y">
          {paged.map((j) => {
            const cus = getCustomer(j.customerId);
            const tech = getUser(j.assignedTo);
            return (
              <Link
                key={j.id}
                to="/admin/jobs/$jobId"
                params={{ jobId: j.id }}
                className="block p-4 hover:bg-muted/30 transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono text-muted-foreground">{j.code}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                          {typeLabel[j.type]}
                        </span>
                        <StatusBadge variant={priorityVariant[j.priority]}>
                          {priorityLabel[j.priority]}
                        </StatusBadge>
                      </div>
                      <h3 className="mt-1 font-semibold truncate">{j.title}</h3>
                      <div className="mt-1 text-xs text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 items-center">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" /> {cus?.name}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> {formatDateTime(j.scheduledFor)}
                        </span>
                        {tech ? (
                          <span>KT: {tech.name}</span>
                        ) : (
                          <span className="text-warning-foreground font-semibold flex items-center gap-1">
                            Chưa phân công
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {!j.assignedTo && j.status === "pending" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs border-primary text-primary hover:bg-primary/10 gap-1"
                        onClick={(e) => openDispatch(j, e)}
                      >
                        Điều phối <ArrowRight className="h-3 w-3" />
                      </Button>
                    )}
                    <StatusBadge variant={jobStatusVariant[j.status]}>
                      {jobStatusLabel[j.status]}
                    </StatusBadge>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <DataPagination
          page={page}
          pageSize={PAGE_SIZE}
          total={filtered.length}
          onPageChange={setPage}
        />
      </Card>

      <CreateJobModal open={createOpen} onClose={() => setCreateOpen(false)} />
      <DispatchJobModal
        open={!!dispatchJob}
        onClose={() => setDispatchJob(null)}
        job={dispatchJob}
        onDispatch={handleDispatch}
      />
    </AppShell>
  );
}
