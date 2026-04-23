// src/routes/tech.survey.$jobId.tsx
import { createFileRoute, Link, notFound, useLocation } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/common/StatusBadge";
import { jobStatusLabel, jobStatusVariant } from "@/lib/status-variants";
import { 
  mockJobs, 
  mockLeads, 
  formatDateTime, 
  getCustomer,
  type Job 
} from "@/lib/mock-data";
import { useAppStore, useIsSmallCompany } from "@/lib/store";
import { 
  ArrowLeft, 
  Camera, 
  ClipboardCheck, 
  CheckCircle2, 
  Plus,
  Info,
  MapPin,
  Ruler
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/tech/survey/$jobId")({
  loader: ({ params }) => {
    const job = mockJobs.find((j) => j.id === params.jobId);
    if (!job || job.type !== 'inspection') throw notFound();
    return { job };
  },
  component: TechSurveyDetail,
});

export function TechSurveyDetail() {
  const { job } = Route.useLoaderData();
  const { pathname } = useLocation();
  const prefix = pathname.startsWith("/app") ? "/app" : "";
  const cus = getCustomer(job.customerId);
  const isSmall = useIsSmallCompany();

  const [pitDepth, setPitDepth] = useState(job.surveyReport?.pitDepth || "");
  const [overheadHeight, setOverheadHeight] = useState(job.surveyReport?.overheadHeight || "");
  const [shaftDimensions, setShaftDimensions] = useState(job.surveyReport?.shaftDimensions || "");
  const [powerSupply, setPowerSupply] = useState(job.surveyReport?.powerSupply || "3phase");
  const [specialNotes, setSpecialNotes] = useState(job.surveyReport?.specialNotes || "");
  const [photos, setPhotos] = useState<string[]>(job.beforePhotos || []);
  const [status, setStatus] = useState(job.status);
  const [loading, setLoading] = useState(false);

  const handleAddPhoto = () => {
    const mockPhoto = "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=400";
    setPhotos([...photos, mockPhoto]);
    toast.success("Đã chụp ảnh hiện trường");
  };

  const handleComplete = async () => {
    if (!pitDepth || !shaftDimensions) {
      toast.error("Vui lòng nhập các thông số kỹ thuật cốt yếu (Pit, Kích thước hố)");
      return;
    }
    if (photos.length < 2) {
      toast.error("Vui lòng chụp ít nhất 2 ảnh hiện trường (hố thang, mặt bằng)");
      return;
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    
    // Update local state and mock data
    job.status = 'completed';
    job.completedAt = new Date().toISOString();
    job.beforePhotos = photos;
    job.surveyReport = {
      pitDepth,
      overheadHeight,
      shaftDimensions,
      powerSupply,
      specialNotes
    };

    // Auto-update Lead status
    if (job.leadId) {
      const lead = mockLeads.find(l => l.id === job.leadId);
      if (lead) {
        lead.status = 'surveyed';
      }
    }

    setStatus('completed');
    setLoading(false);
    toast.success("Đã hoàn thành khảo sát và gửi dữ liệu về hệ thống!");
    
    if (isSmall) {
      toast.info("Hệ thống: Lead đã được chuyển trạng thái 'Đã khảo sát'. CEO có thể lập báo giá ngay.");
    }
  };

  return (
    <AppShell className="bg-slate-50/50">
      <div className="mb-2">
        <Link
          to={`${prefix}/tech/jobs` as any}
          search={{ tab: 'inspection' } as any}
          className="inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground font-black uppercase tracking-widest"
        >
          <ArrowLeft className="h-3 w-3" /> QUAY LẠI
        </Link>
      </div>

      <PageHeader 
        title="KHẢO SÁT"
        description={`Mã việc: ${job.code}`}
        actions={
          <div className="flex items-center gap-3">
            <StatusBadge variant={jobStatusVariant[status]} className="h-6 text-[8px]">{jobStatusLabel[status]}</StatusBadge>
            {status !== 'completed' && (
              <Button 
                size="sm"
                className="rounded-full bg-success hover:bg-success/90 text-white font-black text-[10px] uppercase tracking-widest px-4 h-9 shadow-lg shadow-success/20 flex items-center gap-2"
                onClick={handleComplete}
                disabled={loading}
              >
                {loading ? "..." : (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    HOÀN THÀNH
                  </>
                )}
              </Button>
            )}
          </div>
        }
      />

      <div className="grid gap-6 pb-12">
        {/* Customer Info */}
        <Card className="p-5 border-none shadow-sm bg-white overflow-hidden relative">
           <div className="absolute top-0 right-0 p-4 opacity-10">
              <MapPin className="h-12 w-12" />
           </div>
           <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3">Thông tin công trình</h3>
           <div className="space-y-1">
              <div className="text-lg font-black text-slate-800">{cus?.name || "Khách hàng mới"}</div>
              <div className="text-sm font-medium text-slate-500 flex items-center gap-1.5">
                 <MapPin className="h-4 w-4 text-primary" /> {cus?.address || job.description}
              </div>
           </div>
        </Card>

        {/* Technical Parameters */}
        <Card className="p-5 border-none shadow-sm bg-white">
           <div className="flex items-center gap-2 mb-6">
              <div className="p-2 rounded-xl bg-indigo-500 text-white">
                 <Ruler className="h-5 w-5" />
              </div>
              <h3 className="font-black text-sm uppercase tracking-widest text-slate-700">Thông số kỹ thuật hố</h3>
           </div>

           <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400">Chiều sâu PIT (mm)</label>
                    <Input 
                      placeholder="VD: 1200" 
                      className="h-12 rounded-xl border-slate-100 bg-slate-50/50 font-bold focus:bg-white"
                      value={pitDepth}
                      onChange={e => setPitDepth(e.target.value)}
                      disabled={status === 'completed'}
                    />
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400">Overhead (mm)</label>
                    <Input 
                      placeholder="VD: 4200" 
                      className="h-12 rounded-xl border-slate-100 bg-slate-50/50 font-bold focus:bg-white"
                      value={overheadHeight}
                      onChange={e => setOverheadHeight(e.target.value)}
                      disabled={status === 'completed'}
                    />
                 </div>
              </div>

              <div className="space-y-1.5">
                 <label className="text-[10px] font-black uppercase text-slate-400">Kích thước thông thủy hố (RxS mm)</label>
                 <Input 
                   placeholder="VD: 1500 x 1500" 
                   className="h-12 rounded-xl border-slate-100 bg-slate-50/50 font-bold focus:bg-white"
                   value={shaftDimensions}
                   onChange={e => setShaftDimensions(e.target.value)}
                   disabled={status === 'completed'}
                 />
              </div>

              <div className="space-y-1.5">
                 <label className="text-[10px] font-black uppercase text-slate-400">Nguồn điện</label>
                 <Select value={powerSupply} onValueChange={setPowerSupply} disabled={status === 'completed'}>
                    <SelectTrigger className="h-12 rounded-xl border-slate-100 bg-slate-50/50 font-bold">
                       <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                       <SelectItem value="3phase">3 Pha - 380V</SelectItem>
                       <SelectItem value="1phase">1 Pha - 220V</SelectItem>
                    </SelectContent>
                 </Select>
              </div>

              <div className="space-y-1.5">
                 <label className="text-[10px] font-black uppercase text-slate-400">Ghi chú hiện trạng</label>
                 <Textarea 
                   placeholder="Nhập ghi chú đặc biệt về mặt bằng, vận chuyển..." 
                   className="rounded-xl border-slate-100 bg-slate-50/50 font-medium focus:bg-white min-h-[100px]"
                   value={specialNotes}
                   onChange={e => setSpecialNotes(e.target.value)}
                   disabled={status === 'completed'}
                 />
              </div>
           </div>
        </Card>

        {/* Photos Section */}
        <Card className="p-5 border-none shadow-sm bg-white">
           <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                 <div className="p-2 rounded-xl bg-amber-500 text-white">
                    <Camera className="h-5 w-5" />
                 </div>
                 <h3 className="font-black text-sm uppercase tracking-widest text-slate-700">Ảnh hiện trường ({photos.length})</h3>
              </div>
              {status !== 'completed' && (
                <Button variant="outline" size="sm" className="rounded-full border-slate-200" onClick={handleAddPhoto}>
                   <Plus className="h-3 w-3 mr-1" /> Thêm ảnh
                </Button>
              )}
           </div>

           <div className="grid grid-cols-3 gap-2">
              {photos.map((p, idx) => (
                <div key={idx} className="aspect-square rounded-xl bg-slate-100 overflow-hidden relative group">
                   <img src={p} alt="Site" className="w-full h-full object-cover" />
                   <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera className="h-6 w-6 text-white" />
                   </div>
                </div>
              ))}
              {status !== 'completed' && (
                <button 
                  onClick={handleAddPhoto}
                  className="aspect-square rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors"
                >
                   <Camera className="h-6 w-6 mb-1" />
                   <span className="text-[8px] font-black uppercase">Chụp ngay</span>
                </button>
              )}
           </div>
           
           <div className="mt-4 p-3 rounded-xl bg-blue-50 border border-blue-100 flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
              <p className="text-[10px] text-blue-700 leading-relaxed font-medium">
                 Yêu cầu chụp ít nhất 2 ảnh: Một ảnh bao quát mặt bằng và một ảnh chi tiết lòng hố thang.
              </p>
           </div>
        </Card>


        {status === 'completed' && (
           <div className="p-8 text-center animate-in zoom-in duration-300">
              <div className="h-20 w-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                 <CheckCircle2 className="h-10 w-10 text-success" />
              </div>
              <h2 className="text-xl font-black text-slate-900 mb-2">ĐÃ NỘP BÁO CÁO</h2>
              <p className="text-sm font-medium text-slate-500 mb-6">
                 Dữ liệu khảo sát đã được gửi cho Sales Admin. <br/> Bạn có thể quay lại danh sách công việc.
              </p>
              <Link to={`${prefix}/tech/jobs` as any} search={{ tab: 'inspection' } as any}>
                 <Button variant="outline" className="rounded-xl font-black px-8 border-slate-200">
                    QUAY LẠI DANH SÁCH
                 </Button>
              </Link>
           </div>
        )}
      </div>
    </AppShell>
  );
}
