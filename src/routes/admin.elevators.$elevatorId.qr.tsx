import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import QRCode from "react-qr-code";
import { mockElevators, getCustomer, getProject } from "@/lib/mock-data";
import {
  ArrowLeft,
  Download,
  Printer,
  Copy,
  ExternalLink,
  Building2,
  Shield,
  ScanLine,
} from "lucide-react";
import { toast } from "sonner";
import { useRef } from "react";

export const Route = createFileRoute("/admin/elevators/$elevatorId/qr")({
  loader: ({ params }) => {
    const elevator = mockElevators.find((e) => e.id === params.elevatorId);
    if (!elevator) throw notFound();
    return { elevator };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `Mã QR - ${loaderData?.elevator.code ?? "Thang máy"} — ElevatorPro` }],
  }),
  notFoundComponent: () => (
    <AppShell>
      <div className="p-12 text-center">
        <p className="text-muted-foreground">Không tìm thấy thang máy</p>
        <Link to="/admin/elevators">
          <Button className="mt-4">Quay lại</Button>
        </Link>
      </div>
    </AppShell>
  ),
  component: ElevatorQRAdmin,
});

function ElevatorQRAdmin() {
  const { elevator } = Route.useLoaderData();
  const project = getProject(elevator.projectId);
  const customer = project ? getCustomer(project.customerId) : undefined;
  const qrRef = useRef<HTMLDivElement>(null);

  // MOCK: Generate the real URL that passengers will scan
  const publicUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/qr/${elevator.id}`
      : `https://elevatorpro.vn/qr/${elevator.id}`;

  const handlePrint = () => {
    toast.success("Đang chuẩn bị trang in...");
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(publicUrl);
    toast.success("Đã sao chép liên kết vào clipboard", {
      description: publicUrl,
    });
  };

  const handleDownload = () => {
    toast.info("Đang xử lý hình ảnh...");
    // Trong thực tế sẽ dùng thư viện html-to-image để tải PNG
    setTimeout(() => {
      toast.success("Mã QR đã được tải xuống");
    }, 1000);
  };

  return (
    <AppShell>
      <Link
        to="/admin/elevators/$elevatorId"
        params={{ elevatorId: elevator.id }}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="h-4 w-4" /> Quay lại thông tin thang máy
      </Link>

      <PageHeader
        title={`Mã QR: ${elevator.code}`}
        description="Quản lý tem nhãn thông minh, in ấn và chia sẻ mã QR cho hành khách"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-6">
        {/* LEFT BAR - TOOLBAR & INFO */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-5 shadow-sm border-muted/60 bg-card/50 backdrop-blur-sm">
            <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
              <ScanLine className="h-5 w-5 text-primary" /> Mẫu in nhãn dán
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Mã QR này được thiết kế để in dán trong cabin thang máy hoặc sảnh chờ. Hành khách có
              thể quét để gọi cứu hộ trực tiếp hoặc xem lịch sử bảo trì (tùy cài đặt).
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block uppercase tracking-wide">
                  Liên kết chia sẻ
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 bg-muted/50 rounded-md border px-3 py-2 text-xs font-mono truncate text-muted-foreground select-all">
                    {publicUrl}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    className="shrink-0 h-[34px] w-[34px]"
                    onClick={handleCopy}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4 border-t">
                <Button className="w-full gap-2 shadow-sm" onClick={handlePrint}>
                  <Printer className="h-4 w-4" /> In nhãn dán
                </Button>
                <Button
                  variant="secondary"
                  className="w-full gap-2 shadow-sm"
                  onClick={handleDownload}
                >
                  <Download className="h-4 w-4" /> Tải dạng ảnh
                </Button>
              </div>

              <a href={publicUrl} target="_blank" rel="noreferrer" className="block mt-2">
                <Button
                  variant="ghost"
                  className="w-full gap-2 text-muted-foreground hover:text-foreground"
                >
                  <ExternalLink className="h-4 w-4" /> Xem thử giao diện hành khách
                </Button>
              </a>
            </div>
          </Card>

          <Card className="p-5 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
              <Shield className="w-32 h-32" />
            </div>
            <div className="relative z-10">
              <h3 className="font-semibold mb-3">Tùy chọn hiển thị</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between p-3 rounded-lg border bg-background/50">
                  <span>Có bao gồm số Hotline</span>
                  <span className="h-2 w-2 rounded-full bg-success ring-4 ring-success/20"></span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border bg-background/50">
                  <span>Logo nền trong mã QR</span>
                  <span className="h-2 w-2 rounded-full bg-success ring-4 ring-success/20"></span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                  <span className="text-muted-foreground">Hiển thị lịch sử công khai</span>
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/30"></span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* RIGHT BAR - ACTUAL PREVIEW (PRINT TARGET) */}
        <div className="lg:col-span-7 flex items-center justify-center bg-muted/30 p-8 rounded-2xl border border-dashed border-muted-foreground/20">
          <style
            dangerouslySetInnerHTML={{
              __html: `
            @media print {
              body * { visibility: hidden; }
              #printable-qr-wrapper, #printable-qr-wrapper * { visibility: visible; }
              #printable-qr-wrapper {
                position: absolute;
                left: 0;
                top: 0;
                width: 100vw;
                height: 100vh;
                display: flex;
                align-items: flex-start;
                justify-content: flex-start;
                padding: 2cm;
              }
              .print-hide { display: none !important; }
            }
          `,
            }}
          />

          {/* THE STICKER */}
          <div
            id="printable-qr-wrapper"
            ref={qrRef}
            className="w-[340px] bg-white rounded-3xl shadow-xl overflow-hidden border-2 border-primary/10 transition-transform hover:scale-105 duration-500 ease-out"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-primary/80 py-4 px-6 text-center text-primary-foreground relative overflow-hidden">
              <div className="absolute -right-4 -top-8 opacity-20 rotate-12">
                <Shield className="w-24 h-24" />
              </div>
              <h2 className="font-bold text-xl tracking-tight relative z-10 flex flex-col items-center gap-1">
                <span className="text-xs uppercase tracking-widest font-medium opacity-80 mb-0.5">
                  Mã ID Thang Máy
                </span>
                {elevator.code}
              </h2>
            </div>

            {/* Body */}
            <div className="p-8 flex flex-col items-center text-center">
              <p className="text-[13px] text-zinc-500 font-medium mb-6 uppercase tracking-wider">
                Quét để yêu cầu hỗ trợ
              </p>

              <div className="bg-white p-3 rounded-2xl border-2 border-zinc-100 shadow-sm relative">
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                  <Building2 className="w-20 h-20" />
                </div>
                {/* REACT QR CODE MODULE */}
                <QRCode
                  value={publicUrl}
                  size={200}
                  level="H"
                  className="z-10 relative"
                  fgColor="#0f172a"
                />
              </div>

              <div className="mt-8 pt-6 border-t border-dashed border-zinc-200 w-full flex flex-col items-center">
                <div className="text-zinc-400 text-xs font-semibold uppercase tracking-widest mb-1.5">
                  Hotline Hỗ Trợ 24/7
                </div>
                <div className="text-2xl font-black text-rose-600 tracking-tight">1900 1234</div>
                {customer?.name && (
                  <div className="mt-2 text-xs font-medium text-zinc-500 max-w-[200px] truncate">
                    {customer.name}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="bg-zinc-50 py-3 text-center border-t border-zinc-100">
              <span className="text-[10px] font-semibold tracking-widest text-zinc-400 uppercase">
                Powered by ElevatorPro
              </span>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
