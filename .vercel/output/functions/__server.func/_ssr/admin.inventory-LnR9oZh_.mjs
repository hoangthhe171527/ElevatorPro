import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { A as AppShell, I as Input } from "./AppShell-C3TloUgd.mjs";
import { P as PageHeader } from "./PageHeader-CSUigxIo.mjs";
import { C as Card } from "./card-BbF6o9Kw.mjs";
import { B as Button } from "./button-Cz8PAkJh.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BMxB0edH.mjs";
import { D as DataPagination } from "./DataPagination-BD_Zy1Mn.mjs";
import { P as Progress } from "./progress-15XaOLql.mjs";
import { S as StatusBadge } from "./StatusBadge-CC8Akq8f.mjs";
import { l as mockInventory, e as formatVND } from "./router-CAssNYuO.mjs";
import "../_libs/sonner.mjs";
import { m as Plus, j as Search, P as Package, T as TriangleAlert } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-progress.mjs";
const PAGE_SIZE = 8;
function InventoryPage() {
  const [page, setPage] = reactExports.useState(1);
  const [search, setSearch] = reactExports.useState("");
  const [catFilter, setCatFilter] = reactExports.useState("all");
  const categories = Array.from(new Set(mockInventory.map((i) => i.category)));
  const filtered = mockInventory.filter((i) => {
    const m1 = !search || i.name.toLowerCase().includes(search.toLowerCase()) || i.code.toLowerCase().includes(search.toLowerCase());
    const m2 = catFilter === "all" || i.category === catFilter;
    return m1 && m2;
  });
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const lowStock = mockInventory.filter((i) => i.stock - i.reserved <= i.reorderLevel).length;
  const totalValue = mockInventory.reduce((s, i) => s + i.stock * i.unitPrice, 0);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Kho vật tư", description: "Theo dõi tồn kho, đặt hàng và cảnh báo dưới ngưỡng", actions: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", children: "Tạo phiếu đặt hàng" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-1.5" }),
        " Thêm vật tư"
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-3 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Tổng vật tư" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-2xl font-bold", children: mockInventory.length })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Cảnh báo sắp hết" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-2xl font-bold text-destructive", children: lowStock })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Giá trị tồn kho" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-xl font-bold text-primary", children: formatVND(totalValue) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3 p-4 border-b", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Tìm vật tư...", className: "pl-9", value: search, onChange: (e) => {
            setSearch(e.target.value);
            setPage(1);
          } })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: catFilter, onValueChange: (v) => {
          setCatFilter(v);
          setPage(1);
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-full sm:w-48", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "Tất cả danh mục" }),
            categories.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c, children: c }, c))
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y", children: paged.map((i) => {
        const available = i.stock - i.reserved;
        const lowStock2 = available <= i.reorderLevel;
        const stockPercent = Math.min(100, i.stock / (i.reorderLevel * 4) * 100);
        return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 hover:bg-muted/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col lg:flex-row gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-5 w-5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: i.name }),
                lowStock2 && /* @__PURE__ */ jsxRuntimeExports.jsxs(StatusBadge, { variant: "destructive", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3 w-3" }),
                  " Sắp hết"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-0.5 text-xs text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono", children: i.code }),
                " · ",
                i.category,
                " · ",
                i.location
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 lg:flex lg:items-center gap-4 lg:gap-6 text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground", children: "Tồn" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-base font-bold", children: [
                i.stock,
                " ",
                i.unit
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground", children: "Đặt trước" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-base font-medium", children: i.reserved })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground", children: "Có sẵn" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-base font-bold ${lowStock2 ? "text-destructive" : "text-success"}`, children: available })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-3 lg:col-span-1 lg:min-w-[140px]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: stockPercent, className: "h-1.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 text-[10px] text-muted-foreground", children: [
                "Ngưỡng: ",
                i.reorderLevel
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-3 lg:col-span-1 text-right", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground", children: "Đơn giá" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold text-primary", children: formatVND(i.unitPrice) })
            ] })
          ] })
        ] }) }, i.id);
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DataPagination, { page, pageSize: PAGE_SIZE, total: filtered.length, onPageChange: setPage })
    ] })
  ] });
}
export {
  InventoryPage as component
};
