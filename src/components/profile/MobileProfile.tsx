import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { useAppStore, useCurrentUser } from "@/lib/store";
import type { Permission } from "@/lib/mock-data";
import { ROLE_LABELS } from "@/lib/roles";
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  Key,
  LogOut,
  ChevronRight,
  Smartphone,
  Bell,
  HelpCircle,
} from "lucide-react";
import { toast } from "sonner";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { cn } from "@/lib/utils";

export function MobileProfile() {
  const user = useCurrentUser();
  const activeTenantId = useAppStore((s) => s.activeTenantId);
  const [confirmPassword, setConfirmPassword] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  const initials = user.name
    .split(" ")
    .slice(-2)
    .map((n) => n[0])
    .join("");

  const activePermissions =
    user.memberships.find((m) => m.tenantId === activeTenantId)?.permissions || [];
  const roleLabel = activePermissions.length
    ? activePermissions.map((p) => ROLE_LABELS[p as Permission] || p).join(" • ")
    : "Unknown";

  return (
    <AppShell>
      <PageHeader title="Tài khoản" description="Quản lý định danh cá nhân" />

      <div className="flex flex-col gap-6 pb-8 -mt-2">
        {/* Apple Style Main Profile Header Card */}
        <div className="bg-white rounded-[24px] p-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-slate-100 flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-primary/20 shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-black text-slate-800 line-clamp-1">{user.name}</h2>
            <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-widest flex flex-wrap gap-1">
              ID: {user.id}
              <span className="bg-slate-100 text-slate-500 px-1.5 rounded">{roleLabel}</span>
            </p>
          </div>
          <div className="h-8 w-8 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 cursor-pointer">
            <ChevronRight className="h-4 w-4" />
          </div>
        </div>

        {/* Apple Style Grouped Lists */}
        <div className="space-y-1">
          <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-4 mb-2">
            Thông tin liên hệ
          </div>
          <div className="bg-white rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden">
            {/* Item */}
            <div
              className="flex items-center p-4 border-b border-slate-50 hover:bg-slate-50 active:bg-slate-100 transition-colors"
              onClick={() => toast.success("Mở form sửa SDT")}
            >
              <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 mr-3">
                <Phone className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="text-[15px] font-bold text-slate-800">Số di động</div>
                <div className="text-[12px] font-medium text-slate-500 mt-0.5">
                  {user.phone || "Chưa thiết lập"}
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-300" />
            </div>
            {/* Item */}
            <div
              className="flex items-center p-4 hover:bg-slate-50 active:bg-slate-100 transition-colors"
              onClick={() => toast.success("Mở form sửa Email")}
            >
              <div className="h-8 w-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500 mr-3">
                <Mail className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="text-[15px] font-bold text-slate-800">Email công việc</div>
                <div className="text-[12px] font-medium text-slate-500 mt-0.5">
                  {user.email || "Chưa thiết lập"}
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-300" />
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-4 mb-2">
            Bảo mật & Thiết bị
          </div>
          <div className="bg-white rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden">
            {/* Item */}
            <div
              className="flex items-center p-4 border-b border-slate-50 hover:bg-slate-50 active:bg-slate-100 transition-colors"
              onClick={() => setConfirmPassword(true)}
            >
              <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 mr-3">
                <Key className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="text-[15px] font-bold text-slate-800">Mật khẩu đăng nhập</div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-300" />
            </div>
            {/* Item */}
            <div className="flex items-center p-4 border-b border-slate-50">
              <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500 mr-3">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="text-[15px] font-bold text-slate-800">Xác thực 2 lớp (2FA)</div>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-black uppercase tracking-widest">
                Đã Bật
              </span>
            </div>
            {/* Item */}
            <div
              className="flex items-center p-4 hover:bg-slate-50 active:bg-slate-100 transition-colors"
              onClick={() => toast.success("Quản lý thiết bị")}
            >
              <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500 mr-3">
                <Smartphone className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="text-[15px] font-bold text-slate-800">Thiết bị tin cậy</div>
                <div className="text-[12px] font-medium text-slate-500 mt-0.5">
                  2 thiết bị đang kết nối
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-300" />
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-4 mb-2">
            Cài đặt Ứng dụng
          </div>
          <div className="bg-white rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden">
            <div className="flex items-center p-4 border-b border-slate-50 hover:bg-slate-50 active:bg-slate-100 transition-colors">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary mr-3">
                <Bell className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="text-[15px] font-bold text-slate-800">Thông báo (Push)</div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-300" />
            </div>
            <div className="flex items-center p-4 hover:bg-slate-50 active:bg-slate-100 transition-colors">
              <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 mr-3">
                <HelpCircle className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="text-[15px] font-bold text-slate-800">Hỗ trợ & Góp ý</div>
                <div className="text-[12px] font-medium text-slate-500 mt-0.5">Phiên bản 1.0.4</div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-300" />
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={() => setConfirmLogout(true)}
          className="mt-2 w-full bg-rose-50 border border-rose-100 rounded-[20px] p-4 flex items-center justify-center gap-2 text-rose-500 active:bg-rose-100 transition-colors shadow-sm"
        >
          <LogOut className="h-4 w-4" />
          <span className="font-black text-[13px] uppercase tracking-widest">
            Đăng xuất khỏi App
          </span>
        </button>
      </div>

      <ConfirmationDialog
        open={confirmPassword}
        onOpenChange={setConfirmPassword}
        title="Đổi mật khẩu?"
        description="Mở form gửi email reset password."
        onConfirm={() => {
          toast.success("Đã gửi email khôi phục!");
          setConfirmPassword(false);
        }}
      />
      <ConfirmationDialog
        open={confirmLogout}
        onOpenChange={setConfirmLogout}
        title="Đăng xuất?"
        description="Bạn sẽ phải đăng nhập lại và xác thực 2FA."
        onConfirm={() => {
          toast.success("Đã thoát tài khoản.");
          setConfirmLogout(false);
        }}
        variant="destructive"
        confirmText="Đăng xuất ngay"
      />
    </AppShell>
  );
}
