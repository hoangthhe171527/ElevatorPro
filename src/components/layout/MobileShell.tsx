import { Link, useLocation } from "@tanstack/react-router";
import { useCurrentUser } from "@/lib/store";
import { 
  Home, 
  Building, 
  Briefcase, 
  User, 
  Bell, 
  Search,
  ChevronLeft,
  LayoutGrid
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface MobileShellProps {
  children: React.ReactNode;
  title?: string;
  showBackButton?: boolean;
}

export function MobileShell({ children, title, showBackButton }: MobileShellProps) {
  const user = useCurrentUser();
  const location = useLocation();
  
  const initials = user.name
    .split(" ")
    .slice(-2)
    .map((n) => n[0])
    .join("");

  const tabs = [
    { to: "/mobile", label: "Tổng quan", icon: Home },
    { to: "/mobile/projects", label: "Dự án", icon: Building },
    { to: "/mobile/jobs", label: "Công việc", icon: Briefcase },
    { to: "/mobile/profile", label: "Cá nhân", icon: User },
  ];

  const isActive = (to: string) => 
    location.pathname === to || (to !== "/mobile" && location.pathname.startsWith(to));

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-0 md:p-8">
      {/* Phone Frame Simulator - Only shown on Desktop */}
      <div className="relative w-full h-screen md:w-[390px] md:h-[844px] bg-background md:rounded-[3rem] md:border-[8px] md:border-slate-900 md:shadow-2xl overflow-hidden flex flex-col">
        
        {/* Status Bar / Notch Area */}
        <div className="h-10 w-full flex items-center justify-between px-6 pt-2 shrink-0 select-none">
          <span className="text-xs font-bold">11:11</span>
          <div className="flex gap-1.5 items-center">
             <div className="w-4 h-4 bg-foreground rounded-full opacity-10" />
             <div className="w-3 h-3 bg-foreground rounded-full opacity-10" />
          </div>
        </div>

        {/* Mobile Header */}
        <header className="h-16 flex items-center justify-between px-4 sticky top-0 bg-background/80 backdrop-blur-md z-30 border-b">
          <div className="flex items-center gap-2">
            {showBackButton ? (
              <Button variant="ghost" size="icon" className="-ml-2 h-9 w-9 rounded-full" onClick={() => window.history.back()}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
            ) : (
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                    <LayoutGrid className="h-4.5 w-4.5 text-white" />
                </div>
            )}
            <h1 className="font-bold text-lg truncate max-w-[180px]">
                {title || "ElevatorPro"}
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
             <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-background" />
             </Button>
             <Link to={"/mobile/profile" as any}>
                <Avatar className="h-8 w-8 ring-2 ring-primary/10">
                    <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
                        {initials}
                    </AvatarFallback>
                </Avatar>
             </Link>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto pb-24 scrollbar-hide bg-slate-50/50">
            {children}
        </main>

        {/* Bottom Tab Navigation */}
        <nav className="h-20 bg-background/95 backdrop-blur-lg border-t flex items-center justify-around px-2 absolute bottom-0 w-full z-40 pb-4">
           {tabs.map((tab) => {
               const active = isActive(tab.to);
               const Icon = tab.icon;
               return (
                  <Link 
                    key={tab.to}
                    to={tab.to as any}
                    className={cn(
                        "flex flex-col items-center justify-center gap-1 w-16 h-full transition-colors",
                        active ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    <Icon className={cn("h-5 w-5", active && "fill-current text-primary")} />
                    <span className="text-[10px] font-medium tracking-tight">{tab.label}</span>
                    {active && <div className="w-1 h-1 bg-primary rounded-full absolute bottom-4" />}
                  </Link>
               )
           })}
        </nav>

        {/* Home Indicator - Native look */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-foreground/10 rounded-full z-50 pointer-events-none hidden md:block" />
      </div>

      {/* Exit Button - Only on desktop */}
      <div className="hidden lg:flex absolute top-8 right-8 flex-col items-end gap-3">
         <Link to="/admin">
            <Button variant="secondary" className="shadow-lg">Thoát Mobile Demo</Button>
         </Link>
         <p className="text-muted-foreground text-xs text-right max-w-[200px]">
            Đang mô phỏng trên khung hình <b>iPhone 13 Pro (390 x 844)</b>
         </p>
      </div>
    </div>
  );
}
