import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Permission } from "./mock-data";
import { mockUsers } from "./mock-data";
import { ADMIN_PERMISSIONS, TECH_INSTALLATION_PERMISSIONS, TECH_PERMISSIONS } from "./roles";

type AppRole = "admin" | "tech";

function getPermissionsForTenant(userId: string, tenantId: string): Permission[] {
  const user = mockUsers.find((u) => u.id === userId);
  const membership = user?.memberships.find((m) => m.tenantId === tenantId);
  return membership?.permissions || [];
}

function hasRoleInTenant(userId: string, tenantId: string, role: AppRole): boolean {
  const permissions = getPermissionsForTenant(userId, tenantId);
  if (!permissions.length) return false;

  const rolePermissions = role === "admin" ? ADMIN_PERMISSIONS : TECH_PERMISSIONS;
  return permissions.some((p) => rolePermissions.includes(p));
}

function findUserIdForRole(tenantId: string, role: AppRole): string | null {
  const candidate = mockUsers.find((u) => {
    const hasTenant = u.memberships.some((m) => m.tenantId === tenantId);
    if (!hasTenant) return false;
    return hasRoleInTenant(u.id, tenantId, role);
  });

  return candidate?.id || null;
}

function resolveRoleForUser(userId: string, tenantId: string, preferredRole?: AppRole): AppRole {
  if (preferredRole && hasRoleInTenant(userId, tenantId, preferredRole)) {
    return preferredRole;
  }

  if (hasRoleInTenant(userId, tenantId, "admin")) {
    return "admin";
  }

  if (hasRoleInTenant(userId, tenantId, "tech")) {
    return "tech";
  }

  return "admin";
}

interface AppState {
  userId: string;
  activeTenantId: string;
  activeJobCheckIn: string | null;
  hasHydrated: boolean;
  companySize: "large" | "small";
  mainRole: AppRole;
  quickIncidentOpen: boolean;
  isAppPreview: boolean;
  setUserId: (userId: string) => void;
  setTenantId: (tenantId: string) => void;
  setJobCheckIn: (jobId: string | null) => void;
  setHasHydrated: (val: boolean) => void;
  setCompanySize: (size: "large" | "small") => void;
  setMainRole: (role: AppRole) => void;
  setQuickIncidentOpen: (val: boolean) => void;
  setAppPreview: (val: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      userId: "u-director-2",
      activeTenantId: "t-2",
      activeJobCheckIn: null,
      hasHydrated: false,
      companySize: "small",
      mainRole: "admin",
      quickIncidentOpen: false,
      isAppPreview: false,
      setUserId: (userId) => {
        const user = mockUsers.find((u) => u.id === userId);
        const currentTenant = get().activeTenantId;
        const activeTenantId = user?.memberships?.some((m) => m.tenantId === currentTenant)
          ? currentTenant
          : user?.memberships?.[0]?.tenantId || currentTenant;
        const mainRole = resolveRoleForUser(userId, activeTenantId, get().mainRole);
        set({
          userId,
          activeTenantId,
          mainRole,
          activeJobCheckIn: null,
        });
      },
      setTenantId: (tenantId) => {
        const preferredRole = get().mainRole;
        const preferredUserId = hasRoleInTenant(get().userId, tenantId, preferredRole)
          ? get().userId
          : findUserIdForRole(tenantId, preferredRole);

        const fallbackRole: AppRole = "tech";
        const fallbackUserId = preferredUserId || findUserIdForRole(tenantId, fallbackRole);
        const finalUserId = fallbackUserId || get().userId;
        const finalRole = resolveRoleForUser(finalUserId, tenantId, preferredRole);

        set({
          activeTenantId: tenantId,
          companySize: "small",
          userId: finalUserId,
          mainRole: finalRole,
          activeJobCheckIn: null,
          quickIncidentOpen: false,
        });
      },
      setJobCheckIn: (jobId) => set({ activeJobCheckIn: jobId }),
      setHasHydrated: (val) => set({ hasHydrated: val }),
      setCompanySize: (size) => {
        void size;
        get().setTenantId("t-2");
      },
      setMainRole: (role) => {
        const tenantId = get().activeTenantId;
        const currentUserId = get().userId;
        const nextUserId = hasRoleInTenant(currentUserId, tenantId, role)
          ? currentUserId
          : findUserIdForRole(tenantId, role) || currentUserId;
        const nextRole = resolveRoleForUser(nextUserId, tenantId, role);
        set({
          userId: nextUserId,
          mainRole: nextRole,
          activeJobCheckIn: null,
        });
      },
      setQuickIncidentOpen: (val) => set({ quickIncidentOpen: val }),
      setAppPreview: (val) => set({ isAppPreview: val }),
    }),
    {
      name: "elevator-app-state-v6",
      partialize: (state) => ({
        userId: state.userId,
        activeTenantId: state.activeTenantId,
        companySize: state.companySize,
        mainRole: state.mainRole,
      }),
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

export function setMainRole(role: AppRole) {
  useAppStore.getState().setMainRole(role);
}

export function useCurrentPermissions(): Permission[] {
  const user = useCurrentUser();
  const tenantId = useAppStore((s) => s.activeTenantId);
  const membership = user.memberships.find((m) => m.tenantId === tenantId);
  return membership?.permissions || [];
}

export function useIsSmallCompany() {
  const companySize = useAppStore((s) => s.companySize);
  return companySize === "small";
}

export function useCanWrite(
  module: "projects" | "hr" | "accounting" | "inventory" | "jobs" | "leads" | "contracts",
) {
  const permissions = useCurrentPermissions();
  const isCEO = permissions.includes("tech_manager");

  switch (module) {
    case "projects":
      return isCEO || permissions.some((p) => TECH_INSTALLATION_PERMISSIONS.includes(p));
    case "hr":
      return isCEO;
    case "accounting":
      return isCEO || permissions.includes("accountant");
    case "inventory":
      return isCEO || permissions.some((p) => TECH_PERMISSIONS.includes(p));
    case "jobs":
      return (
        isCEO ||
        permissions.includes("service_dispatcher") ||
        permissions.includes("service_dispatcher") ||
        permissions.some((p) => TECH_PERMISSIONS.includes(p))
      );
    case "leads":
      return (
        isCEO ||
        permissions.includes("sales") ||
        permissions.includes("sales_admin") ||
        permissions.includes("tech_manager") ||
        permissions.includes("service_dispatcher") ||
        permissions.includes("service_dispatcher")
      );
    case "contracts":
      return (
        isCEO ||
        permissions.includes("accountant") ||
        permissions.includes("sales") ||
        permissions.includes("sales_admin") ||
        permissions.includes("tech_manager")
      );
    default:
      return false;
  }
}
