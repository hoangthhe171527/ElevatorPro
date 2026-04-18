import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Cog, Users, FileText, Briefcase, Building2, Package, BarChart3, QrCode,
  ArrowRight, ShieldCheck, Zap, MapPin, Wrench
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import type { Role } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ElevatorPro — Hệ thống quản lý dịch vụ thang máy" },
      { name: "description", content: "Quản lý toàn diện khách hàng, hợp đồng, công việc bảo trì, lắp đặt, kho vật tư và QR code thang máy." },
    ],
  }),
  component: LandingPage,
});

const roles: { id: Role; title: string; desc: string; href: string; color: string }[] = [
  { id: "admin", title: "Quản trị viên", desc: "Tổng quan toàn hệ thống, KH, hợp đồng, công việc, kho, báo cáo.", href: "/admin", color: "bg-primary" },
  { id: "technician", title: "Kỹ thuật viên", desc: "Nhận công việc, ghi nhận hiện trường, lập biên bản bảo trì/sửa chữa.", href: "/tech", color: "bg-info" },
  { id: "customer", title: "Khách hàng", desc: "Theo dõi thang, hợp đồng, lịch bảo trì và báo lỗi nhanh.", href: "/portal", color: "bg-success" },
];

const features = [
  { icon: Users, title: "CRM khách hàng & lead", desc: "Lưu trữ khách tiềm năng, lịch sử trao đổi, nhắc chăm sóc định kỳ." },
  { icon: FileText, title: "Hợp đồng linh hoạt", desc: "Bảo trì, lắp đặt, sửa chữa — tự sinh công việc khi tạo hợp đồng." },
  { icon: Briefcase, title: "Công việc & điều phối", desc: "Phân công kỹ thuật, theo dõi tiến độ, hình ảnh trước/sau." },
  { icon: Building2, title: "Hồ sơ thang máy", desc: "Mỗi thang một mã, lịch sử bảo trì, cảnh báo đến hạn." },
  { icon: Package, title: "Kho vật tư", desc: "Theo dõi tồn kho, đặt hàng, cảnh báo dưới ngưỡng." },
  { icon: QrCode, title: "QR cho từng thang", desc: "Quét mã xem thông tin, lịch sử và gửi yêu cầu báo lỗi." },
  { icon: BarChart3, title: "Báo cáo tổng quan", desc: "Doanh thu, hợp đồng sắp hết hạn, sự cố, hiệu suất đội." },
  { icon: MapPin, title: "Bản đồ & điều phối", desc: "Vị trí khách hàng, tối ưu tuyến di chuyển kỹ thuật." },
];

function LandingPage() {
  const setRole = useAppStore((s) => s.setRole);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur sticky top-0 z-30">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Cog className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <div className="font-bold leading-tight">ElevatorPro</div>
              <div className="text-[11px] text-muted-foreground">Quản lý dịch vụ thang máy</div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm">
            <a href="#features" className="text-muted-foreground hover:text-foreground">Tính năng</a>
            <a href="#roles" className="text-muted-foreground hover:text-foreground">Vai trò</a>
            <a href="#workflow" className="text-muted-foreground hover:text-foreground">Quy trình</a>
          </div>
          <Link to="/admin">
            <Button size="sm" className="gap-2">Vào hệ thống <ArrowRight className="h-3.5 w-3.5" /></Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-16 lg:py-24 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border bg-muted/50 px-3 py-1 text-xs text-muted-foreground mb-6">
          <Zap className="h-3 w-3 text-primary" /> Prototype demo — dữ liệu mẫu
        </div>
        <h1 className="mx-auto max-w-3xl text-4xl lg:text-6xl font-bold tracking-tight text-foreground">
          Toàn bộ dịch vụ thang máy
          <br />
          <span className="text-primary">trong một hệ thống</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Quản lý khách hàng, hợp đồng, lắp đặt, bảo trì, sửa chữa và kho vật tư.
          Linh hoạt theo thực tế vận hành — không cứng nhắc theo quy trình cố định.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link to="/admin"><Button size="lg" className="gap-2">Xem dashboard quản trị <ArrowRight className="h-4 w-4" /></Button></Link>
          <Link to="/tech"><Button size="lg" variant="outline" onClick={() => setRole("technician")}>Giao diện kỹ thuật</Button></Link>
          <Link to="/portal"><Button size="lg" variant="outline" onClick={() => setRole("customer")}>Cổng khách hàng</Button></Link>
        </div>
      </section>

      {/* Roles */}
      <section id="roles" className="container mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">Chọn vai trò để khám phá</h2>
          <p className="mt-2 text-muted-foreground">3 trải nghiệm tách biệt cho từng nhóm người dùng</p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {roles.map((r) => (
            <Link key={r.id} to={r.href} onClick={() => setRole(r.id)}>
              <Card className="p-6 hover:shadow-elevated transition-all hover:-translate-y-0.5 h-full">
                <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${r.color} text-white mb-4`}>
                  {r.id === "admin" ? <ShieldCheck className="h-5 w-5" /> : r.id === "technician" ? <Wrench className="h-5 w-5" /> : <Users className="h-5 w-5" />}
                </div>
                <h3 className="text-lg font-semibold">{r.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{r.desc}</p>
                <div className="mt-4 flex items-center text-sm text-primary font-medium">
                  Truy cập <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">Tính năng cốt lõi</h2>
          <p className="mt-2 text-muted-foreground">Xoay quanh 3 trục: Khách hàng — Hợp đồng — Công việc</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <Card key={f.title} className="p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-3">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold">{f.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Workflow */}
      <section id="workflow" className="container mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">Quy trình chính</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3 max-w-5xl mx-auto">
          {[
            { num: "01", title: "Bán mới — Lắp đặt", steps: ["Tiếp cận & tư vấn", "Báo giá & ký hợp đồng", "Đặt hàng & lắp đặt", "Bàn giao & bảo hành"] },
            { num: "02", title: "Bảo trì định kỳ", steps: ["Tự nhắc lịch", "Kỹ thuật xác nhận", "Chụp ảnh trước/sau", "Lập biên bản gửi KH"] },
            { num: "03", title: "Sửa chữa đột xuất", steps: ["Khách báo lỗi", "Điều phối nhanh", "Xử lý hiện trường", "Hoàn tất & nghiệm thu"] },
          ].map((wf) => (
            <Card key={wf.num} className="p-6">
              <div className="text-3xl font-bold text-primary/30">{wf.num}</div>
              <h3 className="mt-2 text-lg font-semibold">{wf.title}</h3>
              <ul className="mt-4 space-y-2">
                {wf.steps.map((s, i) => (
                  <li key={s} className="flex items-start gap-2 text-sm">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-bold">{i + 1}</div>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16">
        <Card className="p-10 text-center bg-sidebar text-sidebar-foreground">
          <h2 className="text-3xl font-bold">Sẵn sàng trải nghiệm?</h2>
          <p className="mt-2 text-sidebar-foreground/70">Vào thẳng dashboard — không cần đăng nhập</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link to="/admin"><Button size="lg" variant="default">Quản trị viên</Button></Link>
            <Link to="/tech"><Button size="lg" variant="secondary" onClick={() => setRole("technician")}>Kỹ thuật viên</Button></Link>
            <Link to="/portal"><Button size="lg" variant="secondary" onClick={() => setRole("customer")}>Khách hàng</Button></Link>
          </div>
        </Card>
      </section>

      <footer className="border-t py-6 text-center text-xs text-muted-foreground">
        © 2026 ElevatorPro · Prototype dựa trên biên bản họp 17/04/2026
      </footer>
    </div>
  );
}
