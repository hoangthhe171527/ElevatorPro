import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/layout/MobileShell";
import { mockUsers, mockJobs, mockRequests } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Search,
  Phone,
  Mail,
  Clock,
  ChevronRight,
  ShieldCheck,
  Award,
  TrendingUp,
  UserPlus,
  Briefcase,
} from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAppStore, useCurrentPermissions } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/mobile/hr")({
  head: () => ({ meta: [{ title: "Nhân sự — Mobile" }] }),
  component: MobileHR,
});

function MobileHR() {
  const [search, setSearch] = useState("");
  const activeTenantId = useAppStore((s) => s.activeTenantId);
  const permissions = useCurrentPermissions();
  const canManageHR = permissions.includes("hr_admin") || permissions.includes("director");

  // Filter nhân viên theo đúng tenant đang active
  const staff = mockUsers.filter((u) =>
    u.memberships.some((m) => m.tenantId === activeTenantId)
  );

  const filtered = staff.filter((u) => {
    const roleLabel = u.name.split("(")[1]?.replace(")", "") || "Nhân viên";
    return (
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      roleLabel.toLowerCase().includes(search.toLowerCase())
    );
  });

  // Stats thực từ mockJobs
  const completedJobsTotal = mockJobs.filter(
    (j) => j.status === "completed" && j.tenantId === activeTenantId
  ).length;
  const pendingRequests = mockRequests.filter(
    (r) => r.status === "pending" && r.tenantId === activeTenantId
  ).length;

  return (
    <MobileShell title="Nhân sự & Đội ngũ">
      {/* Stats Header */}
      <div className="px-5 pt-5 pb-4 grid grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl p-3 border border-slate-50 shadow-sm text-center">
          <p className="text-xl font-black text-slate-900">{staff.length}</p>
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Nhân sự</p>
        </div>
        <div className="bg-white rounded-2xl p-3 border border-slate-50 shadow-sm text-center">
          <p className="text-xl font-black text-emerald-600">{completedJobsTotal}</p>
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Job Xong</p>
        </div>
        <div className="bg-white rounded-2xl p-3 border border-slate-50 shadow-sm text-center">
          <p className="text-xl font-black text-amber-500">{pendingRequests}</p>
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Chờ Duyệt</p>
        </div>
      </div>

      {/* Search + Recruit Button */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-3xl z-20 px-5 py-3 border-b border-slate-100 flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Tìm kiếm nhân viên..."
            className="pl-11 h-11 bg-slate-50 border-none shadow-none rounded-2xl text-[10px] font-black uppercase tracking-tight"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {canManageHR && (
          <Button
            className="h-11 rounded-2xl bg-primary text-white font-black text-[9px] gap-2 px-4 shadow-lg shadow-primary/20 shrink-0"
            onClick={() => toast.success("Mở form tuyển dụng mới")}
          >
            <UserPlus className="h-4 w-4" /> TUYỂN
          </Button>
        )}
      </div>

      <div className="p-5 space-y-4">
        {filtered.map((user) => {
          const initials = user.name
            .split(" ")
            .slice(-2)
            .map((n) => n[0])
            .join("");
          const roleLabel = user.name.split("(")[1]?.replace(")", "") || "Nhân viên";
          const isTech = roleLabel.toLowerCase().includes("kỹ") || roleLabel.toLowerCase().includes("tech");

          // Stats thực của từng nhân viên
          const userCompleted = mockJobs.filter(
            (j) => j.assignedTo === user.id && j.status === "completed"
          ).length;
          const userOngoing = mockJobs.filter(
            (j) => j.assignedTo === user.id && (j.status === "scheduled" || j.status === "in_progress")
          ).length;
          const efficiency = userCompleted + userOngoing > 0
            ? Math.round((userCompleted / (userCompleted + userOngoing)) * 100)
            : 0;

          return (
            <Card key={user.id} className="p-5 border-none shadow-sm bg-white rounded-[2rem] active:scale-95 transition-all">
              <div className="flex gap-4">
                <Avatar className="h-14 w-14 rounded-[1.25rem] ring-4 ring-slate-50">
                  <AvatarFallback className="bg-slate-100 text-slate-400 font-black text-lg uppercase italic rounded-[1.25rem]">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-black text-[13px] leading-tight text-slate-900 line-clamp-1 uppercase tracking-tight">
                        {user.name.split("(")[0].trim()}
                      </h3>
                      <span className={cn(
                        "text-[8px] font-black uppercase px-2 py-0.5 rounded-full mt-1.5 inline-block",
                        isTech ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"
                      )}>
                        {roleLabel}
                      </span>
                    </div>
                    <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse mt-1" />
                  </div>

                  {/* Performance stats */}
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <div className="bg-emerald-50 rounded-xl p-2 text-center">
                      <p className="text-sm font-black text-emerald-600">{userCompleted}</p>
                      <p className="text-[7px] font-black text-emerald-400 uppercase">Xong</p>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-2 text-center">
                      <p className="text-sm font-black text-blue-600">{userOngoing}</p>
                      <p className="text-[7px] font-black text-blue-400 uppercase">Đang làm</p>
                    </div>
                    <div className="bg-amber-50 rounded-xl p-2 text-center">
                      <p className="text-sm font-black text-amber-600">{efficiency}%</p>
                      <p className="text-[7px] font-black text-amber-400 uppercase">Hiệu suất</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 h-9 rounded-xl gap-2 text-[9px] font-black border-slate-100 hover:bg-slate-50 uppercase tracking-tighter"
                      onClick={() => toast.info(`Gọi ${user.phone}`)}
                    >
                      <Phone className="h-3.5 w-3.5 text-primary" /> Gọi
                    </Button>
                    {canManageHR && (
                      <Button
                        variant="outline"
                        className="flex-1 h-9 rounded-xl gap-2 text-[9px] font-black border-slate-100 hover:bg-emerald-50 hover:text-emerald-700 uppercase tracking-tighter"
                        onClick={() => toast.success(`Đã ghi nhận điều chuyển`)}
                      >
                        <Briefcase className="h-3.5 w-3.5" /> Điều chuyển
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}

        {filtered.length === 0 && (
          <div className="py-20 text-center">
            <Users className="h-12 w-12 text-slate-200 mx-auto mb-4" />
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Không tìm thấy nhân viên</p>
          </div>
        )}
      </div>
    </MobileShell>
  );
}
