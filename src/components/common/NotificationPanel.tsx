// src/components/common/NotificationPanel.tsx
// =====================================================================
// PANEL THÔNG BÁO — thêm mới
// =====================================================================
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, AlertTriangle, Calendar, FileText, CheckCircle2, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: "warning" | "info" | "success" | "reminder";
  title: string;
  desc: string;
  time: string;
  read: boolean;
  href?: string;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "n-1",
    type: "warning",
    title: "Thang đến hạn bảo trì",
    desc: "VHOP-A1-01 (Vinhomes) đã quá hạn bảo trì 3 ngày",
    time: "5 phút trước",
    read: false,
    href: "/admin/elevators",
  },
  {
    id: "n-2",
    type: "warning",
    title: "Hợp đồng sắp hết hạn",
    desc: "HD-2024-0142 hết hạn 30/04 — cần liên hệ tái ký ngay",
    time: "1 giờ trước",
    read: false,
    href: "/admin/contracts",
  },
  {
    id: "n-3",
    type: "info",
    title: "Báo lỗi mới từ khách hàng",
    desc: "Sunshine Tower báo cửa thang SST-02 đóng mở bất thường",
    time: "2 giờ trước",
    read: false,
    href: "/admin/jobs",
  },
  {
    id: "n-4",
    type: "reminder",
    title: "Nhắc theo dõi lead",
    desc: "Bệnh viện An Việt — lịch theo dõi hôm nay 19/04",
    time: "3 giờ trước",
    read: true,
    href: "/admin/leads",
  },
  {
    id: "n-5",
    type: "success",
    title: "Công việc hoàn thành",
    desc: "Trần Văn Hùng đã hoàn tất bảo trì Diamond Plaza tháng 4",
    time: "Hôm qua",
    read: true,
    href: "/admin/jobs",
  },
  {
    id: "n-6",
    type: "info",
    title: "Hợp đồng mới được ký",
    desc: "HD-2026-0012 (Vinhomes) tái ký bảo trì 4 thang — chờ xử lý",
    time: "Hôm qua",
    read: true,
    href: "/admin/contracts",
  },
];

const typeIcon = {
  warning: AlertTriangle,
  info: Wrench,
  success: CheckCircle2,
  reminder: Calendar,
};

const typeColor = {
  warning: "text-warning-foreground bg-warning/15",
  info: "text-info bg-info/10",
  success: "text-success bg-success/10",
  reminder: "text-primary bg-primary/10",
};

export function NotificationPanel() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const markRead = (id: string) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-[10px] font-bold text-white flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <DropdownMenuLabel className="p-0 font-semibold">
            Thông báo
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2 text-[10px] px-1.5 py-0">
                {unreadCount} mới
              </Badge>
            )}
          </DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-primary"
              onClick={markAllRead}
            >
              Đọc tất cả
            </Button>
          )}
        </div>

        <div className="max-h-[400px] overflow-y-auto divide-y">
          {notifications.map((n) => {
            const Icon = typeIcon[n.type];
            return (
              <button
                key={n.id}
                onClick={() => markRead(n.id)}
                className={cn(
                  "w-full text-left flex items-start gap-3 px-4 py-3 hover:bg-muted/50 transition-colors",
                  !n.read && "bg-primary/3"
                )}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                    typeColor[n.type]
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p
                      className={cn(
                        "text-sm leading-snug",
                        !n.read ? "font-semibold" : "font-medium text-muted-foreground"
                      )}
                    >
                      {n.title}
                    </p>
                    {!n.read && (
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                    {n.desc}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1">{n.time}</p>
                </div>
              </button>
            );
          })}
        </div>

        <DropdownMenuSeparator />
        <div className="p-2">
          <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground">
            Xem tất cả thông báo
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}