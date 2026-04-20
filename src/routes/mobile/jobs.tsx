import { createFileRoute, Link } from "@tanstack/react-router";
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
      <div className="bg-white sticky top-0 z-20 pb-2">
        <div className="px-4 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setFilter("all")}
            className={cn(
              "whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all",
              filter === "all" 
                ? "bg-primary text-white shadow-md shadow-primary/20 scale-105" 
                : "bg-slate-100 text-slate-500"
            )}
          >
            Tất cả
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={cn(
              "whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all",
              filter === "pending" 
                ? "bg-primary text-white shadow-md shadow-primary/20 scale-105" 
                : "bg-slate-100 text-slate-500"
            )}
          >
            Đang chờ
          </button>
          <button
            onClick={() => setFilter("doing")}
            className={cn(
              "whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all",
              filter === "doing" 
                ? "bg-primary text-white shadow-md shadow-primary/20 scale-105" 
                : "bg-slate-100 text-slate-500"
            )}
          >
            Đang làm
          </button>
          <button
            onClick={() => setFilter("done")}
            className={cn(
              "whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all",
              filter === "done" 
                ? "bg-primary text-white shadow-md shadow-primary/20 scale-105" 
                : "bg-slate-100 text-slate-500"
            )}
          >
            Đã xong
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => {
            const cus = getCustomer(job.customerId);
            return (
              <Card 
                key={job.id} 
                className={cn(
                  "p-5 shadow-xl shadow-slate-200/40 border-none relative overflow-hidden group active:scale-[0.98] transition-all rounded-3xl bg-white",
                  job.status === "in_progress" && "ring-2 ring-primary/5"
                )}
              >
                {/* Status Accent Line */}
                <div className={cn(
                  "absolute left-0 top-0 bottom-0 w-1.5",
                  job.status === "completed" ? "bg-emerald-500" : job.status === "in_progress" ? "bg-primary" : "bg-slate-200"
                )} />

                <div className="flex justify-between items-start mb-4">
                  <div className="flex flex-col gap-1.5 min-w-0 pr-4">
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 w-fit px-2 py-0.5 rounded-lg">
                      {job.code}
                    </span>
                    <h3 className="font-bold text-base text-slate-900 leading-tight">
                      {job.title}
                    </h3>
                  </div>
                  <StatusBadge variant={jobStatusVariant[job.status]} className="shrink-0 h-6">
                    {jobStatusLabel[job.status]}
                  </StatusBadge>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                      <MapPin className="h-5 w-5 text-slate-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-xs text-slate-800 truncate">{cus?.name}</p>
                      <p className="text-[10px] text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                        {cus?.address}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-slate-50/80 rounded-2xl border border-white">
                    <Clock className="h-4 w-4 text-slate-400 shrink-0" />
                    <span className="text-[11px] font-bold text-slate-600">
                      Thời gian: {job.scheduledFor}
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-3">
                  <Link to="/mobile/jobs/$jobId" params={{ jobId: job.id }} className="flex-1">
                    <Button
                      variant="outline"
                      className="w-full text-xs font-bold h-11 rounded-2xl border-slate-200 hover:bg-slate-50 text-slate-700"
                    >
                      XEM CHI TIẾT
                    </Button>
                  </Link>
                  
                  <Button
                    variant="outline"
                    className="h-11 w-11 shrink-0 rounded-2xl bg-slate-50 border-slate-200 text-slate-600 active:bg-primary active:text-white transition-colors"
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                </div>

                {job.status !== "completed" && (
                  <Button
                    className={cn(
                      "w-full mt-3 h-12 rounded-2xl font-bold text-xs gap-3 shadow-lg transition-all active:scale-95",
                      job.status === "scheduled" ? "bg-primary shadow-primary/20" : "bg-emerald-500 shadow-emerald-500/20"
                    )}
                    onClick={() => handleStartJob(job.id)}
                  >
                    {job.status === "scheduled" ? (
                      <>
                        <Play className="h-4 w-4 fill-current" /> BẮT ĐẦU CÔNG VIỆC
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4" /> HOÀN TẤT BÁO CÁO
                      </>
                    )}
                  </Button>
                )}
              </Card>
            );
          })
        ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center px-10">
              <div className="h-24 w-24 rounded-full bg-slate-50 flex items-center justify-center mb-6">
                <Briefcase className="h-10 w-10 text-slate-200" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Chưa có công việc</h3>
              <p className="text-sm text-slate-400 leading-relaxed italic">
                Cổng điều hành hiện chưa phân bổ công việc nào trong danh mục này.
              </p>
            </div>
        )}
      </div>

      <ConfirmationDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Xác nhận tiến độ"
        description="Dữ liệu trạng thái công việc sẽ được cập nhật trực tiếp lên hệ thống quản lý trung tâm. Bạn có chắc chắn muốn thực hiện thay đổi này?"
        onConfirm={() => {
          toast.success("Trạng thái công việc đã được cập nhật!");
          setConfirmOpen(false);
        }}
      />
    </MobileShell>
  );
}

// Helper needed for empty state
import { Briefcase } from "lucide-react";
