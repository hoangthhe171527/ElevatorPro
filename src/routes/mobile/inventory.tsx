import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/layout/MobileShell";
import { mockInventory, formatVND } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Package,
  Search,
  AlertTriangle,
  ChevronRight,
  Layers,
  ArrowDownToLine,
  Navigation,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/mobile/inventory")({
  head: () => ({ meta: [{ title: "Kho vật tư — Mobile" }] }),
  component: MobileInventory,
});

function MobileInventory() {
  const [search, setSearch] = useState("");

  const filtered = mockInventory.filter(
    (i) =>
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.code.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <MobileShell title="Quản lý kho">
      <div className="sticky top-0 bg-slate-50/80 backdrop-blur-sm z-20 px-4 py-3 border-b flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Mã hoặc tên vật tư..."
            className="pl-9 bg-background border-none shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button
          size="icon"
          variant="outline"
          className="h-[42px] w-[42px] rounded-xl bg-background border-slate-200 shrink-0"
        >
          <Layers className="h-5 w-5" />
        </Button>
      </div>

      <div className="p-4 space-y-4">
        {filtered.map((item) => {
          const isLow = item.stock <= item.reorderLevel;
          return (
            <Card
              key={item.id}
              className="p-4 shadow-sm border-none bg-background active:scale-[0.98] transition-all"
            >
              <div className="flex gap-4">
                <div
                  className={cn(
                    "h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 border",
                    isLow
                      ? "bg-amber-50 border-amber-200 text-amber-600"
                      : "bg-blue-50 border-blue-200 text-blue-600",
                  )}
                >
                  <Package className="h-7 w-7" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm leading-tight line-clamp-1">{item.name}</h3>
                      <span className="text-[10px] font-mono text-muted-foreground mt-1 block tracking-wider uppercase">
                        {item.code}
                      </span>
                    </div>
                    {isLow && <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-muted-foreground font-bold uppercase">
                        Tồn kho
                      </span>
                      <div className="flex items-end gap-1">
                        <span
                          className={cn(
                            "text-lg font-bold leading-none",
                            isLow ? "text-amber-600" : "text-foreground",
                          )}
                        >
                          {item.stock}
                        </span>
                        <span className="text-[10px] text-muted-foreground mb-0.5">
                          {item.unit}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] text-muted-foreground font-bold uppercase">
                        Đã đặt chỗ
                      </span>
                      <div className="flex items-end gap-1">
                        <span className="text-lg font-bold leading-none text-slate-500">
                          {item.reserved}
                        </span>
                        <span className="text-[10px] text-muted-foreground mb-0.5">
                          {item.unit}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-50">
                    <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground font-semibold">
                      <Navigation className="h-3 w-3" />
                      {item.location}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-[10px] font-bold text-primary gap-1 px-2"
                    >
                      XUẤT KHO <ArrowDownToLine className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </MobileShell>
  );
}
