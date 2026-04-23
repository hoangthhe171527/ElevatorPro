import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockJobs, getCustomer, formatDate, formatVND } from "@/lib/mock-data";
import {
  Wrench,
  AlertTriangle,
  Clock,
  ArrowRight,
  Search,
  Plus,
  Zap,
  CheckCircle2,
  Package,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/repairs")({
  component: AdminRepairsPage,
});

function AdminRepairsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter jobs for repair and incident
  const repairJobs = mockJobs.filter((j) => j.type === "repair" || j.type === "incident");

  return (
    <AppShell>
      <PageHeader
        title="Quản lý Sửa chữa & Sự cố"
        description="Xử lý báo lỗi hỏng hóc, duyệt báo giá vật tư và điều phối thợ."
        actions={
          <Button className="gap-2 rounded-xl bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-200">
            <Plus className="h-4 w-4" /> Tạo phiếu Sửa chữa
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
        <Card className="rounded-[2rem] border-none shadow-xl shadow-slate-200/50 p-6 bg-orange-500 text-white">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center">
              <Zap className="h-6 w-6" />
            </div>
            <div>
              <div className="text-3xl font-black">
                {repairJobs.filter((j) => j.status !== "completed").length}
              </div>
              <div className="text-[10px] font-bold uppercase opacity-80">Sự cố đang xử lý</div>
            </div>
          </div>
        </Card>

        <Card className="rounded-[2rem] border-none shadow-xl shadow-slate-200/50 p-6 bg-slate-900 text-white">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <div className="text-3xl font-black">
                {repairJobs.filter((j) => j.status === "payment_pending").length}
              </div>
              <div className="text-[10px] font-bold uppercase opacity-80">Báo giá chờ duyệt</div>
            </div>
          </div>
        </Card>

        <Card className="rounded-[2rem] border-none shadow-xl shadow-slate-200/50 p-6 bg-white">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <div className="text-3xl font-black text-slate-900">1</div>
              <div className="text-[10px] font-black uppercase text-slate-400">
                Sự cố khẩn cấp (HOTLINE)
              </div>
            </div>
          </div>
        </Card>

        <Card className="rounded-[2rem] border-none shadow-xl shadow-slate-200/50 p-6 bg-white">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <div className="text-3xl font-black text-slate-900">45m</div>
              <div className="text-[10px] font-black uppercase text-slate-400">
                Thời gian phản hồi TB
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black flex items-center gap-3">
            <Wrench className="h-6 w-6 text-primary" /> Danh sách phiếu Sửa chữa
          </h3>
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Tìm khách hàng, thợ xử lý..."
              className="pl-10 rounded-xl border-slate-100 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {repairJobs.map((job) => {
            const customer = getCustomer(job.customerId);
            return (
              <Card
                key={job.id}
                className="rounded-2xl border-none shadow-sm hover:shadow-md transition-all overflow-hidden border-l-4 border-l-orange-500"
              >
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex gap-6 items-center">
                    <div
                      className={cn(
                        "h-14 w-14 rounded-2xl flex items-center justify-center shrink-0",
                        job.status === "payment_pending"
                          ? "bg-amber-100 text-amber-600"
                          : "bg-slate-100 text-slate-400",
                      )}
                    >
                      {job.status === "payment_pending" ? (
                        <Package className="h-6 w-6" />
                      ) : (
                        <Wrench className="h-6 w-6" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-black text-slate-900 text-lg">{job.title}</h4>
                        <Badge
                          className={cn(
                            "px-2 py-0.5 rounded-lg font-black text-[9px] uppercase",
                            job.status === "payment_pending"
                              ? "bg-amber-500 text-white"
                              : "bg-slate-200 text-slate-600",
                          )}
                        >
                          {job.status === "payment_pending" ? "Chờ duyệt báo giá" : job.status}
                        </Badge>
                        {job.isHotline && (
                          <Badge className="bg-red-500 text-white font-black text-[9px] uppercase animate-pulse">
                            Hotline
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm font-bold text-slate-500 flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {customer?.name}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {formatDate(job.scheduledFor)}
                        </span>
                        {job.repairQuote && (
                          <span className="text-primary font-black ml-2">
                            Dự chi: {formatVND(job.repairQuote.total)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Link to="/admin/jobs/$jobId" params={{ jobId: job.id }}>
                      <Button
                        variant="outline"
                        className="rounded-xl font-black text-[10px] uppercase gap-2 hover:bg-slate-900 hover:text-white transition-all"
                      >
                        Chi tiết & Phê duyệt <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}

function MapPin({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
