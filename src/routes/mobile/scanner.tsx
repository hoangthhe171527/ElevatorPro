import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/layout/MobileShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { canAccessMobilePath } from "@/lib/mobile-policy";
import { useCurrentPermissions, useMainRole } from "@/lib/store";
import { Scan, X, Zap, History, Info } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/mobile/scanner")({
  component: MobileScanner,
});

function MobileScanner() {
   const role = useMainRole();
   const permissions = useCurrentPermissions();
  const [isScanning, setIsScanning] = useState(true);

   if (!canAccessMobilePath("/mobile/scanner", role, permissions)) {
      return (
         <MobileShell title="Không có quyền truy cập">
            <div className="min-h-screen bg-slate-50 px-4 pt-4 pb-36">
               <Card className="p-6 text-center rounded-2xl border-slate-100">
                  <p className="text-sm font-semibold text-slate-900">Màn quét QR chỉ dành cho kỹ thuật hoặc khách hàng portal.</p>
                  <Link to="/mobile" className="inline-block mt-4">
                     <Button className="rounded-xl">Về trang chính mobile</Button>
                  </Link>
               </Card>
            </div>
         </MobileShell>
      );
   }

  return (
    <MobileShell title="Quét QR Thiết bị" hideHeader={true}>
      <div className="flex flex-col min-h-screen bg-slate-900 text-white font-sans">
        {/* Top Controls */}
        <div className="px-6 pt-10 flex items-center justify-between relative z-10">
           <button onClick={() => window.history.back()} className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
              <X className="h-5 w-5" />
           </button>
           <h2 className="text-sm font-black uppercase tracking-widest italic">QR Scanner</h2>
           <button className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
              <Zap className="h-5 w-5 text-amber-400" />
           </button>
        </div>

        {/* Viewfinder Context */}
        <div className="flex-1 flex flex-col items-center justify-center px-10 relative">
           <div className="w-full aspect-square relative">
              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-indigo-500 rounded-tl-2xl" />
              <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-indigo-500 rounded-tr-2xl" />
              <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-indigo-500 rounded-bl-2xl" />
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-indigo-500 rounded-br-2xl" />
              
              {/* Scanning Animation */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-400 to-transparent shadow-[0_0_15px_rgba(99,102,241,0.8)] animate-[scan_2s_ease-in-out_infinite]" />
              
              {/* Fake UI Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                 <Scan className="h-20 w-20 text-white/10" />
              </div>
           </div>
           
           <p className="mt-10 text-xs font-bold text-slate-400 text-center uppercase tracking-widest leading-relaxed">
              Căn chỉnh mã QR của thang máy <br/> vào trong khung hình
           </p>
        </div>

        {/* Bottom Panel */}
        <div className="bg-white rounded-t-[2.5rem] p-8 pb-12">
           <div className="flex items-center gap-4 mb-8">
              <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center border border-indigo-100">
                 <Info className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="flex-1">
                 <h3 className="text-sm font-black text-slate-900 uppercase italic">Hướng dẫn</h3>
                 <p className="text-[10px] font-medium text-slate-500">Mã QR thường nằm trên bảng điều khiển hoặc cửa tầng.</p>
              </div>
           </div>
           
           <div className="grid grid-cols-2 gap-4">
              <Button className="h-14 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 border-none flex items-center gap-2">
                 <History className="h-5 w-5" />
                 <span className="text-xs font-bold uppercase">Lịch sử</span>
              </Button>
              <Button className="h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20 flex items-center gap-2">
                 <Scan className="h-5 w-5" />
                 <span className="text-xs font-bold uppercase">Nhập tay</span>
              </Button>
           </div>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0%, 100% { top: 0%; opacity: 0; }
          10%, 90% { opacity: 1; }
          50% { top: 100%; }
        }
      `}</style>
    </MobileShell>
  );
}
