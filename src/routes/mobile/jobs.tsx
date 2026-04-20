import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/layout/MobileShell";
import { mockJobs, getCustomer } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { jobStatusLabel, jobStatusVariant } from "@/lib/status-variants";
import { CheckCircle2, MapPin, Clock, ChevronRight, Filter, Phone, Play } from "lucide-react";
import { useState } from "react";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/mobile/jobs")({
  head: () => ({ meta: [{ title: "Công việc — Mobile" }] }),
  component: MobileJobs,
});

function MobileJobs() {
  const [filter, setFilter] = useState<string>("all");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  const filteredJobs = mockJobs.filter((job) => {
    if (filter === "all") return true;
    if (filter === "pending") return job.status === "scheduled";
    if (filter === "doing") return job.status === "in_progress";
    if (filter === "done") return job.status === "completed";
    return true;
  });

  const handleStartJob = (id: string) => {
    setSelectedJobId(id);
    setConfirmOpen(true);
  };

  return (
    <MobileShell title="Lộ trình công việc">
      <div className="px-4 py-3 flex gap-2 overflow-x-auto bg-slate-50 border-b scrollbar-hide">
        <Button
          variant={filter === "all" ? "secondary" : "outline"}
          size="sm"
          className={cn(
            "rounded-full text-[10px] font-bold h-7",
            filter === "all" ? "bg-primary text-white" : "bg-background border-slate-200",
          )}
          onClick={() => setFilter("all")}
        >
          Tất cả
        </Button>
        <Button
          variant={filter === "pending" ? "secondary" : "outline"}
          size="sm"
          className={cn(
            "rounded-full text-[10px] font-bold h-7",
            filter === "pending" ? "bg-primary text-white" : "bg-background border-slate-200",
          )}
          onClick={() => setFilter("pending")}
        >
          Đang chờ
        </Button>
        <Button
          variant={filter === "doing" ? "secondary" : "outline"}
          size="sm"
          className={cn(
            "rounded-full text-[10px] font-bold h-7",
            filter === "doing" ? "bg-primary text-white" : "bg-background border-slate-200",
          )}
          onClick={() => setFilter("doing")}
        >
          Đang làm
        </Button>
        <Button
          variant={filter === "done" ? "secondary" : "outline"}
          size="sm"
          className={cn(
            "rounded-full text-[10px] font-bold h-7",
            filter === "done" ? "bg-primary text-white" : "bg-background border-slate-200",
          )}
          onClick={() => setFilter("done")}
        >
          Xong
        </Button>
        <Button variant="ghost" size="sm" className="rounded-full h-7 w-7 p-0 ml-auto">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-4 space-y-4">
        {filteredJobs.map((job) => {
          const cus = getCustomer(job.customerId);
          return (
            <Card key={job.id} className="p-4 shadow-sm border-none bg-background">
              <div className="flex justify-between items-start mb-3">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">
                    {job.code}
                  </span>
                  <h3 className="font-bold text-sm">{job.title}</h3>
                </div>
                <StatusBadge variant={jobStatusVariant[job.status]}>
                  {jobStatusLabel[job.status]}
                </StatusBadge>
              </div>

              <div className="space-y-2 mt-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="flex items-start gap-2.5">
                  <MapPin className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <div className="font-bold text-xs truncate">{cus?.name}</div>
                    <div className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">
                      {cus?.address}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 pt-1 border-t border-slate-200/50 mt-1">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="text-[10px] font-medium text-muted-foreground">
                    Lên lịch: {job.scheduledFor}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                {job.status === "scheduled" && (
                  <Button
                    className="flex-1 gap-2 text-xs font-bold h-10 rounded-xl shadow-sm shadow-primary/20"
                    onClick={() => handleStartJob(job.id)}
                  >
                    <Play className="h-4 w-4 fill-current" /> BẮT ĐẦU LÀM
                  </Button>
                )}
                {job.status === "in_progress" && (
                  <Button
                    className="flex-1 gap-2 text-xs font-bold h-10 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white border-none shadow-sm shadow-emerald-500/20"
                    onClick={() => handleStartJob(job.id)}
                  >
                    <CheckCircle2 className="h-4 w-4" /> HOÀN TẤT
                  </Button>
                )}
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-10 w-10 shrink-0 rounded-xl bg-slate-100 text-slate-600 border-none"
                >
                  <Phone className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      <ConfirmationDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Xác nhận trạng thái"
        description="Bạn có chắc chắn muốn thay đổi trạng thái tiến độ cho công việc này không? Dữ liệu sẽ được đồng bộ ngay lập tức về trung tâm điều phối."
        onConfirm={() => {
          toast.success("Đã cập nhật trạng thái công việc!");
          setConfirmOpen(false);
        }}
      />
    </MobileShell>
  );
}
