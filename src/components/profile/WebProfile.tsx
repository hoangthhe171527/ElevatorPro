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

export function WebProfile() {
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
          <Card className="shadow-sm border-slate-100 rounded-3xl overflow-hidden">
            <CardContent className="pt-8 pb-8 flex flex-col items-center text-center bg-slate-50">
              <Avatar className="h-32 w-32 mb-6 border-4 border-white shadow-xl shadow-primary/10">
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-white text-3xl font-black">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-black text-slate-800">{user.name}</h2>
              <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">Mã NV: {user.id}</p>
              <div className="flex flex-wrap justify-center gap-2 mt-6">
                {user.memberships[0]?.permissions.map((p) => (
                  <span
                    key={p}
                    className="text-[11px] bg-white border border-slate-200 text-slate-600 px-3 py-1 rounded-full font-bold uppercase tracking-wider shadow-sm"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-slate-100 rounded-3xl">
            <CardHeader className="pb-4 border-b border-slate-50">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" /> Trạng thái bảo mật
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="flex justify-between items-center text-sm p-3 bg-slate-50 rounded-xl">
                <span className="font-bold text-slate-600">Xác thực 2 lớp</span>
                <span className="text-emerald-600 font-black bg-emerald-100 px-2 py-0.5 rounded uppercase tracking-wider text-[10px]">Đã bật</span>
              </div>
              <div className="flex justify-between items-center text-sm p-3 bg-slate-50 rounded-xl">
                <span className="font-bold text-slate-600">Phiên bản Web / IP</span>
                <span className="font-bold text-slate-800 text-right">Vừa đăng nhập<br/><span className="text-[10px] text-slate-400 uppercase tracking-widest">Hà Nội, VN</span></span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Edit Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info Form */}
          <Card className="shadow-sm border-slate-100 rounded-3xl">
            <CardHeader className="pb-4 border-b border-slate-50">
              <CardTitle className="text-lg font-black text-slate-800 flex items-center gap-2">
                <User className="h-5 w-5 text-primary" /> Thông tin liên hệ
              </CardTitle>
              <CardDescription className="font-medium text-slate-500">Cập nhật họ tên và thông tin liên lạc chính thức.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-slate-500">Họ và tên</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="h-12 bg-slate-50 border-slate-200 focus-visible:ring-primary/20 font-medium" />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-widest text-slate-500">Số điện thoại</Label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="phone"
                      className="pl-11 h-12 bg-slate-50 border-slate-200 focus-visible:ring-primary/20 font-medium"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-slate-500">Địa chỉ Email</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    className="pl-11 h-12 bg-slate-50 border-slate-200 focus-visible:ring-primary/20 font-medium"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-slate-50/50 border-t border-slate-100 py-4 flex justify-end">
              <Button onClick={() => setConfirmSave(true)} className="h-11 px-8 rounded-xl font-bold gap-2 shadow-md">
                <Save className="h-4 w-4" /> Lưu hồ sơ
              </Button>
            </CardFooter>
          </Card>

          {/* Password Form */}
          <Card className="shadow-sm border-slate-100 rounded-3xl">
            <CardHeader className="pb-4 border-b border-slate-50">
              <CardTitle className="text-lg font-black text-slate-800 flex items-center gap-2">
                <Key className="h-5 w-5 text-primary" /> Bảo mật & Đăng nhập
              </CardTitle>
              <CardDescription className="font-medium text-slate-500">Thiết lập mật khẩu định kỳ 6 tháng / lần.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-3">
                <Label htmlFor="current-password" className="text-xs font-bold uppercase tracking-widest text-slate-500">Mật khẩu hiện tại</Label>
                <Input id="current-password" type="password" placeholder="••••••••" className="h-12 bg-slate-50 border-slate-200" />
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="new-password" className="text-xs font-bold uppercase tracking-widest text-slate-500">Mật khẩu mới</Label>
                  <Input id="new-password" type="password" className="h-12 bg-slate-50 border-slate-200" />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="confirm-password" className="text-xs font-bold uppercase tracking-widest text-slate-500">Xác nhận mật khẩu mới</Label>
                  <Input id="confirm-password" type="password" className="h-12 bg-slate-50 border-slate-200" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-slate-50/50 border-t border-slate-100 py-4 flex justify-end">
              <Button
                variant="outline"
                onClick={() => setConfirmPassword(true)}
                className="h-11 px-8 rounded-xl font-bold border-slate-200 text-slate-600 hover:bg-slate-100"
              >
                Đổi mật khẩu
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      <ConfirmationDialog
        open={confirmSave}
        onOpenChange={setConfirmSave}
        title="Lưu hồ sơ?"
        description="Thông tin liên lạc của bạn sẽ được cập nhật trên toàn hệ thống."
        onConfirm={() => {
          toast.success("Đã cập nhật thông tin thành công!");
          setConfirmSave(false);
        }}
      />

      <ConfirmationDialog
        open={confirmPassword}
        onOpenChange={setConfirmPassword}
        title="Đổi mật khẩu?"
        description="Phiên đăng nhập trên các thiết bị khác (App/Web) sẽ tự động đăng xuất."
        onConfirm={() => {
          toast.success("Đã thay đổi mật khẩu!");
          setConfirmPassword(false);
        }}
        variant="destructive"
      />
    </AppShell>
  );
}
