import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/layout/MobileShell";
import { mockCustomers, mockElevators } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { 
  Search, 
  MapPin, 
  Building2, 
  ChevronRight, 
  Phone, 
  User, 
  Plus,
  MessageCircle,
  MoreVertical
} from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/mobile/customers")({
  head: () => ({ meta: [{ title: "Khách hàng — Mobile" }] }),
  component: MobileCustomers,
});

function MobileCustomers() {
  const [search, setSearch] = useState("");

  const filtered = mockCustomers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-blue-500", "bg-purple-500", "bg-emerald-500", 
      "bg-orange-500", "bg-pink-500", "bg-indigo-500"
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <MobileShell title="Khách hàng">
      <div className="flex flex-col pb-20">
        {/* Search Header */}
        <div className="bg-white px-6 py-4 sticky top-0 z-20 border-b border-slate-100 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Tìm tên hoặc số điện thoại..."
              className="pl-11 h-12 border-none bg-slate-50 rounded-2xl focus-visible:ring-primary/20 text-sm font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button size="icon" className="h-12 w-12 rounded-2xl bg-primary shadow-lg shadow-primary/20">
            <Plus className="h-6 w-6" />
          </Button>
        </div>

        <div className="p-6 space-y-4">
          {filtered.length === 0 && (
            <div className="py-20 text-center">
              <div className="h-20 w-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-10 w-10 text-slate-300" />
              </div>
              <h3 className="font-bold text-slate-900">Không tìm thấy kết quả</h3>
              <p className="text-sm text-slate-400 mt-1">Vui lòng thử từ khóa khác</p>
            </div>
          )}

          {filtered.map((customer) => {
            const elevatorCount = mockElevators.filter(e => {
              // Mock link logic consistently
              const mockMatch = (parseInt(customer.id.split("-")[1]) % 3) + 1;
              return mockMatch > 0; // Simplified for demo
            }).length % 5 + 1;

            return (
              <Link
                key={customer.id}
                to="/mobile/customers/$customerId"
                params={{ customerId: customer.id }}
                className="block"
              >
                <Card className="p-5 border-none shadow-sm shadow-slate-200/50 bg-white rounded-[2rem] active:scale-[0.97] transition-all overflow-hidden relative group">
                  <div className="flex gap-4 relative z-10">
                    <div className={cn(
                      "h-14 w-14 rounded-2xl flex items-center justify-center text-white font-black text-xl shrink-0 shadow-lg shadow-current/20",
                      getAvatarColor(customer.name)
                    )}>
                      {customer.name[0]}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="font-black text-slate-900 leading-tight truncate pr-2">
                          {customer.name}
                        </h3>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 -mr-2 -mt-1 text-slate-300 rounded-full"
                          onClick={(e) => {
                             e.preventDefault();
                             e.stopPropagation();
                          }}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        <span className={cn(
                          "text-[9px] px-1.5 py-0.5 rounded-lg font-black uppercase tracking-tight",
                          customer.type === "business" ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"
                        )}>
                          {customer.type === "business" ? "Doanh nghiệp" : "Cá nhân"}
                        </span>
                        <div className="h-1 w-1 rounded-full bg-slate-200" />
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-tight">
                          {elevatorCount} thiết bị
                        </span>
                      </div>

                      <div className="flex items-start gap-1.5 text-[10px] text-slate-400 mt-3 font-medium">
                        <MapPin className="h-3 w-3 mt-0.5 shrink-0 text-slate-300" />
                        <span className="line-clamp-1 italic">{customer.address}</span>
                      </div>
                    </div>
                  </div>

                  {/* High Fidelity Quick Actions */}
                  <div className="mt-5 flex gap-2 pt-4 border-t border-slate-50">
                    <Button
                      variant="outline"
                      className="flex-1 h-10 rounded-xl bg-slate-50 border-none text-primary hover:bg-primary/5 gap-2 text-[10px] font-black"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.location.href = `tel:${customer.phone}`;
                      }}
                    >
                      <Phone className="h-3.5 w-3.5" /> GỌI NGAY
                    </Button>
                    <Button
                      variant="outline"
                      className="w-10 h-10 rounded-xl bg-slate-50 border-none text-slate-400 hover:bg-slate-100"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                    >
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      className="h-10 px-4 rounded-xl bg-primary/5 border-none text-primary flex items-center gap-2 text-[10px] font-black ml-auto"
                    >
                      XEM <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </MobileShell>
  );
}
