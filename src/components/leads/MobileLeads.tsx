import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/common/StatusBadge";;
import { leadStatusLabel, leadStatusVariant } from "@/lib/status-variants";
import { mockLeads as initialLeads, formatVND, type Lead, type LeadStatus } from "@/lib/mock-data";
import {
  Plus,
  Phone,
  MapPin,
  Search,
  UserCog,
  Send,
  CheckCircle2,
  Clock,
  TrendingUp,
  FileSignature,
  FileText,
  X,
} from "lucide-react";
import {
  ConvertLeadModal,
  CreateLeadModal,
  CreateJobModal,
  UploadDocumentModal,
} from "@/components/common/Modals";
import { toast } from "sonner";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { useAppStore, useCurrentPermissions, useCurrentUser } from "@/lib/store";
import { cn } from "@/lib/utils";

const PIPELINE_STAGES: { key: Lead["status"]; label: string }[] = [
  { key: "new", label: "Mới" },
  { key: "surveying", label: "Khảo sát" },
  { key: "surveyed", label: "Đã KS" },
  { key: "quoted", label: "Báo giá" },
  { key: "signed", label: "Đã ký" },
];

export function MobileLeads() {
  const activeTenantId = useAppStore((s) => s.activeTenantId);
  const currentUser = useCurrentUser();
  const permissions = useCurrentPermissions();
  const canManageLeadFlow =
    permissions.includes("sales_admin") ||
    permissions.includes("tech_manager") ||
    permissions.includes("tech_manager");
  const canSalesCare = canManageLeadFlow || permissions.includes("sales");
  const canCreateLead = canSalesCare;
  const isSalesOnly = permissions.includes("sales") && !canManageLeadFlow;
  const [leads, setLeads] = useState(initialLeads);
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
    const matchOwner = !isSalesOnly || l.assignedTo === currentUser.id;
    const matchSearch =
      !search || l.name.toLowerCase().includes(search.toLowerCase()) || l.phone.includes(search);
    const matchStatus = statusFilter === "all" || l.status === statusFilter;
    return matchTenant && matchOwner && matchSearch && matchStatus;
  });

  const totalValue = filtered.reduce((s, l) => s + l.estimatedValue, 0);

  const handleStatusUpdate = (l: Lead, next: Lead["status"]) => {
    if (next === "quoted" && !l.quoteFileUrl) {
      toast.error("Sales Admin phải tải file báo giá trước khi chuyển trạng thái Đã báo giá.");
      return;
    }
    if (next === "signed" && (!l.quoteFileUrl || !l.contractFileUrl)) {
      toast.error("Thiếu file báo giá hoặc hợp đồng đã ký. Không thể chốt Signed.");
      return;
    }
    toast.success(`Đã cập nhật: ${leadStatusLabel[next]}`);

    const updated = leads.map((item) => (item.id === l.id ? { ...item, status: next } : item));
    setLeads(updated);
  };

  return (
    <AppShell>
      <PageHeader
        title="CRM & Leads"
        description="Đầu phễu bán hàng"
        actions={
          <Button
            size="sm"
            className="h-8 rounded-full px-3 text-[11px] font-black uppercase"
            onClick={() => setCreateOpen(true)}
            disabled={!canCreateLead}
            title={!canCreateLead ? "Role hiện tại không có quyền tạo Lead" : undefined}
          >
            <Plus className="h-3 w-3 mr-1.5" /> Tạo
          </Button>
        }
      />

      {/* Top Banner */}
      <div className="bg-gradient-to-br from-indigo-500 to-primary text-white rounded-[2rem] p-6 mb-6 shadow-xl shadow-primary/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <TrendingUp className="h-32 w-32" />
        </div>
        <div className="relative z-10">
          <h3 className="text-[11px] font-bold text-white/70 uppercase tracking-widest mb-1">
            Giá trị phễu dự kiến
          </h3>
          <div className="text-[32px] font-black tracking-tight mb-6">{formatVND(totalValue)}</div>
          <div className="flex items-center justify-between gap-4 pt-4 border-t border-white/20 mt-4">
            <div>
              <div className="text-[9px] font-bold text-white/70 uppercase tracking-widest mb-0.5">
                Đang theo đuổi
              </div>
              <div className="text-xl font-bold">
                {filtered.filter((l) => !["signed", "lost"].includes(l.status)).length} Lead
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern App Search & Filter Row */}
      <div className="flex flex-col gap-3 mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Tìm khách hàng..."
            className="pl-11 h-12 bg-white border-transparent rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] focus-visible:ring-primary/20 text-sm font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-slate-400"
              onClick={() => setSearch("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Filter Chips */}
        <div className="flex overflow-x-auto hide-scrollbar gap-2 snap-x pb-1 -mx-4 px-4">
          {[
            { id: "all", label: "Tất cả" },
            ...Object.entries(leadStatusLabel).map(([k, v]) => ({ id: k, label: v })),
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setStatusFilter(t.id)}
              className={cn(
                "px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap snap-center transition-all",
                statusFilter === t.id
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "bg-white text-slate-500 border border-slate-100 hover:bg-slate-50",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lead Cards */}
      <div className="flex flex-col gap-4 pb-8">
        {filtered.map((l) => {
          const statusIdx = PIPELINE_STAGES.findIndex((s) => s.key === l.status);

          return (
            <div
              key={l.id}
              className="relative bg-white p-5 rounded-[24px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-slate-100/50"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-3">
                  <div className="h-10 w-10 shrink-0 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                    <UserCog className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-[15px] text-slate-800 leading-tight mb-1">
                      {l.name}
                    </h3>
                    <p className="text-[11px] font-medium text-slate-500 line-clamp-1 flex items-center gap-1">
                      <Phone className="h-3 w-3" /> {l.phone}
                    </p>
                  </div>
                </div>
                <StatusBadge
                  variant={leadStatusVariant[l.status]}
                  className="shrink-0 text-[9px] px-2 py-0.5"
                >
                  {leadStatusLabel[l.status]}
                </StatusBadge>
              </div>

              {l.address && (
                <div className="flex items-start gap-1.5 text-[11px] font-medium text-slate-500 mb-4 bg-slate-50 p-2 rounded-xl">
                  <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                  <span className="truncate">{l.address}</span>
                </div>
              )}

              {/* Mobile Compact Progress Line */}
              <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 mb-4">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    Tiến trình
                  </span>
                  <span className="text-[12px] font-black text-primary">
                    {formatVND(l.estimatedValue)}
                  </span>
                </div>
                <div className="flex justify-between relative px-1 py-1">
                  <div className="absolute top-1/2 left-2 right-2 h-0.5 bg-slate-200 -translate-y-1/2 -z-0" />
                  <div
                    className="absolute top-1/2 left-2 h-0.5 bg-primary -translate-y-1/2 -z-0 transition-all duration-1000"
                    style={{
                      width: `${(Math.max(0, statusIdx) / (PIPELINE_STAGES.length - 1)) * 100}%`,
                    }}
                  />
                  {PIPELINE_STAGES.map((s, idx) => (
                    <div
                      key={s.key}
                      className={cn(
                        "h-3 w-3 rounded-full ring-2 ring-white z-10 transition-all",
                        idx <= statusIdx ? "bg-primary scale-125" : "bg-slate-200",
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* Giant Action Buttons for Mobile */}
              <div className="flex flex-col gap-2">
                {l.status === "new" && (
                  <Button
                    size="lg"
                    className="w-full h-12 rounded-xl bg-primary text-white font-black uppercase text-[11px]"
                    onClick={() => setSurveyLead(l)}
                    disabled={!canManageLeadFlow}
                    title={
                      !canManageLeadFlow
                        ? "Chỉ Sales Admin/PM/CEO được tạo việc khảo sát"
                        : undefined
                    }
                  >
                    <Phone className="h-4 w-4 mr-2" /> Tạo việc khảo sát
                  </Button>
                )}
                {l.status === "surveying" && (
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full h-10 rounded-xl text-indigo-600 border-indigo-200 bg-indigo-50 font-black uppercase text-[10px]"
                    onClick={() => handleStatusUpdate(l, "surveyed")}
                    disabled={!canManageLeadFlow}
                    title={
                      !canManageLeadFlow
                        ? "Chỉ Sales Admin/PM/CEO được cập nhật trạng thái flow"
                        : undefined
                    }
                  >
                    <Clock className="h-3.5 w-3.5 mr-2" /> Demo: Đã khảo sát xong
                  </Button>
                )}
                {l.status === "surveyed" && (
                  <Button
                    size="lg"
                    className="w-full h-12 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black uppercase text-[11px] shadow-md shadow-orange-500/20"
                    onClick={() => setUploadQuoteLead(l)}
                    disabled={!canManageLeadFlow}
                    title={
                      !canManageLeadFlow
                        ? "Chỉ Sales Admin/PM/CEO được tải báo giá và chuyển trạng thái"
                        : undefined
                    }
                  >
                    <FileSignature className="h-4 w-4 mr-2" />
                    Tải lên Báo giá
                  </Button>
                )}
                {l.status === "quoted" && (
                  <Button
                    size="lg"
                    className="w-full h-12 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase text-[11px] shadow-md shadow-emerald-500/20"
                    onClick={() => setUploadContractLead(l)}
                    disabled={!canManageLeadFlow}
                    title={
                      !canManageLeadFlow
                        ? "Chỉ Sales Admin/PM/CEO được tải hợp đồng và chốt trạng thái"
                        : undefined
                    }
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Tải lên Hợp đồng đã ký
                  </Button>
                )}
                {l.status === "signed" && (
                  <div className="w-full h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center font-black uppercase text-[10px]">
                    <CheckCircle2 className="h-4 w-4 mr-2" /> Đã ký - sẵn sàng kích hoạt
                  </div>
                )}

                {l.status === "signed" && (
                  <Button
                    size="lg"
                    className="w-full h-12 rounded-xl bg-success hover:bg-success/90 text-white font-black uppercase text-[11px]"
                    onClick={() => setConfirmConvert(l)}
                    disabled={!canManageLeadFlow}
                    title={
                      !canManageLeadFlow ? "Chỉ Sales Admin/PM/CEO được kích hoạt dự án" : undefined
                    }
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" /> Kích hoạt dự án
                  </Button>
                )}

                {l.status !== "signed" && l.status !== "lost" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mt-1 text-[10px] text-rose-500 hover:bg-rose-50 font-bold uppercase"
                    onClick={() => handleStatusUpdate(l, "lost")}
                    disabled={!canSalesCare}
                    title={
                      !canSalesCare
                        ? "Role hiện tại không có quyền cập nhật trạng thái thất bại"
                        : undefined
                    }
                  >
                    Đóng băng / Thất bại
                  </Button>
                )}
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-[13px] text-slate-400 font-medium">Không tìm thấy khách hàng nào</p>
          </div>
        )}
      </div>

      {convertLead && (
        <ConvertLeadModal
          open={true}
          onClose={() => setConvertLead(null)}
          lead={convertLead}
          onConverted={({ leadId, customerId }) => {
            setLeads((prev) =>
              prev.map((item) =>
                item.id === leadId ? { ...item, status: "signed", customerId } : item,
              ),
            );
          }}
        />
      )}
      <CreateLeadModal open={createOpen} onClose={() => setCreateOpen(false)} />
      {surveyLead && (
        <CreateJobModal
          open={true}
          onClose={() => setSurveyLead(null)}
          defaultTitle={`Khảo sát: ${surveyLead.name}`}
          defaultType="inspection"
          defaultLeadId={surveyLead.id}
          defaultDescription={`Khảo sát hiện trường cho khách hàng ${surveyLead.name}. Địa chỉ: ${surveyLead.address}.`}
          onSuccess={() => {
            handleStatusUpdate(surveyLead, "surveying");
          }}
        />
      )}

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
          title={`Báo giá: ${uploadQuoteLead.name}`}
          onUploadSuccess={(url) => {
            const updated: Lead[] = leads.map((item) =>
              item.id === uploadQuoteLead.id
                ? { ...item, quoteFileUrl: url, status: "quoted" as LeadStatus }
                : item,
            );
            setLeads(updated);
            toast.success("Đã tải báo giá và chuyển Lead sang trạng thái Đã báo giá.");
          }}
        />
      )}
      {uploadContractLead && (
        <UploadDocumentModal
          open={true}
          onClose={() => setUploadContractLead(null)}
          title={`Hợp đồng: ${uploadContractLead.name}`}
          onUploadSuccess={(url) => {
            const updated: Lead[] = leads.map((item) =>
              item.id === uploadContractLead.id
                ? { ...item, contractFileUrl: url, status: "signed" as LeadStatus }
                : item,
            );
            setLeads(updated);
            toast.success("Đã tải hợp đồng và chuyển Lead sang trạng thái Đã ký.");
          }}
        />
      )}
    </AppShell>
  );
}
