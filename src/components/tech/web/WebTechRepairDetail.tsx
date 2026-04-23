import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useAppStore, useCurrentPermissions } from "@/lib/store";
import {
  mockJobs,
  getCustomer,
  getElevator,
  getUser,
  formatDateTime,
  formatVND,
  mockInventory,
  mockInvoices,
  type Job,
  type JobStatus,
} from "@/lib/mock-data";
import {
  ArrowLeft,
  Wrench,
  Camera,
  CheckCircle2,
  Package,
  Plus,
  Trash2,
  Send,
  MapPin,
  Clock,
  ShieldCheck,
  History,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "@tanstack/react-router";

export function WebTechRepairDetail({ job, readonly = false }: { job: Job; readonly?: boolean }) {
  const navigate = useNavigate();
  const customer = getCustomer(job.customerId);
  const elevator = job.elevatorId ? getElevator(job.elevatorId) : undefined;

  const [report, setReport] = useState(job.report || "");
  const [status, setStatus] = useState<JobStatus>(job.status);
  const [parts, setParts] = useState(job.repairQuote?.items || []);
  const [beforePhotos, setBeforePhotos] = useState<string[]>(job.beforePhotos || []);
  const [afterPhotos, setAfterPhotos] = useState<string[]>(job.afterPhotos || []);

  const totalAmount = parts.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const addPart = (partId: string) => {
    const item = mockInventory.find((i) => i.id === partId);
    if (!item) return;

    const existing = parts.find((p) => p.id === partId);
    if (existing) {
      setParts(parts.map((p) => (p.id === partId ? { ...p, quantity: p.quantity + 1 } : p)));
    } else {
      setParts([...parts, { id: item.id, name: item.name, price: item.unitPrice, quantity: 1 }]);
    }
  };

  const removePart = (id: string) => {
    setParts(parts.filter((p) => p.id !== id));
  };

  const handleSendQuote = () => {
    if (beforePhotos.length === 0) {
      toast.error("BẮT BUỘC: Chụp ảnh hiện trường hư hỏng trước khi báo giá!");
      return;
    }
    if (parts.length === 0) {
      toast.error("Vui lòng thêm linh kiện cần thay thế!");
      return;
    }
    // Update job in mock data
    const idx = mockJobs.findIndex((j) => j.id === job.id);
    if (idx !== -1) {
      mockJobs[idx] = {
        ...mockJobs[idx],
        report,
        beforePhotos,
        repairQuote: {
          items: parts,
          total: totalAmount,
          isApproved: false,
        },
        status: "payment_pending",
      };
    }
    setStatus("payment_pending");
    toast.success("Đã gửi báo giá lên CEO. Đang chờ phê duyệt!");
  };

  const handleComplete = () => {
    if (afterPhotos.length === 0) {
      toast.error("BẮT BUỘC: Chụp ảnh kết quả sau khi sửa chữa!");
      return;
    }
    setStatus("completed");
    toast.success("Đã hoàn tất sửa chữa!");
  };

  const permissions = useCurrentPermissions();
  const isCEO =
    permissions.includes("tech_manager") ||
    permissions.includes("tech_manager") ||
    permissions.includes("tech_manager");

  const handleCEOApprove = () => {
    // Generate invoice and schedule job
    const newInvoice = {
      tenantId: job.tenantId,
      id: `inv-rep-${Date.now()}`,
      code: `HDSC-${job.code}`,
      customerId: job.customerId,
      targetType: "contract" as const,
      targetId: job.contractId || "",
      amount: totalAmount,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: "sent" as const,
      description: `Chi phí sửa chữa/thay thế linh kiện theo phiếu ${job.code}`,
      createdAt: new Date().toISOString(),
    };
    mockInvoices.push(newInvoice);

    const idx = mockJobs.findIndex((j) => j.id === job.id);
    if (idx !== -1) {
      mockJobs[idx] = { ...mockJobs[idx], status: "scheduled", isManagerApproved: true };
    }
    setStatus("scheduled");
    toast.success("CEO Đã duyệt báo giá! Hóa đơn đã được gửi cho khách hàng.");
  };

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto">
        <Link
          to="/admin/repairs"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary mb-6 font-bold transition-all"
        >
          <ArrowLeft className="h-4 w-4" /> Quay lại danh sách Sửa chữa
        </Link>

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-none px-3 py-1 rounded-lg font-black text-[10px] uppercase tracking-widest">
                Công việc Sửa chữa
              </Badge>
              <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">
                Mã: {job.code}
              </span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">{job.title}</h1>
            <p className="text-slate-500 font-medium mt-1 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" /> {customer?.address}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {status === "in_progress" && !readonly && (
              <Button
                onClick={handleSendQuote}
                className="h-14 px-8 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-2xl shadow-xl shadow-orange-200 gap-3"
              >
                <Send className="h-5 w-5" /> GỬI BÁO GIÁ CHO CEO
              </Button>
            )}
            {status === "payment_pending" && isCEO && (
              <Button
                onClick={handleCEOApprove}
                className="h-14 px-8 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-xl shadow-emerald-200 gap-3"
              >
                <ShieldCheck className="h-5 w-5" /> XÁC NHẬN & XUẤT HÓA ĐƠN
              </Button>
            )}
            {status === "payment_pending" && !isCEO && (
              <Badge className="h-14 px-8 bg-slate-100 text-slate-500 font-black rounded-2xl border-none flex items-center gap-2">
                <Clock className="h-5 w-5" /> ĐANG CHỜ CEO PHÊ DUYỆT BÁO GIÁ
              </Badge>
            )}
            {status === "scheduled" && !readonly && (
              <Button
                onClick={() => {
                  setStatus("in_progress");
                  toast.success("Bắt đầu xử lý!");
                }}
                className="h-14 px-8 bg-primary hover:bg-primary/90 text-white font-black rounded-2xl shadow-xl shadow-primary/20 gap-3"
              >
                <Wrench className="h-5 w-5" /> BẮT ĐẦU SỬA CHỮA
              </Button>
            )}
            {status === "completed" && (
              <Badge className="h-14 px-8 bg-emerald-500 text-white font-black rounded-2xl border-none flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" /> ĐÃ HOÀN TẤT
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Diagnostic & Photos */}
            <Card className="rounded-[2.5rem] border-none shadow-xl shadow-slate-200/50 overflow-hidden">
              <CardHeader className="bg-slate-50 border-b p-8">
                <CardTitle className="text-xl font-black flex items-center gap-3">
                  <Camera className="h-6 w-6 text-primary" /> Chẩn đoán & Hình ảnh hiện trường
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="space-y-4">
                  <label className="text-sm font-black uppercase tracking-widest text-slate-400">
                    Mô tả tình trạng hư hỏng
                  </label>
                  <Textarea
                    placeholder="Nhập chi tiết lỗi, nguyên nhân dự kiến..."
                    className="min-h-[120px] rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all text-lg font-medium"
                    value={report}
                    onChange={(e) => setReport(e.target.value)}
                    disabled={readonly || status === "completed"}
                  />
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-black uppercase tracking-widest text-slate-400">
                        Ảnh hiện trạng ({beforePhotos.length})
                      </label>
                      {status === "in_progress" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setBeforePhotos([...beforePhotos, "/placeholder.svg"])}
                          className="text-primary font-bold"
                        >
                          <Plus className="h-4 w-4 mr-1" /> Thêm ảnh
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {beforePhotos.map((p, i) => (
                        <div
                          key={i}
                          className="aspect-video bg-slate-100 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center relative group overflow-hidden"
                        >
                          <Camera className="h-8 w-8 text-slate-300" />
                          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button
                              variant="destructive"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                              onClick={() =>
                                setBeforePhotos(beforePhotos.filter((_, idx) => idx !== i))
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      {beforePhotos.length === 0 && (
                        <div className="col-span-2 py-12 text-center border-2 border-dashed border-slate-100 rounded-[2rem] text-slate-400 font-bold italic">
                          Chưa có ảnh chụp hư hỏng
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-black uppercase tracking-widest text-slate-400">
                        Ảnh sau khi sửa ({afterPhotos.length})
                      </label>
                      {status === "in_progress" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setAfterPhotos([...afterPhotos, "/placeholder.svg"])}
                          className="text-primary font-bold"
                        >
                          <Plus className="h-4 w-4 mr-1" /> Thêm ảnh
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {afterPhotos.map((p, i) => (
                        <div
                          key={i}
                          className="aspect-video bg-slate-100 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center relative group overflow-hidden"
                        >
                          <Camera className="h-8 w-8 text-slate-300" />
                        </div>
                      ))}
                      {afterPhotos.length === 0 && (
                        <div className="col-span-2 py-12 text-center border-2 border-dashed border-slate-100 rounded-[2rem] text-slate-400 font-bold italic">
                          Chưa có ảnh sau hoàn tất
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Parts & Quote */}
            <Card className="rounded-[2.5rem] border-none shadow-xl shadow-slate-200/50 overflow-hidden">
              <CardHeader className="bg-slate-50 border-b p-8">
                <CardTitle className="text-xl font-black flex items-center gap-3">
                  <Package className="h-6 w-6 text-primary" /> Vật tư thay thế & Báo giá
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="flex gap-2 mb-6">
                    <Select defaultValue="" onValueChange={addPart}>
                      <option value="" disabled>
                        -- Chọn linh kiện cần thay --
                      </option>
                      {mockInventory.slice(0, 10).map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name} - {formatVND(item.unitPrice)}
                        </option>
                      ))}
                    </Select>
                  </div>

                  <div className="rounded-[2rem] border overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 border-b">
                        <tr>
                          <th className="px-6 py-4 text-left font-black uppercase text-[10px] tracking-widest text-slate-400">
                            Linh kiện
                          </th>
                          <th className="px-6 py-4 text-center font-black uppercase text-[10px] tracking-widest text-slate-400">
                            Số lượng
                          </th>
                          <th className="px-6 py-4 text-right font-black uppercase text-[10px] tracking-widest text-slate-400">
                            Đơn giá
                          </th>
                          <th className="px-6 py-4 text-right font-black uppercase text-[10px] tracking-widest text-slate-400">
                            Thành tiền
                          </th>
                          <th className="px-6 py-4 w-10"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {parts.map((p) => (
                          <tr key={p.id}>
                            <td className="px-6 py-4 font-bold text-slate-700">{p.name}</td>
                            <td className="px-6 py-4 text-center font-bold">
                              <div className="flex items-center justify-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() =>
                                    setParts(
                                      parts.map((x) =>
                                        x.id === p.id
                                          ? { ...x, quantity: Math.max(1, x.quantity - 1) }
                                          : x,
                                      ),
                                    )
                                  }
                                >
                                  -
                                </Button>
                                <span>{p.quantity}</span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() =>
                                    setParts(
                                      parts.map((x) =>
                                        x.id === p.id ? { ...x, quantity: x.quantity + 1 } : x,
                                      ),
                                    )
                                  }
                                >
                                  +
                                </Button>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right font-bold text-slate-500">
                              {formatVND(p.price)}
                            </td>
                            <td className="px-6 py-4 text-right font-black text-slate-900">
                              {formatVND(p.price * p.quantity)}
                            </td>
                            <td className="px-6 py-4">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-400 hover:text-red-600"
                                onClick={() => removePart(p.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                        {parts.length === 0 && (
                          <tr>
                            <td
                              colSpan={5}
                              className="px-6 py-12 text-center text-slate-400 font-bold italic"
                            >
                              Chưa chọn vật tư nào
                            </td>
                          </tr>
                        )}
                      </tbody>
                      <tfoot className="bg-slate-50/50">
                        <tr>
                          <td
                            colSpan={3}
                            className="px-6 py-6 text-right font-black uppercase tracking-widest text-slate-400"
                          >
                            Tổng cộng ước tính
                          </td>
                          <td className="px-6 py-6 text-right font-black text-2xl text-primary">
                            {formatVND(totalAmount)}
                          </td>
                          <td></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="rounded-[2.5rem] border-none shadow-xl shadow-slate-200/40 p-8 bg-slate-900 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <ShieldCheck className="h-32 w-32" />
              </div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
                <ShieldCheck className="h-3 w-3" /> Thông tin thang máy
              </h4>
              <div className="space-y-6 relative z-10">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">
                    Khách hàng
                  </div>
                  <div className="font-black text-lg">{customer?.name}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">
                    Thiết bị
                  </div>
                  <div className="text-sm font-black text-primary">
                    {elevator?.brand} - {elevator?.model}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 uppercase font-bold">
                    Mã thang: {elevator?.code}
                  </div>
                </div>
                <div className="pt-4 border-t border-white/10">
                  <div className="text-[10px] text-slate-400 uppercase font-bold mb-3">
                    Tình trạng bảo hành
                  </div>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 px-3 py-1 rounded-lg">
                    CÒN BẢO HÀNH (Đến 12/2026)
                  </Badge>
                </div>
              </div>
            </Card>

            <Card className="rounded-[2.5rem] border-2 border-slate-100 p-8">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                <History className="h-3 w-3" /> Lịch sử sửa chữa gần đây
              </h4>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                    <Wrench className="h-5 w-5 text-slate-400" />
                  </div>
                  <div>
                    <div className="text-sm font-black">Thay cáp tải</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">
                      12/01/2024 • Thợ: Lâm CEO
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 opacity-50">
                  <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                    <Plus className="h-5 w-5 text-slate-400" />
                  </div>
                  <div className="text-sm font-bold italic text-slate-400">
                    Không có dữ liệu khác
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function Select({ children, defaultValue, onValueChange, className }: any) {
  return (
    <select
      className={cn(
        "h-12 w-full rounded-2xl border-slate-200 bg-white px-4 font-bold text-slate-700 shadow-sm focus:ring-2 focus:ring-primary/20 transition-all",
        className,
      )}
      defaultValue={defaultValue}
      onChange={(e) => onValueChange(e.target.value)}
    >
      {children}
    </select>
  );
}
