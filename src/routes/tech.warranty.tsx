import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockJobs, getCustomer, formatDate } from "@/lib/mock-data";
import { ShieldCheck, Calendar, ArrowRight, Clock, MapPin, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tech/warranty")({
  component: TechWarrantyPage,
});

function TechWarrantyPage() {
  // Filter jobs for warranty assigned to tech
  const warrantyJobs = mockJobs.filter((j) => j.type === "warranty");

  return (
    <AppShell>
      <PageHeader
        title="Lịch Bảo hành & Bảo trì"
        description="Danh sách các thang máy đang trong chế độ bảo hành cần kiểm tra định kỳ."
      />

      <div className="grid grid-cols-1 gap-4">
        {warrantyJobs.map((job) => {
          const customer = getCustomer(job.customerId);
          return (
            <Card
              key={job.id}
              className="rounded-2xl border-none shadow-sm hover:shadow-md transition-all overflow-hidden"
            >
              <CardContent className="p-0">
                <div className="p-4 bg-emerald-50 border-b flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    <span className="text-[10px] font-black uppercase text-emerald-700 tracking-widest">
                      Gói bảo hành Gold
                    </span>
                  </div>
                  <Badge
                    className={cn(
                      "px-2 py-0.5 rounded-lg font-black text-[9px] uppercase",
                      job.status === "completed"
                        ? "bg-emerald-500 text-white"
                        : "bg-white text-emerald-600 border-emerald-200",
                    )}
                  >
                    {job.status === "completed" ? "Đã hoàn thành" : "Đang chờ"}
                  </Badge>
                </div>
                <div className="p-6 flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="font-black text-slate-900 text-lg">{job.title}</h4>
                    <div className="text-sm font-bold text-slate-500 flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {customer?.name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {formatDate(job.scheduledFor)}
                      </span>
                    </div>
                  </div>
                  <Link to="/tech/jobs/$jobId" params={{ jobId: job.id }}>
                    <Button className="rounded-xl bg-emerald-600 hover:bg-emerald-700 font-black text-[10px] uppercase gap-2">
                      Mở Checklist <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {warrantyJobs.length === 0 && (
          <div className="py-20 text-center">
            <CheckCircle2 className="h-12 w-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 font-bold">Bạn không có lịch bảo hành nào hôm nay</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
