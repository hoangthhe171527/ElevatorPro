import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { MobileShell } from "@/components/layout/MobileShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  jobStatusLabel,
  jobStatusVariant,
} from "@/lib/status-variants";
import {
  mockJobs,
  mockElevators,
  formatDate,
  formatDateTime,
} from "@/lib/mock-data";
import {
  Wrench,
  Calendar,
  Clock,
  MapPin,
  User,
  ShieldCheck,
  ChevronRight,
  Camera,
  Signature as SignatureIcon,
  CheckCircle2,
  Package,
  Plus,
  Trash2,
  Save
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/mobile/jobs/$jobId")({
  loader: ({ params }) => {
    const job = mockJobs.find((j) => j.id === params.jobId);
    if (!job) throw notFound();
    const elevator = mockElevators.find((e) => e.id === job.elevatorId);
    return { job, elevator };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `Công việc ${loaderData?.job.title ?? ""} — Mobile` }],
  }),
  component: JobDetail,
});

function JobDetail() {
  const { job, elevator } = Route.useLoaderData();
  const [activeTab, setActiveTab] = useState<"info" | "materials" | "complete">("info");
  const [materials, setMaterials] = useState([
    { id: 1, name: "Cáp tải 8mm", qty: 2, unit: "M" },
    { id: 2, name: "Dầu ray", qty: 1, unit: "Lít" },
  ]);

  const removeMaterial = (id: number) => {
    setMaterials(materials.filter(m => m.id !== id));
    toast.success("Đã xóa vật tư");
  };

  const addMaterial = () => {
    const name = window.prompt("Tên loại vật tư:");
    if (name) {
      setMaterials([...materials, { id: Date.now(), name, qty: 1, unit: "Cái" }]);
      toast.success("Đã thêm vật tư");
    }
  };

  const handleComplete = () => {
    toast.success("ĐÃ GỬI BÁO CÁO HOÀN TẤT!", {
      description: "Biên bản đã được lưu và gửi cho khách hàng.",
    });
  };

  return (
    <MobileShell 
        title="Chi tiết công việc"
        backLink="/mobile/jobs"
    >
      <div className="flex flex-col pb-24">
        {/* Header Section */}
        <div className="bg-slate-900 px-6 pt-10 pb-20 relative overflow-hidden">
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div className="h-14 w-14 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                        <Wrench className="h-7 w-7 text-indigo-400" />
                    </div>
                    <StatusBadge variant={jobStatusVariant[job.status]} className="px-3 py-1 text-[10px]">
                        {jobStatusLabel[job.status]}
                    </StatusBadge>
                </div>
                <h1 className="text-xl font-black text-white leading-tight uppercase italic tracking-tight mb-2">{job.title}</h1>
                <div className="flex items-center gap-2 text-slate-400">
                    <Calendar className="h-3 w-3" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{formatDate(job.scheduledFor)}</span>
                </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
        </div>

        {/* Floating Tab Bar */}
        <div className="px-6 -mt-8 relative z-30">
            <div className="bg-white p-1.5 rounded-2xl shadow-xl flex gap-1 border border-slate-100">
                {[
                    { id: "info", label: "Thông tin", icon: Wrench },
                    { id: "materials", label: "Vật tư", icon: Package },
                    { id: "complete", label: "Hoàn tất", icon: Save },
                ].map((t) => (
                    <button
                        key={t.id}
                        onClick={() => setActiveTab(t.id as any)}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all",
                            activeTab === t.id ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:bg-slate-50"
                        )}
                    >
                        <t.icon className="h-4 w-4" />
                        <span className="text-[9px] font-black uppercase tracking-widest leading-none">{t.label}</span>
                    </button>
                ))}
            </div>
        </div>

        {/* Tab Content */}
        <div className="p-6 space-y-6">
            {activeTab === "info" && (
                <div className="space-y-6">
                    <Card className="bg-white border-none shadow-sm rounded-[2.5rem] p-6 space-y-6">
                        <div>
                            <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-4">Thông tin địa điểm</h3>
                            <div className="flex items-start gap-4">
                                <div className="h-10 w-10 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0">
                                    <MapPin className="h-5 w-5 text-slate-400" />
                                </div>
                                <div>
                                    <p className="text-[12px] font-black text-slate-800 uppercase italic leading-tight">{elevator?.building}</p>
                                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">{elevator?.address}</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-50">
                            <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-4">Kỹ thuật viên</h3>
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-sm">
                                    NB
                                </div>
                                <div>
                                    <p className="text-[11px] font-black text-slate-800 uppercase">Nguyễn Văn B</p>
                                    <p className="text-[9px] font-bold text-indigo-500 uppercase">Kỹ thuật viên chính</p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <section className="space-y-4">
                        <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] px-1">Danh mục kiểm tra</h3>
                        <div className="space-y-2">
                            {[
                                "Kiểm tra hệ thống phanh an toàn",
                                "Vệ sinh ray dẫn hướng và cáp tải",
                                "Kiểm tra bảng điều khiển cabin",
                                "Kiểm tra độ ồn và rung lắc"
                            ].map((item, i) => (
                                <div key={i} className="bg-white p-4 rounded-3xl flex items-center justify-between border border-slate-50 shadow-sm">
                                    <span className="text-[11px] font-bold text-slate-600 uppercase">{item}</span>
                                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            )}

            {activeTab === "materials" && (
                <div className="space-y-4">
                    <div className="flex justify-between items-center px-1">
                        <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Vật tư đã sử dụng</h3>
                        <Button onClick={addMaterial} variant="outline" size="sm" className="h-8 rounded-xl border-dashed border-slate-300 text-[9px] font-black uppercase">
                            <Plus className="h-3 w-3 mr-1" /> Thêm vật tư
                        </Button>
                    </div>
                    
                    <div className="space-y-3">
                        {materials.map(m => (
                            <Card key={m.id} className="p-4 border-none shadow-sm flex items-center justify-between bg-white rounded-3xl">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-2xl bg-indigo-50 flex items-center justify-center">
                                        <Package className="h-5 w-5 text-indigo-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-slate-800 uppercase italic">{m.name}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Số lượng: {m.qty} {m.unit}</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => removeMaterial(m.id)} className="text-rose-500">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === "complete" && (
                <div className="space-y-6">
                    <section className="space-y-4">
                        <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] px-1">Hình ảnh hiện trường</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white aspect-square rounded-[2rem] flex flex-col items-center justify-center border-2 border-dashed border-slate-200 shadow-sm">
                                <Camera className="h-8 w-8 text-slate-300 mb-2" />
                                <span className="text-[9px] font-black text-slate-400 uppercase">Ảnh trước</span>
                            </div>
                            <div className="bg-white aspect-square rounded-[2rem] flex flex-col items-center justify-center border-2 border-dashed border-slate-200 shadow-sm">
                                <Camera className="h-8 w-8 text-slate-300 mb-2" />
                                <span className="text-[9px] font-black text-slate-400 uppercase">Ảnh sau</span>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] px-1">Xác nhận khách hàng</h3>
                        <Card className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] aspect-[16/9] flex flex-col items-center justify-center">
                            <SignatureIcon className="h-10 w-10 text-slate-300 mb-2" />
                            <span className="text-[10px] font-black text-slate-400 uppercase italic">Ký tên tại đây</span>
                        </Card>
                    </section>

                    <Button onClick={handleComplete} className="w-full h-16 rounded-[2rem] bg-indigo-600 text-white font-black uppercase tracking-widest italic text-sm shadow-xl shadow-indigo-200">
                        HOÀN TẤT & XUẤT BIÊN BẢN
                    </Button>
                </div>
            )}
        </div>
      </div>
    </MobileShell>
  );
}
