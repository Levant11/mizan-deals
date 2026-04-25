import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Tag, Search } from "lucide-react";

const categories = ["all","real_estate","vehicle","equipment","inventory","business","other"] as const;

export default function Browse() {
  const { t } = useI18n();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");

  useEffect(() => {
    (async () => {
      setLoading(true);
      let q = supabase.from("listings").select("id,title,public_summary,category,city,asking_price,currency,images,ai_integrity_score,created_at").eq("status","active").order("created_at", { ascending: false }).limit(60);
      if (category !== "all") q = q.eq("category", category as any);
      const { data } = await q;
      setListings(data || []);
      setLoading(false);
    })();
  }, [category]);

  const filtered = listings.filter(l => !search || l.title.toLowerCase().includes(search.toLowerCase()) || (l.city || "").toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="container py-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">{t("nav.browse")}</h1>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute top-1/2 -translate-y-1/2 start-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder={t("common.search")} value={search} onChange={(e) => setSearch(e.target.value)} className="ps-9" />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              {categories.map(c => <SelectItem key={c} value={c}>{c === "all" ? t("common.category") : t(`category.${c}` as any)}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-muted-foreground">{t("common.loading")}</div>
      ) : filtered.length === 0 ? (
        <Card><CardContent className="py-20 text-center text-muted-foreground">No active listings yet.</CardContent></Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(l => (
            <Link key={l.id} to={`/listings/${l.id}`}>
              <Card className="overflow-hidden hover:shadow-elegant transition-base h-full">
                <div className="aspect-video bg-muted relative">
                  {l.images?.[0] ? (
                    <img src={l.images[0]} alt={l.title} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground"><Tag className="h-10 w-10" /></div>
                  )}
                  {l.ai_integrity_score != null && (
                    <Badge className="absolute top-2 end-2 bg-success text-success-foreground">AI {l.ai_integrity_score}/100</Badge>
                  )}
                </div>
                <CardContent className="p-4 space-y-2">
                  <h3 className="font-semibold line-clamp-1">{l.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{l.public_summary || ""}</p>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />{l.city || "—"}</span>
                    {l.asking_price && <span className="font-bold text-primary">{Number(l.asking_price).toLocaleString()} {l.currency}</span>}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
