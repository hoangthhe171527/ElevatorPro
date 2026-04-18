import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { A as AppShell } from "./AppShell-C3TloUgd.mjs";
import { P as PageHeader } from "./PageHeader-CSUigxIo.mjs";
import { C as Card } from "./card-BbF6o9Kw.mjs";
import { S as StatCard } from "./StatCard-D0IYzFPr.mjs";
import { S as StatusBadge, p as priorityLabel, a as priorityVariant, j as jobStatusLabel, b as jobStatusVariant } from "./StatusBadge-CC8Akq8f.mjs";
import { m as mockJobs, g as getCustomer, f as formatDateTime } from "./router-CAssNYuO.mjs";
import { u as useAppStore } from "./store-D0uciryH.mjs";
import "../_libs/sonner.mjs";
import { B as Briefcase, c as CircleCheck, T as TriangleAlert, d as Calendar, M as MapPin } from "../_libs/lucide-react.mjs";
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
import "../_libs/zustand.mjs";
function TechToday() {
  const userId = useAppStore((s) => s.userId);
  const myJobs = mockJobs.filter((j) => j.assignedTo === userId);
  const today = myJobs.filter((j) => j.status === "scheduled" || j.status === "in_progress");
  const completed = myJobs.filter((j) => j.status === "completed").length;
  const urgent = myJobs.filter((j) => j.priority === "urgent" && j.status !== "completed").length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Hôm nay", description: "Công việc của bạn cần xử lý" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 sm:grid-cols-3 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Cần làm hôm nay", value: today.length, icon: Briefcase, accent: "info" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Đã hoàn thành", value: completed, icon: CircleCheck, accent: "success" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Khẩn cấp", value: urgent, icon: TriangleAlert, accent: "destructive" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 border-b", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold", children: "Công việc tiếp theo" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "divide-y", children: [
        today.map((j) => {
          const cus = getCustomer(j.customerId);
          return /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/tech/jobs/$jobId", params: {
            jobId: j.id
          }, className: "block p-4 hover:bg-muted/30 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Briefcase, { className: "h-5 w-5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold truncate", children: j.title }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { variant: priorityVariant[j.priority], children: priorityLabel[j.priority] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { variant: jobStatusVariant[j.status], children: jobStatusLabel[j.status] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1.5 text-xs text-muted-foreground space-y-0.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-3 w-3" }),
                  " ",
                  formatDateTime(j.scheduledFor)
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3 w-3" }),
                  " ",
                  cus?.name,
                  " — ",
                  cus?.address
                ] })
              ] })
            ] })
          ] }) }, j.id);
        }),
        today.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-12 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "mx-auto h-10 w-10 text-success mb-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Bạn đã hoàn thành tất cả công việc hôm nay!" })
        ] })
      ] })
    ] })
  ] });
}
export {
  TechToday as component
};
