import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Role } from "./mock-data";
import { mockUsers } from "./mock-data";

interface AppState {
  role: Role;
  userId: string;
  activeTenantId: string;
  setRole: (role: Role) => void;
  setTenantId: (tenantId: string) => void;
}

const userByRole: Record<Role, string> = {
  admin: "u-admin",
  technician: "u-tech-1",
  customer: "u-cus-1",
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      role: "admin",
      userId: "u-admin",
      activeTenantId: "t-1",
      setRole: (role) => {
        const newUserId = userByRole[role];
        const user = mockUsers.find(u => u.id === newUserId);
        const activeTenantId = user?.memberships?.[0]?.tenantId || get().activeTenantId;
        set({ role, userId: newUserId, activeTenantId });
      },
      setTenantId: (tenantId) => {
        const user = mockUsers.find(u => u.id === get().userId);
        const membership = user?.memberships.find(m => m.tenantId === tenantId);
        if (membership) {
          set({ activeTenantId: tenantId, role: membership.role });
        } else {
          set({ activeTenantId: tenantId });
        }
      }
    }),
    { name: "elevator-app-state-v2" }
  )
);

export function useCurrentUser() {
  const userId = useAppStore((s) => s.userId);
  return mockUsers.find((u) => u.id === userId)!;
}
