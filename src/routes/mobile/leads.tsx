import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/layout/MobileShell";
import { mockLeads, formatVND } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { leadStatusLabel, leadStatusVariant } from "@/lib/status-variants";
import { Search, Phone, ChevronRight, Plus, Filter, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/mobile/leads")({
  head: () => ({ meta: [{ title: "CRM Leads — Mobile" }] }),
  component: MobileLeads,
});

function MobileLeads() {
  const [search, setSearch] = useState("");

  const filtered = mockLeads.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.id.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <MobileShell title="Phễu bán hàng">
      {/* Search & Header Stats */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-md z-20 px-5 py-4 border-b">
         <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
               <TrendingUp className="h-4 w-4 text-primary" />
               <h3 className="text-sm font-black tracking-tight">{mockLeads.length} Cơ hội</h3>
            </div>
            <div className="flex gap-2">
               <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl bg-slate-50 border">
                  <Filter className="h-4 w-4 text-slate-500" />
               </Button>
               <Button className="h-9 rounded-xl bg-primary text-white font-black text-[10px] gap-2 px-4 shadow-lg shadow-primary/20">
                  <Plus className="h-4 w-4" /> THÊM MỚI
               </Button>
            </div>
         </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-50" />
          <Input
            placeholder="Tìm theo tên hoặc mã khách..."
            className="pl-9 h-11 bg-slate-50 border-none shadow-inner rounded-xl text-xs font-bold"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="p-5 space-y-4">
        {filtered.map((lead) => (
          <Link key={lead.id} to="/mobile/leads/$leadId" params={{ leadId: lead.id }}>
            <Card
              className="p-4 shadow-sm border-none bg-white rounded-[1.5rem] active:scale-[0.97] transition-all mb-4"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 font-black text-xs">
                    {lead.name.split(" ").slice(-1)[0][0]}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-black text-slate-900 text-[13px] leading-none tracking-tight">{lead.name}</h3>
                    <span className="text-[9px] text-slate-400 mt-1.5 block font-bold uppercase tracking-widest">
                      {lead.id} • {lead.source}
                    </span>
                  </div>
                </div>
                <StatusBadge variant={leadStatusVariant[lead.status]} className="h-5 text-[8px] px-2 font-black">
                  {leadStatusLabel[lead.status]}
                </StatusBadge>
              </div>

              <div className="grid grid-cols-2 gap-6 my-4 py-4 border-y border-slate-50">
                <div className="flex flex-col gap-1">
                  <span className="text-[8px] text-slate-400 uppercase font-black tracking-widest">
                    Giá trị dự kiến
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-black text-slate-900">
                    {formatVND(lead.estimatedValue)}
                  </div>
                </div>
                <div className="flex flex-col gap-1 items-end">
                  <span className="text-[8px] text-slate-400 uppercase font-black tracking-widest text-right">
                    Follow-up
                  </span>
                  <div className="flex items-center gap-1 text-[10px] font-black text-indigo-600">
                    {lead.nextFollowUp}
                  </div>
                </div>
              </div>

              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-1.5 opacity-40">
                   <Phone className="h-3 w-3" />
                   <span className="text-[9px] font-black">{lead.phone}</span>
                </div>
                <div className="text-primary font-black text-[10px] flex items-center gap-1">
                   CHI TIẾT <ChevronRight className="h-3 w-3" />
                </div>
              </div>
            </Card>
          </Link>
        ))}

        {filtered.length === 0 && (
          <div className="py-20 text-center text-slate-400">
             <Search className="h-12 w-12 mx-auto mb-4 opacity-10" />
             <p className="text-xs font-black uppercase tracking-widest italic">Không tìm thấy kết quả</p>
          </div>
        )}
      </div>
    </MobileShell>
  );
}
