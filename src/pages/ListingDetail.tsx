import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Lock, MapPin, Tag, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function ListingDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { t, lang } = useI18n();
  const [listing, setListing] = useState<any>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [offerOpen, setOfferOpen] = useState(false);
  const [offerAmount, setOfferAmount] = useState("");
  const [offerMessage, setOfferMessage] = useState("");

  const load = async () => {
    if (!id) return;
    setLoading(true);
    const { data } = await supabase.from("listings").select("*").eq("id", id).maybeSingle();
    setListing(data);
    if (user && data) {
      const { data: u } = await supabase.from("listing_unlocks").select("*").eq("listing_id", id).eq("buyer_id", user.id).eq("paid", true).maybeSingle();
      setUnlocked(!!u || data.seller_id === user.id);
    }
    setLoading(false);
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [id, user]);

  const handleUnlock = async () => {
    if (!user || !listing) return;
    // PLACEHOLDER: Stripe payment flow will be added later. For now insert unlock as paid for demo.
    const { error } = await supabase.from("listing_unlocks").insert({ listing_id: listing.id, buyer_id: user.id, unlock_level: 1, paid: true });
    if (error) { toast.error(error.message); return; }
    await supabase.from("fee_transactions").insert({ user_id: user.id, fee_type: "unlock_fee", amount: 5, currency: "USD", status: "pending", related_id: listing.id });
    toast.success(lang === "ar" ? "تم فتح التفاصيل (وضع تجريبي)" : "Details unlocked (demo mode)");
    setUnlocked(true);
  };

  const submitOffer = async () => {
    if (!user || !listing) return;
    const amt = parseFloat(offerAmount);
    if (isNaN(amt) || amt <= 0) { toast.error("Invalid amount"); return; }
    const { error } = await supabase.from("offers").insert({
      listing_id: listing.id, buyer_id: user.id, amount: amt, currency: listing.currency, message: offerMessage.slice(0,1000), fee_paid: false,
    });
    if (error) { toast.error(error.message); return; }
    await supabase.from("fee_transactions").insert({ user_id: user.id, fee_type: "offer_fee", amount: 2, currency: "USD", status: "pending", related_id: listing.id });
    toast.success(lang === "ar" ? "تم إرسال العرض" : "Offer submitted");
    setOfferOpen(false); setOfferAmount(""); setOfferMessage("");
  };

  if (loading) return <div className="container py-20 text-center text-muted-foreground">{t("common.loading")}</div>;
  if (!listing) return <div className="container py-20 text-center">Not found</div>;

  return (
    <div className="container py-8 max-w-5xl animate-fade-in">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <div className="aspect-video bg-muted rounded-lg overflow-hidden">
            {listing.images?.[0] ? <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" /> :
              <div className="flex items-center justify-center h-full text-muted-foreground"><Tag className="h-16 w-16" /></div>}
          </div>
          {listing.images?.length > 1 && (
            <div className="grid grid-cols-4 gap-2 mt-2">
              {listing.images.slice(1,5).map((src: string, i: number) => (
                <img key={i} src={src} alt="" className="aspect-square object-cover rounded-md" />
              ))}
            </div>
          )}
        </div>
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-2xl md:text-3xl font-bold">{listing.title}</h1>
            {listing.ai_integrity_score != null && (
              <Badge className="bg-success text-success-foreground"><Sparkles className="h-3 w-3 me-1" />AI {listing.ai_integrity_score}/100</Badge>
            )}
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{listing.city || "—"}</span>
            <Badge variant="outline">{t(`category.${listing.category}` as any)}</Badge>
          </div>
          {listing.asking_price && (
            <div className="text-3xl font-bold text-primary">{Number(listing.asking_price).toLocaleString()} {listing.currency}</div>
          )}
          <Card>
            <CardHeader><CardTitle className="text-base">{t("common.description")}</CardTitle></CardHeader>
            <CardContent className="text-sm whitespace-pre-wrap">{listing.public_summary || listing.description}</CardContent>
          </Card>

          <Card className={unlocked ? "border-success/40" : "border-warning/40"}>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                {unlocked ? <Sparkles className="h-4 w-4 text-success" /> : <Lock className="h-4 w-4 text-warning" />}
                {unlocked ? (lang==="ar"?"التفاصيل الخاصة":"Private details") : t("common.unlock")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {unlocked ? (
                <>
                  <p className="text-sm whitespace-pre-wrap">{listing.private_details || "—"}</p>
                  {listing.contact_info && <p className="text-sm"><strong>{lang==="ar"?"للتواصل: ":"Contact: "}</strong>{listing.contact_info}</p>}
                </>
              ) : user ? (
                <Button onClick={handleUnlock} className="w-full gradient-accent text-accent-foreground border-0">
                  {t("common.unlock")} · ~$5
                </Button>
              ) : (
                <Link to="/auth"><Button className="w-full">{t("nav.signIn")}</Button></Link>
              )}
            </CardContent>
          </Card>

          {user && listing.seller_id !== user.id && (
            <Dialog open={offerOpen} onOpenChange={setOfferOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">{t("common.makeOffer")}</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>{t("common.makeOffer")}</DialogTitle></DialogHeader>
                <div className="space-y-3">
                  <Input type="number" placeholder={t("common.price")} value={offerAmount} onChange={(e) => setOfferAmount(e.target.value)} />
                  <Textarea placeholder={t("support.body")} value={offerMessage} onChange={(e) => setOfferMessage(e.target.value)} maxLength={1000} />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOfferOpen(false)}>{t("common.cancel")}</Button>
                  <Button onClick={submitOffer} className="gradient-primary text-primary-foreground">{t("common.submit")}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </div>
  );
}
