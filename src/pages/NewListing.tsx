import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import {
  Sparkles, Upload, X, ChevronLeft, ChevronRight,
  AlertCircle, CheckCircle2, Lock, Eye,
  MapPin, Tag, Info, Building2,
  Truck, Wrench, Package, Briefcase, HelpCircle, Shield,
  CreditCard, ArrowRight, Loader2, Star
} from "lucide-react";
import { z } from "zod";
import { cn } from "@/lib/utils";

// ─── Types ─────────────────────────────────────────────────────────────────

const CATEGORIES = ["real_estate", "vehicle", "equipment", "inventory", "business", "other"] as const;
type Category = typeof CATEGORIES[number];
type Currency = "USD" | "IQD";
type ListingTier = "standard" | "featured" | "high_value";

interface FormData {
  title: string;
  category: Category;
  city: string;
  region: string;
  asking_price: string;
  currency: Currency;
  public_summary: string;
  description: string;
  private_details: string;
  contact_info: string;
  tier: ListingTier;
  is_high_value: boolean;
  gps_lat: string;
  gps_lng: string;
  condition: string;
  year_built: string;
  area_sqm: string;
  tags: string[];
}

interface AiResult {
  score: number;
  notes: string;
  flags: string[];
  approved: boolean;
}

// ─── Constants ──────────────────────────────────────────────────────────────

const STEPS = ["basics", "details", "media", "privacy", "review"] as const;
type Step = typeof STEPS[number];

const TIER_FEES: Record<ListingTier, number> = {
  standard: 10,
  featured: 25,
  high_value: 75,
};

const IRAQI_CITIES = [
  "بغداد","البصرة","الموصل","أربيل","السليمانية","دهوك",
  "كربلاء","النجف","كركوك","الرمادي","الفلوجة","تكريت",
  "سامراء","بعقوبة","الحلة","العمارة","الناصرية","الديوانية",
  "الكوت","عنه","القائم","زاخو","دوهوك","حلبجة",
];

const CONDITION_OPTIONS_AR = ["ممتاز","جيد جداً","جيد","مقبول","يحتاج إصلاح"];
const CONDITION_OPTIONS_EN = ["Excellent","Very Good","Good","Fair","Needs Repair"];

const CATEGORY_ICONS: Record<Category, React.ElementType> = {
  real_estate: Building2, vehicle: Truck, equipment: Wrench,
  inventory: Package, business: Briefcase, other: HelpCircle,
};

const CATEGORY_LABELS_AR: Record<Category, string> = {
  real_estate:"عقارات", vehicle:"مركبات", equipment:"معدات",
  inventory:"مخزون", business:"أعمال تجارية", other:"أخرى",
};
const CATEGORY_LABELS_EN: Record<Category, string> = {
  real_estate:"Real Estate", vehicle:"Vehicle", equipment:"Equipment",
  inventory:"Inventory", business:"Business", other:"Other",
};

// ─── Validation Schema ───────────────────────────────────────────────────────

const schema = z.object({
  title: z.string().trim().min(5).max(150),
  description: z.string().trim().min(30).max(5000),
  public_summary: z.string().trim().min(15).max(500),
  private_details: z.string().trim().max(5000),
  contact_info: z.string().trim().max(300),
  category: z.enum(CATEGORIES),
  city: z.string().trim().min(1).max(100),
  asking_price: z.number().positive().max(1e12),
  currency: z.enum(["USD","IQD"]),
});

// ─── Step Indicator ──────────────────────────────────────────────────────────

