import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataPagination } from "@/components/common/DataPagination";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/common/StatusBadge";
import { mockInventory, formatVND } from "@/lib/mock-data";
import { Plus, Search, Package, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/admin/inventory")({
  head: () => ({ meta: [{ title: "Kho vật tư — ElevatorPro" }] }),
  component: InventoryPage,
});

const PAGE_SIZE = 8;

function InventoryPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");

  const categories = Array.from(new Set(mockInventory.map(i => i.category)));
  const filtered = mockInventory.filter(i => {
    const m1 = !search || i.name.toLowerCase().includes(search.toLowerCase()) || i.code.toLowerCase().includes(search.toLowerCase());
    const m2 = catFilter === "all" || i.category === catFilter;
    return m1 && m2;
  });
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const lowStock = mockInventory.filter(i => i.stock - i.reserved <= i.reorderLevel).length;
  const totalValue = mockInventory.reduce((s, i) => s + i.stock * i.unitPrice, 0);

  return (
    <AppShell>
      <PageHeader
        title="Kho vật tư"
        description="Theo dõi tồn kho, đặt hàng và cảnh báo dưới ngưỡng"
        actions={<div className="flex gap-2"><Button variant="outline">Tạo phiếu đặt hàng</Button><Button><Plus className="h-4 w-4 mr-1.5" /> Thêm vật tư</Button></div>}
      />

      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Tổng vật tư</div>
          <div className="mt-1 text-2xl font-bold">{mockInventory.length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Cảnh báo sắp hết</div>
          <div className="mt-1 text-2xl font-bold text-destructive">{lowStock}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Giá trị tồn kho</div>
          <div className="mt-1 text-xl font-bold text-primary">{formatVND(totalValue)}</div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="flex flex-col sm:flex-row gap-3 p-4 border-b">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Tìm vật tư..." className="pl-9" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <Select value={catFilter} onValueChange={(v) => { setCatFilter(v); setPage(1); }}>
            <SelectTrigger className="w-full sm:w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả danh mục</SelectItem>
              {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="divide-y">
          {paged.map(i => {
            const available = i.stock - i.reserved;
            const lowStock = available <= i.reorderLevel;
            const stockPercent = Math.min(100, (i.stock / (i.reorderLevel * 4)) * 100);
            return (
              <div key={i.id} className="p-4 hover:bg-muted/30">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Package className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold">{i.name}</span>
                        {lowStock && <StatusBadge variant="destructive"><AlertTriangle className="h-3 w-3" /> Sắp hết</StatusBadge>}
                      </div>
                      <div className="mt-0.5 text-xs text-muted-foreground">
                        <span className="font-mono">{i.code}</span> · {i.category} · {i.location}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 lg:flex lg:items-center gap-4 lg:gap-6 text-xs">
                    <div>
                      <div className="text-muted-foreground">Tồn</div>
                      <div className="text-base font-bold">{i.stock} {i.unit}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Đặt trước</div>
                      <div className="text-base font-medium">{i.reserved}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Có sẵn</div>
                      <div className={`text-base font-bold ${lowStock ? "text-destructive" : "text-success"}`}>{available}</div>
                    </div>
                    <div className="col-span-3 lg:col-span-1 lg:min-w-[140px]">
                      <Progress value={stockPercent} className="h-1.5" />
                      <div className="mt-1 text-[10px] text-muted-foreground">Ngưỡng: {i.reorderLevel}</div>
                    </div>
                    <div className="col-span-3 lg:col-span-1 text-right">
                      <div className="text-muted-foreground">Đơn giá</div>
                      <div className="text-sm font-semibold text-primary">{formatVND(i.unitPrice)}</div>
                    </div>
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
