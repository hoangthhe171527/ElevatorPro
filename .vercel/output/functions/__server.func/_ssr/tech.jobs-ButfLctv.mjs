import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { A as AppShell, I as Input } from "./AppShell-C3TloUgd.mjs";
import { P as PageHeader } from "./PageHeader-CSUigxIo.mjs";
import { C as Card } from "./card-BbF6o9Kw.mjs";
import { B as Button } from "./button-Cz8PAkJh.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BMxB0edH.mjs";
import { D as DataPagination } from "./DataPagination-BD_Zy1Mn.mjs";
import { R as RouteMap } from "./RouteMap-CWbS39Qf.mjs";
import { S as StatCard } from "./StatCard-D0IYzFPr.mjs";
import { j as jobStatusLabel, S as StatusBadge, p as priorityLabel, a as priorityVariant, b as jobStatusVariant } from "./StatusBadge-CC8Akq8f.mjs";
import { m as mockJobs, o as optimizeRoute, g as getCustomer, f as formatDateTime } from "./router-CAssNYuO.mjs";
import { u as useAppStore } from "./store-D0uciryH.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { M as MapPin, R as Route, g as Clock, c as CircleCheck, h as Sparkles, N as Navigation, j as Search, B as Briefcase, d as Calendar, L as Lock } from "../_libs/lucide-react.mjs";
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
import "../_libs/zustand.mjs";
const PAGE_SIZE = 6;
function TechJobs() {
  const userId = useAppStore((s) => s.userId);
  const [page, setPage] = reactExports.useState(1);
  const [search, setSearch] = reactExports.useState("");
  const [statusFilter, setStatusFilter] = reactExports.useState("all");
  const storageKey = `tech-route-completed-${userId}`;
  const [completedIds, setCompletedIds] = reactExports.useState(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const activeJobs = reactExports.useMemo(() => mockJobs.filter((j) => j.assignedTo === userId && (j.status === "scheduled" || j.status === "in_progress")), [userId]);
  const route = reactExports.useMemo(() => optimizeRoute(userId, activeJobs), [userId, activeJobs]);
  const nextStop = route.stops.find((s) => !completedIds.includes(s.jobId));
  const saveCompleted = (ids) => {
    setCompletedIds(ids);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(storageKey, JSON.stringify(ids));
    }
  };
  const markStopDone = (jobId) => {
    if (completedIds.includes(jobId)) return;
    const updated = [...completedIds, jobId];
    saveCompleted(updated);
    const next = route.stops.find((s) => !updated.includes(s.jobId));
    if (next) toast.success("Đã hoàn thành điểm hiện tại, chuyển sang điểm tiếp theo.");
    else toast.success("Tuyệt vời! Bạn đã hoàn thành toàn bộ tuyến hôm nay.");
  };
  const openMapToNextStop = () => {
    if (!nextStop) {
      toast.success("Không còn điểm nào cần chỉ đường.");
      return;
    }
    const destination = `${nextStop.lat},${nextStop.lng}`;
    const launch = (origin) => {
      const url = origin ? `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&travelmode=driving` : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}&travelmode=driving`;
      window.open(url, "_blank", "noopener,noreferrer");
    };
    if (!navigator.geolocation) {
      launch();
      toast.warning("Thiết bị không hỗ trợ định vị, mở bản đồ theo điểm đích.");
      return;
    }
    navigator.geolocation.getCurrentPosition((pos) => {
      launch(`${pos.coords.latitude},${pos.coords.longitude}`);
      toast.success(`Đang chỉ đường tới điểm ưu tiên #${route.stops.findIndex((s) => s.jobId === nextStop.jobId) + 1}`);
    }, () => {
      launch();
      toast.warning("Không lấy được vị trí hiện tại, mở bản đồ theo điểm đích.");
    }, {
      enableHighAccuracy: true,
      timeout: 8e3
    });
  };
  const filtered = mockJobs.filter((j) => j.assignedTo === userId).filter((j) => {
    const m1 = !search || j.title.toLowerCase().includes(search.toLowerCase());
    const m2 = statusFilter === "all" || j.status === statusFilter;
    return m1 && m2;
  }).sort((a, b) => b.scheduledFor.localeCompare(a.scheduledFor));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Công việc & lộ trình của tôi", description: "Một luồng xử lý: ưu tiên cảnh báo -> chỉ đường -> hoàn thành -> sang điểm tiếp theo" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 sm:grid-cols-4 mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Số điểm cần đi", value: route.stops.length, icon: MapPin, accent: "info" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Tổng quãng đường", value: `${route.totalKm.toFixed(1)} km`, icon: Route, accent: "primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Thời gian dự kiến", value: `${route.totalMinutes} phút`, icon: Clock, accent: "warning" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Đã xử lý trong tuyến", value: `${completedIds.filter((id) => route.stops.some((s) => s.jobId === id)).length}/${route.stops.length}`, icon: CircleCheck, accent: "success" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "overflow-hidden mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(RouteMap, { height: 360, highlightJobId: nextStop?.jobId, routes: [{
        id: userId,
        color: "var(--route-1)",
        label: "Tuyến của bạn",
        route
      }] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 p-3 border-t bg-muted/30", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3 w-3 inline mr-1 text-success" }),
          "Điểm được tô sáng là điểm cần làm đầu tiên theo ưu tiên + quãng đường"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", className: "gap-1.5", onClick: openMapToNextStop, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Navigation, { className: "h-3.5 w-3.5" }),
          " Chỉ đường tới điểm đầu tiên"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3 p-4 border-b", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Tìm công việc...", className: "pl-9", value: search, onChange: (e) => {
            setSearch(e.target.value);
            setPage(1);
          } })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: statusFilter, onValueChange: (v) => {
          setStatusFilter(v);
          setPage(1);
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-full sm:w-44", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "Tất cả" }),
            Object.entries(jobStatusLabel).map(([k, v]) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: k, children: v }, k))
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y", children: paged.map((j) => {
        const cus = getCustomer(j.customerId);
        const stopIdx = route.stops.findIndex((s) => s.jobId === j.id);
        const isInRoute = stopIdx >= 0;
        const isDoneInRoute = completedIds.includes(j.id);
        const isNext = nextStop?.jobId === j.id;
        const canMarkDone = isInRoute && (isNext || isDoneInRoute);
        return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 hover:bg-muted/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Briefcase, { className: "h-5 w-5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap mb-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/tech/jobs/$jobId", params: {
                jobId: j.id
              }, className: "font-semibold truncate hover:underline", children: j.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { variant: priorityVariant[j.priority], children: priorityLabel[j.priority] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { variant: jobStatusVariant[j.status], children: jobStatusLabel[j.status] }),
              isInRoute && /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { variant: isDoneInRoute ? "success" : isNext ? "info" : "warning", children: isDoneInRoute ? "Đã xong trên tuyến" : isNext ? `Điểm ưu tiên #${stopIdx + 1}` : `Chờ điểm #${stopIdx + 1}` })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 text-xs text-muted-foreground space-y-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-3 w-3" }),
                " ",
                formatDateTime(j.scheduledFor)
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3 w-3" }),
                " ",
                cus?.name
              ] })
            ] }),
            isInRoute && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", className: "h-8 text-xs gap-1.5", onClick: openMapToNextStop, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Navigation, { className: "h-3.5 w-3.5" }),
                " Chỉ đường"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", className: "h-8 text-xs gap-1.5", variant: isDoneInRoute ? "secondary" : "default", disabled: !canMarkDone, onClick: () => markStopDone(j.id), children: [
                !canMarkDone && !isDoneInRoute && /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-3.5 w-3.5" }),
                isDoneInRoute ? "Đã done" : "Done điểm này"
              ] })
            ] })
          ] })
        ] }) }, j.id);
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DataPagination, { page, pageSize: PAGE_SIZE, total: filtered.length, onPageChange: setPage })
    ] })
  ] });
}
export {
  TechJobs as component
};
