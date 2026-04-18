import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { A as AppShell } from "./AppShell-C3TloUgd.mjs";
import { P as PageHeader } from "./PageHeader-CSUigxIo.mjs";
import { C as Card } from "./card-BbF6o9Kw.mjs";
import { S as StatCard } from "./StatCard-D0IYzFPr.mjs";
import { b as mockContracts, m as mockJobs, e as formatVND, h as mockCustomers, a as mockElevators } from "./router-CAssNYuO.mjs";
import "../_libs/sonner.mjs";
import { e as TrendingUp, F as FileText, B as Briefcase, U as Users } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__react-router.mjs";
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
import "./store-D0uciryH.mjs";
import "../_libs/zustand.mjs";
import "./button-Cz8PAkJh.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-dropdown-menu.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
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
function ReportsPage() {
  const totalRevenue = mockContracts.reduce((s, c) => s + c.paid, 0);
  const totalContractValue = mockContracts.reduce((s, c) => s + c.value, 0);
  const completionRate = Math.round(mockJobs.filter((j) => j.status === "completed").length / mockJobs.length * 100);
  const byType = mockContracts.reduce((acc, c) => {
    acc[c.type] = (acc[c.type] || 0) + c.value;
    return acc;
  }, {});
  const typeLabel = {
    install: "Lắp đặt",
    maintenance: "Bảo trì",
    repair: "Sửa chữa"
  };
  const jobByStatus = mockJobs.reduce((acc, j) => {
    acc[j.status] = (acc[j.status] || 0) + 1;
    return acc;
  }, {});
  const statusLabel = {
    pending: "Chờ",
    scheduled: "Đã lên lịch",
    in_progress: "Đang làm",
    completed: "Hoàn thành",
    cancelled: "Hủy"
  };
  const statusColor = {
    pending: "bg-muted-foreground",
    scheduled: "bg-info",
    in_progress: "bg-warning",
    completed: "bg-success",
    cancelled: "bg-destructive"
  };
  const months = ["T11", "T12", "T1", "T2", "T3", "T4"];
  const monthlyJobs = [18, 22, 25, 19, 28, 24];
  const maxMonth = Math.max(...monthlyJobs);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Báo cáo & phân tích", description: "Tổng quan hiệu suất kinh doanh và vận hành" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Doanh thu đã thu", value: formatVND(totalRevenue), icon: TrendingUp, accent: "success" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Giá trị HĐ ký", value: formatVND(totalContractValue), icon: FileText, accent: "primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Tỉ lệ hoàn thành", value: `${completionRate}%`, icon: Briefcase, accent: "info" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Khách + Thang", value: `${mockCustomers.length} / ${mockElevators.length}`, icon: Users, accent: "primary" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold mb-4", children: "Doanh thu theo loại hợp đồng" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: Object.entries(byType).map(([type, value]) => {
          const percent = Math.round(value / totalContractValue * 100);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm mb-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: typeLabel[type] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
                formatVND(value),
                " · ",
                percent,
                "%"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-primary rounded-full", style: {
              width: `${percent}%`
            } }) })
          ] }, type);
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold mb-4", children: "Phân bố trạng thái công việc" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: Object.entries(jobByStatus).map(([status, count]) => {
          const percent = Math.round(count / mockJobs.length * 100);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm mb-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: statusLabel[status] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
                count,
                " · ",
                percent,
                "%"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-full ${statusColor[status]} rounded-full`, style: {
              width: `${percent}%`
            } }) })
          ] }, status);
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5 lg:col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold mb-4", children: "Số lượng công việc 6 tháng gần nhất" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-end justify-between gap-3 h-48", children: months.map((m, i) => {
          const h = monthlyJobs[i] / maxMonth * 100;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full flex flex-col justify-end", style: {
              height: "160px"
            }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full bg-primary rounded-t-md transition-all relative group cursor-pointer hover:bg-primary/80", style: {
              height: `${h}%`
            }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-semibold opacity-0 group-hover:opacity-100", children: monthlyJobs[i] }) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground font-medium", children: m })
          ] }, m);
        }) })
      ] })
    ] })
  ] });
}
export {
  ReportsPage as component
};
