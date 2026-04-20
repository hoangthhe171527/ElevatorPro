import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/layout/MobileShell";
import { mockContracts, formatVND, getCustomer } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import {
  CreditCard,
  Wallet,
  History,
  Search,
  Plus,
  Clock,
  AlertCircle,
  FileBadge,
} from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/mobile/accounting")({
  head: () => ({ meta: [{ title: "Kế toán — Mobile" }] }),
  component: MobileAccounting,
});

function MobileAccounting() {
  const [search, setSearch] = useState("");

  const filtered = mockContracts.filter((c) => c.code.toLowerCase().includes(search.toLowerCase()));

  return (
    <MobileShell title="Kế toán & Hợp đồng">
      {/* Financial Summary Cards */}
      <div className="p-4 flex gap-3 overflow-x-auto no-scrollbar pt-2">
        <Card className="min-w-[140px] p-4 bg-primary text-white border-none shadow-lg shadow-primary/20 shrink-0">
          <span className="text-[9px] uppercase font-bold opacity-70">Tổng thu</span>
          <p className="text-sm font-bold mt-1">4.2B</p>
          <div className="mt-4 flex items-center gap-1 text-[8px] font-bold bg-white/20 px-1.5 py-0.5 rounded-full w-fit">
            +12% <Clock className="h-2 w-2" />
          </div>
        </Card>
        <Card className="min-w-[140px] p-4 bg-white border-none shadow-sm shrink-0">
          <span className="text-[9px] uppercase font-bold text-muted-foreground">Phải thu</span>
          <p className="text-sm font-bold mt-1 text-orange-600">850M</p>
          <div className="mt-4 flex items-center gap-1 text-[8px] font-bold bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded-full w-fit">
            5 SẮP HẠN
          </div>
        </Card>
        <Card className="min-w-[140px] p-4 bg-white border-none shadow-sm shrink-0">
          <span className="text-[9px] uppercase font-bold text-muted-foreground">Quá hạn</span>
          <p className="text-sm font-bold mt-1 text-destructive">120M</p>
          <div className="mt-4 flex items-center gap-1 text-[8px] font-bold bg-red-50 text-destructive px-1.5 py-0.5 rounded-full w-fit">
            UY TÍN GIẢM
          </div>
        </Card>
      </div>

      <div className="sticky top-0 bg-slate-50/80 backdrop-blur-sm z-20 px-4 py-3 border-b flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Số hợp đồng..."
            className="pl-9 bg-background border-none shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button
          size="icon"
          variant="outline"
          className="h-[42px] w-[42px] rounded-xl bg-background shrink-0"
        >
          <History className="h-5 w-5" />
        </Button>
      </div>

      <div className="p-4 space-y-4">
        {filtered.map((contract) => {
          const customer = getCustomer(contract.customerId);
          const progress = (contract.paid / contract.value) * 100;
          const isOverdue = contract.status === "past_due";

          return (
            <Card
              key={contract.id}
              className="p-4 border-none shadow-sm bg-white active:scale-[0.98] transition-all"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <FileBadge
                    className={cn("h-4 w-4", isOverdue ? "text-destructive" : "text-primary")}
                  />
                  <span className="text-xs font-bold font-mono tracking-tight">
                    {contract.code}
                  </span>
                </div>
                <span
                  className={cn(
                    "text-[8px] uppercase font-bold px-1.5 py-0.5 rounded",
                    isOverdue ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600",
                  )}
                >
                  {contract.status}
                </span>
              </div>

              <h3 className="font-bold text-sm mb-1 line-clamp-1">{customer?.name}</h3>
              <p className="text-[10px] text-muted-foreground mb-4 line-clamp-1">
                {customer?.address}
              </p>

              <div className="space-y-4 pt-4 border-t border-slate-50">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <span className="text-[9px] text-muted-foreground uppercase font-bold">
                      Giá trị HĐ
                    </span>
                    <p className="text-xs font-bold italic">{formatVND(contract.value)}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <span className="text-[9px] text-muted-foreground uppercase font-bold">
                      Thanh khoản
                    </span>
                    <p
                      className={cn(
                        "text-sm font-bold",
                        isOverdue ? "text-destructive" : "text-emerald-600",
                      )}
                    >
                      {Math.round(progress)}%
                    </p>
                  </div>
                </div>

                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-700",
                      isOverdue ? "bg-destructive" : "bg-primary",
                    )}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 h-9 rounded-lg text-[10px] font-bold border-slate-200"
                >
                  LỊCH SỬ THU
                </Button>
                <Button className="flex-1 h-9 rounded-lg text-[10px] font-bold shadow-md shadow-primary/10">
                  GỬI LỜI NHẮC
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </MobileShell>
  );
}
