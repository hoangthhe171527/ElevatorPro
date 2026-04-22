import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/jobs")({
  validateSearch: (search: Record<string, unknown>): { readonly?: string; tab?: string } => {
    return {
      readonly: (search.readonly as string) || undefined,
      tab: (search.tab as string) || undefined,
    };
  },
  component: () => <Outlet />,
});
