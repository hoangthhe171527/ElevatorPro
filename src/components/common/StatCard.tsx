import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";

interface Props {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  hint?: string;
  trend?: { value: string; positive?: boolean };
  accent?: "primary" | "success" | "warning" | "destructive" | "info";
}

const accentMap = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/15 text-warning-foreground",
  destructive: "bg-destructive/10 text-destructive",
  info: "bg-info/10 text-info",
};

export function StatCard({ label, value, icon: Icon, hint, trend, accent = "primary" }: Props) {
  const isAppPreview = useAppStore((s) => s.isAppPreview);

  return (
    <Card
      className={cn(
        "h-full group transition-all bg-white relative overflow-hidden",
        isAppPreview
          ? "p-4 rounded-3xl border-none shadow-[0_2px_10px_rgba(0,0,0,0.03)]"
          : "p-3 lg:p-5 border-slate-200 shadow-sm",
      )}
    >
      <div className="flex items-start justify-between gap-2 lg:gap-3">
        <div className="min-w-0 flex-1 z-10">
          <div
            className={cn(
              "font-black text-slate-400 uppercase tracking-widest leading-none",
              isAppPreview ? "text-[10px]" : "text-[9px] lg:text-xs",
            )}
          >
            {label}
          </div>
          <div
            className={cn(
              "font-black tracking-tighter text-slate-900 truncate leading-none mt-2",
              isAppPreview ? "text-[22px]" : "text-xl lg:text-3xl",
            )}
          >
            {value}
          </div>

          {hint && !isAppPreview && (
            <div className="mt-1.5 text-[8px] lg:text-xs text-slate-400 font-bold uppercase truncate">
              {hint}
            </div>
          )}

          {trend && (
            <div
              className={cn(
                "mt-2 text-[9px] lg:text-xs font-black uppercase flex items-center gap-1",
                trend.positive ? "text-emerald-500" : "text-rose-500",
              )}
            >
              <span>{trend.positive ? "▲" : "▼"}</span>
              <span>{trend.value}</span>
            </div>
          )}
        </div>
        <div
          className={cn(
            "flex items-center justify-center rounded-2xl shrink-0 transition-all z-10",
            "group-hover:scale-110",
            accentMap[accent],
            isAppPreview ? "h-11 w-11 shadow-sm" : "h-8 w-8 lg:h-12 lg:w-12",
          )}
        >
          <Icon className={isAppPreview ? "h-5 w-5" : "h-4 w-4 lg:h-6 lg:w-6"} />
        </div>
      </div>

      {/* Decorative gradient blur in app preview */}
      {isAppPreview && (
        <div
          className={cn(
            "absolute -bottom-4 -right-4 w-20 h-20 rounded-full blur-[24px] opacity-20 pointer-events-none",
            accent === "primary"
              ? "bg-primary"
              : accent === "success"
                ? "bg-emerald-500"
                : accent === "destructive"
                  ? "bg-rose-500"
                  : accent === "info"
                    ? "bg-blue-500"
                    : "bg-amber-500",
          )}
        />
      )}
    </Card>
  );
}
