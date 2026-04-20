import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/layout/MobileShell";
import { canAccessMobilePath } from "@/lib/mobile-policy";
import { useCurrentPermissions, useMainRole } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Ambulance, PhoneCall, TriangleAlert, Wrench } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/mobile/support")({
  head: () => ({ meta: [{ title: "Hỗ trợ khẩn cấp - Mobile" }] }),
  component: MobileSupport,
});

function MobileSupport() {
  const role = useMainRole();
  const permissions = useCurrentPermissions();
  const issuePath = role === "customer" ? "/mobile/portal/issues" : role === "tech" ? "/mobile/tech/jobs" : "/mobile/jobs";

  if (!canAccessMobilePath("/mobile/support", role, permissions)) {
    return (
      <MobileShell title="Không có quyền truy cập">
        <div className="min-h-screen bg-slate-50 px-4 pt-4 pb-36">
          <Card className="p-6 text-center rounded-2xl border-slate-100">
            <p className="text-sm font-semibold text-slate-900">Màn hỗ trợ khẩn cấp chỉ dành cho kỹ thuật và khách hàng.</p>
            <Link to="/mobile" className="inline-block mt-4">
              <Button className="rounded-xl">Về trang chính mobile</Button>
            </Link>
          </Card>
        </div>
      </MobileShell>
    );
  }

  const handleEmergency = () => {
    toast.error("Đã gửi yêu cầu cứu hộ khẩn cấp", {
      description: "Đội kỹ thuật trực gần nhất đang được điều phối.",
      duration: 4500,
    });
  };

  return (
    <MobileShell title="Emergency" showBackButton backLink="/mobile/">
      <div className="min-h-screen bg-slate-50 pb-28 p-4 space-y-4">
        <Card className="rounded-3xl bg-rose-600 text-white border-none p-5 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-11 w-11 rounded-full bg-white/20 flex items-center justify-center">
                <Ambulance className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-lg font-black uppercase italic tracking-tight">Rescue 24/7</h1>
                <p className="text-[10px] font-bold uppercase tracking-widest text-rose-100">Trung tâm cứu hộ thang máy</p>
              </div>
            </div>
            <Button
              onClick={handleEmergency}
              className="w-full rounded-2xl h-12 bg-white text-rose-600 hover:bg-rose-50 font-black uppercase tracking-wider"
            >
              <TriangleAlert className="h-4 w-4 mr-2" /> Gửi SOS ngay
            </Button>
          </div>
        </Card>

        <Card className="rounded-3xl bg-white border border-slate-100 p-4 shadow-sm space-y-3">
          <h2 className="text-[11px] font-black uppercase tracking-wider text-slate-500">Hành động nhanh</h2>
          <Button variant="outline" className="w-full justify-start rounded-xl h-11">
            <PhoneCall className="h-4 w-4 mr-2 text-indigo-600" /> Hotline 1900 6688
          </Button>
          <Link to={issuePath} className="block">
            <Button variant="outline" className="w-full justify-start rounded-xl h-11">
              <Wrench className="h-4 w-4 mr-2 text-indigo-600" /> {role === "customer" ? "Tạo phiếu sự cố" : "Mở danh sách xử lý"}
            </Button>
          </Link>
        </Card>
      </div>
    </MobileShell>
  );
}
