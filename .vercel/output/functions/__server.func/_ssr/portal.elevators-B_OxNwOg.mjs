import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { A as AppShell, I as Input } from "./AppShell-C3TloUgd.mjs";
import { P as PageHeader } from "./PageHeader-CSUigxIo.mjs";
import { C as Card } from "./card-BbF6o9Kw.mjs";
import { B as Button } from "./button-Cz8PAkJh.mjs";
import { D as DataPagination } from "./DataPagination-BD_Zy1Mn.mjs";
import { S as StatusBadge, e as elevatorStatusLabel, c as elevatorStatusVariant } from "./StatusBadge-CC8Akq8f.mjs";
import { a as mockElevators, c as formatDate } from "./router-CAssNYuO.mjs";
import "../_libs/sonner.mjs";
import { j as Search, a as Building2, M as MapPin, Q as QrCode } from "../_libs/lucide-react.mjs";
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
const CUSTOMER_ID = "c-1";
const PAGE_SIZE = 6;
function PortalElevators() {
  const [page, setPage] = reactExports.useState(1);
  const [search, setSearch] = reactExports.useState("");
  const filtered = mockElevators.filter((e) => e.customerId === CUSTOMER_ID).filter((e) => !search || e.code.toLowerCase().includes(search.toLowerCase()) || e.building.toLowerCase().includes(search.toLowerCase()));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Thang máy của bạn", description: `${filtered.length} thang đang được quản lý` }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 border-b", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Tìm thang máy...", className: "pl-9", value: search, onChange: (e) => {
          setSearch(e.target.value);
          setPage(1);
        } })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3 p-4 sm:grid-cols-2", children: paged.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-sm font-semibold", children: e.code }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
                e.brand,
                " ",
                e.model
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { variant: elevatorStatusVariant[e.status], children: elevatorStatusLabel[e.status] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3 w-3 mt-0.5 shrink-0" }),
            " ",
            e.building
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            e.floors,
            " tầng · BT gần nhất ",
            formatDate(e.lastMaintenance)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            "BT tiếp: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: formatDate(e.nextMaintenance) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 pt-3 border-t flex gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/qr/$elevatorId", params: {
          elevatorId: e.id
        }, className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", className: "w-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(QrCode, { className: "h-3.5 w-3.5 mr-1" }),
          " Xem mã QR"
        ] }) }) })
      ] }, e.id)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DataPagination, { page, pageSize: PAGE_SIZE, total: filtered.length, onPageChange: setPage })
    ] })
  ] });
}
export {
  PortalElevators as component
};
