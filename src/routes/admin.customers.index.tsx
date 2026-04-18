// src/routes/admin.customers.tsx  ← THAY THẾ FILE CŨ
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataPagination } from "@/components/common/DataPagination";
import { Badge } from "@/components/ui/badge";
import { mockCustomers, mockContracts, mockElevators, mockProjects, formatDate } from "@/lib/mock-data";
import {
  Plus,
  Search,
  Building2,
  User,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
} from "lucide-react";
import { CreateCustomerModal } from "@/components/common/Modals";

export const Route = createFileRoute("/admin/customers/")({
  head: () => ({ meta: [{ title: "Khách hàng — ElevatorPro" }] }),
  component: CustomersPage,
});

const PAGE_SIZE = 6;

function CustomersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [createOpen, setCreateOpen] = useState(false);

  const filtered = mockCustomers.filter((c) => {
    const m1 =
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search);
    const m2 = typeFilter === "all" || c.type === typeFilter;
    return m1 && m2;
  });
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <AppShell>
      <PageHeader
        title="Khách hàng"
        description={`${mockCustomers.length} khách hàng đang quản lý`}
        actions={
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4 mr-1.5" /> Thêm khách hàng
          </Button>
        }
      />

      <Card className="overflow-hidden">
        <div className="flex flex-col sm:flex-row gap-3 p-4 border-b">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm khách hàng..."
              className="pl-9"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setPage(1); }}>
            <SelectTrigger className="w-full sm:w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả loại</SelectItem>
              <SelectItem value="business">Doanh nghiệp</SelectItem>
              <SelectItem value="individual">Cá nhân</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="divide-y">
          {paged.map((c) => {
            const contracts = mockContracts.filter((ct) => ct.customerId === c.id).length;
            const projectIds = mockProjects.filter((p) => p.customerId === c.id).map((p) => p.id);
            const elevators = mockElevators.filter((e) => projectIds.includes(e.projectId)).length;
            return (
              <div key={c.id} className="p-4 hover:bg-muted/30 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${
                        c.type === "business"
                          ? "bg-primary/10 text-primary"
                          : "bg-info/10 text-info"
                      }`}
                    >
                      {c.type === "business" ? (
                        <Building2 className="h-5 w-5" />
                      ) : (
                        <User className="h-5 w-5" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold truncate">{c.name}</h3>
                        <Badge variant="outline" className="text-[10px]">
                          {c.type === "business" ? "Doanh nghiệp" : "Cá nhân"}
                        </Badge>
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        Người liên hệ: {c.contactPerson}
                      </div>
                      <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <a
                          href={`tel:${c.phone}`}
                          className="flex items-center gap-1 hover:text-primary"
                        >
                          <Phone className="h-3 w-3" /> {c.phone}
                        </a>
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" /> {c.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {c.address}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-6 md:gap-4 text-xs">
                    <div className="text-center">
                      <div className="text-lg font-bold">{elevators}</div>
                      <div className="text-muted-foreground">Thang</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">{contracts}</div>
                      <div className="text-muted-foreground">Hợp đồng</div>
                    </div>
                    <div className="text-center min-w-[80px]">
                      <div className="text-xs text-muted-foreground">Từ</div>
                      <div className="text-xs font-medium">{formatDate(c.createdAt)}</div>
                    </div>
                  </div>
                  <Link to="/admin/customers/$customerId" params={{ customerId: c.id }}>
                    <Button variant="ghost" size="sm">
                      Chi tiết <ChevronRight className="h-3.5 w-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <DataPagination
          page={page}
          pageSize={PAGE_SIZE}
          total={filtered.length}
          onPageChange={setPage}
        />
      </Card>

      <CreateCustomerModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </AppShell>
  );
}