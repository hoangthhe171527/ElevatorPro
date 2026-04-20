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
  const customerProjects = mockProjects.filter((p) => p.customerId === customer.id);
  const projectIds = customerProjects.map((p) => p.id);
  const elevators = mockElevators.filter((e) => projectIds.includes(e.projectId));
  const jobs = mockJobs.filter((j) => j.customerId === customer.id);
  
  const totalContractValue = contracts.reduce((s, c) => s + c.value, 0);
  const totalPaid = contracts.reduce((s, c) => s + c.paid, 0);

  return (
    <MobileShell 
        title="Chi tiết khách hàng"
        backLink="/mobile/customers"
    >
      <div className="flex flex-col pb-24">
        {/* Profile Header */}
        <div className="bg-slate-900 px-6 pt-8 pb-16 relative overflow-hidden">
            <div className="relative z-10">
                <div className="h-20 w-20 rounded-3xl bg-primary shadow-2xl flex items-center justify-center text-white text-3xl font-black mb-4">
                    {customer.name[0]}
                </div>
                <h1 className="text-2xl font-black text-white leading-tight">{customer.name}</h1>
                <p className="text-white/50 text-xs font-bold uppercase tracking-widest mt-2">
                    {customer.type === "business" ? "Khách hàng doanh nghiệp" : "Khách hàng cá nhân"}
                </p>
                
                <div className="flex gap-4 mt-6">
                    <a href={`tel:${customer.phone}`} className="flex-1">
                        <Button className="w-full bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl h-12 text-xs font-black gap-2 text-white">
                            <Phone className="h-4 w-4" /> GỌI
                        </Button>
                    </a>
                    <a href={`mailto:${customer.email}`} className="flex-1">
                        <Button variant="ghost" className="w-full bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl h-12 text-xs font-black gap-2 text-white">
                            <Mail className="h-4 w-4" /> EMAIL
                        </Button>
                    </a>
                </div>
            </div>
            
            {/* Visual Flairs */}
            <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute bottom-[-20%] left-[-10%] w-48 h-48 bg-blue-500/10 rounded-full blur-2xl" />
        </div>

        {/* Floating Stats Card */}
        <div className="px-6 -mt-8 relative z-20">
            <Card className="bg-white border-none shadow-2xl shadow-slate-900/5 rounded-[2.5rem] p-6 grid grid-cols-3 gap-2">
                <div className="text-center p-2 rounded-2xl hover:bg-slate-50 transition-colors">
                    <p className="text-[10px] font-black text-slate-400 uppercase">Thiết bị</p>
                    <p className="text-lg font-black text-slate-900 mt-1">{elevators.length}</p>
                </div>
                <div className="text-center p-2 rounded-2xl hover:bg-slate-50 transition-colors border-x border-slate-50">
                    <p className="text-[10px] font-black text-slate-400 uppercase">Công việc</p>
                    <p className="text-lg font-black text-slate-900 mt-1">{jobs.length}</p>
                </div>
                <div className="text-center p-2 rounded-2xl hover:bg-slate-50 transition-colors">
                    <p className="text-[10px] font-black text-slate-400 uppercase">Hợp đồng</p>
                    <p className="text-lg font-black text-slate-900 mt-1">{contracts.length}</p>
                </div>
            </Card>
        </div>

        {/* Address & Info Section */}
        <div className="px-6 mt-8">
            <div className="bg-slate-50 p-4 rounded-3xl flex items-start gap-3">
                <div className="h-10 w-10 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase">Địa chỉ trụ sở</p>
                   <p className="text-xs font-bold text-slate-700 mt-1 leading-relaxed">{customer.address}</p>
                </div>
            </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 mt-8">
            <div className="flex p-1 bg-slate-100 rounded-2xl mb-6">
                {[
                    { id: "assets", icon: Building2, label: "Tài sản" },
                    { id: "jobs", icon: Briefcase, label: "Công việc" },
                    { id: "billing", icon: TrendingUp, label: "Tài chính" },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={cn(
                            "flex-1 flex flex-col items-center py-2.5 rounded-xl transition-all",
                            activeTab === tab.id ? "bg-white shadow-sm text-primary" : "text-slate-400"
                        )}
                    >
                        <tab.icon className="h-4 w-4 mb-1" />
                        <span className="text-[9px] font-black uppercase tracking-wider">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="space-y-4">
                {activeTab === "assets" && (
                    <div className="space-y-3">
                        {elevators.map(e => (
                            <Link key={e.id} to="/mobile/elevators">
                                <Card className="p-4 border-none shadow-sm bg-white rounded-3xl flex items-center justify-between group active:scale-[0.98] transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-2xl bg-slate-50 flex items-center justify-center">
                                            <Zap className={cn("h-5 w-5", e.status === "operational" ? "text-emerald-500" : "text-amber-500")} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-slate-900">{e.code}</p>
                                            <p className="text-[10px] font-bold text-slate-400 mt-0.5">{e.building} · {e.model}</p>
                                        </div>
                                    </div>
                                    <StatusBadge variant={elevatorStatusVariant[e.status]} className="h-5 px-2 text-[9px]">
                                        {elevatorStatusLabel[e.status]}
                                    </StatusBadge>
                                </Card>
                            </Link>
                        ))}
                        {elevators.length === 0 && (
                            <div className="py-10 text-center text-slate-400">
                                <Building2 className="h-10 w-10 mx-auto mb-2 opacity-20" />
                                <p className="text-xs font-bold uppercase tracking-widest">Không có thiết bị</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "jobs" && (
                    <div className="space-y-3">
                        {jobs.map(j => (
                            <Link key={j.id} to="/mobile/jobs">
                                <Card className="p-4 border-none shadow-sm bg-white rounded-3xl group active:scale-[0.98] transition-all">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="text-xs font-black text-slate-900 pr-4">{j.title}</h4>
                                        <StatusBadge variant={jobStatusVariant[j.status]} className="h-4 px-1.5 text-[8px]">
                                            {jobStatusLabel[j.status]}
                                        </StatusBadge>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
                                        <ShieldCheck className="h-3 w-3" />
                                        {formatDateTime(j.scheduledFor)}
                                    </div>
                                </Card>
                            </Link>
                        ))}
                         {jobs.length === 0 && (
                            <div className="py-10 text-center text-slate-400">
                                <Briefcase className="h-10 w-10 mx-auto mb-2 opacity-20" />
                                <p className="text-xs font-bold uppercase tracking-widest">Chưa có công việc</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "billing" && (
                    <div className="space-y-3">
                        <Card className="p-5 border-none shadow-sm bg-primary/5 rounded-3xl mb-4 text-primary">
                            <div className="flex justify-between items-end mb-4">
                                <span className="text-[10px] font-black uppercase">Tổng thanh khoản</span>
                                <span className="text-sm font-black italic">
                                    {totalContractValue > 0 ? Math.round((totalPaid / totalContractValue) * 100) : 0}%
                                </span>
                            </div>
                            <Progress value={totalContractValue > 0 ? (totalPaid / totalContractValue) * 100 : 0} className="h-1.5 bg-primary/10" />
                        </Card>
                        
                        {contracts.map(c => (
                            <Card key={c.id} className="p-4 border-none shadow-sm bg-white rounded-3xl">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <p className="text-xs font-black text-slate-900">{c.code}</p>
                                        <p className="text-[10px] font-bold text-slate-400 mt-0.5">{formatDate(c.startDate)} - {formatDate(c.endDate)}</p>
                                    </div>
                                    <StatusBadge variant={contractStatusVariant[c.status]} className="h-4 px-1.5 text-[8px]">
                                        {contractStatusLabel[c.status]}
                                    </StatusBadge>
                                </div>
                                <div className="flex justify-between items-end pt-3 border-t border-slate-50">
                                    <div>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase">Giá trị</p>
                                        <p className="text-xs font-black text-slate-900">{formatVND(c.value)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase">Đã thu</p>
                                        <p className="text-xs font-black text-emerald-600">{formatVND(c.paid)}</p>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
      </div>
    </MobileShell>
  );
}
