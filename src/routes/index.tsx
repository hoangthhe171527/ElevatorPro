import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Cog,
  Users,
  FileText,
  Briefcase,
  Building2,
  Package,
  BarChart3,
  QrCode,
  ArrowRight,
  ShieldCheck,
  Zap,
  MapPin,
  Wrench,
  Wallet,
  Building,
  Smartphone,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { mockUsers } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ElevatorPro — Hệ thống quản lý dịch vụ thang máy" },
      {
        name: "description",
        content:
          "Quản lý toàn diện khách hàng, hợp đồng, công việc bảo trì, lắp đặt, kho vật tư và QR code thang máy.",
      },
    ],
  }),
  component: LandingPage,
});

const personas = [
  {
    id: "u-director-2",
    title: "CEO (Phân việc)",
    desc: "Phân công công việc, duyệt tiến độ và theo dõi vận hành tổng thể.",
    href: "/admin",
    color: "bg-primary",
    icon: ShieldCheck,
  },
  {
    id: "u-sales-admin-2",
    title: "Sale Admin",
    desc: "Quản lý lead, khách hàng và theo dõi pipeline hợp đồng.",
    href: "/admin",
    color: "bg-orange-500",
    icon: Users,
  },
  {
    id: "u-intake-2",
    title: "Tiếp nhận & nhập liệu",
    desc: "Nhận thông tin từ hotline, phân loại yêu cầu và nhập liệu vào hệ thống.",
    href: "/admin/leads",
    color: "bg-cyan-500",
    icon: FileText,
  },
  {
    id: "u-accounting-2",
    title: "Kế toán",
    desc: "Quản lý tài chính, hóa đơn và theo dõi công nợ thanh toán.",
    href: "/admin/accounting",
    color: "bg-emerald-500",
    icon: Wallet,
  },
  {
    id: "u-tech-maint-2",
    title: "Kỹ thuật bảo trì",
    desc: "Nhận việc bảo trì, sửa chữa, bảo hành và cập nhật biên bản online.",
    href: "/tech",
    color: "bg-info",
    icon: Wrench,
  },
  {
    id: "u-tech-install-2",
    title: "Kỹ thuật lắp đặt",
    desc: "Nhận các giai đoạn lắp đặt tại công trình và cập nhật tiến độ triển khai.",
    href: "/tech",
    color: "bg-indigo-500",
    icon: Wrench,
  },
  {
    id: "u-cus-1",
    title: "Khách hàng",
    desc: "Quét QR để theo dõi thang, xác nhận biên bản online, thông tin hợp đồng.",
    href: "/portal",
    color: "bg-success",
    icon: Building,
  },
];

const features = [
  {
    icon: Users,
    title: "CRM khách hàng & lead",
    desc: "Lưu trữ khách tiềm năng, lịch sử trao đổi, nhắc chăm sóc định kỳ.",
  },
  {
    icon: FileText,
    title: "Hợp đồng linh hoạt",
    desc: "Bảo trì, lắp đặt, sửa chữa — tự sinh công việc khi tạo hợp đồng.",
  },
  {
    icon: Briefcase,
    title: "Công việc & điều phối",
    desc: "Phân công kỹ thuật, theo dõi tiến độ, hình ảnh trước/sau.",
  },
  {
    icon: Building2,
    title: "Hồ sơ thang máy",
    desc: "Mỗi thang một mã, lịch sử bảo trì, cảnh báo đến hạn.",
  },
  { icon: Package, title: "Kho vật tư", desc: "Theo dõi tồn kho, đặt hàng, cảnh báo dưới ngưỡng." },
  {
    icon: QrCode,
    title: "QR cho từng thang",
    desc: "Quét mã xem thông tin, lịch sử và gửi yêu cầu báo lỗi.",
  },
  {
    icon: BarChart3,
    title: "Báo cáo tổng quan",
    desc: "Doanh thu, hợp đồng sắp hết hạn, sự cố, hiệu suất đội.",
  },
  {
    icon: MapPin,
    title: "Bản đồ & điều phối",
    desc: "Vị trí khách hàng, tối ưu tuyến di chuyển kỹ thuật.",
  },
];

