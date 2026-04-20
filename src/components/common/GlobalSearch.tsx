// src/components/common/GlobalSearch.tsx
// =====================================================================
// GLOBAL SEARCH — thay thế Input dummy trong AppShell
// =====================================================================
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { mockCustomers, mockContracts, mockJobs, mockElevators, mockLeads } from "@/lib/mock-data";
import { Search, Users, FileText, Briefcase, Building2, UserCog, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchResult {
  id: string;
  label: string;
  sublabel: string;
  href: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
}

function buildResults(q: string): SearchResult[] {
  if (!q || q.length < 2) return [];
  const lq = q.toLowerCase();
  const results: SearchResult[] = [];

  mockCustomers
    .filter((c) => c.name.toLowerCase().includes(lq) || c.phone.includes(lq))
    .slice(0, 3)
    .forEach((c) =>
      results.push({
        id: c.id,
        label: c.name,
        sublabel: c.phone,
        href: `/admin/customers/${c.id}`,
        category: "Khách hàng",
        icon: Users,
      }),
    );

  mockLeads
    .filter((l) => l.name.toLowerCase().includes(lq) || l.phone.includes(lq))
    .slice(0, 2)
    .forEach((l) =>
      results.push({
        id: l.id,
        label: l.name,
        sublabel: l.phone,
        href: "/admin/leads",
        category: "Lead",
        icon: UserCog,
      }),
    );

  mockContracts
    .filter((c) => c.code.toLowerCase().includes(lq))
    .slice(0, 3)
    .forEach((c) =>
      results.push({
        id: c.id,
        label: c.code,
        sublabel: `Hợp đồng · ${c.type}`,
        href: `/admin/contracts/${c.id}`,
        category: "Hợp đồng",
        icon: FileText,
      }),
    );

  mockJobs
    .filter((j) => j.title.toLowerCase().includes(lq) || j.code.toLowerCase().includes(lq))
    .slice(0, 3)
    .forEach((j) =>
      results.push({
        id: j.id,
        label: j.title,
        sublabel: j.code,
        href: `/admin/jobs/${j.id}`,
        category: "Công việc",
        icon: Briefcase,
      }),
    );

  mockElevators
    .filter((e) => e.code.toLowerCase().includes(lq) || e.building.toLowerCase().includes(lq))
    .slice(0, 2)
    .forEach((e) =>
      results.push({
        id: e.id,
        label: e.code,
        sublabel: e.building,
        href: `/admin/elevators/${e.id}`,
        category: "Thang máy",
        icon: Building2,
      }),
    );

  return results.slice(0, 8);
}

export function GlobalSearch() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const results = buildResults(q);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      setActiveIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && activeIdx >= 0) {
      navigate({ to: results[activeIdx].href });
      setOpen(false);
      setQ("");
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const handleSelect = (href: string) => {
    navigate({ to: href });
    setOpen(false);
    setQ("");
  };

  return (
    <div ref={containerRef} className="flex-1 max-w-md relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      <Input
        ref={inputRef}
        placeholder="Tìm khách hàng, hợp đồng, công việc... (Ctrl+K)"
        className="pl-9 pr-8 bg-muted/50 border-0"
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
          setActiveIdx(-1);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
      />
      {q && (
        <button
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          onClick={() => {
            setQ("");
            inputRef.current?.focus();
          }}
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}

      {open && results.length > 0 && (
        <div className="absolute top-full mt-1 left-0 right-0 z-50 bg-background border rounded-lg shadow-lg overflow-hidden">
          {results.map((r, i) => {
            const Icon = r.icon;
            return (
              <button
                key={r.id}
                onMouseDown={() => handleSelect(r.href)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-muted/60 transition-colors",
                  i === activeIdx && "bg-muted/60",
                )}
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{r.label}</div>
                  <div className="text-xs text-muted-foreground">{r.sublabel}</div>
                </div>
                <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded shrink-0">
                  {r.category}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {open && q.length >= 2 && results.length === 0 && (
        <div className="absolute top-full mt-1 left-0 right-0 z-50 bg-background border rounded-lg shadow-lg p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Không tìm thấy kết quả cho "<span className="font-medium">{q}</span>"
          </p>
        </div>
      )}
    </div>
  );
}
