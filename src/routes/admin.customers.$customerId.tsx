// src/routes/admin.customers.$customerId.tsx  ← FILE MỚI HOÀN TOÀN
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/common/StatusBadge";;
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
  Clock,
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
  const [selectedElevatorId, setSelectedElevatorId] = useState<string | null>(null);
  const [contractOpen, setContractOpen] = useState(false);
  const [elevatorOpen, setElevatorOpen] = useState(false);

  // Data fetching
  const customerProjects = mockProjects.filter((p) => p.customerId === customer.id);
  const projectIds = customerProjects.map((p) => p.id);
  const elevators = mockElevators.filter((e) => projectIds.includes(e.projectId));

  const selectedElevator = elevators.find((e) => e.id === selectedElevatorId);
  const elevatorContracts = selectedElevator
    ? mockContracts.filter(
        (c) => c.elevatorId === selectedElevator.id || c.projectId === selectedElevator.projectId,
      )
    : [];

  const expiringContract = elevatorContracts.find((c) => c.status === "expiring");

  const handleBack = () => {
    if (selectedElevatorId) {
      setSelectedElevatorId(null);
    }
  };

  return (
    <AppShell>
      <div className="mb-6">
        <Link
          to="/admin/customers"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4" /> Quay lại danh sách khách hàng
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              {customer.name}
              <Badge
                variant="secondary"
                className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-100 uppercase text-[10px] font-bold"
              >
                {customer.type === "business" ? "Doanh nghiệp" : "Cá nhân"}
              </Badge>
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              {selectedElevatorId
                ? `Chi tiết thang máy: ${selectedElevator?.code}`
                : `Quản lý danh sách thang máy và hợp đồng của khách hàng`}
            </p>
          </div>

          {!selectedElevatorId && (
            <Button
              className="rounded-xl px-6 h-11 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 font-bold"
              onClick={() => setElevatorOpen(true)}
            >
              <Plus className="h-5 w-5 mr-2" /> THÊM THANG MÁY
            </Button>
          )}
        </div>
      </div>

      {!selectedElevatorId ? (
        /* LIST OF ELEVATORS */
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {elevators.map((e) => (
            <Card
              key={e.id}
              className="p-5 hover:border-primary/50 cursor-pointer transition-all hover:shadow-md group relative overflow-hidden"
              onClick={() => setSelectedElevatorId(e.id)}
            >
              <div className="absolute top-0 right-0 p-3">
                <StatusBadge variant={elevatorStatusVariant[e.status]}>
                  {elevatorStatusLabel[e.status]}
                </StatusBadge>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors mb-4">
                <Building2 className="h-6 w-6" />
              </div>
              <h3 className="font-black text-slate-800 text-lg mb-1">{e.code}</h3>
              <p className="text-sm text-slate-500 font-medium mb-4">
                {e.brand} · {e.model} · {e.floors} Tầng
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Xem chi tiết & Hợp đồng
                </span>
                <QrCode className="h-4 w-4 text-slate-300" />
              </div>
            </Card>
          ))}
          {elevators.length === 0 && (
            <Card className="col-span-full p-12 flex flex-col items-center justify-center text-center bg-slate-50/50 border-dashed">
              <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
                <Building2 className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-slate-900">Chưa có thang máy nào</h3>
              <p className="text-slate-500 text-sm max-w-[250px] mt-2">
                Bắt đầu bằng cách thêm thang máy đầu tiên cho khách hàng này.
              </p>
              <Button
                variant="outline"
                className="mt-6 rounded-xl"
                onClick={() => setElevatorOpen(true)}
              >
                Thêm ngay
              </Button>
            </Card>
          )}
        </div>
      ) : (
        /* ELEVATOR DETAIL VIEW */
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="font-bold text-primary hover:bg-primary/5"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Quay lại danh sách thang
          </Button>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Elevator Info Summary */}
            <Card className="p-6 h-fit bg-slate-900 text-white border-none shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center">
                  <Building2 className="h-7 w-7 text-white" />
                </div>
                <StatusBadge variant={elevatorStatusVariant[selectedElevator!.status]}>
                  {elevatorStatusLabel[selectedElevator!.status]}
                </StatusBadge>
              </div>
              <h2 className="text-2xl font-black mb-1">{selectedElevator?.code}</h2>
              <p className="text-white/60 text-sm font-medium mb-6">
                {selectedElevator?.brand} {selectedElevator?.model}
              </p>

              <div className="space-y-4 pt-6 border-t border-white/10">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/40">Vị trí</span>
                  <span className="font-bold text-right">{selectedElevator?.building}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/40">Bảo hành đến</span>
                  <span className="font-bold">{formatDate(selectedElevator!.warrantyUntil)}</span>
                </div>
              </div>

              {/* ACTION: CREATE CONTRACT (Logic: Multi-elevator + New) */}
              {elevators.length >= 2 && (
                <Button
                  className="w-full mt-8 bg-white text-slate-900 hover:bg-white/90 rounded-xl font-black py-6 h-auto"
                  onClick={() => setContractOpen(true)}
                >
                  <FileText className="h-5 w-5 mr-2" /> TẠO HỢP ĐỒNG MỚI
                </Button>
              )}
            </Card>

            {/* Contracts List */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="font-black text-slate-800 flex items-center gap-2 px-1">
                <FileText className="h-5 w-5 text-primary" /> DANH SÁCH HỢP ĐỒNG
              </h3>

              {/* EXPIRING ALERT */}
              {expiringContract && (
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start gap-3 animate-pulse">
                  <Clock className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-amber-900 text-sm">Hợp đồng sắp hết hạn!</h4>
                    <p className="text-amber-700 text-xs mt-1">
                      Hợp đồng {expiringContract.code} sẽ hết hạn vào{" "}
                      {formatDate(expiringContract.endDate)}. Cần liên hệ khách hàng để tư vấn tái
                      ký ngay.
                    </p>
                  </div>
                </div>
              )}

              <div className="grid gap-4">
                {elevatorContracts.map((c) => {
                  const percent = c.value > 0 ? Math.round((c.paid / c.value) * 100) : 0;
                  return (
                    <Card key={c.id} className="p-5 hover:border-slate-300 transition-colors">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-slate-800">{c.code}</span>
                          <Badge variant="secondary" className="text-[9px] uppercase font-bold">
                            {c.type === "install"
                              ? "Lắp đặt"
                              : c.type === "maintenance"
                                ? "Bảo trì"
                                : "Sửa chữa"}
                          </Badge>
                        </div>
                        <StatusBadge variant={contractStatusVariant[c.status]}>
                          {contractStatusLabel[c.status]}
                        </StatusBadge>
                      </div>

                      <div className="flex items-center gap-6 text-sm mb-6">
                        <div>
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                            Thời hạn
                          </div>
                          <div className="font-bold text-slate-700">
                            {formatDate(c.startDate)} — {formatDate(c.endDate)}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                            Giá trị
                          </div>
                          <div className="font-bold text-primary">{formatVND(c.value)}</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-tight">
                          <span className="text-slate-400">Tiến độ thanh toán</span>
                          <span className="text-slate-900">{percent}%</span>
                        </div>
                        <Progress value={percent} className="h-2 bg-slate-100" />
                      </div>
                    </Card>
                  );
                })}
                {elevatorContracts.length === 0 && (
                  <div className="p-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <p className="text-slate-500 font-medium">
                      Thang máy này chưa có hợp đồng dịch vụ.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <CreateContractModal
        open={contractOpen}
        onClose={() => setContractOpen(false)}
        defaultCustomerId={customer.id}
        defaultElevatorId={selectedElevatorId || undefined}
      />
      <CreateElevatorModal
        open={elevatorOpen}
        onClose={() => setElevatorOpen(false)}
        defaultCustomerId={customer.id}
      />
    </AppShell>
  );
}
