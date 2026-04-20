import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/layout/MobileShell";
import { mockJobs, getCustomer, formatVND } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  jobStatusVariant,
  jobStatusLabel,
} from "@/lib/status-variants";
import {
  MapPin,
  CheckCircle2,
  Camera,
  ClipboardCheck,
  User,
  MessageSquare,
  Play,
  CheckCircle,
  Clock,
  PenTool,
  Info,
  ChevronRight,
  Package,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { useAppStore } from "@/lib/store";

export const Route = createFileRoute("/mobile/jobs/$jobId")({
  head: ({ params }) => ({ meta: [{ title: `Phiếu việc ${params.jobId}` }] }),
  component: JobDetailMobile,
});

function JobDetailMobile() {
  const { jobId } = Route.useParams();
  const job = mockJobs.find((j) => j.id === jobId);
  const activeJobId = useAppStore((s) => s.activeJobCheckIn);
  const setJobCheckIn = useAppStore((s) => s.setJobCheckIn);
  
  const [confirmComplete, setConfirmComplete] = useState(false);
  const [items, setItems] = useState([
    { id: 1, label: "Kiểm tra hệ thống phanh an toàn", checked: true },
    { id: 2, label: "Vệ sinh ray dẫn hướng và cáp tải", checked: true },
    { id: 3, label: "Kiểm tra độ rơ của bạc đạn puly", checked: false },
    { id: 4, label: "Đo dòng điện động cơ khi tải tối đa", checked: false },
    { id: 5, label: "Kiểm tra hệ thống cứu hộ tự động (ARD)", checked: false },
  ]);

  if (!job) return <div className="p-10 text-center font-black">CÔNG VIỆC KHÔNG TỒN TẠI</div>;

  const customer = getCustomer(job.customerId);
  const isCheckedIn = activeJobId === jobId;
  const allChecked = items.every(i => i.checked);

  const toggleItem = (id: number) => {
    if (!isCheckedIn) {
      toast.error("Vui lòng Check-in trước khi thực hiện công việc!");
      return;
    }
    setItems(prev => prev.map(i => i.id === id ? { ...i, checked: !i.checked } : i));
  };

  const handleCheckIn = () => {
    setJobCheckIn(jobId);
    toast.success("ĐÃ CHECK-IN THÀNH CÔNG", {
      description: "Vị trí & thời gian bắt đầu đã được ghi nhận vào hệ thống."
    });
  };

  const handleFinish = () => {
    if (!allChecked) {
      toast.error("Vui lòng hoàn thành toàn bộ Checklist trước khi kết thúc!");
      return;
    }
    setConfirmComplete(true);
  };

  return (
    <MobileShell title={job.code} showBackButton backLink="/mobile/jobs">
      <div className="flex flex-col pb-28">
        {/* Header Summary */}
        <div className="px-6 py-6 bg-white border-b border-slate-50">
           <div className="flex justify-between items-start mb-4">
              <div className="min-w-0 flex-1 pr-4">
                 <h2 className="text-xl font-black text-slate-900 tracking-tight leading-tight mb-2">
                   {job.title}
                 </h2>
                 <div className="flex items-center gap-2">
                    <StatusBadge variant={jobStatusVariant[job.status]}>
                      {jobStatusLabel[job.status]}
                    </StatusBadge>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{job.priority} priority</span>
                 </div>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                 <ClipboardCheck className="h-6 w-6" />
              </div>
           </div>

           {/* Execution Bar */}
           <div className="mt-6">
              {!isCheckedIn ? (
                <Button 
                  onClick={handleCheckIn}
                  className="w-full h-14 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black text-sm shadow-xl shadow-orange-500/20 gap-3 group"
                >
                  <Play className="h-5 w-5 fill-current" /> BẮT ĐẦU CÔNG VIỆC (CHECK-IN)
                </Button>
              ) : (
                <div className="flex gap-3">
                  <Button 
                    onClick={handleFinish}
                    className="flex-1 h-14 rounded-2xl bg-emerald-600 text-white font-black text-sm shadow-xl shadow-emerald-600/20 gap-3"
                  >
                    <CheckCircle2 className="h-5 w-5" /> HOÀN TẤT & KÝ TÊN
                  </Button>
                  <Button variant="outline" className="h-14 w-14 rounded-2xl bg-slate-50 border-slate-200">
                    <Info className="h-5 w-5 text-slate-400" />
                  </Button>
                </div>
              )}
           </div>
        </div>

        <div className="p-5 space-y-8">
          {/* Site Context Information */}
          <Card className="p-5 border-none shadow-sm bg-white rounded-[2rem]">
             <div className="space-y-5">
                <div className="flex items-start gap-4">
                   <div className="h-10 w-10 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                      <MapPin className="h-5 w-5" />
                   </div>
                   <div className="min-w-0">
                      <p className="text-[9px] font-black text-slate-400 uppercase">Vị trí hiện trường</p>
                      <p className="text-[11px] font-black text-slate-900 mt-0.5 line-clamp-1">{customer?.address}</p>
                   </div>
                </div>
                <div className="flex items-start gap-4">
                   <div className="h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                      <User className="h-5 w-5" />
                   </div>
                   <div className="min-w-0">
                      <p className="text-[9px] font-black text-slate-400 uppercase">Khách hàng / Đại diện</p>
                      <p className="text-[11px] font-black text-slate-900 mt-0.5 line-clamp-1">{customer?.name}</p>
                   </div>
                </div>
             </div>
          </Card>

          {/* Interactive Technical Checklist */}
          <section>
             <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                   <ClipboardCheck className="h-4 w-4" /> Danh mục kiểm tra kỹ thuật
                </h3>
                <span className="text-[9px] font-black text-primary uppercase">
                  {items.filter(i => i.checked).length}/{items.length} XONG
                </span>
             </div>
             <Card className={cn(
               "p-2 border-none shadow-sm rounded-[2rem] transition-opacity",
               !isCheckedIn && "opacity-50 pointer-events-none"
             )}>
                {items.map((item) => (
                  <button 
                    key={item.id} 
                    onClick={() => toggleItem(item.id)}
                    className="w-full flex items-center gap-4 p-4 active:bg-slate-50 rounded-2xl transition-all text-left"
                  >
                    <div className={cn(
                      "h-6 w-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-colors",
                      item.checked ? "bg-emerald-500 border-emerald-500 text-white" : "bg-white border-slate-100"
                    )}>
                      {item.checked && <CheckCircle className="h-4 w-4" />}
                    </div>
                    <span className={cn(
                      "text-xs font-bold leading-tight",
                      item.checked ? "text-slate-400 line-through" : "text-slate-900"
                    )}>{item.label}</span>
                  </button>
                ))}
             </Card>
          </section>

          {/* Field Media & Evidence */}
          <section>
             <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1 mb-4 flex items-center gap-2">
                <Camera className="h-4 w-4" /> Hình ảnh & Nghiệm thu
             </h3>
             <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-28 rounded-3xl border-dashed border-2 bg-slate-50 flex-col gap-2 p-0">
                   <Camera className="h-6 w-6 text-slate-300" />
                   <span className="text-[9px] font-black text-slate-400 uppercase">Ảnh trước việc</span>
                </Button>
                <Button variant="outline" className="h-28 rounded-3xl border-dashed border-2 bg-slate-50 flex-col gap-2 p-0">
                   <Camera className="h-6 w-6 text-slate-300" />
                   <span className="text-[9px] font-black text-slate-400 uppercase">Ảnh hoàn thành</span>
                </Button>
             </div>
          </section>

          {/* Technician Notes */}
          <section>
             <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Ghi chú hiện trường</h3>
                <MessageSquare className="h-3.5 w-3.5 text-slate-300" />
             </div>
             <Card className="p-4 border-none shadow-sm bg-white rounded-3xl">
                <div className="flex gap-3 mb-4">
                   <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center font-black text-[10px]">AD</div>
                   <div className="flex-1 bg-slate-50 p-3 rounded-2xl rounded-tl-none">
                      <p className="text-[10px] font-bold text-slate-600 leading-relaxed">
                        Phần máy kéo ổn định. Cần theo dõi thêm tiếng rung ở khu vực puly tầng 5 trong đợt bảo trì sau.
                      </p>
                   </div>
                </div>
                <Button variant="ghost" className="w-full text-[9px] font-black text-primary h-8 uppercase tracking-widest">
                   BỔ SUNG Ý KIẾN
                </Button>
             </Card>
          </section>

          {/* Quick Support / Links */}
          <div className="grid grid-cols-2 gap-3 pt-4">
             <Button variant="outline" className="h-14 rounded-2xl bg-white border-slate-100 gap-2 shadow-sm font-black text-[10px] uppercase">
                <Package className="h-4 w-4 text-slate-400" /> Yêu cầu vật tư
             </Button>
             <Button variant="outline" className="h-14 rounded-2xl bg-white border-slate-100 gap-2 shadow-sm font-black text-[10px] uppercase">
                <Clock className="h-4 w-4 text-slate-400" /> Gia hạn thêm
             </Button>
          </div>
        </div>
      </div>

      <ConfirmationDialog
        open={confirmComplete}
        onOpenChange={setConfirmComplete}
        title="Xác nhận & Ký tên"
        description="Vui lòng xác nhận mọi hạng mục đã được xử lý chuẩn kỹ thuật. Chữ ký của bạn sẽ được lưu đính kèm vào biên bản nghiệm thu."
        onConfirm={() => {
          setJobCheckIn(null);
          toast.success("BÁO CÁO ĐÃ ĐƯỢC GỬI!", {
            description: "Biên bản kỹ thuật số đã được gửi tới khách hàng & quản lý."
          });
          setConfirmComplete(false);
        }}
        variant="success"
      />
    </MobileShell>
  );
}
