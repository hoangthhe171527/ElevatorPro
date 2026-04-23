import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  mockJobs, 
  getCustomer, 
  formatDate,
} from "@/lib/mock-data";
import {
  Wrench,
  AlertTriangle,
  ArrowRight,
  Clock,
  MapPin,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tech/repairs")({
  component: TechRepairsPage,
});

function TechRepairsPage() {
  // Filter jobs for repair and incident assigned to tech
  const repairJobs = mockJobs.filter(j => j.type === "repair" || j.type === "incident");

  return (
    <AppShell>
      <PageHeader
        title="Sửa chữa & Khắc phục sự cố"
        description="Xử lý các yêu cầu sửa chữa, báo giá linh kiện và báo cáo hiện trường."
      />

      <div className="grid grid-cols-1 gap-4">
         {repairJobs.map(job => {
           const customer = getCustomer(job.customerId);
           return (
             <Card key={job.id} className="rounded-2xl border-none shadow-sm hover:shadow-md transition-all overflow-hidden border-l-4 border-l-orange-500">
                <CardContent className="p-0">
                   <div className="p-4 bg-orange-50 border-b flex justify-between items-center">
                      <div className="flex items-center gap-2">
                         <Zap className="h-4 w-4 text-orange-600" />
                         <span className="text-[10px] font-black uppercase text-orange-700 tracking-widest">
                           {job.type === 'incident' ? 'Sự cố khẩn cấp' : 'Sửa chữa định kỳ'}
                         </span>
                      </div>
                      <Badge className={cn(
                        "px-2 py-0.5 rounded-lg font-black text-[9px] uppercase",
                        job.status === 'payment_pending' ? "bg-amber-500 text-white" : "bg-white text-orange-600 border-orange-200"
                      )}>
                         {job.status === 'payment_pending' ? 'Đã gửi báo giá' : 'Đang xử lý'}
                      </Badge>
                   </div>
                   <div className="p-6 flex items-center justify-between">
                      <div className="space-y-1">
                         <div className="flex items-center gap-2">
                            <h4 className="font-black text-slate-900 text-lg">{job.title}</h4>
                            {job.isHotline && <Badge className="bg-red-500 text-white font-black text-[9px] animate-pulse">HOTLINE</Badge>}
                         </div>
                         <div className="text-sm font-bold text-slate-500 flex items-center gap-4">
                            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {customer?.name}</span>
                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {formatDate(job.scheduledFor)}</span>
                         </div>
                      </div>
                      <Link to="/tech/jobs/$jobId" params={{ jobId: job.id }}>
                         <Button className="rounded-xl bg-orange-500 hover:bg-orange-600 font-black text-[10px] uppercase gap-2">
                            Báo lỗi & Vật tư <ArrowRight className="h-4 w-4" />
                         </Button>
                      </Link>
                   </div>
                </CardContent>
             </Card>
           );
         })}
      </div>
    </AppShell>
  );
}
