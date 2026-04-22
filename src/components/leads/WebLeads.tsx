import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataPagination } from "@/components/common/DataPagination";
import { StatusBadge } from "@/components/common/StatusBadge";
import { leadStatusLabel, leadStatusVariant } from "@/lib/status-variants";
import { 
  mockLeads as initialLeads, 
  formatVND, 
  type Lead
} from "@/lib/mock-data";
import { 
  Plus, 
  Phone, 
  Mail, 
  MapPin, 
  Search, 
  UserCog, 
  Send, 
  CheckCircle2, 
  Clock, 
  MoreVertical,
  TrendingUp,
  UserPlus,
  FileSignature,
  FileText,
  ClipboardList
} from "lucide-react";
import { ConvertLeadModal, CreateLeadModal, CreateJobModal, UploadDocumentModal } from "@/components/common/Modals";
import { toast } from "sonner";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { useAppStore } from "@/lib/store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const PAGE_SIZE = 6;

const PIPELINE_STAGES: { key: Lead["status"]; label: string }[] = [
  { key: "new", label: "Mới" },
  { key: "contacted", label: "Tiếp cận" },
  { key: "quoted", label: "Báo giá" },
  { key: "contract_pending", label: "Chờ ký HĐ" },
  { key: "won", label: "Đã chốt" },
];

