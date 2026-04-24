import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const statusColors: Record<string, string> = {
  active: "bg-success text-success-foreground",
  pending_review: "bg-warning text-warning-foreground",
  draft: "bg-muted text-muted-foreground",
  sold: "bg-primary text-primary-foreground",
  rejected: "bg-destructive text-destructive-foreground",
  archived: "bg-secondary text-secondary-foreground",
};

export default function MyListings() {
  const { user } = useAuth();
  const { t } = useI18n();
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase.from("listings").select("*").eq("seller_id", user.id).order("created_at", { ascending: false }).then(({ data }) => setItems(data || []));
  }, [user]);

  return (
    <div className="container py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">{t("nav.myListings")}</h1>
      {items.length === 0 ? (
        <Card><CardContent className="py-16 text-center text-muted-foreground">No listings yet. <Link to="/listings/new" className="text-primary underline">Create one</Link></CardContent></Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {items.map(l => (
            <Link key={l.id} to={`/listings/${l.id}`}>
              <Card className="hover:shadow-elegant transition-base">
                <CardContent className="p-4 flex gap-4">
                  <div className="h-20 w-20 rounded-md bg-muted overflow-hidden shrink-0">
                    {l.images?.[0] && <img src={l.images[0]} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold line-clamp-1">{l.title}</h3>
                      <Badge className={statusColors[l.status] || ""}>{t(`common.${l.status === "pending_review" ? "pending" : l.status}` as any)}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{l.public_summary}</p>
                    {l.asking_price && <div className="font-bold text-primary mt-2">{Number(l.asking_price).toLocaleString()} {l.currency}</div>}
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
