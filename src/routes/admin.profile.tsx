import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useCurrentUser } from "@/lib/store";
import { User, Mail, Phone, ShieldCheck, Key, Save } from "lucide-react";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/profile")({
  head: () => ({ meta: [{ title: "Hồ sơ cá nhân — ElevatorPro" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const user = useCurrentUser();
  const [name, setName] = useState(user.name.split(" (")[0]);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);

  const [confirmSave, setConfirmSave] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState(false);

  const initials = name
    .split(" ")
    .slice(-2)
    .map((n) => n[0])
    .join("");

  return (
    <AppShell>
      <PageHeader
        title="Hồ sơ cá nhân"
        description="Quản lý thông tin tài khoản và bảo mật của bạn."
      />

      <div className="grid gap-6 lg:grid-cols-3 mt-6">
        {/* Profile Info Summary */}
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4 border-4 border-primary/10">
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-sm text-muted-foreground mt-1 capitalize">ID: {user.id}</p>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {user.memberships[0]?.permissions.map((p) => (
                  <span
                    key={p}
                    className="text-[10px] bg-muted px-2 py-0.5 rounded-full border font-mono"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" /> Trạng thái tài khoản
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Xác thực 2 lớp</span>
                <span className="text-success font-medium">Đã bật</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Lần đăng nhập cuối</span>
                <span className="font-medium text-xs">Vừa xong (Hà Nội, VN)</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Edit Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4 text-primary" /> Thông tin cơ bản
              </CardTitle>
              <CardDescription>Cập nhật họ tên và thông tin liên hệ chính thức.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Họ và tên</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      className="pl-9"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Địa chỉ Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    className="pl-9"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30 border-t py-3 flex justify-end">
              <Button onClick={() => setConfirmSave(true)} className="gap-2">
                <Save className="h-4 w-4" /> Lưu thay đổi
              </Button>
            </CardFooter>
          </Card>

          {/* Password Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Key className="h-4 w-4 text-primary" /> Thay đổi mật khẩu
              </CardTitle>
              <CardDescription>Sử dụng mật khẩu mạnh để bảo vệ tài khoản.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Mật khẩu hiện tại</Label>
                <Input id="current-password" type="password" placeholder="••••••••" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">Mật khẩu mới</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Xác nhận mật khẩu</Label>
                  <Input id="confirm-password" type="password" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30 border-t py-3 flex justify-end">
              <Button
                variant="outline"
                onClick={() => setConfirmPassword(true)}
                className="border-primary text-primary hover:bg-primary/5"
              >
                Cập nhật mật khẩu
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      <ConfirmationDialog
        open={confirmSave}
        onOpenChange={setConfirmSave}
        title="Xác nhận lưu thông tin"
        description="Bạn có chắc chắn muốn cập nhật các thông tin cơ bản này không? Thông tin mới sẽ được áp dụng ngay lập tức."
        onConfirm={() => {
          toast.success("Đã cập nhật thông tin thành công!");
          setConfirmSave(false);
        }}
      />

      <ConfirmationDialog
        open={confirmPassword}
        onOpenChange={setConfirmPassword}
        title="Xác nhận đổi mật khẩu"
        description="Thao tác này sẽ thay đổi mật khẩu truy cập của bạn. Bạn sẽ cần sử dụng mật khẩu mới cho lần đăng nhập sau."
        onConfirm={() => {
          toast.success("Đã thay đổi mật khẩu thành công!");
          setConfirmPassword(false);
        }}
        variant="destructive"
      />
    </AppShell>
  );
}
