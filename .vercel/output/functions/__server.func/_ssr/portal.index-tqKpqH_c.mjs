import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { A as AppShell } from "./AppShell-C3TloUgd.mjs";
import { P as PageHeader } from "./PageHeader-CSUigxIo.mjs";
import { C as Card } from "./card-BbF6o9Kw.mjs";
import { B as Button } from "./button-Cz8PAkJh.mjs";
import { S as StatCard } from "./StatCard-D0IYzFPr.mjs";
import { S as StatusBadge, e as elevatorStatusLabel, c as elevatorStatusVariant } from "./StatusBadge-CC8Akq8f.mjs";
import { a as mockElevators, b as mockContracts, m as mockJobs, c as formatDate } from "./router-CAssNYuO.mjs";
import { u as useAppStore } from "./store-D0uciryH.mjs";
import "../_libs/sonner.mjs";
import { a as Building2, F as FileText, T as TriangleAlert, A as ArrowRight, Q as QrCode } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-dropdown-menu.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
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
import "../_libs/zustand.mjs";
const CUSTOMER_ID = "c-1";
function PortalIndex() {
  useAppStore();
  const myElevators = mockElevators.filter((e) => e.customerId === CUSTOMER_ID);
  const myContracts = mockContracts.filter((c) => c.customerId === CUSTOMER_ID);
  const myJobs = mockJobs.filter((j) => j.customerId === CUSTOMER_ID);
  const upcomingJob = myJobs.find((j) => j.status === "scheduled" || j.status === "in_progress");
  const dueElevators = myElevators.filter((e) => e.status === "maintenance_due").length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Tổng quan của bạn", description: "Thông tin thang máy, hợp đồng và lịch bảo trì" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-3 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Thang máy của bạn", value: myElevators.length, icon: Building2, accent: "primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Hợp đồng đang hoạt động", value: myContracts.filter((c) => c.status === "active" || c.status === "expiring").length, icon: FileText, accent: "success" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Đến hạn bảo trì", value: dueElevators, icon: TriangleAlert, accent: "warning" })
    ] }),
    upcomingJob && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-5 mb-6 border-l-4 border-l-primary bg-primary/5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-medium text-primary uppercase tracking-wider", children: "Lịch tiếp theo" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 font-semibold", children: upcomingJob.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: formatDate(upcomingJob.scheduledFor) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { children: "Xác nhận lịch" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold", children: "Thang máy của bạn" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/portal/elevators", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", children: [
            "Tất cả ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3.5 w-3.5 ml-1" })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: myElevators.slice(0, 4).map((e) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-3 rounded-lg border hover:bg-muted/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-sm font-medium", children: e.code }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground truncate", children: e.building })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { variant: elevatorStatusVariant[e.status], children: elevatorStatusLabel[e.status] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/qr/$elevatorId", params: {
              elevatorId: e.id
            }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "h-8 w-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(QrCode, { className: "h-3.5 w-3.5" }) }) })
          ] })
        ] }, e.id)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold", children: "Hoạt động gần đây" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/portal/issues", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", children: [
            "Báo lỗi ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3.5 w-3.5 ml-1" })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: myJobs.slice(0, 5).map((j) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 h-2 w-2 rounded-full bg-primary shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium truncate", children: j.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: formatDate(j.scheduledFor) })
          ] })
        ] }, j.id)) })
      ] })
    ] })
  ] });
}
export {
  PortalIndex as component
};
