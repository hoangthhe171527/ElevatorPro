// src/routes/admin.contracts.tsx  ← THAY THẾ FILE CŨ
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataPagination } from "@/components/common/DataPagination";
import { StatusBadge, contractStatusLabel, contractStatusVariant } from "@/components/common/StatusBadge";
import { Progress } from "@/components/ui/progress";
import { mockContracts, formatVND, formatDate, getCustomer, type Contract } from "@/lib/mock-data";
import { Plus, Search, FileText, Calendar, User, Banknote, RefreshCw } from "lucide-react";
import { RecordPaymentModal, CreateContractModal, RenewContractModal } from "@/components/common/Modals";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/contracts")({
  head: () => ({ meta: [{ title: "Hợp đồng — ElevatorPro" }] }),
  component: ContractsPage,
});

const PAGE_SIZE = 6;
const typeLabel: Record<string, string> = {
  install: "Lắp đặt",
  maintenance: "Bảo trì",
  repair: "Sửa chữa",
};

function ContractsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [paymentContract, setPaymentContract] = useState<Contract | null>(null);
  const [renewContract, setRenewContract] = useState<Contract | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const filtered = mockContracts.filter((c) => {
    const cus = getCustomer(c.customerId);
    const m1 =
      !search ||
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      cus?.name.toLowerCase().includes(search.toLowerCase());
    const m2 = statusFilter === "all" || c.status === statusFilter;
    const m3 = typeFilter === "all" || c.type === typeFilter;
    return m1 && m2 && m3;
  });
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalValue = mockContracts.reduce((s, c) => s + c.value, 0);
  const totalPaid = mockContracts.reduce((s, c) => s + c.paid, 0);

  return (
    <AppShell>
      <PageHeader
        title="Hợp đồng"
        description="Trung tâm vận hành — gắn với khách hàng và sinh ra công việc"
        actions={
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4 mr-1.5" /> Tạo hợp đồng
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Tổng giá trị</div>
          <div className="mt-1 text-xl font-bold text-primary">{formatVND(totalValue)}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Đã thu</div>
          <div className="mt-1 text-xl font-bold text-success">{formatVND(totalPaid)}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Còn nợ</div>
          <div className="mt-1 text-xl font-bold text-warning-foreground">
            {formatVND(totalValue - totalPaid)}
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="flex flex-col sm:flex-row gap-3 p-4 border-b">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm mã HĐ hoặc khách hàng..."
              className="pl-9"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setPage(1); }}>
            <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Loại" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả loại</SelectItem>
              {Object.entries(typeLabel).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
            <SelectTrigger className="w-full sm:w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              {Object.entries(contractStatusLabel).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="divide-y">
          {paged.map((c) => {
            const cus = getCustomer(c.customerId);
            const percent = c.value > 0 ? Math.round((c.paid / c.value) * 100) : 0;
            const remaining = c.value - c.paid;
            return (
              <div key={c.id} className="p-4 hover:bg-muted/30 transition-colors">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold">{c.code}</span>
                        <StatusBadge variant={contractStatusVariant[c.status]}>
                          {contractStatusLabel[c.status]}
                        </StatusBadge>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                          {typeLabel[c.type]}
                        </span>
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground flex items-center gap-1">
                        <User className="h-3 w-3" /> {cus?.name}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> {formatDate(c.startDate)} → {formatDate(c.endDate)}
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground italic">
                        {c.items.join(" · ")}
                      </div>
                    </div>
                  </div>

                  <div className="lg:w-72 flex flex-col gap-2">
                    <div className="space-y-1.5">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-xs text-muted-foreground">Giá trị</span>
                        <span className="font-bold text-primary">{formatVND(c.value)}</span>
                      </div>
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-xs text-muted-foreground">Đã thu ({percent}%)</span>
                        <span className="text-sm font-medium text-success">{formatVND(c.paid)}</span>
                      </div>
                      <Progress value={percent} className="h-1.5" />
                      {remaining > 0 && (
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="text-xs text-muted-foreground">Còn nợ</span>
                          <span className="text-xs font-medium text-warning-foreground">
                            {formatVND(remaining)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 pt-1">
                      {remaining > 0 && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 gap-1.5 text-xs"
                          onClick={() => setPaymentContract(c)}
                        >
                          <Banknote className="h-3.5 w-3.5" /> Ghi nhận thu
                        </Button>
                      )}
                      {c.status === "expiring" && (
                        <Button
                          size="sm"
                          className="flex-1 gap-1.5 text-xs"
                          onClick={() => setRenewContract(c)}
                        >
                          <RefreshCw className="h-3.5 w-3.5" /> Tái ký
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <DataPagination page={page} pageSize={PAGE_SIZE} total={filtered.length} onPageChange={setPage} />
      </Card>

      {paymentContract && (
        <RecordPaymentModal
          open={true}
          onClose={() => setPaymentContract(null)}
          contractCode={paymentContract.code}
          totalValue={paymentContract.value}
          alreadyPaid={paymentContract.paid}
        />
      )}

      <CreateContractModal open={createOpen} onClose={() => setCreateOpen(false)} />

      {renewContract && (
        <RenewContractModal 
          open={true}
          onClose={() => setRenewContract(null)}
          contractCode={renewContract.code}
        />
      )}
    </AppShell>
  );
}