function StepIndicator({ steps, current, ar }: { steps: readonly Step[]; current: Step; ar: boolean }) {
  const labels: Record<Step, { ar: string; en: string }> = {
    basics:  { ar:"الأساسيات",  en:"Basics"  },
    details: { ar:"التفاصيل",   en:"Details" },
    media:   { ar:"الصور",      en:"Media"   },
    privacy: { ar:"السرية",     en:"Privacy" },
    review:  { ar:"المراجعة",   en:"Review"  },
  };
  const idx = steps.indexOf(current);
  const pct = Math.round((idx / (steps.length - 1)) * 100);

  return (
    <div className="mb-8">
      <div className="flex items-start justify-between mb-4">
        {steps.map((s, i) => {
          const done = i < idx;
          const active = s === current;
          return (
            <div key={s} className="flex flex-col items-center gap-1.5 flex-1">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all border-2",
                done && "bg-primary border-primary text-primary-foreground",
                active && "bg-background border-primary text-primary scale-110 shadow-md ring-4 ring-primary/20",
                !done && !active && "bg-muted border-muted-foreground/25 text-muted-foreground",
              )}>
                {done ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
              </div>
              <span className={cn(
                "text-[10px] hidden sm:block text-center leading-tight",
                active ? "text-primary font-semibold" : "text-muted-foreground"
              )}>
                {ar ? labels[s].ar : labels[s].en}
              </span>
            </div>
          );
        })}
      </div>
      <Progress value={pct} className="h-1.5" />
    </div>
  );
}

// ─── Tier Card ───────────────────────────────────────────────────────────────

function TierCard({ tier, fee, selected, onSelect, ar }: {
  tier: ListingTier; fee: number; selected: boolean; onSelect: () => void; ar: boolean;
}) {
  const info: Record<ListingTier, { ar: [string,string,string[]]; en: [string,string,string[]] }> = {
    standard: {
      ar: ["عادي","مناسب للأصول بسعر معتدل",["ظهور في القائمة","فحص ذكاء اصطناعي","مدة 30 يوماً"]],
      en: ["Standard","For moderate-value assets",["Listed in browse","AI check included","30 days duration"]],
    },
    featured: {
      ar: ["مميز","إبراز في نتائج البحث",["أعلى نتائج البحث","شارة مميز","مدة 60 يوماً"]],
      en: ["Featured","Highlighted in search results",["Top of search results","Featured badge","60 days duration"]],
    },
    high_value: {
      ar: ["قيمة عالية","للأصول ≥ ٢٥٠,٠٠٠ دولار",["تحقق من المشغل مطلوب","قفل متدرج للمشترين","دعم VIP"]],
      en: ["High Value","For assets ≥ $250,000",["Operator verification required","Buyer tiered unlock","VIP support"]],
    },
  };
  const [name, desc, perks] = ar ? info[tier].ar : info[tier].en;
  const borderMap: Record<ListingTier, string> = {
    standard: "border-border", featured: "border-amber-400", high_value: "border-primary",
  };

  return (
    <button type="button" onClick={onSelect} className={cn(
      "w-full text-left rounded-xl border-2 p-4 transition-all hover:shadow-md",
      selected ? `${borderMap[tier]} bg-primary/5 shadow-md` : "border-border hover:border-primary/30",
      ar && "text-right"
    )}>
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 font-semibold text-sm">
          {tier === "featured" && <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />}
          {tier === "high_value" && <Shield className="h-3.5 w-3.5 text-primary" />}
          {name}
        </div>
        <Badge variant={selected ? "default" : "outline"} className="text-xs shrink-0">${fee}</Badge>
      </div>
      <p className="text-xs text-muted-foreground mb-2">{desc}</p>
      <ul className="space-y-1">
        {perks.map(p => (
          <li key={p} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />{p}
          </li>
        ))}
      </ul>
    </button>
  );
}

// ─── Image Upload Grid ───────────────────────────────────────────────────────

