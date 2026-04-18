import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { A as AppShell, I as Input } from "./AppShell-C3TloUgd.mjs";
import { P as PageHeader } from "./PageHeader-CSUigxIo.mjs";
import { C as Card } from "./card-BbF6o9Kw.mjs";
import { B as Button } from "./button-Cz8PAkJh.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BMxB0edH.mjs";
import { D as DataPagination } from "./DataPagination-BD_Zy1Mn.mjs";
import { j as jobStatusLabel, S as StatusBadge, p as priorityLabel, a as priorityVariant, b as jobStatusVariant } from "./StatusBadge-CC8Akq8f.mjs";
import { m as mockJobs, g as getCustomer, k as getUser, f as formatDateTime } from "./router-CAssNYuO.mjs";
import "../_libs/sonner.mjs";
import { m as Plus, j as Search, B as Briefcase, p as User, d as Calendar } from "../_libs/lucide-react.mjs";
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
const PAGE_SIZE = 8;
const typeLabel = {
  install: "Lắp đặt",
  maintenance: "Bảo trì",
  repair: "Sửa chữa",
  inspection: "Khảo sát"
};
function JobsPage() {
  const [page, setPage] = reactExports.useState(1);
  const [search, setSearch] = reactExports.useState("");
  const [statusFilter, setStatusFilter] = reactExports.useState("all");
  const [typeFilter, setTypeFilter] = reactExports.useState("all");
  const filtered = mockJobs.filter((j) => {
    const cus = getCustomer(j.customerId);
    const m1 = !search || j.code.toLowerCase().includes(search.toLowerCase()) || j.title.toLowerCase().includes(search.toLowerCase()) || cus?.name.toLowerCase().includes(search.toLowerCase());
    const m2 = statusFilter === "all" || j.status === statusFilter;
    const m3 = typeFilter === "all" || j.type === typeFilter;
    return m1 && m2 && m3;
  }).sort((a, b) => b.scheduledFor.localeCompare(a.scheduledFor));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Công việc", description: "Lắp đặt, bảo trì, sửa chữa, khảo sát", actions: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-1.5" }),
      " Tạo công việc"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 sm:grid-cols-4 mb-6", children: Object.entries(jobStatusLabel).slice(0, 4).map(([k, v]) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: v }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-2xl font-bold", children: mockJobs.filter((j) => j.status === k).length })
    ] }, k)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3 p-4 border-b", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Tìm công việc...", className: "pl-9", value: search, onChange: (e) => {
            setSearch(e.target.value);
            setPage(1);
          } })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: typeFilter, onValueChange: (v) => {
          setTypeFilter(v);
          setPage(1);
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-full sm:w-40", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Loại" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "Tất cả loại" }),
            Object.entries(typeLabel).map(([k, v]) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: k, children: v }, k))
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: statusFilter, onValueChange: (v) => {
          setStatusFilter(v);
          setPage(1);
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-full sm:w-44", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "Tất cả trạng thái" }),
            Object.entries(jobStatusLabel).map(([k, v]) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: k, children: v }, k))
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y", children: paged.map((j) => {
        const cus = getCustomer(j.customerId);
        const tech = getUser(j.assignedTo);
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin/jobs/$jobId", params: {
          jobId: j.id
        }, className: "block p-4 hover:bg-muted/30 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col lg:flex-row lg:items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Briefcase, { className: "h-5 w-5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono text-muted-foreground", children: j.code }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground", children: typeLabel[j.type] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { variant: priorityVariant[j.priority], children: priorityLabel[j.priority] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-1 font-semibold truncate", children: j.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 text-xs text-muted-foreground flex flex-wrap gap-x-4 gap-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-3 w-3" }),
                  " ",
                  cus?.name
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-3 w-3" }),
                  " ",
                  formatDateTime(j.scheduledFor)
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  "KT: ",
                  tech?.name
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { variant: jobStatusVariant[j.status], children: jobStatusLabel[j.status] })
        ] }) }, j.id);
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DataPagination, { page, pageSize: PAGE_SIZE, total: filtered.length, onPageChange: setPage })
    ] })
  ] });
}
export {
  JobsPage as component
};
