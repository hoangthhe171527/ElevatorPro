import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { MobileShell } from "@/components/layout/MobileShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  mockContracts,
  mockCustomers,
  mockElevators,
  mockInventory,
  mockIssues,
  mockJobs,
  mockLeads,
  mockProjects,
  mockRequests,
  mockUsers,
  getCustomer,
  getElevator,
  getUser,
  optimizeRoute,
  formatDate,
  formatDateTime,
  formatVND,
} from "@/lib/mock-data";
import {
  contractStatusLabel,
  contractStatusVariant,
  elevatorStatusLabel,
  elevatorStatusVariant,
  jobStatusLabel,
  jobStatusVariant,
  priorityLabel,
  priorityVariant,
  leadStatusLabel,
  leadStatusVariant,
} from "@/lib/status-variants";
import { canAccessWorkbenchModule, type MobileRole, type MobileWorkbenchModuleKey } from "@/lib/mobile-policy";
import { useAppStore, useCurrentPermissions, useCurrentUser, useMainRole } from "@/lib/store";
import { AlertTriangle, Briefcase, Camera, CircleHelp, CreditCard, FileText, Layers, MapPin, Navigation, Package, Plus, Search, Shield, Trash2, Users, Wrench } from "lucide-react";
import { toast } from "sonner";

export type MobileModuleKey = MobileWorkbenchModuleKey;

type ListItem = {
  id: string;
  title: string;
  subtitle: string;
  rightText?: string;
  href?: string;
  statusCode?: string;
  priorityCode?: string;
  scheduledFor?: string;
  statusVariant?: "muted" | "primary" | "success" | "warning" | "destructive" | "info";
  statusText?: string;
};

const moduleTitle: Record<MobileModuleKey, { title: string; subtitle: string }> = {
  approvals: { title: "Phê duyệt", subtitle: "Duyệt yêu cầu và điều phối công việc" },
  accounting: { title: "Kế toán", subtitle: "Theo dõi dòng tiền, công nợ và hợp đồng" },
  contracts: { title: "Hợp đồng", subtitle: "Quản lý hợp đồng và trạng thái thanh toán" },
  customers: { title: "Khách hàng", subtitle: "Danh sách khách hàng theo tenant hiện tại" },
  elevators: { title: "Thang máy", subtitle: "Theo dõi trạng thái toàn bộ thiết bị" },
  hr: { title: "Nhân sự", subtitle: "Tổng quan nhân sự và đội kỹ thuật" },
  inventory: { title: "Kho vật tư", subtitle: "Theo dõi tồn kho và mức cảnh báo" },
  jobs: { title: "Công việc", subtitle: "Lịch công việc và tiến độ xử lý" },
  leads: { title: "Leads", subtitle: "Cơ hội kinh doanh và trạng thái chăm sóc" },
  projects: { title: "Dự án", subtitle: "Quản lý tiến độ dự án theo giai đoạn" },
  reports: { title: "Báo cáo", subtitle: "Các chỉ số quan trọng theo vai trò" },
  settings: { title: "Cài đặt", subtitle: "Thông số vận hành và cấu hình hệ thống" },
  profile: { title: "Tài khoản", subtitle: "Thông tin người dùng và quyền truy cập" },
  techHome: { title: "Kỹ thuật", subtitle: "Tổng quan tác vụ kỹ thuật trong ngày" },
  techJobs: { title: "Việc kỹ thuật", subtitle: "Danh sách việc được phân công" },
  techRoutePlan: { title: "Tuyến kỹ thuật", subtitle: "Gợi ý lộ trình tối ưu" },
  schedule: { title: "Lịch công tác", subtitle: "Lịch làm việc theo ca" },
  routePlan: { title: "Kế hoạch tuyến", subtitle: "Điều phối theo cụm khu vực" },
  portalHome: { title: "Portal khách hàng", subtitle: "Tổng quan dịch vụ cho khách hàng" },
  portalContracts: { title: "Hợp đồng khách hàng", subtitle: "Hợp đồng của khách hàng portal" },
  portalElevators: { title: "Thiết bị khách hàng", subtitle: "Danh sách thang máy theo portal" },
  portalIssues: { title: "Sự cố khách hàng", subtitle: "Theo dõi ticket và yêu cầu xử lý" },
};

function getList(module: MobileModuleKey, activeTenantId: string, role: MobileRole, userId: string): ListItem[] {
  const customerId = "c-1";
  const customerProjectIds = mockProjects.filter((p) => p.customerId === customerId).map((p) => p.id);

  if (module === "jobs" || module === "techJobs") {
    return mockJobs
      .filter((j) => j.tenantId === activeTenantId)
      .filter((j) => (module === "techJobs" ? j.assignedTo === userId : true))
      .slice(0, 12)
      .map((j) => ({
        id: j.id,
        title: j.title,
        subtitle: formatDateTime(j.scheduledFor),
        href: module === "techJobs" ? `/mobile/tech/jobs/${j.id}` : `/mobile/jobs/${j.id}`,
        statusCode: j.status,
        priorityCode: j.priority,
        scheduledFor: j.scheduledFor,
        statusVariant: jobStatusVariant[j.status],
        statusText: jobStatusLabel[j.status],
      }));
  }

  if (module === "techRoutePlan") {
    return mockJobs
      .filter((j) => j.tenantId === activeTenantId)
      .filter((j) => j.assignedTo === userId)
      .sort((a, b) => a.scheduledFor.localeCompare(b.scheduledFor))
      .slice(0, 12)
      .map((j) => ({
        id: j.id,
        title: j.title,
        subtitle: `Tuyến đề xuất · ${formatDateTime(j.scheduledFor)}`,
        href: `/mobile/tech/jobs/${j.id}`,
        statusCode: j.status,
        statusVariant: jobStatusVariant[j.status],
        statusText: jobStatusLabel[j.status],
      }));
  }

  if (module === "routePlan") {
    return mockJobs
      .filter((j) => j.tenantId === activeTenantId)
      .sort((a, b) => a.scheduledFor.localeCompare(b.scheduledFor))
      .slice(0, 12)
      .map((j) => ({
        id: j.id,
        title: j.title,
        subtitle: `Điều phối tuyến · ${formatDateTime(j.scheduledFor)}`,
        href: `/mobile/jobs/${j.id}`,
        statusCode: j.status,
        statusVariant: jobStatusVariant[j.status],
        statusText: jobStatusLabel[j.status],
      }));
  }

  if (module === "schedule") {
    return mockJobs
      .filter((j) => j.tenantId === activeTenantId)
      .filter((j) => (role === "tech" ? j.assignedTo === userId : true))
      .sort((a, b) => a.scheduledFor.localeCompare(b.scheduledFor))
      .slice(0, 12)
      .map((j) => ({
        id: j.id,
        title: j.title,
        subtitle: `Lịch công tác · ${formatDateTime(j.scheduledFor)}`,
        href: role === "tech" ? `/mobile/tech/jobs/${j.id}` : `/mobile/jobs/${j.id}`,
        statusCode: j.status,
        statusVariant: jobStatusVariant[j.status],
        statusText: jobStatusLabel[j.status],
      }));
  }

  if (module === "contracts" || module === "portalContracts") {
    return mockContracts
      .filter((c) => c.tenantId === activeTenantId)
      .filter((c) => (module === "portalContracts" ? c.customerId === customerId : true))
      .slice(0, 12)
      .map((c) => ({
        id: c.id,
        title: c.code,
        subtitle: `Hết hạn ${formatDate(c.endDate)}`,
        rightText: formatVND(c.value),
        href: module === "contracts" ? `/mobile/contracts/${c.id}` : `/mobile/portal/contracts/${c.id}`,
        statusCode: c.status,
        statusVariant: contractStatusVariant[c.status],
        statusText: contractStatusLabel[c.status],
      }));
  }

  if (module === "customers") {
    return mockCustomers
      .filter((c) => c.tenantId === activeTenantId)
      .slice(0, 12)
      .map((c) => ({
        id: c.id,
        title: c.name,
        subtitle: c.address,
        href: `/mobile/customers/${c.id}`,
      }));
  }

  if (module === "elevators" || module === "portalElevators") {
    return mockElevators
      .filter((e) => e.tenantId === activeTenantId)
      .filter((e) => (module === "portalElevators" ? customerProjectIds.includes(e.projectId) : true))
      .slice(0, 12)
      .map((e) => ({
        id: e.id,
        title: e.code,
        subtitle: `${e.building} · ${e.brand}`,
        href: module === "elevators" ? `/mobile/elevators/${e.id}` : `/mobile/portal/elevators/${e.id}`,
        statusCode: e.status,
        statusVariant: elevatorStatusVariant[e.status],
        statusText: elevatorStatusLabel[e.status],
      }));
  }

  if (module === "leads") {
    return mockLeads
      .filter((l) => l.tenantId === activeTenantId)
      .slice(0, 12)
      .map((l) => ({
        id: l.id,
        title: l.name,
        subtitle: l.source,
        href: `/mobile/leads/${l.id}`,
        statusCode: l.status,
        statusVariant: leadStatusVariant[l.status],
        statusText: leadStatusLabel[l.status],
      }));
  }

  if (module === "projects") {
    return mockProjects
      .filter((p) => p.tenantId === activeTenantId)
      .slice(0, 12)
      .map((p) => ({
        id: p.id,
        title: p.name,
        subtitle: p.address,
        href: `/mobile/projects/${p.id}`,
        rightText: p.stage,
      }));
  }

  if (module === "inventory") {
    return mockInventory
      .filter((i) => i.tenantId === activeTenantId)
      .slice(0, 12)
      .map((i) => ({
        id: i.id,
        title: i.name,
        subtitle: `${i.code} · Tồn ${i.stock}`,
        href: `/mobile/inventory/${i.id}`,
      }));
  }

  if (module === "portalIssues") {
    return mockIssues
      .filter((i) => i.customerId === customerId)
      .slice(0, 12)
      .map((i) => ({
      id: i.id,
      title: i.description,
      subtitle: formatDateTime(i.reportedAt),
      href: `/mobile/portal/issues/${i.id}`,
      statusCode: i.status,
      statusText: i.status,
      statusVariant: i.status === "resolved" ? "success" : i.status === "scheduled" ? "info" : "warning",
    }));
  }

  return [];
}

