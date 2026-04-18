import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { DataPagination } from "@/components/common/DataPagination";
import { StatusBadge, contractStatusLabel, contractStatusVariant } from "@/components/common/StatusBadge";
import { Progress } from "@/components/ui/progress";
import { mockContracts, formatVND, formatDate } from "@/lib/mock-data";
import { FileText, Calendar } from "lucide-react";

export const Route = createFileRoute("/portal/contracts")({
  head: () => ({ meta: [{ title: "Hợp đồng của tôi" }] }),
  component: PortalContracts,
});

const CUSTOMER_ID = "c-1";
const PAGE_SIZE = 5;
const typeLabel: Record<string, string> = { install: "Lắp đặt", maintenance: "Bảo trì", repair: "Sửa chữa" };

function PortalContracts() {
  const [page, setPage] = useState(1);
  const filtered = mockContracts.filter(c => c.customerId === CUSTOMER_ID);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <AppShell>
      <PageHeader title="Hợp đồng của bạn" description={`${filtered.length} hợp đồng`} />

      <Card className="overflow-hidden">
        <div className="divide-y">
          {paged.map(c => {
            const percent = c.value > 0 ? Math.round((c.paid / c.value) * 100) : 0;
            return (
              <div key={c.id} className="p-5 hover:bg-muted/30">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold">{c.code}</span>
                        <StatusBadge variant={contractStatusVariant[c.status]}>{contractStatusLabel[c.status]}</StatusBadge>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{typeLabel[c.type]}</span>
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3" /> {formatDate(c.startDate)} → {formatDate(c.endDate)}</div>
                      <p className="mt-2 text-sm text-muted-foreground">{c.items.join(" · ")}</p>
                    </div>
                  </div>
                  <div className="lg:w-64 space-y-1.5">
                    <div className="flex justify-between text-xs"><span className="text-muted-foreground">Giá trị</span><span className="font-bold text-primary">{formatVND(c.value)}</span></div>
                    <div className="flex justify-between text-xs"><span className="text-muted-foreground">Đã thanh toán</span><span className="font-medium text-success">{formatVND(c.paid)}</span></div>
                    <Progress value={percent} className="h-1.5" />
                    <div className="text-[10px] text-muted-foreground text-right">{percent}% hoàn thành</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <DataPagination page={page} pageSize={PAGE_SIZE} total={filtered.length} onPageChange={setPage} />
      </Card>
    </AppShell>
  );
}
