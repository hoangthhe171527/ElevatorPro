import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { d as useLocation, L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useAppStore, a as useCurrentUser } from "./store-D0uciryH.mjs";
import { c as cn, B as Button } from "./button-Cz8PAkJh.mjs";
import { R as Root2, T as Trigger, P as Portal2, C as Content2, L as Label2, S as Separator2, I as Item2, a as SubTrigger2, b as SubContent2, c as CheckboxItem2, d as ItemIndicator2, e as RadioItem2 } from "../_libs/radix-ui__react-dropdown-menu.mjs";
import { R as Root, F as Fallback, I as Image } from "../_libs/radix-ui__react-avatar.mjs";
import { c as cva } from "../_libs/class-variance-authority.mjs";
import { C as Cog, x as LayoutDashboard, a as Building2, F as FileText, T as TriangleAlert, R as Route, d as Calendar, b as ChartColumn, n as UserCog, U as Users, B as Briefcase, v as Map, P as Package, y as LogOut, j as Search, W as Wrench, r as ChevronDown, z as Bell, Q as QrCode, q as ChevronRight, s as Check, D as Circle } from "../_libs/lucide-react.mjs";
const DropdownMenu = Root2;
const DropdownMenuTrigger = Trigger;
const DropdownMenuSubTrigger = reactExports.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  SubTrigger2,
  {
    ref,
    className: cn(
      "flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      inset && "pl-8",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "ml-auto" })
    ]
  }
));
DropdownMenuSubTrigger.displayName = SubTrigger2.displayName;
const DropdownMenuSubContent = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  SubContent2,
  {
    ref,
    className: cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)",
      className
    ),
    ...props
  }
));
DropdownMenuSubContent.displayName = SubContent2.displayName;
const DropdownMenuContent = reactExports.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Portal2, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
  Content2,
  {
    ref,
    sideOffset,
    className: cn(
      "z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)",
      className
    ),
    ...props
  }
) }));
DropdownMenuContent.displayName = Content2.displayName;
const DropdownMenuItem = reactExports.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Item2,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0",
      inset && "pl-8",
      className
    ),
    ...props
  }
));
DropdownMenuItem.displayName = Item2.displayName;
const DropdownMenuCheckboxItem = reactExports.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  CheckboxItem2,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    checked,
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ItemIndicator2, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" }) }) }),
      children
    ]
  }
));
DropdownMenuCheckboxItem.displayName = CheckboxItem2.displayName;
const DropdownMenuRadioItem = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  RadioItem2,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ItemIndicator2, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Circle, { className: "h-2 w-2 fill-current" }) }) }),
      children
    ]
  }
));
DropdownMenuRadioItem.displayName = RadioItem2.displayName;
const DropdownMenuLabel = reactExports.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Label2,
  {
    ref,
    className: cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
    ...props
  }
));
DropdownMenuLabel.displayName = Label2.displayName;
const DropdownMenuSeparator = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Separator2,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
DropdownMenuSeparator.displayName = Separator2.displayName;
const Avatar = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Root,
  {
    ref,
    className: cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className),
    ...props
  }
));
Avatar.displayName = Root.displayName;
const AvatarImage = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Image,
  {
    ref,
    className: cn("aspect-square h-full w-full", className),
    ...props
  }
));
AvatarImage.displayName = Image.displayName;
const AvatarFallback = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Fallback,
  {
    ref,
    className: cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    ),
    ...props
  }
));
AvatarFallback.displayName = Fallback.displayName;
const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({ className, variant, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn(badgeVariants({ variant }), className), ...props });
}
const Input = reactExports.forwardRef(
  ({ className, type, ...props }, ref) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type,
        className: cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Input.displayName = "Input";
const navByRole = {
  admin: [
    {
      group: "Tổng quan",
      items: [
        { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
        { to: "/admin/reports", label: "Báo cáo", icon: ChartColumn }
      ]
    },
    {
      group: "Kinh doanh",
      items: [
        { to: "/admin/leads", label: "Khách hàng tiềm năng", icon: UserCog },
        { to: "/admin/customers", label: "Khách hàng", icon: Users },
        { to: "/admin/contracts", label: "Hợp đồng", icon: FileText }
      ]
    },
    {
      group: "Vận hành",
      items: [
        { to: "/admin/jobs", label: "Công việc", icon: Briefcase },
        { to: "/admin/dispatch", label: "Bản đồ & Điều phối", icon: Map },
        { to: "/admin/elevators", label: "Thang máy", icon: Building2 },
        { to: "/admin/inventory", label: "Kho vật tư", icon: Package }
      ]
    }
  ],
  technician: [
    {
      group: "Công việc",
      items: [
        { to: "/tech", label: "Hôm nay", icon: LayoutDashboard },
        { to: "/tech/jobs", label: "Công việc & lộ trình", icon: Route },
        { to: "/tech/schedule", label: "Lịch", icon: Calendar }
      ]
    }
  ],
  customer: [
    {
      group: "Của tôi",
      items: [
        { to: "/portal", label: "Tổng quan", icon: LayoutDashboard },
        { to: "/portal/elevators", label: "Thang máy", icon: Building2 },
        { to: "/portal/contracts", label: "Hợp đồng", icon: FileText },
        { to: "/portal/issues", label: "Báo lỗi", icon: TriangleAlert }
      ]
    }
  ]
};
const roleLabels = {
  admin: "Quản trị viên",
  technician: "Kỹ thuật viên",
  customer: "Khách hàng"
};
function AppShell({ children }) {
  const role = useAppStore((s) => s.role);
  const setRole = useAppStore((s) => s.setRole);
  const user = useCurrentUser();
  const location = useLocation();
  const groups = navByRole[role];
  const initials = user.name.split(" ").slice(-2).map((n) => n[0]).join("");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-h-screen w-full bg-muted/30", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "hidden lg:flex w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-16 items-center gap-2 px-6 border-b border-sidebar-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Cog, { className: "h-5 w-5 text-sidebar-primary-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold leading-tight", children: "ElevatorPro" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-sidebar-foreground/60", children: "Quản lý dịch vụ thang máy" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex-1 overflow-y-auto px-3 py-4 space-y-6", children: groups.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/50", children: g.group }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1", children: g.items.map((item) => {
          const active = location.pathname === item.to || item.to !== "/admin" && item.to !== "/tech" && item.to !== "/portal" && location.pathname.startsWith(item.to);
          const Icon = item.icon;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Link,
            {
              to: item.to,
              className: cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              ),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" }),
                item.label
              ]
            },
            item.to
          );
        }) })
      ] }, g.group)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-sidebar-border p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: "/",
          className: "flex items-center gap-2 px-3 py-2 text-xs text-sidebar-foreground/60 hover:text-sidebar-foreground",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-3.5 w-3.5" }),
            " Về trang chủ"
          ]
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 flex-col min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 max-w-md relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              placeholder: "Tìm kiếm khách hàng, hợp đồng, công việc...",
              className: "pl-9 bg-muted/50 border-0"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", className: "gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Wrench, { className: "h-3.5 w-3.5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: roleLabels[role] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-3 w-3" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuContent, { align: "end", className: "w-56", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuLabel, { children: "Chuyển role (demo)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuSeparator, {}),
            ["admin", "technician", "customer"].map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              DropdownMenuItem,
              {
                onClick: () => {
                  setRole(r);
                  const target = r === "admin" ? "/admin" : r === "technician" ? "/tech" : "/portal";
                  window.location.href = target;
                },
                children: [
                  roleLabels[r],
                  role === r && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "ml-auto", children: "Hiện tại" })
                ]
              },
              r
            ))
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "icon", className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/qr/e-1", className: "hidden sm:flex", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", title: "Demo QR thang máy", children: /* @__PURE__ */ jsxRuntimeExports.jsx(QrCode, { className: "h-4 w-4" }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", className: "gap-2 px-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "h-7 w-7", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-primary text-primary-foreground text-xs", children: initials }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden md:block text-left", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-medium leading-tight", children: user.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground", children: roleLabels[role] })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuContent, { align: "end", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuLabel, { children: "Tài khoản" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuSeparator, {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuItem, { children: "Hồ sơ" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuItem, { children: "Cài đặt" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuSeparator, {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuItem, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", children: "Đăng xuất" }) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:hidden flex overflow-x-auto gap-1 px-3 py-2 border-b bg-background", children: groups.flatMap((g) => g.items).map((item) => {
        const active = location.pathname === item.to;
        const Icon = item.icon;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: item.to,
            className: cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap",
              active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
            ),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3.5 w-3.5" }),
              " ",
              item.label
            ]
          },
          item.to
        );
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 p-4 lg:p-6", children })
    ] })
  ] });
}
export {
  AppShell as A,
  Badge as B,
  Input as I
};
