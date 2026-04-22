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
        description={`Mã DA: ${project.id} · Cập nhật cuối: ${formatDate(project.updatedAt)}`}
        actions={
          !readonly && (
            <div className="flex gap-2">
              {project.stage === "completion" && (
                <Button className="bg-success hover:bg-success/90 text-white font-bold h-10 px-4 rounded-xl shadow-md" onClick={() => setShowAccountantPayment(3)}>
                  <CheckCircle2 className="h-4 w-4 mr-1.5" /> Quyết toán & Bàn giao
                </Button>
              )}
              {project.stage === "waiting_for_equipment" && (
                <Button className="bg-orange-600 hover:bg-orange-700 font-bold h-10 px-4 rounded-xl shadow-md" onClick={() => setConfirmEquipmentArrival(true)}>
                  <HardHat className="h-4 w-4 mr-1.5" /> Xác nhận thiết bị đã về
                </Button>
              )}
              <Button onClick={() => setCreateJobOpen(true)} className="h-10 px-4 rounded-xl shadow-sm">
                <Plus className="h-4 w-4 mr-1.5" /> Tạo công việc
              </Button>
            </div>
          )
        }
      />

      {readonly && (
        <div className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-xl flex items-center gap-4 text-primary shadow-sm">
          <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
             <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
             <div className="font-black text-lg">Chế độ Giám sát Dự án</div>
             <div className="text-xs opacity-80 font-bold tracking-widest uppercase mt-0.5">Theo dõi lịch trình thực tế không ảnh hưởng dữ liệu lõi</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Basic Info */}
        <Card className="lg:col-span-2 shadow-sm border-slate-100 rounded-3xl p-8">
          <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
               <Building className="h-6 w-6 text-primary" /> Thông tin Tổng thầu
            </h2>
             {isCompleted ? (
               <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 uppercase tracking-widest font-black text-[10px] px-3 border-none">Đã bàn giao</Badge>
             ) : (
               <Badge className="bg-primary/10 text-primary uppercase tracking-widest font-black text-[10px] px-3 border-none">Đang triển khai</Badge>
             )}
          </div>
          <div className="grid sm:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Khách hàng / Chủ đầu tư</label>
                <div className="flex items-center gap-3 mt-2 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm border border-slate-100">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-black text-slate-800 text-[15px]">{customer?.name}</div>
                    <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">{customer?.contactPerson}</div>
                  </div>
                </div>
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Địa điểm thi công</label>
                <div className="flex items-start gap-2 mt-2 text-[13px] text-slate-600 font-medium bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                  <span className="leading-relaxed">{project.address}</span>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Bắt đầu thi công</label>
                <div className="flex items-center gap-3 mt-2 bg-slate-50 p-4 rounded-2xl border border-slate-100 font-black text-slate-800">
                  <Calendar className="h-5 w-5 text-primary" />
                  {formatDate(project.startDate)}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <Card className="shadow-sm border-slate-100 rounded-3xl p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
             <HardHat className="h-5 w-5 text-primary" />
             <h2 className="text-lg font-black text-slate-800">Thông số Dự án</h2>
          </div>
          
          <div className="space-y-4 mb-6">
             <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center justify-between">
                <div>
                   <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Jobs</div>
                   <div className="font-black text-slate-800 text-lg mt-0.5">Khối lượng việc</div>
                </div>
                <div className="h-10 w-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center font-black text-xl text-primary">{jobs.length}</div>
             </div>
             <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 flex items-center justify-between">
                <div>
                   <div className="text-[10px] font-black uppercase tracking-widest text-emerald-600/50">Completed</div>
                   <div className="font-black text-emerald-800 text-lg mt-0.5">Hoàn tất đo lường</div>
                </div>
                <div className="h-10 w-10 bg-white rounded-xl shadow-sm border border-emerald-100 flex items-center justify-center font-black text-xl text-emerald-500">
                   {jobs.filter((j) => j.status === "completed").length}
                </div>
             </div>
          </div>

          <div className="mt-auto px-4 py-3 bg-primary/5 rounded-2xl border border-primary/10 flex flex-col">
             <span className="text-[10px] font-black text-primary/70 uppercase tracking-widest mb-1">Cột mốc hiện tại</span>
             <span className="font-black text-primary text-base">
                {PROJECT_STAGE_LABELS[project.stage as keyof typeof PROJECT_STAGE_LABELS]}
             </span>
          </div>

          {/* Decoupled Invoices Section */}
          <div className="pt-6 mt-6 border-t border-slate-100 space-y-3">
             <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center justify-between">
               <span>Dòng thu Doanh thu</span>
             </div>
             {mockInvoices.filter(inv => inv.targetId === project.id).map(inv => (
               <div key={inv.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                 <div className="min-w-0">
                   <div className="text-[13px] font-black text-slate-800">{inv.code}</div>
                   <div className={`text-[10px] uppercase font-black tracking-widest mt-0.5 ${inv.status === 'paid' ? 'text-emerald-500' : 'text-slate-400'}`}>{inv.status === 'paid' ? 'Đã thu tiền' : 'Chờ dòng tiền'}</div>
                 </div>
                 <div className={`text-sm font-black whitespace-nowrap ${inv.status === 'paid' ? 'text-emerald-500' : 'text-slate-400'}`}>{formatVND(inv.amount)}</div>
               </div>
             ))}
             {mockInvoices.filter(inv => inv.targetId === project.id).length === 0 && (
               <div className="text-[11px] text-slate-400 font-bold italic text-center py-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">Kế toán chưa đẩy Doanh thu</div>
             )}
          </div>
        </Card>
      </div>

      {readonly ? (
        <Card className="p-8 shadow-sm border-slate-100 rounded-3xl">
          <h3 className="font-black text-lg text-slate-800 mb-8 flex items-center gap-2"><CheckCircle2 className="h-6 w-6 text-primary" /> Tiến độ Thợ (8 Kỳ)</h3>
          <div className="grid grid-cols-2 gap-4">
            {INSTALL_STAGES_TEMPLATE.map((stage, idx) => {
              const job = jobs.find(j => j.title.includes(stage.label) || j.code.includes(`INSTALL-${idx + 1}`));
              const isCurrent = job?.status === "in_progress" || job?.status === "scheduled";
              const isCompleted = job?.status === "completed";

              return (
                <div key={stage.id} className={`
                  flex items-start gap-4 p-5 rounded-[24px] border-2 transition-all
                  ${isCurrent ? "bg-white border-primary shadow-lg shadow-primary/10 scale-[1.02]" : "bg-slate-50 border-transparent"}
                  ${isCompleted ? "bg-emerald-50/50 border-emerald-100" : ""}
                `}>
                  <div className={`
                    z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-[20px] font-black text-xl shadow-inner
                    ${isCurrent ? "bg-primary text-white" : 
                      isCompleted ? "bg-emerald-500 text-white" : 
                      "bg-white border border-slate-200 text-slate-300"}
                  `}>
                    {isCompleted ? <CheckCircle2 className="h-7 w-7" /> : idx + 1}
                  </div>

                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex flex-col gap-1 mb-2">
                      <div className="flex justify-between items-start">
                         <h4 className={`font-black tracking-tight ${isCurrent ? "text-primary text-lg" : "text-[15px] text-slate-800"}`}>
                           {stage.label.split(': ')[1] || stage.label}
                         </h4>
                         {job && <StatusBadge variant={jobStatusVariant[job.status]} className="shrink-0 scale-90 origin-top-right">{jobStatusLabel[job.status]}</StatusBadge>}
                      </div>
                    </div>
                    
                    {job ? (
                      <div className="mt-3 flex items-center justify-between pt-3 border-t border-slate-200">
                        <div className="text-[11px] text-slate-500 flex items-center gap-1.5 font-bold uppercase tracking-widest">
                           <Clock className="h-3 w-3" /> {formatDateTime(job.scheduledFor).split(",")[0]}
                        </div>
                        <Link to="/admin/jobs/$jobId" params={{ jobId: job.id }} search={{ readonly: "true" }}>
                          <Button size="sm" variant={isCurrent ? "default" : "outline"} className={`h-8 px-4 text-[10px] font-black uppercase rounded-lg ${isCurrent ? "shadow-md" : "border-slate-200 bg-white"}`}>
                            {isCompleted ? "Hồ sơ QC" : "Tra cứu"}
                            <ChevronRight className="h-3 w-3 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="mt-2 text-[11px] text-slate-400 font-bold uppercase tracking-widest italic pt-2 border-t border-slate-100">Bản nháp</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      ) : (
        <div className="bg-white rounded-3xl p-2 shadow-sm border border-slate-100">
           <InstallationWorkflow 
             projectId={project.id}
             currentStage={project.stage}
             tenantId={project.tenantId}
             onStageChange={(newStage) => {
                 advanceProjectStage(project.id);
                 const updated = mockProjects.find((p) => p.id === project.id);
                 if (updated) setProject({ ...updated });
             }}
           />
        </div>
      )}

      {/* Modals Logic Preserved */}
      <CreateJobModal
        open={createJobOpen}
        onClose={() => setCreateJobOpen(false)}
        defaultProjectId={project.id}
        defaultCustomerId={project.customerId}
      />

       <ConfirmationDialog 
         open={confirmEquipmentArrival}
         onOpenChange={setConfirmEquipmentArrival}
         title="Xác nhận Thiết bị đã về"
         description="Báo hiệu bắt đầu quá trình thực thi cơ khí tại hố thang. Tự động sinh Jobs lắp đặt."
         onConfirm={() => {
            const contract = mockContracts.find((c: Contract) => c.id === project.contractId || c.projectId === project.id);
            if (contract) {
              const { jobs: newJobs } = handleEquipmentArrival(project, contract);
              mockJobs.push(...newJobs);
              setShowAccountantPayment(2);
              project.stage = "installation";
              const p = mockProjects.find(x => x.id === project.id);
              if (p) p.stage = "installation";
              setProject({ ...project, stage: "installation" });
              toast.success("Đã kích hoạt Lắp đặt.");
            }
            setConfirmEquipmentArrival(false);
         }}
       />

       {showAccountantPayment && (
         <AccountantPaymentModal 
           open={true}
           onClose={() => setShowAccountantPayment(null)}
           stage={showAccountantPayment as any}
           contract={mockContracts.find((c: Contract) => c.id === project.contractId || c.projectId === project.id)}
           onSuccess={(amount) => {
             const contract = mockContracts.find((c: Contract) => c.id === project.contractId || c.projectId === project.id);
             if (contract) {
               if (showAccountantPayment === 2) contract.paymentStages.stage2Paid = amount;
               if (showAccountantPayment === 3) {
                 contract.paymentStages.stage3Paid = amount;
                 setShowCEOApproval(true);
               }
               contract.paid += amount;
             }
           }}
         />
       )}

       {showCEOApproval && (
         <CEOFinalApprovalModal 
           open={true}
           onClose={() => setShowCEOApproval(false)}
           contract={mockContracts.find((c: Contract) => c.id === project.contractId || c.projectId === project.id)}
           enteredTotal={(() => {
              const contract = mockContracts.find((c: Contract) => c.id === project.contractId || c.projectId === project.id);
              if (!contract) return 0;
              return (contract.paymentStages.stage1Paid || 0) +
                     (contract.paymentStages.stage2Paid || 0) +
                     (contract.paymentStages.stage3Paid || 0);
           })()}
           onApproved={() => {
              const contract = mockContracts.find((c: Contract) => c.id === project.contractId || c.projectId === project.id);
              if (contract) {
                contract.ceoVerified = true;
                const { invoice, warrantyProject } = initiateWarrantyFlow(project, contract.value);
                mockProjects.push(warrantyProject);
                mockInvoices.push(invoice);
                
                project.status = "completed";
                project.stage = "transition";
                const p = mockProjects.find(x => x.id === project.id);
                if (p) {
                  p.status = "completed";
                  p.stage = "transition";
                }
                setProject({ ...project });
                toast.success("Dự án bàn giao. Bắt đầu lưu thông bảo hành.");
              }
           }}
         />
       )}
    </AppShell>
  );
}
