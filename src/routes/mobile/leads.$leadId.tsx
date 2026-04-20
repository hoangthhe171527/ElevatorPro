import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/layout/MobileShell";
import { mockLeads, formatVND } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { leadStatusLabel, leadStatusVariant } from "@/lib/status-variants";
import { 
  Phone, Mail, MapPin, Calendar, Clock, MessageSquare, 
  ChevronRight, DollarSign, Edit3, ClipboardList, TrendingUp,
  Award, AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/mobile/leads/$leadId")({
  head: () => ({ meta: [{ title: "Chi tiết khách hàng tiềm năng" }] }),
  component: LeadDetailMobile,
});

function LeadDetailMobile() {
  const { leadId } = Route.useParams();
  const lead = mockLeads.find((l) => l.id === leadId);

  if (!lead) {
    return (
      <MobileShell title="Lỗi" showBackButton backLink="/mobile/leads">
        <div className="p-8 text-center">
          <AlertCircle className="h-12 w-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-lg font-black italic uppercase">Không tìm thấy dữ liệu</h2>
        </div>
      </MobileShell>
    );
  }

  // Mock timeline
  const timeline = [
    { time: "Hôm nay, 09:30", action: "Đã liên hệ qua điện thoại", note: "Khách hàng đang cân nhắc báo giá", user: "Nguyễn Văn A" },
    { time: "18 Tháng 4", action: "Đã gửi báo giá V1", note: "Giá trị 850,000,000 VND", user: "Hệ thống" },
    { time: "15 Tháng 4", action: "Thu thập yêu cầu", note: "Dự án biệt thự 5 tầng, thang kính", user: "Trần Thị B" },
    { time: "14 Tháng 4", action: "Lead mới từ Website", note: "Nguồn: Facebook Ads", user: "Hệ thống" },
  ];

  return (
    <MobileShell title={lead.name} showBackButton backLink="/mobile/leads">
      <div className="flex flex-col pb-24">
        {/* Profile Header Block */}
        <div className="px-6 py-6 bg-white border-b border-slate-50">
           <div className="flex justify-between items-start mb-6">
              <div className="h-20 w-20 rounded-[2rem] bg-indigo-50 border-4 border-white shadow-xl flex items-center justify-center text-2xl font-black text-indigo-600">
                {lead.name.split(' ').slice(-1)[0][0]}
              </div>
              <div className="flex flex-col items-end gap-2 text-right">
                 <StatusBadge variant={leadStatusVariant[lead.status]} className="h-6 px-3 text-[10px] font-black uppercase tracking-wider">
                   {leadStatusLabel[lead.status]}
                 </StatusBadge>
                 <span className="text-[10px] font-bold text-slate-400 font-mono tracking-tight">{lead.id}</span>
              </div>
           </div>
           
           <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-tight mb-2">{lead.name}</h2>
           <div className="flex items-center gap-2 text-slate-500 text-[11px] font-bold">
              <TrendingUp className="h-3.5 w-3.5 text-indigo-500" />
              <span>Nguồn: <span className="text-slate-900 uppercase font-black tracking-tight">{lead.source}</span></span>
           </div>
        </div>

        {/* Quick Interaction Bar */}
        <div className="px-6 py-4 flex items-center justify-between gap-3 sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b">
           <Button variant="secondary" className="flex-1 h-12 rounded-2xl bg-indigo-50 text-indigo-600 border-none flex items-center justify-center gap-2 font-black text-xs active:scale-95 transition-all">
              <Phone className="h-4 w-4" /> GỌI
           </Button>
           <Button variant="secondary" className="flex-1 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border-none flex items-center justify-center gap-2 font-black text-xs active:scale-95 transition-all">
              <MessageSquare className="h-4 w-4" /> ZALO
           </Button>
           <Button variant="outline" className="h-12 w-12 rounded-2xl bg-slate-50 border-slate-100 flex items-center justify-center active:scale-95 transition-all shrink-0">
              <Mail className="h-4 w-4 text-slate-400" />
           </Button>
        </div>

        <div className="p-6 space-y-8">
           {/* Financial Context Card */}
           <Card className="p-6 border-none shadow-2xl shadow-indigo-900/5 bg-slate-900 rounded-[2.5rem] relative overflow-hidden">
              <div className="relative z-10">
                 <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.2em] mb-1">Giá trị dự kiến</p>
                 <div className="flex items-baseline gap-2">
                    <h3 className="text-3xl font-black text-white">{formatVND(lead.estimatedValue)}</h3>
                    <div className="bg-indigo-500/20 text-indigo-400 text-[8px] font-black px-2 py-0.5 rounded-full uppercase">High Bio</div>
                 </div>
                 
                 <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-4">
                    <div className="flex flex-col">
                       <span className="text-white/30 text-[8px] font-black uppercase">Ưu tiên</span>
                       <span className="text-white text-[10px] font-black flex items-center gap-1.5 mt-0.5">
                          <Award className="h-3 w-3 text-amber-400" /> Vàng
                       </span>
                    </div>
                    <div className="flex flex-col items-end">
                       <span className="text-white/30 text-[8px] font-black uppercase">Tỉ lệ chốt</span>
                       <span className="text-emerald-400 text-[10px] font-black mt-0.5">75%</span>
                    </div>
                 </div>
              </div>
              <DollarSign className="absolute -top-4 -right-4 h-32 w-32 opacity-5 -rotate-12" />
           </Card>

           {/* Detail Information */}
           <section>
              <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1 mb-4 flex items-center gap-2">
                 <ClipboardList className="h-3.5 w-3.5" /> Thông tin cơ bản
              </h3>
              <div className="space-y-4">
                 {[
                    { icon: Phone, label: "Số điện thoại", value: lead.phone, color: "text-blue-500" },
                    { icon: Mail, label: "Email", value: lead.email, color: "text-rose-500" },
                    { icon: MapPin, label: "Địa chỉ", value: lead.address, color: "text-amber-500" },
                    { icon: Calendar, label: "Follow-up", value: lead.nextFollowUp, color: "text-primary" },
                 ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-4 bg-white rounded-3xl active:bg-slate-50 transition-colors border border-slate-50">
                       <div className={cn("h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 shadow-inner bg-slate-50", item.color)}>
                          <item.icon className="h-4 w-4" />
                       </div>
                       <div className="min-w-0">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-tight">{item.label}</p>
                          <p className="text-[11px] font-black text-slate-900 mt-0.5 break-all">{item.value}</p>
                       </div>
                    </div>
                 ))}
                 
                 <div className="p-4 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Ghi chú quan trọng</p>
                    <p className="text-[11px] font-bold text-slate-600 leading-relaxed italic">
                       &quot;{lead.note || "Chưa có ghi chú cụ thể. Cần bổ sung thông tin sau buổi khảo sát thực tế."}&quot;
                    </p>
                 </div>
              </div>
           </section>

           {/* Activity Timeline */}
           <section className="pb-10">
              <div className="flex items-center justify-between mb-6 px-1">
                 <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5" /> Nhật ký hoạt động
                 </h3>
                 <Button variant="ghost" className="h-6 text-[9px] font-black text-primary p-0">THÊM MỚI</Button>
              </div>
              
              <div className="space-y-0 pl-1 border-l-2 border-slate-100 ml-3">
                 {timeline.map((item, idx) => (
                    <div key={idx} className="relative pb-8 pl-8 last:pb-2">
                       {/* Indicator Circle */}
                       <div className="absolute left-[-9px] top-0 h-4 w-4 rounded-full bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center">
                          <div className={cn("h-1.5 w-1.5 rounded-full", idx === 0 ? "bg-primary animate-pulse" : "bg-slate-400")} />
                       </div>
                       
                       <div className="flex items-baseline justify-between mb-1">
                          <span className="text-[10px] font-black text-slate-900">{item.action}</span>
                          <span className="text-[8px] font-bold text-slate-400 uppercase">{item.time}</span>
                       </div>
                       <p className="text-[10px] text-slate-500 font-medium leading-relaxed mb-1.5">{item.note}</p>
                       <div className="flex items-center gap-1.5 opacity-60">
                          <div className="h-4 w-4 rounded-full bg-slate-200 flex items-center justify-center text-[7px] font-black">
                            {item.user[0]}
                          </div>
                          <span className="text-[8px] font-bold uppercase">{item.user}</span>
                       </div>
                    </div>
                 ))}
              </div>
           </section>
        </div>

        {/* Global CTA - Bottom of detail */}
        <div className="px-6 py-6 bg-slate-50 border-t border-slate-100 text-center">
            <Button className="w-full h-14 rounded-[1.5rem] bg-indigo-600 text-white font-black text-sm shadow-xl shadow-indigo-600/20 gap-3 group">
               TẠO BÁO GIÁ NHANH <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <p className="text-[9px] font-black text-slate-400 mt-4 uppercase tracking-[0.2em] italic underline underline-offset-4 decoration-slate-200">Ký hợp đồng trực tiếp? Thao tác tại Admin Panel</p>
        </div>
      </div>
    </MobileShell>
  );
}
