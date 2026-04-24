import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, FileText, MessageSquare, ListChecks } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const { t, lang } = useI18n();
  const [stats, setStats] = useState({ listings: 0, offersIn: 0, offersOut: 0, unlocks: 0 });

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [l, oin, oout, u] = await Promise.all([
        supabase.from("listings").select("id", { count: "exact", head: true }).eq("seller_id", user.id),
        supabase.from("offers").select("id, listings!inner(seller_id)", { count: "exact", head: true }).eq("listings.seller_id", user.id),
        supabase.from("offers").select("id", { count: "exact", head: true }).eq("buyer_id", user.id),
        supabase.from("listing_unlocks").select("id", { count: "exact", head: true }).eq("buyer_id", user.id),
      ]);
      setStats({ listings: l.count || 0, offersIn: oin.count || 0, offersOut: oout.count || 0, unlocks: u.count || 0 });
    })();
  }, [user]);

  const cards = [
    { label: lang === "ar" ? "إعلاناتي" : "My listings", value: stats.listings, icon: FileText, to: "/my-listings" },
    { label: lang === "ar" ? "عروض واردة" : "Offers received", value: stats.offersIn, icon: MessageSquare, to: "/offers" },
    { label: lang === "ar" ? "عروض مرسلة" : "Offers sent", value: stats.offersOut, icon: MessageSquare, to: "/offers" },
    { label: lang === "ar" ? "تفاصيل مفتوحة" : "Unlocked", value: stats.unlocks, icon: ListChecks, to: "/browse" },
  ];

  return (
    <div className="container py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-3xl font-bold">{t("nav.dashboard")}</h1>
        <Link to="/listings/new"><Button className="gradient-accent text-accent-foreground border-0"><Plus className="h-4 w-4" />{t("nav.create")}</Button></Link>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c, i) => (
          <Link key={i} to={c.to}>
            <Card className="hover:shadow-elegant transition-base">
              <CardHeader className="flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm text-muted-foreground font-medium">{c.label}</CardTitle>
                <c.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent><div className="text-3xl font-bold">{c.value}</div></CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
