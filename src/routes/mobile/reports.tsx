import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/layout/MobileShell";
import { formatVND } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Briefcase,
  Calendar,
  ChevronRight,
  Filter,
  DollarSign,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/mobile/reports")({
  head: () => ({ meta: [{ title: "Báo cáo — Mobile" }] }),
  component: MobileReports,
});

function MobileReports() {
  const kpis = [
    {
      label: "Doanh thu tháng này",
      value: "3.450.000.000đ",
      trend: "+12.5%",
      color: "text-emerald-600",
      icon: DollarSign,
    },
    {
      label: "Việc đã hoàn thành",
      value: "128",
      trend: "+8.2%",
      color: "text-blue-600",
      icon: Briefcase,
    },
    {
      label: "KH mới tháng này",
      value: "45",
      trend: "-2.4%",
      color: "text-orange-600",
      icon: Users,
    },
  ];

  return (
          <Filter className="h-3 w-3" /> Lọc kỳ
        </Button>
      </div>

      <div className="p-6 space-y-8">
        <div className="grid grid-cols-1 gap-4">
          {kpis.map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <Card
                key={idx}
                className="p-5 border-none shadow-sm flex items-center justify-between bg-white rounded-[2rem] active:scale-95 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-[1.25rem] bg-slate-50 flex items-center justify-center text-slate-500">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">
                      {kpi.label}
                    </p>
                    <p className="text-xl font-black mt-1 text-slate-900">{kpi.value}</p>
                  </div>
                </div>
                <div
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black",
                    kpi.trend.startsWith("+") ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-600"
                  )}
                >
                  {kpi.trend.startsWith("+") ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {kpi.trend}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Revenue Chart Simulation */}
        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-xs font-bold uppercase text-muted-foreground">
              Tình hình doanh thu
            </h3>
            <span className="text-[10px] text-muted-foreground font-mono">7 NGÀY QUA</span>
          </div>
          <Card className="p-5 border-none shadow-sm bg-white overflow-hidden">
            <div className="h-40 flex items-end justify-between gap-2 px-1">
              {[40, 65, 45, 80, 55, 90, 75].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <div
                    className="w-full bg-primary/20 rounded-t-lg relative transition-all group-hover:bg-primary/40"
                    style={{ height: `${h}%` }}
                  >
                    <div className="absolute top-0 left-0 w-full h-[3px] bg-primary rounded-full shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
                  </div>
                  <span className="text-[8px] font-bold text-slate-400">T{i + 2}</span>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* Job Breakdown Section */}
        <section>
          <h3 className="text-xs font-bold uppercase text-muted-foreground mb-3 px-1">
            Phân bổ công việc
          </h3>
          <Card className="p-5 border-none shadow-sm bg-white">
            <div className="space-y-4">
              {[
                { label: "Bảo trì định kỳ", value: 65, color: "bg-blue-500" },
                { label: "Sửa chữa khẩn cấp", value: 15, color: "bg-orange-500" },
                { label: "Lắp đặt mới", value: 12, color: "bg-emerald-500" },
                { label: "Khác", value: 8, color: "bg-slate-300" },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center text-[10px] font-bold mb-1.5 uppercase">
                    <span className="text-slate-600">{item.label}</span>
                    <span className="text-slate-900">{item.value}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all duration-1000", item.color)}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <Button
              variant="ghost"
              className="w-full text-[10px] font-bold text-primary mt-6 h-8 bg-slate-50"
            >
              XEM DỮ LIỆU CHI TIẾT <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          </Card>
        </section>
      </div>
    </MobileShell>
  );
}
