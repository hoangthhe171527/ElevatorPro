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
  ShieldCheck,
  Wrench,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockContracts, markMilestonePaid, formatVND, formatDate, mockJobs, getCustomer } from "@/lib/mock-data";
import { useState } from "react";
import { useAppStore, useCanWrite } from "@/lib/store";
import { toast } from "sonner";
import { DataPagination } from "@/components/common/DataPagination";
import { cn } from "@/lib/utils";
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

  // Những cái overdue hoặc gần đến hạn - Ưu tiên quá hạn lên đầu
  const sortedMilestones = pendingMilestones.sort((a, b) => {
    const isOverdueA = new Date(a.dueDate) < new Date();
    const isOverdueB = new Date(b.dueDate) < new Date();
    
    if (isOverdueA && !isOverdueB) return -1;
    if (!isOverdueA && isOverdueB) return 1;
    
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

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
              const isOverdue = new Date(ms.dueDate) < new Date();
              const isUrgent = isOverdue || (new Date(ms.dueDate).getTime() - new Date().getTime() < 3 * 24 * 60 * 60 * 1000); // Overdue or within 3 days
              return (
                <div
                  key={ms.id}
                  className={cn(
                    "p-4 flex items-center justify-between hover:bg-muted/50 transition-colors",
                    isOverdue ? "bg-destructive/5" : ""
                  )}
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
                          <Badge variant="destructive" className="h-5 text-[10px] animate-pulse">
                            QUÁ HẠN - CẦN THU NGAY
                          </Badge>
                        )}
                        {!isOverdue && isUrgent && (
                          <Badge className="h-5 text-[10px] bg-orange-500 text-white border-none">
                            CẦN THU TRONG 3 NGÀY
                          </Badge>
                        )}
                        {ms.status === "pending" && !isUrgent && (
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
                      <div className="flex gap-3 mt-2">
                        <button className="text-[10px] font-bold text-primary flex items-center gap-1 hover:underline" onClick={() => toast.info("Đang mở file Báo giá...")}>
                          <FileText className="h-3 w-3" /> XEM BÁO GIÁ
                        </button>
                        <button className="text-[10px] font-bold text-primary flex items-center gap-1 hover:underline" onClick={() => toast.info("Đang mở file Hợp đồng...")}>
                          <ShieldCheck className="h-3 w-3" /> XEM HỢP ĐỒNG
                        </button>
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

      {/* ── A2: Accountant Submission Section ── */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Send className="h-5 w-5 text-primary" />
            Kế toán — Báo cáo dòng thu cho CEO
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {contracts.filter(c => c.paid > 0 && !c.accountantVerified && !c.ceoVerified).map(c => {
               const totalStages = (c.paymentStages.stage1Paid || 0) + (c.paymentStages.stage2Paid || 0) + (c.paymentStages.stage3Paid || 0);
               return (
                 <div key={c.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                    <div className="flex gap-4">
                      <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-semibold">{c.code}</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Tổng thực thu kế toán đã nhập: <span className="font-bold text-foreground">{formatVND(totalStages)}</span> / {formatVND(c.value)}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          Click để chốt số liệu và gửi CEO kiểm tra đối soát.
                        </div>
                      </div>
                    </div>
                    <Button 
                      size="sm"
                      className="gap-1.5"
                      onClick={() => {
                        const updated = contracts.map(item => item.id === c.id ? { ...item, accountantVerified: true } : item);
                        setContracts(updated);
                        // In a real app, this would update the backend
                        toast.success(`Đã gửi báo cáo HĐ ${c.code} lên CEO.`);
                      }}
                    >
                      <Send className="h-4 w-4" /> Gửi CEO duyệt
                    </Button>
                 </div>
               );
            })}
            {contracts.filter(c => c.paid > 0 && !c.accountantVerified && !c.ceoVerified).length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                <p className="text-sm italic">Tất cả số liệu đã được gửi hoặc CEO đã duyệt.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── B1: CEO Đối soát & Duyệt tổng thanh toán ── */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            CEO — Đối soát & Duyệt tổng thanh toán
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {contracts.filter(c => c.accountantVerified && !c.ceoVerified).map(c => {
              const totalPaid = c.paymentStages.stage1Paid + c.paymentStages.stage2Paid + c.paymentStages.stage3Paid;
              const remaining = c.value - totalPaid;
              return (
                <div key={c.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                  <div className="flex gap-4">
                    <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-600">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="font-semibold">{c.code}</div>
                        <Badge className="bg-indigo-100 text-indigo-700 text-[10px]">Kế toán đã xác nhận</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Tổng HĐ: <span className="font-medium text-foreground">{formatVND(c.value)}</span> • 
                        Đã thu: <span className="text-success font-medium">{formatVND(totalPaid)}</span> • 
                        Còn lại: <span className="text-warning-foreground font-medium">{formatVND(remaining)}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        Thiết bị về: {formatVND(c.paymentStages.stage1Paid)} • Hoàn thành lắp: {formatVND(c.paymentStages.stage2Paid)} • Quyết toán: {formatVND(c.paymentStages.stage3Paid)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-destructive border-destructive/30 hover:bg-destructive/5"
                      onClick={() => toast.info("Đã gửi yêu cầu kế toán đối soát lại số liệu.")}
                    >
                      Yêu cầu đối soát
                    </Button>
                    <Button 
                      size="sm"
                      className="bg-success hover:bg-success/90 gap-1.5"
                      onClick={() => {
                        const updated = contracts.map(item => item.id === c.id ? { ...item, ceoVerified: true } : item);
                        setContracts(updated);
                        toast.success(`CEO đã duyệt đối soát HĐ ${c.code}. Hệ thống đã ghi nhận hoàn tất thanh toán.`);
                      }}
                    >
                      <CheckCircle2 className="h-4 w-4" /> CEO Duyệt
                    </Button>
                  </div>
                </div>
              );
            })}
            {contracts.filter(c => c.accountantVerified && !c.ceoVerified).length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                <CheckCircle2 className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
                <p>Không có hợp đồng nào chờ CEO duyệt đối soát.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── A1: Hóa đơn sửa chữa / bảo trì ── */}
      <Card className="mt-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Wrench className="h-5 w-5 text-orange-500" />
              Hóa đơn sửa chữa & Bảo trì
            </CardTitle>
            <Button size="sm" variant="outline" className="gap-1.5">
              <Plus className="h-3.5 w-3.5" /> Tạo hóa đơn
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {mockJobs.filter(j => (j.type === 'repair' || j.type === 'maintenance') && j.status === 'completed' && j.repairQuote).map(j => {
              const cus = getCustomer(j.customerId);
              return (
                <div key={j.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                  <div className="flex gap-4">
                    <div className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${j.type === 'repair' ? 'bg-orange-500/10 text-orange-600' : 'bg-blue-500/10 text-blue-600'}`}>
                      <Wrench className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{j.code}</span>
                        <Badge variant="secondary" className="text-[10px]">{j.type === 'repair' ? 'Sửa chữa' : 'Bảo trì'}</Badge>
                      </div>
                      <div className="text-sm mt-1">{j.title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        KH: {cus?.name} • Tổng: <span className="font-bold text-foreground">{formatVND(j.repairQuote?.total || j.cost || 0)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="gap-1.5"
                      onClick={() => {
                        toast.success(`Đã xuất hóa đơn VAT cho công việc ${j.code}. File PDF đã được tạo.`);
                        setTimeout(() => toast.info("Hệ thống tự động gửi hóa đơn cho khách hàng qua email."), 1000);
                      }}
                    >
                      <FileText className="h-3.5 w-3.5" /> Xuất HĐ VAT
                    </Button>
                    <Button 
                      size="sm" 
                      className="gap-1.5"
                      onClick={() => {
                        toast.success(`Đã gửi hóa đơn cho ${cus?.name}. Đang chờ thanh toán.`);
                      }}
                    >
                      <Send className="h-3.5 w-3.5" /> Gửi KH
                    </Button>
                  </div>
                </div>
              );
            })}
            {mockJobs.filter(j => (j.type === 'repair' || j.type === 'maintenance') && j.status === 'completed' && j.repairQuote).length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                <Wrench className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
                <p>Không có hóa đơn sửa chữa/bảo trì nào cần xử lý.</p>
                <p className="text-xs mt-1">Hóa đơn sẽ xuất hiện khi kỹ thuật viên hoàn thành sửa chữa có báo giá.</p>
              </div>
            )}
          </div>
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
