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

  const filtered = mockUsers.filter((u) => {
    const roleLabel = u.name.split("(")[1]?.replace(")", "") || "Nhân viên";
    return (
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      roleLabel.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <MobileShell title="Nhân sự & Đội ngũ">
      <div className="sticky top-0 bg-white/80 backdrop-blur-3xl z-20 px-6 py-4 border-b border-slate-100">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="TÌM KIẾM NHÂN VIÊN..."
            className="pl-11 h-12 bg-slate-50 border-none shadow-none rounded-2xl text-[10px] font-black uppercase tracking-tight"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="p-6 space-y-4">
        {filtered.map((user) => {
          const initials = user.name
            .split(" ")
            .slice(-2)
            .map((n) => n[0])
            .join("");
          const roleLabel = user.name.split("(")[1]?.replace(")", "") || "Nhân viên";
          const isTech = roleLabel.toLowerCase().includes("kỹ thuật") || roleLabel.toLowerCase().includes("tech");

          return (
            <Card
              key={user.id}
              className="p-5 border-none shadow-sm bg-white rounded-[2rem] active:scale-95 transition-all"
            >
              <div className="flex gap-4">
                <Avatar className="h-14 w-14 rounded-[1.25rem] ring-4 ring-slate-50 border-white border-2">
                  <AvatarFallback className="bg-slate-100 text-slate-400 font-black text-lg uppercase italic">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-black text-[13px] leading-tight text-slate-900 line-clamp-1 uppercase tracking-tight">
                        {user.name.split("(")[0].trim()}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span
                          className={cn(
                            "text-[8px] font-black uppercase px-2 py-0.5 rounded-full",
                            isTech ? "bg-blue-50 text-blue-600 border border-blue-100/50" : "bg-purple-50 text-purple-600 border border-purple-100/50",
                          )}
                        >
                          {roleLabel}
                        </span>
                        <div className="flex items-center gap-0.5 ml-1 bg-amber-50 px-1.5 py-0.5 rounded-full border border-amber-100/50">
                          <Star className="h-2.5 w-2.5 text-amber-500 fill-current" />
                          <span className="text-[8px] font-black text-amber-600">4.9</span>
                        </div>
                      </div>
                    </div>
                    <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />
                  </div>

                  <div className="mt-5 flex items-center gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 h-10 rounded-xl gap-2 text-[9px] font-black border-slate-100 hover:bg-slate-50 uppercase tracking-tighter shadow-sm"
                    >
                      <Phone className="h-3.5 w-3.5 text-primary" /> Liên hệ
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 h-10 rounded-xl gap-2 text-[9px] font-black border-slate-100 hover:bg-slate-50 uppercase tracking-tighter shadow-sm"
                    >
                      <Mail className="h-3.5 w-3.5 text-indigo-500" /> Nhắn tin
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-xl bg-slate-50 shrink-0"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-5 border-t border-slate-50 flex items-center justify-between text-[9px] text-slate-400 font-black uppercase tracking-widest italic">
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-slate-300" />
                  12 TASK HOÀN TẤT
                </div>
                <div className="flex items-center gap-1.5 text-emerald-500">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  XÁC MINH
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </MobileShell>
  );
}
