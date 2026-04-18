import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { C as Card } from "./card-BbF6o9Kw.mjs";
import { c as cn } from "./button-Cz8PAkJh.mjs";
const accentMap = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/15 text-warning-foreground",
  destructive: "bg-destructive/10 text-destructive",
  info: "bg-info/10 text-info"
};
function StatCard({ label, value, icon: Icon, hint, trend, accent = "primary" }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wide", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-2xl font-bold tracking-tight truncate", children: value }),
      hint && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-xs text-muted-foreground", children: hint }),
      trend && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("mt-2 text-xs font-medium", trend.positive ? "text-success" : "text-destructive"), children: [
        trend.positive ? "▲" : "▼",
        " ",
        trend.value
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("flex h-10 w-10 items-center justify-center rounded-lg shrink-0", accentMap[accent]), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5" }) })
  ] }) });
}
export {
  StatCard as S
};
