import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/layout/MobileShell";
import { mockContracts } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { ShieldCheck, DollarSign } from "lucide-react";

export const Route = createFileRoute("/mobile/contracts/$contractId")({
  head: ({ params }) => ({ meta: [{ title: `Hợp đồng ${params.contractId} — Mobile` }] }),
  component: ContractDetailMobile,
});

function ContractDetailMobile() {
  const { contractId } = Route.useParams();
  const contract = mockContracts.find((c) => c.id === contractId);
  if (!contract) return <div className="p-8 text-center text-slate-400">Contract not found</div>;
  return (
    <MobileShell title="Chi tiết hợp đồng" showBackButton>
      <div className="flex flex-col pb-24">
        <div className="bg-slate-950 pt-8 pb-14 px-6 relative overflow-hidden text-white">
          <h2 className="text-2xl font-black uppercase italic tracking-tight">{contract.contractNumber}</h2>
          <div className="flex items-center gap-2 text-emerald-400 text-[10px] uppercase font-black tracking-widest mt-2"><ShieldCheck className="h-4 w-4" /> HIỆU LỰC</div>
        </div>
        <div className="p-6 -mt-10 relative z-20">
           <Card className="p-6 border-none shadow-2xl bg-white rounded-[2.8rem] flex items-center justify-between">
              <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Giá trị hợp đồng</p><h4 className="text-xl font-black text-slate-900 italic uppercase">{Number(contract.totalValue).toLocaleString()} VNĐ</h4></div>
              <div className="h-10 w-10 rounded-2xl bg-indigo-50 flex items-center justify-center"><DollarSign className="h-5 w-5 text-indigo-600" /></div>
           </Card>
        </div>
      </div>
    </MobileShell>
  );
}
