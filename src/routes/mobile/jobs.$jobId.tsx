import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/layout/MobileShell";
import { mockJobs, getCustomer } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  jobStatusVariant,
  jobStatusLabel,
  priorityLabel,
  priorityVariant,
} from "@/lib/status-variants";
import {
  History,
  MapPin,
  CheckCircle2,
  Camera,
  ClipboardCheck,
  User,
  MessageSquare,
  AlertTriangle,
  Play,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";

export const Route = createFileRoute("/mobile/jobs/$jobId")({
  head: ({ params }) => ({ meta: [{ title: `Công việc ${params.jobId} — Mobile` }] }),
  component: JobDetailMobile,
});

function JobDetailMobile() {
  const { jobId } = Route.useParams();
  const job = mockJobs.find((j) => j.id === jobId);
  const [confirmComplete, setConfirmComplete] = useState(false);

  if (!job) return <div>Job not found</div>;

  const customer = getCustomer(job.customerId);

  const checklistItems = [
    { id: 1, label: "Kiểm tra hệ thống phanh an toàn", checked: true },
    { id: 2, label: "Vệ sinh ray dẫn hướng và cáp tải", checked: true },
    { id: 3, label: "Kiểm tra độ rơ của bạc đạn puly", checked: false },
    { id: 4, label: "Đo dòng điện động cơ khi tải tối đa", checked: false },
    { id: 5, label: "Kiểm tra hệ thống cứu hộ tự động (ARD)", checked: false },
  ];

  return (
    <MobileShell title="Chi tiết công việc" showBackButton>
      <div className="p-4 space-y-4">
        {/* Header Status Section */}
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase">
              {job.code}
            </span>
            <h2 className="text-lg font-bold mt-0.5 leading-tight">{job.title}</h2>
          </div>
          <StatusBadge variant={jobStatusVariant[job.status]}>
            {jobStatusLabel[job.status]}
          </StatusBadge>
        </div>

        {/* Action Bar */}
        <div className="flex gap-2">
          {job.status === "scheduled" && (
            <Button className="flex-1 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold gap-2">
              <Play className="h-4 w-4" /> BẮT ĐẦU NGAY
            </Button>
          )}
          {job.status === "in_progress" && (
            <Button
              className="flex-1 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold gap-2 shadow-lg mb-2"
              onClick={() => setConfirmComplete(true)}
            >
              <CheckCircle2 className="h-4 w-4" /> HOÀN TẤT VIỆC
            </Button>
          )}
          <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl shrink-0">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        {/* Location & Contact Info */}
        <Card className="p-4 border-none shadow-sm space-y-3">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
              <MapPin className="h-4 w-4 text-slate-500" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase">Địa điểm</p>
              <p className="text-sm font-bold">{customer?.address}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
              <User className="h-4 w-4 text-slate-500" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase">Khách hàng</p>
              <p className="text-sm font-bold">{customer?.name}</p>
            </div>
          </div>
        </Card>

        {/* Checklist Section */}
        <section>
          <h3 className="text-xs font-bold uppercase text-muted-foreground mb-3 px-1">
            Checklist kỹ thuật
          </h3>
          <Card className="p-4 border-none shadow-sm divide-y divide-slate-50">
            {checklistItems.map((item) => (
              <div key={item.id} className="py-3 flex items-start gap-3 first:pt-0 last:pb-0">
                <div
                  className={cn(
                    "h-5 w-5 rounded-md border-2 flex items-center justify-center mt-0.5 shrink-0 transition-colors",
                    item.checked
                      ? "bg-primary border-primary text-white"
                      : "bg-white border-slate-200",
                  )}
                >
                  {item.checked && <CheckCircle2 className="h-3.5 w-3.5" />}
                </div>
                <span
                  className={cn(
                    "text-xs font-medium",
                    item.checked ? "text-slate-500 line-through" : "text-slate-900",
                  )}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </Card>
        </section>

        {/* Documentation Section */}
        <section>
          <h3 className="text-xs font-bold uppercase text-muted-foreground mb-3 px-1">
            Hình ảnh & Hiện trường
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="aspect-video bg-slate-200 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-slate-300">
              <Camera className="h-6 w-6 text-slate-400" />
              <span className="text-[10px] font-bold text-slate-500 mt-2">ẢNH TRƯỚC</span>
            </div>
            <div className="aspect-video bg-slate-200 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-slate-300">
              <Camera className="h-6 w-6 text-slate-400" />
              <span className="text-[10px] font-bold text-slate-500 mt-2">ẢNH SAU</span>
            </div>
          </div>
        </section>

        {/* Comments/Notes */}
        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-xs font-bold uppercase text-muted-foreground">
              Ghi chú & Thảo luận
            </h3>
            <MessageSquare className="h-4 w-4 text-slate-400" />
          </div>
          <Card className="p-4 border-none shadow-sm space-y-4">
            <div className="flex gap-2">
              <div className="h-7 w-7 rounded-full bg-slate-200 shrink-0" />
              <div className="bg-slate-100 p-2.5 rounded-2xl rounded-tl-none flex-1">
                <p className="text-[11px] leading-relaxed">
                  Đã kiểm tra xong phần máy kéo, ổ bi hoạt động êm, không có tiếng động lạ.
                </p>
              </div>
            </div>
            <Button variant="ghost" className="w-full text-[11px] font-bold text-primary h-8">
              THÊM GHI CHÚ
            </Button>
          </Card>
        </section>
      </div>

      <ConfirmationDialog
        open={confirmComplete}
        onOpenChange={setConfirmComplete}
        title="Hoàn tất công việc?"
        description="Bạn có xác nhận là đã hoàn thành đầy đủ các hạng mục checklist và lưu trữ hình ảnh hiện trường không?"
        onConfirm={() => {
          toast.success("Báo cáo công việc đã được gửi thành công!");
          setConfirmComplete(false);
        }}
        variant="success"
      />
    </MobileShell>
  );
}
