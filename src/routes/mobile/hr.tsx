import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/layout/MobileShell";
import { Card } from "@/components/ui/card";
import { 
  Users, 
  Calendar, 
  Clock, 
  Award, 
  Search, 
  Plus,
  ChevronRight,
  Filter,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/mobile/hr")({
  component: MobileHR,
});

function MobileHR() {
  const staff = [
    { id: "S01", name: "Nguyễn Văn An", role: "Field Tech", status: "active", attendance: "08:15 AM" },
    { id: "S02", name: "Trần Thị Bình", role: "Dispatcher", status: "active", attendance: "08:00 AM" },
    { id: "S03", name: "Lê Văn Cường", role: "Field Tech", status: "off", attendance: "-" },
    { id: "S04", name: "Phạm Minh Đức", role: "Field Tech", status: "late", attendance: "09:30 AM" },
  ];

  return (
    <MobileShell title="Nhân sự & Chấm công">
      <div className="flex flex-col min-h-screen bg-slate-50 font-sans pb-32">
        {/* Header Stats */}
        <div className="px-6 pt-10 pb-12 bg-indigo-950 rounded-b-[2.5rem] shadow-2xl relative overflow-hidden">
           <div className="relative z-10 flex justify-between items-center mb-6">
              <div>
                 <h2 className="text-xl font-black text-white italic tracking-tighter leading-none mb-1">HR_Management</h2>
                 <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">45 Nhân viên đang trực</p>
              </div>
              <button className="h-10 w-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white active:scale-95 transition-all">
                 <Plus className="h-5 w-5" />
              </button>
           </div>

           <div className="relative z-10 grid grid-cols-3 gap-3">
              <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex flex-col items-center">
                 <CheckCircle2 className="h-4 w-4 text-emerald-400 mb-2" />
                 <p className="text-lg font-black text-white italic">38</p>
                 <span className="text-[8px] font-bold text-white/50 uppercase">Đúng giờ</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex flex-col items-center">
                 <AlertCircle className="h-4 w-4 text-amber-400 mb-2" />
                 <p className="text-lg font-black text-white italic">05</p>
                 <span className="text-[8px] font-bold text-white/50 uppercase">Đi muộn</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex flex-col items-center">
                 <Clock className="h-4 w-4 text-rose-400 mb-2" />
                 <p className="text-lg font-black text-white italic">02</p>
                 <span className="text-[8px] font-bold text-white/50 uppercase">Vắng mặt</span>
              </div>
           </div>
        </div>

        {/* Quick Search */}
        <div className="px-6 -mt-6 mb-8 relative z-20">
           <div className="bg-white p-2 rounded-2xl shadow-xl shadow-slate-900/5 ring-1 ring-slate-200/50 flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                 <Search className="h-4 w-4 text-slate-400" />
                 <input placeholder="Họ tên, mã nhân viên..." className="bg-transparent border-none text-[13px] font-medium focus:ring-0 w-full text-slate-900" />
              </div>
              <button className="h-10 w-10 flex items-center justify-center bg-indigo-600 rounded-xl active:scale-95 transition-all shadow-md">
                 <Filter className="h-5 w-5 text-white" />
              </button>
           </div>
        </div>

        {/* Employee List */}
        <section className="px-6">
           <div className="flex items-center justify-between mb-5">
              <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.15em] italic flex items-center gap-2">
                 <Users className="h-4 w-4 text-indigo-600" /> Danh sách đội ngũ
              </h3>
              <Calendar className="h-4 w-4 text-slate-300" />
           </div>

           <div className="space-y-3">
              {staff.map((p) => (
                 <Card key={p.id} className="p-4 border border-slate-100 shadow-sm rounded-2xl bg-white active:scale-[0.98] transition-all flex items-center gap-4 group">
                    <div className="h-12 w-12 rounded-xl bg-slate-900 flex items-center justify-center shrink-0 shadow-lg group-hover:rotate-3 transition-transform">
                       <span className="text-sm font-black text-white italic">{p.name.charAt(0)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                       <h4 className="text-[13px] font-black text-slate-900 leading-tight italic truncate mb-1 uppercase tracking-tight">{p.name}</h4>
                       <div className="flex items-center gap-2">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{p.role}</span>
                          <span className="text-slate-200">•</span>
                          <span className={cn(
                             "text-[8px] font-black uppercase px-1.5 py-0.5 rounded italic",
                             p.status === "active" ? "bg-emerald-50 text-emerald-600" :
                             p.status === "late" ? "bg-amber-50 text-amber-600" : "bg-rose-50 text-rose-600"
                          )}>
                             {p.status === "active" ? "Online" : p.status === "late" ? "Late" : "Offline"}
                          </span>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-black italic text-slate-900 leading-none mb-1">{p.attendance}</p>
                       <p className="text-[8px] font-bold text-slate-400 uppercase">Punch-in</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-200 group-active:text-indigo-400" />
                 </Card>
              ))}
           </div>
        </section>

        {/* Floating Action Button for Attendance */}
        <div className="fixed bottom-28 right-6 z-40">
           <button className="h-14 w-14 bg-indigo-600 rounded-full shadow-2xl flex items-center justify-center text-white active:scale-95 transition-all border-4 border-white">
              <Award className="h-6 w-6" />
           </button>
        </div>
      </div>
    </MobileShell>
  );
}
