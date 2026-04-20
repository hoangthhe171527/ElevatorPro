import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Permission } from "./mock-data";
import { mockUsers } from "./mock-data";

type MobileRole = "admin" | "tech" | "customer";

const ADMIN_PERMISSIONS: Permission[] = [
  "director",
  "sales",
  "sales_maintenance",
  "accounting",
  "hr_admin",
  "install_mgmt",
  "maintenance_mgmt",
];

const TECH_PERMISSIONS: Permission[] = ["field_tech", "tech_survey", "maintenance_mgmt", "install_mgmt"];
const CUSTOMER_PERMISSIONS: Permission[] = ["customer"];

function getPermissionsForTenant(userId: string, tenantId: string): Permission[] {
  const user = mockUsers.find((u) => u.id === userId);
  const membership = user?.memberships.find((m) => m.tenantId === tenantId);
  return membership?.permissions || [];
}

function hasRoleInTenant(userId: string, tenantId: string, role: MobileRole): boolean {
  const permissions = getPermissionsForTenant(userId, tenantId);
  if (!permissions.length) return false;

  const rolePermissions =
    role === "admin"
      ? ADMIN_PERMISSIONS
      : role === "tech"
        ? TECH_PERMISSIONS
        : CUSTOMER_PERMISSIONS;
  return permissions.some((p) => rolePermissions.includes(p));
}

function findUserIdForRole(tenantId: string, role: MobileRole): string | null {
  const candidate = mockUsers.find((u) => {
    const hasTenant = u.memberships.some((m) => m.tenantId === tenantId);
    if (!hasTenant) return false;
    return hasRoleInTenant(u.id, tenantId, role);
  });

  return candidate?.id || null;
}

function resolveRoleForUser(userId: string, tenantId: string, preferredRole?: MobileRole): MobileRole {
  if (preferredRole && hasRoleInTenant(userId, tenantId, preferredRole)) {
    return preferredRole;
  }

  if (hasRoleInTenant(userId, tenantId, "admin")) {
    return "admin";
  }

  if (hasRoleInTenant(userId, tenantId, "tech")) {
    return "tech";
  }

  if (hasRoleInTenant(userId, tenantId, "customer")) {
    return "customer";
  }

  return "admin";
}

interface AppState {
  userId: string;
  activeTenantId: string;
  activeJobCheckIn: string | null;
  hasHydrated: boolean;
  companySize: "large" | "small";
  mainRole: MobileRole; // Thêm để điều khiển dashboard Mobile
  setUserId: (userId: string) => void;
  setTenantId: (tenantId: string) => void;
  setJobCheckIn: (jobId: string | null) => void;
  setHasHydrated: (val: boolean) => void;
  setCompanySize: (size: "large" | "small") => void;
  setMainRole: (role: MobileRole) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      userId: "u-director-1",
      activeTenantId: "t-1",
      activeJobCheckIn: null,
      hasHydrated: false,
      companySize: "large",
      mainRole: "admin",
      setUserId: (userId) => {
        const user = mockUsers.find((u) => u.id === userId);
        const activeTenantId = user?.memberships?.[0]?.tenantId || get().activeTenantId;
        const mainRole = resolveRoleForUser(userId, activeTenantId, get().mainRole);
        set({ userId, activeTenantId, mainRole, activeJobCheckIn: null });
      },
      setTenantId: (tenantId) => {
        const preferredRole = get().mainRole;
        const preferredUserId = hasRoleInTenant(get().userId, tenantId, preferredRole)
          ? get().userId
          : findUserIdForRole(tenantId, preferredRole);

        const fallbackRole: MobileRole = preferredRole === "admin" ? "tech" : "admin";
        const fallbackUserId = preferredUserId || findUserIdForRole(tenantId, fallbackRole);
        const finalUserId = fallbackUserId || get().userId;
        const finalRole = resolveRoleForUser(finalUserId, tenantId, preferredRole);

        set({
          activeTenantId: tenantId,
          companySize: tenantId === "t-1" ? "large" : "small",
          userId: finalUserId,
          mainRole: finalRole,
          activeJobCheckIn: null,
        });
      },
      setJobCheckIn: (jobId) => set({ activeJobCheckIn: jobId }),
      setHasHydrated: (val) => set({ hasHydrated: val }),
      setCompanySize: (size) => {
        const tenantId = size === "large" ? "t-1" : "t-2";
        get().setTenantId(tenantId);
      },
      setMainRole: (role) => {
        const tenantId = get().activeTenantId;
        const nextUserId = findUserIdForRole(tenantId, role) || get().userId;
        const nextRole = resolveRoleForUser(nextUserId, tenantId, role);
        set({ userId: nextUserId, mainRole: nextRole, activeJobCheckIn: null });
      },
    }),
    {
      name: "elevator-app-state-v5",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

export function useCurrentUser() {
  const userId = useAppStore((s) => s.userId);
  return mockUsers.find((u) => u.id === userId) || mockUsers[0];
}

export function useMainRole() {
  return useAppStore((s) => s.mainRole);
}

export function setMainRole(role: MobileRole) {
  useAppStore.getState().setMainRole(role);
}

export function useCurrentPermissions(): Permission[] {
  const user = useCurrentUser();
  const tenantId = useAppStore((s) => s.activeTenantId);
  const membership = user.memberships.find((m) => m.tenantId === tenantId);
  return membership?.permissions || [];
}

export function useCanWrite(module: "projects" | "hr" | "accounting" | "inventory" | "jobs" | "leads" | "contracts") {
  const permissions = useCurrentPermissions();
  if (permissions.includes("director")) return true;
  switch (module) {
    case "projects": return permissions.includes("install_mgmt") || permissions.includes("tech_survey");
    case "hr": return permissions.includes("hr_admin");
    case "accounting": return permissions.includes("accounting");
    case "inventory": return permissions.includes("maintenance_mgmt") || permissions.includes("install_mgmt") || permissions.includes("field_tech");
    case "jobs": return permissions.includes("maintenance_mgmt") || permissions.includes("install_mgmt") || permissions.includes("field_tech");
    case "leads": case "contracts": return permissions.includes("sales") || permissions.includes("sales_maintenance");
    default: return false;
  }
}
