import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { MobileShell } from "@/components/layout/MobileShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  contractStatusLabel,
  contractStatusVariant,
  elevatorStatusLabel,
  elevatorStatusVariant,
  jobStatusLabel,
  jobStatusVariant,
} from "@/lib/status-variants";
import { Progress } from "@/components/ui/progress";
import {
  mockCustomers,
  mockContracts,
  mockElevators,
  mockJobs,
  mockProjects,
  formatVND,
  formatDate,
  formatDateTime,
} from "@/lib/mock-data";
import {
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Building2,
  ShieldCheck,
  Zap,
  TrendingUp,
  ChevronRight,
  DollarSign
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/mobile/customers/$customerId")({
  loader: ({ params }) => {
    const customer = mockCustomers.find((c) => c.id === params.customerId);
    if (!customer) throw notFound();
    return { customer };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.customer.name ?? "Chi tiết khách hàng"} — Mobile` }],
  }),
  component: CustomerDetail,
});

function CustomerDetail() {
  const { customer } = Route.useLoaderData();
  const [activeTab, setActiveTab] = useState<"assets" | "jobs" | "billing">("assets");

  const contracts = mockContracts.filter((c) => c.customerId === customer.id);
  const totalRevenue = contracts.reduce((s, c) => s + c.paid, 0);
  const totalContractVal = contracts.reduce((s, c) => s + c.value, 0);
  
  const customerProjects = mockProjects.filter((p) => p.customerId === customer.id);
  const projectIds = customerProjects.map((p) => p.id);
  const elevators = mockElevators.filter((e) => projectIds.includes(e.projectId));
  const jobs = mockJobs.filter((j) => j.customerId === customer.id);

  return (
    <MobileShell 
        title="Hồ sơ khách hàng"
        backLink="/mobile/customers"
    >
      <div className="flex flex-col pb-24">
        {/* Profile Header */}
        <div className="bg-slate-900 px-6 pt-10 pb-20 relative overflow-hidden">
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div className="h-20 w-20 rounded-[2.2rem] bg-indigo-600 shadow-2xl flex items-center justify-center text-white text-3xl font-black border-4 border-slate-800">
                        {customer.name[0]}
                    </div>
                    <div className="flex gap-2">
                        <Button size="icon" className="h-10 w-10 rounded-2xl bg-white/10 border border-white/10 text-white" onClick={() => window.location.href=`tel:${customer.phone}`}>
                            <Phone className="h-4 w-4" />
                        </Button>
                        <Button size="icon" className="h-10 w-10 rounded-2xl bg-white/10 border border-white/10 text-white" onClick={() => window.location.href=`mailto:${customer.email}`}>
                            <Mail className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                <h1 className="text-2xl font-black text-white leading-tight uppercase italic tracking-tight">{customer.name}</h1>
                <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">
                    {customer.type === "business" ? "K/H DOANH NGHIỆP" : "K/H CÁ NHÂN"}
                </p>
            </div>
            
            <div className="absolute top-[-20%] right-[-10%] w-80 h-80 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none" />
        </div>

        {/* Stats Grid - Mirroring Web Logic */}
        <div className="px-6 -mt-10 relative z-20">
            <Card className="bg-white border-none shadow-2xl shadow-indigo-900/5 rounded-[2.8rem] p-7 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Doanh thu thu về</p>
                        <p className="text-lg font-black text-slate-900 uppercase italic tracking-tighter">{formatVND(totalRevenue)}</p>
                    </div>
                    <div className="space-y-1 text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tổng giá trị HĐ</p>
                        <p className="text-lg font-black text-indigo-600 uppercase italic tracking-tighter">{formatVND(totalContractVal)}</p>
                    </div>
                </div>
                
                <div className="flex justify-between items-center py-4 border-y border-slate-50">
                    <div className="flex flex-col items-center flex-1">
                        <span className="text-[9px] font-black text-slate-300 uppercase mb-1">Thiết bị</span>
                        <span className="text-sm font-black text-slate-800">{elevators.length}</span>
                    </div>
                    <div className="h-8 w-px bg-slate-100" />
                    <div className="flex flex-col items-center flex-1">
                        <span className="text-[9px] font-black text-slate-300 uppercase mb-1">Công việc</span>
                        <span className="text-sm font-black text-slate-800">{jobs.length}</span>
                    </div>
                    <div className="h-8 w-px bg-slate-100" />
                    <div className="flex flex-col items-center flex-1">
                        <span className="text-[9px] font-black text-slate-300 uppercase mb-1">Dự án</span>
                        <span className="text-sm font-black text-slate-800">{customerProjects.length}</span>
                    </div>
                </div>
            </Card>
        </div>

        {/* Info & Tabs */}
        <div className="p-6 space-y-8">
            <div className="bg-slate-50/50 border border-slate-100 p-5 rounded-[2rem] flex items-center gap-4">
                <div className="h-10 w-10 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="min-w-0">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Địa chỉ trụ sở</p>
                    <p className="text-[11px] font-bold text-slate-700 mt-1 truncate italic uppercase">{customer.address}</p>
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex p-1.5 bg-slate-100/50 rounded-2xl">
                    {[
                        { id: "assets", label: "THIẾT BỊ" },
                        { id: "jobs", label: "CÔNG VIỆC" },
                        { id: "billing", label: "TÀI CHÍNH" },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={cn(
                                "flex-1 py-3 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest",
                                activeTab === tab.id ? "bg-white text-indigo-600 shadow-xl shadow-indigo-900/5" : "text-slate-400"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="space-y-4">
                    {activeTab === "assets" && (
                        <div className="space-y-3">
                            {elevators.map(e => (
                                <Link key={e.id} to="/mobile/elevators/$elevatorId" params={{ elevatorId: e.id }}>
                                    <Card className="p-4 border-none shadow-sm bg-white rounded-3xl flex items-center gap-4 active:scale-95 transition-all">
                                        <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300">
                                            <Zap className={cn("h-6 w-6", e.status === "operational" ? "text-emerald-500" : "text-amber-500")} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-black text-slate-900 uppercase italic">{e.code}</p>
                                            <p className="text-[10px] font-bold text-slate-400 mt-0.5 truncate uppercase">{e.building}</p>
                                        </div>
                                        <ChevronRight className="h-4 w-4 text-slate-200" />
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}

                    {activeTab === "jobs" && (
                        <div className="space-y-3">
                            {jobs.map(j => (
                                <Link key={j.id} to="/mobile/jobs/$jobId" params={{ jobId: j.id }}>
                                    <Card className="p-5 border-none shadow-sm bg-white rounded-[2rem] space-y-3 active:scale-95 transition-all">
                                        <div className="flex justify-between items-start">
                                            <h4 className="text-xs font-black text-slate-900 uppercase italic pr-4">{j.title}</h4>
                                            <StatusBadge variant={jobStatusVariant[j.status]} className="h-5 px-2 text-[8px]">
                                                {jobStatusLabel[j.status]}
                                            </StatusBadge>
                                        </div>
                                        <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                                            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-black uppercase">
                                                <Calendar className="h-3 w-3" /> {formatDate(j.scheduledFor)}
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-slate-200" />
                                        </div>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}

                    {activeTab === "billing" && (
                        <div className="space-y-3">
                            {contracts.map(c => (
                                <Card key={c.id} className="p-5 border-none shadow-sm bg-white rounded-[2rem] space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-xs font-black text-slate-900 uppercase italic">{c.code}</p>
                                            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">{formatDate(c.startDate)} - {formatDate(c.endDate)}</p>
                                        </div>
                                        <StatusBadge variant={contractStatusVariant[c.status]} className="h-5 px-2 text-[8px]">
                                            {contractStatusLabel[c.status]}
                                        </StatusBadge>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-50">
                                        <div>
                                            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Giá trị</p>
                                            <p className="text-xs font-black text-slate-900 italic">{formatVND(c.value)}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Đã thu</p>
                                            <p className="text-xs font-black text-emerald-600 italic">{formatVND(c.paid)}</p>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </MobileShell>
  );
}
