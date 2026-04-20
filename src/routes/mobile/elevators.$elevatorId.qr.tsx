import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { MobileShell } from "@/components/layout/MobileShell";
import { mockElevators } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, ArrowLeft, Download, Share2, Printer } from "lucide-react";

export const Route = createFileRoute("/mobile/elevators/$elevatorId/qr" as any)({
  head: ({ params }) => ({ meta: [{ title: `Mã QR Thang máy ${params.elevatorId} — Mobile` }] }),
  component: ElevatorQRMobile,
});

function ElevatorQRMobile() {
  const { elevatorId } = Route.useParams();
  const navigate = useNavigate();
  const elevator = mockElevators.find((e) => e.id === elevatorId);

  if (!elevator) return <div>Elevator not found</div>;

  return (
    <MobileShell title="Mã QR Thiết bị" showBackButton>
      <div className="p-4 space-y-6 flex flex-col items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          className="self-start flex items-center gap-2 p-0 h-auto font-bold text-slate-500 mb-2"
          onClick={() => navigate({ to: "/mobile/elevators/$elevatorId", params: { elevatorId } })}
        >
          <ArrowLeft className="h-4 w-4" /> Quay lại chi tiết
        </Button>

        <Card className="p-8 border-none shadow-2xl bg-white w-full max-w-xs flex flex-col items-center gap-6 rounded-3xl">
          <div className="text-center">
            <h2 className="font-black text-xl tracking-tight text-slate-900">{elevator.building}</h2>
            <p className="text-[10px] font-mono font-bold text-slate-400 uppercase mt-1">{elevator.code}</p>
          </div>

          {/* QR Container */}
          <div className="relative aspect-square w-full bg-slate-50 rounded-2xl flex items-center justify-center border-4 border-slate-50 overflow-hidden shadow-inner">
             {/* Mock QR Representation */}
             <div className="p-4 bg-white rounded-xl shadow-sm">
                <QrCode className="h-48 w-48 text-slate-900" strokeWidth={1.5} />
             </div>
             {/* Visual ornaments for scan feel */}
             <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-lg" />
             <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-lg" />
             <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-lg" />
             <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-lg" />
          </div>

          <div className="text-center space-y-2">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-tight">
              QUÉT ĐỂ TRUY XUẤT <br/> HỒ SƠ & BÁO HỎNG
            </p>
            <div className="flex items-center justify-center gap-1.5 pt-2">
               <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[9px] font-bold text-emerald-600 uppercase">Mã lực trực tuyến</span>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-3 gap-4 w-full max-w-xs">
          <Button variant="outline" className="h-14 rounded-2xl bg-white border-slate-100 flex-col gap-1 shadow-sm">
            <Download className="h-5 w-5 text-slate-500" />
            <span className="text-[8px] font-bold uppercase">Lưu ảnh</span>
          </Button>
          <Button variant="outline" className="h-14 rounded-2xl bg-white border-slate-100 flex-col gap-1 shadow-sm">
            <Share2 className="h-5 w-5 text-slate-500" />
            <span className="text-[8px] font-bold uppercase">Chia sẻ</span>
          </Button>
          <Button variant="outline" className="h-14 rounded-2xl bg-white border-slate-100 flex-col gap-1 shadow-sm">
            <Printer className="h-5 w-5 text-slate-500" />
            <span className="text-[8px] font-bold uppercase">In mã</span>
          </Button>
        </div>

        <p className="text-[10px] text-center text-slate-400 px-8 leading-relaxed">
          Kỹ thuật viên có thể cho khách hàng quét mã này để truy cập thông tin bảo trì của thiết bị.
        </p>
      </div>
    </MobileShell>
  );
}
