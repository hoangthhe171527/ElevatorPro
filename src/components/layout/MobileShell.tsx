import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useMainRole, useCurrentUser, useCurrentPermissions, setMainRole, useAppStore } from "@/lib/store";
import { canAccessMobilePath } from "@/lib/mobile-policy";
import { mockUsers } from "@/lib/mock-data";
import { 
  Home, 
   Briefcase,
  Settings, 
  Bell,
  Menu,
  ChevronLeft,
  UserCircle,
  Building2,
  LogOut,
  Shield,
  ArrowRightLeft,
  X,
   ShieldCheck,
   ClipboardCheck,
   CreditCard,
   Users,
   FileText,
   Building,
   Package,
   LineChart,
   Wrench,
   QrCode,
   CalendarDays,
   LayoutDashboard,
   Handshake,
   FolderKanban,
   Search
} from "lucide-react";

interface MobileShellProps {
  children: React.ReactNode;
  title?: string;
  hideHeader?: boolean;
   showBackButton?: boolean;
   backLink?: string;
}

type MobileRole = "admin" | "tech" | "customer";

type MobileNavItem = {
   label: string;
   path: string;
   icon: React.ComponentType<{ className?: string }>;
};

type LargeAdminProfile =
   | "director"
   | "sales_manager"
   | "install_manager"
   | "maintenance_manager"
   | "accounting_manager"
   | "hr_manager"
   | "general_admin";

type SmallAdminProfile = "director" | "sales_ops" | "accounting_ops" | "operations_admin";

