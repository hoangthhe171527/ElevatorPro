import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/layout/MobileShell";
import { mockContracts, formatVND, getCustomer, type Contract } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import {
  CreditCard,
  Wallet,
  History,
  Search,
  Plus,
  Clock,
  AlertCircle,
  FileBadge,
  TrendingUp,
  Banknote,
  RefreshCw,
  MoreVertical,
} from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/common/StatusBadge";
import { contractStatusLabel, contractStatusVariant } from "@/lib/status-variants";
import { 
  RecordPaymentModal, 
  RenewContractModal, 
  CreateContractModal 
} from "@/components/common/Modals";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/mobile/accounting")({
  head: () => ({ meta: [{ title: "Kế toán & Hợp đồng — Mobile" }] }),
  component: MobileAccounting,
});

function MobileAccounting() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "active" | "due">("all");
  
  // Modal States
  const [recordOpen, setRecordOpen] = useState(false);
  const [renewOpen, setRenewOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);

  const filtered = mockContracts.filter((c) => {
    const matchesSearch = c.code.toLowerCase().includes(search.toLowerCase()) || 
                         getCustomer(c.customerId)?.name.toLowerCase().includes(search.toLowerCase());
    
    if (activeTab === "active") return matchesSearch && c.status === "active";
    if (activeTab === "due") return matchesSearch && (c.status === "expiring" || c.status === "expired");
    return matchesSearch;
  });

  const totalValue = mockContracts.reduce((s, c) => s + c.value, 0);
  const totalPaid = mockContracts.reduce((s, c) => s + c.paid, 0);
  const remaining = totalValue - totalPaid;

  const handleRecordPayment = (c: Contract) => {
    setSelectedContract(c);
    setRecordOpen(true);
  };

  const handleRenew = (c: Contract) => {
    setSelectedContract(c);
    setRenewOpen(true);
  };

  return (
    <MobileShell title="Kế toán & Hợp đồng">
      <div className="flex flex-col pb-20">
        {/* Financial Summary - Premium Glassmorphism */}
        <div className="bg-primary px-6 pt-6 pb-12 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Tổng doanh thu</p>
                <h2 className="text-2xl font-black text-white mt-1">{formatVND(totalValue)}</h2>
              </div>
              <Button 
                size="icon" 
                variant="ghost" 
                className="bg-white/10 hover:bg-white/20 text-white rounded-2xl h-12 w-12 border border-white/20"
                onClick={() => setCreateOpen(true)}
              >
                <Plus className="h-6 w-6" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-6 w-6 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                  </div>
                  <span className="text-[9px] font-bold text-white/50 uppercase">Đã thu</span>
                </div>
                <p className="text-sm font-black text-white">{formatVND(totalPaid)}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-6 w-6 rounded-lg bg-orange-500/20 flex items-center justify-center">
                    <AlertCircle className="h-3.5 w-3.5 text-orange-400" />
                  </div>
                  <span className="text-[9px] font-bold text-white/50 uppercase">Còn nợ</span>
                </div>
                <p className="text-sm font-black text-white">{formatVND(remaining)}</p>
              </div>
            </div>
          </div>
          
          <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Search & Tabs */}
        <div className="px-6 -mt-6 relative z-20">
          <div className="bg-white p-2 rounded-[2rem] shadow-xl shadow-primary/5 flex items-center gap-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Tìm hợp đồng, khách hàng..."
                className="pl-11 h-12 border-none bg-transparent focus-visible:ring-0 text-sm font-medium"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-2">
            {[
              { id: "all", label: "Tất cả", count: mockContracts.length },
              { id: "active", label: "Hiệu lực", count: mockContracts.filter(c => c.status === "active").length },
              { id: "due", label: "Sắp hạn", count: mockContracts.filter(c => c.status === "expiring" || c.status === "expired").length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0 flex items-center gap-2",
                  activeTab === tab.id 
                    ? "bg-primary text-white shadow-lg shadow-primary/20" 
                    : "bg-white text-slate-400 hover:bg-slate-50"
                )}
              >
                {tab.label}
                <span className={cn(
                  "px-1.5 py-0.5 rounded-lg text-[9px]",
                  activeTab === tab.id ? "bg-white/20" : "bg-slate-100"
                )}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Contract List */}
          <div className="space-y-4">
            {filtered.map((contract) => {
              const customer = getCustomer(contract.customerId);
              const progress = (contract.paid / contract.value) * 100;
              const isOverdue = contract.status === "expiring" || contract.status === "expired";

              return (
                <Card
                  key={contract.id}
                  className="p-5 border-none shadow-sm shadow-slate-200/60 bg-white rounded-[2rem] group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "h-10 w-10 rounded-2xl flex items-center justify-center",
                        isOverdue ? "bg-red-50 text-red-500" : "bg-emerald-50 text-emerald-500"
                      )}>
                        <FileBadge className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black font-mono tracking-tight text-slate-900">
                            {contract.code}
                          </span>
                          <StatusBadge variant={contractStatusVariant[contract.status]} className="h-4 px-1.5 text-[8px]">
                            {contractStatusLabel[contract.status]}
                          </StatusBadge>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mt-0.5">
                          Hợp đồng {contract.type === "maintenance" ? "Bảo trì" : "Lắp đặt"}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-slate-300">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="mb-5">
                    <h3 className="font-black text-slate-800 line-clamp-1">{customer?.name}</h3>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-1 font-medium italic">
                      <Clock className="h-3 w-3" />
                      Hết hạn: {new Date(contract.endDate).toLocaleDateString("vi-VN")}
                    </div>
                  </div>

                  <div className="bg-slate-50/50 p-4 rounded-2xl mb-5">
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-[9px] font-black text-slate-400 uppercase">Tiến độ thu</span>
                      <span className="text-xs font-black text-slate-900">{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-1.5 bg-slate-100" />
                    <div className="flex justify-between mt-3">
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">Tổng giá trị</p>
                        <p className="text-xs font-black text-slate-900 mt-0.5">{formatVND(contract.value)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] font-bold text-slate-400 uppercase">Đã thanh toán</p>
                        <p className="text-xs font-black text-emerald-600 mt-0.5">{formatVND(contract.paid)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {contract.paid < contract.value && (
                      <Button 
                        onClick={() => handleRecordPayment(contract)}
                        className="flex-1 h-10 rounded-xl bg-primary text-white text-[10px] font-black group-active:scale-[0.98] transition-transform shadow-lg shadow-primary/10"
                      >
                        <Banknote className="h-3.5 w-3.5 mr-2" /> GHI NHẬN THU
                      </Button>
                    )}
                    {contract.status === "expiring" && (
                      <Button 
                        onClick={() => handleRenew(contract)}
                        variant="outline"
                        className="flex-1 h-10 rounded-xl border-slate-200 text-slate-600 text-[10px] font-black group-active:scale-[0.98] transition-transform"
                      >
                        <RefreshCw className="h-3.5 w-3.5 mr-2" /> TÁI KÝ PHỤ LỤC
                      </Button>
                    )}
                    {(contract.status === "active" && contract.paid >= contract.value) && (
                      <Button 
                        variant="ghost"
                        className="flex-1 h-10 rounded-xl bg-slate-50 text-slate-400 text-[10px] font-black cursor-default"
                      >
                         ĐÃ TẤT TOÁN
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedContract && (
        <>
          <RecordPaymentModal
            open={recordOpen}
            onClose={() => setRecordOpen(false)}
            contractCode={selectedContract.code}
            totalValue={selectedContract.value}
            alreadyPaid={selectedContract.paid}
          />
          <RenewContractModal
            open={renewOpen}
            onClose={() => setRenewOpen(false)}
            contractCode={selectedContract.code}
          />
        </>
      )}
      <CreateContractModal 
        open={createOpen} 
        onClose={() => setCreateOpen(false)} 
      />
    </MobileShell>
  );
}
