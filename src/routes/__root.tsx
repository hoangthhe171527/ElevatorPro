import { Outlet, Link, createRootRoute, HeadContent, Scripts, useRouterState } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Lovable App" },
      {
        name: "description",
        content: "Lift Service Hub is a modern elevator service management system.",
      },
      { name: "author", content: "Lovable" },
      { property: "og:title", content: "Lovable App" },
      {
        property: "og:description",
        content: "Lift Service Hub is a modern elevator service management system.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "Lovable App" },
      {
        name: "twitter:description",
        content: "Lift Service Hub is a modern elevator service management system.",
      },
      {
        property: "og:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/7ff846f1-46b4-4037-8e3d-47cd6b577536/id-preview-b8c6b7e4--15be25b7-5615-4f28-8660-d1137b8d33f2.lovable.app-1776504115739.png",
      },
      {
        name: "twitter:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/7ff846f1-46b4-4037-8e3d-47cd6b577536/id-preview-b8c6b7e4--15be25b7-5615-4f28-8660-d1137b8d33f2.lovable.app-1776504115739.png",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const isMobileRoute = useRouterState({ 
    select: (s) => s.location.pathname.startsWith("/mobile") 
  });

  if (isMobileRoute) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-0 sm:p-4">
        <div className="w-full max-w-[440px] h-screen sm:h-[850px] bg-white sm:rounded-[3rem] sm:shadow-2xl sm:border-[8px] sm:border-gray-900 overflow-hidden relative flex flex-col">
          <div className="flex-1 h-full overflow-hidden">
            <Outlet />
          </div>
          <Toaster position="top-center" richColors />
        </div>
      </div>
    );
  }

  return (
    <>
      <Outlet />
      <Toaster position="top-right" richColors />
    </>
  );
}
