import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
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
  Briefcase
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
import { jobStatusLabel, jobStatusVariant } from "@/lib/status-variants";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { cn } from "@/lib/utils";

export function MobileProjectDetail({ initialProject, readonly = false }: { initialProject: Project; readonly?: boolean }) {
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
      {/* Mobile Top Header Banner */}
      <div className={cn("mx--4 px-4 pt-4 pb-8 mb-4 relative overflow-hidden rounded-b-[2rem] shadow-xl", isCompleted ? "bg-emerald-600 shadow-emerald-500/20" : "bg-slate-900 shadow-slate-900/10")}>
         <div className="absolute top-0 right-0 p-4 opacity-5">
            <Building className="h-32 w-32 text-white" />
         </div>
         <div className="relative z-10 flex items-center justify-between mb-8">
            <Link to="/app/admin/projects" className="h-10 w-10 bg-white/10 rounded-full flex items-center justify-center text-white backdrop-blur-sm">
               <ArrowLeft className="h-5 w-5" />
            </Link>
            {readonly && (
               <div className="h-8 px-3 bg-white/20 rounded-full flex items-center justify-center text-[9px] font-black uppercase tracking-widest text-white backdrop-blur-md border border-white/30">
                  <ShieldCheck className="h-3 w-3 mr-1" /> View Only
               </div>
            )}
         </div>
         <div className="relative z-10 pr-4">
            <div className="flex items-center gap-2 mb-2">
               <span className="bg-white/20 text-white px-2 py-0.5 rounded uppercase font-black text-[10px] tracking-widest shadow-sm">
                  Dự án: {project.id}
               </span>
               <span className={cn("px-2 py-0.5 rounded uppercase font-black text-[9px] tracking-widest shadow-sm border", isCompleted ? "bg-white text-emerald-600 border-white" : "bg-primary text-white border-primary")}>
                  {isCompleted ? "Hoàn tất" : "Đang thi công"}
               </span>
            </div>
            <h1 className="text-2xl font-black text-white leading-tight mb-2">{project.name}</h1>
            <div className="flex flex-col gap-1 text-white/70 text-[11px] font-bold">
               <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> Bắt đầu: {formatDate(project.startDate)}</span>
               <span className="flex items-start gap-1.5 line-clamp-1"><MapPin className="h-3 w-3 shrink-0" /> {project.address}</span>
            </div>
         </div>
      </div>

      <div className="flex flex-col gap-4 pb-8 relative z-20 -mt-8 mx-4">
         
         {/* Action Buttons Row */}
         {!readonly && (
            <div className="grid gap-2">
               {project.stage === "completion" && (
                 <Button size="lg" className="h-14 font-black uppercase tracking-wider text-[11px] rounded-2xl bg-success text-white shadow-md shadow-success/20" onClick={() => setShowAccountantPayment(3)}>
                   <CheckCircle2 className="h-4 w-4 mr-2" /> Quyết toán & Bàn giao
                 </Button>
               )}
               {project.stage === "waiting_for_equipment" && (
                 <Button size="lg" className="h-14 font-black uppercase tracking-wider text-[11px] rounded-2xl bg-orange-600 hover:bg-orange-700 text-white shadow-md shadow-orange-500/20" onClick={() => setConfirmEquipmentArrival(true)}>
                   <HardHat className="h-4 w-4 mr-2" /> Hàng đã tới điểm tập kết
                 </Button>
               )}
               <Button size="lg" variant="outline" className="h-12 font-black uppercase tracking-wider text-[10px] rounded-xl bg-white shadow-sm border-slate-200 text-slate-800" onClick={() => setCreateJobOpen(true)}>
                  <Plus className="h-4 w-4 mr-2 text-primary" /> Phân công Kỹ thuật
               </Button>
            </div>
         )}

         {/* Stats Row Mobile */}
         <div className="grid grid-cols-2 gap-3 mt-2">
            <div className="bg-white rounded-[24px] p-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-col justify-between">
               <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-3">
                  <Briefcase className="h-5 w-5" />
               </div>
               <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Giao việc</div>
                  <div className="text-xl font-black text-slate-800">{jobs.length}</div>
               </div>
            </div>
            <div className="bg-white rounded-[24px] p-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-col justify-between">
               <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500 mb-3">
                  <CheckCircle2 className="h-5 w-5" />
               </div>
               <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Hoàn thiện</div>
                  <div className="text-xl font-black text-slate-800">{jobs.filter((j) => j.status === "completed").length}</div>
               </div>
            </div>
         </div>

         {/* Current Stage Display */}
         <div className="bg-primary/5 rounded-[24px] p-5 border border-primary/10 flex items-center justify-between">
            <div>
               <div className="text-[10px] font-black text-primary/70 uppercase tracking-widest mb-1">Phase hiện tại</div>
               <div className="font-black text-primary text-[15px]">
                  {PROJECT_STAGE_LABELS[project.stage as keyof typeof PROJECT_STAGE_LABELS]}
               </div>
            </div>
            <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center border-4 border-primary/10 text-primary">
               <HardHat className="h-5 w-5" />
            </div>
         </div>

         {/* Finance Brief List */}
         <div className="bg-white rounded-[24px] p-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-slate-100">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-between mb-4">
              <span>Hóa đơn thu tiền</span>
            </h3>
            <div className="space-y-3">
               {mockInvoices.filter(inv => inv.targetId === project.id).map(inv => (
                  <div key={inv.id} className="flex flex-col gap-1 pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                     <div className="flex items-center justify-between">
                        <div className="text-[13px] font-black text-slate-800">{inv.code}</div>
                        <div className={`text-[13px] font-black ${inv.status === 'paid' ? 'text-emerald-500' : 'text-slate-400'}`}>{formatVND(inv.amount)}</div>
                     </div>
                     <div className={`text-[9px] uppercase font-black tracking-widest ${inv.status === 'paid' ? 'text-emerald-500' : 'text-slate-400'}`}>
                        {inv.status === 'paid' ? 'Đã thu' : 'Chờ dòng tiền'}
                     </div>
                  </div>
               ))}
               {mockInvoices.filter(inv => inv.targetId === project.id).length === 0 && (
                  <div className="text-[11px] text-slate-400 font-bold italic text-center bg-slate-50 py-4 rounded-xl border border-slate-100 border-dashed">Chưa có xuất HĐ</div>
               )}
            </div>
         </div>

         {/* 8-Stage Tracker */}
         <div className="mt-4">
            <div className="flex items-center gap-2 px-2 mb-4">
               <span className="text-[12px] font-black uppercase tracking-widest text-slate-800">Tiến trình triển khai (8 Kỳ)</span>
            </div>
            <div className="bg-white rounded-[24px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-slate-100 px-5 py-2">
               {INSTALL_STAGES_TEMPLATE.map((stage, idx) => {
                  const job = jobs.find(j => j.title.includes(stage.label) || j.code.includes(`INSTALL-${idx + 1}`));
                  const isCurrent = job?.status === "in_progress" || job?.status === "scheduled";
                  const isCompleted = job?.status === "completed";

                  return (
                     <div key={stage.id} className="relative py-5 border-b border-slate-100 last:border-0 flex items-start gap-4">
                        <div className={cn(
                           "z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] font-black text-[15px] shadow-sm",
                           isCurrent ? "bg-primary text-white" : 
                           isCompleted ? "bg-emerald-500 text-white" : 
                           "bg-slate-100 text-slate-400"
                        )}>
                           {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                           <h4 className={cn("font-black tracking-tight mb-1 line-clamp-1", isCurrent ? "text-primary text-[15px]" : "text-[13px] text-slate-800")}>
                             {stage.label.split(': ')[1] || stage.label}
                           </h4>
                           {job ? (
                              <div className="flex flex-col gap-2 mt-2">
                                 <StatusBadge variant={jobStatusVariant[job.status]} className="w-fit scale-90 origin-left text-[9px] px-2 py-0.5">{jobStatusLabel[job.status]}</StatusBadge>
                                 <div className="flex items-center justify-between">
                                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                                       <Clock className="h-3 w-3" /> {formatDateTime(job.scheduledFor).split(" ")[1]}
                                    </div>
                                    <Link to="/app/admin/jobs/$jobId" params={{ jobId: job.id }} search={{ readonly: "true" }}>
                                       <Button size="sm" variant="ghost" className="h-7 px-3 bg-slate-50 text-[9px] font-black uppercase border border-slate-200 rounded-lg">
                                          {isCompleted ? "Hồ sơ QC" : "Mở"}
                                          <ChevronRight className="h-3 w-3 ml-1" />
                                       </Button>
                                    </Link>
                                 </div>
                              </div>
                           ) : (
                              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic mt-2">Chưa giao thợ</div>
                           )}
                        </div>
                     </div>
                  )
               })}
            </div>
         </div>

      </div>

      <CreateJobModal open={createJobOpen} onClose={() => setCreateJobOpen(false)} defaultProjectId={project.id} defaultCustomerId={project.customerId} />
      <ConfirmationDialog open={confirmEquipmentArrival} onOpenChange={setConfirmEquipmentArrival} title="Hàng về công trình" description="Kích hoạt các công việc lắp đặt cơ khí." onConfirm={() => {
            const { jobs: activatedJobs } = handleEquipmentArrival(project, mockJobs);
            activatedJobs.forEach(updatedJob => {
                const idx = mockJobs.findIndex(j => j.id === updatedJob.id);
                if (idx !== -1) mockJobs[idx] = updatedJob;
            });
            setShowAccountantPayment(2);
            project.stage = "installation";
            const p = mockProjects.find(x => x.id === project.id);
            if (p) p.stage = "installation";
            setProject({ ...project, stage: "installation" });
            toast.success("Đã kích hoạt các công việc lắp đặt.");
            setConfirmEquipmentArrival(false);
         }}
      />
      {showAccountantPayment && (
         <AccountantPaymentModal open={true} onClose={() => setShowAccountantPayment(null)} stage={showAccountantPayment as any} contract={mockContracts.find((c: Contract) => c.id === project.contractId || c.projectId === project.id)} onSuccess={(amount) => {
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
         <CEOFinalApprovalModal open={true} onClose={() => setShowCEOApproval(false)} contract={mockContracts.find((c: Contract) => c.id === project.contractId || c.projectId === project.id)} enteredTotal={(() => {
              const contract = mockContracts.find((c: Contract) => c.id === project.contractId || c.projectId === project.id);
              if (!contract) return 0;
              return (contract.paymentStages.stage1Paid || 0) + (contract.paymentStages.stage2Paid || 0) + (contract.paymentStages.stage3Paid || 0);
           })()}
           onApproved={() => {
              const contract = mockContracts.find((c: Contract) => c.id === project.contractId || c.projectId === project.id);
              if (contract) {
                contract.ceoVerified = true;
                const { invoice, warrantyProject } = initiateWarrantyFlow(project, contract.value);
                mockProjects.push(warrantyProject);
                mockInvoices.push(invoice);
                project.status = "completed";
                const p = mockProjects.find(x => x.id === project.id);
                if (p) p.status = "completed";
                setProject({ ...project });
                toast.success("Dự án bàn giao. Bật bảo hành.");
              }
           }}
         />
      )}
    </AppShell>
  );
}
