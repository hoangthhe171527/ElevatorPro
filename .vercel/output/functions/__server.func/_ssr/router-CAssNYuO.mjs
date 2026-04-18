import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { c as createRouter, u as useRouter, a as createRootRoute, b as createFileRoute, l as lazyRouteComponent, H as HeadContent, S as Scripts, O as Outlet, L as Link } from "../_libs/tanstack__react-router.mjs";
import { G as notFound } from "../_libs/tanstack__router-core.mjs";
import { T as Toaster$1 } from "../_libs/sonner.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "node:stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
const Toaster = ({ ...props }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Toaster$1,
    {
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};
const appCss = "/assets/styles-BKbciYMi.css";
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
const Route$l = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Lovable App" },
      { name: "description", content: "Lift Service Hub is a modern elevator service management system." },
      { name: "author", content: "Lovable" },
      { property: "og:title", content: "Lovable App" },
      { property: "og:description", content: "Lift Service Hub is a modern elevator service management system." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "Lovable App" },
      { name: "twitter:description", content: "Lift Service Hub is a modern elevator service management system." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/7ff846f1-46b4-4037-8e3d-47cd6b577536/id-preview-b8c6b7e4--15be25b7-5615-4f28-8660-d1137b8d33f2.lovable.app-1776504115739.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/7ff846f1-46b4-4037-8e3d-47cd6b577536/id-preview-b8c6b7e4--15be25b7-5615-4f28-8660-d1137b8d33f2.lovable.app-1776504115739.png" }
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, { position: "top-right", richColors: true })
  ] });
}
const $$splitComponentImporter$k = () => import("./index-gQbebquR.mjs");
const Route$k = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "ElevatorPro — Hệ thống quản lý dịch vụ thang máy"
    }, {
      name: "description",
      content: "Quản lý toàn diện khách hàng, hợp đồng, công việc bảo trì, lắp đặt, kho vật tư và QR code thang máy."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$k, "component")
});
const $$splitComponentImporter$j = () => import("./tech.index-BRNop6Te.mjs");
const Route$j = createFileRoute("/tech/")({
  head: () => ({
    meta: [{
      title: "Hôm nay — Kỹ thuật"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$j, "component")
});
const $$splitComponentImporter$i = () => import("./portal.index-tqKpqH_c.mjs");
const Route$i = createFileRoute("/portal/")({
  head: () => ({
    meta: [{
      title: "Cổng khách hàng"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$i, "component")
});
const $$splitComponentImporter$h = () => import("./admin.index-B9YVF-6D.mjs");
const Route$h = createFileRoute("/admin/")({
  head: () => ({
    meta: [{
      title: "Dashboard — ElevatorPro"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$h, "component")
});
const $$splitComponentImporter$g = () => import("./tech.schedule-qyvuuJhx.mjs");
const Route$g = createFileRoute("/tech/schedule")({
  head: () => ({
    meta: [{
      title: "Lịch — Kỹ thuật"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$g, "component")
});
const $$splitComponentImporter$f = () => import("./tech.route-plan-C81Z0h22.mjs");
const Route$f = createFileRoute("/tech/route-plan")({
  head: () => ({
    meta: [{
      title: "Lộ trình tối ưu — Kỹ thuật"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$f, "component")
});
const $$splitComponentImporter$e = () => import("./tech.jobs-ButfLctv.mjs");
const Route$e = createFileRoute("/tech/jobs")({
  head: () => ({
    meta: [{
      title: "Công việc của tôi"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$e, "component")
});
const mockUsers = [
  { id: "u-admin", name: "Nguyễn Quốc Khánh", email: "admin@elevatorpro.vn", phone: "0901 234 567", role: "admin" },
  { id: "u-tech-1", name: "Trần Văn Hùng", email: "hung.tv@elevatorpro.vn", phone: "0912 345 678", role: "technician" },
  { id: "u-tech-2", name: "Lê Minh Tuấn", email: "tuan.lm@elevatorpro.vn", phone: "0913 456 789", role: "technician" },
  { id: "u-cus-1", name: "Phạm Thị Hoa", email: "hoa.pham@vinhome.vn", phone: "0987 654 321", role: "customer" }
];
const mockCustomers = [
  { id: "c-1", name: "Vinhomes Ocean Park", contactPerson: "Phạm Thị Hoa", phone: "0987 654 321", email: "hoa.pham@vinhome.vn", address: "Đa Tốn, Gia Lâm, Hà Nội", type: "business", elevatorCount: 4, createdAt: "2024-03-15", lat: 20.9796, lng: 105.9419 },
  { id: "c-2", name: "Tòa nhà Sunshine Tower", contactPerson: "Trần Đình Bảo", phone: "0911 223 344", email: "bao.td@sunshine.vn", address: "16 Phạm Hùng, Nam Từ Liêm, Hà Nội", type: "business", elevatorCount: 6, createdAt: "2023-11-02", lat: 21.015, lng: 105.7818 },
  { id: "c-3", name: "Khách sạn Mường Thanh", contactPerson: "Lý Hoàng Nam", phone: "0934 556 677", email: "nam.ly@muongthanh.vn", address: "78 Trần Phú, Hà Đông, Hà Nội", type: "business", elevatorCount: 3, createdAt: "2024-06-20", lat: 20.9712, lng: 105.7762 },
  { id: "c-4", name: "Anh Nguyễn Văn An", contactPerson: "Nguyễn Văn An", phone: "0966 778 899", email: "an.nv@gmail.com", address: "Số 12, ngõ 45 Đào Tấn, Ba Đình", type: "individual", elevatorCount: 1, createdAt: "2025-01-10", lat: 21.0356, lng: 105.8118 },
  { id: "c-5", name: "Cao ốc Diamond Plaza", contactPerson: "Đỗ Minh Quân", phone: "0922 334 455", email: "quan.dm@diamond.vn", address: "25 Lê Duẩn, Hoàn Kiếm, Hà Nội", type: "business", elevatorCount: 5, createdAt: "2023-08-14", lat: 21.0245, lng: 105.8412 },
  { id: "c-6", name: "Chung cư Times City", contactPerson: "Hoàng Thị Lan", phone: "0944 556 677", email: "lan.ht@timescity.vn", address: "458 Minh Khai, Hai Bà Trưng, Hà Nội", type: "business", elevatorCount: 8, createdAt: "2024-09-05", lat: 20.9961, lng: 105.8676 },
  { id: "c-7", name: "Anh Trần Quang Dũng", contactPerson: "Trần Quang Dũng", phone: "0977 889 900", email: "dung.tq@gmail.com", address: "234 Cầu Giấy, Hà Nội", type: "individual", elevatorCount: 1, createdAt: "2025-02-20", lat: 21.0345, lng: 105.7905 },
  { id: "c-8", name: "Bệnh viện Hồng Ngọc", contactPerson: "BS. Lê Thị Mai", phone: "0988 776 655", email: "mai.lt@hongngoc.vn", address: "55 Yên Ninh, Ba Đình, Hà Nội", type: "business", elevatorCount: 4, createdAt: "2024-04-18", lat: 21.0438, lng: 105.8425 },
  { id: "c-9", name: "Trường ĐH Bách Khoa", contactPerson: "PGS. Nguyễn Văn Thành", phone: "0902 113 224", email: "thanh.nv@hust.edu.vn", address: "1 Đại Cồ Việt, Hai Bà Trưng", type: "business", elevatorCount: 7, createdAt: "2023-05-12", lat: 21.005, lng: 105.843 },
  { id: "c-10", name: "Tòa nhà Lotte Center", contactPerson: "Kim Min Soo", phone: "0933 445 566", email: "kim.ms@lotte.vn", address: "54 Liễu Giai, Ba Đình, Hà Nội", type: "business", elevatorCount: 12, createdAt: "2022-12-01", lat: 21.0335, lng: 105.8118 },
  { id: "c-11", name: "Chị Đặng Thu Hương", contactPerson: "Đặng Thu Hương", phone: "0908 776 554", email: "huong.dt@gmail.com", address: "78 Trần Duy Hưng, Cầu Giấy", type: "individual", elevatorCount: 1, createdAt: "2025-03-08", lat: 21.0145, lng: 105.7985 },
  { id: "c-12", name: "Khu đô thị Ecopark", contactPerson: "Vũ Đình Tâm", phone: "0917 226 338", email: "tam.vd@ecopark.vn", address: "Văn Giang, Hưng Yên", type: "business", elevatorCount: 9, createdAt: "2024-07-22", lat: 20.965, lng: 105.943 }
];
const mockLeads = [
  { id: "l-1", name: "Tòa nhà Goldmark City", phone: "0901 111 222", email: "info@goldmark.vn", source: "Giới thiệu", address: "136 Hồ Tùng Mậu, Bắc Từ Liêm", note: "Cần lắp 4 thang máy mới cho block C", status: "negotiating", assignedTo: "u-admin", estimatedValue: 24e8, nextFollowUp: "2026-04-25", createdAt: "2026-03-12" },
  { id: "l-2", name: "Văn phòng Capital Tower", phone: "0922 333 444", email: "lan.nguyen@capital.vn", source: "Website", address: "109 Trần Hưng Đạo, Hoàn Kiếm", note: "Quan tâm dịch vụ bảo trì 6 thang", status: "quoted", assignedTo: "u-admin", estimatedValue: 54e7, nextFollowUp: "2026-04-22", createdAt: "2026-03-28" },
  { id: "l-3", name: "Anh Hoàng - nhà phố", phone: "0966 222 111", email: "", source: "Facebook Ads", address: "Mỹ Đình, Nam Từ Liêm", note: "Lắp 1 thang gia đình 5 tầng", status: "contacted", assignedTo: "u-admin", estimatedValue: 38e7, nextFollowUp: "2026-04-20", createdAt: "2026-04-05" },
  { id: "l-4", name: "Bệnh viện An Việt", phone: "0944 222 333", email: "lh@anviet.vn", source: "Khách cũ giới thiệu", address: "1E Trường Chinh, Thanh Xuân", note: "Cải tạo 3 thang cũ", status: "new", assignedTo: "u-admin", estimatedValue: 72e7, nextFollowUp: "2026-04-19", createdAt: "2026-04-15" },
  { id: "l-5", name: "Khách sạn Hanoi Pearl", phone: "0988 444 555", email: "info@hanoipearl.vn", source: "Cold call", address: "6 Bảo Khánh, Hoàn Kiếm", note: "Cần báo giá bảo trì", status: "won", assignedTo: "u-admin", estimatedValue: 18e7, nextFollowUp: "2026-04-30", createdAt: "2026-02-20" },
  { id: "l-6", name: "Văn phòng MB Bank chi nhánh", phone: "0977 555 666", email: "", source: "Triển lãm", address: "21 Cát Linh, Đống Đa", note: "Đang khảo sát", status: "lost", assignedTo: "u-admin", estimatedValue: 29e7, nextFollowUp: "", createdAt: "2026-01-15" },
  { id: "l-7", name: "Chung cư Mipec Riverside", phone: "0913 666 777", email: "bql@mipec.vn", source: "Giới thiệu", address: "Long Biên, Hà Nội", note: "Bảo trì 6 thang", status: "negotiating", assignedTo: "u-admin", estimatedValue: 432e6, nextFollowUp: "2026-04-23", createdAt: "2026-03-30" },
  { id: "l-8", name: "Resort FLC Sầm Sơn", phone: "0902 777 888", email: "kt@flc.vn", source: "Website", address: "Sầm Sơn, Thanh Hóa", note: "Lắp mới 8 thang", status: "quoted", assignedTo: "u-admin", estimatedValue: 56e8, nextFollowUp: "2026-04-28", createdAt: "2026-02-10" },
  { id: "l-9", name: "Anh Vinh - biệt thự", phone: "0934 888 999", email: "", source: "Facebook Ads", address: "Vinhomes Riverside, Long Biên", note: "Thang gia đình 4 tầng", status: "contacted", assignedTo: "u-admin", estimatedValue: 32e7, nextFollowUp: "2026-04-21", createdAt: "2026-04-08" },
  { id: "l-10", name: "Trường Quốc tế UNIS", phone: "0945 999 000", email: "facility@unishanoi.org", source: "Khách cũ giới thiệu", address: "Tây Hồ, Hà Nội", note: "Cải tạo + bảo trì", status: "new", assignedTo: "u-admin", estimatedValue: 98e7, nextFollowUp: "2026-04-24", createdAt: "2026-04-14" },
  { id: "l-11", name: "Showroom Mercedes", phone: "0918 000 111", email: "", source: "Cold call", address: "Phạm Hùng, Cầu Giấy", note: "1 thang chở hàng", status: "new", assignedTo: "u-admin", estimatedValue: 45e7, nextFollowUp: "2026-04-26", createdAt: "2026-04-16" },
  { id: "l-12", name: "Khu nhà ở xã hội ECO", phone: "0967 111 222", email: "ql@ecoxa.vn", source: "Triển lãm", address: "Hoài Đức, Hà Nội", note: "12 thang block A,B,C", status: "quoted", assignedTo: "u-admin", estimatedValue: 72e8, nextFollowUp: "2026-05-02", createdAt: "2026-03-01" }
];
const mockContracts = [
  { id: "ct-1", code: "HD-2024-0142", customerId: "c-1", type: "maintenance", value: 24e7, paid: 24e7, startDate: "2024-04-01", endDate: "2026-04-30", status: "expiring", items: ["Bảo trì 4 thang Mitsubishi định kỳ 1 tháng/lần"], signedAt: "2024-03-20" },
  { id: "ct-2", code: "HD-2023-0218", customerId: "c-2", type: "install", value: 36e8, paid: 36e8, startDate: "2023-11-15", endDate: "2025-11-15", status: "active", items: ["Lắp đặt 6 thang máy Otis 21 tầng"], signedAt: "2023-11-10" },
  { id: "ct-3", code: "HD-2024-0301", customerId: "c-3", type: "maintenance", value: 162e6, paid: 81e6, startDate: "2024-07-01", endDate: "2026-06-30", status: "active", items: ["Bảo trì 3 thang khách sạn"], signedAt: "2024-06-25" },
  { id: "ct-4", code: "HD-2025-0019", customerId: "c-4", type: "install", value: 32e7, paid: 16e7, startDate: "2025-01-15", endDate: "2027-01-15", status: "active", items: ["Lắp 1 thang gia đình 4 tầng"], signedAt: "2025-01-12" },
  { id: "ct-5", code: "HD-2023-0156", customerId: "c-5", type: "maintenance", value: 27e7, paid: 27e7, startDate: "2023-09-01", endDate: "2026-08-31", status: "active", items: ["Bảo trì 5 thang Kone"], signedAt: "2023-08-28" },
  { id: "ct-6", code: "HD-2024-0420", customerId: "c-6", type: "maintenance", value: 432e6, paid: 216e6, startDate: "2024-10-01", endDate: "2026-09-30", status: "active", items: ["Bảo trì 8 thang Schindler"], signedAt: "2024-09-20" },
  { id: "ct-7", code: "HD-2025-0048", customerId: "c-7", type: "install", value: 29e7, paid: 9e7, startDate: "2025-03-01", endDate: "2027-03-01", status: "active", items: ["Lắp 1 thang gia đình"], signedAt: "2025-02-25" },
  { id: "ct-8", code: "HD-2024-0312", customerId: "c-8", type: "maintenance", value: 216e6, paid: 216e6, startDate: "2024-05-01", endDate: "2026-04-30", status: "expiring", items: ["Bảo trì 4 thang bệnh viện ưu tiên 24/7"], signedAt: "2024-04-22" },
  { id: "ct-9", code: "HD-2023-0089", customerId: "c-9", type: "maintenance", value: 378e6, paid: 378e6, startDate: "2023-06-01", endDate: "2026-05-31", status: "active", items: ["Bảo trì 7 thang trường học"], signedAt: "2023-05-25" },
  { id: "ct-10", code: "HD-2022-0410", customerId: "c-10", type: "maintenance", value: 864e6, paid: 72e7, startDate: "2023-01-01", endDate: "2025-12-31", status: "expiring", items: ["Bảo trì 12 thang Lotte"], signedAt: "2022-12-15" },
  { id: "ct-11", code: "HD-2025-0072", customerId: "c-11", type: "install", value: 28e7, paid: 14e7, startDate: "2025-04-01", endDate: "2027-04-01", status: "active", items: ["Lắp 1 thang gia đình"], signedAt: "2025-03-15" },
  { id: "ct-12", code: "HD-2024-0501", customerId: "c-12", type: "maintenance", value: 486e6, paid: 243e6, startDate: "2024-08-01", endDate: "2026-07-31", status: "active", items: ["Bảo trì 9 thang Ecopark"], signedAt: "2024-07-25" },
  { id: "ct-13", code: "HD-2026-0008", customerId: "c-2", type: "repair", value: 85e6, paid: 0, startDate: "2026-04-10", endDate: "2026-05-10", status: "active", items: ["Thay biến tần thang số 3"], signedAt: "2026-04-08" },
  { id: "ct-14", code: "HD-2026-0012", customerId: "c-1", type: "maintenance", value: 264e6, paid: 0, startDate: "2026-05-01", endDate: "2028-04-30", status: "draft", items: ["Tái ký bảo trì 4 thang"], signedAt: "" }
];
const mockElevators = [
  { id: "e-1", code: "VHOP-A1-01", customerId: "c-1", contractId: "ct-1", building: "Tòa A1", address: "Vinhomes Ocean Park", brand: "Mitsubishi", model: "NEXIEZ-MR", floors: 25, installedAt: "2022-04-15", warrantyUntil: "2024-04-15", lastMaintenance: "2026-03-15", nextMaintenance: "2026-04-15", status: "maintenance_due" },
  { id: "e-2", code: "VHOP-A1-02", customerId: "c-1", contractId: "ct-1", building: "Tòa A1", address: "Vinhomes Ocean Park", brand: "Mitsubishi", model: "NEXIEZ-MR", floors: 25, installedAt: "2022-04-15", warrantyUntil: "2024-04-15", lastMaintenance: "2026-03-15", nextMaintenance: "2026-04-15", status: "operational" },
  { id: "e-3", code: "VHOP-B2-01", customerId: "c-1", contractId: "ct-1", building: "Tòa B2", address: "Vinhomes Ocean Park", brand: "Mitsubishi", model: "NEXIEZ-MR", floors: 22, installedAt: "2022-06-20", warrantyUntil: "2024-06-20", lastMaintenance: "2026-03-20", nextMaintenance: "2026-04-20", status: "operational" },
  { id: "e-4", code: "VHOP-B2-02", customerId: "c-1", contractId: "ct-1", building: "Tòa B2", address: "Vinhomes Ocean Park", brand: "Mitsubishi", model: "NEXIEZ-MR", floors: 22, installedAt: "2022-06-20", warrantyUntil: "2024-06-20", lastMaintenance: "2026-03-20", nextMaintenance: "2026-04-20", status: "operational" },
  { id: "e-5", code: "SST-01", customerId: "c-2", contractId: "ct-2", building: "Sunshine Tower", address: "16 Phạm Hùng", brand: "Otis", model: "GeN2", floors: 21, installedAt: "2024-02-10", warrantyUntil: "2026-02-10", lastMaintenance: "2026-03-25", nextMaintenance: "2026-04-25", status: "operational" },
  { id: "e-6", code: "SST-02", customerId: "c-2", contractId: "ct-2", building: "Sunshine Tower", address: "16 Phạm Hùng", brand: "Otis", model: "GeN2", floors: 21, installedAt: "2024-02-10", warrantyUntil: "2026-02-10", lastMaintenance: "2026-03-25", nextMaintenance: "2026-04-25", status: "out_of_order" },
  { id: "e-7", code: "SST-03", customerId: "c-2", contractId: "ct-2", building: "Sunshine Tower", address: "16 Phạm Hùng", brand: "Otis", model: "GeN2", floors: 21, installedAt: "2024-02-10", warrantyUntil: "2026-02-10", lastMaintenance: "2026-03-25", nextMaintenance: "2026-04-25", status: "operational" },
  { id: "e-8", code: "MTH-01", customerId: "c-3", contractId: "ct-3", building: "Mường Thanh Hà Đông", address: "78 Trần Phú", brand: "Hyundai", model: "Luxen", floors: 18, installedAt: "2023-08-01", warrantyUntil: "2025-08-01", lastMaintenance: "2026-03-10", nextMaintenance: "2026-04-10", status: "maintenance_due" },
  { id: "e-9", code: "MTH-02", customerId: "c-3", contractId: "ct-3", building: "Mường Thanh Hà Đông", address: "78 Trần Phú", brand: "Hyundai", model: "Luxen", floors: 18, installedAt: "2023-08-01", warrantyUntil: "2025-08-01", lastMaintenance: "2026-03-10", nextMaintenance: "2026-04-10", status: "operational" },
  { id: "e-10", code: "DPL-01", customerId: "c-5", contractId: "ct-5", building: "Diamond Plaza", address: "25 Lê Duẩn", brand: "Kone", model: "MonoSpace", floors: 15, installedAt: "2023-03-15", warrantyUntil: "2025-03-15", lastMaintenance: "2026-03-30", nextMaintenance: "2026-04-30", status: "operational" },
  { id: "e-11", code: "TC-A-01", customerId: "c-6", contractId: "ct-6", building: "Times City T1", address: "458 Minh Khai", brand: "Schindler", model: "5500", floors: 28, installedAt: "2024-09-10", warrantyUntil: "2026-09-10", lastMaintenance: "2026-04-01", nextMaintenance: "2026-05-01", status: "operational" },
  { id: "e-12", code: "TC-A-02", customerId: "c-6", contractId: "ct-6", building: "Times City T1", address: "458 Minh Khai", brand: "Schindler", model: "5500", floors: 28, installedAt: "2024-09-10", warrantyUntil: "2026-09-10", lastMaintenance: "2026-04-01", nextMaintenance: "2026-05-01", status: "operational" },
  { id: "e-13", code: "BVHN-01", customerId: "c-8", contractId: "ct-8", building: "Bệnh viện Hồng Ngọc", address: "55 Yên Ninh", brand: "Mitsubishi", model: "ELENESSA", floors: 12, installedAt: "2022-04-20", warrantyUntil: "2024-04-20", lastMaintenance: "2026-04-05", nextMaintenance: "2026-05-05", status: "operational" },
  { id: "e-14", code: "LOTTE-01", customerId: "c-10", contractId: "ct-10", building: "Lotte Center", address: "54 Liễu Giai", brand: "Otis", model: "SkyRise", floors: 65, installedAt: "2022-12-01", warrantyUntil: "2024-12-01", lastMaintenance: "2026-04-08", nextMaintenance: "2026-05-08", status: "operational" },
  { id: "e-15", code: "LOTTE-02", customerId: "c-10", contractId: "ct-10", building: "Lotte Center", address: "54 Liễu Giai", brand: "Otis", model: "SkyRise", floors: 65, installedAt: "2022-12-01", warrantyUntil: "2024-12-01", lastMaintenance: "2026-04-08", nextMaintenance: "2026-05-08", status: "operational" }
];
const mockJobs = [
  { id: "j-1", code: "CV-2026-0418", type: "maintenance", title: "Bảo trì định kỳ tháng 4 - VHOP A1", description: "Bảo trì định kỳ 2 thang tòa A1", customerId: "c-1", elevatorId: "e-1", contractId: "ct-1", assignedTo: "u-tech-1", priority: "normal", status: "scheduled", scheduledFor: "2026-04-19T08:00:00", beforePhotos: [], afterPhotos: [], createdAt: "2026-04-15" },
  { id: "j-2", code: "CV-2026-0419", type: "repair", title: "Sửa lỗi cửa thang SST-02", description: "Cửa thang đóng mở chậm, cần kiểm tra cảm biến", customerId: "c-2", elevatorId: "e-6", assignedTo: "u-tech-1", priority: "urgent", status: "in_progress", scheduledFor: "2026-04-18T09:30:00", beforePhotos: ["before1.jpg"], afterPhotos: [], createdAt: "2026-04-18" },
  { id: "j-3", code: "CV-2026-0420", type: "maintenance", title: "Bảo trì Mường Thanh Hà Đông", description: "Bảo trì định kỳ 3 thang", customerId: "c-3", elevatorId: "e-8", contractId: "ct-3", assignedTo: "u-tech-2", priority: "normal", status: "scheduled", scheduledFor: "2026-04-20T08:00:00", beforePhotos: [], afterPhotos: [], createdAt: "2026-04-16" },
  { id: "j-4", code: "CV-2026-0411", type: "maintenance", title: "Bảo trì Diamond Plaza tháng 4", description: "Bảo trì 5 thang Kone", customerId: "c-5", elevatorId: "e-10", contractId: "ct-5", assignedTo: "u-tech-2", priority: "normal", status: "completed", scheduledFor: "2026-04-11T08:00:00", completedAt: "2026-04-11T11:30:00", beforePhotos: ["b1.jpg", "b2.jpg"], afterPhotos: ["a1.jpg", "a2.jpg"], report: "Tất cả thang hoạt động bình thường. Đã thay dầu hộp số thang 1.", createdAt: "2026-04-08" },
  { id: "j-5", code: "CV-2026-0421", type: "install", title: "Lắp đặt thang anh Dũng - giai đoạn cơ khí", description: "Lắp khung, ray dẫn hướng", customerId: "c-7", contractId: "ct-7", assignedTo: "u-tech-1", priority: "high", status: "in_progress", scheduledFor: "2026-04-15T07:30:00", beforePhotos: [], afterPhotos: [], createdAt: "2026-04-10" },
  { id: "j-6", code: "CV-2026-0422", type: "inspection", title: "Khảo sát thang Goldmark City", description: "Khảo sát hiện trạng để báo giá lắp mới", customerId: "c-1", assignedTo: "u-tech-2", priority: "normal", status: "pending", scheduledFor: "2026-04-22T14:00:00", beforePhotos: [], afterPhotos: [], createdAt: "2026-04-17" },
  { id: "j-7", code: "CV-2026-0408", type: "maintenance", title: "Bảo trì Bệnh viện Hồng Ngọc", description: "Bảo trì 4 thang ưu tiên", customerId: "c-8", elevatorId: "e-13", contractId: "ct-8", assignedTo: "u-tech-1", priority: "high", status: "completed", scheduledFor: "2026-04-05T06:00:00", completedAt: "2026-04-05T10:00:00", beforePhotos: ["b.jpg"], afterPhotos: ["a.jpg"], report: "Hoàn tất, hoạt động ổn định.", createdAt: "2026-04-01" },
  { id: "j-8", code: "CV-2026-0423", type: "maintenance", title: "Bảo trì Times City T1", description: "Bảo trì 8 thang Schindler", customerId: "c-6", elevatorId: "e-11", contractId: "ct-6", assignedTo: "u-tech-2", priority: "normal", status: "scheduled", scheduledFor: "2026-04-25T07:00:00", beforePhotos: [], afterPhotos: [], createdAt: "2026-04-15" },
  { id: "j-9", code: "CV-2026-0424", type: "repair", title: "Thay biến tần SST-03", description: "Theo hợp đồng sửa chữa HD-2026-0008", customerId: "c-2", elevatorId: "e-7", contractId: "ct-13", assignedTo: "u-tech-1", priority: "high", status: "scheduled", scheduledFor: "2026-04-23T08:00:00", beforePhotos: [], afterPhotos: [], createdAt: "2026-04-12" },
  { id: "j-10", code: "CV-2026-0425", type: "maintenance", title: "Bảo trì Lotte Center", description: "Bảo trì 12 thang", customerId: "c-10", elevatorId: "e-14", contractId: "ct-10", assignedTo: "u-tech-2", priority: "high", status: "scheduled", scheduledFor: "2026-04-26T05:00:00", beforePhotos: [], afterPhotos: [], createdAt: "2026-04-16" },
  { id: "j-11", code: "CV-2026-0405", type: "repair", title: "Khắc phục thang kẹt Ecopark", description: "Khách báo thang T2 không di chuyển", customerId: "c-12", assignedTo: "u-tech-1", priority: "urgent", status: "completed", scheduledFor: "2026-04-03T15:00:00", completedAt: "2026-04-03T17:30:00", beforePhotos: ["b.jpg"], afterPhotos: ["a.jpg"], report: "Đã thay relay điều khiển, vận hành bình thường.", createdAt: "2026-04-03" },
  { id: "j-12", code: "CV-2026-0426", type: "inspection", title: "Khảo sát BV An Việt", description: "Khảo sát cải tạo 3 thang cũ", customerId: "c-3", assignedTo: "u-tech-2", priority: "normal", status: "pending", scheduledFor: "2026-04-24T14:00:00", beforePhotos: [], afterPhotos: [], createdAt: "2026-04-17" }
];
const mockInventory = [
  { id: "i-1", code: "MOTOR-MIT-15", name: "Mô tơ thang Mitsubishi 15kW", category: "Motor", unit: "Cái", stock: 4, reserved: 1, reorderLevel: 2, unitPrice: 45e6, location: "Kho A - Hà Nội" },
  { id: "i-2", code: "CTRL-OTIS-V8", name: "Tủ điều khiển Otis V8", category: "Tủ điều khiển", unit: "Cái", stock: 2, reserved: 0, reorderLevel: 1, unitPrice: 78e6, location: "Kho A - Hà Nội" },
  { id: "i-3", code: "CABLE-8X11", name: "Cáp thép 8x11mm", category: "Cáp", unit: "Mét", stock: 320, reserved: 50, reorderLevel: 100, unitPrice: 28e4, location: "Kho A - Hà Nội" },
  { id: "i-4", code: "DOOR-AUTO-90", name: "Cửa tự động 900mm", category: "Cửa", unit: "Bộ", stock: 6, reserved: 2, reorderLevel: 3, unitPrice: 22e6, location: "Kho B - Hà Nội" },
  { id: "i-5", code: "BUTTON-LCD", name: "Bảng gọi tầng LCD", category: "Phụ kiện", unit: "Cái", stock: 45, reserved: 8, reorderLevel: 20, unitPrice: 12e5, location: "Kho A - Hà Nội" },
  { id: "i-6", code: "OIL-GEAR-20L", name: "Dầu hộp số 20L", category: "Vật tư bảo trì", unit: "Can", stock: 28, reserved: 5, reorderLevel: 10, unitPrice: 85e4, location: "Kho A - Hà Nội" },
  { id: "i-7", code: "RAIL-T89", name: "Ray dẫn hướng T89", category: "Khung", unit: "Mét", stock: 180, reserved: 60, reorderLevel: 80, unitPrice: 32e4, location: "Kho B - Hà Nội" },
  { id: "i-8", code: "INVERTER-30K", name: "Biến tần 30kW", category: "Điện tử", unit: "Cái", stock: 3, reserved: 1, reorderLevel: 2, unitPrice: 32e6, location: "Kho A - Hà Nội" },
  { id: "i-9", code: "SAFETY-BRAKE", name: "Phanh an toàn cơ khí", category: "Cơ khí", unit: "Bộ", stock: 8, reserved: 0, reorderLevel: 3, unitPrice: 15e6, location: "Kho A - Hà Nội" },
  { id: "i-10", code: "SENSOR-DOOR", name: "Cảm biến cửa hồng ngoại", category: "Cảm biến", unit: "Cái", stock: 24, reserved: 3, reorderLevel: 10, unitPrice: 98e4, location: "Kho A - Hà Nội" },
  { id: "i-11", code: "BUFFER-OIL", name: "Bộ giảm chấn dầu", category: "An toàn", unit: "Bộ", stock: 5, reserved: 1, reorderLevel: 2, unitPrice: 85e5, location: "Kho B - Hà Nội" },
  { id: "i-12", code: "LIGHT-LED-CAB", name: "Đèn LED cabin", category: "Phụ kiện", unit: "Cái", stock: 60, reserved: 0, reorderLevel: 20, unitPrice: 35e4, location: "Kho A - Hà Nội" }
];
const mockIssues = [
  { id: "is-1", elevatorId: "e-6", customerId: "c-2", description: "Cửa thang đóng mở chậm, có tiếng kêu", reportedAt: "2026-04-18T08:15:00", status: "scheduled", jobId: "j-2" },
  { id: "is-2", elevatorId: "e-1", customerId: "c-1", description: "Thang rung lắc nhẹ khi lên xuống", reportedAt: "2026-04-17T16:30:00", status: "scheduled", jobId: "j-1" },
  { id: "is-3", elevatorId: "e-8", customerId: "c-3", description: "Đèn cabin số 2 bị hỏng", reportedAt: "2026-04-16T10:00:00", status: "open" }
];
function getCustomer(id) {
  return mockCustomers.find((c) => c.id === id);
}
function getElevator(id) {
  return mockElevators.find((e) => e.id === id);
}
function getContract(id) {
  return mockContracts.find((c) => c.id === id);
}
function getUser(id) {
  return mockUsers.find((u) => u.id === id);
}
function formatVND(value) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(value);
}
function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}
function formatDateTime(value) {
  if (!value) return "—";
  const d = new Date(value);
  return d.toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}
const techBases = {
  "u-tech-1": { name: "Kho A - Cầu Giấy", lat: 21.0285, lng: 105.8 },
  "u-tech-2": { name: "Kho B - Hà Đông", lat: 20.98, lng: 105.79 }
};
const mapBounds = {
  minLat: 20.94,
  maxLat: 21.06,
  minLng: 105.76,
  maxLng: 105.96
};
function projectLatLng(lat, lng, width, height) {
  const x = (lng - mapBounds.minLng) / (mapBounds.maxLng - mapBounds.minLng) * width;
  const y = (mapBounds.maxLat - lat) / (mapBounds.maxLat - mapBounds.minLat) * height;
  return { x, y };
}
function haversineKm(a, b) {
  const R = 6371;
  const toRad = (d) => d * Math.PI / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
function optimizeRoute(technicianId, jobs, avgSpeedKmh = 25) {
  const base = techBases[technicianId] ?? { name: "Văn phòng", lat: 21.0285, lng: 105.8 };
  const points = jobs.map((j) => {
    const cus = getCustomer(j.customerId);
    if (!cus) return null;
    return { job: j, lat: cus.lat, lng: cus.lng, customer: cus };
  }).filter((x) => x !== null);
  const sortedByTime = [...points].sort((a, b) => a.job.scheduledFor.localeCompare(b.job.scheduledFor));
  let baselineKm = 0;
  let prev = base;
  for (const p of sortedByTime) {
    baselineKm += haversineKm(prev, { lat: p.lat, lng: p.lng });
    prev = { lat: p.lat, lng: p.lng };
  }
  const urgent = points.filter((p) => p.job.priority === "urgent");
  const rest = points.filter((p) => p.job.priority !== "urgent");
  const ordered = [];
  let cursor = base;
  const pickNearest = (pool) => {
    let bestIdx = 0;
    let bestDist = Infinity;
    pool.forEach((p, i) => {
      const d = haversineKm(cursor, { lat: p.lat, lng: p.lng });
      if (d < bestDist) {
        bestDist = d;
        bestIdx = i;
      }
    });
    return pool.splice(bestIdx, 1)[0];
  };
  const ru = [...urgent];
  while (ru.length) {
    const c = pickNearest(ru);
    ordered.push(c);
    cursor = { lat: c.lat, lng: c.lng };
  }
  const rr = [...rest];
  while (rr.length) {
    const c = pickNearest(rr);
    ordered.push(c);
    cursor = { lat: c.lat, lng: c.lng };
  }
  let totalKm = 0;
  let prevPoint = base;
  const stops = ordered.map((p) => {
    const legKm = haversineKm(prevPoint, { lat: p.lat, lng: p.lng });
    totalKm += legKm;
    prevPoint = { lat: p.lat, lng: p.lng };
    return {
      jobId: p.job.id,
      customerId: p.customer.id,
      lat: p.lat,
      lng: p.lng,
      label: p.customer.name,
      legKm,
      etaMinutes: Math.round(legKm / avgSpeedKmh * 60)
    };
  });
  return {
    base,
    stops,
    totalKm,
    totalMinutes: Math.round(totalKm / avgSpeedKmh * 60),
    savedKm: Math.max(0, baselineKm - totalKm)
  };
}
const $$splitComponentImporter$d = () => import("./qr._elevatorId-DJhdlJX4.mjs");
const $$splitNotFoundComponentImporter$2 = () => import("./qr._elevatorId-BMeWt2Sh.mjs");
const Route$d = createFileRoute("/qr/$elevatorId")({
  loader: ({
    params
  }) => {
    const elevator = mockElevators.find((e) => e.id === params.elevatorId);
    if (!elevator) throw notFound();
    return {
      elevator
    };
  },
  head: ({
    loaderData
  }) => ({
    meta: [{
      title: `${loaderData?.elevator.code ?? "Thang"} — QR ElevatorPro`
    }]
  }),
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter$2, "notFoundComponent"),
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
const $$splitComponentImporter$c = () => import("./portal.issues-DR3fhtXZ.mjs");
const Route$c = createFileRoute("/portal/issues")({
  head: () => ({
    meta: [{
      title: "Báo lỗi"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const $$splitComponentImporter$b = () => import("./portal.elevators-B_OxNwOg.mjs");
const Route$b = createFileRoute("/portal/elevators")({
  head: () => ({
    meta: [{
      title: "Thang máy của tôi"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("./portal.contracts-B2rgiXdJ.mjs");
const Route$a = createFileRoute("/portal/contracts")({
  head: () => ({
    meta: [{
      title: "Hợp đồng của tôi"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./admin.reports-BJ6FJWbT.mjs");
const Route$9 = createFileRoute("/admin/reports")({
  head: () => ({
    meta: [{
      title: "Báo cáo — ElevatorPro"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./admin.leads-GPXgUkjR.mjs");
const Route$8 = createFileRoute("/admin/leads")({
  head: () => ({
    meta: [{
      title: "Khách hàng tiềm năng — ElevatorPro"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./admin.jobs-DhPhLnfX.mjs");
const Route$7 = createFileRoute("/admin/jobs")({
  head: () => ({
    meta: [{
      title: "Công việc — ElevatorPro"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./admin.inventory-LnR9oZh_.mjs");
const Route$6 = createFileRoute("/admin/inventory")({
  head: () => ({
    meta: [{
      title: "Kho vật tư — ElevatorPro"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./admin.elevators-MpDjGgY9.mjs");
const Route$5 = createFileRoute("/admin/elevators")({
  head: () => ({
    meta: [{
      title: "Thang máy — ElevatorPro"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./admin.dispatch-XSsmOMFN.mjs");
const Route$4 = createFileRoute("/admin/dispatch")({
  head: () => ({
    meta: [{
      title: "Bản đồ & Điều phối"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./admin.customers-B8s8rVku.mjs");
const Route$3 = createFileRoute("/admin/customers")({
  head: () => ({
    meta: [{
      title: "Khách hàng — ElevatorPro"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./admin.contracts-BfCrP5jz.mjs");
const Route$2 = createFileRoute("/admin/contracts")({
  head: () => ({
    meta: [{
      title: "Hợp đồng — ElevatorPro"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./tech.jobs._jobId-BFlken10.mjs");
const $$splitNotFoundComponentImporter$1 = () => import("./tech.jobs._jobId-D5yvKp91.mjs");
const Route$1 = createFileRoute("/tech/jobs/$jobId")({
  loader: ({
    params
  }) => {
    const job = mockJobs.find((j) => j.id === params.jobId);
    if (!job) throw notFound();
    return {
      job
    };
  },
  head: ({
    loaderData
  }) => ({
    meta: [{
      title: `${loaderData?.job.code ?? "Công việc"}`
    }]
  }),
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter$1, "notFoundComponent"),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./admin.jobs._jobId-BO4f6Eqy.mjs");
const $$splitNotFoundComponentImporter = () => import("./admin.jobs._jobId-Dl_JUTIE.mjs");
const Route = createFileRoute("/admin/jobs/$jobId")({
  loader: ({
    params
  }) => {
    const job = mockJobs.find((j) => j.id === params.jobId);
    if (!job) throw notFound();
    return {
      job
    };
  },
  head: ({
    loaderData
  }) => ({
    meta: [{
      title: `${loaderData?.job.code ?? "Công việc"} — ElevatorPro`
    }]
  }),
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent"),
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const IndexRoute = Route$k.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$l
});
const TechIndexRoute = Route$j.update({
  id: "/tech/",
  path: "/tech/",
  getParentRoute: () => Route$l
});
const PortalIndexRoute = Route$i.update({
  id: "/portal/",
  path: "/portal/",
  getParentRoute: () => Route$l
});
const AdminIndexRoute = Route$h.update({
  id: "/admin/",
  path: "/admin/",
  getParentRoute: () => Route$l
});
const TechScheduleRoute = Route$g.update({
  id: "/tech/schedule",
  path: "/tech/schedule",
  getParentRoute: () => Route$l
});
const TechRoutePlanRoute = Route$f.update({
  id: "/tech/route-plan",
  path: "/tech/route-plan",
  getParentRoute: () => Route$l
});
const TechJobsRoute = Route$e.update({
  id: "/tech/jobs",
  path: "/tech/jobs",
  getParentRoute: () => Route$l
});
const QrElevatorIdRoute = Route$d.update({
  id: "/qr/$elevatorId",
  path: "/qr/$elevatorId",
  getParentRoute: () => Route$l
});
const PortalIssuesRoute = Route$c.update({
  id: "/portal/issues",
  path: "/portal/issues",
  getParentRoute: () => Route$l
});
const PortalElevatorsRoute = Route$b.update({
  id: "/portal/elevators",
  path: "/portal/elevators",
  getParentRoute: () => Route$l
});
const PortalContractsRoute = Route$a.update({
  id: "/portal/contracts",
  path: "/portal/contracts",
  getParentRoute: () => Route$l
});
const AdminReportsRoute = Route$9.update({
  id: "/admin/reports",
  path: "/admin/reports",
  getParentRoute: () => Route$l
});
const AdminLeadsRoute = Route$8.update({
  id: "/admin/leads",
  path: "/admin/leads",
  getParentRoute: () => Route$l
});
const AdminJobsRoute = Route$7.update({
  id: "/admin/jobs",
  path: "/admin/jobs",
  getParentRoute: () => Route$l
});
const AdminInventoryRoute = Route$6.update({
  id: "/admin/inventory",
  path: "/admin/inventory",
  getParentRoute: () => Route$l
});
const AdminElevatorsRoute = Route$5.update({
  id: "/admin/elevators",
  path: "/admin/elevators",
  getParentRoute: () => Route$l
});
const AdminDispatchRoute = Route$4.update({
  id: "/admin/dispatch",
  path: "/admin/dispatch",
  getParentRoute: () => Route$l
});
const AdminCustomersRoute = Route$3.update({
  id: "/admin/customers",
  path: "/admin/customers",
  getParentRoute: () => Route$l
});
const AdminContractsRoute = Route$2.update({
  id: "/admin/contracts",
  path: "/admin/contracts",
  getParentRoute: () => Route$l
});
const TechJobsJobIdRoute = Route$1.update({
  id: "/$jobId",
  path: "/$jobId",
  getParentRoute: () => TechJobsRoute
});
const AdminJobsJobIdRoute = Route.update({
  id: "/$jobId",
  path: "/$jobId",
  getParentRoute: () => AdminJobsRoute
});
const AdminJobsRouteChildren = {
  AdminJobsJobIdRoute
};
const AdminJobsRouteWithChildren = AdminJobsRoute._addFileChildren(
  AdminJobsRouteChildren
);
const TechJobsRouteChildren = {
  TechJobsJobIdRoute
};
const TechJobsRouteWithChildren = TechJobsRoute._addFileChildren(
  TechJobsRouteChildren
);
const rootRouteChildren = {
  IndexRoute,
  AdminContractsRoute,
  AdminCustomersRoute,
  AdminDispatchRoute,
  AdminElevatorsRoute,
  AdminInventoryRoute,
  AdminJobsRoute: AdminJobsRouteWithChildren,
  AdminLeadsRoute,
  AdminReportsRoute,
  PortalContractsRoute,
  PortalElevatorsRoute,
  PortalIssuesRoute,
  QrElevatorIdRoute,
  TechJobsRoute: TechJobsRouteWithChildren,
  TechRoutePlanRoute,
  TechScheduleRoute,
  AdminIndexRoute,
  PortalIndexRoute,
  TechIndexRoute
};
const routeTree = Route$l._addFileChildren(rootRouteChildren)._addFileTypes();
function DefaultErrorComponent({ error, reset }) {
  const router2 = useRouter();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        className: "h-8 w-8 text-destructive",
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
        strokeWidth: 2,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            d: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          }
        )
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold tracking-tight text-foreground", children: "Something went wrong" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "An unexpected error occurred. Please try again." }),
    false,
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex items-center justify-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const getRouter = () => {
  const router2 = createRouter({
    routeTree,
    context: {},
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultErrorComponent: DefaultErrorComponent
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Route$d as R,
  mockElevators as a,
  mockContracts as b,
  formatDate as c,
  mockLeads as d,
  formatVND as e,
  formatDateTime as f,
  getCustomer as g,
  mockCustomers as h,
  mockIssues as i,
  getElevator as j,
  getUser as k,
  mockInventory as l,
  mockJobs as m,
  mockUsers as n,
  optimizeRoute as o,
  Route$1 as p,
  projectLatLng as q,
  Route as r,
  getContract as s,
  router as t
};