function AccessDenied({ module }: { module: MobileModuleKey }) {
  const role = useMainRole();

  return (
    <MobileShell title="Không có quyền truy cập">
      <div className="min-h-screen bg-slate-50 px-4 pt-4 pb-36">
        <Card className="p-6 text-center rounded-2xl border-slate-100">
          <Shield className="h-8 w-8 mx-auto text-slate-400" />
          <p className="mt-3 text-sm font-semibold text-slate-900">Vai trò hiện tại không mở được màn này</p>
          <p className="mt-1 text-sm text-slate-500">Màn {moduleTitle[module].title} yêu cầu quyền khác. Hãy đổi role để tiếp tục.</p>
          <Link to="/mobile" className="inline-block mt-4">
            <Button className="rounded-xl">Về trang chính mobile</Button>
          </Link>
        </Card>
      </div>
    </MobileShell>
  );
}

function entityById(module: MobileModuleKey, entityId: string) {
  switch (module) {
    case "jobs":
    case "techJobs":
      return mockJobs.find((j) => j.id === entityId);
    case "contracts":
    case "portalContracts":
      return mockContracts.find((c) => c.id === entityId);
    case "customers":
      return mockCustomers.find((c) => c.id === entityId);
    case "elevators":
    case "portalElevators":
      return mockElevators.find((e) => e.id === entityId);
    case "projects":
      return mockProjects.find((p) => p.id === entityId);
    case "inventory":
      return mockInventory.find((i) => i.id === entityId);
    case "leads":
      return mockLeads.find((l) => l.id === entityId);
    case "portalIssues":
      return mockIssues.find((i) => i.id === entityId);
    default:
      return null;
  }
}