function ImageUploadGrid({ images, uploading, onUpload, onRemove, ar }: {
  images: string[]; uploading: boolean;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (i: number) => void; ar: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {images.map((url, i) => (
          <div key={url} className="relative aspect-square rounded-lg overflow-hidden border group">
            <img src={url} alt="" className="w-full h-full object-cover" />
            <button type="button" onClick={() => onRemove(i)}
              className="absolute top-1 right-1 h-6 w-6 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <X className="h-3.5 w-3.5 text-white" />
            </button>
            {i === 0 && (
              <div className="absolute bottom-0 left-0 right-0 bg-primary/80 text-primary-foreground text-[10px] text-center py-0.5">
                {ar ? "رئيسية" : "Main"}
              </div>
            )}
          </div>
        ))}
        {images.length < 8 && (
          <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading}
            className={cn(
              "aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-1.5 transition-colors",
              uploading ? "opacity-50 cursor-not-allowed" : "hover:border-primary hover:bg-primary/5 cursor-pointer"
            )}>
            {uploading
              ? <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              : <><Upload className="h-5 w-5 text-muted-foreground" /><span className="text-[10px] text-muted-foreground">{ar?"إضافة":"Add"}</span></>}
          </button>
        )}
      </div>
      <input ref={inputRef} type="file" multiple accept="image/*" className="hidden" onChange={onUpload} disabled={uploading} />
      <p className="text-xs text-muted-foreground">{ar?`${images.length}/8 صور`:`${images.length}/8 images`}</p>
    </div>
  );
}

// ─── AI Check Panel ──────────────────────────────────────────────────────────

