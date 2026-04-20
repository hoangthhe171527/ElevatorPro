import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Monitor, Globe, Clock, Save, Eye, Palette } from "lucide-react";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { toast } from "sonner";

// @ts-expect-error - Route type generation lag
export const Route = createFileRoute("/admin/settings")({
  head: () => ({ meta: [{ title: "Cài đặt hệ thống — ElevatorPro" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  
  // Mock settings state
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    marketing: false
  });
  
  const [appearance, setAppearance] = useState({
    theme: "light",
    fontSize: "medium",
    sidebarCollapsed: false
  });

  return (
    <AppShell>
      <PageHeader 
        title="Cài đặt hệ thống" 
        description="Tùy chỉnh trải nghiệm làm việc và thông báo của bạn."
      />

      <div className="grid gap-6 mt-6 max-w-4xl">
        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="h-4 w-4 text-primary" /> Thông báo
            </CardTitle>
            <CardDescription>Quản lý cách thức và thời điểm bạn nhận được thông báo.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="email-notifs" className="flex flex-col space-y-1">
                <span>Thông báo qua Email</span>
                <span className="font-normal text-xs text-muted-foreground">Nhận báo cáo tổng hợp và cảnh báo quan trọng qua hòm thư.</span>
              </Label>
              <Switch 
                id="email-notifs" 
                checked={notifications.email} 
                onCheckedChange={(v) => setNotifications(prev => ({...prev, email: v}))} 
              />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="push-notifs" className="flex flex-col space-y-1">
                <span>Thông báo đẩy (Browser Push)</span>
                <span className="font-normal text-xs text-muted-foreground">Nhận thông báo thời gian thực ngay trên trình duyệt.</span>
              </Label>
              <Switch 
                id="push-notifs" 
                checked={notifications.push} 
                onCheckedChange={(v) => setNotifications(prev => ({...prev, push: v}))} 
              />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="sms-notifs" className="flex flex-col space-y-1">
                <span>Thông báo qua SMS</span>
                <span className="font-normal text-xs text-muted-foreground">Chỉ áp dụng cho các sự cố khẩn cấp (Cấp độ Urgent).</span>
              </Label>
              <Switch 
                id="sms-notifs" 
                checked={notifications.sms} 
                onCheckedChange={(v) => setNotifications(prev => ({...prev, sms: v}))} 
              />
            </div>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Palette className="h-4 w-4 text-primary" /> Giao diện & Trải nghiệm
            </CardTitle>
            <CardDescription>Tùy chỉnh giao diện hiển thị của ứng dụng.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 mb-1.5">
                  <Monitor className="h-3.5 w-3.5 text-muted-foreground" /> Chế độ hiển thị
                </Label>
                <Select value={appearance.theme} onValueChange={(v) => setAppearance(prev => ({...prev, theme: v}))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Sáng (Light)</SelectItem>
                    <SelectItem value="dark">Tối (Dark)</SelectItem>
                    <SelectItem value="system">Theo hệ thống</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2 mb-1.5">
                  <Eye className="h-3.5 w-3.5 text-muted-foreground" /> Kích cỡ chữ
                </Label>
                <Select value={appearance.fontSize} onValueChange={(v) => setAppearance(prev => ({...prev, fontSize: v}))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Nhỏ</SelectItem>
                    <SelectItem value="medium">Trung bình</SelectItem>
                    <SelectItem value="large">Lớn</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Regional Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" /> Ngôn ngữ & Khu vực
            </CardTitle>
            <CardDescription>Thiết lập ngôn ngữ hiển thị và múi giờ làm việc.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="grid sm:grid-cols-2 gap-6">
               <div className="space-y-2">
                 <Label>Ngôn ngữ hiển thị</Label>
                 <Select defaultValue="vi">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vi">Tiếng Việt (VI)</SelectItem>
                      <SelectItem value="en">English (EN)</SelectItem>
                    </SelectContent>
                 </Select>
               </div>
               <div className="space-y-2">
                 <Label className="flex items-center gap-2 mb-1.5">
                   <Clock className="h-3.5 w-3.5 text-muted-foreground" /> Múi giờ
                 </Label>
                 <Select defaultValue="utc7">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utc7">(UTC+07:00) Bangkok, Hanoi, Jakarta</SelectItem>
                      <SelectItem value="utc8">(UTC+08:00) Beijing, Singapore</SelectItem>
                    </SelectContent>
                 </Select>
               </div>
             </div>
          </CardContent>
          <CardFooter className="bg-muted/30 border-t py-4 flex justify-between items-center">
            <p className="text-xs text-muted-foreground">
              Các thay đổi sẽ được áp dụng cho tất cả thiết bị bạn đăng nhập.
            </p>
            <Button onClick={() => setConfirmOpen(true)} className="gap-2">
              <Save className="h-4 w-4" /> Lưu cài đặt
            </Button>
          </CardFooter>
        </Card>
      </div>

      <ConfirmationDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Xác nhận lưu cài đặt"
        description="Bạn có chắc chắn muốn áp dụng các thay đổi về giao diện và thông báo này không? Hệ thống có thể cần tải lại trang để áp dụng một số tùy chọn."
        onConfirm={() => {
          toast.success("Đã ghi nhận thay đổi cài đặt!");
          setConfirmOpen(false);
        }}
      />
    </AppShell>
  );
}
