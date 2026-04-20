import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Wallet,
  Receipt,
  FileText,
  TrendingUp,
  Download,
  Plus,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockContracts, markMilestonePaid, formatVND, formatDate } from "@/lib/mock-data";
import { useState } from "react";
import { useAppStore, useCanWrite } from "@/lib/store";
import { DataPagination } from "@/components/common/DataPagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/admin/accounting")({
  head: () => ({ meta: [{ title: "Kế toán — ElevatorPro" }] }),
  component: AccountingPage,
});

function AccountingPage() {
  const [contracts, setContracts] = useState(mockContracts);

  // Thống kê nhanh
  const totalRevenueThisMonth = contracts.reduce((acc, c) => acc + c.paid, 0); // Mẫu: c.paid hiện tại

  // Tổng hợp tất cả các milestone chưa thanh toán
  const pendingMilestones = contracts
    .flatMap((c) =>
      c.milestones.map((m) => ({
        ...m,
        contractCode: c.code,
        customerId: c.customerId,
        contractId: c.id,
      })),
    )
    .filter((m) => m.status !== "paid");

  // Những cái overdue hoặc gần đến hạn
  const sortedMilestones = pendingMilestones.sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
  );

  // Pagination & Modal State
  const activeTenantId = useAppStore((s) => s.activeTenantId);
  const canAcc = useCanWrite("accounting");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const paginatedMilestones = sortedMilestones.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const [confirmMilestone, setConfirmMilestone] = useState<{
    contractId: string;
    id: string;
    amount: number;
  } | null>(null);

  const confirmMarkPaid = (contractId: string, id: string, amount: number) => {
    setConfirmMilestone({ contractId, id, amount });
  };

  const handleMarkPaid = () => {
    if (!confirmMilestone) return;
    markMilestonePaid(confirmMilestone.contractId, confirmMilestone.id);
    setContracts([...mockContracts]); // refresh
    setConfirmMilestone(null);
  };

  return (
    <AppShell>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <PageHeader
          title="Kế toán & Công nợ"
          description="Quản lý hóa đơn, thu chi và thanh toán hợp đồng"
        />
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" /> Xuất Excel
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Tạo Hóa Đơn
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng thực thu (Đã cọc)</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatVND(totalRevenueThisMonth)}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center text-success">
              <TrendingUp className="h-3 w-3 mr-1" /> Toàn thời gian
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Công nợ chờ thu</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning-foreground">
              {formatVND(pendingMilestones.reduce((acc, m) => acc + m.amount, 0))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Từ {pendingMilestones.length} đợt thanh toán
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chi phí vận hành</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">210,000,000₫</div>
            <p className="text-xs text-muted-foreground mt-1">Vật tư & Lương nhân sự</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hóa đơn chờ xử lý</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground mt-1">Cần xuất VAT</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Kế hoạch thu tiền dự án</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {paginatedMilestones.map((ms) => {
              const isOverdue = new Date(ms.dueDate) < new Date("2026-04-19"); // Mock current date logic
              return (
                <div
                  key={ms.id}
                  className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                >
                  <div className="flex gap-4">
                    <div
                      className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${isOverdue ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}`}
                    >
                      {isOverdue ? (
                        <AlertTriangle className="h-5 w-5" />
                      ) : (
                        <Receipt className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="font-semibold">{ms.name}</div>
                        {isOverdue && (
                          <Badge variant="destructive" className="h-5 text-[10px]">
                            Quá hạn
                          </Badge>
                        )}
                        {ms.status === "pending" && !isOverdue && (
                          <Badge
                            variant="outline"
                            className="h-5 text-[10px] text-warning-foreground border-warning-foreground bg-warning-foreground/10"
                          >
                            Sắp đến
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center mt-1">
                        Hợp đồng:{" "}
                        <span className="font-medium text-foreground mx-1">{ms.contractCode}</span>•
                        Hạn chót: {formatDate(ms.dueDate)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-bold text-lg">{formatVND(ms.amount)}</div>
                    </div>
                    {canAcc ? (
                      <Button
                        onClick={() => confirmMarkPaid(ms.contractId, ms.id, ms.amount)}
                        className="gap-2"
                        variant={isOverdue ? "default" : "secondary"}
                      >
                        <CheckCircle2 className="h-4 w-4" /> Đã Thu
                      </Button>
                    ) : (
                      <Badge variant="outline" className="opacity-50 border-dashed">
                        Chờ đối soát
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
            {sortedMilestones.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                <CheckCircle2 className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
                <p>Không có công nợ nào cần thu lúc này.</p>
              </div>
            )}
          </div>
          <DataPagination
            page={currentPage}
            total={sortedMilestones.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </CardContent>
      </Card>

      <Dialog open={!!confirmMilestone} onOpenChange={(open) => !open && setConfirmMilestone(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Xác nhận đã thu tiền</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            Bạn xác nhận đã nhận đủ số tiền{" "}
            <span className="font-bold text-success">
              {confirmMilestone ? formatVND(confirmMilestone.amount) : 0}
            </span>{" "}
            chứ? (Hành động này sẽ cập nhật công nợ hợp đồng và không thể hoàn tác).
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmMilestone(null)}>
              Hủy
            </Button>
            <Button
              className="bg-success text-success-foreground hover:bg-success/90"
              onClick={handleMarkPaid}
            >
              Xác nhận Đã Thu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
