import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { MobileShell } from "@/components/layout/MobileShell";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/common/StatusBadge";
import { contractStatusLabel, contractStatusVariant } from "@/lib/status-variants";
import { formatDate, formatVND, mockContracts } from "@/lib/mock-data";
import { FileText, Calendar, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/mobile/contracts")({
  head: () => ({ meta: [{ title: "Hợp đồng - Mobile" }] }),
  component: MobileContractsList,
});

function MobileContractsList() {
  const contracts = useMemo(
    () => [...mockContracts].sort((a, b) => b.startDate.localeCompare(a.startDate)),
    [],
  );

  return (
    <MobileShell title="Hợp đồng" showBackButton backLink="/mobile/">
      <div className="min-h-screen bg-slate-50 pb-28">
        <div className="bg-slate-900 px-6 pt-8 pb-10 text-white">
          <h1 className="text-xl font-black italic tracking-tight uppercase">Contract Center</h1>
          <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300">
            {contracts.length} hợp đồng trong hệ thống
          </p>
        </div>

        <div className="px-5 -mt-5 space-y-3">
          {contracts.map((contract) => {
            const paidPercent = contract.value > 0 ? Math.round((contract.paid / contract.value) * 100) : 0;
            return (
              <Link
                key={contract.id}
                to="/mobile/contracts/$contractId"
                params={{ contractId: contract.id }}
                className="block"
              >
                <Card className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm active:scale-[0.99] transition">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-11 w-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="truncate text-[12px] font-black uppercase tracking-tight text-slate-900">
                          {contract.code}
                        </h3>
                        <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-500 font-semibold">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(contract.startDate)} - {formatDate(contract.endDate)}</span>
                        </div>
                      </div>
                    </div>
                    <StatusBadge variant={contractStatusVariant[contract.status]} className="text-[9px]">
                      {contractStatusLabel[contract.status]}
                    </StatusBadge>
                  </div>

                  <div className="mt-3 rounded-2xl bg-slate-50 p-3 border border-slate-100">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase">
                      <span className="text-slate-400">Đã thanh toán</span>
                      <span className="text-emerald-600">{paidPercent}%</span>
                    </div>
                    <div className="mt-2 h-2 w-full rounded-full bg-slate-200">
                      <div className="h-2 rounded-full bg-indigo-600" style={{ width: `${paidPercent}%` }} />
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[11px] font-black">
                      <span className="text-slate-900">{formatVND(contract.value)}</span>
                      <span className="text-slate-400">{formatVND(contract.paid)}</span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-end text-indigo-600 text-[10px] font-black uppercase tracking-widest">
                    Xem chi tiết <ChevronRight className="ml-1 h-3.5 w-3.5" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </MobileShell>
  );
}
