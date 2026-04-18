import { projectLatLng, type OptimizedRoute } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface RouteMapProps {
  routes: { id: string; color: string; label: string; route: OptimizedRoute }[];
  highlightJobId?: string;
  className?: string;
  height?: number;
}

// SVG bản đồ đơn giản hoá khu vực Hà Nội: hiển thị các tuyến đường tối ưu
// cho 1 hoặc nhiều kỹ thuật viên cùng lúc.
export function RouteMap({ routes, highlightJobId, className, height = 360 }: RouteMapProps) {
  const W = 800;
  const H = height;

  return (
    <div
      className={cn("relative rounded-xl border overflow-hidden", className)}
      style={{ background: "var(--map-bg)" }}
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full block" preserveAspectRatio="xMidYMid meet">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--border)" strokeWidth="0.5" opacity="0.6" />
          </pattern>
          <pattern id="grid-major" width="160" height="160" patternUnits="userSpaceOnUse">
            <path d="M 160 0 L 0 0 0 160" fill="none" stroke="var(--border)" strokeWidth="1" opacity="0.8" />
          </pattern>
        </defs>
        <rect width={W} height={H} fill="url(#grid)" />
        <rect width={W} height={H} fill="url(#grid-major)" />

        {/* Sông trang trí (gợi nhớ sông Hồng) */}
        <path
          d={`M ${W * 0.55} 0 Q ${W * 0.62} ${H * 0.3}, ${W * 0.7} ${H * 0.55} T ${W * 0.85} ${H}`}
          stroke="var(--primary)"
          strokeOpacity="0.18"
          strokeWidth="22"
          fill="none"
          strokeLinecap="round"
        />

        {/* Render các tuyến */}
        {routes.map((r) => {
          const baseP = projectLatLng(r.route.base.lat, r.route.base.lng, W, H);
          const stopPts = r.route.stops.map((s) => projectLatLng(s.lat, s.lng, W, H));
          const pathPts = [baseP, ...stopPts];
          const d = pathPts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
          return (
            <g key={r.id}>
              <path
                d={d}
                stroke={r.color}
                strokeWidth={3}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="6 4"
                opacity={0.8}
              />
              {/* Base marker */}
              <g transform={`translate(${baseP.x}, ${baseP.y})`}>
                <rect x={-9} y={-9} width={18} height={18} rx={3} fill={r.color} />
                <text x={0} y={3} textAnchor="middle" fontSize="10" fontWeight="700" fill="white">B</text>
              </g>
              {/* Stop markers */}
              {stopPts.map((p, i) => {
                const stop = r.route.stops[i];
                const isHi = stop.jobId === highlightJobId;
                return (
                  <g key={stop.jobId} transform={`translate(${p.x}, ${p.y})`}>
                    {isHi && (
                      <circle r={18} fill={r.color} opacity={0.25}>
                        <animate attributeName="r" values="14;22;14" dur="1.6s" repeatCount="indefinite" />
                      </circle>
                    )}
                    <circle r={isHi ? 13 : 11} fill={r.color} stroke="white" strokeWidth={2} />
                    <text x={0} y={4} textAnchor="middle" fontSize="11" fontWeight="700" fill="white">
                      {i + 1}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-2 left-2 right-2 flex flex-wrap gap-2 rounded-md bg-background/90 backdrop-blur px-2.5 py-1.5 text-[11px] shadow-sm">
        {routes.map(r => (
          <div key={r.id} className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: r.color }} />
            <span className="font-medium">{r.label}</span>
            <span className="text-muted-foreground">
              {r.route.stops.length} điểm · {r.route.totalKm.toFixed(1)} km · {r.route.totalMinutes} phút
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
