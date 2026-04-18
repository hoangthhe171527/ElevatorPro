import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { A as AppShell } from "./AppShell-C3TloUgd.mjs";
import { P as PageHeader } from "./PageHeader-CSUigxIo.mjs";
import { C as Card } from "./card-BbF6o9Kw.mjs";
import { B as Button } from "./button-Cz8PAkJh.mjs";
import { T as Textarea } from "./textarea-CIfPmIKy.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BMxB0edH.mjs";
import { D as DataPagination } from "./DataPagination-BD_Zy1Mn.mjs";
import { S as StatusBadge } from "./StatusBadge-CC8Akq8f.mjs";
import { a as mockElevators, i as mockIssues, j as getElevator, f as formatDateTime } from "./router-CAssNYuO.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { T as TriangleAlert, l as Send } from "../_libs/lucide-react.mjs";
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
const CUSTOMER_ID = "c-1";
const PAGE_SIZE = 5;
const statusLabel = {
  open: "Đang mở",
  scheduled: "Đã tiếp nhận",
  resolved: "Đã giải quyết"
};
const statusVariant = {
  open: "destructive",
  scheduled: "info",
  resolved: "success"
};
function PortalIssues() {
  const [page, setPage] = reactExports.useState(1);
  const [elevatorId, setElevatorId] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const myElevators = mockElevators.filter((e) => e.customerId === CUSTOMER_ID);
  const myIssues = mockIssues.filter((i) => i.customerId === CUSTOMER_ID);
  const paged = myIssues.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const submit = () => {
    if (!elevatorId || !description.trim()) {
      toast.error("Vui lòng chọn thang và mô tả sự cố");
      return;
    }
    toast.success("Đã gửi báo lỗi! Chúng tôi sẽ liên hệ trong vòng 30 phút.");
    setDescription("");
    setElevatorId("");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Báo lỗi & sự cố", description: "Gửi yêu cầu kiểm tra hoặc sửa chữa nhanh" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5 lg:col-span-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 text-warning-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold", children: "Báo lỗi mới" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-medium text-muted-foreground", children: "Chọn thang" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: elevatorId, onValueChange: setElevatorId, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "mt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Chọn thang máy..." }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: myElevators.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: e.id, children: [
                e.code,
                " — ",
                e.building
              ] }, e.id)) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-medium text-muted-foreground", children: "Mô tả sự cố" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { placeholder: "Mô tả chi tiết hiện tượng...", value: description, onChange: (e) => setDescription(e.target.value), rows: 5, className: "mt-1" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: submit, className: "w-full", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4 mr-1.5" }),
            " Gửi báo lỗi"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "lg:col-span-2 overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 border-b", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold", children: "Lịch sử báo lỗi" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "divide-y", children: [
          paged.map((i) => {
            const elev = getElevator(i.elevatorId);
            return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 hover:bg-muted/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-start justify-between gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-sm font-medium", children: elev?.code }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { variant: statusVariant[i.status], children: statusLabel[i.status] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm", children: i.description }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-xs text-muted-foreground", children: formatDateTime(i.reportedAt) })
            ] }) }) }, i.id);
          }),
          paged.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-12 text-center text-sm text-muted-foreground", children: "Chưa có báo lỗi nào" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DataPagination, { page, pageSize: PAGE_SIZE, total: myIssues.length, onPageChange: setPage })
      ] })
    ] })
  ] });
}
export {
  PortalIssues as component
};
