import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { MobileShell } from "@/components/layout/MobileShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { mockElevators } from "@/lib/mock-data";
import { Send, CheckCircle2, Phone, ArrowLeft, Camera, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/mobile/portal/issues")({
  head: () => ({ meta: [{ title: "Báo lỗi mới — Mobile" }] }),
  component: MobileReportIssue,
});

const issueTypes = [
  "Thang không di chuyển",
  "Cửa đóng mở bất thường",
  "Thang rung lắc, tiếng kêu lạ",
  "Dừng không đúng tầng",
  "Đèn cabin hỏng",
  "Nút bấm không phản hồi",
  "Kẹt người trong thang",
  "Vấn đề khác",
];

function MobileReportIssue() {
  const navigate = useNavigate();
  const [elevatorId, setElevatorId] = useState("");
  const [issueType, setIssueType] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [ticketNo, setTicketNo] = useState("");

  const submit = () => {
    if (!elevatorId || !issueType) {
      toast.error("Vui lòng chọn thang và loại sự cố");
      return;
    }
    if (!phone.trim()) {
      toast.error("Vui lòng nhập số điện thoại liên hệ");
      return;
    }
    const ticket = `YC-${Date.now().toString().slice(-6)}`;
    setTicketNo(ticket);
    setSubmitted(true);
    toast.success("Đã gửi yêu cầu thành công!");
  };

  const isUrgent = issueType === "Kẹt người trong thang";

  if (submitted) {
    return (
      <MobileShell title="Gửi yêu cầu">
        <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
          <div className="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold mb-2">Đã gửi yêu cầu!</h2>
            <p className="text-sm text-muted-foreground mb-1">
              Mã yêu cầu của quý khách là <span className="font-bold text-foreground">{ticketNo}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Nhân viên kỹ thuật sẽ liên hệ lại với quý khách trong vòng 15 phút.
            </p>
          </div>
          <Button className="w-full h-12 rounded-xl" onClick={() => navigate({ to: "/mobile/portal" })}>
            Quay lại trang chủ
          </Button>
        </div>
      </MobileShell>
    );
  }

  return (
    <MobileShell title="Báo lỗi mới">
      <div className="p-4 space-y-6 pb-20">
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-2 p-0 h-auto font-bold text-slate-500"
          onClick={() => navigate({ to: "/mobile/portal" })}
        >
          <ArrowLeft className="h-4 w-4" /> Quay lại
        </Button>

        <section className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase text-slate-500">Chọn thang máy</Label>
            <Select value={elevatorId} onValueChange={setElevatorId}>
              <SelectTrigger className="h-12 bg-white border-slate-100 rounded-xl">
                <SelectValue placeholder="Chọn thiết bị cần báo lỗi" />
              </SelectTrigger>
              <SelectContent>
                {mockElevators.map((e) => (
                  <SelectItem key={e.id} value={e.id}>
                    {e.building} - {e.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase text-slate-500">Loại sự cố</Label>
            <Select value={issueType} onValueChange={setIssueType}>
              <SelectTrigger className={`h-12 bg-white border-slate-100 rounded-xl ${isUrgent ? "border-red-200 bg-red-50 text-red-600" : ""}`}>
                <SelectValue placeholder="Chọn loại sự cố" />
              </SelectTrigger>
              <SelectContent>
                {issueTypes.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isUrgent && (
            <Card className="p-3 border-none bg-red-50 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
              <p className="text-[10px] font-medium text-red-800">
                Đây là sự cố khẩn cấp. Ưu tiên xử lý ngay lập tức. Quý khách vui lòng giữ liên lạc điện thoại.
              </p>
            </Card>
          )}

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase text-slate-500">Mô tả chi tiết</Label>
            <Textarea
              placeholder="Vui lòng mô tả thêm tình trạng (ví dụ: đang ở tầng mấy, có tiếng kêu gì lạ không...)"
              className="min-h-[100px] bg-white border-slate-100 rounded-xl p-4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase text-slate-500">Số điện thoại liên hệ</Label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="tel"
                placeholder="09xx xxx xxx"
                className="h-12 bg-white border-slate-100 rounded-xl pl-12"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-50">
             <Label className="text-xs font-bold uppercase text-slate-500 mb-2 block">Hình ảnh/Video (nếu có)</Label>
             <Button variant="outline" className="w-full h-20 border-dashed bg-slate-50 rounded-xl flex-col gap-1">
                <Camera className="h-6 w-6 text-slate-400" />
                <span className="text-[10px] text-slate-500">Chụp ảnh hoặc quay video</span>
             </Button>
          </div>
        </section>

        <Button 
          className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100 gap-2 text-base"
          onClick={submit}
        >
          <Send className="h-5 w-5" />
          GỬI YÊU CẦU NGAY
        </Button>
      </div>
    </MobileShell>
  );
}
