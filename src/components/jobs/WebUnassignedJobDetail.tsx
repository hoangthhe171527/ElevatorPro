import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  mockJobs,
  getCustomer,
  getElevator,
  mockUsers,
  formatDateTime,
  getTechnicianWorkload,
  type Job,
} from "@/lib/mock-data";
import {
  ArrowLeft,
  Building2,
  Calendar,
  User,
  MapPin,
  ClipboardList,
  AlertTriangle,
  UserCheck,
  Briefcase,
  History,
  FileText,
  Hammer,
  Activity,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export function WebUnassignedJobDetail({ job }: { job: Job }) {
  const navigate = useNavigate();
  const customer = getCustomer(job.customerId);
  const elevator = job.elevatorId ? getElevator(job.elevatorId) : undefined;

  const [techId, setTechId] = useState("");
  const [loading, setLoading] = useState(false);

  // Filter technicians based on job type
  const technicians = mockUsers
    .filter((u) => {
      const perms = u.memberships?.flatMap((m) => m.permissions) || [];
      if (job.type === "install") {
        return perms.includes("tech_installation");
      }
      return perms.includes("tech_maintenance");
    })
    .map((u) => ({
      ...u,
      workload: getTechnicianWorkload(u.id),
    }))
    .sort((a, b) => a.workload - b.workload);

  const handleDispatch = async () => {
    if (!techId) {
      toast.error("Vui lòng chọn kỹ thuật viên để phân công");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));

    // Update mock data
    const jobRef = mockJobs.find((j) => j.id === job.id);
    if (jobRef) {
      jobRef.assignedTo = techId;
      jobRef.status = "scheduled";
    }

    setLoading(false);
    toast.success("Đã phân công và gửi thông báo đến kỹ thuật viên thành công!");
    navigate({ to: "/admin/jobs", search: { tab: "maintenance" } });
  };

  const Icon = job.type === "maintenance" ? Activity : job.type === "install" ? Hammer : Briefcase;

  return (
    <AppShell>
      <Link
        to="/admin/jobs"
        search={{ tab: "pending" }}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 font-medium transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Quay lại danh sách chờ phân công
      </Link>

      <div className="mb-6 p-6 rounded-[2rem] bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-xl shadow-orange-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="h-20 w-20 rounded-3xl bg-white/20 backdrop-blur-xl flex items-center justify-center border border-white/30 shadow-inner">
            <AlertTriangle className="h-10 w-10 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge className="bg-white/20 hover:bg-white/30 border-none text-[10px] uppercase font-black tracking-widest text-white px-2 py-0.5">
                Chờ điều phối
              </Badge>
              <span className="text-white/70 font-mono text-xs">{job.code}</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight">{job.title}</h1>
            <p className="text-orange-50/80 font-medium mt-1 italic">
              Công việc này chưa có kỹ thuật viên phụ trách. Cần xem xét chi tiết và gán nhân sự
              ngay.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left: Job & Tech Details */}
        <div className="lg:col-span-8 space-y-6">
          {/* Main Info Card */}
          <Card className="p-8 border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] bg-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
              <Briefcase className="h-48 w-48 text-slate-900" />
            </div>

            <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-8 flex items-center gap-2">
              <ClipboardList className="h-4 w-4" /> Chi tiết công việc hệ thống
            </h2>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-6">
                <div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                    Phân loại
                  </div>
                  <div className="flex items-center gap-2 text-slate-800 font-bold">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <Icon className="h-4 w-4" />
                    </div>
                    {job.type === "maintenance"
                      ? "Bảo trì định kỳ"
                      : job.type === "install"
                        ? "Lắp đặt thi công"
                        : "Dịch vụ kỹ thuật"}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                    Độ ưu tiên
                  </div>
                  <Badge
                    variant={job.priority === "urgent" ? "destructive" : "secondary"}
                    className="px-3 py-1 font-black text-[10px] uppercase"
                  >
                    {job.priority === "urgent" ? "KHẨN CẤP" : "BÌNH THƯỜNG"}
                  </Badge>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                    Nguồn gốc phát sinh
                  </div>
                  <div className="flex items-center gap-2 text-slate-800 font-bold">
                    <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600">
                      <FileText className="h-4 w-4" />
                    </div>
                    {job.contractId ? `Hợp đồng: ${job.contractId}` : "Tự động từ hệ thống"}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                    Ngày dự kiến bắt đầu
                  </div>
                  <div className="flex items-center gap-2 text-slate-800 font-bold">
                    <Calendar className="h-4 w-4 text-orange-500" />
                    {formatDateTime(job.scheduledFor)}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                Mô tả yêu cầu
              </div>
              <p className="text-slate-600 leading-relaxed font-medium">
                {job.description ||
                  "Hệ thống tự động sinh công việc dựa trên lịch bảo trì của hợp đồng. Cần kiểm tra đầy đủ các hạng mục theo tiêu chuẩn kỹ thuật."}
              </p>
            </div>
          </Card>

          {/* Customer & Asset Card */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 border-none shadow-xl shadow-slate-200/50 rounded-[2rem] bg-white">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-5">
                Hồ sơ Khách hàng
              </h3>
              {customer ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black">
                      {customer.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-black text-slate-800">{customer.name}</div>
                      <div className="text-xs text-slate-500 font-medium">
                        Khách hàng truyền thống
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" /> {customer.address}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                      <User className="h-3.5 w-3.5 text-slate-400" /> {customer.contactPerson} ·{" "}
                      {customer.phone}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-400 italic">
                  Không tìm thấy thông tin khách hàng.
                </div>
              )}
            </Card>

            <Card className="p-6 border-none shadow-xl shadow-slate-200/50 rounded-[2rem] bg-slate-900 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12">
                <Building2 className="h-24 w-24" />
              </div>
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-5">
                Thông số thiết bị
              </h3>
              {elevator ? (
                <div className="space-y-4 relative z-10">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-primary shadow-inner">
                      <History className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                        Mã định danh
                      </div>
                      <div className="font-black text-lg font-mono text-white">{elevator.code}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                      <div className="text-[9px] text-slate-500 font-black uppercase mb-1">
                        Thương hiệu
                      </div>
                      <div className="text-xs font-bold">{elevator.brand}</div>
                    </div>
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                      <div className="text-[9px] text-slate-500 font-black uppercase mb-1">
                        Số tầng
                      </div>
                      <div className="text-xs font-bold">{elevator.floors} Tầng</div>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-2">
                    <MapPin className="h-3 w-3" /> {elevator.building}
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-500 italic">
                  Không tìm thấy thông tin thiết bị.
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Right: Dispatch Panel */}
        <div className="lg:col-span-4">
          <Card className="p-8 border-none shadow-2xl shadow-primary/20 rounded-[2.5rem] bg-white sticky top-6">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
              <UserCheck className="h-8 w-8" />
            </div>

            <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-2">
              Bảng điều phối
            </h3>
            <p className="text-slate-500 text-sm font-medium mb-8 leading-relaxed">
              Hệ thống lọc danh sách kỹ thuật viên chuyên trách loại hình{" "}
              <span className="text-primary font-bold">
                "{job.type === "install" ? "Lắp đặt" : "Bảo trì"}"
              </span>
              .
            </p>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Chọn kỹ thuật viên phù hợp <span className="text-destructive">*</span>
                </label>
                <Select value={techId} onValueChange={setTechId}>
                  <SelectTrigger className="h-14 rounded-2xl border-slate-200 focus:ring-primary shadow-sm bg-slate-50/50">
                    <SelectValue placeholder="Chọn từ danh sách đội nhóm..." />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
                    {technicians.map((u, idx) => (
                      <SelectItem
                        key={u.id}
                        value={u.id}
                        className="py-3 focus:bg-primary/5 rounded-xl"
                      >
                        <div className="flex flex-col gap-0.5">
                          <span className="font-black text-slate-800 text-sm">
                            {u.name} {idx === 0 && "🏆"}
                          </span>
                          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">
                            Tải trọng: {u.workload} việc đang làm
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="p-5 rounded-3xl bg-blue-50/50 border border-blue-100 flex items-start gap-4">
                <Info className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
                <p className="text-[11px] text-blue-700 leading-relaxed font-medium">
                  Việc phân công sẽ kích hoạt gửi thông báo đẩy (Push Notification) đến thợ và
                  chuyển trạng thái công việc sang "Đã lên lịch".
                </p>
              </div>

              <Button
                onClick={handleDispatch}
                disabled={loading}
                className="w-full h-16 rounded-[1.5rem] bg-primary hover:bg-primary/90 text-white font-black text-lg shadow-xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
              >
                {loading ? "ĐANG XỬ LÝ..." : "XÁC NHẬN PHÂN CÔNG"}
              </Button>

              <div className="flex items-center justify-center gap-2 text-slate-400">
                <History className="h-3 w-3" />
                <span className="text-[9px] font-bold uppercase tracking-widest">
                  Dữ liệu thời gian thực
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
