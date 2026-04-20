import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { MobileShell } from "@/components/layout/MobileShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  contractStatusLabel,
  contractStatusVariant,
} from "@/lib/status-variants";
import {
  mockContracts,
  mockCustomers,
  formatVND,
  formatDate,
} from "@/lib/mock-data";
import {
  FileText,
  Calendar,
  DollarSign,
  ShieldCheck,
  Building2,
  ChevronRight,
  Download,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/mobile/contracts/$contractId")({
  loader: ({ params }) => {
    const contract = mockContracts.find((c) => c.id === params.contractId);
    if (!contract) throw notFound();
    const customer = mockCustomers.find(cust => cust.id === contract.customerId);
    return { contract, customer };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `Hợp đồng ${loaderData?.contract.code ?? ""} — Mobile` }],
  }),
  component: ContractDetail,
});

function ContractDetail() {
  const { contract, customer } = Route.useLoaderData();
  const paymentProgress = (contract.paid / contract.value) * 100;

  return (
    <MobileShell 
        title="Chi tiết hợp đồng"
        backLink="/mobile/contracts"
    >
      <div className="flex flex-col pb-24">
        {/* Header Section */}
        <div className="bg-slate-900 px-6 pt-10 pb-20 relative overflow-hidden">
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div className="h-14 w-14 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                        <FileText className="h-7 w-7 text-indigo-400" />
                    </div>
                    <StatusBadge variant={contractStatusVariant[contract.status]} className="px-3 py-1 text-[10px]">
                        {contractStatusLabel[contract.status]}
                    </StatusBadge>
                </div>
                <h1 className="text-2xl font-black text-white leading-tight uppercase italic tracking-tight">{contract.code}</h1>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">
                    {contract.type === "maintenance" ? "HỢP ĐỒNG BẢO TRÌ" : "HỢP ĐỒNG LẮP ĐẶT"}
                </p>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
        </div>

        {/* Financial Progress Card */}
        <div className="px-6 -mt-10 relative z-20">
            <Card className="bg-white border-none shadow-2xl shadow-indigo-900/5 rounded-[2.5rem] p-6">
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tiến độ thanh toán</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black text-slate-900 italic">{Math.round(paymentProgress)}%</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Hoàn tất</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Còn lại</p>
                        <p className="text-sm font-black text-rose-600 italic">{formatVND(contract.value - contract.paid)}</p>
                    </div>
                </div>
                
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-indigo-600 rounded-full transition-all duration-1000" 
                        style={{ width: `${paymentProgress}%` }}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-50">
                    <div>
                        <p className="text-[9px] font-black text-slate-300 uppercase mb-1">Giá trị hợp đồng</p>
                        <p className="text-sm font-black text-slate-800">{formatVND(contract.value)}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[9px] font-black text-slate-300 uppercase mb-1">Đã quyết toán</p>
                        <p className="text-sm font-black text-emerald-600">{formatVND(contract.paid)}</p>
                    </div>
                </div>
            </Card>
        </div>

        {/* Contract Info */}
        <div className="p-6 space-y-4">
            <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] px-1">Thông tin chi tiết</h3>
            
            <div className="grid grid-cols-1 gap-3">
                <div className="bg-white p-4 rounded-3xl border border-slate-50 shadow-sm flex items-center gap-4">
                    <div className="h-10 w-10 rounded-2xl bg-indigo-50 flex items-center justify-center shrink-0">
                        <Building2 className="h-5 w-5 text-indigo-500" />
                    </div>
                    <div>
                        <p className="text-[9px] font-black text-slate-300 uppercase mb-0.5">Khách hàng</p>
                        <p className="text-[11px] font-black text-slate-800 uppercase italic">{customer?.name}</p>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-3xl border border-slate-50 shadow-sm flex items-center gap-4">
                    <div className="h-10 w-10 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0">
                        <Calendar className="h-5 w-5 text-amber-500" />
                    </div>
                    <div>
                        <p className="text-[9px] font-black text-slate-300 uppercase mb-0.5">Thời hạn hiệu lực</p>
                        <p className="text-[11px] font-black text-slate-800 uppercase italic">
                            {formatDate(contract.startDate)} — {formatDate(contract.endDate)}
                        </p>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-3xl border border-slate-50 shadow-sm flex items-center gap-4">
                    <div className="h-10 w-10 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0">
                        <ShieldCheck className="h-5 w-5 text-emerald-500" />
                    </div>
                    <div>
                        <p className="text-[9px] font-black text-slate-300 uppercase mb-0.5">Phạm vi bảo trì</p>
                        <p className="text-[11px] font-black text-slate-800 uppercase italic">Toàn phần (Standard)</p>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="pt-4 space-y-3">
                <Button className="w-full h-14 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-widest italic flex items-center justify-center gap-2">
                    <Download className="h-5 w-5" /> TẢI FILE HỢP ĐỒNG (PDF)
                </Button>
                <Button variant="outline" className="w-full h-14 rounded-2xl border-slate-200 text-slate-600 font-black uppercase tracking-widest text-[10px]">
                    LIÊN HỆ QUẢN LÝ HỢP ĐỒNG
                </Button>
            </div>
        </div>
      </div>
    </MobileShell>
  );
}
