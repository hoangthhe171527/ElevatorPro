import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/layout/MobileShell";
import { mockCustomers, mockElevators } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Search, MapPin, Building, ChevronRight, Phone } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/mobile/customers")({
  head: () => ({ meta: [{ title: "Khách hàng — Mobile" }] }),
  component: MobileCustomers,
});

function MobileCustomers() {
  const [search, setSearch] = useState("");

  const filtered = mockCustomers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <MobileShell title="Danh sách khách hàng">
      <div className="sticky top-0 bg-slate-50/80 backdrop-blur-sm z-20 px-4 py-3 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm khách hàng..."
            className="pl-9 bg-background border-none shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="p-4 space-y-4">
        {filtered.map((customer) => {
          const elevatorCount =
            mockElevators.filter((e) => e.contractId && customer.id === e.id /* mock link logic */)
              .length || (parseInt(customer.id.split("-")[1]) % 3) + 1;

          return (
            <Card
              key={customer.id}
              className="p-4 shadow-sm border-none bg-background active:scale-[0.98] transition-all"
            >
              <div className="flex gap-4">
                <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center text-primary font-bold text-lg shrink-0">
                  {customer.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-sm leading-tight truncate">{customer.name}</h3>
                    <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-bold">
                      {elevatorCount} THANG
                    </span>
                  </div>
                  <div className="flex items-start gap-1.5 text-[10px] text-muted-foreground mt-2">
                    <MapPin className="h-3 w-3 mt-0.5 shrink-0" />
                    <span className="line-clamp-1">{customer.address}</span>
                  </div>
                  <div className="flex items-center gap-4 mt-4 pt-3 border-t border-slate-50">
                    <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-500">
                      <Building className="h-3 w-3" />
                      {customer.type === "corporate" ? "Doanh nghiệp" : "Cá nhân"}
                    </div>
                    <Button
                      variant="link"
                      className="h-auto p-0 text-[10px] font-bold text-primary ml-auto gap-1"
                    >
                      CHI TIẾT <ChevronRight className="h-3 w-3" />
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
