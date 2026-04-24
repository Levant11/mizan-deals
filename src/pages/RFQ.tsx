import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { toast } from "sonner";

const categories = ["real_estate","vehicle","equipment","inventory","business","other"] as const;

export default function RFQ() {
  const { user } = useAuth();
  const { t, lang } = useI18n();
  const [items, setItems] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [respondingTo, setRespondingTo] = useState<any>(null);
  const [form, setForm] = useState({ title: "", description: "", category: "real_estate" as typeof categories[number], city: "", budget_min: "", budget_max: "", currency: "USD" });
  const [respMsg, setRespMsg] = useState("");
  const [respPrice, setRespPrice] = useState("");

  const load = async () => {
    const { data } = await supabase.from("rfqs").select("*").eq("status", "open").order("created_at", { ascending: false }).limit(60);
    setItems(data || []);
  };
  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!user) return;
    const payload: any = {
      buyer_id: user.id, title: form.title.slice(0,150), description: form.description.slice(0,3000),
      category: form.category, city: form.city.slice(0,100), currency: form.currency,
      budget_min: form.budget_min ? parseFloat(form.budget_min) : null,
      budget_max: form.budget_max ? parseFloat(form.budget_max) : null,
    };
    if (!payload.title || !payload.description) { toast.error("Required"); return; }
    const { error } = await supabase.from("rfqs").insert(payload);
    if (error) { toast.error(error.message); return; }
    toast.success(lang==="ar"?"تم نشر الطلب":"Request posted");
    setOpen(false); setForm({ title: "", description: "", category: "real_estate", city: "", budget_min: "", budget_max: "", currency: "USD" });
    load();
  };

  const respond = async () => {
    if (!user || !respondingTo) return;
    const { error } = await supabase.from("rfq_responses").insert({
      rfq_id: respondingTo.id, responder_id: user.id, message: respMsg.slice(0,2000),
      proposed_price: respPrice ? parseFloat(respPrice) : null, fee_paid: false,
    });
    if (error) { toast.error(error.message); return; }
    await supabase.from("fee_transactions").insert({ user_id: user.id, fee_type: "rfq_response_fee", amount: 3, currency: "USD", status: "pending", related_id: respondingTo.id });
    toast.success(lang==="ar"?"تم الإرسال":"Sent");
    setRespondingTo(null); setRespMsg(""); setRespPrice("");
  };

  return (
    <div className="container py-8 animate-fade-in">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <h1 className="text-3xl font-bold">{t("nav.rfq")}</h1>
        {user && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button className="gradient-accent text-accent-foreground border-0"><Plus className="h-4 w-4" />{lang==="ar"?"نشر طلب":"Post a request"}</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{lang==="ar"?"نشر طلب شراء":"Post buyer request"}</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <Input placeholder={t("common.title")} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} maxLength={150} />
                <Textarea placeholder={t("common.description")} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} maxLength={3000} />
                <div className="grid grid-cols-2 gap-2">
                  <Select value={form.category} onValueChange={(v: any) => setForm({ ...form, category: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{t(`category.${c}` as any)}</SelectItem>)}</SelectContent>
                  </Select>
                  <Input placeholder={t("common.city")} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                  <Input type="number" placeholder="Min budget" value={form.budget_min} onChange={(e) => setForm({ ...form, budget_min: e.target.value })} />
                  <Input type="number" placeholder="Max budget" value={form.budget_max} onChange={(e) => setForm({ ...form, budget_max: e.target.value })} />
                </div>
              </div>
              <DialogFooter><Button onClick={create} className="gradient-primary text-primary-foreground">{t("common.submit")}</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {items.length === 0 ? <Card><CardContent className="py-16 text-center text-muted-foreground">No open requests.</CardContent></Card> : (
        <div className="grid md:grid-cols-2 gap-4">
          {items.map(r => (
            <Card key={r.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between gap-2">
                  <CardTitle className="text-base">{r.title}</CardTitle>
                  <Badge variant="outline">{t(`category.${r.category}` as any)}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground line-clamp-3">{r.description}</p>
                <div className="text-sm">
                  {r.city && <span className="text-muted-foreground">{r.city} · </span>}
                  {(r.budget_min || r.budget_max) && <span className="font-medium">Budget: {r.budget_min || "?"} - {r.budget_max || "?"} {r.currency}</span>}
                </div>
                {user && user.id !== r.buyer_id && (
                  <Button size="sm" variant="outline" onClick={() => setRespondingTo(r)}>{lang==="ar"?"رد على الطلب":"Respond"}</Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!respondingTo} onOpenChange={(o) => !o && setRespondingTo(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{lang==="ar"?"رد على الطلب":"Respond"} · ~$3</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Textarea placeholder={t("common.description")} value={respMsg} onChange={(e) => setRespMsg(e.target.value)} maxLength={2000} />
            <Input type="number" placeholder="Proposed price (optional)" value={respPrice} onChange={(e) => setRespPrice(e.target.value)} />
          </div>
          <DialogFooter><Button onClick={respond} className="gradient-primary text-primary-foreground">{t("common.submit")}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
