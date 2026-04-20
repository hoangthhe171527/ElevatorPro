import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Permission } from "./mock-data";
import { mockUsers } from "./mock-data";

interface AppState {
  userId: string;
  activeTenantId: string;
  activeJobCheckIn: string | null;
  hasHydrated: boolean;
  companySize: "large" | "small";
  mainRole: "admin" | "tech"; // Thêm để điều khiển dashboard Mobile
  setUserId: (userId: string) => void;
  setTenantId: (tenantId: string) => void;
  setJobCheckIn: (jobId: string | null) => void;
  setHasHydrated: (val: boolean) => void;
  setCompanySize: (size: "large" | "small") => void;
  setMainRole: (role: "admin" | "tech") => void;
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
        set({ userId, activeTenantId, activeJobCheckIn: null });
      },
      setTenantId: (tenantId) => {
        set({ activeTenantId: tenantId, companySize: tenantId === "t-1" ? "large" : "small" });
      },
      setJobCheckIn: (jobId) => set({ activeJobCheckIn: jobId }),
      setHasHydrated: (val) => set({ hasHydrated: val }),
      setCompanySize: (size) => {
        set({ companySize: size });
        const tenantId = size === "large" ? "t-1" : "t-2";
        const directorId = size === "large" ? "u-director-1" : "u-director-2";
        set({ activeTenantId: tenantId, userId: directorId, activeJobCheckIn: null });
      },
      setMainRole: (role) => set({ mainRole: role }),
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

export function setMainRole(role: "admin" | "tech") {
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
