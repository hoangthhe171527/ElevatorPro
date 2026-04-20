// src/routes/admin.leads.tsx  ← THAY THẾ FILE CŨ
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
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
import { mockLeads, formatVND, formatDate, type Lead } from "@/lib/mock-data";
import { Plus, Phone, Mail, MapPin, Search, UserCog } from "lucide-react";
import { ConvertLeadModal, CreateLeadModal } from "@/components/common/Modals";
import { toast } from "sonner";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";

export const Route = createFileRoute("/admin/leads")({
  head: () => ({ meta: [{ title: "Khách hàng tiềm năng — ElevatorPro" }] }),
  component: LeadsPage,
});

const PAGE_SIZE = 6;

function LeadsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [convertLead, setConvertLead] = useState<Lead | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [confirmContact, setConfirmContact] = useState<Lead | null>(null);
  const [confirmConvert, setConfirmConvert] = useState<Lead | null>(null);

  const filtered = mockLeads.filter((l) => {
    const matchSearch =
      !search || l.name.toLowerCase().includes(search.toLowerCase()) || l.phone.includes(search);
    const matchStatus = statusFilter === "all" || l.status === statusFilter;
    return matchSearch && matchStatus;
  });
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalValue = filtered.reduce((s, l) => s + l.estimatedValue, 0);

  return (
    <AppShell>
      <PageHeader
        title="Khách hàng tiềm năng"
        description="Lưu trữ và chăm sóc lead để chuyển đổi thành khách hàng"
        actions={
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4 mr-1.5" /> Thêm lead
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Tổng lead</div>
          <div className="mt-1 text-2xl font-bold">{mockLeads.length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Đang theo dõi</div>
          <div className="mt-1 text-2xl font-bold">
            {mockLeads.filter((l) => !["won", "lost"].includes(l.status)).length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Giá trị tiềm năng</div>
          <div className="mt-1 text-xl font-bold text-primary">{formatVND(totalValue)}</div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="flex flex-col sm:flex-row gap-3 p-4 border-b">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm theo tên, số điện thoại..."
              className="pl-9"
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
            <SelectTrigger className="w-full sm:w-48">
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

        <div className="divide-y">
          {paged.map((l) => (
            <div key={l.id} className="p-4 hover:bg-muted/30 transition-colors">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <UserCog className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold truncate">{l.name}</h3>
                      <StatusBadge variant={leadStatusVariant[l.status]}>
                        {leadStatusLabel[l.status]}
                      </StatusBadge>
                    </div>
                    <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" /> {l.phone}
                      </span>
                      {l.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" /> {l.email}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {l.address}
                      </span>
                    </div>
                    {l.note && (
                      <p className="mt-2 text-xs text-muted-foreground italic">"{l.note}"</p>
                    )}
                  </div>
                </div>
                <div className="flex flex-row lg:flex-col items-start lg:items-end gap-2 lg:gap-1 lg:min-w-[180px]">
                  <div className="text-sm font-bold text-primary">
                    {formatVND(l.estimatedValue)}
                  </div>
                  <div className="text-xs text-muted-foreground">Nguồn: {l.source}</div>
                  {l.nextFollowUp && (
                    <div className="text-xs">
                      Theo dõi: <span className="font-medium">{formatDate(l.nextFollowUp)}</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setConfirmContact(l)}>
                    Liên hệ
                  </Button>
                  <Button
                    size="sm"
                    disabled={l.status === "lost"}
                    onClick={() => setConfirmConvert(l)}
                  >
                    Chuyển KH
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {paged.length === 0 && (
            <div className="p-12 text-center text-sm text-muted-foreground">
              Không có lead nào phù hợp
            </div>
          )}
        </div>

        <DataPagination
          page={page}
          pageSize={PAGE_SIZE}
          total={filtered.length}
          onPageChange={setPage}
        />
      </Card>

      {convertLead && (
        <ConvertLeadModal open={true} onClose={() => setConvertLead(null)} lead={convertLead} />
      )}

      <CreateLeadModal open={createOpen} onClose={() => setCreateOpen(false)} />

      <ConfirmationDialog
        open={!!confirmContact}
        onOpenChange={(o) => !o && setConfirmContact(null)}
        title="Xác nhận ghi nhận liên hệ"
        description={`Bạn có chắc chắn muốn xác nhận đã thực hiện cuộc gọi/liên hệ với ${confirmContact?.name}? Thao tác này sẽ cập nhật nhật ký chăm sóc.`}
        onConfirm={() => {
          if (confirmContact) toast.success(`Đã ghi nhận liên hệ với ${confirmContact.name}`);
          setConfirmContact(null);
        }}
      />

      <ConfirmationDialog
        open={!!confirmConvert}
        onOpenChange={(o) => !o && setConfirmConvert(null)}
        title="Xác nhận chuyển đổi khách hàng"
        description={`Bạn có chắc chắn muốn bắt đầu quy trình chuyển đổi ${confirmConvert?.name} thành khách hàng chính thức?`}
        onConfirm={() => {
          if (confirmConvert) setConvertLead(confirmConvert);
          setConfirmConvert(null);
        }}
        variant="success"
        confirmText="Bắt đầu chuyển đổi"
      />
    </AppShell>
  );
}
