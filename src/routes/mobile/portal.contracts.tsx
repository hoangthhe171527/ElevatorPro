import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/layout/MobileShell";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/common/StatusBadge";
import { contractStatusLabel, contractStatusVariant } from "@/lib/status-variants";
import { formatDate, formatVND, mockContracts } from "@/lib/mock-data";
import { FileText, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/mobile/portal/contracts")({
  head: () => ({ meta: [{ title: "Hợp đồng khách hàng - Mobile" }] }),
  component: MobilePortalContracts,
});

const CUSTOMER_ID = "c-1";

function MobilePortalContracts() {
  const contracts = mockContracts.filter((c) => c.customerId === CUSTOMER_ID);

  return (
    <MobileShell title="Hợp đồng của tôi" showBackButton backLink="/mobile/portal">
      <div className="min-h-screen bg-slate-50 pb-28 p-4 space-y-4">
        {contracts.map((contract) => {
          const paidPercent = contract.value > 0 ? Math.round((contract.paid / contract.value) * 100) : 0;
          return (
            <Link key={contract.id} to="/mobile/contracts/$contractId" params={{ contractId: contract.id }}>
              <Card className="rounded-3xl bg-white border border-slate-100 p-4 shadow-sm active:scale-[0.99] transition-all">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-[12px] font-black uppercase italic truncate text-slate-900">
                        {contract.code}
                      </h3>
                      <p className="text-[10px] font-semibold text-slate-500 mt-1">
                        {formatDate(contract.startDate)} - {formatDate(contract.endDate)}
                      </p>
                    </div>
                  </div>
                  <StatusBadge variant={contractStatusVariant[contract.status]} className="text-[9px]">
                    {contractStatusLabel[contract.status]}
                  </StatusBadge>
                </div>

                <div className="mt-3 h-2 rounded-full bg-slate-100">
                  <div className="h-2 rounded-full bg-indigo-600" style={{ width: `${paidPercent}%` }} />
                </div>

                <div className="mt-3 flex items-center justify-between text-[10px] font-black uppercase tracking-wide">
                  <span className="text-slate-900">{formatVND(contract.value)}</span>
                  <span className="text-emerald-600">{paidPercent}% đã TT</span>
                  <ChevronRight className="h-4 w-4 text-indigo-600" />
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </MobileShell>
  );
}
