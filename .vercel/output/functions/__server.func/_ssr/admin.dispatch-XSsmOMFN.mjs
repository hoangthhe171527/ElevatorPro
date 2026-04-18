import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { A as AppShell } from "./AppShell-C3TloUgd.mjs";
import { P as PageHeader } from "./PageHeader-CSUigxIo.mjs";
import { C as Card } from "./card-BbF6o9Kw.mjs";
import { S as StatCard } from "./StatCard-D0IYzFPr.mjs";
import { R as RouteMap } from "./RouteMap-CWbS39Qf.mjs";
import { S as StatusBadge, p as priorityLabel, a as priorityVariant } from "./StatusBadge-CC8Akq8f.mjs";
import { n as mockUsers, m as mockJobs, o as optimizeRoute, g as getCustomer, f as formatDateTime } from "./router-CAssNYuO.mjs";
import "../_libs/sonner.mjs";
import { U as Users, M as MapPin, R as Route, h as Sparkles, g as Clock } from "../_libs/lucide-react.mjs";
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
const COLORS = ["var(--route-1)", "var(--route-2)"];
function AdminDispatch() {
  const technicians = mockUsers.filter((u) => u.role === "technician");
  const data = reactExports.useMemo(() => technicians.map((tech, i) => {
    const jobs = mockJobs.filter((j) => j.assignedTo === tech.id && (j.status === "scheduled" || j.status === "in_progress"));
    return {
      tech,
      color: COLORS[i % COLORS.length],
      route: optimizeRoute(tech.id, jobs),
      jobs
    };
  }), [technicians]);
  const totalStops = data.reduce((s, d) => s + d.route.stops.length, 0);
  const totalKm = data.reduce((s, d) => s + d.route.totalKm, 0);
  const totalSaved = data.reduce((s, d) => s + d.route.savedKm, 0);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Bản đồ & Điều phối", description: "Theo dõi vị trí và tối ưu lộ trình của tất cả kỹ thuật viên" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 sm:grid-cols-4 mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Kỹ thuật viên đang hoạt động", value: data.length, icon: Users, accent: "info" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Tổng số điểm đến", value: totalStops, icon: MapPin, accent: "primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Tổng quãng đường tối ưu", value: `${totalKm.toFixed(1)} km`, icon: Route, accent: "warning" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Tiết kiệm", value: `${totalSaved.toFixed(1)} km`, icon: Sparkles, accent: "success" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "overflow-hidden mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RouteMap, { height: 460, routes: data.map((d) => ({
      id: d.tech.id,
      color: d.color,
      label: d.tech.name,
      route: d.route
    })) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 lg:grid-cols-2", children: data.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-4 py-3 border-b", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block h-3 w-3 rounded-sm", style: {
          background: d.color
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-sm", children: d.tech.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-auto text-xs text-muted-foreground", children: [
          d.route.stops.length,
          " điểm · ",
          d.route.totalKm.toFixed(1),
          " km · ",
          d.route.totalMinutes,
          " phút"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("ol", { className: "divide-y max-h-80 overflow-y-auto", children: [
        d.route.stops.map((s, idx) => {
          const job = mockJobs.find((j) => j.id === s.jobId);
          const cus = getCustomer(s.customerId);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-3 p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white text-xs font-bold", style: {
              background: d.color
            }, children: idx + 1 }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium truncate", children: job.title }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { variant: priorityVariant[job.priority], children: priorityLabel[job.priority] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] text-muted-foreground", children: [
                cus?.name,
                " · ",
                formatDateTime(job.scheduledFor)
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right text-[11px] shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-semibold", children: [
                s.legKm.toFixed(1),
                "km"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-muted-foreground flex items-center gap-0.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3" }),
                s.etaMinutes,
                "p"
              ] })
            ] })
          ] }, s.jobId);
        }),
        d.route.stops.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "p-6 text-center text-xs text-muted-foreground", children: "Chưa có công việc" })
      ] })
    ] }, d.tech.id)) })
  ] });
}
export {
  AdminDispatch as component
};
