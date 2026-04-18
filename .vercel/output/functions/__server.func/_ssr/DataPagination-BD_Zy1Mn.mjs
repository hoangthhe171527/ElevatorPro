import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { B as Button } from "./button-Cz8PAkJh.mjs";
import { u as ChevronLeft, q as ChevronRight } from "../_libs/lucide-react.mjs";
function DataPagination({ page, pageSize, total, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-3 border-t", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
      "Hiển thị ",
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium text-foreground", children: [
        start,
        "–",
        end
      ] }),
      " trên ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: total }),
      " kết quả"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", disabled: page === 1, onClick: () => onPageChange(page - 1), children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-3.5 w-3.5" }) }),
      pages.map(
        (p, i) => p === "..." ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 text-xs text-muted-foreground", children: "…" }, `d${i}`) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: p === page ? "default" : "outline",
            size: "sm",
            className: "h-8 w-8 p-0 text-xs",
            onClick: () => onPageChange(p),
            children: p
          },
          p
        )
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", disabled: page === totalPages, onClick: () => onPageChange(page + 1), children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-3.5 w-3.5" }) })
    ] })
  ] });
}
export {
  DataPagination as D
};