export function MobileWorkbenchList({ module }: { module: MobileModuleKey }) {
  const role = useMainRole();
  const user = useCurrentUser();
  const permissions = useCurrentPermissions();
  const activeTenantId = useAppStore((s) => s.activeTenantId);
  const canAccess = canAccessWorkbenchModule(module, role, permissions);

  if (!canAccess) {
    return <AccessDenied module={module} />;
  }

  const header = moduleTitle[module];
  const items = getList(module, activeTenantId, role, user.id);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  const hasFilter = ["jobs", "techJobs", "contracts", "portalContracts", "portalIssues", "leads", "elevators", "portalElevators"].includes(module);
  const hasJobAdvancedFilter = module === "jobs" || module === "techJobs";

  const statusOptions = useMemo(() => {
    if (module === "jobs" || module === "techJobs") {
      return [
        { value: "all", label: "Tất cả trạng thái" },
        { value: "scheduled", label: "Đã lên lịch" },
        { value: "in_progress", label: "Đang thực hiện" },
        { value: "completed", label: "Hoàn tất" },
        { value: "cancelled", label: "Đã hủy" },
      ];
    }

    if (module === "contracts" || module === "portalContracts") {
      return [
        { value: "all", label: "Tất cả trạng thái" },
        { value: "active", label: "Đang hiệu lực" },
        { value: "expiring", label: "Sắp hết hạn" },
        { value: "expired", label: "Hết hạn" },
      ];
    }

    if (module === "portalIssues") {
      return [
        { value: "all", label: "Tất cả trạng thái" },
        { value: "open", label: "Mới mở" },
        { value: "scheduled", label: "Đã tiếp nhận" },
        { value: "resolved", label: "Đã xử lý" },
      ];
    }

    if (module === "leads") {
      return [
        { value: "all", label: "Tất cả trạng thái" },
        { value: "new", label: "Mới" },
        { value: "contacted", label: "Đã liên hệ" },
        { value: "qualified", label: "Đủ điều kiện" },
        { value: "won", label: "Thắng" },
        { value: "lost", label: "Thua" },
      ];
    }

    if (module === "elevators" || module === "portalElevators") {
      return [
        { value: "all", label: "Tất cả trạng thái" },
        { value: "operational", label: "Hoạt động" },
        { value: "maintenance_due", label: "Đến hạn bảo trì" },
        { value: "fault", label: "Sự cố" },
      ];
    }

    return [{ value: "all", label: "Tất cả" }];
  }, [module]);

  const filteredItems = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    return items.filter((item) => {
      const matchSearch =
        normalizedQuery.length === 0 ||
        item.title.toLowerCase().includes(normalizedQuery) ||
        item.subtitle.toLowerCase().includes(normalizedQuery) ||
        (item.rightText?.toLowerCase().includes(normalizedQuery) ?? false) ||
        (item.statusText?.toLowerCase().includes(normalizedQuery) ?? false);

      const matchStatus = statusFilter === "all" || item.statusCode === statusFilter;

      const matchPriority = !hasJobAdvancedFilter || priorityFilter === "all" || item.priorityCode === priorityFilter;

      let matchDate = true;
      if (hasJobAdvancedFilter && dateFilter !== "all") {
        const scheduledDate = item.scheduledFor ? new Date(item.scheduledFor) : null;

        if (!scheduledDate || Number.isNaN(scheduledDate.getTime())) {
          matchDate = false;
        } else {
          const scheduleDay = new Date(scheduledDate);
          scheduleDay.setHours(0, 0, 0, 0);

          if (dateFilter === "today") {
            matchDate = scheduleDay.getTime() === today.getTime();
          }

          if (dateFilter === "next7") {
            matchDate = scheduleDay >= today && scheduleDay <= nextWeek;
          }

          if (dateFilter === "overdue") {
            matchDate = scheduleDay < today && item.statusCode !== "completed";
          }
        }
      }

      return matchSearch && matchStatus && matchPriority && matchDate;
    });
  }, [dateFilter, hasJobAdvancedFilter, items, priorityFilter, searchQuery, statusFilter]);

  return (
    <MobileShell hideHeader={false} title={header.title}>
      <div className="min-h-screen bg-slate-50 pb-36">
        <section className="px-5 pt-6 pb-6 bg-indigo-950 rounded-b-[2rem]">
          <p className="text-xs text-indigo-200">{header.subtitle}</p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <Card className="p-3 border-none bg-white/10 text-white">
              <p className="text-[10px] opacity-70">Vai trò</p>
              <p className="mt-1 text-xs font-bold uppercase">{role}</p>
            </Card>
            <Card className="p-3 border-none bg-white/10 text-white">
              <p className="text-[10px] opacity-70">Tenant</p>
              <p className="mt-1 text-xs font-bold uppercase">{activeTenantId}</p>
            </Card>
            <Card className="p-3 border-none bg-white/10 text-white">
              <p className="text-[10px] opacity-70">Hiển thị</p>
              <p className="mt-1 text-xs font-bold">{filteredItems.length}/{items.length}</p>
            </Card>
          </div>
        </section>

        {hasFilter ? (
          <section className="px-4 mt-4 space-y-2">
            <Card className="p-3 rounded-2xl border-slate-100">
              <div className="relative">
                <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm theo mã, tên, trạng thái..."
                  className="h-9 pl-9 rounded-xl"
                />
              </div>

              {statusOptions.length > 1 ? (
                <div className="mt-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="h-9 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : null}

              {hasJobAdvancedFilter ? (
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="h-9 rounded-xl">
                      <SelectValue placeholder="Ưu tiên" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Mọi mức ưu tiên</SelectItem>
                      <SelectItem value="urgent">Khẩn cấp</SelectItem>
                      <SelectItem value="high">Cao</SelectItem>
                      <SelectItem value="normal">Bình thường</SelectItem>
                      <SelectItem value="low">Thấp</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger className="h-9 rounded-xl">
                      <SelectValue placeholder="Thời gian" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Mọi thời điểm</SelectItem>
                      <SelectItem value="today">Hôm nay</SelectItem>
                      <SelectItem value="next7">7 ngày tới</SelectItem>
                      <SelectItem value="overdue">Quá hạn xử lý</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ) : null}
            </Card>
          </section>
        ) : null}

        <section className="px-4 mt-4 space-y-2">
          {filteredItems.length === 0 ? (
            <Card className="p-5 text-center text-sm text-slate-500">Không có dữ liệu cho màn này.</Card>
          ) : (
            filteredItems.map((item) => {
              const content = (
                <Card className="p-3.5 rounded-2xl border-slate-100 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
                      <Layers className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-semibold text-slate-900">{item.title}</p>
                      <p className="truncate text-[11px] text-slate-500 mt-0.5">{item.subtitle}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      {item.statusText && item.statusVariant ? (
                        <StatusBadge variant={item.statusVariant}>{item.statusText}</StatusBadge>
                      ) : null}
                      {item.rightText ? <p className="text-[11px] font-semibold text-indigo-700 mt-1">{item.rightText}</p> : null}
                    </div>
                  </div>
                </Card>
              );

              return item.href ? (
                <Link key={item.id} to={item.href}>
                  {content}
                </Link>
              ) : (
                <div key={item.id}>{content}</div>
              );
            })
          )}
        </section>
      </div>
    </MobileShell>
  );
}

