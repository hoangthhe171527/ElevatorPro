import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/layout/MobileShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  User,
  Bell,
  ShieldCheck,
  Globe,
  Moon,
  ChevronRight,
  LogOut,
  Smartphone,
  HelpCircle,
  FileText,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";

export const Route = createFileRoute("/mobile/settings")({
  head: () => ({ meta: [{ title: "Cài đặt — Mobile" }] }),
  component: MobileSettings,
});

function MobileSettings() {
  const [confirmLogout, setConfirmLogout] = useState(false);

  const sections = [
    {
      title: "Ứng dụng & Thông báo",
      items: [
        { label: "Thông báo đẩy", icon: Bell, detail: "Đang bật", color: "text-blue-500" },
        { label: "Chế độ tối (Dark mode)", icon: Moon, detail: "Tự động", color: "text-slate-700" },
        { label: "Ngôn ngữ", icon: Globe, detail: "Tiếng Việt", color: "text-emerald-500" },
      ],
    },
    {
      title: "Tài khoản & Bảo mật",
      items: [
        {
          label: "Định danh sinh trắc học",
          icon: Smartphone,
          detail: "FaceID",
          color: "text-primary",
        },
        { label: "Thay đổi mật khẩu", icon: ShieldCheck, detail: "", color: "text-primary" },
      ],
    },
    {
      title: "Hỗ trợ & Pháp lý",
      items: [
        { label: "Trung tâm trợ giúp", icon: HelpCircle, detail: "", color: "text-slate-400" },
        { label: "Điều khoản sử dụng", icon: FileText, detail: "", color: "text-slate-400" },
      ],
    },
  ];

  return (
    <MobileShell title="Cài đặt hệ thống" showBackButton>
      <div className="p-4 space-y-6">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-2">
            <h3 className="text-[10px] font-bold uppercase text-muted-foreground px-1 tracking-wider">
              {section.title}
            </h3>
            <Card className="border-none shadow-sm divide-y divide-slate-50 overflow-hidden">
              {section.items.map((item, i) => {
                const Icon = item.icon;
                return (
                  <button
                    key={i}
                    className="w-full p-4 flex items-center justify-between active:bg-slate-50 transition-colors"
                    onClick={() =>
                      item.label === "Thay đổi mật khẩu" &&
                      toast.info("Tính năng này sẽ được cập nhật trong bản tới")
                    }
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center",
                          item.color,
                        )}
                      >
                        <Icon className="h-4.5 w-4.5" />
                      </div>
                      <span className="text-xs font-bold text-slate-800">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.detail && (
                        <span className="text-[10px] text-muted-foreground font-medium">
                          {item.detail}
                        </span>
                      )}
                      <ChevronRight className="h-4 w-4 text-slate-300" />
                    </div>
                  </button>
                );
              })}
            </Card>
          </div>
        ))}

        <Button
          variant="outline"
          className="w-full mt-4 h-12 rounded-xl border-red-100 text-destructive bg-white hover:bg-red-50 font-bold gap-2"
          onClick={() => setConfirmLogout(true)}
        >
          <LogOut className="h-4 w-4" /> ĐĂNG XUẤT KHỎI THIẾT BỊ
        </Button>

        <div className="text-center pt-4">
          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">
            Vitech ElevatorPro v2.0.4 - 2026
          </p>
        </div>
      </div>

      <ConfirmationDialog
        open={confirmLogout}
        onOpenChange={setConfirmLogout}
        title="Xác nhận đăng xuất?"
        description="Bạn có chắc chắn muốn đăng xuất khỏi ứng dụng mobile không? Bạn sẽ cần nhập mật khẩu hoặc dùng FaceID để đăng nhập lại."
        onConfirm={() => {
          toast.success("Hẹn gặp lại bạn!");
          setConfirmLogout(false);
          window.location.href = "/";
        }}
        variant="destructive"
      />
    </MobileShell>
  );
}

// Fixed import for cn since this is a new file
import { cn } from "@/lib/utils";