export function MobileShell({
   children,
   title,
   hideHeader = false,
   showBackButton = false,
   backLink,
}: MobileShellProps) {
   const navigate = useNavigate();
  const role = useMainRole();
   const permissions = useCurrentPermissions();
  const user = useCurrentUser();
  const activeTenantId = useAppStore((s) => s.activeTenantId);
  const companySize = useAppStore((s) => s.companySize);
   const setUserId = useAppStore((s) => s.setUserId);
   const setCompanySize = useAppStore((s) => s.setCompanySize);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
   const [navQuery, setNavQuery] = useState("");

   const getRoleBucket = (perms: string[]): "admin" | "tech" | "customer" => {
      if (perms.includes("customer")) return "customer";
      if (perms.some((p) => ["field_tech", "tech_survey"].includes(p)) && !perms.some((p) => ["director", "sales", "sales_maintenance", "accounting", "hr_admin", "install_mgmt"].includes(p))) {
         return "tech";
      }
      if (perms.some((p) => ["director", "sales", "sales_maintenance", "accounting", "hr_admin", "install_mgmt", "maintenance_mgmt"].includes(p))) return "admin";
      return "admin";
   };

   const getRoleTitle = (perms: string[]): string => {
      if (perms.includes("director")) return "Giám đốc";
      if (perms.includes("sales") || perms.includes("sales_maintenance")) return "Trưởng phòng Sales";
      if (perms.includes("install_mgmt") && !perms.includes("field_tech")) return "Quản lý lắp đặt";
      if (perms.includes("maintenance_mgmt") && !perms.includes("field_tech")) return "Quản lý bảo trì";
      if (perms.includes("accounting") && perms.includes("hr_admin")) return "Kế toán + Hành chính";
      if (perms.includes("accounting")) return "Kế toán";
      if (perms.includes("hr_admin")) return "Hành chính nhân sự";
      if (perms.includes("tech_survey")) return "Kỹ thuật khảo sát";
      if (perms.includes("field_tech")) return "Kỹ thuật hiện trường";
      if (perms.includes("customer")) return "Khách hàng Portal";
      return "Vai trò vận hành";
   };

   const tenantProfiles = mockUsers
      .map((u) => {
         const membership = u.memberships.find((m) => m.tenantId === activeTenantId);
         if (!membership) return null;
         const roleBucket = getRoleBucket(membership.permissions);
         const roleTitle = getRoleTitle(membership.permissions);
         const isFlexible = membership.permissions.length >= 3;
         return {
            userId: u.id,
            name: u.name,
            roleBucket,
            roleTitle,
            subtitle: isFlexible ? "Vai trò linh hoạt" : "Vai trò chuyên biệt",
         };
      })
      .filter((v): v is NonNullable<typeof v> => Boolean(v));

   const chooseProfile = (userId: string, roleBucket: "admin" | "tech" | "customer") => {
      setUserId(userId);
      setMainRole(roleBucket);
      const targetHome = roleBucket === "tech" ? "/mobile/tech" : roleBucket === "customer" ? "/mobile/portal" : "/mobile";
      navigate({ to: targetHome });
      setIsMenuOpen(false);
   };

   const switchableProfiles = useMemo(() => {
      const seen = new Set<string>();
      const profiles = tenantProfiles.filter((profile) => {
         const key = `${profile.userId}:${profile.roleBucket}`;
         if (seen.has(key)) return false;
         seen.add(key);
         return true;
      });

      const currentKey = `${user.id}:${role}`;
      const hasCurrent = profiles.some((profile) => `${profile.userId}:${profile.roleBucket}` === currentKey);
      if (!hasCurrent) {
         profiles.unshift({
            userId: user.id,
            name: user.name,
            roleBucket: role,
            roleTitle: getRoleTitle(permissions),
            subtitle: "Vai trò hiện tại",
         });
      }

      return profiles;
   }, [tenantProfiles, user.id, user.name, role, permissions]);

   const roleLabel = role === "admin" ? getRoleTitle(permissions) : role === "tech" ? "Kỹ thuật hiện trường" : "Portal khách hàng";
   const homePath = role === "tech" ? "/mobile/tech" : role === "customer" ? "/mobile/portal" : "/mobile";

   const getLargeAdminProfile = (): LargeAdminProfile => {
      if (permissions.includes("director")) return "director";
      if (permissions.includes("accounting")) return "accounting_manager";
      if (permissions.includes("hr_admin")) return "hr_manager";
      if (permissions.includes("maintenance_mgmt") && !permissions.includes("field_tech")) return "maintenance_manager";
      if (permissions.includes("install_mgmt") && !permissions.includes("field_tech")) return "install_manager";
      if (permissions.includes("sales") || permissions.includes("sales_maintenance")) return "sales_manager";
      return "general_admin";
   };

   const largeAdminProfile = getLargeAdminProfile();

   const getSmallAdminProfile = (): SmallAdminProfile => {
      if (permissions.includes("director")) return "director";
      if (permissions.includes("sales") || permissions.includes("sales_maintenance")) return "sales_ops";
      if (permissions.includes("accounting") || permissions.includes("hr_admin")) return "accounting_ops";
      return "operations_admin";
   };

   const smallAdminProfile = getSmallAdminProfile();

   const largeCompanyAdminNavByProfile: Record<LargeAdminProfile, MobileNavItem[]> = {
      director: [
         { label: "Dashboard", path: "/mobile/", icon: LayoutDashboard },
         { label: "Phê duyệt", path: "/mobile/approvals", icon: ClipboardCheck },
         { label: "Báo cáo", path: "/mobile/reports", icon: LineChart },
         { label: "Khách hàng tiềm năng", path: "/mobile/leads", icon: Handshake },
         { label: "Khách hàng", path: "/mobile/customers", icon: Users },
         { label: "Hợp đồng", path: "/mobile/contracts", icon: FileText },
         { label: "Dự án lắp đặt", path: "/mobile/projects", icon: FolderKanban },
         { label: "Công việc", path: "/mobile/jobs", icon: Briefcase },
         { label: "Thang máy", path: "/mobile/elevators", icon: Settings },
         { label: "Kho vật tư", path: "/mobile/inventory", icon: Package },
         { label: "Kế toán & công nợ", path: "/mobile/accounting", icon: CreditCard },
         { label: "Nhân sự & hiệu suất", path: "/mobile/hr", icon: Users },
      ],
      sales_manager: [
         { label: "Dashboard", path: "/mobile/", icon: LayoutDashboard },
         { label: "Báo cáo", path: "/mobile/reports", icon: LineChart },
         { label: "Khách hàng tiềm năng", path: "/mobile/leads", icon: Handshake },
         { label: "Khách hàng", path: "/mobile/customers", icon: Users },
         { label: "Hợp đồng", path: "/mobile/contracts", icon: FileText },
         { label: "Dự án lắp đặt", path: "/mobile/projects", icon: FolderKanban },
         { label: "Thang máy", path: "/mobile/elevators", icon: Settings },
      ],
      install_manager: [
         { label: "Dashboard", path: "/mobile/", icon: LayoutDashboard },
         { label: "Phê duyệt", path: "/mobile/approvals", icon: ClipboardCheck },
         { label: "Dự án lắp đặt", path: "/mobile/projects", icon: FolderKanban },
         { label: "Công việc", path: "/mobile/jobs", icon: Briefcase },
         { label: "Thang máy", path: "/mobile/elevators", icon: Settings },
         { label: "Kho vật tư", path: "/mobile/inventory", icon: Package },
      ],
      maintenance_manager: [
         { label: "Dashboard", path: "/mobile/", icon: LayoutDashboard },
         { label: "Phê duyệt", path: "/mobile/approvals", icon: ClipboardCheck },
         { label: "Công việc", path: "/mobile/jobs", icon: Briefcase },
         { label: "Thang máy", path: "/mobile/elevators", icon: Settings },
         { label: "Kho vật tư", path: "/mobile/inventory", icon: Package },
      ],
      accounting_manager: [
         { label: "Dashboard", path: "/mobile/", icon: LayoutDashboard },
         { label: "Kế toán & công nợ", path: "/mobile/accounting", icon: CreditCard },
         { label: "Hợp đồng", path: "/mobile/contracts", icon: FileText },
         { label: "Phê duyệt", path: "/mobile/approvals", icon: ClipboardCheck },
         { label: "Báo cáo", path: "/mobile/reports", icon: LineChart },
      ],
      hr_manager: [
         { label: "Dashboard", path: "/mobile/", icon: LayoutDashboard },
         { label: "Nhân sự & hiệu suất", path: "/mobile/hr", icon: Users },
         { label: "Phê duyệt", path: "/mobile/approvals", icon: ClipboardCheck },
         { label: "Báo cáo", path: "/mobile/reports", icon: LineChart },
      ],
      general_admin: [
         { label: "Dashboard", path: "/mobile/", icon: Home },
         { label: "Approvals", path: "/mobile/approvals", icon: ClipboardCheck },
         { label: "Reports", path: "/mobile/reports", icon: LineChart },
         { label: "Customers", path: "/mobile/customers", icon: Users },
         { label: "Contracts", path: "/mobile/contracts", icon: FileText },
         { label: "Projects", path: "/mobile/projects", icon: Building },
         { label: "Jobs", path: "/mobile/jobs", icon: Briefcase },
         { label: "Elevators", path: "/mobile/elevators", icon: Settings },
         { label: "Inventory", path: "/mobile/inventory", icon: Package },
         { label: "Accounting", path: "/mobile/accounting", icon: CreditCard },
         { label: "HR", path: "/mobile/hr", icon: Users },
      ],
   };

   const smallCompanyAdminNavByProfile: Record<SmallAdminProfile, MobileNavItem[]> = {
      director: [
         { label: "Dashboard", path: "/mobile/", icon: LayoutDashboard },
         { label: "Phê duyệt", path: "/mobile/approvals", icon: ClipboardCheck },
         { label: "Khách hàng tiềm năng", path: "/mobile/leads", icon: Handshake },
         { label: "Khách hàng", path: "/mobile/customers", icon: Users },
         { label: "Hợp đồng", path: "/mobile/contracts", icon: FileText },
         { label: "Dự án lắp đặt", path: "/mobile/projects", icon: FolderKanban },
         { label: "Công việc", path: "/mobile/jobs", icon: Briefcase },
         { label: "Thang máy", path: "/mobile/elevators", icon: Settings },
         { label: "Kế toán & công nợ", path: "/mobile/accounting", icon: CreditCard },
         { label: "Nhân sự & hiệu suất", path: "/mobile/hr", icon: Users },
         { label: "Báo cáo", path: "/mobile/reports", icon: LineChart },
      ],
      sales_ops: [
         { label: "Dashboard", path: "/mobile/", icon: LayoutDashboard },
         { label: "Khách hàng tiềm năng", path: "/mobile/leads", icon: Handshake },
         { label: "Khách hàng", path: "/mobile/customers", icon: Users },
         { label: "Hợp đồng", path: "/mobile/contracts", icon: FileText },
         { label: "Báo cáo", path: "/mobile/reports", icon: LineChart },
      ],
      accounting_ops: [
         { label: "Dashboard", path: "/mobile/", icon: LayoutDashboard },
         { label: "Kế toán & công nợ", path: "/mobile/accounting", icon: CreditCard },
         { label: "Hợp đồng", path: "/mobile/contracts", icon: FileText },
         { label: "Nhân sự & hiệu suất", path: "/mobile/hr", icon: Users },
         { label: "Phê duyệt", path: "/mobile/approvals", icon: ClipboardCheck },
         { label: "Báo cáo", path: "/mobile/reports", icon: LineChart },
      ],
      operations_admin: [
         { label: "Dashboard", path: "/mobile/", icon: LayoutDashboard },
         { label: "Phê duyệt", path: "/mobile/approvals", icon: ClipboardCheck },
         { label: "Dự án lắp đặt", path: "/mobile/projects", icon: FolderKanban },
         { label: "Công việc", path: "/mobile/jobs", icon: Briefcase },
         { label: "Thang máy", path: "/mobile/elevators", icon: Settings },
         { label: "Kho vật tư", path: "/mobile/inventory", icon: Package },
      ],
   };

   const webNavItemsByRole: Record<MobileRole, MobileNavItem[]> = {
      admin: [
         { label: "Dashboard", path: "/mobile/", icon: Home },
         { label: "Approvals", path: "/mobile/approvals", icon: ClipboardCheck },
         { label: "Reports", path: "/mobile/reports", icon: LineChart },
         { label: "Customers", path: "/mobile/customers", icon: Users },
         { label: "Contracts", path: "/mobile/contracts", icon: FileText },
         { label: "Projects", path: "/mobile/projects", icon: Building },
         { label: "Jobs", path: "/mobile/jobs", icon: Briefcase },
         { label: "Elevators", path: "/mobile/elevators", icon: Settings },
         { label: "Inventory", path: "/mobile/inventory", icon: Package },
         { label: "Accounting", path: "/mobile/accounting", icon: CreditCard },
         { label: "HR", path: "/mobile/hr", icon: Users },
      ],
      tech: [
         { label: "Today", path: "/mobile/tech", icon: Home },
         { label: "Jobs & Route", path: "/mobile/tech/jobs", icon: Briefcase },
         { label: "Scanner", path: "/mobile/scanner", icon: QrCode },
         { label: "Elevators", path: "/mobile/elevators", icon: Settings },
         { label: "Schedule", path: "/mobile/tech/schedule", icon: CalendarDays },
      ],
      customer: [
         { label: "Overview", path: "/mobile/portal", icon: Home },
         { label: "Elevators", path: "/mobile/portal/elevators", icon: Settings },
         { label: "Contracts", path: "/mobile/portal/contracts", icon: FileText },
         { label: "Issues", path: "/mobile/portal/issues", icon: Wrench },
         { label: "Billing", path: "/mobile/portal/billing", icon: CreditCard },
         { label: "QR Scanner", path: "/mobile/scanner", icon: QrCode },
      ],
   };
   const webNavItems =
      role === "admin" && companySize === "small"
         ? smallCompanyAdminNavByProfile[smallAdminProfile]
         : role === "admin" && companySize === "large"
            ? largeCompanyAdminNavByProfile[largeAdminProfile]
            : webNavItemsByRole[role as MobileRole] ?? [];

   const accessibleWebNavItems = useMemo(
      () => webNavItems.filter((item) => canAccessMobilePath(item.path, role, permissions)),
      [webNavItems, role, permissions],
   );

   const rawPrimaryNavItems = (() => {
      if (role === "customer") {
         return [
            { label: "Trang chủ", path: "/mobile/portal", icon: Home },
            { label: "Thang máy", path: "/mobile/portal/elevators", icon: Settings },
            { label: "Quét QR", path: "/mobile/scanner", icon: QrCode },
         ];
      }

      if (role === "tech") {
         return [
               { label: "Hôm nay", path: "/mobile/tech", icon: Home },
               { label: "Công việc", path: "/mobile/tech/jobs", icon: Briefcase },
            { label: "Quét QR", path: "/mobile/scanner", icon: QrCode },
            { label: "Thang máy", path: "/mobile/elevators", icon: Settings },
         ];
      }

      if (companySize === "small" && role === "admin") {
         if (smallAdminProfile === "director") {
            return [
               { label: "Trang chủ", path: "/mobile/", icon: Home },
               { label: "Hợp đồng", path: "/mobile/contracts", icon: FileText },
               { label: "Công việc", path: "/mobile/jobs", icon: Briefcase },
               { label: "Kế toán", path: "/mobile/accounting", icon: CreditCard },
            ];
         }

         if (smallAdminProfile === "accounting_ops") {
            return [
               { label: "Trang chủ", path: "/mobile/", icon: Home },
               { label: "Kế toán", path: "/mobile/accounting", icon: CreditCard },
               { label: "Hợp đồng", path: "/mobile/contracts", icon: FileText },
               { label: "Nhân sự", path: "/mobile/hr", icon: Users },
            ];
         }

         if (smallAdminProfile === "sales_ops") {
            return [
               { label: "Trang chủ", path: "/mobile/", icon: Home },
               { label: "Leads", path: "/mobile/leads", icon: Handshake },
               { label: "Khách hàng", path: "/mobile/customers", icon: Users },
               { label: "Hợp đồng", path: "/mobile/contracts", icon: FileText },
            ];
         }

         return [
            { label: "Trang chủ", path: "/mobile/", icon: Home },
            { label: "Dự án", path: "/mobile/projects", icon: FolderKanban },
            { label: "Công việc", path: "/mobile/jobs", icon: Briefcase },
            { label: "Kho", path: "/mobile/inventory", icon: Package },
         ];
      }

      if (companySize === "large") {
         if (largeAdminProfile === "accounting_manager") {
            return [
               { label: "Trang chủ", path: "/mobile/", icon: Home },
               { label: "Kế toán", path: "/mobile/accounting", icon: CreditCard },
               { label: "Hợp đồng", path: "/mobile/contracts", icon: FileText },
               { label: "Báo cáo", path: "/mobile/reports", icon: LineChart },
            ];
         }

         if (largeAdminProfile === "hr_manager") {
            return [
               { label: "Trang chủ", path: "/mobile/", icon: Home },
               { label: "Nhân sự", path: "/mobile/hr", icon: Users },
               { label: "Phê duyệt", path: "/mobile/approvals", icon: ClipboardCheck },
               { label: "Báo cáo", path: "/mobile/reports", icon: LineChart },
            ];
         }

         if (largeAdminProfile === "sales_manager") {
            return [
               { label: "Trang chủ", path: "/mobile/", icon: Home },
               { label: "Leads", path: "/mobile/leads", icon: Handshake },
               { label: "Khách hàng", path: "/mobile/customers", icon: Users },
               { label: "Hợp đồng", path: "/mobile/contracts", icon: FileText },
            ];
         }

         if (largeAdminProfile === "install_manager" || largeAdminProfile === "maintenance_manager") {
            return [
               { label: "Trang chủ", path: "/mobile/", icon: Home },
               { label: "Công việc", path: "/mobile/jobs", icon: Briefcase },
               { label: "Thang máy", path: "/mobile/elevators", icon: Settings },
               { label: "Kho", path: "/mobile/inventory", icon: Package },
            ];
         }
      }

      return [
         { label: "Trang chủ", path: "/mobile/", icon: Home },
         { label: "Công việc", path: "/mobile/jobs", icon: Briefcase },
         { label: "Thang máy", path: "/mobile/elevators", icon: Settings },
         { label: "Báo cáo", path: "/mobile/reports", icon: LineChart },
      ];
   })();

   const primaryNavItems = useMemo(
      () => rawPrimaryNavItems.filter((item) => canAccessMobilePath(item.path, role, permissions)),
      [rawPrimaryNavItems, role, permissions],
   );

   const filteredNavItems = useMemo(() => {
      const q = navQuery.trim().toLowerCase();
      if (!q) return accessibleWebNavItems;
      return accessibleWebNavItems.filter((item) => item.label.toLowerCase().includes(q));
   }, [accessibleWebNavItems, navQuery]);

   const groupedNavItems = useMemo(() => {
      const groups: Array<{ title: string; items: MobileNavItem[] }> = [
         { title: "Điều hành", items: [] },
         { title: "Kinh doanh & khách hàng", items: [] },
         { title: "Vận hành kỹ thuật", items: [] },
         { title: "Portal", items: [] },
         { title: "Khác", items: [] },
      ];

      const pushToGroup = (title: string, item: MobileNavItem) => {
         const target = groups.find((g) => g.title === title);
         target?.items.push(item);
      };

      filteredNavItems.forEach((item) => {
         if (role === "customer" && item.path === "/mobile/scanner") {
            pushToGroup("Portal", item);
            return;
         }

         if (["/mobile/approvals", "/mobile/reports", "/mobile/accounting", "/mobile/hr"].includes(item.path)) {
            pushToGroup("Điều hành", item);
            return;
         }

         if (["/mobile/leads", "/mobile/customers", "/mobile/contracts"].includes(item.path)) {
            pushToGroup("Kinh doanh & khách hàng", item);
            return;
         }

         if (
            [
               "/mobile/projects",
               "/mobile/jobs",
               "/mobile/elevators",
               "/mobile/inventory",
               "/mobile/scanner",
               "/mobile/tech",
               "/mobile/tech/jobs",
               "/mobile/tech/route-plan",
               "/mobile/tech/schedule",
            ].includes(item.path)
         ) {
            pushToGroup("Vận hành kỹ thuật", item);
            return;
         }

         if (item.path.startsWith("/mobile/portal")) {
            pushToGroup("Portal", item);
            return;
         }

         pushToGroup("Khác", item);
      });

      return groups.filter((g) => g.items.length > 0);
   }, [filteredNavItems]);

   const bottomTabColumns = Math.max(primaryNavItems.length + 1, 1);

  const switchRole = () => {
      if (switchableProfiles.length <= 1) {
         setIsMenuOpen(false);
         return;
      }

      const currentKey = `${user.id}:${role}`;
      const currentIndex = Math.max(
         switchableProfiles.findIndex((profile) => `${profile.userId}:${profile.roleBucket}` === currentKey),
         0,
      );
      const nextProfile = switchableProfiles[(currentIndex + 1) % switchableProfiles.length];
      chooseProfile(nextProfile.userId, nextProfile.roleBucket);
   };

   const switchCompanyScale = () => {
      setCompanySize(companySize === "large" ? "small" : "large");
      setIsMenuOpen(false);
   };

   const handleBack = () => {
      if (backLink) {
         navigate({ to: backLink });
         return;
      }
      window.history.back();
   };

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 font-sans relative overflow-hidden">
      {/* Header with Role Branding */}
      {!hideHeader && (
        <header className="shrink-0 bg-white/70 backdrop-blur-xl border-b border-slate-100 px-5 py-4 flex items-center justify-between shadow-sm z-[60]">
          <div className="flex items-center gap-3">
                  {showBackButton ? (
                     <button onClick={handleBack} className="h-9 w-9 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200 active:scale-95 transition-all">
                        <ChevronLeft className="h-5 w-5 text-slate-600" />
                     </button>
                  ) : (
                     <div className="h-9 w-9" />
                  )}
             <div>
                <h2 className="text-[13px] font-black italic text-slate-900 leading-none uppercase tracking-tight">{title || "Cloud_Stack"}</h2>
                <div className="flex items-center gap-1.5 mt-1">
                   <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
                   <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em]">{role} ACTIVE</p>
                </div>
             </div>
          </div>
          <div className="flex items-center gap-2">
             <button className="h-9 w-9 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200 active:scale-95 transition-all relative">
                <Bell className="h-5 w-5 text-slate-500" />
                <span className="absolute top-2 right-2 h-2 w-2 bg-rose-500 rounded-full border-2 border-white shadow-sm" />
             </button>
             <button
                onClick={() => {
                   setNavQuery("");
                   setIsMenuOpen(true);
                }}
                className="h-9 w-9 rounded-xl bg-slate-900 flex items-center justify-center border border-slate-800 active:scale-95 shadow-lg shadow-slate-900/20 group"
             >
                <Menu className="h-4 w-4 text-white group-active:rotate-90 transition-transform" />
             </button>
          </div>
        </header>
      )}

      {/* Navigation Hub: bottom sheet for many features */}
         {isMenuOpen && (
        <>
               <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] animate-in fade-in duration-300" onClick={() => setIsMenuOpen(false)} />
               <div className="absolute inset-x-0 bottom-0 h-[86%] bg-white z-[101] shadow-2xl rounded-t-[2rem] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300 ease-out">
                  <div className="shrink-0 border-b border-slate-100 px-5 pt-3 pb-4 bg-white">
                     <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-slate-200" />
                     <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                           <div className="h-11 w-11 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                              <UserCircle className="h-7 w-7 text-indigo-600" />
                           </div>
                           <div className="min-w-0">
                              <p className="text-[13px] font-black text-slate-900 truncate">{user?.name || "Người dùng"}</p>
                              <p className="text-[10px] font-bold uppercase tracking-wide text-indigo-600">{roleLabel}</p>
                           </div>
                        </div>
                        <button onClick={() => setIsMenuOpen(false)} className="h-9 w-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center">
                           <X className="h-4 w-4 text-slate-600" />
                        </button>
                     </div>
                     <div className="mt-3 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                           value={navQuery}
                           onChange={(e) => setNavQuery(e.target.value)}
                           placeholder="Tìm chức năng..."
                           className="w-full h-10 rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-[12px] font-semibold text-slate-700 outline-none focus:border-indigo-300 focus:bg-white"
                        />
                     </div>
                  </div>

             <div className="flex-1 overflow-y-auto p-5 space-y-2 no-scrollbar">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 pl-2">System Controls_</p>
                
                <button onClick={switchRole} className="w-full h-14 flex items-center gap-4 px-4 rounded-2xl hover:bg-slate-50 active:bg-slate-100 text-slate-700 transition-all border border-transparent active:border-slate-100 group shrink-0">
                   <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <ArrowRightLeft className="h-5 w-5 text-indigo-600" />
                   </div>
                   <div className="text-left">
                      <span className="block text-[12px] font-bold uppercase tracking-tight">Switch Role</span>
                      <span className="block text-[9px] font-semibold text-slate-400">{switchableProfiles.length > 1 ? "Chuyển profile kế tiếp" : "Chỉ có 1 profile khả dụng"}</span>
                   </div>
                </button>

                <button onClick={switchCompanyScale} className="w-full h-14 flex items-center gap-4 px-4 rounded-2xl hover:bg-slate-50 text-slate-700 transition-all group shrink-0">
                   <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Building2 className="h-5 w-5 text-emerald-600" />
                   </div>
                   <div className="text-left">
                      <span className="block text-[12px] font-bold uppercase tracking-tight">Company Scale</span>
                      <span className="block text-[9px] font-semibold text-slate-400 capitalize">{companySize} mode (tap to switch)</span>
                   </div>
                </button>

                        <div className="h-6" />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2 pl-2">Role Profiles_</p>
                        <p className="text-[9px] font-semibold text-slate-400 mb-3 pl-2">
                           {activeTenantId === "t-1" ? "Công ty lớn: vai trò tách biệt" : "Công ty nhỏ: vai trò linh hoạt"}
                        </p>

                        <div className="space-y-2">
                           {tenantProfiles.map((profile) => (
                              <button
                                 key={`${profile.userId}-${activeTenantId}`}
                                 onClick={() => chooseProfile(profile.userId, profile.roleBucket)}
                                 className="w-full p-3 rounded-2xl border border-slate-100 bg-white hover:bg-slate-50 text-left transition-all"
                              >
                                 <p className="text-[11px] font-black text-slate-800 uppercase truncate">{profile.name}</p>
                                 <div className="mt-1 flex items-center justify-between gap-2">
                                    <span className="text-[9px] font-bold text-indigo-600 uppercase">{profile.roleTitle}</span>
                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-wide">{profile.subtitle}</span>
                                 </div>
                              </button>
                           ))}
                        </div>

                        <div className="h-6" />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2 pl-2">Navigation Hub_</p>
                        <p className="text-[9px] font-semibold text-slate-400 mb-3 pl-2">Nhóm chức năng theo tác vụ để tìm nhanh trên mobile</p>

                        <div className="space-y-4">
                           {groupedNavItems.map((group) => (
                              <div key={group.title} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
                                 <p className="text-[9px] font-black uppercase tracking-wider text-slate-500 mb-2">{group.title}</p>
                                 <div className="grid grid-cols-1 gap-2">
                                    {group.items.map((item) => {
                                       const Icon = item.icon;
                                       return (
                                          <Link
                                             key={`group-${group.title}-${item.path}`}
                                             to={item.path}
                                             onClick={() => setIsMenuOpen(false)}
                                             className="h-11 flex items-center gap-3 px-3 rounded-xl border border-slate-100 bg-white hover:bg-slate-50 text-slate-700 transition-all"
                                          >
                                             <div className="h-7 w-7 rounded-lg bg-slate-100 flex items-center justify-center">
                                                <Icon className="h-3.5 w-3.5 text-slate-600" />
                                             </div>
                                             <span className="text-[11px] font-bold uppercase tracking-tight truncate">{item.label}</span>
                                          </Link>
                                       );
                                    })}
                                 </div>
                              </div>
                           ))}

                           {groupedNavItems.length === 0 ? (
                              <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-4 text-center">
                                 <p className="text-[11px] font-bold text-slate-500">Không tìm thấy chức năng phù hợp</p>
                              </div>
                           ) : null}
                        </div>

                <div className="h-6" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 pl-2">Personal_</p>
                
                <Link to="/mobile/profile" onClick={() => setIsMenuOpen(false)} className="w-full h-14 flex items-center gap-4 px-4 rounded-2xl hover:bg-slate-50 text-slate-700 transition-all group shrink-0">
                   <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Settings className="h-5 w-5 text-slate-500" />
                   </div>
                   <span className="text-[12px] font-black uppercase tracking-tighter">My Account</span>
                </Link>

                <button className="w-full h-14 flex items-center gap-4 px-4 rounded-2xl hover:bg-rose-50 text-rose-600 transition-all group mt-10 shrink-0">
                   <div className="h-10 w-10 rounded-xl bg-rose-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <LogOut className="h-5 w-5" />
                   </div>
                   <span className="text-[12px] font-black uppercase tracking-tighter underline decoration-2 underline-offset-4">End Session</span>
                </button>
             </div>

             <div className="p-6 border-t border-slate-100 flex justify-center shrink-0 bg-white">
                <div className="flex flex-col items-center opacity-20">
                   <ShieldCheck className="h-8 w-8 text-slate-900 mb-2" />
                   <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.4em] italic">Encrypted Cloud_</p>
                </div>
             </div>
          </div>
        </>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto no-scrollbar pb-32">
        {children}
      </main>

      {/* Primary Bottom Tabs + More Hub */}
      <div className="absolute bottom-0 left-0 right-0 z-50 border-t border-slate-200/80 bg-white/95 backdrop-blur-xl">
         <nav
            className="grid gap-1 px-2 pt-2 pb-[calc(env(safe-area-inset-bottom,0px)+0.6rem)]"
            style={{ gridTemplateColumns: `repeat(${bottomTabColumns}, minmax(0, 1fr))` }}
         >
            {primaryNavItems.map((item) => {
               const Icon = item.icon;
               return (
                  <Link
                     key={`primary-${item.path}`}
                     to={item.path}
                     className="group flex flex-col items-center justify-center gap-1 rounded-xl py-2 active:scale-95"
                  >
                     <Icon className="h-4 w-4 text-slate-400 group-data-[status=active]:text-indigo-600" />
                     <span className="text-[9px] font-black uppercase tracking-wide text-slate-400 group-data-[status=active]:text-indigo-600">{item.label}</span>
                  </Link>
               );
            })}
            <button
               onClick={() => {
                  setNavQuery("");
                  setIsMenuOpen(true);
               }}
               className="group flex flex-col items-center justify-center gap-1 rounded-xl py-2 active:scale-95"
            >
               <Menu className="h-4 w-4 text-slate-500 group-active:text-indigo-600" />
               <span className="text-[9px] font-black uppercase tracking-wide text-slate-500 group-active:text-indigo-600">Thêm</span>
            </button>
         </nav>
      </div>
    </div>
  );
}
