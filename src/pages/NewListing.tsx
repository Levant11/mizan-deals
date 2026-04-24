import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Sparkles, Upload } from "lucide-react";
import { z } from "zod";

const categories = ["real_estate","vehicle","equipment","inventory","business","other"] as const;

const schema = z.object({
  title: z.string().trim().min(5).max(150),
  description: z.string().trim().min(20).max(5000),
  public_summary: z.string().trim().min(10).max(500),
  private_details: z.string().trim().max(5000),
  contact_info: z.string().trim().max(300),
  category: z.enum(categories),
  city: z.string().trim().max(100),
  asking_price: z.number().positive().max(1e12),
  currency: z.enum(["USD","IQD"]),
});

export default function NewListing() {
  const { user } = useAuth();
  const { t, lang } = useI18n();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "", description: "", public_summary: "", private_details: "", contact_info: "",
    category: "real_estate" as typeof categories[number], city: "", asking_price: "", currency: "USD" as "USD"|"IQD",
  });
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [aiResult, setAiResult] = useState<{score:number; notes:string} | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const setField = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files?.length) return;
    setUploading(true);
    try {
      const urls: string[] = [];
      for (const file of Array.from(e.target.files).slice(0, 5)) {
        const ext = file.name.split('.').pop();
        const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error } = await supabase.storage.from("listing-images").upload(path, file);
        if (error) throw error;
        const { data } = supabase.storage.from("listing-images").getPublicUrl(path);
        urls.push(data.publicUrl);
      }
      setImages(prev => [...prev, ...urls]);
    } catch (err: any) { toast.error(err.message); }
    finally { setUploading(false); }
  };

  const runAiCheck = async () => {
    setAiLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-listing-check", {
        body: { title: form.title, description: form.description, category: form.category, asking_price: form.asking_price, city: form.city, lang },
      });
      if (error) throw error;
      setAiResult(data);
      toast.success(lang === "ar" ? "اكتمل الفحص" : "AI check complete");
    } catch (e: any) { toast.error(e.message || "AI check failed"); }
    finally { setAiLoading(false); }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const parsed = schema.safeParse({ ...form, asking_price: parseFloat(form.asking_price) });
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
    setSubmitting(true);
    const insertPayload: any = {
      seller_id: user.id,
      ...parsed.data,
      images,
      ai_integrity_score: aiResult?.score ?? null,
      ai_integrity_notes: aiResult?.notes ?? null,
      status: "pending_review",
      listing_fee_paid: false,
    };
    const { data, error } = await supabase.from("listings").insert(insertPayload).select("id").single();
    if (error) { toast.error(error.message); setSubmitting(false); return; }
    await supabase.from("fee_transactions").insert({ user_id: user.id, fee_type: "listing_fee", amount: 10, currency: "USD", status: "pending", related_id: data.id });
    toast.success(lang === "ar" ? "تم إرسال الإعلان للمراجعة" : "Listing submitted for review");
    navigate(`/listings/${data.id}`);
  };

  return (
    <div className="container py-8 max-w-3xl animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle>{t("nav.create")}</CardTitle>
          <CardDescription>{lang==="ar"?"رسوم نشر الإعلان تُدفع بعد المراجعة. يمر كل إعلان بفحص نزاهة آلي.":"A listing fee applies after review. Every listing passes an AI integrity check."}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2"><Label>{t("common.title")}</Label>
              <Input value={form.title} onChange={(e) => setField("title", e.target.value)} maxLength={150} required /></div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>{t("common.category")}</Label>
                <Select value={form.category} onValueChange={(v) => setField("category", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{t(`category.${c}` as any)}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>{t("common.city")}</Label>
                <Input value={form.city} onChange={(e) => setField("city", e.target.value)} maxLength={100} /></div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>{t("common.price")}</Label>
                <Input type="number" value={form.asking_price} onChange={(e) => setField("asking_price", e.target.value)} required /></div>
              <div className="space-y-2"><Label>Currency</Label>
                <Select value={form.currency} onValueChange={(v) => setField("currency", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="USD">USD</SelectItem><SelectItem value="IQD">IQD</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2"><Label>Public summary</Label>
              <Textarea value={form.public_summary} onChange={(e) => setField("public_summary", e.target.value)} maxLength={500} required /></div>
            <div className="space-y-2"><Label>{t("common.description")}</Label>
              <Textarea value={form.description} onChange={(e) => setField("description", e.target.value)} maxLength={5000} required rows={5} /></div>
            <div className="space-y-2"><Label>Private details (after unlock)</Label>
              <Textarea value={form.private_details} onChange={(e) => setField("private_details", e.target.value)} maxLength={5000} rows={3} /></div>
            <div className="space-y-2"><Label>Contact info (after unlock)</Label>
              <Input value={form.contact_info} onChange={(e) => setField("contact_info", e.target.value)} maxLength={300} /></div>

            <div className="space-y-2">
              <Label>Images (max 5)</Label>
              <div className="flex items-center gap-2">
                <Input type="file" multiple accept="image/*" onChange={handleUpload} disabled={uploading || images.length >= 5} />
                {uploading && <span className="text-sm text-muted-foreground">{t("common.loading")}</span>}
              </div>
              {images.length > 0 && (
                <div className="grid grid-cols-5 gap-2 mt-2">
                  {images.map((u, i) => <img key={i} src={u} alt="" className="aspect-square object-cover rounded-md" />)}
                </div>
              )}
            </div>

            <div className="border rounded-lg p-4 bg-muted/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-medium"><Sparkles className="h-4 w-4 text-primary" />AI Integrity Check</div>
                <Button type="button" size="sm" variant="outline" onClick={runAiCheck} disabled={aiLoading || !form.title || !form.description}>
                  {aiLoading ? t("common.loading") : "Run check"}
                </Button>
              </div>
              {aiResult && (
                <div className="space-y-2">
                  <Badge className="bg-success text-success-foreground">Score: {aiResult.score}/100</Badge>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{aiResult.notes}</p>
                </div>
              )}
            </div>

            <Button type="submit" className="w-full gradient-primary text-primary-foreground" disabled={submitting}>
              {submitting ? t("common.loading") : t("common.submit")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
