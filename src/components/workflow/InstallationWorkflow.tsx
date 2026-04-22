import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  PROJECT_STAGES, 
  PROJECT_STAGE_LABELS, 
  STRATEGIC_WORKFLOW, 
  ProjectStage,
  advanceProjectStage,
  STAGE_SUB_TASKS,
  INSTALL_STAGES_TEMPLATE
 } from "@/lib/mock-data";
import { 
  Check, 
  AlertTriangle, 
  Hammer, 
  Truck, 
  ClipboardCheck, 
  FileSignature, 
  Users,
  PackageSearch,
  Timer,
  AlertCircle,
  FileText,
  UserCheck,
  RefreshCw,
  Send,
  Mail
} from "lucide-react";
import { ApprovalGateCard } from "./ApprovalGateCard";
import { toast } from "sonner";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { useCurrentPermissions } from "@/lib/store";

interface InstallationWorkflowProps {
  projectId: string;
  currentStage: ProjectStage;
  tenantId: string;
  onStageChange: (newStage: ProjectStage) => void;
}

const STAGE_ICONS: Record<ProjectStage, any> = {
  lead: Users,
  contract: FileSignature,
  technical: ClipboardCheck,
  procurement: PackageSearch,
  warehouse: Truck,
  waiting_for_equipment: Timer,
  installation: Hammer,
  completion: Check,
  transition: RefreshCw,
};

