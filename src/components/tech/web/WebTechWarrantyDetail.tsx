import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  mockJobs, 
  getCustomer, 
  getElevator, 
  getUser, 
  formatDateTime,
  MAINTENANCE_STEPS_TEMPLATE,
  type Job, 
  type JobStatus,
  type MaintenanceStep,
} from "@/lib/mock-data";
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Clock,
  User,
  History,
  ClipboardCheck,
  Camera,
  Info,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";

export function WebTechWarrantyDetail({ job, readonly = false }: { job: Job; readonly?: boolean }) {
  const customer = getCustomer(job.customerId);
  const elevator = job.elevatorId ? getElevator(job.elevatorId) : undefined;
  
  const [steps, setSteps] = useState<MaintenanceStep[]>((job.maintenanceSteps || MAINTENANCE_STEPS_TEMPLATE) as MaintenanceStep[]);
  const [status, setStatus] = useState<JobStatus>(job.status);
  const [photos, setPhotos] = useState<string[]>(job.afterPhotos || []);

  const toggleStep = (id: string) => {
    if (readonly || status === "completed") return;
    setSteps(prev => prev.map(s => s.id === id ? { ...s, resolved: !s.resolved, result: !s.resolved ? "ok" : "pending" } : s));
  };

  const handleComplete = () => {
    const allDone = steps.every(s => s.resolved);
    if (!allDone) {
      toast.error("Vui lòng hoàn thành tất cả các hạng mục kiểm tra bảo hành!");
      return;
    }
    if (photos.length === 0) {
      toast.error("Vui lòng chụp ảnh xác nhận đã kiểm tra!");
      return;
    }
    setStatus("completed");
    toast.success("Đã hoàn tất bảo trì bảo hành!");
  };

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto">
        <Link
          to="/admin/jobs"
          search={{ tab: "warranty" }}
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary mb-6 font-bold transition-all"
        >
          <ArrowLeft className="h-4 w-4" /> Quay lại danh sách Bảo hành
        </Link>

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-8">
           <div>
              <div className="flex items-center gap-3 mb-2">
                 <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none px-3 py-1 rounded-lg font-black text-[10px] uppercase tracking-widest">
                    Công việc Bảo hành
                 </Badge>
                 <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">Mã: {job.code}</span>
              </div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">{job.title}</h1>
              <p className="text-slate-500 font-medium mt-1 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" /> {customer?.address}
              </p>
           </div>
           
           <div className="flex items-center gap-3">
              {status !== "completed" && !readonly && (
                <Button 
                  onClick={handleComplete}
                  className="h-14 px-8 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-xl shadow-emerald-200 gap-3"
                >
                   <CheckCircle2 className="h-5 w-5" /> XÁC NHẬN HOÀN TẤT BẢO HÀNH
                </Button>
              )}
              {status === "completed" && (
                 <Badge className="h-14 px-8 bg-emerald-500 text-white font-black rounded-2xl border-none flex items-center gap-2">
                   <ShieldCheck className="h-5 w-5" /> ĐÃ XÁC NHẬN BẢO HÀNH
                 </Badge>
              )}
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 space-y-8">
              <Card className="rounded-[2.5rem] border-none shadow-xl shadow-slate-200/50 overflow-hidden">
                <CardHeader className="bg-slate-50 border-b p-8">
                   <CardTitle className="text-xl font-black flex items-center gap-3">
                      <ClipboardCheck className="h-6 w-6 text-primary" /> Danh mục kiểm tra bảo trì bảo hành
                   </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                   <div className="divide-y divide-slate-100">
                      {steps.map((step) => (
                        <div 
                          key={step.id} 
                          onClick={() => toggleStep(step.id)}
                          className={cn(
                            "p-6 flex items-start gap-4 cursor-pointer hover:bg-slate-50/80 transition-all",
                            step.resolved ? "bg-emerald-50/30" : ""
                          )}
                        >
                           <div className={cn(
                             "h-6 w-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 transition-all",
                             step.resolved ? "bg-emerald-500 border-emerald-500 text-white scale-110" : "border-slate-300 bg-white"
                           )}>
                              {step.resolved && <CheckCircle2 className="h-4 w-4" />}
                           </div>
                           <div className="flex-1 min-w-0">
                              <div className={cn(
                                "font-black text-lg",
                                step.resolved ? "text-emerald-900" : "text-slate-700"
                              )}>
                                 {step.label}
                              </div>
                              <p className="text-sm text-slate-500 font-medium">{step.description}</p>
                           </div>
                           <Badge variant="outline" className={cn(
                             "mt-1 font-black text-[10px] uppercase",
                             step.result === "ok" ? "text-emerald-600 bg-emerald-50 border-emerald-200" : "text-slate-400 border-slate-200"
                           )}>
                              {step.result === "ok" ? "ĐẠT" : "CHƯA KIỂM"}
                           </Badge>
                        </div>
                      ))}
                   </div>
                </CardContent>
              </Card>

              <Card className="rounded-[2.5rem] border-none shadow-xl shadow-slate-200/50 p-8">
                 <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-black flex items-center gap-3">
                       <Camera className="h-6 w-6 text-primary" /> Hình ảnh xác nhận ({photos.length})
                    </h3>
                    {status !== "completed" && (
                       <Button variant="outline" className="rounded-xl font-bold" onClick={() => setPhotos([...photos, "/placeholder.svg"])}>
                          <Plus className="h-4 w-4 mr-2" /> Thêm ảnh
                       </Button>
                    )}
                 </div>
                 <div className="grid grid-cols-3 gap-6">
                    {photos.map((p, i) => (
                       <div key={i} className="aspect-square bg-slate-100 rounded-[1.5rem] border-2 border-dashed border-slate-200 flex items-center justify-center">
                          <Camera className="h-8 w-8 text-slate-300" />
                       </div>
                    ))}
                    {photos.length === 0 && (
                       <div className="col-span-3 py-12 text-center border-2 border-dashed border-slate-100 rounded-[2rem] text-slate-400 font-bold italic">
                          Chụp ít nhất 1 ảnh hiện trường để hoàn tất
                       </div>
                    )}
                 </div>
              </Card>
           </div>

           <div className="space-y-6">
              <Card className="rounded-[2.5rem] border-none shadow-xl shadow-slate-200/40 p-8 bg-slate-900 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                   <ShieldCheck className="h-32 w-32" />
                </div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
                  <ShieldCheck className="h-3 w-3" /> Thông tin bảo hành
                </h4>
                <div className="space-y-6 relative z-10">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Thiết bị</div>
                    <div className="text-lg font-black text-primary">{elevator?.brand} - {elevator?.model}</div>
                    <div className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-widest">S/N: {elevator?.code}</div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 pt-4 border-t border-white/10">
                     <div className="flex items-center gap-3">
                        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 font-black">ACTIVE</Badge>
                        <span className="text-xs font-bold text-slate-300">Đến 24/12/2026</span>
                     </div>
                     <p className="text-[10px] text-slate-400 italic">Gói bảo hành: Gold Standard - Bao gồm vật tư tiêu hao.</p>
                  </div>
                </div>
              </Card>

              <Card className="rounded-[2.5rem] border-2 border-slate-100 p-8">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                   <Info className="h-3 w-3" /> Lưu ý đặc biệt
                 </h4>
                 <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100">
                    <p className="text-xs font-bold text-orange-800 leading-relaxed">
                       Khách hàng yêu cầu kiểm tra kỹ phần cảm biến cửa do có trẻ nhỏ hay nghịch. Vệ sinh kỹ rãnh cửa tầng 1.
                    </p>
                 </div>
              </Card>

              <Card className="rounded-[2.5rem] border-2 border-slate-100 p-8">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                   <History className="h-3 w-3" /> Lịch sử bảo hành
                 </h4>
                 <div className="space-y-6">
                    <div className="flex gap-4">
                       <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                       </div>
                       <div>
                          <div className="text-sm font-black">Bảo trì lần 1</div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase">15/03/2026</div>
                       </div>
                    </div>
                 </div>
              </Card>
           </div>
        </div>
      </div>
    </AppShell>
  );
}
