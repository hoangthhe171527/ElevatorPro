import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataPagination } from "@/components/common/DataPagination";
import { StatusBadge } from "@/components/common/StatusBadge";
import { contractStatusLabel, contractStatusVariant } from "@/lib/status-variants";
import { mockContracts, formatVND, formatDate, getCustomer, mockProjects, mockJobs, type Contract } from "@/lib/mock-data";
import { Plus, Search, FileText, User, Banknote, AlertCircle, ChevronRight, X } from "lucide-react";
import {
  RecordPaymentModal,
  CreateContractModal,
  UploadDocumentModal,
  AccountantPaymentModal,
} from "@/components/common/Modals";
import { handleContractActivation } from "@/lib/workflow-utils";
import { toast } from "sonner";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { useCurrentPermissions, useCanWrite, useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 15;
const typeLabel: Record<string, string> = {
  install: "Lắp đặt",
  maintenance: "Bảo trì",
  repair: "Sửa chữa",
};

export function MobileContracts() {
  const permissions = useCurrentPermissions();
  const isDirector = permissions.includes("ceo");
  const isAccountant = permissions.includes("accountant");
  const canCreate = useCanWrite("contracts");
  
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentContract, setPaymentContract] = useState<Contract | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [confirmPaymentId, setConfirmPaymentId] = useState<string | null>(null);
  const [confirmSignId, setConfirmSignId] = useState<string | null>(null);
  const [uploadContractId, setUploadContractId] = useState<string | null>(null);
  const [accountingVerifyId, setAccountingVerifyId] = useState<string | null>(null);

  const filtered = mockContracts.filter((c) => {
    const cus = getCustomer(c.customerId);
    const m1 =
      !search ||
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      cus?.name.toLowerCase().includes(search.toLowerCase());
    const m2 = statusFilter === "all" || c.status === statusFilter;
    return m1 && m2;
  });

  const totalValue = filtered.reduce((s, c) => s + c.value, 0);
  const totalPaid = filtered.reduce((s, c) => s + c.paid, 0);
  const totalDebt = totalValue - totalPaid;

  return (
    <AppShell>
      <PageHeader
        title="Hợp đồng"
        description="Quản lý tài chính & vận hành"
        actions={
          canCreate && (
            <Button size="sm" className="h-8 rounded-full px-3 text-[11px] font-black uppercase" onClick={() => setCreateOpen(true)}>
              <Plus className="h-3 w-3 mr-1.5" /> Tạo
            </Button>
          )
        }
      />

      {/* Banking App Style Top Summary */}
      <div className="bg-slate-900 text-white rounded-[2rem] p-6 mb-6 shadow-xl shadow-slate-900/20 relative overflow-hidden">
         <div className="absolute top-0 right-0 p-4 opacity-5">
            <Banknote className="h-32 w-32" />
         </div>
         <div className="relative z-10">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Tổng nợ cần thu</h3>
            <div className="text-[32px] font-black tracking-tight mb-6">{formatVND(totalDebt)}</div>
            
            <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-700/50 mt-4">
               <div>
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Tổng giá trị</div>
                  <div className="text-sm font-bold">{formatVND(totalValue)}</div>
               </div>
               <div>
                  <div className="text-[9px] font-bold text-emerald-400/80 uppercase tracking-widest mb-0.5">Đã thu hồi</div>
                  <div className="text-sm font-bold text-emerald-400">{formatVND(totalPaid)}</div>
               </div>
            </div>
         </div>
      </div>

      {/* Modern App Search & Filter Row */}
      <div className="flex flex-col gap-3 mb-6">
         <div className="relative">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
           <Input
             placeholder="Tìm mã HĐ, khách hàng..."
             className="pl-11 h-12 bg-white border-transparent rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] focus-visible:ring-primary/20 text-sm font-medium"
             value={search}
             onChange={(e) => setSearch(e.target.value)}
           />
           {search && (
              <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-slate-400" onClick={() => setSearch('')}>
                 <X className="h-4 w-4" />
              </Button>
           )}
         </div>

         {/* Filter Chips */}
         <div className="flex overflow-x-auto hide-scrollbar gap-2 snap-x pb-1 -mx-4 px-4">
           {[
             { id: "all", label: "Tất cả trạng thái" },
             { id: "draft", label: "Bản nháp" },
             { id: "active", label: "Đang hiệu lực" },
             { id: "expired", label: "Hết hạn" },
           ].map((t) => (
             <button
               key={t.id}
               onClick={() => setStatusFilter(t.id)}
               className={cn(
                 "px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap snap-center transition-all",
                 statusFilter === t.id 
                   ? "bg-primary text-white shadow-md shadow-primary/20" 
                   : "bg-white text-slate-500 border border-slate-100 hover:bg-slate-50"
               )}
             >
               {t.label}
             </button>
           ))}
         </div>
      </div>

      {/* Contract List */}
      <div className="flex flex-col gap-4 pb-8">
         {filtered.length === 0 ? (
            <div className="py-20 text-center">
              <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-sm mx-auto mb-4">
                 <FileText className="h-6 w-6 text-slate-300" />
              </div>
              <p className="text-[13px] text-slate-400 font-medium">Không tìm thấy hợp đồng nào.</p>
            </div>
         ) : (
            filtered.map((c) => {
              const cus = getCustomer(c.customerId);
              const percent = c.value > 0 ? Math.round((c.paid / c.value) * 100) : 0;
              const remaining = c.value - c.paid;
              
              const today = new Date();
              const endDate = new Date(c.endDate);
              const diffTime = endDate.getTime() - today.getTime();
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              const isNearingExpiry = c.status === "active" && diffDays >= 0 && diffDays <= 15;
              
              return (
                <div key={c.id} className="relative bg-white p-5 rounded-[24px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-slate-100/50">
                   {/* Decorative side strip */}
                   <div className={cn(
                      "absolute left-0 top-6 bottom-6 w-1 rounded-r-lg",
                      c.status === 'draft' ? "bg-slate-200" :
                      c.status === 'active' ? "bg-blue-500" :
                      c.status === 'expired' ? "bg-slate-500" : "bg-orange-500"
                   )} />

                   <div className="flex justify-between items-start mb-3">
                      <div>
                         <div className="flex items-center gap-2 mb-1">
                            <span className="font-black text-slate-800 text-[15px]">{c.code}</span>
                            <span className="text-[9px] px-1.5 py-0.5 rounded uppercase font-black tracking-widest bg-slate-100 text-slate-500">
                               {typeLabel[c.type]}
                            </span>
                         </div>
                         <div className="text-[12px] font-bold text-slate-500 flex items-center gap-1.5 line-clamp-1 pr-4">
                            <User className="h-3 w-3 shrink-0" /> {cus?.name}
                         </div>
                      </div>
                      <StatusBadge variant={contractStatusVariant[c.status]} className="shrink-0 text-[9px] px-2 py-0.5">
                         {contractStatusLabel[c.status]}
                      </StatusBadge>
                   </div>

                   {isNearingExpiry && (
                     <div className="mb-3 p-2 rounded-xl bg-orange-50/80 border border-orange-200/50 text-orange-700 flex items-center gap-2">
                       <AlertCircle className="h-4 w-4 shrink-0 animate-pulse text-orange-500" />
                       <span className="text-[10px] font-bold uppercase tracking-tight">Hết hạn sau {diffDays} ngày</span>
                     </div>
                   )}

                   {/* Financial Progress Area */}
                   <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 mb-3">
                      <div className="flex justify-between items-end mb-1">
                         <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tiến độ thu tiền</span>
                         <span className="text-[13px] font-black text-slate-800">{formatVND(c.paid)} <span className="text-[10px] text-slate-400 font-bold">/ {formatVND(c.value)}</span></span>
                      </div>
                      <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden mb-2">
                         <div className="h-full bg-emerald-400 rounded-full transition-all" style={{ width: `${percent}%` }} />
                      </div>
                      {remaining > 0 && (
                         <div className="flex justify-end">
                            <span className="text-[9px] font-bold text-orange-500 uppercase tracking-widest">Còn nợ: {formatVND(remaining)}</span>
                         </div>
                      )}
                   </div>

                   {/* Actions Row */}
                   <div className="flex gap-2">
                      {remaining > 0 && isAccountant && (
                        <Button
                          size="sm"
                          className="flex-1 h-9 rounded-xl text-[11px] font-black uppercase text-white bg-emerald-500 hover:bg-emerald-600 shadow-sm shadow-emerald-500/20"
                          onClick={() => setConfirmPaymentId(c.id)}
                        >
                          <Banknote className="h-3.5 w-3.5 mr-1" /> Ghi nhận thu
                        </Button>
                      )}
                      {!isAccountant && remaining > 0 && (
                        <div className="flex-1 text-[10px] text-slate-400 bg-slate-50 rounded-xl flex items-center justify-center font-bold tracking-widest uppercase border border-slate-100 border-dashed">
                          Chờ thanh toán
                        </div>
                      )}
                      
                      {c.status === "draft" && isDirector && (
                        <Button
                           size="sm"
                           variant="outline"
                           className={cn("flex-1 h-9 rounded-xl text-[11px] font-black uppercase", c.contractFileUrl ? "border-primary text-primary bg-primary/5" : "border-slate-200 text-slate-600")}
                           onClick={() => {
                             if (!c.contractFileUrl) {
                               setUploadContractId(c.id);
                             } else {
                               setConfirmSignId(c.id);
                             }
                           }}
                        >
                           {c.contractFileUrl ? "Bắt đầu vận hành" : "Tải lên HĐ"}
                        </Button>
                      )}
                      
                      {c.status === "active" && !c.accountantVerified && isAccountant && (
                         <Button
                           size="sm"
                           variant="outline"
                           className="flex-1 h-9 rounded-xl text-[11px] font-black uppercase border-emerald-200 text-emerald-600 bg-emerald-50"
                           onClick={() => setAccountingVerifyId(c.id)}
                         >
                           KT Duyệt vòng 1
                         </Button>
                      )}
                   </div>
                </div>
              );
            })
         )}
      </div>

      {/* Modals */}
      {paymentContract && (
        <RecordPaymentModal
          open={true}
          onClose={() => setPaymentContract(null)}
          contractCode={paymentContract.code}
          totalValue={paymentContract.value}
          alreadyPaid={paymentContract.paid}
        />
      )}
      <CreateContractModal open={createOpen} onClose={() => setCreateOpen(false)} />
      <ConfirmationDialog
        open={!!confirmPaymentId}
        onOpenChange={(o) => !o && setConfirmPaymentId(null)}
        title="Xác nhận ghi nhận thanh toán"
        description="Mở biểu mẫu ghi nhận dòng tiền?"
        onConfirm={() => {
          const c = mockContracts.find((contract) => contract.id === confirmPaymentId);
          if (c) setPaymentContract(c);
          setConfirmPaymentId(null);
        }}
        confirmText="Mở ghi nhận thu"
      />
      <ConfirmationDialog
        open={!!confirmSignId}
        onOpenChange={(o) => !o && setConfirmSignId(null)}
        title="Xác nhận kích hoạt dự án?"
        description="Hệ thống sẽ chuyển vòng đời dự án sang Lắp đặt."
        onConfirm={() => {
          const c = mockContracts.find((contract) => contract.id === confirmSignId);
          if (c) {
            const { project, jobs } = handleContractActivation(c);
            if (project) mockProjects.push(project);
            if (jobs && jobs.length > 0) mockJobs.push(...jobs);
            
            toast.success(`Đã kích hoạt hợp đồng ${c.code}`);
            c.status = "active";
          }
          setConfirmSignId(null);
        }}
        confirmText="Vận hành ngay"
        variant="success"
      />
       {uploadContractId && (
         <UploadDocumentModal 
           open={true}
           onClose={() => setUploadContractId(null)}
           title="Hợp đồng đã ký xác nhận"
           onUploadSuccess={(url) => {
             const c = mockContracts.find(x => x.id === uploadContractId);
             if (c) {
               c.contractFileUrl = url;
               toast.success("Đã lưu Hợp đồng.");
             }
           }}
         />
       )}
       {accountingVerifyId && (
         <AccountantPaymentModal 
           open={true}
           onClose={() => setAccountingVerifyId(null)}
           contract={mockContracts.find(x => x.id === accountingVerifyId)}
           stage={1}
           onSuccess={(amount) => {
             const c = mockContracts.find(x => x.id === accountingVerifyId);
             if (c) {
               c.paymentStages.stage1Paid = amount;
               c.paid += amount;
               c.accountantVerified = true;
               toast.success("Đã xác nhận tiền đợt 1.");
             }
           }}
         />
       )}
    </AppShell>
  );
}
