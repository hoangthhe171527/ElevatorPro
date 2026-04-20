import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { MobileShell } from "@/components/layout/MobileShell";
import { mockElevators } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { X, Zap, Image as ImageIcon, Focus, ScanLine } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/mobile/scanner")({
  head: () => ({ meta: [{ title: "Quét mã QR — Mobile" }] }),
  component: MobileScanner,
});

function MobileScanner() {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(true);

  // Simulate a successful scan after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setScanning(false);
      const randomElevator = mockElevators[0];
      toast.success("Đã tìm thấy thiết bị!");
      navigate({ to: "/mobile/elevators/$elevatorId", params: { elevatorId: randomElevator.id } });
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="fixed inset-0 bg-black z-[100] flex flex-col">
      {/* Scanner UI Overlay */}
      <div className="p-6 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent">
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/10"
          onClick={() => navigate({ to: "/mobile" })}
        >
          <X className="h-6 w-6" />
        </Button>
        <div className="flex gap-4">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
            <Zap className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
            <ImageIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative">
        {/* Target Reticle */}
        <div className="w-64 h-64 border-2 border-white/30 rounded-3xl relative overflow-hidden">
          {/* Scanning Line Animation */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-primary shadow-[0_0_15px_rgba(var(--primary),0.8)] animate-[scan_2s_infinite]" />

          {/* Corners */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl" />
        </div>

        <div className="mt-12 text-center text-white/80 px-12">
          <Focus className="h-8 w-8 mx-auto mb-4 opacity-40" />
          <p className="text-sm font-bold tracking-wide uppercase">Đang quét mã QR...</p>
          <p className="text-[10px] mt-2 opacity-60">
            Vui lòng căn chỉnh mã QR vào giữa khung hình để tự động truy xuất dữ liệu thiết bị.
          </p>
        </div>
      </div>

      {/* Camera View Simulation */}
      <div className="absolute inset-0 -z-10 bg-slate-900 overflow-hidden">
        {/* Mock Video Feed Texture */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80')] bg-cover bg-center grayscale opacity-30 blur-[2px] scale-110" />
      </div>

      <style>{`
          @keyframes scan {
            0% { top: 0%; }
            50% { top: 100%; }
            100% { top: 0%; }
          }
       `}</style>
    </div>
  );
}
