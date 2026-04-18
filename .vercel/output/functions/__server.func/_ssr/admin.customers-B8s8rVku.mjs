import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { A as AppShell, I as Input, B as Badge } from "./AppShell-C3TloUgd.mjs";
import { P as PageHeader } from "./PageHeader-CSUigxIo.mjs";
import { C as Card } from "./card-BbF6o9Kw.mjs";
import { B as Button } from "./button-Cz8PAkJh.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BMxB0edH.mjs";
import { D as DataPagination } from "./DataPagination-BD_Zy1Mn.mjs";
import { h as mockCustomers, b as mockContracts, a as mockElevators, c as formatDate } from "./router-CAssNYuO.mjs";
import "../_libs/sonner.mjs";
import { m as Plus, j as Search, a as Building2, p as User, i as Phone, o as Mail, M as MapPin, q as ChevronRight } from "../_libs/lucide-react.mjs";
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
const PAGE_SIZE = 6;
function CustomersPage() {
  const [page, setPage] = reactExports.useState(1);
  const [search, setSearch] = reactExports.useState("");
  const [typeFilter, setTypeFilter] = reactExports.useState("all");
  const filtered = mockCustomers.filter((c) => {
    const m1 = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search);
    const m2 = typeFilter === "all" || c.type === typeFilter;
    return m1 && m2;
  });
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Khách hàng", description: `${mockCustomers.length} khách hàng đang quản lý`, actions: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-1.5" }),
      " Thêm khách hàng"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3 p-4 border-b", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Tìm khách hàng...", className: "pl-9", value: search, onChange: (e) => {
            setSearch(e.target.value);
            setPage(1);
          } })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: typeFilter, onValueChange: (v) => {
          setTypeFilter(v);
          setPage(1);
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-full sm:w-44", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "Tất cả loại" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "business", children: "Doanh nghiệp" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "individual", children: "Cá nhân" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y", children: paged.map((c) => {
        const contracts = mockContracts.filter((ct) => ct.customerId === c.id).length;
        const elevators = mockElevators.filter((e) => e.customerId === c.id).length;
        return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 hover:bg-muted/30 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${c.type === "business" ? "bg-primary/10 text-primary" : "bg-info/10 text-info"}`, children: c.type === "business" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-5 w-5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-5 w-5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold truncate", children: c.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-[10px]", children: c.type === "business" ? "Doanh nghiệp" : "Cá nhân" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 text-xs text-muted-foreground", children: [
                "Người liên hệ: ",
                c.contactPerson
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-3 w-3" }),
                  " ",
                  c.phone
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-3 w-3" }),
                  " ",
                  c.email
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3 w-3" }),
                  " ",
                  c.address
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-6 md:gap-4 text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-bold", children: elevators }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground", children: "Thang" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-bold", children: contracts }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground", children: "Hợp đồng" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center min-w-[80px]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Từ" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-medium", children: formatDate(c.createdAt) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", children: [
            "Chi tiết ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-3.5 w-3.5 ml-1" })
          ] })
        ] }) }, c.id);
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DataPagination, { page, pageSize: PAGE_SIZE, total: filtered.length, onPageChange: setPage })
    ] })
  ] });
}
export {
  CustomersPage as component
};
