import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building,
  ArrowLeft,
  Calendar,
  MapPin,
  User,
  Clock,
  Plus,
  ChevronRight,
  HardHat,
  ShieldCheck,
  CheckCircle2,
  Hammer,
  PackageSearch,
} from "lucide-react";
import {
  mockProjects,
  mockJobs,
  getCustomer,
  INSTALL_STAGES_TEMPLATE,
  PROJECT_STAGE_LABELS,
  advanceProjectStage,
  formatDate,
  formatDateTime,
  mockInvoices,
  formatVND,
  mockContracts,
  type Contract,
  type Project
} from "@/lib/mock-data";
import { 
  initiateWarrantyFlow, 
  handleEquipmentArrival, 
} from "@/lib/workflow-utils";
import { 
  CreateJobModal, 
  AccountantPaymentModal, 
  CEOFinalApprovalModal 
} from "@/components/common/Modals";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  jobStatusLabel,
  jobStatusVariant,
} from "@/lib/status-variants";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { InstallationWorkflow } from "@/components/workflow/InstallationWorkflow";

export function WebProjectDetail({ 
  initialProject, 
  readonly = false 
}: { 
  initialProject: Project; 
  readonly?: boolean 
}) {
  const [project, setProject] = useState(initialProject);
  const [createJobOpen, setCreateJobOpen] = useState(false);
  const [showAccountantPayment, setShowAccountantPayment] = useState<number | null>(null);
  const [showCEOApproval, setShowCEOApproval] = useState(false);
  const [confirmEquipmentArrival, setConfirmEquipmentArrival] = useState(false);

  const customer = getCustomer(project.customerId);
  const jobs = mockJobs.filter((j) => j.projectId === project.id);
  const isCompleted = project.status === "completed";

  return (
    <AppShell>
      <Link
        to="/admin/projects"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 font-medium transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Quay lại danh sách dự án
      </Link>

      <PageHeader
        title={project.name}
        description={`Mã DA: ${project.id} · Bắt đầu: ${formatDate(project.startDate)}`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/40 border border-slate-100">
             <div className="flex items-center justify-between mb-10">
               <h3 className="font-black text-2xl text-slate-800 flex items-center gap-3">
                 <Hammer className="h-8 w-8 text-primary" /> 
                 Tiến độ thi công thực tế (8 Giai đoạn)
               </h3>
               
               {project.stage === "waiting_for_equipment" && !readonly && (
                 <Button 
                   onClick={() => setConfirmEquipmentArrival(true)}
                   className="bg-orange-500 hover:bg-orange-600 text-white font-black px-6 rounded-2xl shadow-lg shadow-orange-200"
                 >
                   <PackageSearch className="h-5 w-5 mr-2" /> XÁC NHẬN THIẾT BỊ VỀ
                 </Button>
               )}

               {project.stage === "completion" && !readonly && (
                 <Button 
                   onClick={() => setShowCEOApproval(true)}
                   className="bg-emerald-500 hover:bg-emerald-600 text-white font-black px-6 rounded-2xl shadow-lg shadow-emerald-200"
                 >
                   <CheckCircle2 className="h-5 w-5 mr-2" /> HOÀN TẤT DỰ ÁN
                 </Button>
               )}
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
               {INSTALL_STAGES_TEMPLATE.map((stage, idx) => {
                 const job = jobs.find(j => j.title.includes(stage.label) || j.code.includes(`INSTALL-${idx + 1}`));
                 const isCurrent = job?.status === "in_progress" || job?.status === "scheduled";
                 const isCompleted = job?.status === "completed";

                 return (
                   <div key={stage.id} className={cn(
                     "group flex flex-col p-6 rounded-[2rem] border-2 transition-all relative overflow-hidden h-full",
                     isCurrent ? "bg-white border-primary shadow-2xl shadow-primary/10" : "bg-slate-50 border-transparent",
                     isCompleted ? "bg-emerald-50/30 border-emerald-100" : ""
                   )}>
                     <div className="flex items-start gap-3 mb-6">
                       <div className={cn(
                         "z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-black text-sm",
                         isCurrent ? "bg-primary text-white" : 
                         isCompleted ? "bg-emerald-500 text-white" : 
                         "bg-white border border-slate-200 text-slate-300"
                       )}>
                         {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : idx + 1}
                       </div>
                       <div className="flex-1 min-w-0">
                          <h4 className={cn(
                            "font-black tracking-tight leading-tight mb-1 text-sm",
                            isCurrent ? "text-primary" : "text-slate-800"
                          )}>
                            {stage.label.split(': ')[1] || stage.label}
                          </h4>
                          {job && (
                            <StatusBadge variant={jobStatusVariant[job.status]} className="scale-75 origin-left h-4 px-1.5 py-0 text-[8px]">
                              {jobStatusLabel[job.status]}
                            </StatusBadge>
                          )}
                       </div>
                     </div>
                     
                     <div className="mt-auto pt-4 border-t border-slate-100/50">
                        {job ? (
                          <Link to="/admin/jobs/$jobId" params={{ jobId: job.id }} search={{ readonly: "true" }}>
                            <Button 
                              size="sm" 
                              variant={isCurrent ? "default" : "ghost"} 
                              className={cn(
                                "w-full h-8 text-[9px] font-black uppercase rounded-lg transition-all",
                                isCurrent ? "shadow-lg shadow-primary/20" : "text-slate-500 hover:bg-slate-100"
                              )}
                            >
                              {isCompleted ? "Xem Hồ sơ" : "Chi tiết"}
                              <ChevronRight className="h-3 w-3 ml-1" />
                            </Button>
                          </Link>
                        ) : (
                          <div className="text-[9px] text-slate-400 font-black uppercase tracking-widest italic text-center">Chưa bắt đầu</div>
                        )}
                     </div>
                   </div>
                 );
               })}
             </div>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="rounded-[2.5rem] border-none shadow-xl shadow-slate-200/40 p-6 bg-slate-900 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
               <Building className="h-32 w-32" />
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
              <ShieldCheck className="h-3 w-3" /> Thông tin dự án
            </h4>
            <div className="space-y-6 relative z-10">
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Khách hàng</div>
                <div className="font-black text-lg">{customer?.name}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Địa chỉ</div>
                <div className="text-sm font-medium text-slate-200">{project.address}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Bắt đầu</div>
                  <div className="text-sm font-black">{formatDate(project.startDate)}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Trạng thái</div>
                  <Badge variant="outline" className="bg-primary/20 border-primary/30 text-primary text-[10px] px-2 py-0">
                    {PROJECT_STAGE_LABELS[project.stage]}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>

          <Card className="rounded-[2rem] border-2 border-slate-100 p-6">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
              <Clock className="h-3 w-3" /> Nhật ký nhanh
            </h4>
            <div className="space-y-4">
              {jobs.filter(j => j.status === 'completed').slice(0, 3).map(j => (
                <div key={j.id} className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-3 w-3" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-black truncate">{j.title}</div>
                    <div className="text-[8px] text-slate-400 uppercase">{formatDate(j.completedAt || j.scheduledFor)}</div>
                  </div>
                </div>
              ))}
              {jobs.filter(j => j.status === 'completed').length === 0 && (
                <div className="text-[10px] text-slate-400 italic">Chưa có giai đoạn nào hoàn tất</div>
              )}
            </div>
          </Card>
        </div>
      </div>

      <ConfirmationDialog
        open={confirmEquipmentArrival}
        onOpenChange={setConfirmEquipmentArrival}
        title="Xác nhận thiết bị đã về công trình"
        description="Thao tác này sẽ tự động kích hoạt giai đoạn lắp đặt và giao việc cho đội kỹ thuật. Bạn có chắc chắn thiết bị đã được tập kết đầy đủ?"
        variant="success"
        confirmText="Xác nhận & Kích hoạt"
        onConfirm={() => {
          const { jobs: activatedJobs } = handleEquipmentArrival(project, mockJobs);
          // Update mock data in place for demo
          activatedJobs.forEach(aj => {
            const idx = mockJobs.findIndex(j => j.id === aj.id);
            if (idx !== -1) mockJobs[idx] = aj;
          });
          setProject({ ...project, stage: "installation" });
          toast.success("Đã xác nhận thiết bị! Các công việc lắp đặt đã được kích hoạt.");
          setConfirmEquipmentArrival(false);
        }}
      />

      <CEOFinalApprovalModal
        open={showCEOApproval}
        onClose={() => setShowCEOApproval(false)}
        contract={mockContracts.find(c => c.id === project.contractId)}
        enteredTotal={mockContracts.find(c => c.id === project.contractId)?.paid || 0}
        onApproved={() => {
          const contract = mockContracts.find(c => c.id === project.contractId);
          if (contract) {
            const { invoice, warrantyProject } = initiateWarrantyFlow(project, contract.value);
            mockInvoices.push(invoice);
            mockProjects.push(warrantyProject);
            setProject({ ...project, status: "completed", stage: "transition" });
            toast.success("Dự án đã được chốt hoàn tất và chuyển sang chế độ bảo hành!");
          }
        }}
      />

    </AppShell>
  );
}
