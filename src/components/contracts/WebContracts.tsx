import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataPagination } from "@/components/common/DataPagination";
import { StatusBadge } from "@/components/common/StatusBadge";
import { contractStatusLabel, contractStatusVariant } from "@/lib/status-variants";
import { Progress } from "@/components/ui/progress";
import { mockContracts, formatVND, formatDate, getCustomer, mockProjects, mockJobs, type Contract } from "@/lib/mock-data";
import { Plus, Search, FileText, Calendar, User, Banknote, AlertCircle } from "lucide-react";
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

const PAGE_SIZE = 6;
const typeLabel: Record<string, string> = {
  install: "Lắp đặt",
  maintenance: "Bảo trì",
  repair: "Sửa chữa",
};

export function WebContracts() {
  const permissions = useCurrentPermissions();
  const isDirector = permissions.includes("ceo");
  const isAccountant = permissions.includes("accountant");
  const canCreate = useCanWrite("contracts");
  
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [paymentContract, setPaymentContract] = useState<Contract | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [confirmPaymentId, setConfirmPaymentId] = useState<string | null>(null);
  const [confirmSignId, setConfirmSignId] = useState<string | null>(null);
  const [uploadContractId, setUploadContractId] = useState<string | null>(null);
  const [accountingVerifyId, setAccountingVerifyId] = useState<string | null>(null);
  const isSmall = useAppStore(s => s.activeTenantId === 't-2');

  const filtered = mockContracts.filter((c) => {
    const cus = getCustomer(c.customerId);
    const m1 =
      !search ||
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      cus?.name.toLowerCase().includes(search.toLowerCase());
    const m2 = statusFilter === "all" || c.status === statusFilter;
    const m3 = typeFilter === "all" || c.type === typeFilter;
    return m1 && m2 && m3;
  });
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalValue = mockContracts.reduce((s, c) => s + c.value, 0);
  const totalPaid = mockContracts.reduce((s, c) => s + c.paid, 0);

  return (
    <AppShell>
      <PageHeader
        title="Quản lý hợp đồng"
        description="Trung tâm vận hành — gắn với khách hàng và sinh ra công việc"
        actions={
          canCreate && (
            <Button onClick={() => setCreateOpen(true)}>
              <Plus className="h-4 w-4 mr-1.5" /> Tạo hợp đồng
            </Button>
          )
        }
      />

      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <Card className="p-4 shadow-sm border-slate-100">
          <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Tổng giá trị</div>
          <div className="mt-1 text-2xl font-black text-primary">{formatVND(totalValue)}</div>
        </Card>
        <Card className="p-4 shadow-sm border-slate-100">
          <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Đã thu</div>
          <div className="mt-1 text-2xl font-black text-success">{formatVND(totalPaid)}</div>
        </Card>
        <Card className="p-4 shadow-sm border-slate-100">
          <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Còn nợ</div>
          <div className="mt-1 text-2xl font-black text-warning-foreground">
            {formatVND(totalValue - totalPaid)}
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden shadow-sm border-slate-100">
        <div className="flex flex-col sm:flex-row gap-3 p-4 border-b bg-slate-50/50">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm mã HĐ hoặc khách hàng..."
              className="pl-9 h-10 border-slate-200 focus-visible:ring-primary/20"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setPage(1); }}>
            <SelectTrigger className="w-full sm:w-40 h-10 border-slate-200">
              <SelectValue placeholder="Loại" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả loại</SelectItem>
              {Object.entries(typeLabel).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
            <SelectTrigger className="w-full sm:w-44 h-10 border-slate-200">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              {Object.entries(contractStatusLabel).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="divide-y divide-slate-100">
          {paged.map((c) => {
            const cus = getCustomer(c.customerId);
            const percent = c.value > 0 ? Math.round((c.paid / c.value) * 100) : 0;
            const remaining = c.value - c.paid;
            
            const today = new Date();
            const endDate = new Date(c.endDate);
            const diffTime = endDate.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const isNearingExpiry = c.status === "active" && diffDays >= 0 && diffDays <= 15;
            
            return (
              <div key={c.id} className="p-4 hover:bg-slate-50/50 transition-colors">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-black text-slate-800 text-lg">{c.code}</span>
                        <StatusBadge variant={contractStatusVariant[c.status]}>
                          {contractStatusLabel[c.status]}
                        </StatusBadge>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold uppercase tracking-widest">
                          {typeLabel[c.type]}
                        </span>
                      </div>
                      <div className="mt-1 text-sm font-medium text-slate-600 flex items-center gap-1.5">
                        <User className="h-4 w-4" /> {cus?.name}
                      </div>
                      <div className="mt-1.5 text-xs text-slate-500 font-medium flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" /> {formatDate(c.startDate)} → {formatDate(c.endDate)}
                      </div>
                      
                      {isNearingExpiry && (
                        <div className="mt-3 p-3 rounded-xl bg-orange-50 border border-orange-200 text-orange-700 flex items-center gap-2">
                          <AlertCircle className="h-5 w-5 shrink-0 animate-pulse" />
                          <span className="text-[12px] font-black uppercase tracking-tight">
                            Sắp hết hạn ({diffDays} ngày) - Đề nghị tái ký
                          </span>
                        </div>
                      )}

                      <div className="mt-2.5 text-xs text-slate-500 italic bg-slate-50 p-2 rounded-lg border border-slate-100 line-clamp-2">
                        {c.items.join(" · ")}
                      </div>
                    </div>
                  </div>

                  <div className="lg:w-80 flex flex-col gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="space-y-2.5">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-xs font-bold text-slate-500 uppercase">Tổng giá trị</span>
                        <span className="font-black text-primary text-lg">{formatVND(c.value)}</span>
                      </div>
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-xs font-bold text-slate-500 uppercase">Đã thu ({percent}%)</span>
                        <span className="text-sm font-black text-success">
                          {formatVND(c.paid)}
                        </span>
                      </div>
                      <Progress value={percent} className="h-2 bg-slate-200" />
                      {remaining > 0 && (
                        <div className="flex items-baseline justify-between gap-2 pt-1 border-t border-slate-200/50">
                          <span className="text-xs font-bold text-slate-500 uppercase">Còn nợ</span>
                          <span className="text-sm font-black text-warning-foreground drop-shadow-sm">
                            {formatVND(remaining)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 pt-2">
                      {remaining > 0 && isAccountant && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 gap-1.5 text-xs text-success border-success/20 hover:bg-success hover:text-white transition-colors"
                          onClick={() => setConfirmPaymentId(c.id)}
                        >
                          <Banknote className="h-3.5 w-3.5" /> Ghi nhận thu
                        </Button>
                      )}
                      {!isAccountant && remaining > 0 && (
                        <div className="flex-1 text-[10px] text-muted-foreground bg-muted/30 rounded p-1 text-center flex items-center justify-center font-bold">
                          Chờ thanh toán
                        </div>
                      )}
                       {c.status === "draft" && isDirector && (
                            <Button
                              size="sm"
                              className="flex-1 bg-primary text-white hover:bg-primary/90"
                              onClick={() => {
                                if (!c.contractFileUrl) {
                                  setUploadContractId(c.id);
                                } else {
                                  setConfirmSignId(c.id);
                                }
                              }}
                            >
                              <FileText className="h-4 w-4 mr-1.5" /> 
                              {c.contractFileUrl ? "Ký HĐ & Vận hành" : "CEO tải lên HĐ"}
                            </Button>
                          )}
                          
                          {c.status === "active" && !c.accountantVerified && isAccountant && (
                             <Button
                               size="sm"
                               variant="outline"
                               className="border-success text-success bg-success/5 hover:bg-success hover:text-white"
                               onClick={() => setAccountingVerifyId(c.id)}
                             >
                               <Banknote className="h-4 w-4 mr-1.5" /> KT thu lần 1
                             </Button>
                          )}
                     </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100">
          <DataPagination
            page={page}
            pageSize={PAGE_SIZE}
            total={filtered.length}
            onPageChange={setPage}
          />
        </div>
      </Card>

      {/* Modals omitted for brevity, keeping only functionality */}
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
        description="Bạn có chắc chắn muốn mở biểu mẫu ghi nhận dòng tiền cho hợp đồng này không? Hãy đảm bảo bạn đã nhận được vận đơn hoặc tiền mặt."
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
        title="Xác nhận khách hàng đã ký?"
        description="Hợp đồng sẽ được chuyển sang trạng thái Active. Hệ thống sẽ tự động khởi tạo Project Lắp đặt."
        onConfirm={() => {
          const c = mockContracts.find((contract) => contract.id === confirmSignId);
          if (c) {
            const { project, jobs } = handleContractActivation(c);
            if (project) mockProjects.push(project);
            if (jobs && jobs.length > 0) mockJobs.push(...jobs);
            
            toast.success(`Hợp đồng ${c.code} đã chính thức có hiệu lực!`);
            c.status = "active";
          }
          setConfirmSignId(null);
        }}
        confirmText="Bắt đầu vận hành"
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
