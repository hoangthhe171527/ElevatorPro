import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { A as AppShell } from "./AppShell-C3TloUgd.mjs";
import { P as PageHeader } from "./PageHeader-CSUigxIo.mjs";
import { C as Card } from "./card-BbF6o9Kw.mjs";
import { B as Button } from "./button-Cz8PAkJh.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BMxB0edH.mjs";
import { S as StatCard } from "./StatCard-D0IYzFPr.mjs";
import { S as StatusBadge, p as priorityLabel, a as priorityVariant } from "./StatusBadge-CC8Akq8f.mjs";
import { R as RouteMap } from "./RouteMap-CWbS39Qf.mjs";
import { m as mockJobs, o as optimizeRoute, g as getCustomer, f as formatDateTime } from "./router-CAssNYuO.mjs";
import { u as useAppStore } from "./store-D0uciryH.mjs";
import "../_libs/sonner.mjs";
import { M as MapPin, R as Route, g as Clock, h as Sparkles, N as Navigation, Z as Zap, i as Phone } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "../_libs/zustand.mjs";
function TechRoute() {
  const userId = useAppStore((s) => s.userId);
  const [day, setDay] = reactExports.useState("all");
  const myActive = reactExports.useMemo(() => mockJobs.filter((j) => j.assignedTo === userId && (j.status === "scheduled" || j.status === "in_progress")), [userId]);
  const days = reactExports.useMemo(() => {
    const set = new Set(myActive.map((j) => j.scheduledFor.split("T")[0]));
    return Array.from(set).sort();
  }, [myActive]);
  const jobs = day === "all" ? myActive : myActive.filter((j) => j.scheduledFor.startsWith(day));
  const route = reactExports.useMemo(() => optimizeRoute(userId, jobs), [userId, jobs]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Lộ trình tối ưu", description: "Hệ thống tự động sắp xếp thứ tự điểm đến giúp bạn di chuyển ngắn nhất", actions: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: day, onValueChange: setDay, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-44", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "Tất cả công việc" }),
        days.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: d, children: new Date(d).toLocaleDateString("vi-VN") }, d))
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 sm:grid-cols-4 mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Số điểm đến", value: route.stops.length, icon: MapPin, accent: "info" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Tổng quãng đường", value: `${route.totalKm.toFixed(1)} km`, icon: Route, accent: "primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Thời gian di chuyển", value: `${route.totalMinutes} phút`, icon: Clock, accent: "warning" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Tiết kiệm so với gốc", value: `${route.savedKm.toFixed(1)} km`, icon: Sparkles, accent: "success" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "overflow-hidden mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RouteMap, { height: 420, routes: [{
      id: userId,
      color: "var(--route-1)",
      label: "Tuyến của bạn",
      route
    }] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-4 py-3 border-b", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Navigation, { className: "h-4 w-4 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-sm", children: "Trình tự đề xuất" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-auto text-xs text-muted-foreground", children: [
          "Xuất phát: ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: route.base.name })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("ol", { className: "divide-y", children: [
        route.stops.map((s, idx) => {
          const job = mockJobs.find((j) => j.id === s.jobId);
          const cus = getCustomer(s.customerId);
          return /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/tech/jobs/$jobId", params: {
            jobId: s.jobId
          }, className: "flex items-start gap-3 p-4 hover:bg-muted/40 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold", children: idx + 1 }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold truncate", children: job.title }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(StatusBadge, { variant: priorityVariant[job.priority], children: [
                  job.priority === "urgent" && /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-3 w-3 mr-0.5 inline" }),
                  priorityLabel[job.priority]
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 text-xs text-muted-foreground space-y-0.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3 w-3" }),
                  " ",
                  cus?.name,
                  " — ",
                  cus?.address
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-wrap", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatDateTime(job.scheduledFor) }),
                  cus?.phone && /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: `tel:${cus.phone}`, className: "flex items-center gap-1 text-primary", onClick: (e) => e.stopPropagation(), children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-3 w-3" }),
                    " ",
                    cus.phone
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs font-semibold", children: [
                s.legKm.toFixed(1),
                " km"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] text-muted-foreground", children: [
                "~",
                s.etaMinutes,
                " phút"
              ] })
            ] })
          ] }) }, s.jobId);
        }),
        route.stops.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "p-12 text-center text-sm text-muted-foreground", children: "Không có công việc nào để tối ưu" })
      ] }),
      route.stops.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 p-3 border-t bg-muted/30", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3 w-3 inline mr-1 text-success" }),
          "Thuật toán nearest-neighbor + ưu tiên urgent"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", className: "gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Navigation, { className: "h-3.5 w-3.5" }),
          " Bắt đầu chỉ đường"
        ] })
      ] })
    ] })
  ] });
}
export {
  TechRoute as component
};
