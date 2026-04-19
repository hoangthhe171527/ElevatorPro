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
import { mockInventory, formatVND, type InventoryItem } from "@/lib/mock-data";
import { Plus, Search, Package, AlertTriangle, ArrowRightLeft, PackageOpen, LayoutGrid, List } from "lucide-react";
import { ReceiveInventoryModal, TransferInventoryModal } from "@/components/common/Modals";
import { toast } from "sonner";
import { useAppStore, useCanWrite } from "@/lib/store";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin/inventory/")({
  head: () => ({ meta: [{ title: "Kho vật tư — ElevatorPro" }] }),
  component: InventoryPage,
});

const PAGE_SIZE = 9;

function InventoryPage() {
  const activeTenantId = useAppStore(s => s.activeTenantId);
  const canModify = useCanWrite("inventory");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [receiveItem, setReceiveItem] = useState<InventoryItem | null>(null);
  const [transferOpen, setTransferOpen] = useState(false);

  // Filter inventory by tenant
  const tenantInventory = mockInventory.filter(i => i.tenantId === activeTenantId);

  const categories = Array.from(new Set(tenantInventory.map((i) => i.category)));
  const filtered = tenantInventory.filter((i) => {
    const m1 =
      !search ||
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.code.toLowerCase().includes(search.toLowerCase());
    const m2 = catFilter === "all" || i.category === catFilter;
    return m1 && m2;
  });
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const lowStock = tenantInventory.filter((i) => i.stock - i.reserved <= i.reorderLevel).length;
  const totalValue = tenantInventory.reduce((s, i) => s + i.stock * i.unitPrice, 0);

  return (
    <AppShell>
      <PageHeader
        title="Quản lý Kho vật tư"
        description="Theo dõi số lượng tồn kho theo thời gian thực"
        actions={
          canModify ? (
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="bg-background shadow-sm hover:bg-muted"
                onClick={() => setTransferOpen(true)}
              >
                <ArrowRightLeft className="h-4 w-4 md:mr-1.5" /> <span className="hidden md:inline">Chuyển kho</span>
              </Button>
              <Button
                className="shadow-md bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 transition-opacity"
                onClick={() => toast.info("Chọn vật tư bên dưới để nhập kho")}
              >
                <Plus className="h-4 w-4 md:mr-1.5" /> <span className="hidden md:inline">Nhập vật tư mới</span>
              </Button>
            </div>
          ) : (
            <Badge variant="outline" className="text-muted-foreground italic border-dashed px-4 py-2 bg-muted/20">Chế độ xem tồn kho</Badge>
          )
        }
      />

      {/* OVERVIEW STATS */}
      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <StatsCard
          title="Tổng mã vật tư"
          value={mockInventory.length}
          icon={PackageOpen}
          color="blue"
        />
        <StatsCard
          title="Cần nhập thêm"
          value={lowStock}
          icon={AlertTriangle}
          color={lowStock > 0 ? "rose" : "emerald"}
        />
        <StatsCard
          title="Giá trị tồn kho"
          value={formatVND(totalValue)}
          icon={Package}
          color="indigo"
        />
      </div>

      <Card className="shadow-sm border-muted/60 bg-card/50 backdrop-blur-sm">
        {/* FILTERS */}
        <div className="flex flex-col sm:flex-row items-center gap-3 p-4 border-b bg-muted/20">
          <div className="flex-1 w-full relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Nhập mã hoặc tên vật tư để tìm..."
              className="pl-9 h-10 bg-background/50 focus:bg-background transition-colors ring-offset-0 focus-visible:ring-1"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <div className="flex w-full sm:w-auto items-center gap-2">
            <Select value={catFilter} onValueChange={(v) => { setCatFilter(v); setPage(1); }}>
              <SelectTrigger className="w-full sm:w-48 h-10 bg-background/50"><SelectValue placeholder="Phân loại" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả danh mục</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* View toggles */}
            <div className="hidden sm:flex border rounded-md overflow-hidden bg-background/50">
              <button
                className={`p-2 transition-colors ${viewMode === "grid" ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/50"}`}
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                className={`p-2 transition-colors ${viewMode === "list" ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/50"}`}
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* LISTING */}
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <PackageOpen className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            <div className="font-medium">Không tìm thấy vật tư nào</div>
            <p className="text-sm text-muted-foreground mt-1">Hãy thử thay đổi từ khóa hoặc danh mục tìm kiếm</p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {paged.map((i) => <InventoryCard key={i.id} item={i} onReceive={() => setReceiveItem(i)} />)}
          </div>
        ) : (
          <div className="divide-y border-t bg-background">
            {paged.map((i) => <InventoryListItem key={i.id} item={i} onReceive={() => setReceiveItem(i)} />)}
          </div>
        )}

        <div className="border-t bg-muted/10">
          <DataPagination page={page} pageSize={PAGE_SIZE} total={filtered.length} onPageChange={setPage} />
        </div>
      </Card>

      <ReceiveInventoryModal
        open={!!receiveItem}
        onClose={() => setReceiveItem(null)}
        itemName={receiveItem?.name || ""}
        itemCode={receiveItem?.code || ""}
      />

      <TransferInventoryModal 
        open={transferOpen}
        onClose={() => setTransferOpen(false)}
      />
    </AppShell>
  );
}

