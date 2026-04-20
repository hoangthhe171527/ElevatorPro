// src/routes/admin.customers.$customerId.tsx  ← FILE MỚI HOÀN TOÀN
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  contractStatusLabel,
  contractStatusVariant,
  elevatorStatusLabel,
  elevatorStatusVariant,
  jobStatusLabel,
  jobStatusVariant,
} from "@/lib/status-variants";
import { Progress } from "@/components/ui/progress";
import {
  mockCustomers,
  mockContracts,
  mockElevators,
  mockJobs,
  mockProjects,
  getProject,
  formatVND,
  formatDate,
  formatDateTime,
} from "@/lib/mock-data";
import {
  CreateJobModal,
  CreateContractModal,
  CreateElevatorModal,
} from "@/components/common/Modals";
import {
  ArrowLeft,
  Building2,
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
  Briefcase,
  Plus,
  QrCode,
} from "lucide-react";

export const Route = createFileRoute("/admin/customers/$customerId")({
  loader: ({ params }) => {
    const customer = mockCustomers.find((c) => c.id === params.customerId);
    if (!customer) throw notFound();
    return { customer };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.customer.name ?? "Khách hàng"} — ElevatorPro` }],
  }),
  notFoundComponent: () => (
    <AppShell>
      <div className="p-12 text-center">
        <p className="text-muted-foreground">Không tìm thấy khách hàng</p>
        <Link to="/admin/customers">
          <Button className="mt-4">Quay lại</Button>
        </Link>
      </div>
    </AppShell>
  ),
  component: CustomerDetail,
});

function CustomerDetail() {
  const { customer } = Route.useLoaderData();
  const [jobOpen, setJobOpen] = useState(false);
  const [contractOpen, setContractOpen] = useState(false);
  const [elevatorOpen, setElevatorOpen] = useState(false);

  const contracts = mockContracts.filter((c) => c.customerId === customer.id);
  const customerProjects = mockProjects.filter((p) => p.customerId === customer.id);
  const projectIds = customerProjects.map((p) => p.id);
  const elevators = mockElevators.filter((e) => projectIds.includes(e.projectId));
  const jobs = mockJobs.filter((j) => j.customerId === customer.id).slice(0, 6);
  const totalRevenue = contracts.reduce((s, c) => s + c.paid, 0);
  const totalContractValue = contracts.reduce((s, c) => s + c.value, 0);

  const typeLabel: Record<string, string> = {
    install: "Lắp đặt",
    maintenance: "Bảo trì",
    repair: "Sửa chữa",
  };

  return (
    <AppShell>
      <Link
        to="/admin/customers"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="h-4 w-4" /> Quay lại danh sách
      </Link>

      <PageHeader
        title={customer.name}
        description={`${customer.type === "business" ? "Doanh nghiệp" : "Cá nhân"} · Khách hàng từ ${formatDate(customer.createdAt)}`}
        actions={
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" size="sm" onClick={() => setElevatorOpen(true)}>
              <Plus className="h-3.5 w-3.5 mr-1" /> Thêm thang
            </Button>
            <Button variant="outline" size="sm" onClick={() => setContractOpen(true)}>
              <Plus className="h-3.5 w-3.5 mr-1" /> Tạo HĐ
            </Button>
            <Button size="sm" onClick={() => setJobOpen(true)}>
              <Plus className="h-3.5 w-3.5 mr-1" /> Tạo công việc
            </Button>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4 mb-6">
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Thang máy</div>
          <div className="mt-1 text-2xl font-bold">{elevators.length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Hợp đồng</div>
          <div className="mt-1 text-2xl font-bold">{contracts.length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Doanh thu đã thu</div>
          <div className="mt-1 text-xl font-bold text-success">{formatVND(totalRevenue)}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Tổng giá trị HĐ</div>
          <div className="mt-1 text-xl font-bold text-primary">{formatVND(totalContractValue)}</div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Left: info + elevators */}
        <div className="space-y-4">
          {/* Contact info */}
          <Card className="p-5">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              {customer.type === "business" ? (
                <Building2 className="h-4 w-4" />
              ) : (
                <User className="h-4 w-4" />
              )}
              Thông tin liên hệ
            </h3>
            <div className="space-y-2 text-sm">
              <div className="text-muted-foreground text-xs">Người liên hệ</div>
              <div className="font-medium">{customer.contactPerson}</div>
              <a
                href={`tel:${customer.phone}`}
                className="flex items-center gap-1.5 text-primary text-sm"
              >
                <Phone className="h-3.5 w-3.5" /> {customer.phone}
              </a>
              <a
                href={`mailto:${customer.email}`}
                className="flex items-center gap-1.5 text-primary text-sm"
              >
                <Mail className="h-3.5 w-3.5" /> {customer.email}
              </a>
              <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" /> {customer.address}
              </div>
            </div>
          </Card>

          {/* Elevators */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Building2 className="h-4 w-4" /> Thang máy ({elevators.length})
              </h3>
            </div>
            <div className="space-y-2">
              {elevators.map((e) => (
                <div
                  key={e.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/30 text-sm"
                >
                  <div className="min-w-0">
                    <div className="font-mono font-semibold">{e.code}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {e.brand} {e.model} · {e.building}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-2 shrink-0">
                    <StatusBadge variant={elevatorStatusVariant[e.status]}>
                      {elevatorStatusLabel[e.status]}
                    </StatusBadge>
                    <Link to="/admin/elevators/$elevatorId/qr" params={{ elevatorId: e.id }}>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <QrCode className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
              {elevators.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">Chưa có thang máy</p>
              )}
            </div>
          </Card>
        </div>

        {/* Right: contracts + jobs */}
        <div className="lg:col-span-2 space-y-4">
          {/* Contracts */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4" /> Hợp đồng ({contracts.length})
              </h3>
            </div>
            <div className="space-y-3">
              {contracts.map((c) => {
                const percent = c.value > 0 ? Math.round((c.paid / c.value) * 100) : 0;
                return (
                  <div key={c.id} className="p-3 rounded-lg border">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className="font-semibold text-sm">{c.code}</span>
                      <StatusBadge variant={contractStatusVariant[c.status]}>
                        {contractStatusLabel[c.status]}
                      </StatusBadge>
                      <Badge variant="outline" className="text-[10px]">
                        {typeLabel[c.type]}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mb-2">
                      {formatDate(c.startDate)} → {formatDate(c.endDate)}
                    </div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">
                        {formatVND(c.paid)} / {formatVND(c.value)}
                      </span>
                      <span className="font-medium">{percent}%</span>
                    </div>
                    <Progress value={percent} className="h-1" />
                  </div>
                );
              })}
              {contracts.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">Chưa có hợp đồng</p>
              )}
            </div>
          </Card>

          {/* Recent jobs */}
          <Card className="p-5">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Briefcase className="h-4 w-4" /> Công việc gần đây
            </h3>
            <div className="space-y-2">
              {jobs.map((j) => (
                <Link
                  key={j.id}
                  to="/admin/jobs/$jobId"
                  params={{ jobId: j.id }}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/30 text-sm"
                >
                  <div className="min-w-0">
                    <div className="font-medium truncate">{j.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatDateTime(j.scheduledFor)}
                    </div>
                  </div>
                  <StatusBadge variant={jobStatusVariant[j.status]}>
                    {jobStatusLabel[j.status]}
                  </StatusBadge>
                </Link>
              ))}
              {jobs.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">Chưa có công việc</p>
              )}
            </div>
          </Card>
        </div>
      </div>

      <CreateJobModal
        open={jobOpen}
        onClose={() => setJobOpen(false)}
        defaultCustomerId={customer.id}
      />
      <CreateContractModal
        open={contractOpen}
        onClose={() => setContractOpen(false)}
        defaultCustomerId={customer.id}
      />
      <CreateElevatorModal
        open={elevatorOpen}
        onClose={() => setElevatorOpen(false)}
        defaultCustomerId={customer.id}
      />
    </AppShell>
  );
}
