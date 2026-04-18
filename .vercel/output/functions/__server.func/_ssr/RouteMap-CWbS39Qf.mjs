import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { q as projectLatLng } from "./router-CAssNYuO.mjs";
import { c as cn } from "./button-Cz8PAkJh.mjs";
function RouteMap({ routes, highlightJobId, className, height = 360 }) {
  const W = 800;
  const H = height;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn("relative rounded-xl border overflow-hidden", className),
      style: { background: "var(--map-bg)" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: `0 0 ${W} ${H}`, className: "w-full h-full block", preserveAspectRatio: "xMidYMid meet", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("defs", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("pattern", { id: "grid", width: "40", height: "40", patternUnits: "userSpaceOnUse", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M 40 0 L 0 0 0 40", fill: "none", stroke: "var(--border)", strokeWidth: "0.5", opacity: "0.6" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("pattern", { id: "grid-major", width: "160", height: "160", patternUnits: "userSpaceOnUse", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M 160 0 L 0 0 0 160", fill: "none", stroke: "var(--border)", strokeWidth: "1", opacity: "0.8" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { width: W, height: H, fill: "url(#grid)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { width: W, height: H, fill: "url(#grid-major)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "path",
            {
              d: `M ${W * 0.55} 0 Q ${W * 0.62} ${H * 0.3}, ${W * 0.7} ${H * 0.55} T ${W * 0.85} ${H}`,
              stroke: "var(--primary)",
              strokeOpacity: "0.18",
              strokeWidth: "22",
              fill: "none",
              strokeLinecap: "round"
            }
          ),
          routes.map((r) => {
            const baseP = projectLatLng(r.route.base.lat, r.route.base.lng, W, H);
            const stopPts = r.route.stops.map((s) => projectLatLng(s.lat, s.lng, W, H));
            const pathPts = [baseP, ...stopPts];
            const d = pathPts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d,
                  stroke: r.color,
                  strokeWidth: 3,
                  fill: "none",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeDasharray: "6 4",
                  opacity: 0.8
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { transform: `translate(${baseP.x}, ${baseP.y})`, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: -9, y: -9, width: 18, height: 18, rx: 3, fill: r.color }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("text", { x: 0, y: 3, textAnchor: "middle", fontSize: "10", fontWeight: "700", fill: "white", children: "B" })
              ] }),
              stopPts.map((p, i) => {
                const stop = r.route.stops[i];
                const isHi = stop.jobId === highlightJobId;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { transform: `translate(${p.x}, ${p.y})`, children: [
                  isHi && /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { r: 18, fill: r.color, opacity: 0.25, children: /* @__PURE__ */ jsxRuntimeExports.jsx("animate", { attributeName: "r", values: "14;22;14", dur: "1.6s", repeatCount: "indefinite" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { r: isHi ? 13 : 11, fill: r.color, stroke: "white", strokeWidth: 2 }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("text", { x: 0, y: 4, textAnchor: "middle", fontSize: "11", fontWeight: "700", fill: "white", children: i + 1 })
                ] }, stop.jobId);
              })
            ] }, r.id);
          })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-2 left-2 right-2 flex flex-wrap gap-2 rounded-md bg-background/90 backdrop-blur px-2.5 py-1.5 text-[11px] shadow-sm", children: routes.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block h-2.5 w-2.5 rounded-sm", style: { background: r.color } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: r.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
            r.route.stops.length,
            " điểm · ",
            r.route.totalKm.toFixed(1),
            " km · ",
            r.route.totalMinutes,
            " phút"
          ] })
        ] }, r.id)) })
      ]
    }
  );
}
export {
  RouteMap as R
};
