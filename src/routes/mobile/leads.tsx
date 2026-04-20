import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/layout/MobileShell";
import { mockLeads, formatVND } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { leadStatusLabel, leadStatusVariant } from "@/lib/status-variants";
import { Users, Search, Phone, Mail, Calendar, DollarSign, ChevronRight, Plus } from "lucide-react";
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
    <MobileShell title="Khách hàng tiềm năng">
      <div className="sticky top-0 bg-slate-50/80 backdrop-blur-sm z-20 px-4 py-3 border-b flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm tên hoặc SĐT..."
            className="pl-9 bg-background border-none shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button size="icon" className="h-[42px] w-[42px] rounded-xl bg-primary text-white shrink-0">
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      <div className="p-4 space-y-4">
        {filtered.map((lead) => (
          <Card
            key={lead.id}
            className="p-4 shadow-sm border-none bg-background active:scale-[0.98] transition-all"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs uppercase">
                  {lead.name
                    .split(" ")
                    .slice(-2)
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-none">{lead.name}</h3>
                  <span className="text-[10px] text-muted-foreground mt-1 block font-mono">
                    {lead.id}
                  </span>
                </div>
              </div>
              <StatusBadge variant={leadStatusVariant[lead.status]}>
                {leadStatusLabel[lead.status]}
              </StatusBadge>
            </div>

            <div className="grid grid-cols-2 gap-4 my-4">
              <div className="flex flex-col gap-1">
                <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">
                  Giá trị dự kiến
                </span>
                <div className="flex items-center gap-1 text-sm font-bold text-primary">
                  <DollarSign className="h-3.5 w-3.5" />
                  {formatVND(lead.estimatedValue)}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">
                  Hẹn chăm sóc
                </span>
                <div className="flex items-center gap-1 text-xs font-semibold">
                  <Calendar className="h-3.5 w-3.5 text-blue-500" />
                  {lead.nextFollowUp}
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 pt-3 border-t border-slate-100">
              <Button
                variant="outline"
                className="flex-1 text-[11px] font-bold h-9 rounded-lg gap-2"
              >
                <Phone className="h-3.5 w-3.5" /> GỌI ĐIỆN
              </Button>
              <Button
                variant="outline"
                className="flex-1 text-[11px] font-bold h-9 rounded-lg gap-2"
              >
                <Mail className="h-3.5 w-3.5" /> EMAIL
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg bg-slate-50">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </MobileShell>
  );
}
