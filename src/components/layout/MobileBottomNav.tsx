import { Link, useLocation } from "@tanstack/react-router";
import { useCurrentPermissions, useAppStore } from "@/lib/store";
import {
  LayoutDashboard,
  Briefcase,
  CheckCircle2,
  User,
  Activity,
  Navigation,
  List,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ADMIN_PERMISSIONS, TECH_PERMISSIONS } from "@/lib/roles";

export function MobileBottomNav() {
  const permissions = useCurrentPermissions();
  const location = useLocation();
  const setQuickIncidentOpen = useAppStore((s) => s.setQuickIncidentOpen);
  const isAppPreviewStored = useAppStore((s) => s.isAppPreview);
  const isAppPreview = location.pathname.startsWith("/app");

  const isCEO = permissions.includes("tech_manager");
  const isSalesAdmin = permissions.includes("sales_admin") || permissions.includes("sales");
  const isPM = permissions.includes("tech_manager");
  const isDispatch =
    permissions.includes("service_dispatcher") || permissions.includes("service_dispatcher");
  const isAccountant = permissions.includes("accountant");
  const isTechManager = permissions.includes("tech_manager");
  const isAdmin = permissions.some((p) => ADMIN_PERMISSIONS.includes(p));
  const isTech = permissions.some((p) => TECH_PERMISSIONS.includes(p));

  // Show bottom nav for all roles except those with no dashboard
  if (!isAdmin && !isTech) return null;

  const isRouteActive = (to: string) => {
    const currentPath = location.pathname.startsWith("/app")
      ? location.pathname.replace("/app", "")
      : location.pathname;

    if (to === "/admin" || to === "/tech") return currentPath === to;
    return currentPath.startsWith(to);
  };

  const NavItem = ({ to, label, icon: Icon }: { to: string; label: string; icon: any }) => {
    const active = isRouteActive(to);
    // Inject /app if we are in app mode
    const targetTo = location.pathname.startsWith("/app") ? `/app${to}` : to;

    return (
      <Link
        to={targetTo as any}
        className={cn(
          "flex flex-col items-center justify-center flex-1 gap-1 py-1.5 transition-all",
          active ? "text-primary" : "text-muted-foreground hover:text-foreground",
        )}
      >
        <Icon className={cn("h-5 w-5", active && "animate-in zoom-in-75 duration-300")} />
        <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
      </Link>
    );
  };

  return (
    <div
      className={cn(
        "z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-t border-slate-200/50 pb-safe transition-all",
        isAppPreview
          ? "absolute bottom-0 w-full shadow-[0_-15px_40px_rgba(0,0,0,0.06)] rounded-b-[42px] overflow-hidden"
          : "lg:hidden fixed bottom-0 left-0 right-0",
      )}
    >
      <div className="flex items-center justify-around h-16 max-w-md mx-auto px-2">
        {(isAdmin || isTechManager) && (
          <>
            <NavItem to="/admin" label="Home" icon={LayoutDashboard} />
            {(isCEO || isPM || isSalesAdmin || isDispatch || isTechManager) && (
              <NavItem to="/admin/leads" label="Leads" icon={List} />
            )}
            <div className="relative -top-4">
              <button
                onClick={() => setQuickIncidentOpen(true)}
                className="h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/40 flex items-center justify-center active:scale-95 transition-transform"
              >
                <Plus className="h-6 w-6" />
              </button>
            </div>
            {isCEO || isPM || isAccountant || isTechManager ? (
              <NavItem to="/admin/approvals" label="Duyệt" icon={CheckCircle2} />
            ) : (
              <NavItem to="/admin/customers" label="Khách" icon={User} />
            )}
            <NavItem to="/admin/profile" label="Tôi" icon={User} />
          </>
        )}

        {isTech && !isAdmin && (
          <>
            <NavItem to="/tech" label="Hôm nay" icon={Activity} />
            <NavItem to="/tech/jobs" label="Danh sách" icon={List} />
            <NavItem to="/tech/route-plan" label="Lộ trình" icon={Navigation} />
            <NavItem to="/admin/profile" label="Tôi" icon={User} />
          </>
        )}
      </div>
    </div>
  );
}