export function WebLeads() {
  const activeTenantId = useAppStore((s) => s.activeTenantId);
  const [leads, setLeads] = useState(initialLeads);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [convertLead, setConvertLead] = useState<Lead | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [confirmContact, setConfirmContact] = useState<Lead | null>(null);
  const [confirmConvert, setConfirmConvert] = useState<Lead | null>(null);
  const [surveyLead, setSurveyLead] = useState<Lead | null>(null);
  const [uploadQuoteLead, setUploadQuoteLead] = useState<Lead | null>(null);
  const [uploadContractLead, setUploadContractLead] = useState<Lead | null>(null);

  const filtered = leads.filter((l) => {
    const matchTenant = l.tenantId === activeTenantId;
    const matchSearch =
      !search || l.name.toLowerCase().includes(search.toLowerCase()) || l.phone.includes(search);
    const matchStatus = statusFilter === "all" || l.status === statusFilter;
    return matchTenant && matchSearch && matchStatus;
  });

  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalValue = filtered.reduce((s, l) => s + l.estimatedValue, 0);

  const handleStatusUpdate = (l: Lead, next: Lead["status"]) => {
    if (activeTenantId === "t-1" && next === "quoted" && l.status === "contacted") {
      next = "quote_pending";
      toast.info("Đã chuyển trạng thái sang Chờ duyệt báo giá.");
    } else if (activeTenantId === "t-2") {
      const msgs: Record<string, string> = {
        quoted: "Đã xác nhận gửi báo giá.",
        contract_pending: "Đang chờ ký HĐ.",
        won: "Hợp đồng đã ký!",
        lost: "Ghi nhận Lead thất bại."
      };
      if (msgs[next]) toast.success(msgs[next]);
    } else {
      toast.success(`Đã cập nhật: ${leadStatusLabel[next]}`);
    }

    const updated = leads.map((item) => item.id === l.id ? { ...item, status: next } : item);
    setLeads(updated);
  };

  return (
    <AppShell>
      <PageHeader
        title="Quản lý khách hàng tiềm năng"
        description="Đầu phễu bán hàng - Theo dõi và tối ưu tỉ lệ chuyển đổi."
        actions={
          <Button onClick={() => setCreateOpen(true)} className="shadow-sm">
            <Plus className="h-4 w-4 mr-1.5" /> Tạo Lead mới
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 shadow-none">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold uppercase text-primary tracking-wider">Tổng giá trị phễu</div>
              <TrendingUp className="h-4 w-4 text-primary opacity-60" />
            </div>
            <div className="mt-2 text-3xl font-black text-primary tracking-tight">
              {formatVND(totalValue)}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-none border-dashed bg-muted/20">
          <CardContent className="pt-6">
            <div className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Lead đang theo đuổi</div>
            <div className="mt-2 text-3xl font-black">
              {filtered.filter((l) => !["won", "lost"].includes(l.status)).length}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-none border-dashed bg-muted/20">
          <CardContent className="pt-6">
            <div className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Tỉ lệ chốt (Ước tính)</div>
            <div className="mt-2 text-3xl font-black text-success">
              {filtered.length > 0 ? Math.round((filtered.filter(l => l.status === 'won').length / filtered.length) * 100) : 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
          <Input
            placeholder="Tìm theo tên dự án, số điện thoại hoặc địa chỉ..."
            className="pl-9 h-11 bg-background shadow-sm border-muted transition-all focus:ring-2 focus:ring-primary/20"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(v) => {
            setStatusFilter(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-56 h-11 bg-background shadow-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            {Object.entries(leadStatusLabel).map(([k, v]) => (
              <SelectItem key={k} value={k}>
                {v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6">
        {paged.map((l) => {
          const statusIdx = PIPELINE_STAGES.findIndex(s => s.key === l.status);
          
          return (
            <Card key={l.id} className="overflow-hidden group hover:shadow-xl hover:border-primary/30 transition-all duration-300">
              <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x border-b">
                <div className="p-5 lg:w-[45%] bg-muted/10">
                   <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                          <UserCog className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg leading-none mb-1">{l.name}</h3>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground uppercase font-bold tracking-tight">
                            <span>ID: {l.id}</span>
                            <span className="opacity-30">•</span>
                            <span>{l.source}</span>
                          </div>
                        </div>
                      </div>
                      <StatusBadge variant={leadStatusVariant[l.status]}>
                        {leadStatusLabel[l.status]}
                      </StatusBadge>
                   </div>

                   <div className="space-y-2.5 mb-5">
                      <div className="flex items-center gap-2.5 text-sm">
                        <Phone className="h-4 w-4 text-primary opacity-60" />
                        <span className="font-medium">{l.phone}</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-sm">
                        <MapPin className="h-4 w-4 text-primary opacity-60" />
                        <span className="text-muted-foreground truncate">{l.address}</span>
                      </div>
                      {l.email && (
                        <div className="flex items-center gap-2.5 text-sm">
                          <Mail className="h-4 w-4 text-primary opacity-60" />
                          <span className="text-muted-foreground">{l.email}</span>
                        </div>
                      )}
                   </div>

                   {l.note && (
                     <div className="bg-background/80 p-3 rounded-lg border border-dashed text-xs text-muted-foreground italic line-clamp-2">
                        "{l.note}"
                     </div>
                   )}
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                   <div className="mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Tiến trình CRM</span>
                        <span className="text-lg font-black text-primary">{formatVND(l.estimatedValue)}</span>
                      </div>
                      
                      <div className="flex items-center justify-between relative px-2">
                        {PIPELINE_STAGES.map((s, idx) => (
                          <div key={s.key} className="flex flex-col items-center gap-2 z-10">
                            <div className={`h-3 w-3 rounded-full ring-4 ring-background transition-all duration-500 ${idx <= statusIdx ? 'bg-primary scale-125 shadow-md shadow-primary/30' : 'bg-muted'}`} />
                            <span className={`text-[11px] font-bold ${idx === statusIdx ? 'text-primary' : 'text-muted-foreground opacity-50'}`}>
                              {s.label}
                            </span>
                          </div>
                        ))}
                        <div className="absolute top-1.5 left-2 right-2 h-1 bg-muted rounded-full -z-0" />
                        <div 
                          className="absolute top-1.5 left-2 h-1 bg-primary rounded-full -z-0 transition-all duration-1000" 
                          style={{ width: `${(statusIdx / (PIPELINE_STAGES.length - 1)) * 100}%` }} 
                        />
                      </div>
                   </div>

                   <div className="flex flex-wrap items-center justify-between gap-4 pt-4 mt-auto">
                      <div className="flex flex-wrap gap-2">
                        {l.status === 'new' && (
                          <Button size="sm" onClick={() => handleStatusUpdate(l, 'contacted')}>
                            <Phone className="h-3.5 w-3.5 mr-1.5" /> Ghi nhận liên hệ
                          </Button>
                        )}
                         {l.status === 'contacted' && (
                           <div className="flex gap-2">
                             <Button size="sm" variant="outline" className="border-indigo-600 text-indigo-600 hover:bg-indigo-50" onClick={() => setSurveyLead(l)}>
                               <Clock className="h-3.5 w-3.5 mr-1.5" /> Tạo lịch khảo sát
                             </Button>
                             <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 shadow-md" onClick={() => handleStatusUpdate(l, 'quoted')}>
                               <Send className="h-3.5 w-3.5 mr-1.5" /> 
                               Chuyển báo giá
                             </Button>
                           </div>
                         )}

                        {l.status === 'quoted' && (
                           <Button size="sm" className="bg-orange-500 hover:bg-orange-600 shadow-md" onClick={() => { !l.quoteFileUrl ? setUploadQuoteLead(l) : handleStatusUpdate(l, 'contract_pending'); }}>
                             <FileSignature className="h-3.5 w-3.5 mr-1.5" /> 
                             {l.quoteFileUrl ? "Tiến hành Hợp đồng" : "Tải lên Báo giá & Chốt"}
                           </Button>
                        )}
                        
                        {l.status === 'contract_pending' && (
                           <Button size="sm" className="bg-success hover:bg-success/90 shadow-md" onClick={() => { !l.contractFileUrl ? setUploadContractLead(l) : setConfirmConvert(l); }}>
                             <FileText className="h-3.5 w-3.5 mr-1.5" /> 
                             {l.contractFileUrl ? "Xác nhận HĐ đã ký" : "Tải lên Hợp đồng & Chốt"}
                           </Button>
                        )}

                        {l.status === 'quote_pending' && (
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 border border-orange-200 rounded-lg text-orange-700 text-xs font-bold animate-pulse">
                            <Clock className="h-3.5 w-3.5" /> Chờ duyệt...
                          </div>
                        )}
                        {l.status === 'won' && (
                          <div className="flex items-center gap-2 text-success font-bold text-sm">
                            <CheckCircle2 className="h-4 w-4" /> Đã chuyển đổi dự án
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="text-destructive font-semibold" onClick={() => handleStatusUpdate(l, 'lost')}>
                              Ghi nhận thất bại (Lost)
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setConfirmContact(l)}>
                              Log hoạt động chăm sóc
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                   </div>
                </div>
              </div>
            </Card>
          );
        })}

        {paged.length === 0 && (
          <div className="p-20 text-center bg-muted/10 rounded-2xl border-2 border-dashed">
            <UserPlus className="h-16 w-16 mx-auto mb-4 opacity-10" />
            <p className="text-muted-foreground font-medium">Không tìm thấy khách hàng nào</p>
          </div>
        )}
      </div>

      <div className="mt-6">
        <DataPagination page={page} pageSize={PAGE_SIZE} total={filtered.length} onPageChange={setPage} />
      </div>

      {convertLead && <ConvertLeadModal open={true} onClose={() => setConvertLead(null)} lead={convertLead} />}
      <CreateLeadModal open={createOpen} onClose={() => setCreateOpen(false)} />
      {surveyLead && <CreateJobModal open={true} onClose={() => setSurveyLead(null)} defaultTitle={`Khảo sát: ${surveyLead.name}`} defaultType="inspection" />}
      
      <ConfirmationDialog
        open={!!confirmContact}
        onOpenChange={(o) => !o && setConfirmContact(null)}
        title="Nhật ký chăm sóc"
        description="Ghi nhận hoạt động chăm sóc LEAD"
        onConfirm={() => {
          if (confirmContact) toast.success(`Đã ghi nhận chăm sóc Lead: ${confirmContact.name}`);
          setConfirmContact(null);
        }}
      />

      <ConfirmationDialog
        open={!!confirmConvert}
        onOpenChange={(o) => !o && setConfirmConvert(null)}
        title="Xác nhận chốt hợp đồng"
        description="Lead chắc chắn đã chốt và chuyển sang dự án mới?"
        onConfirm={() => {
          if (confirmConvert) setConvertLead(confirmConvert);
          setConfirmConvert(null);
        }}
        variant="success"
        confirmText="Bắt đầu triển khai"
      />
      
      {uploadQuoteLead && (
        <UploadDocumentModal 
          open={true}
          onClose={() => setUploadQuoteLead(null)}
          title={`Báo giá cho: ${uploadQuoteLead.name}`}
          onUploadSuccess={(url) => {
            const updated = leads.map(item => item.id === uploadQuoteLead.id ? { ...item, quoteFileUrl: url } : item);
            setLeads(updated);
            toast.success("Hệ thống đã lưu Báo giá.");
          }}
        />
      )}
       {uploadContractLead && (
         <UploadDocumentModal 
           open={true}
           onClose={() => setUploadContractLead(null)}
           title={`Hợp đồng cho: ${uploadContractLead.name}`}
           onUploadSuccess={(url) => {
             const updated = leads.map(item => item.id === uploadContractLead.id ? { ...item, contractFileUrl: url } : item);
             setLeads(updated);
             toast.success("Hệ thống đã lưu Hợp đồng.");
           }}
         />
       )}
    </AppShell>
  );
}
