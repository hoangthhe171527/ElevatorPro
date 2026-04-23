import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  mockContracts,
  mockJobs,
  getCustomer,
  getElevator,
  formatVND,
  formatDate,
  type Contract,
  type Job,
} from "@/lib/mock-data";
import {
  ShieldCheck,
  AlertTriangle,
  Search,
  Calendar,
  User,
  Activity,
  ChevronRight,
  Phone,
  RefreshCw,
  Plus,
  ArrowRightLeft,
} from "lucide-react";
import { StatusBadge } from "@/components/common/StatusBadge";;
import { toast } from "sonner";
import { CreateContractModal, CreateJobModal } from "@/components/common/Modals";
import { useAppStore } from "@/lib/store";

export const Route = createFileRoute("/admin/maintenance/")({
  head: () => ({ meta: [{ title: "Giám sát Bảo trì — ElevatorPro" }] }),
  component: MaintenanceOversightPage,
});

function MaintenanceOversightPage() {
  const [search, setSearch] = useState("");
  const [renewContractOpen, setRenewContractOpen] = useState(false);
  const [renewCustomerId, setRenewCustomerId] = useState("");
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const today = new Date();

  const maintenanceContracts = useMemo(() => {
    return mockContracts.filter((c) => c.type === "maintenance");
  }, []);

  const enrichedContracts = useMemo(() => {
    return maintenanceContracts
      .map((c) => {
        const cus = getCustomer(c.customerId);
        const elev = c.elevatorId ? getElevator(c.elevatorId) : undefined;

        // Find the most recent maintenance job for this contract
        const latestJob = [...mockJobs]
          .filter(
            (j) => j.contractId === c.id && (j.type === "maintenance" || j.type === "warranty"),
          )
          .sort(
            (a, b) => new Date(b.scheduledFor).getTime() - new Date(a.scheduledFor).getTime(),
          )[0];

        // Calculate progress if there's a job
        let progress = 0;
        if (latestJob && latestJob.maintenanceSteps) {
          const total = latestJob.maintenanceSteps.length;
          const resolved = latestJob.maintenanceSteps.filter((s) => s.resolved).length;
          progress = (resolved / total) * 100;
        }

        // Check expiration
        const expiry = new Date(c.endDate);
        const diffTime = expiry.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return {
          ...c,
          customerName: cus?.name || "N/A",
          elevatorCode: elev?.code || "N/A",
          elevatorModel: elev?.model || "N/A",
          latestJob,
          progress,
          daysToExpiry: diffDays,
          isExpiringSoon: diffDays > 0 && diffDays <= 15,
          isExpired: diffDays <= 0,
        };
      })
      .filter(
        (c) =>
          c.code.toLowerCase().includes(search.toLowerCase()) ||
          c.customerName.toLowerCase().includes(search.toLowerCase()) ||
          c.elevatorCode.toLowerCase().includes(search.toLowerCase()),
      );
  }, [search, maintenanceContracts, today]);

  const stats = {
    total: maintenanceContracts.length,
    expiring: enrichedContracts.filter((c) => c.isExpiringSoon).length,
    activeWork: enrichedContracts.filter((c) => c.latestJob && c.latestJob.status === "in_progress")
      .length,
    waitingMaterials: enrichedContracts.filter(
      (c) => c.latestJob && c.latestJob.status === "waiting_for_materials",
    ).length,
  };

  return (
    <>
      <AppShell>
        <PageHeader
          title="Giám sát Bảo trì"
          description="Theo dõi tình trạng hợp đồng và tiến độ thực hiện bảo trì định kỳ"
        />

        {/* KPI DASHBOARD */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          <StatsCard title="Tổng HĐ Bảo trì" value={stats.total} icon={ShieldCheck} color="blue" />
          <StatsCard
            title="Sắp hết hạn (15 ngày)"
            value={stats.expiring}
            icon={AlertTriangle}
            color={stats.expiring > 0 ? "rose" : "emerald"}
            highlight={stats.expiring > 0}
          />
          <StatsCard
            title="Đang thực hiện"
            value={stats.activeWork}
            icon={Activity}
            color="indigo"
          />
          <StatsCard
            title="Chờ vật tư"
            value={stats.waitingMaterials}
            icon={ArrowRightLeft}
            color="orange"
          />
        </div>

        {/* FILTERS */}
        <Card className="mb-6 p-4 border-muted/60">
          <div className="relative group max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Tìm theo mã HĐ, tên khách hàng hoặc mã thang..."
              className="pl-9 h-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </Card>

        {/* MAIN LIST */}
        <div className="grid gap-4">
          {enrichedContracts.map((c) => (
            <Card
              key={c.id}
              className={`overflow-hidden border-l-4 transition-all hover:shadow-md ${c.isExpiringSoon ? "border-l-rose-500" : c.isExpired ? "border-l-destructive" : "border-l-primary"}`}
            >
              <div className="p-5 flex flex-col lg:flex-row gap-6 lg:items-center">
                {/* Basic Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="font-mono text-[10px]">
                      {c.code}
                    </Badge>
                    {c.isExpiringSoon && (
                      <Badge className="bg-rose-500 text-white animate-pulse">
                        Sắp hết hạn ({c.daysToExpiry} ngày)
                      </Badge>
                    )}
                    {c.isExpired && <Badge variant="destructive">Đã hết hạn</Badge>}
                  </div>
                  <h3 className="font-bold text-lg leading-none mb-1">{c.customerName}</h3>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className="font-medium text-foreground">{c.elevatorCode}</span> •{" "}
                    {c.elevatorModel}
                  </div>
                </div>

                {/* Progress Tracker */}
                <div className="lg:w-64">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider mb-1.5">
                    <span className="text-muted-foreground">Lượt bảo trì hiện tại</span>
                    <span className={c.progress === 100 ? "text-success" : "text-primary"}>
                      {c.latestJob ? `${Math.round(c.progress)}%` : "Chưa tạo việc"}
                    </span>
                  </div>
                  <Progress
                    value={c.progress}
                    className={`h-2 ${c.progress === 100 ? "[&>div]:bg-success" : ""}`}
                  />
                  <div className="mt-2 text-[10px] flex items-center justify-between text-muted-foreground">
                    <span>
                      Trạng thái: <strong>{c.latestJob?.status || "N/A"}</strong>
                    </span>
                    {c.latestJob && <span>Thợ: {c.latestJob.assignedTo}</span>}
                  </div>
                </div>

                {/* Dates & Financials */}
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 lg:text-right min-w-[150px]">
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase font-bold">
                      Ngày hết hạn
                    </div>
                    <div className={`text-sm font-bold ${c.isExpiringSoon ? "text-rose-600" : ""}`}>
                      {formatDate(c.endDate)}
                    </div>
                  </div>
                  <div className="lg:mt-1">
                    <div className="text-[10px] text-muted-foreground uppercase font-bold">
                      Giá trị HĐ
                    </div>
                    <div className="text-sm font-bold text-primary">{formatVND(c.value)}</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 lg:flex-col shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 lg:w-32"
                    onClick={() => toast.info(`Liên hệ khách hàng: ${c.customerName}`)}
                  >
                    <Phone className="h-3.5 w-3.5 mr-1.5" /> Gọi điện
                  </Button>
                  {c.isExpiringSoon && (
                    <Button
                      size="sm"
                      className="flex-1 lg:w-32 bg-rose-600 hover:bg-rose-700"
                      onClick={() => {
                        setRenewCustomerId(c.customerId);
                        setRenewContractOpen(true);
                      }}
                    >
                      <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Tái ký ngay
                    </Button>
                  )}
                  {!c.latestJob || c.latestJob.status === "completed" ? (
                    <Button
                      size="sm"
                      className="flex-1 lg:w-32"
                      onClick={() => setScheduleOpen(true)}
                    >
                      <Plus className="h-3.5 w-3.5 mr-1.5" /> Lên lịch
                    </Button>
                  ) : (
                    <Link
                      to="/admin/jobs/$jobId"
                      params={{ jobId: c.latestJob.id }}
                      className="flex-1 lg:w-32"
                    >
                      <Button size="sm" variant="secondary" className="w-full">
                        Chi tiết <ChevronRight className="h-3.5 w-3.5 ml-1" />
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </Card>
          ))}

          {enrichedContracts.length === 0 && (
            <div className="py-20 text-center border-2 border-dashed rounded-3xl bg-muted/5">
              <ShieldCheck className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="font-bold text-lg text-muted-foreground">
                Không tìm thấy hợp đồng bảo trì nào
              </h3>
              <p className="text-sm text-muted-foreground/60 max-w-xs mx-auto mt-2">
                Hãy thử thay đổi tiêu chí tìm kiếm hoặc kiểm tra lại danh sách hợp đồng tổng.
              </p>
            </div>
          )}
        </div>
      </AppShell>

      <CreateContractModal
        open={renewContractOpen}
        onClose={() => setRenewContractOpen(false)}
        defaultCustomerId={renewCustomerId}
      />
      <CreateJobModal
        open={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
        defaultType="maintenance"
        defaultTitle="Bảo trì định kỳ"
      />
    </>
  );
}

function StatsCard({ title, value, icon: Icon, color, highlight }: any) {
  const colorMap: any = {
    blue: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    rose: "bg-rose-500/10 text-rose-600 border-rose-500/20",
    emerald: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    indigo: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
    orange: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  };

  return (
    <Card
      className={`p-4 border transition-all ${highlight ? "ring-2 ring-rose-500 ring-offset-2" : ""}`}
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="text-xs font-bold text-muted-foreground uppercase mb-1 tracking-wider">
            {title}
          </div>
          <div className="text-3xl font-black">{value}</div>
        </div>
        <div className={`p-2 rounded-xl border ${colorMap[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}
