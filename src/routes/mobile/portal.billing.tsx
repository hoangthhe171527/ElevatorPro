import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/layout/MobileShell";
import { canAccessMobilePath } from "@/lib/mobile-policy";
import { useCurrentPermissions, useMainRole } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/common/StatusBadge";
import { contractStatusLabel, contractStatusVariant } from "@/lib/status-variants";
import { mockContracts, formatVND, formatDate } from "@/lib/mock-data";
import { FileText, CreditCard, ChevronRight, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/mobile/portal/billing")({
  head: () => ({ meta: [{ title: "Tài chính & Thanh toán — Mobile" }] }),
  component: CustomerBilling,
});

const CUSTOMER_ID = "c-1";

function CustomerBilling() {
  const role = useMainRole();
  const permissions = useCurrentPermissions();

  if (!canAccessMobilePath("/mobile/portal/billing", role, permissions)) {
    return (
      <MobileShell title="Không có quyền truy cập">
        <div className="min-h-screen bg-slate-50 px-4 pt-4 pb-36">
          <Card className="p-6 text-center rounded-2xl border-slate-100">
            <p className="text-sm font-semibold text-slate-900">Màn tài chính portal chỉ dành cho khách hàng.</p>
            <Link to="/mobile" className="inline-block mt-4">
              <span className="inline-flex h-10 items-center rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white">Về trang chính mobile</span>
            </Link>
          </Card>
        </div>
      </MobileShell>
    );
  }

  const myContracts = mockContracts.filter((c) => c.customerId === CUSTOMER_ID);
  const totalValue = myContracts.reduce((sum, c) => sum + c.value, 0);
  const totalPaid = myContracts.reduce((sum, c) => sum + c.paid, 0);
  const balance = totalValue - totalPaid;

  return (
    <MobileShell title="Tài chính" backLink="/mobile/portal">
      <div className="flex flex-col pb-24">
        {/* Summary Card */}
        <div className="bg-slate-900 px-6 pt-8 pb-16 relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em]">Tổng dư nợ</p>
                <h1 className="text-3xl font-black text-white mt-1 italic italic">{formatVND(balance)}</h1>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-indigo-400" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-3xl border border-white/10">
                <p className="text-[9px] font-black text-white/40 uppercase mb-1">Đã thanh toán</p>
                <p className="text-sm font-black text-emerald-400">{formatVND(totalPaid)}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-3xl border border-white/10">
                <p className="text-[9px] font-black text-white/40 uppercase mb-1">Giá trị HĐ</p>
                <p className="text-sm font-black text-white">{formatVND(totalValue)}</p>
              </div>
            </div>
          </div>
          <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl" />
        </div>

        <div className="px-6 -mt-8 relative z-20 space-y-6">
          <section>
            <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-4 px-1">Lịch sử hợp đồng</h3>
            <div className="space-y-3">
              {myContracts.map((c) => (
                <Link key={c.id} to="/mobile/portal/contracts/$contractId" params={{ contractId: c.id }}>
                  <Card className="p-5 border-none shadow-sm bg-white rounded-[2rem] active:scale-[0.98] transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-black text-sm text-slate-900 uppercase italic">{c.code}</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Hết hạn: {formatDate(c.endDate)}</p>
                      </div>
                      <StatusBadge variant={contractStatusVariant[c.status]} className="h-5 px-2 text-[8px]">
                        {contractStatusLabel[c.status]}
                      </StatusBadge>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-3 w-3 text-emerald-500" />
                        <span className="text-[11px] font-black text-slate-700 italic">{formatVND(c.paid)}</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-200" />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </MobileShell>
  );
}
