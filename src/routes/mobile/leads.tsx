import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/layout/MobileShell";
import { mockLeads, formatVND, type Lead } from "@/lib/mock-data";
import { useAppStore } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { leadStatusLabel, leadStatusVariant } from "@/lib/status-variants";
import { Search, Phone, ChevronRight, Plus, UserCheck, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ConvertLeadModal } from "@/components/common/Modals";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { MobileFormDrawer } from "@/components/common/MobileFormDrawer";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/mobile/leads")({
  head: () => ({ meta: [{ title: "CRM Leads — Mobile" }] }),
  component: MobileLeads,
});

const STATUS_TABS = [
  { id: "all", label: "Tất cả" },
  { id: "new", label: "Mới" },
  { id: "contacted", label: "Đã liên hệ" },
  { id: "proposal", label: "Đề xuất" },
  { id: "won", label: "Chốt" },
  { id: "lost", label: "Mất" },
] as const;

function MobileLeads() {
  const activeTenantId = useAppStore((s) => s.activeTenantId);
  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState<string>("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [convertLead, setConvertLead] = useState<Lead | null>(null);
  const [confirmContact, setConfirmContact] = useState<Lead | null>(null);

  // Form states for new lead
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newSource, setNewSource] = useState("Website");
  const [newNote, setNewNote] = useState("");

  const handleCreateLead = () => {
    if (!newName.trim() || !newPhone.trim()) {
      toast.error("Vui lòng nhập tên và số điện thoại");
      return;
    }
    toast.success(`Đã thêm lead mới: ${newName}`);
    setCreateOpen(false);
    setNewName("");
    setNewPhone("");
  };

  const tenantLeads = mockLeads.filter((l) => l.tenantId === activeTenantId);

  const filtered = tenantLeads.filter((l) => {
    const matchSearch =
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.phone.includes(search);
    const matchStatus = activeStatus === "all" || l.status === activeStatus;
    return matchSearch && matchStatus;
  });

  const totalValue = filtered.reduce((s, l) => s + l.estimatedValue, 0);
  const activeLeads = tenantLeads.filter((l) => !["won", "lost"].includes(l.status)).length;

  return (
    <MobileShell title="Phễu bán hàng">
      {/* Stats Header */}
      <div className="px-5 pt-5 pb-4 grid grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl p-3 border border-slate-50 shadow-sm text-center">
          <p className="text-xl font-black text-slate-900">{tenantLeads.length}</p>
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Tổng Lead</p>
        </div>
        <div className="bg-white rounded-2xl p-3 border border-slate-50 shadow-sm text-center">
          <p className="text-xl font-black text-primary">{activeLeads}</p>
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Đang theo dõi</p>
        </div>
        <div className="bg-white rounded-2xl p-3 border border-slate-50 shadow-sm text-center">
          <p className="text-[13px] font-black text-emerald-600 leading-tight">{formatVND(totalValue).replace("₫", "")}</p>
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Giá trị</p>
        </div>
      </div>

      {/* Search + Add */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-3xl z-20 border-b border-slate-100">
        <div className="px-5 pt-3 pb-2 flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Tìm tên, số điện thoại..."
              className="pl-11 h-11 bg-slate-50 border-none shadow-none rounded-2xl text-xs font-bold"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button
            className="h-11 rounded-2xl bg-primary text-white font-black text-[9px] gap-2 px-4 shrink-0 shadow-lg shadow-primary/20"
            onClick={() => setCreateOpen(true)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex gap-2 px-5 pb-3 overflow-x-auto no-scrollbar">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveStatus(tab.id)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest shrink-0 transition-all",
                activeStatus === tab.id
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "bg-slate-100 text-slate-400 hover:bg-slate-200"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5 space-y-4">
        {filtered.map((lead) => (
          <Card key={lead.id} className="p-4 shadow-sm border-none bg-white rounded-[1.5rem]">
            {/* Header */}
            <Link to="/mobile/leads/$leadId" params={{ leadId: lead.id }}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-black text-xs">
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

              <div className="grid grid-cols-2 gap-6 my-3 py-3 border-y border-slate-50">
                <div>
                  <span className="text-[8px] text-slate-400 uppercase font-black tracking-widest block mb-1">Giá trị DK</span>
                  <p className="text-[11px] font-black text-slate-900">{formatVND(lead.estimatedValue)}</p>
                </div>
                <div className="text-right">
                  <span className="text-[8px] text-slate-400 uppercase font-black tracking-widest block mb-1">Follow-up</span>
                  <p className="text-[10px] font-black text-indigo-600">{lead.nextFollowUp || "—"}</p>
                </div>
              </div>
            </Link>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-3">
              <Button
                variant="outline"
                className="flex-1 h-9 rounded-xl gap-1.5 text-[9px] font-black border-slate-100 hover:bg-slate-50 uppercase"
                onClick={() => setConfirmContact(lead)}
              >
                <Phone className="h-3.5 w-3.5 text-primary" /> Liên hệ
              </Button>
              <Button
                className="flex-1 h-9 rounded-xl gap-1.5 text-[9px] font-black uppercase shadow-lg shadow-primary/10"
                disabled={lead.status === "lost" || lead.status === "won"}
                onClick={() => setConvertLead(lead)}
              >
                <UserCheck className="h-3.5 w-3.5" /> Chuyển KH
              </Button>
              <Link to="/mobile/leads/$leadId" params={{ leadId: lead.id }}>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl bg-slate-50 shrink-0">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </Card>
        ))}

        {filtered.length === 0 && (
          <div className="py-20 text-center text-slate-400">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-10" />
            <p className="text-xs font-black uppercase tracking-widest italic">Không tìm thấy kết quả</p>
          </div>
        )}
      </div>

      {/* Modals & Drawers */}
      <MobileFormDrawer
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Thêm Lead Mới"
        description="Nhập thông tin khách hàng tiềm năng"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Tên khách hàng / Tổ chức *</Label>
            <Input 
              placeholder="VD: CC Sunshine" 
              className="h-12 bg-slate-50 border-none rounded-xl"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Số điện thoại *</Label>
            <Input 
              placeholder="09xx..." 
              className="h-12 bg-slate-50 border-none rounded-xl"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Nguồn khách hàng</Label>
            <Select value={newSource} onValueChange={setNewSource}>
              <SelectTrigger className="h-12 bg-slate-50 border-none rounded-xl shadow-none">
                <SelectValue placeholder="Chọn nguồn" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Website">Website</SelectItem>
                <SelectItem value="Referral">Giới thiệu</SelectItem>
                <SelectItem value="Facebook">Facebook</SelectItem>
                <SelectItem value="Tư vấn">Tư vấn trực tiếp</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Ghi chú</Label>
            <Textarea 
              placeholder="Yêu cầu cụ thể của khách..." 
              className="bg-slate-50 border-none rounded-xl min-h-[100px] shadow-none"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
            />
          </div>
          <Button 
            className="w-full h-14 rounded-2xl bg-primary text-white font-black shadow-lg shadow-primary/20 mt-4"
            onClick={handleCreateLead}
          >
            LƯU LEAD MỚI
          </Button>
        </div>
      </MobileFormDrawer>

      {convertLead && (
        <ConvertLeadModal open={true} onClose={() => setConvertLead(null)} lead={convertLead} />
      )}

      <ConfirmationDialog
        open={!!confirmContact}
        onOpenChange={(o) => !o && setConfirmContact(null)}
        title="Xác nhận ghi nhận liên hệ"
        description={`Bạn có chắc chắn muốn xác nhận đã thực hiện cuộc gọi/liên hệ với ${confirmContact?.name}?`}
        onConfirm={() => {
          if (confirmContact) toast.success(`Đã ghi nhận liên hệ với ${confirmContact.name}`);
          setConfirmContact(null);
        }}
      />
    </MobileShell>
  );
}
