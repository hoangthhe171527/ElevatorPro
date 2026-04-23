import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { cn } from "@/lib/utils";
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
  ClipboardList,
  ShieldCheck
} from "lucide-react";
import { ConvertLeadModal, CreateLeadModal, CreateJobModal, UploadDocumentModal, CreateContractModal } from "@/components/common/Modals";
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
  { key: "new", label: "Mới tạo" },
  { key: "surveying", label: "Đang khảo sát" },
  { key: "surveyed", label: "Đã khảo sát" },
  { key: "quoted", label: "Đã báo giá" },
  { key: "signed", label: "Đã ký" },
];

export function WebLeads() {
  const activeTenantId = useAppStore((s) => s.userId); // Simplified
  const [leads, setLeads] = useState(initialLeads);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [convertLead, setConvertLead] = useState<Lead | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [confirmConvert, setConfirmConvert] = useState<Lead | null>(null);
  const [surveyLead, setSurveyLead] = useState<Lead | null>(null);
  const [uploadQuoteLead, setUploadQuoteLead] = useState<Lead | null>(null);
  const [uploadContractLead, setUploadContractLead] = useState<Lead | null>(null);
  const [confirmContact, setConfirmContact] = useState<Lead | null>(null);
  const [maintenanceContractLead, setMaintenanceContractLead] = useState<Lead | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>("all");

  // Filter out 'signed' leads from the main list as they become 'Customers'
  const filtered = leads.filter((l) => {
    const isSigned = l.status === "signed";
    const matchSearch =
      !search || l.name.toLowerCase().includes(search.toLowerCase()) || l.phone.includes(search);
    const matchStatus = statusFilter === "all" ? !isSigned : l.status === statusFilter;
    const matchType = typeFilter === "all" ? true : l.type === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalValue = filtered.reduce((s, l) => s + l.estimatedValue, 0);

  const handleStatusUpdate = (l: Lead, next: Lead["status"]) => {
    toast.success(`Đã cập nhật: ${leadStatusLabel[next]}`);
    const updated = leads.map((item) => item.id === l.id ? { ...item, status: next } : item);
    setLeads(updated);
  };

  return (
    <AppShell>
      <PageHeader
        title="CRM - Quản lý Khách hàng Tiềm năng"
        description="Theo dõi Lead từ khi tiếp nhận đến khi ký hợp đồng chính thức."
        actions={
          <Button onClick={() => setCreateOpen(true)} className="shadow-sm bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-1.5" /> Tạo Lead mới
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 shadow-none">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="text-xs font-black uppercase text-primary tracking-widest">Giá trị dự kiến</div>
              <TrendingUp className="h-4 w-4 text-primary opacity-60" />
            </div>
            <div className="mt-2 text-3xl font-black text-primary tracking-tight">
              {formatVND(totalValue)}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-none border-dashed bg-muted/20">
          <CardContent className="pt-6">
            <div className="text-xs font-black uppercase text-muted-foreground tracking-widest">Đang chăm sóc</div>
            <div className="mt-2 text-3xl font-black">
              {filtered.length}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-none border-dashed bg-muted/20">
          <CardContent className="pt-6">
            <div className="text-xs font-black uppercase text-muted-foreground tracking-widest">Tỉ lệ chốt tháng</div>
            <div className="mt-2 text-3xl font-black text-success">
              {Math.round((initialLeads.filter(l => l.status === 'signed').length / initialLeads.length) * 100)}%
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
          <Input
            placeholder="Tìm theo tên khách, SĐT hoặc địa chỉ..."
            className="pl-9 h-11 bg-background shadow-sm border-muted transition-all focus:ring-2 focus:ring-primary/20 rounded-xl"
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
          <SelectTrigger className="w-full sm:w-64 h-11 bg-background shadow-sm rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Đang theo đuổi (Chưa chốt)</SelectItem>
            <SelectItem value="signed">Đã ký (Chờ triển khai)</SelectItem>
            {Object.entries(leadStatusLabel).map(([k, v]) => (
              <SelectItem key={k} value={k}>
                {v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={typeFilter}
          onValueChange={(v) => {
            setTypeFilter(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-48 h-11 bg-background shadow-sm rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả loại Lead</SelectItem>
            <SelectItem value="install">Dự án Lắp mới</SelectItem>
            <SelectItem value="maintenance">Dịch vụ Bảo trì</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6">
        {paged.map((l) => {
          const statusIdx = PIPELINE_STAGES.findIndex(s => s.key === l.status);
          
          return (
            <Card key={l.id} className="overflow-hidden border-none shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl">
              <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x border-b">
                <div className="p-6 lg:w-[40%] bg-slate-50/50">
                   <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-2xl bg-white shadow-sm border flex items-center justify-center text-primary">
                          <UserCog className="h-6 w-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-black text-slate-800 leading-tight">{l.name}</h3>
                            <Badge variant="secondary" className={cn(
                              "text-[8px] uppercase font-bold px-1.5 py-0 h-4",
                              l.type === 'install' ? "bg-blue-100 text-blue-700 hover:bg-blue-100" : "bg-purple-100 text-purple-700 hover:bg-purple-100"
                            )}>
                              {l.type === 'install' ? 'Lắp đặt' : 'Bảo trì'}
                            </Badge>
                          </div>
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{l.source}</div>
                        </div>
                      </div>
                   </div>

                   <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                        <Phone className="h-4 w-4 text-primary/60" />
                        {l.phone}
                      </div>
                      <div className="flex items-start gap-3 text-sm font-medium text-slate-600">
                        <MapPin className="h-4 w-4 text-primary/60 mt-0.5" />
                        <span className="leading-snug">{l.address}</span>
                      </div>
                   </div>

                   <div className="bg-white p-3 rounded-xl border border-slate-100 text-xs text-slate-500 italic shadow-sm">
                      "{l.note || "Chưa có ghi chú chăm sóc."}"
                   </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                   <div className="mb-8">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Tiến trình</span>
                          <StatusBadge variant={leadStatusVariant[l.status]} className="mt-1 w-fit uppercase text-[9px] font-black px-2 py-0">
                            {leadStatusLabel[l.status]}
                          </StatusBadge>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Dự kiến</span>
                          <div className="text-xl font-black text-slate-800">{formatVND(l.estimatedValue)}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between relative px-2 mt-6">
                        {PIPELINE_STAGES.map((s, idx) => (
                          <div key={s.key} className="flex flex-col items-center gap-2 z-10">
                            <div className={`h-4 w-4 rounded-full ring-4 ring-white transition-all duration-700 ${idx <= statusIdx ? 'bg-primary shadow-lg shadow-primary/30' : 'bg-slate-200'}`} />
                            <span className={`text-[9px] font-black uppercase tracking-tighter ${idx === statusIdx ? 'text-primary' : 'text-slate-400 opacity-60'}`}>
                              {s.label}
                            </span>
                          </div>
                        ))}
                        <div className="absolute top-2 left-2 right-2 h-0.5 bg-slate-100 rounded-full -z-0" />
                        <div 
                          className="absolute top-2 left-2 h-0.5 bg-primary rounded-full -z-0 transition-all duration-1000" 
                          style={{ width: `${(statusIdx / (PIPELINE_STAGES.length - 1)) * 100}%` }} 
                        />
                      </div>
                   </div>

                   <div className="flex flex-wrap items-center gap-3 mt-auto pt-4 border-t border-slate-50">
                        {l.status === 'new' && (
                          <Button size="sm" className="bg-primary hover:bg-primary/90 h-10 px-4 rounded-xl font-bold gap-2" onClick={() => { setSurveyLead(l); handleStatusUpdate(l, 'surveying'); }}>
                            <ClipboardList className="h-4 w-4" /> Giao kỹ thuật khảo sát
                          </Button>
                        )}
                        
                        {l.status === 'surveying' && (
                           <div className="flex flex-col gap-2 w-full">
                              <div className="flex items-center gap-2 text-xs font-bold text-amber-600 bg-amber-50 p-3 rounded-xl border border-amber-100">
                                <Clock className="h-4 w-4 animate-spin" /> Đang chờ kỹ thuật viên khảo sát thực tế...
                              </div>
                              {/* Bypass for demo if needed */}
                              <Button size="sm" variant="ghost" className="text-[10px] text-slate-400 hover:text-primary self-start" onClick={() => handleStatusUpdate(l, 'surveyed')}>
                                [Demo: Giả lập kỹ thuật báo xong]
                              </Button>
                           </div>
                        )}

                        {l.status === 'surveyed' && (
                           <Button size="sm" className="bg-orange-500 hover:bg-orange-600 h-10 px-4 rounded-xl font-bold gap-2 shadow-lg shadow-orange-200" onClick={() => setUploadQuoteLead(l)}>
                             <FileText className="h-4 w-4" /> Tải lên Báo giá & Chốt
                           </Button>
                        )}

                        {l.status === 'quoted' && (
                           <div className="flex gap-3 w-full">
                              <Button className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-bold gap-2 shadow-lg shadow-indigo-100" onClick={() => setUploadContractLead(l)}>
                                <FileSignature className="h-4 w-4" /> Tải lên Hợp đồng đã ký
                              </Button>
                              <Button variant="outline" className="h-10 rounded-xl font-bold text-slate-400 border-slate-200" onClick={() => handleStatusUpdate(l, 'lost')}>
                                Khách từ chối
                              </Button>
                           </div>
                        )}
                        
                        {l.status === 'signed' && (
                           <div className="flex items-center gap-2 text-success bg-success/10 px-4 py-2 rounded-xl border border-success/20 w-full animate-in zoom-in duration-300">
                             <ShieldCheck className="h-5 w-5" />
                             <span className="text-sm font-black uppercase">Đã chốt - Sẵn sàng triển khai</span>
                             <Button size="sm" className="ml-auto bg-success hover:bg-success/90 rounded-lg text-[10px]" onClick={() => setConfirmConvert(l)}>
                               KÍCH HOẠT DỰ ÁN
                             </Button>
                           </div>
                        )}
                        <div className="flex items-center gap-2 ml-auto">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="font-semibold text-indigo-600" onClick={() => setMaintenanceContractLead(l)}>
                                <ShieldCheck className="h-4 w-4 mr-2" /> Tạo HĐ bảo trì
                              </DropdownMenuItem>
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
      {surveyLead && (
        <CreateJobModal 
          open={true} 
          onClose={() => setSurveyLead(null)} 
          defaultTitle={`Khảo sát: ${surveyLead.name}`} 
          defaultType="inspection" 
          defaultLeadId={surveyLead.id}
          defaultDescription={`Khảo sát hiện trường cho khách hàng ${surveyLead.name}. Địa chỉ: ${surveyLead.address}.`}
        />
      )}
      
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

      {/* B3: Lead → HĐ bảo trì cho KH mới (service_only) */}
      {maintenanceContractLead && (
        <CreateContractModal 
          open={true} 
          onClose={() => {
            setMaintenanceContractLead(null);
          }} 
        />
      )}
    </AppShell>
  );
}