export function InstallationWorkflow({ 
  projectId, 
  currentStage, 
  tenantId, 
  onStageChange 
}: InstallationWorkflowProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<"advance" | "bypass">("advance");
  const permissions = useCurrentPermissions();
  
  // Simulated task completion state (In local state for prototype)
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

  const currentStageIndex = PROJECT_STAGES.indexOf(currentStage);
  const workflow = STRATEGIC_WORKFLOW[tenantId] || STRATEGIC_WORKFLOW["t-2"];
   const currentGate = workflow[currentStage];
   
   const subTasks = useMemo(() => {
     if (tenantId === 't-2' && currentStage === 'installation') {
       return INSTALL_STAGES_TEMPLATE.map(s => ({
         id: s.id,
         label: s.label,
         requiredRole: 'field_tech' as any
       }));
     }
     return STAGE_SUB_TASKS[currentStage] || [];
   }, [tenantId, currentStage]);

  const isDirector = permissions.includes("director");
  const isAccounting = permissions.includes("accounting");
  const isSales = permissions.includes("sales");

  const allTasksDone = useMemo(() => {
    return subTasks.every(t => completedTasks.includes(t.id));
  }, [subTasks, completedTasks]);

  const handleAdvance = () => {
    const nextIdx = currentStageIndex + 1;
    if (nextIdx < PROJECT_STAGES.length) {
      const nextStage = PROJECT_STAGES[nextIdx];
      onStageChange(nextStage);
      setCompletedTasks([]); // Reset tasks for next stage
      toast.success(`Đã chuyển sang giai đoạn: ${PROJECT_STAGE_LABELS[nextStage]}`);
    } else {
      toast.success("Toàn bộ quy trình đã hoàn tất!");
    }
    setConfirmOpen(false);
  };

  const handleBypass = () => {
    toast.warning("Bạn đang sử dụng quyền 'Break Flow' để bỏ qua kiểm tra!");
    handleAdvance();
  };

  const toggleTask = (taskId: string) => {
    setCompletedTasks(prev => 
      prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]
    );
  };

  return (
    <div className="space-y-6">
      {/* Premium Stepper */}
      <Card className="border-none bg-muted/20 shadow-none">
        <CardContent className="pt-8 pb-10">
          <div className="relative max-w-5xl mx-auto px-4">
            {/* Background Track */}
            <div className="absolute top-7 left-0 w-full h-[2px] bg-muted -translate-y-1/2" />
            
            {/* Progress Track */}
            <div 
              className="absolute top-7 left-0 h-[2px] bg-primary -translate-y-1/2 transition-all duration-700"
              style={{ width: `${(currentStageIndex / (PROJECT_STAGES.length - 1)) * 100}%` }}
            />

            <div className="relative flex justify-between">
              {PROJECT_STAGES.map((stage, idx) => {
                const Icon = STAGE_ICONS[stage];
                const isPast = idx < currentStageIndex;
                const isCurrent = idx === currentStageIndex;
                const label = PROJECT_STAGE_LABELS[stage];

                return (
                  <div key={stage} className="flex flex-col items-center gap-3 w-12 sm:w-20">
                    <div 
                      className={`
                        z-10 flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm transition-all duration-500
                        ${isPast ? "bg-primary text-primary-foreground scale-90 opacity-80" : 
                          isCurrent ? "bg-background border-2 border-primary text-primary ring-4 ring-primary/10 scale-110 shadow-lg" : 
                          "bg-background border-2 border-muted text-muted-foreground opacity-50"}
                      `}
                    >
                      {isPast ? <Check className="h-6 w-6" /> : <Icon className="h-6 w-6" />}
                    </div>
                    <div className="text-center">
                        <div className={`text-[10px] font-bold uppercase tracking-tight leading-tight ${isCurrent ? "text-primary" : "text-muted-foreground"}`}>
                          GĐ {idx + 1}
                        </div>
                        <div className={`hidden sm:block text-[11px] font-medium mt-0.5 ${isCurrent ? "text-foreground font-bold" : "text-muted-foreground"}`}>
                          {label}
                        </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Dynamic Gate Management */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                Giai đoạn: <span className="text-primary font-bold">{PROJECT_STAGE_LABELS[currentStage]}</span>
              </h3>
              {currentGate.isFlexible && (
                <Badge variant="secondary" className="bg-blue-500/10 text-blue-700 border-blue-200">
                  Vận hành linh hoạt (t-2)
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={`${allTasksDone ? 'bg-success/10 text-success' : 'bg-blue-50'} animate-none`}>
                {allTasksDone ? 'Sẵn sàng duyệt' : 'Đang xử lý'}
              </Badge>
              
              {currentStage === "contract" && (
                <Button 
                  size="sm" 
                  variant="default" 
                  className="h-8 bg-blue-600 hover:bg-blue-700"
                  onClick={() => toast.success("Đã gửi bản thảo hợp đồng qua Zalo và Email cho khách!")}
                >
                  <Send className="h-3 w-3 mr-2" /> Gửi hợp đồng
                </Button>
              )}
            </div>
          </div>

          <div className="p-4 bg-muted/30 rounded-xl border border-dashed text-sm">
             <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Danh mục công việc (Checklist)</h4>
             <div className="space-y-2">
                {subTasks.map(task => {
                  const isDone = completedTasks.includes(task.id);
                  const hasPermission = permissions.includes(task.requiredRole);
                  
                  return (
                    <div key={task.id} className="flex items-center justify-between p-2 bg-background rounded-lg border shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-6 w-6 items-center justify-center rounded-full ${isDone ? 'bg-success text-white' : 'bg-muted text-muted-foreground'}`}>
                           {isDone ? <Check className="h-3 w-3" /> : <div className="h-1 w-1 bg-current rounded-full" />}
                        </div>
                        <div>
                          <p className={`font-medium ${isDone ? 'line-through text-muted-foreground' : ''}`}>{task.label}</p>
                          <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-tighter">Phụ trách: {task.requiredRole}</p>
                        </div>
                      </div>
                      {hasPermission && (
                        <Button 
                          size="sm" 
                          variant={isDone ? "ghost" : "outline"} 
                          className="h-7 text-[10px]"
                          onClick={() => toggleTask(task.id)}
                        >
                          {isDone ? "Hoàn tác" : "Xác nhận"}
                        </Button>
                      )}
                      {!hasPermission && isDone && (
                        <Badge variant="outline" className="h-7 text-[9px] bg-success/5 text-success border-success/20">
                          Đã xong
                        </Badge>
                      )}
                    </div>
                  );
                })}
             </div>
          </div>

          <ApprovalGateCard 
            gate={currentGate}
            isCurrent={true}
            isPast={false}
            tenantId={tenantId}
            onAdvance={() => {
              if (!allTasksDone) {
                toast.error("Vui lòng hoàn tất danh mục công việc trước khi duyệt!");
                return;
              }
              setConfirmAction("advance");
              setConfirmOpen(true);
            }}
            onBypass={() => {
              setConfirmAction("bypass");
              setConfirmOpen(true);
            }}
            disabled={!allTasksDone && !isDirector} // Only director can bypass if tasks not done
          />
        </div>

        {/* Right: Exceptions & Controls (Break Flow) */}
        <Card className="bg-muted/10 border-dashed border-none">
          <CardHeader className="pb-3 border-b border-dashed">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              Xử lý tình huống (Break Flow)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start text-xs border-orange-200 hover:bg-orange-50"
                onClick={() => toast.info("Ghi nhận delay do khách hàng")}
            >
              <Timer className="h-4 w-4 mr-2 text-orange-500" />
              Chậm trễ do phía khách hàng
            </Button>
            <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start text-xs border-red-200 hover:bg-red-50"
                onClick={() => toast.error("Đã gửi yêu cầu đổi trả hàng lỗi")}
            >
              <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
              Hàng lỗi {"->"} Khiếu nại NSX
            </Button>
            <div className="pt-2 text-[10px] text-muted-foreground italic leading-relaxed">
              * Ghi chú: Chỉ Sếp và PM mới có quyền Bypass các chốt phê duyệt quan trọng.
            </div>
          </CardContent>
        </Card>
      </div>

      <ConfirmationDialog 
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={confirmAction === "advance" ? "Xác nhận chuyển giai đoạn" : "CẢNH BÁO: Phá vỡ quy trình (Break Flow)"}
        description={
            confirmAction === "advance" 
            ? `Bạn có chắc chắn muốn hoàn tất giai đoạn "${PROJECT_STAGE_LABELS[currentStage]}" và chuyển sang bước tiếp theo?`
            : "Thao tác Bypass sẽ bỏ qua các phê duyệt bắt buộc của cấp trên. Thao tác này sẽ được ghi lại trong nhật ký hệ thống. Bạn có chắc chắn?"
        }
        variant={confirmAction === "advance" ? "success" : "destructive"}
        confirmText={confirmAction === "advance" ? "Tiếp tục" : "Tôi hiểu, hãy Bypass"}
        onConfirm={confirmAction === "advance" ? handleAdvance : handleBypass}
      />
    </div>
  );
}