export function MobileWorkbenchDetail({ module, entityId }: { module: MobileModuleKey; entityId: string }) {
  const role = useMainRole();
  const permissions = useCurrentPermissions();
  const activeTenantId = useAppStore((s) => s.activeTenantId);
  const canAccess = canAccessWorkbenchModule(module, role, permissions);

  if (!canAccess) {
    return <AccessDenied module={module} />;
  }

  const entity = entityById(module, entityId);
  const header = moduleTitle[module];
  const entityRecord = entity ? (entity as unknown as Record<string, unknown>) : null;
  const [detailStatus, setDetailStatus] = useState<string | null>(null);
  const [paidAmount, setPaidAmount] = useState<number | null>(
    typeof entityRecord?.paid === "number" ? entityRecord.paid : null,
  );
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentInput, setPaymentInput] = useState("");
  const [dispatchDialogOpen, setDispatchDialogOpen] = useState(false);
  const [assignedTechId, setAssignedTechId] = useState(String(entityRecord?.assignedTo ?? ""));
  const [techReport, setTechReport] = useState(String(entityRecord?.report ?? ""));
  const [beforeCount, setBeforeCount] = useState(
    Array.isArray(entityRecord?.beforePhotos) ? entityRecord.beforePhotos.length : 0,
  );
  const [afterCount, setAfterCount] = useState(
    Array.isArray(entityRecord?.afterPhotos) ? entityRecord.afterPhotos.length : 0,
  );
  const [selectedPartId, setSelectedPartId] = useState("none");
  const [usedParts, setUsedParts] = useState<Array<{ id: string; qty: number }>>([]);
  const [checklist, setChecklist] = useState({
    safety: false,
    cleaned: false,
    tested: false,
  });
  const [confirmState, setConfirmState] = useState<{
    open: boolean;
    title: string;
    description: string;
    confirmText: string;
    variant?: "default" | "destructive" | "success";
    onConfirm: () => void;
  }>({
    open: false,
    title: "",
    description: "",
    confirmText: "Xác nhận",
    variant: "default",
    onConfirm: () => {},
  });

  const openConfirm = (config: Omit<typeof confirmState, "open">) => {
    setConfirmState({ ...config, open: true });
  };

  const currentStatus = detailStatus ?? String(entityRecord?.status ?? "");
  const portalContractId = String(entityRecord?.contractId ?? "");

  const technicianOptions = useMemo(
    () =>
      mockUsers.filter((u) =>
        u.memberships.some(
          (m) => m.tenantId === activeTenantId && m.permissions.includes("field_tech"),
        ),
      ),
    [activeTenantId],
  );

  const routeSummary = useMemo(() => {
    if (module !== "techJobs") return null;

    const jobCode = String(entityRecord?.id ?? "");
    const assignee = assignedTechId && assignedTechId !== "none" ? assignedTechId : String(entityRecord?.assignedTo ?? "");
    const scheduleIso = String(entityRecord?.scheduledFor ?? "");
    const dayKey = scheduleIso.split("T")[0];
    const sameDayJobs = mockJobs.filter(
      (job) =>
        job.assignedTo === assignee &&
        (job.status === "scheduled" || job.status === "in_progress") &&
        job.scheduledFor.startsWith(dayKey),
    );

    if (sameDayJobs.length === 0) return null;

    const route = optimizeRoute(assignee, sameDayJobs);
    const stopIndex = route.stops.findIndex((stop) => stop.jobId === jobCode);
    if (stopIndex < 0) return null;

    return {
      order: stopIndex + 1,
      legKm: route.stops[stopIndex].legKm,
      etaMinutes: route.stops[stopIndex].etaMinutes,
    };
  }, [assignedTechId, entityRecord, module]);

  const addPart = () => {
    if (!selectedPartId || selectedPartId === "none") {
      toast.error("Vui lòng chọn vật tư");
      return;
    }

    if (usedParts.some((p) => p.id === selectedPartId)) {
      toast.error("Vật tư đã có trong danh sách");
      return;
    }

    setUsedParts((prev) => [...prev, { id: selectedPartId, qty: 1 }]);
    setSelectedPartId("none");
  };

  const updatePartQty = (id: string, delta: number) => {
    setUsedParts((prev) =>
      prev.map((part) => {
        if (part.id !== id) return part;
        return { ...part, qty: Math.max(1, part.qty + delta) };
      }),
    );
  };

  const submitContractPayment = () => {
    const parsedAmount = Number(paymentInput.replace(/[^\d]/g, ""));

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      toast.error("Vui lòng nhập số tiền hợp lệ");
      return;
    }

    const value = Number(entityRecord?.value ?? 0);
    const currentPaid = paidAmount ?? Number(entityRecord?.paid ?? 0);
    const nextPaid = Math.min(value, currentPaid + parsedAmount);

    setPaidAmount(nextPaid);
    setPaymentInput("");
    setPaymentDialogOpen(false);
    toast.success(`Đã ghi nhận thanh toán ${formatVND(parsedAmount)}`);
  };

  const renderDetailSection = () => {
    if (!entityRecord) return null;

    if (module === "contracts" || module === "portalContracts") {
      const value = typeof entityRecord.value === "number" ? entityRecord.value : 0;
      const paid = paidAmount ?? (typeof entityRecord.paid === "number" ? entityRecord.paid : 0);
      const milestones = Array.isArray(entityRecord.milestones)
        ? (entityRecord.milestones as Array<Record<string, unknown>>)
        : [];
      const percent = value > 0 ? Math.min(100, Math.round((paid / value) * 100)) : 0;

      return (
        <>
          <Card className="mt-3 p-4 rounded-2xl border-slate-100">
            <div className="flex items-center justify-between">
              <p className="text-[12px] text-slate-500">Tiến độ thanh toán</p>
              <p className="text-[12px] font-semibold text-indigo-700">{percent}%</p>
            </div>
            <div className="mt-2 h-2 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full bg-indigo-600" style={{ width: `${percent}%` }} />
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Đã thu: {formatVND(paid)}</span>
              <span className="text-slate-500">Giá trị: {formatVND(value)}</span>
            </div>
          </Card>

          {milestones.length > 0 ? (
            <Card className="mt-3 p-4 rounded-2xl border-slate-100">
              <p className="text-xs font-semibold text-slate-900">Mốc thanh toán</p>
              <div className="mt-2 space-y-2">
                {milestones.map((m) => (
                  <div key={String(m.id)} className="rounded-xl border border-slate-100 p-3">
                    <p className="text-xs font-semibold text-slate-900">{String(m.name ?? "Mốc")}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Hạn {formatDate(String(m.dueDate ?? ""))}</p>
                    <div className="mt-1 flex items-center justify-between">
                      <p className="text-[11px] font-semibold text-indigo-700">{formatVND(Number(m.amount ?? 0))}</p>
                      <StatusBadge variant={m.status === "paid" ? "success" : m.status === "overdue" ? "destructive" : "warning"}>
                        {String(m.status ?? "pending")}
                      </StatusBadge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ) : null}
        </>
      );
    }

    if (module === "jobs" || module === "techJobs") {
      const assignedTo = assignedTechId && assignedTechId !== "none" ? assignedTechId : String(entityRecord.assignedTo ?? "");
      const tech = assignedTo ? getUser(assignedTo) : null;
      const customer = String(entityRecord.customerId ?? "") ? getCustomer(String(entityRecord.customerId)) : null;
      const elevator = String(entityRecord.elevatorId ?? "") ? getElevator(String(entityRecord.elevatorId)) : null;

      return (
        <>
          <Card className="mt-3 p-4 rounded-2xl border-slate-100">
            <p className="text-xs font-semibold text-slate-900">Thông tin xử lý</p>
            <div className="mt-2 space-y-2 text-[12px]">
              <div className="flex items-center justify-between"><span className="text-slate-500">Kỹ thuật viên</span><span className="font-semibold text-slate-900">{tech?.name ?? "Chưa phân công"}</span></div>
              <div className="flex items-center justify-between"><span className="text-slate-500">Khách hàng</span><span className="font-semibold text-slate-900 truncate max-w-[65%] text-right">{customer?.name ?? "-"}</span></div>
              <div className="flex items-center justify-between"><span className="text-slate-500">Thiết bị</span><span className="font-semibold text-slate-900">{elevator?.code ?? "-"}</span></div>
              <div className="flex items-center justify-between"><span className="text-slate-500">Lịch hẹn</span><span className="font-semibold text-slate-900">{formatDateTime(String(entityRecord.scheduledFor ?? ""))}</span></div>
              <div className="flex items-center justify-between"><span className="text-slate-500">Ưu tiên</span><StatusBadge variant={priorityVariant[String(entityRecord.priority ?? "normal")] ?? "muted"}>{priorityLabel[String(entityRecord.priority ?? "normal")] ?? String(entityRecord.priority ?? "normal")}</StatusBadge></div>
              <div className="flex items-center justify-between"><span className="text-slate-500">Trạng thái</span><StatusBadge variant={currentStatus === "completed" ? "success" : currentStatus === "in_progress" ? "info" : "warning"}>{jobStatusLabel[currentStatus] ?? (currentStatus || "pending")}</StatusBadge></div>
            </div>
          </Card>

          {module === "techJobs" ? (
            <>
              <Card className="mt-3 p-4 rounded-2xl border-slate-100">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-slate-900">Tuyến công tác</p>
                  {routeSummary ? (
                    <span className="text-[11px] text-slate-500">Điểm #{routeSummary.order}</span>
                  ) : null}
                </div>
                <div className="mt-2 text-[12px] space-y-1.5">
                  <div className="flex items-center gap-1.5 text-slate-600"><MapPin className="h-3.5 w-3.5" /> {customer?.address ?? "Chưa có địa chỉ"}</div>
                  {routeSummary ? (
                    <div className="flex items-center gap-1.5 text-slate-600"><Navigation className="h-3.5 w-3.5" /> {routeSummary.legKm.toFixed(1)} km · ~{routeSummary.etaMinutes} phút</div>
                  ) : null}
                </div>
              </Card>

              <Card className="mt-3 p-4 rounded-2xl border-slate-100">
                <p className="text-xs font-semibold text-slate-900">Checklist hiện trường</p>
                <div className="mt-2 space-y-2 text-[12px]">
                  {[
                    { key: "safety", label: "Đã kiểm tra an toàn" },
                    { key: "cleaned", label: "Đã vệ sinh khu vực" },
                    { key: "tested", label: "Đã test vận hành" },
                  ].map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      className={`w-full rounded-xl border px-3 py-2 text-left transition ${checklist[item.key as keyof typeof checklist] ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-white text-slate-600"}`}
                      onClick={() =>
                        setChecklist((prev) => ({
                          ...prev,
                          [item.key]: !prev[item.key as keyof typeof prev],
                        }))
                      }
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </Card>

              <Card className="mt-3 p-4 rounded-2xl border-slate-100">
                <p className="text-xs font-semibold text-slate-900">Ảnh hiện trường</p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setBeforeCount((prev) => prev + 1);
                      toast.success("Đã thêm ảnh trước");
                    }}
                    className="rounded-xl border border-slate-200 p-3 text-left"
                  >
                    <p className="text-[11px] text-slate-500">Trước sửa</p>
                    <p className="text-sm font-semibold text-slate-900 mt-1 flex items-center gap-1.5"><Camera className="h-4 w-4" /> {beforeCount} ảnh</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAfterCount((prev) => prev + 1);
                      toast.success("Đã thêm ảnh sau");
                    }}
                    className="rounded-xl border border-slate-200 p-3 text-left"
                  >
                    <p className="text-[11px] text-slate-500">Sau sửa</p>
                    <p className="text-sm font-semibold text-slate-900 mt-1 flex items-center gap-1.5"><Camera className="h-4 w-4" /> {afterCount} ảnh</p>
                  </button>
                </div>
              </Card>

              <Card className="mt-3 p-4 rounded-2xl border-slate-100">
                <p className="text-xs font-semibold text-slate-900">Vật tư sử dụng</p>
                <div className="mt-2 flex items-center gap-2">
                  <Select value={selectedPartId} onValueChange={setSelectedPartId}>
                    <SelectTrigger className="h-9 rounded-xl flex-1">
                      <SelectValue placeholder="Chọn vật tư" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Chưa chọn</SelectItem>
                      {mockInventory.filter((item) => item.tenantId === activeTenantId).map((item) => (
                        <SelectItem key={item.id} value={item.id}>{item.name} ({item.stock})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button size="sm" variant="outline" onClick={addPart}><Plus className="h-3.5 w-3.5 mr-1" /> Thêm</Button>
                </div>

                {usedParts.length > 0 ? (
                  <div className="mt-2 space-y-2">
                    {usedParts.map((part) => {
                      const info = mockInventory.find((i) => i.id === part.id);
                      return (
                        <div key={part.id} className="rounded-xl border border-slate-100 p-2.5 flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-[12px] font-semibold text-slate-900 truncate">{info?.name ?? part.id}</p>
                            <p className="text-[11px] text-slate-500">{info?.code ?? ""}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => updatePartQty(part.id, -1)}>-</Button>
                            <span className="w-5 text-center text-[12px] font-semibold">{part.qty}</span>
                            <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => updatePartQty(part.id, 1)}>+</Button>
                            <Button size="icon" variant="ghost" className="h-7 w-7 text-rose-600" onClick={() => setUsedParts((prev) => prev.filter((p) => p.id !== part.id))}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </Card>

              <Card className="mt-3 p-4 rounded-2xl border-slate-100">
                <p className="text-xs font-semibold text-slate-900">Báo cáo kỹ thuật</p>
                <Textarea
                  value={techReport}
                  onChange={(e) => setTechReport(e.target.value)}
                  placeholder="Nhập ghi chú xử lý hiện trường..."
                  className="mt-2 rounded-xl min-h-24"
                />
                <Button className="mt-2 w-full rounded-xl" onClick={() => toast.success("Đã lưu báo cáo kỹ thuật")}>Lưu báo cáo</Button>
              </Card>
            </>
          ) : null}
        </>
      );
    }

    if (module === "elevators" || module === "portalElevators") {
      return (
        <Card className="mt-3 p-4 rounded-2xl border-slate-100">
          <p className="text-xs font-semibold text-slate-900">Tình trạng thiết bị</p>
          <div className="mt-2 space-y-2 text-[12px]">
            <div className="flex items-center justify-between"><span className="text-slate-500">Model</span><span className="font-semibold text-slate-900">{String(entityRecord.model ?? "-")}</span></div>
            <div className="flex items-center justify-between"><span className="text-slate-500">Bảo trì gần nhất</span><span className="font-semibold text-slate-900">{formatDate(String(entityRecord.lastMaintenance ?? ""))}</span></div>
            <div className="flex items-center justify-between"><span className="text-slate-500">Bảo trì tiếp theo</span><span className="font-semibold text-slate-900">{formatDate(String(entityRecord.nextMaintenance ?? ""))}</span></div>
            <div className="flex items-center justify-between"><span className="text-slate-500">Trạng thái</span><StatusBadge variant={elevatorStatusVariant[String(currentStatus || entityRecord.status || "operational") as keyof typeof elevatorStatusVariant] ?? "muted"}>{String(currentStatus || entityRecord.status || "operational")}</StatusBadge></div>
          </div>
        </Card>
      );
    }

    if (module === "portalIssues") {
      return (
        <Card className="mt-3 p-4 rounded-2xl border-slate-100">
          <p className="text-xs font-semibold text-slate-900">Theo dõi ticket</p>
          <p className="text-[12px] text-slate-500 mt-1">Báo lúc {formatDateTime(String(entityRecord.reportedAt ?? ""))}</p>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[12px] text-slate-500">Trạng thái hiện tại</span>
            <StatusBadge variant={currentStatus === "resolved" ? "success" : currentStatus === "scheduled" ? "info" : "warning"}>{currentStatus || "open"}</StatusBadge>
          </div>
        </Card>
      );
    }

    if (module === "customers") {
      const customerId = String(entityRecord.id ?? "");
      const relatedContracts = mockContracts.filter((c) => c.customerId === customerId);
      const relatedProjects = mockProjects.filter((p) => p.customerId === customerId);
      const projectIds = relatedProjects.map((p) => p.id);
      const relatedElevators = mockElevators.filter((e) => projectIds.includes(e.projectId));

      return (
        <>
          <Card className="mt-3 p-4 rounded-2xl border-slate-100">
            <p className="text-xs font-semibold text-slate-900">Tổng quan khách hàng</p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              <div className="rounded-xl bg-slate-50 p-2.5 text-center">
                <p className="text-[10px] text-slate-500">Hợp đồng</p>
                <p className="text-sm font-bold text-slate-900 mt-1">{relatedContracts.length}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-2.5 text-center">
                <p className="text-[10px] text-slate-500">Dự án</p>
                <p className="text-sm font-bold text-slate-900 mt-1">{relatedProjects.length}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-2.5 text-center">
                <p className="text-[10px] text-slate-500">Thang máy</p>
                <p className="text-sm font-bold text-slate-900 mt-1">{relatedElevators.length}</p>
              </div>
            </div>

            <div className="mt-3 space-y-2">
              {relatedContracts.slice(0, 3).map((contract) => (
                <Link key={contract.id} to="/mobile/contracts/$contractId" params={{ contractId: contract.id }}>
                  <div className="rounded-xl border border-slate-100 p-2.5 text-[11px] flex items-center justify-between">
                    <span className="font-semibold text-slate-900">{contract.code}</span>
                    <span className="text-indigo-700 font-semibold">{formatVND(contract.value)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        </>
      );
    }

    return null;
  };

  return (
    <MobileShell showBackButton={true} title={header.title}>
      <div className="min-h-screen bg-slate-50 px-4 pt-4 pb-36">
        {!entity ? (
          <Card className="p-6 text-center">
            <CircleHelp className="h-8 w-8 mx-auto text-slate-400" />
            <p className="mt-3 text-sm text-slate-500">Không tìm thấy dữ liệu chi tiết.</p>
          </Card>
        ) : (
          <>
            <Card className="p-5 rounded-2xl border-none bg-indigo-950 text-white">
              <p className="text-[11px] text-indigo-200">Chi tiết {header.title}</p>
              <p className="mt-1 text-lg font-black tracking-tight">{String(entityRecord?.name ?? entityRecord?.code ?? entityRecord?.id)}</p>
            </Card>

            <Card className="mt-3 p-4 rounded-2xl border-slate-100">
              <div className="grid grid-cols-1 gap-2 text-sm">
                {Object.entries(entityRecord ?? {})
                  .slice(0, 12)
                  .map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between gap-3 border-b border-slate-100 pb-2 last:border-b-0 last:pb-0">
                      <span className="text-slate-500">{key}</span>
                      <span className="text-slate-900 font-medium text-right max-w-[65%] truncate">{String(value ?? "-")}</span>
                    </div>
                  ))}
              </div>
            </Card>

            {renderDetailSection()}

            <div className="mt-4 grid grid-cols-2 gap-2">
              {(module === "contracts" || module === "portalContracts") && (
                <>
                  <Button
                    variant="outline"
                    className="rounded-xl"
                    onClick={() => {
                      setPaymentDialogOpen(true);
                      setPaymentInput("");
                    }}
                  >
                    <CreditCard className="h-4 w-4 mr-1.5" /> Nhập tiền
                  </Button>
                  <Button
                    className="rounded-xl"
                    onClick={() =>
                      openConfirm({
                        title: "Xác nhận đã thu tiền",
                        description: "Hành động này sẽ cập nhật tiến độ thanh toán của hợp đồng trong phiên mobile hiện tại.",
                        confirmText: "Xác nhận thu",
                        variant: "success",
                        onConfirm: () => {
                          const currentPaid = paidAmount ?? Number(entityRecord?.paid ?? 0);
                          const value = Number(entityRecord?.value ?? 0);
                          const nextPaid = Math.min(value, currentPaid + Math.round(value * 0.2));
                          setPaidAmount(nextPaid);
                          toast.success("Đã cập nhật thanh toán hợp đồng");
                        },
                      })
                    }
                  >
                    <FileText className="h-4 w-4 mr-1.5" /> Xác nhận thu
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-xl"
                    onClick={() =>
                      openConfirm({
                        title: "Tạo yêu cầu gia hạn hợp đồng",
                        description: "Hệ thống sẽ tạo yêu cầu gia hạn và chuyển cho bộ phận phụ trách.",
                        confirmText: "Tạo yêu cầu",
                        onConfirm: () => toast.success("Đã tạo yêu cầu gia hạn hợp đồng"),
                      })
                    }
                  >
                    <Briefcase className="h-4 w-4 mr-1.5" /> Gia hạn
                  </Button>
                </>
              )}

              {module === "jobs" && (
                <>
                  <Button
                    variant="outline"
                    className="rounded-xl"
                    onClick={() => setDispatchDialogOpen(true)}
                  >
                    <Users className="h-4 w-4 mr-1.5" /> Điều phối
                  </Button>
                  <Button
                    className="rounded-xl"
                    onClick={() =>
                      openConfirm({
                        title: "Xác nhận hoàn tất",
                        description: "Công việc sẽ được đánh dấu hoàn tất trong phiên mobile hiện tại.",
                        confirmText: "Hoàn tất",
                        variant: "success",
                        onConfirm: () => {
                          setDetailStatus("completed");
                          toast.success("Đã đánh dấu hoàn tất công việc");
                        },
                      })
                    }
                  >
                    <Briefcase className="h-4 w-4 mr-1.5" /> Hoàn tất
                  </Button>
                </>
              )}

              {module === "techJobs" && (
                <>
                  <Button
                    variant="outline"
                    className="rounded-xl"
                    onClick={() =>
                      openConfirm({
                        title: "Xác nhận nhận việc",
                        description: "Bạn sẽ chuyển công việc sang trạng thái đang thực hiện.",
                        confirmText: "Nhận việc",
                        onConfirm: () => {
                          setDetailStatus("in_progress");
                          toast.success("Đã nhận việc");
                        },
                      })
                    }
                  >
                    <Users className="h-4 w-4 mr-1.5" /> Nhận việc
                  </Button>

                  <Button
                    className="rounded-xl"
                    onClick={() =>
                      openConfirm({
                        title: "Xác nhận hoàn tất",
                        description: "Công việc sẽ được đánh dấu hoàn tất trong phiên mobile hiện tại.",
                        confirmText: "Hoàn tất",
                        variant: "success",
                        onConfirm: () => {
                          setDetailStatus("completed");
                          toast.success("Đã đánh dấu hoàn tất công việc");
                        },
                      })
                    }
                  >
                    <Briefcase className="h-4 w-4 mr-1.5" /> Hoàn tất
                  </Button>
                </>
              )}

              {(module === "elevators" || module === "portalElevators") && (
                <>
                  <Button
                    variant="outline"
                    className="rounded-xl"
                    onClick={() =>
                      openConfirm({
                        title: "Tạo phiếu sự cố",
                        description: "Hệ thống sẽ mở phiếu sự cố cho thiết bị này để đội kỹ thuật xử lý.",
                        confirmText: "Tạo phiếu",
                        variant: "destructive",
                        onConfirm: () => {
                          setDetailStatus("maintenance_due");
                          toast.success("Đã tạo phiếu sự cố");
                        },
                      })
                    }
                  >
                    <Wrench className="h-4 w-4 mr-1.5" /> Báo sự cố
                  </Button>
                  {module === "portalElevators" && portalContractId ? (
                    <Link to="/mobile/portal/contracts/$contractId" params={{ contractId: portalContractId }}>
                      <Button className="w-full rounded-xl">
                        <FileText className="h-4 w-4 mr-1.5" /> Xem hợp đồng
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      className="rounded-xl"
                      onClick={() =>
                        openConfirm({
                          title: "Yêu cầu điều phối kỹ thuật",
                          description: "Gửi yêu cầu điều phối kỹ thuật viên cho thiết bị này.",
                          confirmText: "Gửi yêu cầu",
                          onConfirm: () => toast.success("Đã gửi yêu cầu điều phối kỹ thuật"),
                        })
                      }
                    >
                      <Briefcase className="h-4 w-4 mr-1.5" /> Điều phối
                    </Button>
                  )}
                </>
              )}

              {module === "portalIssues" && (
                <>
                  <Button
                    variant="outline"
                    className="rounded-xl"
                    onClick={() =>
                      openConfirm({
                        title: "Xác nhận đã tiếp nhận",
                        description: "Ticket sẽ chuyển sang trạng thái đã tiếp nhận xử lý.",
                        confirmText: "Xác nhận",
                        onConfirm: () => {
                          setDetailStatus("scheduled");
                          toast.success("Đã cập nhật trạng thái ticket");
                        },
                      })
                    }
                  >
                    <Users className="h-4 w-4 mr-1.5" /> Đã tiếp nhận
                  </Button>
                  <Button
                    className="rounded-xl"
                    onClick={() =>
                      openConfirm({
                        title: "Xác nhận đã xử lý xong",
                        description: "Ticket sẽ được đánh dấu đã giải quyết.",
                        confirmText: "Hoàn tất",
                        variant: "success",
                        onConfirm: () => {
                          setDetailStatus("resolved");
                          toast.success("Đã đánh dấu ticket đã xử lý");
                        },
                      })
                    }
                  >
                    <Briefcase className="h-4 w-4 mr-1.5" /> Đã xử lý
                  </Button>
                </>
              )}

              {!["contracts", "portalContracts", "jobs", "techJobs", "elevators", "portalElevators", "portalIssues", "customers"].includes(module) ? (
                <>
                  <Button
                    variant="outline"
                    className="rounded-xl"
                    onClick={() =>
                      openConfirm({
                        title: "Mở dữ liệu liên quan",
                        description: "Bạn muốn mở danh sách dữ liệu liên quan đến bản ghi này?",
                        confirmText: "Mở liên quan",
                        onConfirm: () => toast.success("Đã mở dữ liệu liên quan"),
                      })
                    }
                  >
                    <Users className="h-4 w-4 mr-1.5" /> Liên quan
                  </Button>
                  <Button
                    className="rounded-xl"
                    onClick={() =>
                      openConfirm({
                        title: "Xác nhận thực thi hành động",
                        description: "Thực thi hành động này trên bản ghi hiện tại?",
                        confirmText: "Thực thi",
                        onConfirm: () => toast.success("Đã thực thi hành động"),
                      })
                    }
                  >
                    <Briefcase className="h-4 w-4 mr-1.5" /> Hành động
                  </Button>
                </>
              ) : null}

              {module === "customers" ? (
                <>
                  <Button
                    variant="outline"
                    className="rounded-xl"
                    onClick={() =>
                      openConfirm({
                        title: "Tạo công việc cho khách hàng",
                        description: "Hệ thống sẽ tạo yêu cầu công việc mới cho khách hàng này.",
                        confirmText: "Tạo công việc",
                        onConfirm: () => toast.success("Đã tạo công việc cho khách hàng"),
                      })
                    }
                  >
                    <Briefcase className="h-4 w-4 mr-1.5" /> Tạo việc
                  </Button>
                  <Link to="/mobile/contracts" className="w-full">
                    <Button className="w-full rounded-xl">
                      <FileText className="h-4 w-4 mr-1.5" /> DS hợp đồng
                    </Button>
                  </Link>
                </>
              ) : null}
            </div>
          </>
        )}
      </div>

      <Dialog open={dispatchDialogOpen} onOpenChange={setDispatchDialogOpen}>
        <DialogContent className="max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Điều phối kỹ thuật viên</DialogTitle>
            <DialogDescription>Chọn kỹ thuật viên phù hợp để giao việc.</DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="dispatch-tech">Kỹ thuật viên</Label>
            <Select value={assignedTechId || "none"} onValueChange={setAssignedTechId}>
              <SelectTrigger id="dispatch-tech" className="h-9 rounded-xl">
                <SelectValue placeholder="Chọn kỹ thuật viên" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Chưa phân công</SelectItem>
                {technicianOptions.map((tech) => (
                  <SelectItem key={tech.id} value={tech.id}>{tech.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDispatchDialogOpen(false)}>Hủy</Button>
            <Button
              onClick={() => {
                if (!assignedTechId || assignedTechId === "none") {
                  toast.error("Vui lòng chọn kỹ thuật viên");
                  return;
                }
                setDetailStatus("scheduled");
                setDispatchDialogOpen(false);
                toast.success("Đã điều phối công việc");
              }}
            >
              Xác nhận điều phối
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Ghi nhận thanh toán</DialogTitle>
            <DialogDescription>Nhập số tiền thực tế vừa thu cho hợp đồng này.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="payment-amount">Số tiền</Label>
            <Input
              id="payment-amount"
              inputMode="numeric"
              value={paymentInput}
              onChange={(e) => setPaymentInput(e.target.value)}
              placeholder="VD: 15000000"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPaymentDialogOpen(false)}>Hủy</Button>
            <Button onClick={submitContractPayment}>Ghi nhận</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        open={confirmState.open}
        onOpenChange={(open) => setConfirmState((prev) => ({ ...prev, open }))}
        title={confirmState.title}
        description={confirmState.description}
        confirmText={confirmState.confirmText}
        variant={confirmState.variant}
        onConfirm={confirmState.onConfirm}
      />
    </MobileShell>
  );
}

export function MobileSimplePage({ module }: { module: MobileModuleKey }) {
  const role = useMainRole();
  const permissions = useCurrentPermissions();
  const canAccess = canAccessWorkbenchModule(module, role, permissions);

  if (!canAccess) {
    return <AccessDenied module={module} />;
  }

  const header = moduleTitle[module];
  const user = useCurrentUser();
  const activeTenantId = useAppStore((s) => s.activeTenantId);
  const contracts = mockContracts.filter((c) => c.tenantId === activeTenantId);
  const jobs = mockJobs.filter((j) => j.tenantId === activeTenantId);
  const revenue = contracts.reduce((s, c) => s + c.paid, 0);
  const [requests, setRequests] = useState(() =>
    mockRequests.filter((r) => r.tenantId === activeTenantId),
  );
  const [approvalDialog, setApprovalDialog] = useState<{
    open: boolean;
    id: string;
    status: "approved" | "rejected";
    title: string;
  }>({ open: false, id: "", status: "approved", title: "" });

  const pendingMilestones = useMemo(
    () =>
      contracts
        .flatMap((c) => c.milestones.map((m) => ({ ...m, contractCode: c.code })))
        .filter((m) => m.status !== "paid")
        .sort((a, b) => a.dueDate.localeCompare(b.dueDate)),
    [contracts],
  );

  const techJobs = jobs.filter((j) => j.assignedTo === user.id);
  const portalContracts = contracts.filter((c) => c.customerId === "c-1");
  const portalIssues = mockIssues.filter((i) => i.customerId === "c-1");

  const approveRequest = (id: string, status: "approved" | "rejected") => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  const renderModuleContent = () => {
    if (module === "approvals") {
      const pending = requests.filter((r) => r.status === "pending");
      const critical = pending.filter((r) => r.urgency === "critical").length;

      return (
        <>
          <div className="grid grid-cols-3 gap-2 mt-3">
            <Card className="p-3 rounded-2xl"><p className="text-[11px] text-slate-500">Chờ duyệt</p><p className="text-sm font-bold mt-1">{pending.length}</p></Card>
            <Card className="p-3 rounded-2xl"><p className="text-[11px] text-slate-500">Khẩn cấp</p><p className="text-sm font-bold mt-1 text-rose-600">{critical}</p></Card>
            <Card className="p-3 rounded-2xl"><p className="text-[11px] text-slate-500">Đã duyệt</p><p className="text-sm font-bold mt-1">{requests.filter((r) => r.status === "approved").length}</p></Card>
          </div>
          <div className="mt-3 space-y-2">
            {pending.slice(0, 8).map((r) => (
              <Card key={r.id} className="p-3 rounded-2xl border-slate-100">
                <p className="text-xs font-semibold text-slate-900 truncate">{r.title}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{r.description}</p>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <StatusBadge variant={r.urgency === "critical" ? "destructive" : r.urgency === "high" ? "warning" : "info"}>{r.urgency}</StatusBadge>
                  <div className="flex gap-1.5">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 rounded-lg px-2 text-[11px]"
                      onClick={() => setApprovalDialog({ open: true, id: r.id, status: "rejected", title: r.title })}
                    >
                      Từ chối
                    </Button>
                    <Button
                      size="sm"
                      className="h-7 rounded-lg px-2 text-[11px]"
                      onClick={() => setApprovalDialog({ open: true, id: r.id, status: "approved", title: r.title })}
                    >
                      Duyệt
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      );
    }

    if (module === "accounting") {
      const debt = pendingMilestones.reduce((s, m) => s + m.amount, 0);

      return (
        <>
          <div className="grid grid-cols-2 gap-2 mt-3">
            <Card className="p-3 rounded-2xl"><p className="text-[11px] text-slate-500">Đã thu</p><p className="text-sm font-bold mt-1">{formatVND(revenue)}</p></Card>
            <Card className="p-3 rounded-2xl"><p className="text-[11px] text-slate-500">Chờ thu</p><p className="text-sm font-bold mt-1 text-amber-700">{formatVND(debt)}</p></Card>
          </div>
          <div className="mt-3 space-y-2">
            {pendingMilestones.slice(0, 8).map((m) => (
              <Card key={m.id} className="p-3 rounded-2xl border-slate-100">
                <p className="text-xs font-semibold text-slate-900">{m.name}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{m.contractCode} · Hạn {formatDate(m.dueDate)}</p>
                <p className="text-[12px] font-semibold text-indigo-700 mt-1">{formatVND(m.amount)}</p>
              </Card>
            ))}
          </div>
        </>
      );
    }

    if (module === "hr") {
      const tenantUsers = mockUsers.filter((u) => u.memberships.some((m) => m.tenantId === activeTenantId));
      const adminCount = tenantUsers.filter((u) => u.memberships.some((m) => m.tenantId === activeTenantId && m.permissions.some((p) => p === "director" || p === "hr_admin" || p === "accounting" || p === "sales"))).length;
      const techCount = tenantUsers.filter((u) => u.memberships.some((m) => m.tenantId === activeTenantId && m.permissions.includes("field_tech"))).length;

      return (
        <>
          <div className="grid grid-cols-3 gap-2 mt-3">
            <Card className="p-3 rounded-2xl"><p className="text-[11px] text-slate-500">Nhân sự</p><p className="text-sm font-bold mt-1">{tenantUsers.length}</p></Card>
            <Card className="p-3 rounded-2xl"><p className="text-[11px] text-slate-500">Khối VP</p><p className="text-sm font-bold mt-1">{adminCount}</p></Card>
            <Card className="p-3 rounded-2xl"><p className="text-[11px] text-slate-500">Kỹ thuật</p><p className="text-sm font-bold mt-1">{techCount}</p></Card>
          </div>
          <div className="mt-3 space-y-2">
            {tenantUsers.map((u) => {
              const perms = u.memberships.find((m) => m.tenantId === activeTenantId)?.permissions ?? [];
              return (
                <Card key={u.id} className="p-3 rounded-2xl border-slate-100">
                  <p className="text-xs font-semibold text-slate-900">{u.name}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5 truncate">{u.email}</p>
                  <p className="text-[11px] text-indigo-700 mt-1 truncate">{perms.join(" · ")}</p>
                </Card>
              );
            })}
          </div>
        </>
      );
    }

    if (module === "reports") {
      const expiring = contracts.filter((c) => c.status === "expiring").length;
      const active = jobs.filter((j) => j.status === "scheduled" || j.status === "in_progress").length;
      const leads = mockLeads.filter((l) => l.tenantId === activeTenantId && (l.status === "new" || l.status === "contacted")).length;

      return (
        <div className="grid grid-cols-2 gap-2 mt-3">
          <Card className="p-3 rounded-2xl"><p className="text-[11px] text-slate-500">Doanh thu</p><p className="text-sm font-bold mt-1">{formatVND(revenue)}</p></Card>
          <Card className="p-3 rounded-2xl"><p className="text-[11px] text-slate-500">HĐ hết hạn</p><p className="text-sm font-bold mt-1">{expiring}</p></Card>
          <Card className="p-3 rounded-2xl"><p className="text-[11px] text-slate-500">Job active</p><p className="text-sm font-bold mt-1">{active}</p></Card>
          <Card className="p-3 rounded-2xl"><p className="text-[11px] text-slate-500">Lead mới</p><p className="text-sm font-bold mt-1">{leads}</p></Card>
        </div>
      );
    }

    if (module === "profile") {
      const perms = user.memberships.find((m) => m.tenantId === activeTenantId)?.permissions ?? [];

      return (
        <Card className="mt-3 p-4 rounded-2xl border-slate-100">
          <p className="text-sm font-bold text-slate-900">{user.name}</p>
          <p className="text-xs text-slate-500 mt-1">{user.email} · {user.phone}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {perms.map((p) => (
              <StatusBadge key={p} variant="info">{p}</StatusBadge>
            ))}
          </div>
        </Card>
      );
    }

    if (module === "settings") {
      return (
        <div className="mt-3 space-y-2">
          <Card className="p-3 rounded-2xl border-slate-100"><p className="text-xs font-semibold">Tenant hiện tại</p><p className="text-[11px] text-slate-500 mt-1">{activeTenantId}</p></Card>
          <Card className="p-3 rounded-2xl border-slate-100"><p className="text-xs font-semibold">Cấu hình thông báo</p><p className="text-[11px] text-slate-500 mt-1">Push + Email cảnh báo sự cố</p></Card>
          <Card className="p-3 rounded-2xl border-slate-100"><p className="text-xs font-semibold">Đồng bộ dữ liệu</p><p className="text-[11px] text-slate-500 mt-1">Đang sử dụng dữ liệu realtime nội bộ</p></Card>
        </div>
      );
    }

    if (module === "techHome") {
      return (
        <div className="mt-3 space-y-2">
          <Card className="p-3 rounded-2xl border-slate-100"><p className="text-[11px] text-slate-500">Việc hôm nay</p><p className="text-sm font-bold mt-1">{techJobs.length}</p></Card>
          {techJobs.slice(0, 8).map((j) => (
            <Card key={j.id} className="p-3 rounded-2xl border-slate-100">
              <p className="text-xs font-semibold text-slate-900 truncate">{j.title}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">{formatDateTime(j.scheduledFor)}</p>
              <div className="mt-1"><StatusBadge variant={jobStatusVariant[j.status]}>{jobStatusLabel[j.status]}</StatusBadge></div>
            </Card>
          ))}
        </div>
      );
    }

    if (module === "portalHome") {
      return (
        <div className="grid grid-cols-2 gap-2 mt-3">
          <Card className="p-3 rounded-2xl"><p className="text-[11px] text-slate-500">Thiết bị</p><p className="text-sm font-bold mt-1">{mockElevators.filter((e) => e.projectId === "p-1").length}</p></Card>
          <Card className="p-3 rounded-2xl"><p className="text-[11px] text-slate-500">Hợp đồng</p><p className="text-sm font-bold mt-1">{portalContracts.length}</p></Card>
          <Card className="p-3 rounded-2xl"><p className="text-[11px] text-slate-500">Yêu cầu mở</p><p className="text-sm font-bold mt-1 text-amber-700">{portalIssues.filter((i) => i.status !== "resolved").length}</p></Card>
          <Card className="p-3 rounded-2xl"><p className="text-[11px] text-slate-500">Thanh toán</p><p className="text-sm font-bold mt-1">{formatVND(portalContracts.reduce((s, c) => s + c.paid, 0))}</p></Card>
        </div>
      );
    }

    return (
      <Card className="mt-3 p-4 rounded-2xl text-sm text-slate-600">
        Màn này đã được chuyển sang giao diện mobile nội bộ, không còn chuyển hướng sang web.
      </Card>
    );
  };

  return (
    <MobileShell title={header.title}>
      <div className="min-h-screen bg-slate-50 px-4 pt-4 pb-36">
        <Card className="p-5 rounded-2xl border-none bg-indigo-950 text-white">
          <p className="text-xs text-indigo-200">{header.subtitle}</p>
          <p className="text-lg font-black mt-1">{header.title}</p>
        </Card>

        <div className="grid grid-cols-2 gap-2 mt-3">
          <Card className="p-3 rounded-2xl">
            <p className="text-[11px] text-slate-500">Doanh thu</p>
            <p className="text-sm font-bold text-slate-900 mt-1">{formatVND(revenue)}</p>
          </Card>
          <Card className="p-3 rounded-2xl">
            <p className="text-[11px] text-slate-500">Công việc</p>
            <p className="text-sm font-bold text-slate-900 mt-1">{jobs.length}</p>
          </Card>
        </div>

        {renderModuleContent()}

        {(module === "portalIssues" || module === "approvals") && requests.some((r) => r.status === "pending") ? (
          <Card className="mt-3 p-3 rounded-2xl border-amber-200 bg-amber-50 text-amber-700 text-[11px] flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" /> Còn yêu cầu cần xử lý, ưu tiên duyệt trong ngày để tránh nghẽn vận hành.
          </Card>
        ) : null}
      </div>

      <ConfirmationDialog
        open={approvalDialog.open}
        onOpenChange={(open) => setApprovalDialog((prev) => ({ ...prev, open }))}
        title={approvalDialog.status === "approved" ? "Xác nhận duyệt yêu cầu" : "Xác nhận từ chối yêu cầu"}
        description={`Yêu cầu: ${approvalDialog.title}. ${approvalDialog.status === "approved" ? "Hành động này sẽ chuyển yêu cầu sang trạng thái đã duyệt." : "Hành động này sẽ chuyển yêu cầu sang trạng thái từ chối."}`}
        confirmText={approvalDialog.status === "approved" ? "Duyệt" : "Từ chối"}
        variant={approvalDialog.status === "approved" ? "success" : "destructive"}
        onConfirm={() => {
          approveRequest(approvalDialog.id, approvalDialog.status);
          toast.success(approvalDialog.status === "approved" ? "Đã duyệt yêu cầu" : "Đã từ chối yêu cầu");
        }}
      />
    </MobileShell>
  );
}
