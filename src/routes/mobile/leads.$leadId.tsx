import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/layout/MobileShell";
import { mockLeads, formatDateTime } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { User, Phone, Mail, MapPin, Calendar, MessageSquare, Clock, ChevronRight, TrendingUp, DollarSign, Zap, Award, ArrowUpRight, Building2, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";

export const Route = createFileRoute("/mobile/leads/$leadId")({
  head: ({ params }) => ({ meta: [{ title: `Tiềm năng ${params.leadId} — Mobile` }] }),
  component: LeadDetailMobile,
});

function LeadDetailMobile() {
  const { leadId } = Route.useParams();
  const lead = mockLeads.find((l) => l.id === leadId);
  const [convertOpen, setConvertOpen] = useState(false);
  if (!lead) return <div className="p-8 text-center text-slate-400">Lead not found</div>;

  const interactions = [
    { date: "18/04/2026", type: "Cuộc gọi", desc: "Tư vấn báo giá thang 450kg", icon: "Phone" },
    { date: "15/04/2026", type: "Gặp mặt", desc: "Khảo sát mặt bằng tầng hầm", icon: "User" },
    { date: "10/04/2026", type: "Email", desc: "Gửi hồ sơ năng lực công ty", icon: "Mail" }
  ];

  const handleConvert = () => {
    toast.success("TIỀM NĂNG ĐÃ ĐƯỢC CHUYỂN ĐỔI");
    setConvertOpen(false);
  };

  return (
    <MobileShell title="Chi tiết tiềm năng" showBackButton>
      <div className="flex flex-col pb-24">
        <div className="bg-indigo-900 pt-8 pb-14 px-6 relative overflow-hidden">
          <div className="relative z-10 text-white">
            <div className="flex justify-between items-start mb-4 text-white">
              <div className="flex flex-col gap-1">
                <StatusBadge variant="muted" className="bg-white/10 text-white border-none w-fit py-0.5 px-2 text-[9px] font-black uppercase tracking-tighter shadow-lg">{lead.source}</StatusBadge>
                <h2 className="text-2xl font-black text-white mt-2 leading-none uppercase italic tracking-tight">{lead.name}</h2>
              </div>
              <div className="h-14 w-14 rounded-3xl bg-indigo-500/30 backdrop-blur-md flex items-center justify-center border border-white/10 shadow-2xl"><User className="h-7 w-7 text-indigo-100" /></div>
            </div>
          </div>
        </div>
        <div className="p-6 -mt-10 relative z-20 space-y-8">
           <Card className="p-7 border-none shadow-2xl shadow-indigo-900/5 bg-white rounded-[2.8rem] space-y-6">
              <div className="flex items-center justify-between">
                 <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none text-slate-400">Ước tính giá trị</p>
                    <h4 className="text-2xl font-black text-slate-900 tracking-tighter italic uppercase">{Number(lead.estimatedValue).toLocaleString()} <span className="text-sm font-bold opacity-50 not-italic">VNĐ</span></h4>
                 </div>
                 <div className="h-12 w-12 rounded-[1.4rem] bg-indigo-50 flex items-center justify-center"><DollarSign className="h-6 w-6 text-indigo-600" /></div>
              </div>
           </Card>
        </div>
      </div>
      <ConfirmationDialog open={convertOpen} onOpenChange={setConvertOpen} title="Xác nhận?" description="Convert lead?" onConfirm={handleConvert} />
    </MobileShell>
  );
}
