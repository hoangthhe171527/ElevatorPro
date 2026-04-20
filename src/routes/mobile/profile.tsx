import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/layout/MobileShell";
import { useCurrentUser } from "@/lib/store";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Settings, 
  Shield, 
  LogOut, 
  ChevronRight, 
  Mail, 
  Phone,
  HelpCircle,
  Smartphone
} from "lucide-react";

export const Route = createFileRoute("/mobile/profile")({
  head: () => ({ meta: [{ title: "Cá nhân — Mobile" }] }),
  component: MobileProfile,
});

function MobileProfile() {
  const user = useCurrentUser();
  const initials = user.name.split(" ").slice(-2).map(n => n[0]).join("");

  const menuGroups = [
    {
      title: "Tài khoản",
      items: [
        { icon: User, label: "Thông tin cá nhân", color: "bg-blue-100 text-blue-600" },
        { icon: Shield, label: "Bảo mật & Mật khẩu", color: "bg-orange-100 text-orange-600" },
        { icon: Smartphone, label: "Cài đặt ứng dụng", color: "bg-purple-100 text-purple-600" },
      ]
    },
    {
      title: "Hỗ trợ & Pháp lý",
      items: [
        { icon: HelpCircle, label: "Trung tâm trợ giúp", color: "bg-slate-100 text-slate-600" },
        { icon: Mail, label: "Liên hệ hỗ trợ", color: "bg-slate-100 text-slate-600" },
      ]
    }
  ];

  return (
    <MobileShell title="Hồ sơ cá nhân">
      {/* Profile Header */}
      <div className="bg-background px-6 pt-6 pb-8 text-center border-b shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
            <User className="h-32 w-32" />
        </div>
        
        <Avatar className="h-24 w-24 mx-auto border-4 border-primary/10 shadow-lg mb-4">
           <AvatarFallback className="bg-primary text-white text-3xl font-bold">{initials}</AvatarFallback>
        </Avatar>
        <h2 className="text-xl font-bold">{user.name}</h2>
        <div className="text-xs text-muted-foreground mt-1 flex items-center justify-center gap-2">
            <span className="font-mono">{user.id}</span>
            <span>•</span>
            <span className="capitalize">{user.memberships[0]?.permissions[0]}</span>
        </div>

        <div className="flex justify-center gap-3 mt-6">
            <div className="flex flex-col items-center px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Hoàn thành</span>
                <span className="text-sm font-bold mt-0.5">85%</span>
            </div>
            <div className="flex flex-col items-center px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Xếp hạng</span>
                <span className="text-sm font-bold mt-0.5">Silver</span>
            </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {menuGroups.map((group) => (
            <div key={group.title} className="space-y-2">
                <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2">{group.title}</h3>
                <Card className="divide-y border-none shadow-sm overflow-hidden">
                    {group.items.map((item) => {
                        const Icon = item.icon;
                        return (
                            <button key={item.label} className="w-full h-14 flex items-center justify-between px-4 hover:bg-muted/30 active:bg-muted transition-colors text-left group">
                                <div className="flex items-center gap-3">
                                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${item.color}`}>
                                        <Icon className="h-4.5 w-4.5" />
                                    </div>
                                    <span className="text-sm font-medium">{item.label}</span>
                                </div>
                                <ChevronRight className="h-4 w-4 text-muted-foreground/30 transition-transform group-hover:translate-x-1" />
                            </button>
                        )
                    })}
                </Card>
            </div>
        ))}

        <Link to="/" className="block mt-4">
            <Button variant="ghost" className="w-full text-destructive hover:text-destructive hover:bg-destructive/5 gap-2 font-bold py-6 rounded-2xl border border-destructive/10">
                <LogOut className="h-4 w-4" /> ĐĂNG XUẤT
            </Button>
        </Link>
        
        <p className="text-center text-[10px] text-muted-foreground pb-8 pt-4">
            Phiên bản Prototype v2.4.2 · Build 2026.04.20
        </p>
      </div>
    </MobileShell>
  );
}
