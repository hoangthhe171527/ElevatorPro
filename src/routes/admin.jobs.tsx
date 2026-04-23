import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/jobs")({
  validateSearch: (search: Record<string, unknown>): { readonly?: string; tab?: string; priority?: string; status?: string } => {
    return {
      readonly: (search.readonly as string) || undefined,
      tab: (search.tab as string) || undefined,
      priority: (search.priority as string) || undefined,
      status: (search.status as string) || undefined,
    };
  },
  component: () => <Outlet />,
});
