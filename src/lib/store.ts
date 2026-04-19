import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Permission } from "./mock-data";
import { mockUsers } from "./mock-data";

interface AppState {
  userId: string;
  activeTenantId: string;
  setUserId: (userId: string) => void;
  setTenantId: (tenantId: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      userId: "u-director-1",
      activeTenantId: "t-1",
      setUserId: (userId) => {
        const user = mockUsers.find(u => u.id === userId);
        const activeTenantId = user?.memberships?.[0]?.tenantId || get().activeTenantId;
        set({ userId, activeTenantId });
      },
      setTenantId: (tenantId) => {
        const user = mockUsers.find(u => u.id === get().userId);
        const membership = user?.memberships.find(m => m.tenantId === tenantId);
        if (membership) {
          set({ activeTenantId: tenantId });
        } else {
          set({ activeTenantId: tenantId });
        }
      }
    }),
    { name: "elevator-app-state-v3" }
  )
);

export function useCurrentUser() {
  const userId = useAppStore((s) => s.userId);
  return mockUsers.find((u) => u.id === userId) || mockUsers[0];
}

export function useCurrentPermissions(): Permission[] {
  const user = useCurrentUser();
  const tenantId = useAppStore((s) => s.activeTenantId);
  const membership = user.memberships.find((m) => m.tenantId === tenantId);
  return membership?.permissions || [];
}

/**
 * RBAC Helper: Kiểm tra xem user hiện tại có quyền "ghi" (thao tác) vào module hay không.
 * Nếu là Director thì luôn true. Cấp dưới chỉ được thao tác module chuyên môn.
 */
export function useCanWrite(module: "projects" | "hr" | "accounting" | "inventory" | "jobs" | "leads" | "contracts") {
  const permissions = useCurrentPermissions();
  if (permissions.includes("director")) return true;

  switch (module) {
    case "projects":
      return permissions.includes("install_mgmt") || permissions.includes("tech_survey");
    case "hr":
      return permissions.includes("hr_admin");
    case "accounting":
      return permissions.includes("accounting");
    case "inventory":
      return permissions.includes("maintenance_mgmt") || permissions.includes("install_mgmt") || permissions.includes("field_tech");
    case "jobs":
      return permissions.includes("maintenance_mgmt") || permissions.includes("install_mgmt") || permissions.includes("field_tech");
    case "leads":
    case "contracts":
      return permissions.includes("sales") || permissions.includes("sales_maintenance");
    default:
      return false;
  }
}
