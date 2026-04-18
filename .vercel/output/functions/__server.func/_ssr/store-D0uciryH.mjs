import { c as create, p as persist } from "../_libs/zustand.mjs";
import { n as mockUsers } from "./router-CAssNYuO.mjs";
const userByRole = {
  admin: "u-admin",
  technician: "u-tech-1",
  customer: "u-cus-1"
};
const useAppStore = create()(
  persist(
    (set) => ({
      role: "admin",
      userId: "u-admin",
      setRole: (role) => set({ role, userId: userByRole[role] })
    }),
    { name: "elevator-app-state" }
  )
);
function useCurrentUser() {
  const userId = useAppStore((s) => s.userId);
  return mockUsers.find((u) => u.id === userId);
}
export {
  useCurrentUser as a,
  useAppStore as u
};