// PREMIUM STATS CARD
function StatsCard({ title, value, icon: Icon, color }: any) {
  const colorStyles = {
    blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    rose: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    indigo: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
  }[color as string] || "bg-primary/10 text-primary border-primary/20";

  return (
    <Card className="relative overflow-hidden border p-5 transition-transform shadow-sm">
      <div className="flex items-center justify-between z-10 relative">
        <div>
          <div className="text-sm font-medium text-muted-foreground mb-1">{title}</div>
          <div className="text-2xl font-bold tracking-tight">{value}</div>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl border ${colorStyles}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      {/* Decorative gradient blob */}
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl opacity-20 ${colorStyles.split(" ")[0]}`} />
    </Card>
  );
}

// BEAUTIFUL GRID CARD
function InventoryCard({ item: i, onReceive }: { item: InventoryItem, onReceive: () => void }) {
  const available = i.stock - i.reserved;
  const isLow = available <= i.reorderLevel;
  const stockPercent = Math.min(100, (i.stock / (i.reorderLevel * 4)) * 100);

  return (
    <div className="group flex flex-col bg-card rounded-xl border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      <div className="p-4 flex-1">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-muted text-xs font-semibold text-muted-foreground">{i.category}</span>
            {isLow && <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> Sắp hết</span>}
          </div>
          <span className="font-mono text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">{i.code}</span>
        </div>
        
        <h3 className="font-semibold text-base mb-1 line-clamp-1 group-hover:text-primary transition-colors">{i.name}</h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-1">{i.location}</p>

        <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm bg-muted/20 p-3 rounded-lg border border-muted/50">
          <div>
            <div className="text-muted-foreground text-xs font-medium mb-0.5">Tồn kho chung</div>
            <div className="font-semibold">{i.stock} <span className="text-xs text-muted-foreground font-normal">{i.unit}</span></div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs font-medium mb-0.5">Đơn giá</div>
            <div className="font-semibold text-primary">{formatVND(i.unitPrice)}</div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs font-medium mb-0.5">Đã đặt trước</div>
            <div className="font-semibold text-amber-600 dark:text-amber-500">{i.reserved}</div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs font-medium mb-0.5">Có thể dùng</div>
            <div className={`font-bold ${isLow ? 'text-destructive' : 'text-emerald-600 dark:text-emerald-400'}`}>
              {available}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-muted-foreground font-medium">Mức dự trữ</span>
            <span className="font-mono text-muted-foreground text-[10px]">Ngưỡng: {i.reorderLevel}</span>
          </div>
          <Progress value={stockPercent} className={`h-1.5 ${isLow ? '[&>div]:bg-rose-500' : ''}`} />
        </div>
      </div>
      
      <div className="p-3 border-t bg-muted/10 grid grid-cols-1">
        <Button variant={isLow ? "default" : "secondary"} size="sm" className="w-full text-xs font-medium shadow-none transition-transform active:scale-95" onClick={onReceive}>
          <Plus className="h-3.5 w-3.5 mr-1" /> Nhập thêm
        </Button>
      </div>
    </div>
  );
}

// SLEEK LIST ITEM
function InventoryListItem({ item: i, onReceive }: { item: InventoryItem, onReceive: () => void }) {
  const available = i.stock - i.reserved;
  const isLow = available <= i.reorderLevel;
  const stockPercent = Math.min(100, (i.stock / (i.reorderLevel * 4)) * 100);

  return (
    <div className="p-4 flex flex-col xl:flex-row xl:items-center gap-4 hover:bg-muted/30 transition-colors group">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${isLow ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 'bg-primary/5 text-primary border-primary/10'}`}>
          <Package className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <span className="font-semibold text-base group-hover:text-primary transition-colors">{i.name}</span>
            {isLow && (
              <StatusBadge variant="destructive" className="py-0 px-2 h-5 text-[10px]">
                Sắp hết
              </StatusBadge>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
            <span className="font-mono bg-muted/50 px-1 rounded">{i.code}</span>
            <span>•</span>
            <span>{i.category}</span>
            <span>•</span>
            <span>{i.location}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6 text-sm overflow-x-auto pb-2 xl:pb-0 hide-scrollbar">
        <div className="min-w-[80px]">
          <div className="text-muted-foreground text-xs mb-0.5 drop-shadow-sm">Tồn kho</div>
          <div className="font-semibold">{i.stock} {i.unit}</div>
        </div>
        <div className="min-w-[80px]">
          <div className="text-muted-foreground text-xs mb-0.5">Đặt trước</div>
          <div className="font-medium text-amber-600 dark:text-amber-500">{i.reserved}</div>
        </div>
        <div className="min-w-[80px]">
          <div className="text-muted-foreground text-xs mb-0.5">Sẵn sàng</div>
          <div className={`font-bold ${isLow ? "text-destructive" : "text-emerald-600 dark:text-emerald-400"}`}>
            {available}
          </div>
        </div>
        <div className="w-32 hidden lg:block">
          <div className="flex justify-between text-[10px] mb-1.5 text-muted-foreground">
            <span>Dự trữ</span>
            <span>Ngưỡng {i.reorderLevel}</span>
          </div>
          <Progress value={stockPercent} className={`h-1.5 ${isLow ? '[&>div]:bg-rose-500' : ''}`} />
        </div>
        <div className="min-w-[100px] text-right">
          <div className="text-muted-foreground text-xs mb-0.5">Đơn giá</div>
          <div className="font-semibold text-primary">{formatVND(i.unitPrice)}</div>
        </div>
        <div>
          <Button variant="outline" size="sm" className="h-8 shadow-sm hover:border-primary/50 hover:bg-primary/5 transition-colors" onClick={onReceive}>
            Nhập kho
          </Button>
        </div>
      </div>
    </div>
  );
}