import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { B as Button } from "./button-Cz8PAkJh.mjs";
import { C as Card } from "./card-BbF6o9Kw.mjs";
import { u as useAppStore } from "./store-D0uciryH.mjs";
import "../_libs/sonner.mjs";
import { C as Cog, A as ArrowRight, Z as Zap, S as ShieldCheck, W as Wrench, U as Users, F as FileText, B as Briefcase, a as Building2, P as Package, Q as QrCode, b as ChartColumn, M as MapPin } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/zustand.mjs";
import "./router-CAssNYuO.mjs";
const roles = [{
  id: "admin",
  title: "Quản trị viên",
  desc: "Tổng quan toàn hệ thống, KH, hợp đồng, công việc, kho, báo cáo.",
  href: "/admin",
  color: "bg-primary"
}, {
  id: "technician",
  title: "Kỹ thuật viên",
  desc: "Nhận công việc, ghi nhận hiện trường, lập biên bản bảo trì/sửa chữa.",
  href: "/tech",
  color: "bg-info"
}, {
  id: "customer",
  title: "Khách hàng",
  desc: "Theo dõi thang, hợp đồng, lịch bảo trì và báo lỗi nhanh.",
  href: "/portal",
  color: "bg-success"
}];
const features = [{
  icon: Users,
  title: "CRM khách hàng & lead",
  desc: "Lưu trữ khách tiềm năng, lịch sử trao đổi, nhắc chăm sóc định kỳ."
}, {
  icon: FileText,
  title: "Hợp đồng linh hoạt",
  desc: "Bảo trì, lắp đặt, sửa chữa — tự sinh công việc khi tạo hợp đồng."
}, {
  icon: Briefcase,
  title: "Công việc & điều phối",
  desc: "Phân công kỹ thuật, theo dõi tiến độ, hình ảnh trước/sau."
}, {
  icon: Building2,
  title: "Hồ sơ thang máy",
  desc: "Mỗi thang một mã, lịch sử bảo trì, cảnh báo đến hạn."
}, {
  icon: Package,
  title: "Kho vật tư",
  desc: "Theo dõi tồn kho, đặt hàng, cảnh báo dưới ngưỡng."
}, {
  icon: QrCode,
  title: "QR cho từng thang",
  desc: "Quét mã xem thông tin, lịch sử và gửi yêu cầu báo lỗi."
}, {
  icon: ChartColumn,
  title: "Báo cáo tổng quan",
  desc: "Doanh thu, hợp đồng sắp hết hạn, sự cố, hiệu suất đội."
}, {
  icon: MapPin,
  title: "Bản đồ & điều phối",
  desc: "Vị trí khách hàng, tối ưu tuyến di chuyển kỹ thuật."
}];
function LandingPage() {
  const setRole = useAppStore((s) => s.setRole);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "border-b bg-background/80 backdrop-blur sticky top-0 z-30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto flex h-16 items-center justify-between px-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 items-center justify-center rounded-lg bg-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Cog, { className: "h-5 w-5 text-primary-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold leading-tight", children: "ElevatorPro" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground", children: "Quản lý dịch vụ thang máy" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden md:flex items-center gap-6 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#features", className: "text-muted-foreground hover:text-foreground", children: "Tính năng" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#roles", className: "text-muted-foreground hover:text-foreground", children: "Vai trò" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#workflow", className: "text-muted-foreground hover:text-foreground", children: "Quy trình" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", className: "gap-2", children: [
        "Vào hệ thống ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3.5 w-3.5" })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "container mx-auto px-4 py-16 lg:py-24 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 rounded-full border bg-muted/50 px-3 py-1 text-xs text-muted-foreground mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-3 w-3 text-primary" }),
        " Prototype demo — dữ liệu mẫu"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "mx-auto max-w-3xl text-4xl lg:text-6xl font-bold tracking-tight text-foreground", children: [
        "Toàn bộ dịch vụ thang máy",
        /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "trong một hệ thống" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mx-auto mt-6 max-w-2xl text-lg text-muted-foreground", children: "Quản lý khách hàng, hợp đồng, lắp đặt, bảo trì, sửa chữa và kho vật tư. Linh hoạt theo thực tế vận hành — không cứng nhắc theo quy trình cố định." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex flex-wrap items-center justify-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "lg", className: "gap-2", children: [
          "Xem dashboard quản trị ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/tech", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "lg", variant: "outline", onClick: () => setRole("technician"), children: "Giao diện kỹ thuật" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/portal", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "lg", variant: "outline", onClick: () => setRole("customer"), children: "Cổng khách hàng" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { id: "roles", className: "container mx-auto px-4 py-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-bold", children: "Chọn vai trò để khám phá" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-muted-foreground", children: "3 trải nghiệm tách biệt cho từng nhóm người dùng" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-5 md:grid-cols-3", children: roles.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: r.href, onClick: () => setRole(r.id), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6 hover:shadow-elevated transition-all hover:-translate-y-0.5 h-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex h-11 w-11 items-center justify-center rounded-lg ${r.color} text-white mb-4`, children: r.id === "admin" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-5 w-5" }) : r.id === "technician" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Wrench, { className: "h-5 w-5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold", children: r.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1.5 text-sm text-muted-foreground", children: r.desc }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex items-center text-sm text-primary font-medium", children: [
          "Truy cập ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-1 h-3.5 w-3.5" })
        ] })
      ] }) }, r.id)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { id: "features", className: "container mx-auto px-4 py-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-bold", children: "Tính năng cốt lõi" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-muted-foreground", children: "Xoay quanh 3 trục: Khách hàng — Hợp đồng — Công việc" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4", children: features.map((f) => {
        const Icon = f.icon;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold", children: f.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground leading-relaxed", children: f.desc })
        ] }, f.title);
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { id: "workflow", className: "container mx-auto px-4 py-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center mb-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-bold", children: "Quy trình chính" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-5 md:grid-cols-3 max-w-5xl mx-auto", children: [{
        num: "01",
        title: "Bán mới — Lắp đặt",
        steps: ["Tiếp cận & tư vấn", "Báo giá & ký hợp đồng", "Đặt hàng & lắp đặt", "Bàn giao & bảo hành"]
      }, {
        num: "02",
        title: "Bảo trì định kỳ",
        steps: ["Tự nhắc lịch", "Kỹ thuật xác nhận", "Chụp ảnh trước/sau", "Lập biên bản gửi KH"]
      }, {
        num: "03",
        title: "Sửa chữa đột xuất",
        steps: ["Khách báo lỗi", "Điều phối nhanh", "Xử lý hiện trường", "Hoàn tất & nghiệm thu"]
      }].map((wf) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-bold text-primary/30", children: wf.num }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-2 text-lg font-semibold", children: wf.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-4 space-y-2", children: wf.steps.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-bold", children: i + 1 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: s })
        ] }, s)) })
      ] }, wf.num)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "container mx-auto px-4 py-16", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-10 text-center bg-sidebar text-sidebar-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-bold", children: "Sẵn sàng trải nghiệm?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sidebar-foreground/70", children: "Vào thẳng dashboard — không cần đăng nhập" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap items-center justify-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "lg", variant: "default", children: "Quản trị viên" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/tech", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "lg", variant: "secondary", onClick: () => setRole("technician"), children: "Kỹ thuật viên" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/portal", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "lg", variant: "secondary", onClick: () => setRole("customer"), children: "Khách hàng" }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "border-t py-6 text-center text-xs text-muted-foreground", children: "© 2026 ElevatorPro · Prototype dựa trên biên bản họp 17/04/2026" })
  ] });
}
export {
  LandingPage as component
};
