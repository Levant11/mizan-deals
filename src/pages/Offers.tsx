import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function Offers() {
  const { user } = useAuth();
  const { t, lang } = useI18n();
  const [received, setReceived] = useState<any[]>([]);
  const [sent, setSent] = useState<any[]>([]);
  const [counterAmt, setCounterAmt] = useState<Record<string,string>>({});

  const load = async () => {
    if (!user) return;
    const { data: ownedListings } = await supabase.from("listings").select("id,title").eq("seller_id", user.id);
    const ids = (ownedListings || []).map(l => l.id);
    const titleMap: Record<string,string> = Object.fromEntries((ownedListings || []).map(l => [l.id, l.title]));
    if (ids.length) {
      const { data: r } = await supabase.from("offers").select("*").in("listing_id", ids).order("created_at", { ascending: false });
      setReceived((r || []).map(o => ({ ...o, listing_title: titleMap[o.listing_id] })));
    }
    const { data: s } = await supabase.from("offers").select("*, listings(title)").eq("buyer_id", user.id).order("created_at", { ascending: false });
    setSent((s || []).map((o: any) => ({ ...o, listing_title: o.listings?.title })));
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [user]);

  const updateOffer = async (id: string, status: string) => {
    const { error } = await supabase.from("offers").update({ status }).eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Updated"); load(); }
  };

  const counter = async (offer: any) => {
    if (!user) return;
    const amt = parseFloat(counterAmt[offer.id] || "");
    if (isNaN(amt) || amt <= 0) { toast.error("Invalid"); return; }
    const { error } = await supabase.from("offers").insert({
      listing_id: offer.listing_id, buyer_id: offer.buyer_id, amount: amt, currency: offer.currency,
      message: lang==="ar"?"عرض مضاد من البائع":"Counter from seller", parent_offer_id: offer.id, status: "pending", fee_paid: false,
    });
    if (error) { toast.error(error.message); return; }
    await supabase.from("offers").update({ status: "countered" }).eq("id", offer.id);
    toast.success("Counter sent"); load();
  };

  const Row = ({ o, isOwner }: { o: any; isOwner: boolean }) => (
    <Card>
      <CardContent className="p-4 space-y-2">
        <div className="flex justify-between gap-2 flex-wrap">
          <div>
            <div className="font-semibold">{o.listing_title}</div>
            <div className="text-sm text-muted-foreground">{new Date(o.created_at).toLocaleString()}</div>
          </div>
          <Badge variant="outline">{o.status}</Badge>
        </div>
        <div className="text-2xl font-bold text-primary">{Number(o.amount).toLocaleString()} {o.currency}</div>
        {o.message && <p className="text-sm text-muted-foreground">{o.message}</p>}
        {isOwner && o.status === "pending" && (
          <div className="flex flex-wrap gap-2 pt-2">
            <Button size="sm" onClick={() => updateOffer(o.id, "accepted")} className="bg-success text-success-foreground hover:bg-success/90">{t("common.accept")}</Button>
            <Button size="sm" variant="outline" onClick={() => updateOffer(o.id, "declined")}>{t("common.decline")}</Button>
            <Input className="w-32" placeholder="Counter" value={counterAmt[o.id] || ""} onChange={(e) => setCounterAmt({ ...counterAmt, [o.id]: e.target.value })} />
            <Button size="sm" variant="outline" onClick={() => counter(o)}>{t("common.counter")}</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="container py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">{t("nav.offers")}</h1>
      <Tabs defaultValue="received">
        <TabsList>
          <TabsTrigger value="received">{lang==="ar"?"عروض واردة":"Received"} ({received.length})</TabsTrigger>
          <TabsTrigger value="sent">{lang==="ar"?"عروض مرسلة":"Sent"} ({sent.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="received" className="space-y-3 mt-4">
          {received.length === 0 ? <Card><CardContent className="py-12 text-center text-muted-foreground">No offers received.</CardContent></Card> : received.map(o => <Row key={o.id} o={o} isOwner />)}
        </TabsContent>
        <TabsContent value="sent" className="space-y-3 mt-4">
          {sent.length === 0 ? <Card><CardContent className="py-12 text-center text-muted-foreground">No offers sent.</CardContent></Card> : sent.map(o => <Row key={o.id} o={o} isOwner={false} />)}
        </TabsContent>
      </Tabs>
    </div>
  );
}
