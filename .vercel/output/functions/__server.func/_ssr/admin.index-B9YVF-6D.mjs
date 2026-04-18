import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { A as AppShell } from "./AppShell-C3TloUgd.mjs";
import { P as PageHeader } from "./PageHeader-CSUigxIo.mjs";
import { S as StatCard } from "./StatCard-D0IYzFPr.mjs";
import { C as Card } from "./card-BbF6o9Kw.mjs";
import { B as Button } from "./button-Cz8PAkJh.mjs";
import { S as StatusBadge, p as priorityLabel, a as priorityVariant, j as jobStatusLabel, b as jobStatusVariant, d as contractStatusLabel, f as contractStatusVariant } from "./StatusBadge-CC8Akq8f.mjs";
import { b as mockContracts, a as mockElevators, m as mockJobs, d as mockLeads, e as formatVND, h as mockCustomers, g as getCustomer, f as formatDateTime, c as formatDate } from "./router-CAssNYuO.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import "../_libs/sonner.mjs";
import { e as TrendingUp, B as Briefcase, F as FileText, T as TriangleAlert, U as Users, a as Building2, f as ArrowUpRight, d as Calendar } from "../_libs/lucide-react.mjs";
import "./store-D0uciryH.mjs";
import "../_libs/zustand.mjs";
import "../_libs/radix-ui__react-dropdown-menu.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-menu.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/radix-ui__react-avatar.mjs";
import "../_libs/@radix-ui/react-use-is-hydrated+[...].mjs";
import "../_libs/use-sync-external-store.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/isbot.mjs";
function AdminDashboard() {
  const totalRevenue = mockContracts.reduce((s, c) => s + c.paid, 0);
  const expiringContracts = mockContracts.filter((c) => c.status === "expiring").length;
  const overdueElevators = mockElevators.filter((e) => e.status === "maintenance_due").length;
  const activeJobs = mockJobs.filter((j) => j.status === "in_progress" || j.status === "scheduled").length;
  const newLeads = mockLeads.filter((l) => l.status === "new" || l.status === "contacted").length;
  const upcomingJobs = [...mockJobs].filter((j) => j.status === "scheduled" || j.status === "in_progress").sort((a, b) => a.scheduledFor.localeCompare(b.scheduledFor)).slice(0, 6);
  const recentContracts = [...mockContracts].sort((a, b) => b.signedAt.localeCompare(a.signedAt)).slice(0, 5);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Tổng quan hệ thống", description: "Xin chào, đây là tình hình hoạt động hôm nay" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Doanh thu đã thu", value: formatVND(totalRevenue), icon: TrendingUp, accent: "success", trend: {
        value: "12% so tháng trước",
        positive: true
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Công việc đang chạy", value: activeJobs, icon: Briefcase, accent: "info", hint: `${mockJobs.length} công việc tổng` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "HĐ sắp hết hạn", value: expiringContracts, icon: FileText, accent: "warning", hint: "Cần liên hệ tái ký" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Thang đến hạn BT", value: overdueElevators, icon: TriangleAlert, accent: "destructive", hint: "Cần lên lịch ngay" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 lg:grid-cols-3 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Tổng khách hàng", value: mockCustomers.length, icon: Users, accent: "primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Tổng thang máy quản lý", value: mockElevators.length, icon: Building2, accent: "primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Lead đang theo dõi", value: newLeads, icon: ArrowUpRight, accent: "info" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "lg:col-span-2 p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold", children: "Công việc sắp tới" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Đã lên lịch hoặc đang thực hiện" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin/jobs", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", children: "Tất cả" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y", children: upcomingJobs.map((j) => {
          const cus = getCustomer(j.customerId);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/admin/jobs/$jobId", params: {
            jobId: j.id
          }, className: "flex items-center gap-3 py-3 hover:bg-muted/50 -mx-2 px-2 rounded", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Briefcase, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-sm truncate", children: j.title }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { variant: priorityVariant[j.priority], children: priorityLabel[j.priority] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground truncate", children: [
                cus?.name,
                " · ",
                formatDateTime(j.scheduledFor)
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { variant: jobStatusVariant[j.status], children: jobStatusLabel[j.status] })
          ] }, j.id);
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold", children: "Hợp đồng gần đây" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin/contracts", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", children: "Tất cả" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: recentContracts.map((c) => {
          const cus = getCustomer(c.customerId);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/admin/contracts", className: "block p-3 rounded-lg border hover:bg-muted/50 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-sm", children: c.code }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { variant: contractStatusVariant[c.status], children: contractStatusLabel[c.status] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-xs text-muted-foreground truncate", children: cus?.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center justify-between text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: formatDate(c.endDate) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-primary", children: formatVND(c.value) })
            ] })
          ] }, c.id);
        }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "mt-6 p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 text-warning-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold", children: "Cảnh báo cần xử lý" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3 md:grid-cols-3", children: [{
        icon: Calendar,
        label: "Thang đến hạn bảo trì",
        count: overdueElevators,
        href: "/admin/elevators",
        color: "text-warning-foreground bg-warning/15"
      }, {
        icon: FileText,
        label: "Hợp đồng sắp hết hạn",
        count: expiringContracts,
        href: "/admin/contracts",
        color: "text-destructive bg-destructive/10"
      }, {
        icon: TriangleAlert,
        label: "Sự cố đang mở",
        count: 1,
        href: "/admin/jobs",
        color: "text-info bg-info/10"
      }].map((a) => {
        const Icon = a.icon;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: a.href, className: "flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex h-10 w-10 items-center justify-center rounded-lg ${a.color}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: a.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold", children: a.count })
          ] })
        ] }, a.label);
      }) })
    ] })
  ] });
}
export {
  AdminDashboard as component
};
