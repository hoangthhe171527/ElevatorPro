import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockJobs, mockElevators, getCustomer, formatDate } from "@/lib/mock-data";
import {
  ShieldCheck,
  Calendar,
  Clock,
  ArrowRight,
  Search,
  Plus,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/warranty")({
  component: AdminWarrantyPage,
});

function AdminWarrantyPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter jobs for warranty
  const warrantyJobs = mockJobs.filter((j) => j.type === "warranty");

  // elevators under warranty
  const elevatorsInWarranty = mockElevators.filter((e) => new Date(e.warrantyUntil) > new Date());

  return (
    <AppShell>
      <PageHeader
        title="Quản lý Bảo hành"
        description="Theo dõi định kỳ và tình trạng bảo hành của thiết bị."
        actions={
          <Button className="gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200">
            <Plus className="h-4 w-4" /> Lập lịch Bảo hành
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
        <Card className="rounded-[2rem] border-none shadow-xl shadow-slate-200/50 p-6 bg-emerald-500 text-white">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="text-3xl font-black">{elevatorsInWarranty.length}</div>
              <div className="text-[10px] font-bold uppercase opacity-80">Thang đang bảo hành</div>
            </div>
          </div>
        </Card>

        <Card className="rounded-[2rem] border-none shadow-xl shadow-slate-200/50 p-6 bg-slate-900 text-white">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <div className="text-3xl font-black">
                {warrantyJobs.filter((j) => j.status === "pending").length}
              </div>
              <div className="text-[10px] font-bold uppercase opacity-80">Lịch bảo trì sắp tới</div>
            </div>
          </div>
        </Card>

        <Card className="rounded-[2rem] border-none shadow-xl shadow-slate-200/50 p-6 bg-white">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div>
              <div className="text-3xl font-black text-slate-900">2</div>
              <div className="text-[10px] font-black uppercase text-slate-400">
                Sắp hết hạn (30 ngày)
              </div>
            </div>
          </div>
        </Card>

        <Card className="rounded-[2rem] border-none shadow-xl shadow-slate-200/50 p-6 bg-white">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <div className="text-3xl font-black text-slate-900">98%</div>
              <div className="text-[10px] font-black uppercase text-slate-400">
                Tỉ lệ đạt chuẩn vận hành
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black flex items-center gap-3">
            <Clock className="h-6 w-6 text-primary" /> Lịch trình Bảo trì Bảo hành
          </h3>
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Tìm khách hàng, mã thang..."
              className="pl-10 rounded-xl border-slate-100 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {warrantyJobs.map((job) => {
            const customer = getCustomer(job.customerId);
            return (
              <Card
                key={job.id}
                className="rounded-[2rem] border-none shadow-lg shadow-slate-200/40 hover:shadow-xl transition-all overflow-hidden group"
              >
                <CardContent className="p-0">
                  <div className="p-6 bg-slate-50 border-b flex justify-between items-center">
                    <Badge
                      className={cn(
                        "px-3 py-1 rounded-lg font-black text-[10px] uppercase",
                        job.status === "completed"
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-blue-100 text-blue-600",
                      )}
                    >
                      {job.status === "completed" ? "Đã hoàn thành" : "Sắp tới"}
                    </Badge>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {job.code}
                    </span>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <h4 className="font-black text-slate-900 text-lg group-hover:text-primary transition-colors">
                        {job.title}
                      </h4>
                      <div className="text-xs font-bold text-slate-500 mt-1 flex items-center gap-2">
                        <MapPin className="h-3 w-3" /> {customer?.name}
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <span className="text-sm font-bold text-slate-700">
                          {formatDate(job.scheduledFor)}
                        </span>
                      </div>
                      <Link to="/admin/jobs/$jobId" params={{ jobId: job.id }}>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="rounded-xl font-black text-[10px] uppercase gap-2 hover:bg-primary hover:text-white"
                        >
                          Chi tiết <ArrowRight className="h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
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
