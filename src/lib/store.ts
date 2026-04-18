import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Role } from "./mock-data";
import { mockUsers } from "./mock-data";

interface AppState {
  role: Role;
  userId: string;
  setRole: (role: Role) => void;
}

const userByRole: Record<Role, string> = {
  admin: "u-admin",
  technician: "u-tech-1",
  customer: "u-cus-1",
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      role: "admin",
      userId: "u-admin",
      setRole: (role) => set({ role, userId: userByRole[role] }),
    }),
    { name: "elevator-app-state" }
  )
);

export function useCurrentUser() {
  const userId = useAppStore((s) => s.userId);
  return mockUsers.find((u) => u.id === userId)!;
}
