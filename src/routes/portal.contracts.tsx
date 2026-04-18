// src/routes/portal.contracts.tsx  ← THAY THẾ
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataPagination } from "@/components/common/DataPagination";
import { StatusBadge, contractStatusLabel, contractStatusVariant } from "@/components/common/StatusBadge";
import { Progress } from "@/components/ui/progress";
import { mockContracts, formatVND, formatDate } from "@/lib/mock-data";
import { FileText, Calendar, Download, Phone, AlertTriangle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/portal/contracts")({
  head: () => ({ meta: [{ title: "Hợp đồng của tôi" }] }),
  component: PortalContracts,
});

const CUSTOMER_ID = "c-1";
const PAGE_SIZE = 5;
const typeLabel: Record<string, string> = { install: "Lắp đặt", maintenance: "Bảo trì", repair: "Sửa chữa" };

function PortalContracts() {
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = mockContracts.filter((c) => c.customerId === CUSTOMER_ID);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const activeCount = filtered.filter((c) => c.status === "active").length;
  const expiringCount = filtered.filter((c) => c.status === "expiring").length;
  const totalPaid = filtered.reduce((s, c) => s + c.paid, 0);

  return (
    <AppShell>
      <PageHeader title="Hợp đồng của bạn" description={`${filtered.length} hợp đồng`} />

      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Đang hoạt động</div>
          <div className="mt-1 text-2xl font-bold text-success">{activeCount}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Sắp hết hạn</div>
          <div className={`mt-1 text-2xl font-bold ${expiringCount > 0 ? "text-warning-foreground" : ""}`}>{expiringCount}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Đã thanh toán</div>
          <div className="mt-1 text-lg font-bold text-primary">{formatVND(totalPaid)}</div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="divide-y">
          {paged.map((c) => {
            const percent = c.value > 0 ? Math.round((c.paid / c.value) * 100) : 0;
            const isExpanded = expandedId === c.id;
            return (
              <div key={c.id} className="hover:bg-muted/20 transition-colors">
                {/* Main row */}
                <button
                  className="w-full text-left p-5"
                  onClick={() => setExpandedId(isExpanded ? null : c.id)}
                >
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
                        <div className="mt-1 text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> {formatDate(c.startDate)} → {formatDate(c.endDate)}
                        </div>
                        <p className="mt-1.5 text-xs text-muted-foreground">{c.items.join(" · ")}</p>
                      </div>
                    </div>

                    <div className="lg:w-56 space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Giá trị</span>
                        <span className="font-bold text-primary">{formatVND(c.value)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Đã TT ({percent}%)</span>
                        <span className="font-medium text-success">{formatVND(c.paid)}</span>
                      </div>
                      <Progress value={percent} className="h-1.5" />
                    </div>
                  </div>
                </button>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="px-5 pb-5 border-t bg-muted/20">
                    <div className="pt-4 grid gap-3 sm:grid-cols-2">
                      {c.status === "expiring" && (
                        <div className="sm:col-span-2 flex items-center gap-2 p-3 rounded-lg bg-warning/10 text-warning-foreground text-sm">
                          <AlertTriangle className="h-4 w-4 shrink-0" />
                          Hợp đồng sắp hết hạn vào <strong>{formatDate(c.endDate)}</strong> — liên hệ để tái ký
                        </div>
                      )}
                      {percent === 100 && (
                        <div className="sm:col-span-2 flex items-center gap-2 p-3 rounded-lg bg-success/10 text-success text-sm">
                          <CheckCircle2 className="h-4 w-4 shrink-0" />
                          Đã thanh toán đầy đủ
                        </div>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => toast.success(`Đang tải hợp đồng ${c.code}...`)}
                      >
                        <Download className="h-3.5 w-3.5" /> Tải hợp đồng PDF
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => toast.success("Đã gửi yêu cầu liên hệ — nhân viên sẽ gọi lại trong 30 phút")}
                      >
                        <Phone className="h-3.5 w-3.5" /> Liên hệ về hợp đồng này
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <DataPagination page={page} pageSize={PAGE_SIZE} total={filtered.length} onPageChange={setPage} />
      </Card>
    </AppShell>
  );
}