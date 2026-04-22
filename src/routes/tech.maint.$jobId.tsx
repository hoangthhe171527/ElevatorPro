import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  mockJobs, 
  getCustomer, 
  getElevator, 
  mockInventory, 
  formatVND,
  type Job 
} from "@/lib/mock-data";
import {
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  ChevronRight,
  Package,
  Wrench,
  Stethoscope,
  Check,
  ChevronLeft,
  Settings,
  ShieldCheck,
  Zap,
  Trash2
} from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/tech/maint/$jobId")({
  loader: ({ params }) => {
    const job = mockJobs.find((j) => j.id === params.jobId);
    if (!job) throw notFound();
    return { job };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `Bảo trì - ${loaderData?.job.code}` }],
  }),
  component: MaintenanceWizardContainer,
});

function MaintenanceWizardContainer() {
  const { job } = Route.useLoaderData();
  return <MaintenanceWizard job={job} />;
}

export function MaintenanceWizard({ job }: { job: Job }) {
  const navigate = useNavigate();
  const elev = job.elevatorId ? getElevator(job.elevatorId) : undefined;

  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [steps, setSteps] = useState<NonNullable<Job['maintenanceSteps']>>(job.maintenanceSteps || [
    { id: "step-1", label: "Kiểm tra sơ bộ", description: "Kiểm tra tổng quát vận hành, tiếng động lạ, rung lắc.", result: "pending", resolved: false },
    { id: "step-2", label: "Kiểm tra phòng máy", description: "Kiểm tra động cơ, tủ điều khiển, phanh và cáp tải.", result: "pending", resolved: false },
    { id: "step-3", label: "Kiểm tra Cabin", description: "Bảng điều khiển, nút bấm, đèn chiếu sáng, quạt thông gió.", result: "pending", resolved: false },
    { id: "step-4", label: "An toàn & Vệ sinh", description: "Cảm biến cửa, cứu hộ tự động, vệ sinh rãnh dẫn hướng.", result: "pending", resolved: false },
  ]);

  const [usedParts, setUsedParts] = useState<{ id: string; qty: number }[]>([]);
  const [selectedPartId, setSelectedPartId] = useState("");
  const [jobStatus, setJobStatus] = useState(job.status);

  const progress = (steps.filter(s => s.resolved).length / steps.length) * 100;
  const currentStep = steps[currentStepIdx];
  const allResolved = steps.every(s => s.resolved);

  const handleStepResult = (result: 'ok' | 'repair' | 'replace') => {
    const newSteps = [...steps];
    newSteps[currentStepIdx] = { 
      ...newSteps[currentStepIdx], 
      result, 
      resolved: result !== 'replace'
    };
    setSteps(newSteps);

    if (result === 'ok') {
      toast.success(`${newSteps[currentStepIdx].label}: Hoạt động tốt`);
      if (currentStepIdx < steps.length - 1) {
        setTimeout(() => setCurrentStepIdx(currentStepIdx + 1), 400);
      }
    } else if (result === 'repair') {
      toast.warning(`${newSteps[currentStepIdx].label}: Đã xử lý sửa chữa`);
      if (currentStepIdx < steps.length - 1) {
        setTimeout(() => setCurrentStepIdx(currentStepIdx + 1), 600);
      }
    }
  };

  const handleFinish = () => {
    toast.success("Đã hoàn thành toàn bộ quy trình bảo trì!");
    
    // B5: Thông báo kế toán sau bảo trì
    setTimeout(() => {
      toast.info("📋 Hệ thống đã gửi thông báo đến Kế toán để liên hệ khách hàng nhắc thanh toán.", { duration: 5000 });
    }, 1200);
    
    if (usedParts.length > 0) {
      const totalPartsValue = usedParts.reduce((sum, up) => {
        const part = mockInventory.find(i => i.id === up.id);
        return sum + (part?.unitPrice || 0) * up.qty;
      }, 0);
      setTimeout(() => {
        toast.info(`💰 Giá trị vật tư thay thế: ${formatVND(totalPartsValue)} — đã cập nhật vào giá trị hợp đồng bảo trì.`, { duration: 5000 });
      }, 2400);
    }
    
    navigate({ to: "/tech/jobs", search: { tab: 'maintenance' } });
  };

  return (
    <AppShell className="bg-muted/10">
      <div className="max-w-2xl mx-auto pb-24">
        {/* Header Section */}
        <div className="mb-6 p-4">
          <Link to="/tech/jobs" search={{ tab: 'maintenance' }} className="flex items-center gap-1 text-sm text-muted-foreground hover/text-foreground mb-4 w-fit">
            <ArrowLeft className="h-4 w-4" /> Quay lại
          </Link>
          
          <div className="flex justify-between items-end mb-2">
            <div>
              <h1 className="text-2xl font-black tracking-tight uppercase">{job.code}</h1>
              <p className="text-muted-foreground text-sm">Bảo trì định kỳ: {elev?.model} - {elev?.building}</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-primary uppercase">Tiến độ</span>
              <div className="text-xl font-black text-primary">{Math.round(progress)}%</div>
            </div>
          </div>
          <Progress value={progress} className="h-2 bg-muted shadow-inner" />
        </div>

        {/* STEPPER NAVIGATION */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 px-4 no-scrollbar">
          {steps.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentStepIdx(idx)}
              className={`
                shrink-0 h-10 px-4 rounded-xl text-xs font-bold transition-all border flex items-center gap-2
                ${idx === currentStepIdx 
                  ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-105" 
                  : s.resolved 
                    ? "bg-success/10 text-success border-success/20" 
                    : "bg-background text-muted-foreground border-muted hover/border-primary/50"}
              `}
            >
              {s.resolved ? <CheckCircle2 className="h-4 w-4" /> : <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[10px]">{idx + 1}</span>}
              <span className="truncate max-w-[100px]">{s.label}</span>
            </button>
          ))}
        </div>

        {/* MAIN INTERACTION CARD */}
        <Card className="overflow-hidden border-none shadow-xl rounded-3xl group mx-4">
          <div className="p-8">
            <div className={`
              w-16 h-16 rounded-2xl mb-6 flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 duration-500
              ${currentStepIdx === 0 ? "bg-blue-500 text-white shadow-blue-500/30" : 
                currentStepIdx === 1 ? "bg-orange-500 text-white shadow-orange-500/30" :
                currentStepIdx === 2 ? "bg-purple-500 text-white shadow-purple-500/30" : "bg-emerald-500 text-white shadow-emerald-500/30"}
            `}>
              {currentStepIdx === 0 && <Stethoscope className="h-8 w-8" />}
              {currentStepIdx === 1 && <Settings className="h-8 w-8" />}
              {currentStepIdx === 2 && <ShieldCheck className="h-8 w-8" />}
              {currentStepIdx === 3 && <Zap className="h-8 w-8" />}
            </div>

            <div className="mb-8">
              <h2 className="text-3xl font-black mb-2 leading-tight">{currentStepIdx + 1}. {currentStep.label}</h2>
              <p className="text-muted-foreground leading-relaxed">{currentStep.description}</p>
            </div>

            {/* ACTION BUTTONS */}
            {!currentStep.resolved ? (
              <div className="grid gap-4">
                <Button 
                  size="lg" 
                  className="h-20 rounded-2xl bg-success hover/bg-success/90 text-xl font-black shadow-xl shadow-success/20 border-b-4 border-success-foreground/20 active:translate-y-1 transition-all"
                  onClick={() => handleStepResult('ok')}
                >
                  <Check className="h-8 w-8 mr-3 stroke-[4]" /> HOẠT ĐỘNG TỐT
                </Button>

                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="h-20 rounded-2xl border-2 border-warning text-warning hover/bg-warning/5 font-black text-lg active:translate-y-1 transition-all"
                    onClick={() => handleStepResult('repair')}
                  >
                    <Wrench className="h-6 w-6 mr-2" /> SỬA CHỮA
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="h-20 rounded-2xl border-2 border-destructive text-destructive hover/bg-destructive/5 font-black text-lg active:translate-y-1 transition-all hover/text-destructive"
                    onClick={() => handleStepResult('replace')}
                  >
                    <Package className="h-6 w-6 mr-2" /> THAY THẾ
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-success/5 border border-success/20 rounded-2xl p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-success text-white rounded-full flex items-center justify-center mb-3">
                   <Check className="h-7 w-7 stroke-[3]" />
                </div>
                <h3 className="font-bold text-success text-lg mb-1 uppercase tracking-wider">Đã kiểm tra xong</h3>
                <p className="text-sm text-success/70 font-medium">Kết quả: {currentStep.result === 'ok' ? 'Bình thường' : currentStep.result === 'repair' ? 'Đã sửa chữa' : 'Đã thay vật tư'}</p>
                
                <Button 
                  variant="ghost" 
                  className="mt-4 text-xs font-bold text-muted-foreground hover/text-destructive"
                  onClick={() => {
                    const newSteps = [...steps];
                    newSteps[currentStepIdx].resolved = false;
                    newSteps[currentStepIdx].result = 'pending';
                    setSteps(newSteps);
                  }}
                >
                  Thiết lập lại bước này
                </Button>
              </div>
            )}

            {/* PART SELECTOR FOR REPLACE */}
            {currentStep.result === 'replace' && !currentStep.resolved && (
              <div className="mt-8 pt-8 border-t space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-2 text-destructive">
                   <AlertTriangle className="h-5 w-5" />
                   <h4 className="font-black text-lg uppercase tracking-tight">Chọn vật tư thay thế</h4>
                </div>

                <div className="space-y-4">
                  <Select value={selectedPartId} onValueChange={setSelectedPartId}>
                    <SelectTrigger className="h-14 rounded-xl border-2 border-muted hover/border-primary transition-colors bg-background text-lg font-bold">
                       <SelectValue placeholder="-- Danh sách vật tư trong kho --" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockInventory.map(item => (
                        <SelectItem key={item.id} value={item.id} className="h-12 font-medium">
                          {item.name} ({item.stock} {item.unit}) • {formatVND(item.unitPrice)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button 
                    className="w-full h-14 rounded-xl text-lg font-black bg-destructive hover/bg-destructive/90 shadow-lg shadow-destructive/20 border-b-4 border-destructive-foreground/20"
                    onClick={() => {
                      if (!selectedPartId) {
                        toast.error("Vui lòng chọn vật tư cụ thể!");
                        return;
                      }
                      const part = mockInventory.find(i => i.id === selectedPartId);
                      if (part && part.stock <= 0) {
                        toast.error("Vật tư hết hàng! Đã gửi yêu cầu cấp hàng chờ CEO duyệt.");
                        setJobStatus("waiting_for_materials");
                      } else {
                        setUsedParts([...usedParts, { id: selectedPartId, qty: 1 }]);
                        const newSteps = [...steps];
                        newSteps[currentStepIdx].resolved = true;
                        setSteps(newSteps);
                        toast.success("Đã ghi nhận vật tư và hoàn tất bước này.");
                        if (currentStepIdx < steps.length - 1) {
                          setTimeout(() => setCurrentStepIdx(currentStepIdx + 1), 600);
                        }
                      }
                    }}
                  >
                    XÁC NHẬN VÀ TIẾP TỤC
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="bg-muted/30 p-4 border-t flex justify-between items-center px-8">
             <Button 
               variant="ghost" 
               size="sm" 
               disabled={currentStepIdx === 0}
               onClick={() => setCurrentStepIdx(currentStepIdx - 1)}
               className="font-bold text-xs"
             >
               <ChevronLeft className="h-4 w-4 mr-1" /> TRƯỚC ĐÓ
             </Button>

             <div className="flex gap-1.5">
                {steps.map((_, i) => (
                  <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === currentStepIdx ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/30"}`} />
                ))}
             </div>

             <Button 
               variant="ghost" 
               size="sm" 
               disabled={currentStepIdx === steps.length - 1}
               onClick={() => setCurrentStepIdx(currentStepIdx + 1)}
               className="font-bold text-xs"
             >
               TIẾP THEO <ChevronRight className="h-4 w-4 ml-1" />
             </Button>
          </div>
        </Card>

        {/* USED PARTS SUMMARY */}
        {usedParts.length > 0 && (
          <Card className="mt-6 p-6 border-none shadow-lg rounded-3xl bg-background/50 backdrop-blur-md mx-4">
            <h3 className="font-black text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" /> Vật tư đã chốt sử dụng
            </h3>
            <div className="space-y-3">
              {usedParts.map((up, idx) => {
                const part = mockInventory.find(i => i.id === up.id);
                return (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-background border shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="font-bold text-sm tracking-tight">{part?.name}</div>
                        <div className="text-[10px] text-muted-foreground uppercase">{part?.code} • {formatVND(part?.unitPrice || 0)}</div>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-destructive hover/bg-destructive/10"
                      onClick={() => setUsedParts(usedParts.filter((_, i) => i !== idx))}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* BOTTOM COMPLETION BAR */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-lg border-t z-50">
           <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1.5 px-1">
                   <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Tiến độ quy trình</span>
                   <span className="text-[10px] font-black text-primary uppercase">{steps.filter(s => s.resolved).length}/4 CÔNG VIỆC</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
              <Button 
                disabled={!allResolved}
                className="h-14 px-8 rounded-2xl font-black text-lg bg-primary hover/bg-primary/90 shadow-xl shadow-primary/20 active:translate-y-1 transition-all disabled:opacity-50"
                onClick={handleFinish}
              >
                HOÀN TẤT VÀ LƯU <ChevronRight className="h-6 w-6 ml-2" />
              </Button>
           </div>
        </div>
      </div>
    </AppShell>
  );
}
