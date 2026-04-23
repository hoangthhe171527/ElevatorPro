import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, description, actions }: Props) {
  const isAppPreview = useAppStore((s) => s.isAppPreview);
  const showDesc = !isAppPreview;

  return (
    <div
      className={cn(
        "flex flex-col gap-3 mb-4 lg:mb-6",
        isAppPreview ? "px-2 mb-6" : "sm:flex-row sm:items-center sm:justify-between",
      )}
    >
      <div
        className={cn(
          "flex flex-row justify-between items-end",
          isAppPreview ? "" : "flex-col sm:items-start",
        )}
      >
        <h1
          className={cn(
            "font-black tracking-tight text-slate-900",
            isAppPreview
              ? "text-3xl tracking-tighter"
              : "text-xl lg:text-2xl uppercase lg:normal-case",
          )}
        >
          {title}
        </h1>
        {isAppPreview && actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      {description && showDesc && (
        <p className="text-[10px] lg:text-sm text-slate-400 font-bold uppercase lg:normal-case mt-0.5 lg:mt-1">
          {description}
        </p>
      )}
      {!isAppPreview && actions && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">{actions}</div>
      )}
    </div>
  );
}
