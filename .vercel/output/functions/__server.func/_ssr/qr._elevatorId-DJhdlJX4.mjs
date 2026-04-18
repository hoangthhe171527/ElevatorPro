import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { C as Card } from "./card-BbF6o9Kw.mjs";
import { B as Button } from "./button-Cz8PAkJh.mjs";
import { T as Textarea } from "./textarea-CIfPmIKy.mjs";
import { S as StatusBadge, e as elevatorStatusLabel, c as elevatorStatusVariant } from "./StatusBadge-CC8Akq8f.mjs";
import { R as Route$d, g as getCustomer, m as mockJobs, c as formatDate } from "./router-CAssNYuO.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { k as ArrowLeft, C as Cog, a as Building2, Q as QrCode, T as TriangleAlert, l as Send, i as Phone, H as History } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
function QRPage() {
  const {
    elevator
  } = Route$d.useLoaderData();
  const cus = getCustomer(elevator.customerId);
  const history = mockJobs.filter((j) => j.elevatorId === elevator.id).slice(0, 5);
  const [issue, setIssue] = reactExports.useState("");
  const submitIssue = () => {
    if (!issue.trim()) {
      toast.error("Vui lòng mô tả sự cố");
      return;
    }
    toast.success("Đã gửi báo lỗi! Đội ngũ sẽ liên hệ sớm.");
    setIssue("");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-muted/30", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "bg-sidebar text-sidebar-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container max-w-2xl mx-auto px-4 py-4 flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "text-sidebar-foreground/70 hover:text-sidebar-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Cog, { className: "h-4 w-4 text-sidebar-primary-foreground" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-sm", children: "ElevatorPro" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-sidebar-foreground/60", children: "Quét QR thang máy" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container max-w-2xl mx-auto px-4 py-6 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6 text-center bg-gradient-to-br from-primary to-primary/80 text-primary-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-foreground/20 mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-7 w-7" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold font-mono", children: elevator.code }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm opacity-90 mt-1", children: [
          elevator.brand,
          " ",
          elevator.model,
          " · ",
          elevator.floors,
          " tầng"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { variant: elevatorStatusVariant[elevator.status], className: "bg-white/20 border-white/30 text-white", children: elevatorStatusLabel[elevator.status] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-semibold mb-3 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(QrCode, { className: "h-4 w-4" }),
          " Thông tin thang"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Khách hàng", value: cus?.name || "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Vị trí", value: `${elevator.building}, ${elevator.address}` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Lắp đặt", value: formatDate(elevator.installedAt) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Bảo hành đến", value: formatDate(elevator.warrantyUntil) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "BT gần nhất", value: formatDate(elevator.lastMaintenance) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "BT tiếp theo", value: formatDate(elevator.nextMaintenance), highlight: true })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 text-destructive" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold", children: "Báo lỗi nhanh" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { placeholder: "Mô tả sự cố bạn gặp phải...", value: issue, onChange: (e) => setIssue(e.target.value), rows: 3 }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex flex-col sm:flex-row gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: submitIssue, className: "flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4 mr-1.5" }),
            " Gửi báo lỗi"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "tel:1900xxxx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-4 w-4 mr-1.5" }),
            " Hotline 24/7"
          ] }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-semibold mb-3 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "h-4 w-4" }),
          " Lịch sử bảo trì"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          history.map((j) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 h-2 w-2 rounded-full bg-primary shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-sm", children: j.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: formatDate(j.scheduledFor) })
            ] })
          ] }, j.id)),
          history.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center py-4", children: "Chưa có lịch sử" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center text-xs text-muted-foreground py-4", children: [
        "Powered by ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: "ElevatorPro" })
      ] })
    ] })
  ] });
}
function Row({
  label,
  value,
  highlight
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-right ${highlight ? "font-semibold text-primary" : ""}`, children: value })
  ] });
}
export {
  QRPage as component
};