function AiCheckPanel({ result, loading, onRun, canRun, ar }: {
  result: AiResult | null; loading: boolean; onRun: () => void; canRun: boolean; ar: boolean;
}) {
  const scoreColor = (s: number) => s >= 75 ? "text-emerald-600" : s >= 50 ? "text-amber-600" : "text-red-600";
  return (
    <div className="rounded-xl border bg-muted/20 p-4 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="font-medium text-sm">{ar?"فحص نزاهة الإعلان":"AI Integrity Check"}</span>
        </div>
        <Button type="button" size="sm" variant="outline" onClick={onRun} disabled={loading || !canRun}>
          {loading
            ? <><Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />{ar?"جاري الفحص...":"Checking..."}</>
            : ar?"تشغيل الفحص":"Run Check"}
        </Button>
      </div>
      {!result && (
        <p className="text-xs text-muted-foreground">
          {ar
            ? "يفحص الذكاء الاصطناعي الإعلان بحثاً عن تناقضات في السعر أو معلومات ناقصة."
            : "AI checks for price inconsistencies, incomplete info, and potential fraud indicators."}
        </p>
      )}
      {result && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className={cn("text-2xl font-bold tabular-nums", scoreColor(result.score))}>{result.score}</span>
            <span className="text-muted-foreground text-sm">/100</span>
            <Badge variant={result.approved?"default":"destructive"} className="ml-2 text-xs">
              {result.approved?(ar?"مقبول":"Approved"):(ar?"يحتاج مراجعة":"Needs Review")}
            </Badge>
          </div>
          <Progress value={result.score} className="h-1.5" />
          {result.flags.length > 0 && (
            <div className="space-y-1">
              {result.flags.map((f, i) => (
                <div key={i} className="flex items-start gap-1.5 text-xs text-amber-700 bg-amber-50 rounded px-2 py-1">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />{f}
                </div>
              ))}
            </div>
          )}
          <p className="text-xs text-muted-foreground whitespace-pre-wrap">{result.notes}</p>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function NewListing() {
  const { user } = useAuth();
  const { lang } = useI18n();
  const navigate = useNavigate();
  const ar = lang === "ar";

  const [step, setStep] = useState<Step>("basics");
  const [form, setFormState] = useState<FormData>({
    title:"", category:"real_estate", city:"", region:"",
    asking_price:"", currency:"USD",
    public_summary:"", description:"", private_details:"", contact_info:"",
    tier:"standard", is_high_value:false,
    gps_lat:"", gps_lng:"", condition:"", year_built:"", area_sqm:"",
    tags:[],
  });
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [aiResult, setAiResult] = useState<AiResult | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const set = <K extends keyof FormData>(k: K, v: FormData[K]) => {
    setFormState(f => {
      const next = { ...f, [k]: v };
      // Auto-upgrade to high_value tier when price/currency warrants it
      if (k === "asking_price" || k === "currency") {
        const price = parseFloat(k === "asking_price" ? (v as string) : f.asking_price);
        const curr = k === "currency" ? (v as string) : f.currency;
        const isHV = !isNaN(price) && curr === "USD" && price >= 250000;
        next.is_high_value = isHV;
        if (isHV && next.tier !== "high_value") next.tier = "high_value";
        if (!isHV && next.tier === "high_value") next.tier = "standard";
      }
      return next;
    });
  };

  // Image upload
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files?.length) return;
    const remaining = 8 - images.length;
    if (remaining <= 0) { toast.error(ar?"الحد الأقصى 8 صور":"Max 8 images"); return; }
    setUploading(true);
    try {
      const urls: string[] = [];
      for (const file of Array.from(e.target.files).slice(0, remaining)) {
        const ext = file.name.split(".").pop() ?? "jpg";
        const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error } = await supabase.storage.from("listing-images").upload(path, file, { upsert: false });
        if (error) throw error;
        const { data } = supabase.storage.from("listing-images").getPublicUrl(path);
        urls.push(data.publicUrl);
      }
      setImages(prev => [...prev, ...urls]);
    } catch (err: any) {
      toast.error(err.message ?? "Upload failed");
    } finally { setUploading(false); e.target.value = ""; }
  };

  const removeImage = (i: number) => setImages(prev => prev.filter((_, idx) => idx !== i));

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase().replace(/\s+/g, "-");
    if (tag && !form.tags.includes(tag) && form.tags.length < 10) {
      set("tags", [...form.tags, tag]);
      setTagInput("");
    }
  };

  const runAiCheck = async () => {
    setAiLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-listing-check", {
        body: {
          title: form.title, description: form.description,
          category: form.category, asking_price: parseFloat(form.asking_price),
          city: form.city, currency: form.currency, lang,
        },
      });
      if (error) throw error;
      const score = data?.score ?? 0;
      const notes = data?.notes ?? "";
      const flags: string[] = data?.flags ?? [];
      setAiResult({ score, notes, flags, approved: score >= 50 });
      toast.success(ar?"اكتمل الفحص":"AI check complete");
    } catch (e: any) {
      toast.error(e.message || "AI check failed");
    } finally { setAiLoading(false); }
  };

  // Step validation
  const stepValid: Record<Step, boolean> = {
    basics:  form.title.trim().length >= 5 && !!form.city && parseFloat(form.asking_price) > 0,
    details: form.public_summary.trim().length >= 15 && form.description.trim().length >= 30,
    media:   true,
    privacy: true,
    review:  true,
  };

  const next = () => { const i = STEPS.indexOf(step); if (i < STEPS.length - 1) setStep(STEPS[i + 1]); };
  const back = () => { const i = STEPS.indexOf(step); if (i > 0) setStep(STEPS[i - 1]); };

  const submit = async () => {
    if (!user) return;
    const parsed = schema.safeParse({ ...form, asking_price: parseFloat(form.asking_price) });
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
    setSubmitting(true);
    try {
      const payload: any = {
        seller_id: user.id,
        ...parsed.data,
        images,
        ai_integrity_score: aiResult?.score ?? null,
        ai_integrity_notes: aiResult?.notes ?? null,
        status: "pending_review",
        listing_fee_paid: false,
        tier: form.tier,
        is_high_value: form.is_high_value,
        tags: form.tags,
        condition: form.condition || null,
        year_built: form.year_built ? parseInt(form.year_built) : null,
        area_sqm: form.area_sqm ? parseFloat(form.area_sqm) : null,
        gps_lat: form.gps_lat ? parseFloat(form.gps_lat) : null,
        gps_lng: form.gps_lng ? parseFloat(form.gps_lng) : null,
      };
      const { data, error } = await supabase.from("listings").insert(payload).select("id").single();
      if (error) throw error;
      await supabase.from("fee_transactions").insert({
        user_id: user.id, fee_type: "listing_fee",
        amount: TIER_FEES[form.tier], currency: "USD",
        status: "pending", related_id: data.id,
      });
      toast.success(ar?"تم إرسال الإعلان للمراجعة بنجاح":"Listing submitted for review");
      navigate(`/listings/${data.id}`);
    } catch (err: any) {
      toast.error(err.message ?? "Submit failed");
    } finally { setSubmitting(false); }
  };

  const catLabel = (c: Category) => ar ? CATEGORY_LABELS_AR[c] : CATEGORY_LABELS_EN[c];

  return (
    <div className={cn("container py-8 max-w-2xl")} dir={ar ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{ar?"نشر إعلان جديد":"Create New Listing"}</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {ar
            ? "يمر كل إعلان بفحص ذكاء اصطناعي ومراجعة من فريق ميزان قبل النشر."
            : "Every listing passes an AI integrity check and MIZAN team review before going live."}
        </p>
      </div>

      <StepIndicator steps={STEPS} current={step} ar={ar} />

      {/* ── STEP: BASICS ─────────────────────────────────── */}
      {step === "basics" && (
        <div className="space-y-5 animate-fade-in">
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {ar?"عنوان الإعلان":"Listing Title"} <span className="text-destructive">*</span>
            </Label>
            <Input
              value={form.title} onChange={e => set("title", e.target.value)}
              maxLength={150}
              placeholder={ar?"مثال: مستودع تجاري في حي الزهراء":"e.g. Commercial warehouse in Al-Zahraa district"}
              className="text-base"
            />
            <p className="text-xs text-muted-foreground text-right tabular-nums">{form.title.length}/150</p>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">{ar?"الفئة":"Category"} <span className="text-destructive">*</span></Label>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map(c => {
                const Icon = CATEGORY_ICONS[c];
                return (
                  <button key={c} type="button" onClick={() => set("category", c)} className={cn(
                    "rounded-lg border-2 p-3 flex flex-col items-center gap-1.5 transition-all",
                    form.category === c
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border hover:border-primary/40 text-muted-foreground"
                  )}>
                    <Icon className="h-5 w-5" />
                    <span className="text-xs font-medium text-center leading-tight">{catLabel(c)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">{ar?"المدينة":"City"} <span className="text-destructive">*</span></Label>
              <Select value={form.city} onValueChange={v => set("city", v)}>
                <SelectTrigger><SelectValue placeholder={ar?"اختر المدينة":"Select city"} /></SelectTrigger>
                <SelectContent className="max-h-52">
                  {IRAQI_CITIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">{ar?"المنطقة / الحي":"Region / District"}</Label>
              <Input value={form.region} onChange={e => set("region", e.target.value)}
                placeholder={ar?"مثال: حي العطيفية":"e.g. Al-Atifiyah"} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">{ar?"السعر المطلوب":"Asking Price"} <span className="text-destructive">*</span></Label>
              <Input type="number" min={0} value={form.asking_price}
                onChange={e => set("asking_price", e.target.value)} placeholder="0" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">{ar?"العملة":"Currency"}</Label>
              <Select value={form.currency} onValueChange={v => set("currency", v as Currency)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD – دولار</SelectItem>
                  <SelectItem value="IQD">IQD – دينار</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {form.is_high_value && (
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 flex gap-2 text-sm">
              <Shield className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-primary text-xs">{ar?"إعلان ذو قيمة عالية":"High-Value Listing Detected"}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {ar
                    ? "السعر أعلى من ٢٥٠,٠٠٠ دولار. يتطلب تحقق من المشغل قبل إتاحة فتح التفاصيل للمشترين."
                    : "Price exceeds $250,000 USD. Operator verification required before buyers can unlock details."}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── STEP: DETAILS ────────────────────────────────── */}
      {step === "details" && (
        <div className="space-y-5 animate-fade-in">
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-1.5">
              <Eye className="h-4 w-4 text-muted-foreground" />
              {ar?"الملخص العام (مرئي للجميع)":"Public Summary (visible to all)"}
              <span className="text-destructive">*</span>
            </Label>
            <Textarea value={form.public_summary} onChange={e => set("public_summary", e.target.value)}
              maxLength={500} rows={3} className="resize-none"
              placeholder={ar?"وصف موجز يراه الجميع قبل فتح التفاصيل...":"Brief summary visible before unlocking..."} />
            <p className="text-xs text-muted-foreground text-right tabular-nums">{form.public_summary.length}/500</p>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-1.5">
              <Lock className="h-4 w-4 text-muted-foreground" />
              {ar?"الوصف التفصيلي (بعد فتح المستوى ١)":"Full Description (after Level 1 unlock)"}
              <span className="text-destructive">*</span>
            </Label>
            <Textarea value={form.description} onChange={e => set("description", e.target.value)}
              maxLength={5000} rows={6} className="resize-none"
              placeholder={ar?"وصف شامل: الحالة، التاريخ، المواصفات، أسباب البيع...":"Full description: condition, history, specs, reason for sale..."} />
            <p className="text-xs text-muted-foreground text-right tabular-nums">{form.description.length}/5000</p>
          </div>

          {/* Category extras */}
          <div className="rounded-lg border bg-muted/20 p-4 space-y-4">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {ar?"تفاصيل إضافية":"Additional Details"}
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs">{ar?"الحالة":"Condition"}</Label>
                <Select value={form.condition} onValueChange={v => set("condition", v)}>
                  <SelectTrigger className="h-9 text-xs"><SelectValue placeholder={ar?"اختر":"Select"} /></SelectTrigger>
                  <SelectContent>
                    {(ar ? CONDITION_OPTIONS_AR : CONDITION_OPTIONS_EN).map(c =>
                      <SelectItem key={c} value={c} className="text-xs">{c}</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              {["real_estate","equipment"].includes(form.category) && (
                <div className="space-y-1.5">
                  <Label className="text-xs">{ar?"المساحة (م²)":"Area (sqm)"}</Label>
                  <Input type="number" min={0} className="h-9 text-xs"
                    value={form.area_sqm} onChange={e => set("area_sqm", e.target.value)} />
                </div>
              )}
              {["vehicle","equipment"].includes(form.category) && (
                <div className="space-y-1.5">
                  <Label className="text-xs">{ar?"سنة الصنع":"Year Made"}</Label>
                  <Input type="number" min={1900} max={2026} className="h-9 text-xs"
                    value={form.year_built} onChange={e => set("year_built", e.target.value)} placeholder="2020" />
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">{ar?"الوسوم (اختياري)":"Tags (optional)"}</Label>
            <div className="flex gap-2">
              <Input value={tagInput} onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                placeholder={ar?"اكتب وسمًا ثم Enter":"Type a tag then Enter"} maxLength={30} className="text-sm" />
              <Button type="button" size="sm" variant="outline" onClick={addTag}>
                <Tag className="h-4 w-4" />
              </Button>
            </div>
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-1">
                {form.tags.map(t => (
                  <Badge key={t} variant="secondary" className="text-xs gap-1 pr-1">
                    {t}
                    <button type="button" onClick={() => set("tags", form.tags.filter(x => x !== t))}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <AiCheckPanel
            result={aiResult} loading={aiLoading} onRun={runAiCheck}
            canRun={form.title.length >= 5 && form.description.length >= 30} ar={ar}
          />
        </div>
      )}

      {/* ── STEP: MEDIA ──────────────────────────────────── */}
      {step === "media" && (
        <div className="space-y-5 animate-fade-in">
          <div className="space-y-2">
            <Label className="text-sm font-medium">{ar?"صور الأصل":"Asset Images"}</Label>
            <p className="text-xs text-muted-foreground">
              {ar
                ? "أضف حتى ٨ صور. الصورة الأولى ستكون صورة الغلاف. صور واضحة تزيد من فرص الفتح."
                : "Add up to 8 photos. First photo is the cover. Clear images significantly increase unlock rates."}
            </p>
            <ImageUploadGrid images={images} uploading={uploading} onUpload={handleUpload} onRemove={removeImage} ar={ar} />
          </div>

          {images.length === 0 && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 flex gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800">
                {ar
                  ? "الإعلانات التي تحتوي على صور تحصل على معدل فتح أعلى بنسبة ٣ أضعاف. ننصح بإضافة صور."
                  : "Listings with photos get 3× more unlocks. We strongly recommend adding images."}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              {ar?"الموقع الجغرافي (اختياري)":"GPS Coordinates (optional)"}
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <Input type="number" step="any" placeholder="Latitude 33.xx"
                value={form.gps_lat} onChange={e => set("gps_lat", e.target.value)} className="text-xs" />
              <Input type="number" step="any" placeholder="Longitude 44.xx"
                value={form.gps_lng} onChange={e => set("gps_lng", e.target.value)} className="text-xs" />
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Lock className="h-3 w-3" />
              {ar
                ? "الإحداثيات الدقيقة تُكشف فقط للمشترين الذين دفعوا مقابل فتح المستوى الثاني."
                : "Exact coordinates are revealed only to buyers who paid for Level 2 unlock."}
            </p>
          </div>
        </div>
      )}

      {/* ── STEP: PRIVACY ────────────────────────────────── */}
      {step === "privacy" && (
        <div className="space-y-5 animate-fade-in">
          <div className="rounded-lg border bg-primary/5 border-primary/20 p-3 flex gap-2">
            <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-primary/80">
              {ar
                ? "المعلومات في هذا القسم مشفرة ولا تظهر إلا بعد أن يدفع المشتري رسوم فتح التفاصيل عبر Stripe."
                : "Information in this section is hidden and only revealed after the buyer pays the unlock fee via Stripe."}
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-1.5">
              <Lock className="h-4 w-4 text-amber-600" />
              {ar?"التفاصيل الخاصة (بعد فتح المستوى ١)":"Private Details (after Level 1 unlock)"}
            </Label>
            <Textarea value={form.private_details} onChange={e => set("private_details", e.target.value)}
              maxLength={5000} rows={4} className="resize-none"
              placeholder={ar
                ? "معلومات إضافية للمشتري الجاد: التوثيقات، وضع الديون، شروط التفاوض..."
                : "Extra info for serious buyers: documentation, debt status, negotiation terms..."} />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-1.5">
              <Lock className="h-4 w-4 text-destructive" />
              {ar?"معلومات التواصل (بعد فتح المستوى ٢)":"Contact Info (after Level 2 unlock)"}
            </Label>
            <Input value={form.contact_info} onChange={e => set("contact_info", e.target.value)}
              maxLength={300}
              placeholder={ar
                ? "رقم الهاتف، واتساب، بريد إلكتروني — لن يُكشف إلا بعد الفتح المدفوع"
                : "Phone, WhatsApp, email — not revealed until paid unlock"} />
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-1.5">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              {ar?"نوع الإعلان ورسوم النشر":"Listing Tier & Fee"}
            </Label>
            <div className="space-y-2">
              {(["standard","featured","high_value"] as ListingTier[]).map(tier => (
                <TierCard key={tier} tier={tier} fee={TIER_FEES[tier]}
                  selected={form.tier === tier}
                  onSelect={() => {
                    if (tier === "high_value" && !form.is_high_value) {
                      toast.error(ar
                        ? "فئة القيمة العالية للأصول بسعر ≥ ٢٥٠,٠٠٠ دولار فقط"
                        : "High Value tier requires asset price ≥ $250,000 USD");
                      return;
                    }
                    set("tier", tier);
                  }}
                  ar={ar}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              {ar
                ? "الرسوم تُدفع عبر Stripe بعد مراجعة الإعلان. لا يوجد رصيد داخلي."
                : "Fees are charged via Stripe after team review. No internal wallet balance."}
            </p>
          </div>
        </div>
      )}

      {/* ── STEP: REVIEW ─────────────────────────────────── */}
      {step === "review" && (
        <div className="space-y-5 animate-fade-in">
          <div className="rounded-xl border divide-y overflow-hidden">
            <div className="px-4 py-2.5 bg-muted/30">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                {ar?"ملخص الإعلان":"Listing Summary"}
              </p>
            </div>
            {[
              { label: ar?"العنوان":"Title", value: form.title || "—" },
              { label: ar?"الفئة":"Category", value: catLabel(form.category) },
              { label: ar?"الموقع":"Location", value: [form.city, form.region].filter(Boolean).join(" – ") || "—" },
              { label: ar?"السعر":"Price", value: form.asking_price ? `${Number(form.asking_price).toLocaleString()} ${form.currency}` : "—" },
              { label: ar?"نوع الإعلان":"Tier", value: form.tier === "standard" ? (ar?"عادي":"Standard") : form.tier === "featured" ? (ar?"مميز":"Featured") : (ar?"قيمة عالية":"High Value") },
              { label: ar?"رسوم النشر":"Listing Fee", value: `$${TIER_FEES[form.tier]} USD` },
              { label: ar?"الصور":"Images", value: `${images.length}` },
              { label: ar?"فحص الذكاء الاصطناعي":"AI Check", value: aiResult ? `${aiResult.score}/100` : (ar?"لم يُشغَّل":"Not run") },
            ].map(row => (
              <div key={row.label} className="px-4 py-2.5 flex items-start justify-between gap-4 text-sm">
                <span className="text-muted-foreground shrink-0">{row.label}</span>
                <span className="font-medium text-right">{row.value}</span>
              </div>
            ))}
          </div>

          {/* Legal notice */}
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 space-y-2">
            <p className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
              <AlertCircle className="h-4 w-4" />
              {ar?"إشعار قانوني":"Legal Notice"}
            </p>
            <p className="text-xs text-amber-800 leading-relaxed">
              {ar
                ? "هذا الإعلان تعبير عن نية جادة للبيع. ميزان لا يضمن إتمام الصفقات ولا يتوسط في نزاعات المعاملات الخارجية. بنشر هذا الإعلان، تؤكد أن جميع المعلومات صحيحة وأنك مخول قانونياً ببيع هذا الأصل."
                : "This listing is an expression of serious intent to sell. MIZAN does not guarantee transaction completion and does not mediate external transaction disputes. By submitting, you confirm all information is accurate and you are legally authorized to sell this asset."}
            </p>
          </div>

          {!aiResult && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 flex gap-2">
              <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-800">
                {ar
                  ? "لم تُشغّل فحص الذكاء الاصطناعي بعد. يُنصح بتشغيله لتحسين فرص قبول إعلانك."
                  : "AI integrity check not run yet. Running it improves your listing's acceptance chances."}
              </p>
            </div>
          )}

          <Button
            className="w-full gradient-primary text-primary-foreground h-11 text-base font-medium"
            onClick={submit} disabled={submitting}
          >
            {submitting
              ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />{ar?"جاري الإرسال...":"Submitting..."}</>
              : <>{ar?"إرسال الإعلان للمراجعة":"Submit Listing for Review"}<ArrowRight className="h-4 w-4 ml-2" /></>}
          </Button>
        </div>
      )}

      {/* ── Navigation ───────────────────────────────────── */}
      <div className="flex items-center justify-between mt-8 pt-4 border-t">
        <Button type="button" variant="ghost" onClick={back} disabled={step === "basics"} className="gap-1.5">
          <ChevronLeft className="h-4 w-4" />
          {ar?"السابق":"Back"}
        </Button>
        {step !== "review" && (
          <Button type="button" onClick={next} disabled={!stepValid[step]}
            className="gap-1.5 gradient-primary text-primary-foreground">
            {ar?"التالي":"Next"}
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
