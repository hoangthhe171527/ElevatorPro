import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/layout/MobileShell";
import { mockUsers } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Search,
  Phone,
  Mail,
  MapPin,
  Clock,
  ChevronRight,
  ShieldCheck,
  Star,
} from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Route = createFileRoute("/mobile/hr")({
  head: () => ({ meta: [{ title: "Nhân sự — Mobile" }] }),
  component: MobileHR,
});

function MobileHR() {
  const [search, setSearch] = useState("");

  const filtered = mockUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <MobileShell title="Quản lý nhân sự">
      <div className="sticky top-0 bg-slate-50/80 backdrop-blur-sm z-20 px-4 py-3 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm tên hoặc chức vụ..."
            className="pl-9 bg-background border-none shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="p-4 space-y-4">
        {filtered.map((user) => {
          const initials = user.name
            .split(" ")
            .slice(-2)
            .map((n) => n[0])
            .join("");
          const isTech = user.role.includes("tech");

          return (
            <Card
              key={user.id}
              className="p-4 border-none shadow-sm bg-white active:scale-[0.98] transition-all"
            >
              <div className="flex gap-4">
                <Avatar className="h-14 w-14 rounded-2xl ring-2 ring-slate-100">
                  <AvatarFallback className="bg-slate-50 text-slate-400 font-bold text-lg uppercase">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-sm leading-tight text-slate-900 line-clamp-1">
                        {user.name}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span
                          className={cn(
                            "text-[9px] font-bold uppercase px-1.5 py-0.5 rounded",
                            isTech ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600",
                          )}
                        >
                          {user.role}
                        </span>
                        <div className="flex items-center gap-0.5 ml-1">
                          <Star className="h-2.5 w-2.5 text-amber-400 fill-current" />
                          <span className="text-[9px] font-bold">4.9</span>
                        </div>
                      </div>
                    </div>
                    <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 h-9 rounded-lg gap-2 text-[11px] font-bold border-slate-100 hover:bg-slate-50"
                    >
                      <Phone className="h-3.5 w-3.5" /> GỌI
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 h-9 rounded-lg gap-2 text-[11px] font-bold border-slate-100 hover:bg-slate-50"
                    >
                      <Mail className="h-3.5 w-3.5" /> CHAT
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-lg bg-slate-50 shrink-0"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between text-[10px] text-muted-foreground font-medium">
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5" />
                  Đã xong 12 việc tháng này
                </div>
                <div className="flex items-center gap-1 text-primary font-bold">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  ĐÃ XÁC MINH
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </MobileShell>
  );
}
