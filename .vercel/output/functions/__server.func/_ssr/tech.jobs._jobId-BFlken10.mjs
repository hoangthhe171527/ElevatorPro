import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { A as AppShell } from "./AppShell-C3TloUgd.mjs";
import { P as PageHeader } from "./PageHeader-CSUigxIo.mjs";
import { C as Card } from "./card-BbF6o9Kw.mjs";
import { B as Button } from "./button-Cz8PAkJh.mjs";
import { T as Textarea } from "./textarea-CIfPmIKy.mjs";
import { R as RouteMap } from "./RouteMap-CWbS39Qf.mjs";
import { S as StatusBadge, j as jobStatusLabel, b as jobStatusVariant, p as priorityLabel, a as priorityVariant } from "./StatusBadge-CC8Akq8f.mjs";
import { p as Route$1, g as getCustomer, j as getElevator, m as mockJobs, o as optimizeRoute, f as formatDateTime } from "./router-CAssNYuO.mjs";
import { u as useAppStore } from "./store-D0uciryH.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { k as ArrowLeft, d as Calendar, v as Map, N as Navigation, w as Camera, m as Plus, F as FileText, c as CircleCheck, i as Phone, M as MapPin } from "../_libs/lucide-react.mjs";
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
import "../_libs/zustand.mjs";
function TechJobDetail() {
  const {
    job
  } = Route$1.useLoaderData();
  const userId = useAppStore((s) => s.userId);
  const cus = getCustomer(job.customerId);
  const elev = job.elevatorId ? getElevator(job.elevatorId) : void 0;
  const [beforeCount, setBeforeCount] = reactExports.useState(job.beforePhotos.length);
  const [afterCount, setAfterCount] = reactExports.useState(job.afterPhotos.length);
  const [report, setReport] = reactExports.useState(job.report || "");
  const [status, setStatus] = reactExports.useState(job.status);
  const route = reactExports.useMemo(() => {
    const dayKey = job.scheduledFor.split("T")[0];
    const sameDayJobs = mockJobs.filter((j) => j.assignedTo === (job.assignedTo || userId) && (j.status === "scheduled" || j.status === "in_progress") && j.scheduledFor.startsWith(dayKey));
    const list = sameDayJobs.length > 0 ? sameDayJobs : [job];
    return optimizeRoute(job.assignedTo || userId, list);
  }, [job, userId]);
  const stopIndex = route.stops.findIndex((s) => s.jobId === job.id);
  const myStop = stopIndex >= 0 ? route.stops[stopIndex] : null;
  const destination = cus ? `${cus.lat},${cus.lng}` : void 0;
  const openMapToJob = () => {
    if (!destination) {
      toast.error("Không có tọa độ điểm đến.");
      return;
    }
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
      toast.success("Đang mở chỉ đường từ vị trí hiện tại.");
    }, () => {
      launch();
      toast.warning("Không lấy được vị trí hiện tại, mở bản đồ theo điểm đích.");
    }, {
      enableHighAccuracy: true,
      timeout: 8e3
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/tech/jobs", className: "inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
      " Quay lại"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: job.title, description: job.code }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { variant: jobStatusVariant[status], children: jobStatusLabel[status] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { variant: priorityVariant[job.priority], children: priorityLabel[job.priority] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: job.description }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 text-sm flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-4 w-4 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: formatDateTime(job.scheduledFor) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-4 py-3 border-b", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Map, { className: "h-4 w-4 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-sm", children: "Vị trí trên lộ trình" }),
            myStop && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-auto text-xs text-muted-foreground", children: [
              "Điểm dừng ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-foreground", children: [
                "#",
                stopIndex + 1
              ] }),
              " ",
              "· ",
              myStop.legKm.toFixed(1),
              " km · ~",
              myStop.etaMinutes,
              " phút"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(RouteMap, { height: 280, highlightJobId: job.id, routes: [{
            id: route.base.name,
            color: "var(--route-1)",
            label: "Tuyến trong ngày",
            route
          }] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 p-3 border-t bg-muted/30", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/tech/jobs", className: "text-xs text-primary hover:underline", children: "Xem luồng công việc & lộ trình →" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", className: "gap-1.5", onClick: openMapToJob, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Navigation, { className: "h-3.5 w-3.5" }),
              " Chỉ đường tới đây"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold", children: "Ảnh hiện trường" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs font-medium mb-2", children: [
                "Trước (",
                beforeCount,
                ")"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
                Array.from({
                  length: beforeCount
                }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-square rounded-lg bg-muted flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "h-5 w-5 text-muted-foreground" }) }, i)),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
                  setBeforeCount((c) => c + 1);
                  toast.success("Đã thêm ảnh trước");
                }, className: "aspect-square rounded-lg border-2 border-dashed flex items-center justify-center hover:bg-muted transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-5 w-5 text-muted-foreground" }) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs font-medium mb-2", children: [
                "Sau (",
                afterCount,
                ")"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
                Array.from({
                  length: afterCount
                }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-square rounded-lg bg-muted flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "h-5 w-5 text-muted-foreground" }) }, i)),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
                  setAfterCount((c) => c + 1);
                  toast.success("Đã thêm ảnh sau");
                }, className: "aspect-square rounded-lg border-2 border-dashed flex items-center justify-center hover:bg-muted transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-5 w-5 text-muted-foreground" }) })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold", children: "Biên bản nghiệm thu" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { placeholder: "Nhập kết quả kiểm tra, các hạng mục đã thực hiện, đề xuất...", value: report, onChange: (e) => setReport(e.target.value), rows: 5 }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex flex-wrap gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => {
              setStatus("in_progress");
              toast.success("Đã bắt đầu công việc");
            }, children: "Bắt đầu" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => {
              setStatus("completed");
              toast.success("Đã hoàn thành & gửi biên bản cho khách hàng");
            }, className: "gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4" }),
              " Hoàn thành"
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold mb-3", children: "Khách hàng" }),
          cus && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: cus.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: cus.contactPerson }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: `tel:${cus.phone}`, className: "flex items-center gap-1.5 text-xs text-primary", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-3 w-3" }),
              " ",
              cus.phone
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-1.5 text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3 w-3 mt-0.5" }),
              " ",
              cus.address
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", className: "w-full mt-2", onClick: openMapToJob, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3.5 w-3.5 mr-1.5" }),
              " Chỉ đường"
            ] })
          ] })
        ] }),
        elev && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold mb-3", children: "Thang máy" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono font-medium", children: elev.code }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
              elev.brand,
              " ",
              elev.model,
              " — ",
              elev.floors,
              " tầng"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: elev.building })
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  TechJobDetail as component
};
