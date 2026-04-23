import { useMemo } from "react";
import { useAppStore, useCurrentPermissions, useCurrentUser } from "@/lib/store";
import {
  TECH_INSTALLATION_PERMISSIONS,
  TECH_MAINTENANCE_PERMISSIONS,
  TECH_PERMISSIONS,
  TECH_SURVEY_PERMISSIONS,
} from "@/lib/roles";
import {
  mockProjects,
  mockContracts,
  mockElevators,
  mockCustomers,
  mockInvoices,
  mockIssues,
  mockJobs,
  mockLeads,
  mockUsers,
  type Job,
  type User,
  formatDate,
  formatDateTime,
} from "@/lib/mock-data";

export function useDashboardMetrics() {
  const activeTenantId = useAppStore((s) => s.activeTenantId);
  const currentUser = useCurrentUser();
  const permissions = useCurrentPermissions();

  const isCEO = permissions.includes("tech_manager");
  const isPM = permissions.includes("tech_manager");
  const isSalesAdmin = permissions.includes("sales_admin") || permissions.includes("sales");
  const isDispatch =
    permissions.includes("service_dispatcher") || permissions.includes("service_dispatcher");
  const isIntake = isDispatch;
  const isAccountant = permissions.includes("accountant");
  const isTechManager = permissions.includes("tech_manager");
  const isTechMaintenance = permissions.some((p) => TECH_MAINTENANCE_PERMISSIONS.includes(p));
  const isTechInstallation = permissions.some((p) => TECH_INSTALLATION_PERMISSIONS.includes(p));
  const isTechSurvey = permissions.some((p) => TECH_SURVEY_PERMISSIONS.includes(p));

  return useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const todayKey = now.toISOString().slice(0, 10);

    const tenantContracts = mockContracts.filter((c) => c.tenantId === activeTenantId);
    const tenantElevators = mockElevators.filter((e) => e.tenantId === activeTenantId);
    const tenantJobs = mockJobs.filter((j) => j.tenantId === activeTenantId);
    const tenantCustomers = mockCustomers.filter((c) => c.tenantId === activeTenantId);
    const tenantLeads = mockLeads.filter((l) => l.tenantId === activeTenantId);

    const totalRevenue = tenantContracts.reduce((s, c) => s + c.paid, 0);
    const expiringContracts = tenantContracts.filter((c) => c.status === "expiring").length;
    const overdueElevators = tenantElevators.filter(
      (e) => e.status === "maintenance_due" || e.status === "out_of_order",
    ).length;

    const expiringWarranties = tenantElevators.filter((e) => {
      const warrantyDate = new Date(e.warrantyUntil);
      const diffTime = warrantyDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 30; // expiring in 30 days
    });

    const upcomingJobs = [...tenantJobs]
      .filter((j) => j.status === "scheduled" || j.status === "in_progress")
      .sort((a, b) => a.scheduledFor.localeCompare(b.scheduledFor))
      .slice(0, 6);

    const recentContracts = [...tenantContracts]
      .sort((a, b) => b.signedAt.localeCompare(a.signedAt))
      .slice(0, 5);

    const monthlyJobs = tenantJobs.filter((j) => {
      const d = new Date(j.scheduledFor);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const completedJobsThisMonth = monthlyJobs.filter((j) => j.status === "completed").length;
    const pendingJobsThisMonth = monthlyJobs.filter((j) => j.status !== "completed").length;
    const completionRate =
      monthlyJobs.length > 0 ? Math.round((completedJobsThisMonth / monthlyJobs.length) * 100) : 0;

    const techPerformance = mockUsers
      .filter((u: User) =>
        u.memberships.some((m) => m.permissions.some((p) => TECH_PERMISSIONS.includes(p))),
      )
      .map((tech: User) => {
        const completed = tenantJobs.filter(
          (j: Job) => j.assignedTo === tech.id && j.status === "completed",
        ).length;
        const inProgress = tenantJobs.filter(
          (j: Job) => j.assignedTo === tech.id && j.status === "in_progress",
        ).length;
        return { ...tech, completed, inProgress };
      })
      .sort((a, b) => b.completed - a.completed)
      .slice(0, 5);

    const isToday = (iso: string) => iso.slice(0, 10) === todayKey;
    const isBeforeOrToday = (iso?: string) => !iso || iso.slice(0, 10) <= todayKey;

    const myJobsToday = tenantJobs.filter(
      (j) =>
        j.assignedTo === currentUser.id && (isToday(j.scheduledFor) || j.status === "in_progress"),
    );
    const myMaintenanceToday = myJobsToday.filter(
      (j) => j.type === "maintenance" || j.type === "repair",
    );
    const myInstallationToday = myJobsToday.filter((j) => j.type === "install");

    const myProjectIds = Array.from(
      new Set(
        tenantJobs
          .filter((j) => j.assignedTo === currentUser.id)
          .map((j) => j.projectId)
          .filter(Boolean),
      ),
    );
    const myProjects = mockProjects.filter((p) => myProjectIds.includes(p.id));
    const myCompletedCount = tenantJobs.filter(
      (j) => j.assignedTo === currentUser.id && j.status === "completed",
    ).length;
    const myUrgentCount = tenantJobs.filter(
      (j) => j.assignedTo === currentUser.id && j.priority === "urgent" && j.status !== "completed",
    ).length;

    const urgentJobs = tenantJobs.filter(
      (j) => j.priority === "urgent" && j.status !== "completed",
    );
    const pendingDispatch = tenantJobs.filter((j) => j.status === "pending");

    const intakeLeadQueue = tenantLeads.filter((l) => ["new", "surveying"].includes(l.status));
    const salesFollowups = tenantLeads.filter(
      (l) =>
        ["new", "surveying", "surveyed", "quoted"].includes(l.status) ||
        isBeforeOrToday(l.nextFollowUp),
    );
    const accountantMilestones = tenantContracts.flatMap((c) =>
      c.milestones
        .filter((m) => m.status !== "paid")
        .map((m) => ({
          contractId: c.id,
          dueDate: m.dueDate,
        })),
    );
    const overdueInvoices = mockInvoices.filter(
      (inv) => inv.tenantId === activeTenantId && inv.status === "overdue",
    );
    const openIssues = mockIssues.filter(
      (x) => x.tenantId === activeTenantId && x.status === "open",
    );

    const headerTitle = isCEO
      ? "Bảng điều khiển CEO"
      : isPM
        ? "Dashboard PM"
        : isSalesAdmin
          ? "Dashboard Sales"
          : isDispatch
            ? "Dashboard Admin Service / Điều phối"
            : isAccountant
              ? "Dashboard Kế toán"
              : isTechManager
                ? "Dashboard Trưởng bộ phận kỹ thuật"
                : isTechSurvey
                  ? "Dashboard Kỹ thuật khảo sát"
                  : isTechMaintenance
                    ? "Dashboard Kỹ thuật bảo trì"
                    : "Dashboard Kỹ thuật lắp đặt";

    const headerDescription = isCEO
      ? "Theo dõi tổng thể và phân việc khẩn cấp trong ngày"
      : isPM
        ? "Theo dõi dự án và điều phối tiến độ giữa các bộ phận"
        : isSalesAdmin
          ? "Lead và khách hàng cần theo dõi trong hôm nay"
          : isDispatch
            ? "Tiếp nhận hotline/QR, phân loại sự cố và điều phối ticket"
            : isAccountant
              ? "Công nợ, hóa đơn và mốc thanh toán cần xử lý"
              : isTechManager
                ? "Điều phối nhân sự kỹ thuật và kiểm soát tồn đọng công việc"
                : isTechSurvey
                  ? "Danh sách khảo sát bạn cần xác nhận và hoàn thành hôm nay"
                  : isTechMaintenance
                    ? "Danh sách bảo trì/sửa chữa bạn cần hoàn tất hôm nay"
                    : "Danh sách lắp đặt bạn cần thực hiện hôm nay";

    const activeProjects = mockProjects.filter(
      (p) => p.tenantId === activeTenantId && p.status === "in_progress",
    );

    const focusMetrics =
      isCEO || isPM || isTechManager
        ? [
            { label: "Dự án lắp đặt", value: activeProjects.length, hint: "Theo dõi tiến độ hố" },
            { label: "Việc khẩn cấp", value: urgentJobs.length, hint: "Cần xử lý ngay" },
            {
              label: "Chờ CEO duyệt tiền",
              value: mockContracts.filter((c) => c.accountantVerified && !c.ceoVerified).length,
              hint: "Đối soát kế toán",
            },
            {
              label: "Việc chờ phân công",
              value: pendingDispatch.length,
              hint: "Giao việc cho thợ",
            },
          ]
        : isSalesAdmin
          ? [
              {
                label: "Chờ khảo sát",
                value: tenantLeads.filter((l) => l.status === "new").length,
                hint: "Lead mới chưa có lịch",
              },
              {
                label: "Chờ báo giá",
                value: tenantLeads.filter((l) => l.status === "surveying").length,
                hint: "Đã khảo sát xong",
              },
              { label: "Khách hàng", value: tenantCustomers.length, hint: "Tổng số khách hàng" },
              { label: "Hợp đồng", value: tenantContracts.length, hint: "Tổng số hợp đồng" },
            ]
          : isDispatch
            ? [
                { label: "Yêu cầu mới", value: intakeLeadQueue.length, hint: "Cần phân loại" },
                { label: "Sự cố mở", value: openIssues.length, hint: "Cần nhập liệu/đẩy luồng" },
                {
                  label: "Việc chờ điều phối",
                  value: pendingDispatch.length,
                  hint: "Chuyển CEO phân việc",
                },
              ]
            : isAccountant
              ? [
                  {
                    label: "Mốc thanh toán chưa thu",
                    value: accountantMilestones.length,
                    hint: "Đối soát và nhắc thu",
                  },
                  {
                    label: "Hóa đơn quá hạn",
                    value: overdueInvoices.length,
                    hint: "Xử lý ưu tiên",
                  },
                  { label: "HĐ sắp hết hạn", value: expiringContracts, hint: "Chuẩn bị tái ký" },
                ]
              : isTechMaintenance
                ? [
                    {
                      label: "Việc hôm nay",
                      value: myJobsToday.length,
                      hint: "Cần hoàn tất trong ca",
                    },
                    {
                      label: "Bảo trì/Sửa chữa",
                      value: myMaintenanceToday.length,
                      hint: "Trọng tâm trong ngày",
                    },
                    {
                      label: "Ưu tiên cao",
                      value: myMaintenanceToday.filter(
                        (j) => j.priority === "high" || j.priority === "urgent",
                      ).length,
                      hint: "Làm trước",
                    },
                  ]
                : [
                    {
                      label: "Việc hôm nay",
                      value: myJobsToday.length,
                      hint: "Cần hoàn tất trong ca",
                    },
                    {
                      label: "Lắp đặt",
                      value: myInstallationToday.length,
                      hint: "Checklist theo giai đoạn",
                    },
                    {
                      label: "Ưu tiên cao",
                      value: myInstallationToday.filter(
                        (j) => j.priority === "high" || j.priority === "urgent",
                      ).length,
                      hint: "Làm trước",
                    },
                  ];

    const projectsWaitingEquipment = activeProjects.filter(
      (p) => p.stage === "waiting_for_equipment",
    ).length;

    const actionList =
      isCEO || isPM || isTechManager
        ? [
            projectsWaitingEquipment > 0
              ? `Xác nhận thiết bị đã về cho ${projectsWaitingEquipment} dự án đang chờ`
              : `Rà soát tiến độ lắp đặt của ${activeProjects.length} dự án`,
            `Phân công ${Math.min(urgentJobs.length, 3)} việc khẩn cấp đầu tiên cho kỹ thuật phù hợp`,
            mockContracts.filter((c) => c.accountantVerified && !c.ceoVerified).length > 0
              ? `Duyệt đối soát tiền về từ Kế toán (${mockContracts.filter((c) => c.accountantVerified && !c.ceoVerified).length} mốc)`
              : `Theo dõi dòng tiền từ các hợp đồng thi công`,
            `Mời ký bảo trì cho ${expiringWarranties.length} thang sắp hết hạn bảo hành`,
          ]
        : isSalesAdmin
          ? [
              `Điều phối khảo sát cho ${tenantLeads.filter((l) => l.status === "new").length} lead mới`,
              `Gửi báo giá cho ${tenantLeads.filter((l) => l.status === "surveying").length} lead đã khảo sát`,
              `Follow-up ${Math.min(salesFollowups.length, 5)} lead đang thương thảo`,
              `Rà soát khách hàng sắp hết hạn bảo hành/bảo trì`,
            ]
          : isDispatch
            ? [
                `Tiếp nhận và phân loại ${Math.min(intakeLeadQueue.length, 5)} yêu cầu mới`,
                `Nhập liệu sự cố mở để chuyển luồng xử lý`,
                `Tạo phiếu/đầu việc đầy đủ thông tin trước khi bàn giao`,
              ]
            : isAccountant
              ? [
                  `Đối soát ${Math.min(accountantMilestones.length, 5)} mốc thanh toán cần thu`,
                  `Xử lý ${overdueInvoices.length} hóa đơn quá hạn`,
                  `Theo dõi công nợ phát sinh từ hợp đồng đang chạy`,
                ]
              : [
                  `Hoàn tất ${myJobsToday.length} việc được giao trong ngày`,
                  `Ưu tiên xử lý các việc high/urgent trước`,
                  `Cập nhật biên bản và trạng thái ngay sau khi xử lý`,
                ];

    const personalQueue = isSalesAdmin
      ? salesFollowups.slice(0, 8).map((x) => ({
          id: x.id,
          title: x.name,
          subtitle: `${x.source || "Lead"} · ${x.phone || "Chưa có SĐT"}`,
          status: x.status,
        }))
      : isIntake
        ? intakeLeadQueue.slice(0, 8).map((x) => ({
            id: x.id,
            title: x.name,
            subtitle: `Tiếp nhận: ${x.source || "N/A"}`,
            status: x.status,
          }))
        : isAccountant
          ? accountantMilestones.slice(0, 8).map((x, idx) => ({
              id: `${x.contractId}-${idx}`,
              title: `Mốc thanh toán hợp đồng ${x.contractId}`,
              subtitle: `Đến hạn: ${formatDate(x.dueDate)}`,
              status: "pending",
            }))
          : myJobsToday.slice(0, 8).map((x) => ({
              id: x.id,
              title: x.title,
              subtitle: `${x.type} · ${formatDateTime(x.scheduledFor)}`,
              status: x.status,
            }));

    const personalLinks = isSalesAdmin
      ? [
          { label: "Vào Leads", to: "/admin/leads" as const },
          { label: "Vào Khách hàng", to: "/admin/customers" as const },
        ]
      : isIntake
        ? [
            { label: "Nhập liệu Lead", to: "/admin/leads" as const },
            { label: "Chờ điều phối", to: "/admin/jobs" as const },
          ]
        : isAccountant
          ? [
              { label: "Màn hình Kế toán", to: "/admin/accounting" as const },
              { label: "Danh sách Hợp đồng", to: "/admin/contracts" as const },
            ]
          : [
              { label: "Công việc của tôi", to: "/tech/jobs" as const },
              { label: "Lộ trình hôm nay", to: "/tech/route-plan" as const },
            ];

    return {
      isCEO,
      isPM,
      isSalesAdmin,
      isIntake,
      isDispatch,
      isAccountant,
      isTechManager,
      isTechMaintenance,
      isTechInstallation,
      isTechSurvey,
      currentMonth,

      tenantContracts,
      tenantElevators,
      tenantJobs,
      tenantCustomers,
      tenantLeads,

      totalRevenue,
      expiringContracts,
      overdueElevators,

      upcomingJobs,
      recentContracts,

      monthlyJobs,
      completedJobsThisMonth,
      pendingJobsThisMonth,
      completionRate,

      techPerformance,

      myJobsToday,
      myMaintenanceToday,
      myInstallationToday,
      urgentJobs,
      pendingDispatch,

      headerTitle,
      headerDescription,
      focusMetrics,
      actionList,
      personalQueue,
      personalLinks,
      expiringWarranties,
      myProjects,
      myCompletedCount,
      myUrgentCount,
    };
  }, [
    activeTenantId,
    currentUser,
    permissions,
    isCEO,
    isPM,
    isSalesAdmin,
    isDispatch,
    isAccountant,
    isTechManager,
    isTechMaintenance,
    isTechInstallation,
    isTechSurvey,
  ]);
}