function LandingPage() {
  const { setUserId, setAppPreview } = useAppStore();

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
            <a href="#features" className="text-muted-foreground hover:text-foreground">
              Tính năng
            </a>
            <a href="#personas" className="text-muted-foreground hover:text-foreground">
              Phân quyền RBAC
            </a>
            <a href="#workflow" className="text-muted-foreground hover:text-foreground">
              Quy trình
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/app/admin" onClick={() => { setUserId("u-director-2"); setAppPreview(true); }}>
              <Button size="sm" variant="outline" className="hidden sm:flex gap-2">
                <Smartphone className="h-3.5 w-3.5" /> Mobile App
              </Button>
            </Link>
            <Link to="/admin" onClick={() => { setUserId("u-director-2"); setAppPreview(false); }}>
              <Button size="sm" className="gap-2">
                Bản Web <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-16 lg:py-24 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border bg-muted/50 px-3 py-1 text-xs text-muted-foreground mb-6">
          <Zap className="h-3 w-3 text-primary" /> Prototype demo — Hệ thống phân quyền động
        </div>
        <h1 className="mx-auto max-w-3xl text-4xl lg:text-6xl font-bold tracking-tight text-foreground">
          Được thiết kế linh hoạt cho
          <br />
          <span className="text-primary">mọi quy mô doanh nghiệp</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Quản lý từ một tập thể vài người "đa nhiệm" (Multi-role) đến các tổng công ty chia tách
          độc lập các phòng Kế toán, Kinh doanh, Điều phối Kỹ thuật.
        </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/admin" onClick={() => { setUserId("u-director-2"); setAppPreview(false); }}>
              <Button
                size="lg"
                className="gap-2 bg-primary hover:bg-primary/90 text-white border-2 border-primary shadow-lg shadow-primary/20 w-full sm:w-auto"
              >
                Vào hệ thống Web <Zap className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/app/admin" onClick={() => { setUserId("u-director-2"); setAppPreview(true); }}>
              <Button
                size="lg"
                variant="outline"
                className="gap-2 border-2 shadow-lg w-full sm:w-auto"
              >
                Trải nghiệm Mobile App <Smartphone className="h-4 w-4" />
              </Button>
            </Link>
          </div>
      </section>

      {/* Roles */}
      <section id="personas" className="container mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">Chọn mô hình nhân sự để trải nghiệm</h2>
          <p className="mt-2 text-muted-foreground">
            Hệ thống phân quyền được tinh chỉnh cá nhân hóa cho từng bộ phận
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {personas.map((p) => {
            const Icon = p.icon;
            return (
              <Link key={p.id} to={p.href} onClick={() => setUserId(p.id)}>
                <Card className="p-6 hover:shadow-elevated transition-all hover:-translate-y-0.5 h-full border-primary/20 bg-background/50">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-lg ${p.color} text-white mb-4 shadow-sm`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold whitespace-pre-wrap leading-tight">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
                  <div className="mt-4 flex items-center text-sm text-primary font-medium group">
                    Khám phá quyền hạn{" "}
                    <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">Tính năng cốt lõi</h2>
          <p className="mt-2 text-muted-foreground">
            Xoay quanh 3 trục: Khách hàng — Hợp đồng — Công việc
          </p>
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
            {
              num: "01",
              title: "Bán mới — Lắp đặt",
              steps: [
                "Tiếp cận & tư vấn",
                "Báo giá & ký hợp đồng",
                "Đặt hàng & lắp đặt",
                "Bàn giao & bảo hành",
              ],
            },
            {
              num: "02",
              title: "Bảo trì định kỳ",
              steps: [
                "Tự nhắc lịch",
                "Kỹ thuật xác nhận",
                "Chụp ảnh trước/sau",
                "Lập biên bản gửi KH",
              ],
            },
            {
              num: "03",
              title: "Sửa chữa đột xuất",
              steps: [
                "Khách báo lỗi",
                "Điều phối nhanh",
                "Xử lý hiện trường",
                "Hoàn tất & nghiệm thu",
              ],
            },
          ].map((wf) => (
            <Card key={wf.num} className="p-6">
              <div className="text-3xl font-bold text-primary/30">{wf.num}</div>
              <h3 className="mt-2 text-lg font-semibold">{wf.title}</h3>
              <ul className="mt-4 space-y-2">
                {wf.steps.map((s, i) => (
                  <li key={s} className="flex items-start gap-2 text-sm">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                      {i + 1}
                    </div>
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
          <p className="mt-2 text-sidebar-foreground/70">
            Vào thẳng giao diện — không cần đăng nhập
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link to="/admin" onClick={() => setUserId("u-director-2")}>
              <Button size="lg" variant="default">
                Login CEO
              </Button>
            </Link>
            <Link to="/admin" onClick={() => setUserId("u-sm-biz")}>
              <Button size="lg" variant="secondary">
                Cty Nhỏ Đa Nhiệm
              </Button>
            </Link>
            <Link to="/admin/accounting" onClick={() => setUserId("u-accounting")}>
              <Button
                size="lg"
                variant="secondary"
                className="border-secondary text-primary hover:bg-secondary"
              >
                Kế toán chuyên biệt
              </Button>
            </Link>
          </div>
        </Card>
      </section>

      <footer className="border-t py-6 text-center text-xs text-muted-foreground">
        © 2026 ElevatorPro · Prototype dựa trên biên bản họp 17/04/2026
      </footer>
    </div>
  );
}
