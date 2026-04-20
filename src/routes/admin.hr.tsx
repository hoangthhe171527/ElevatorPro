import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserPlus, Clock, ClipboardCheck, Briefcase, Award, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockUsers, mockJobs, mockRequests } from "@/lib/mock-data";
import { useAppStore, useCanWrite } from "@/lib/store";
import { useState } from "react";
import { DataPagination } from "@/components/common/DataPagination";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin/hr")({
  head: () => ({ meta: [{ title: "Nhân sự & Hiệu suất — ElevatorPro" }] }),
  component: HRPage,
});

const PAGE_SIZE = 5;

function HRPage() {
  const activeTenantId = useAppStore((s) => s.activeTenantId);
  const canManageHR = useCanWrite("hr");
  const [page, setPage] = useState(1);

  // Filter users belonging to current tenant
  const staff = mockUsers.filter((u) => u.memberships.some((m) => m.tenantId === activeTenantId));
  const pagedStaff = staff.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <AppShell>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <PageHeader
          title="Nhân sự & Hiệu suất"
          description={
            activeTenantId === "t-1"
              ? "Hệ thống quản lý nhân sự chuyên môn hóa - Công ty Lớn"
              : "Nhân sự đa nhiệm - Công ty Nhỏ"
          }
        />
        {canManageHR && (
          <div className="flex gap-2">
            <Button className="gap-2">
              <UserPlus className="h-4 w-4" /> Tuyển dụng mới
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng nhân sự</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{staff.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Đang hoạt động trong kỳ</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Công việc hoàn thành</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {
                mockJobs.filter((j) => j.status === "completed" && j.tenantId === activeTenantId)
                  .length
              }
            </div>
            <p className="text-xs text-muted-foreground mt-1">Tổng cộng các dự án & bảo trì</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Yêu cầu chờ duyệt</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning-foreground">
              {
                mockRequests.filter((r) => r.status === "pending" && r.tenantId === activeTenantId)
                  .length
              }
            </div>
            <p className="text-xs text-muted-foreground mt-1">Đơn từ cần cấp trên xử lý</p>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/30 border-b">
          <CardTitle className="text-base uppercase tracking-wider font-bold">
            Danh sách đội ngũ
          </CardTitle>
        </CardHeader>
        <div className="divide-y">
          {pagedStaff.map((u) => {
            const completedJobs = mockJobs.filter(
              (j) => j.assignedTo === u.id && j.status === "completed",
            ).length;
            const ongoingJobs = mockJobs.filter(
              (j) =>
                j.assignedTo === u.id && (j.status === "scheduled" || j.status === "in_progress"),
            ).length;

            return (
              <div
                key={u.id}
                className="p-4 flex flex-col lg:flex-row lg:items-center gap-4 hover:bg-muted/20 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <Avatar className="h-10 w-10 border">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                      {u.name
                        .split(" ")
                        .slice(-2)
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-sm">{u.name.split("(")[0]}</div>
                    <div className="text-xs text-muted-foreground font-medium text-primary">
                      {u.name.split("(")[1]?.replace(")", "") || "Nhân sự"}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-12 flex-[2]">
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase font-bold mb-1">
                      Liên hệ
                    </div>
                    <div className="text-xs font-medium">{u.phone}</div>
                    <div className="text-[10px] text-muted-foreground truncate">{u.email}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase font-bold mb-1">
                      Tiến độ Job
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="text-[10px] h-5 bg-success/5 text-success border-success/20"
                      >
                        {completedJobs} Xong
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-[10px] h-5 bg-info/5 text-info border-info/20"
                      >
                        {ongoingJobs} Đang làm
                      </Badge>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="text-[10px] text-muted-foreground uppercase font-bold mb-1">
                      Hiệu suất
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      <TrendingUp className="h-3 w-3 text-success" />
                      <span className="font-bold">
                        {((completedJobs / (completedJobs + ongoingJobs || 1)) * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" className="text-xs">
                    Chi tiết
                  </Button>
                  {canManageHR && (
                    <Button variant="outline" size="sm" className="text-xs">
                      Điều chuyển
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <DataPagination
          page={page}
          pageSize={PAGE_SIZE}
          total={staff.length}
          onPageChange={setPage}
        />
      </Card>
    </AppShell>
  );
}
