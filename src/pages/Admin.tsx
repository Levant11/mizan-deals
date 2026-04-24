import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function Admin() {
  const { user, isAdmin, loading } = useAuth();
  const { t } = useI18n();
  const [stats, setStats] = useState({ users: 0, listings: 0, pending: 0, tickets: 0, ratings: 0, fees: 0 });
  const [pending, setPending] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [reply, setReply] = useState<Record<string,string>>({});

  const load = async () => {
    const [u, l, p, tk, r, f] = await Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("listings").select("id", { count: "exact", head: true }),
      supabase.from("listings").select("*").eq("status","pending_review").order("created_at", { ascending: false }),
      supabase.from("support_tickets").select("*").order("created_at", { ascending: false }).limit(50),
      supabase.from("platform_ratings").select("rating", { count: "exact", head: true }),
      supabase.from("fee_transactions").select("id", { count: "exact", head: true }),
    ]);
    setStats({ users: u.count||0, listings: l.count||0, pending: p.data?.length||0, tickets: tk.data?.filter(x=>x.status==="open").length||0, ratings: r.count||0, fees: f.count||0 });
    setPending(p.data || []);
    setTickets(tk.data || []);
  };
  useEffect(() => { if (isAdmin) load(); }, [isAdmin]);

  if (loading) return <div className="container py-20 text-center">{t("common.loading")}</div>;
  if (!user || !isAdmin) return <Navigate to="/" replace />;

  const moderate = async (id: string, status: "active" | "rejected") => {
    const { error } = await supabase.from("listings").update({ status }).eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Updated"); load(); }
  };

  const respondTicket = async (id: string) => {
    const { error } = await supabase.from("support_tickets").update({ admin_response: reply[id] || "", status: "resolved" }).eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Replied"); load(); }
  };

  const cards = [
    { label: "Users", value: stats.users },
    { label: "Listings", value: stats.listings },
    { label: "Pending review", value: stats.pending },
    { label: "Open tickets", value: stats.tickets },
    { label: "Ratings", value: stats.ratings },
    { label: "Fee txns", value: stats.fees },
  ];

  return (
    <div className="container py-8 animate-fade-in space-y-6">
      <h1 className="text-3xl font-bold">{t("nav.admin")}</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {cards.map((c, i) => (
          <Card key={i}><CardContent className="p-4">
            <div className="text-xs text-muted-foreground">{c.label}</div>
            <div className="text-2xl font-bold">{c.value}</div>
          </CardContent></Card>
        ))}
      </div>

      <Tabs defaultValue="moderation">
        <TabsList>
          <TabsTrigger value="moderation">Listing moderation</TabsTrigger>
          <TabsTrigger value="tickets">Support tickets</TabsTrigger>
        </TabsList>
        <TabsContent value="moderation" className="space-y-3 mt-4">
          {pending.length === 0 ? <Card><CardContent className="py-8 text-center text-muted-foreground">No pending listings.</CardContent></Card> :
            pending.map(l => (
              <Card key={l.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between gap-2 flex-wrap">
                    <CardTitle className="text-base">{l.title}</CardTitle>
                    {l.ai_integrity_score != null && <Badge>AI {l.ai_integrity_score}</Badge>}
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground line-clamp-3">{l.description}</p>
                  {l.ai_integrity_notes && <p className="text-xs italic text-muted-foreground">{l.ai_integrity_notes}</p>}
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => moderate(l.id, "active")} className="bg-success text-success-foreground hover:bg-success/90">Approve</Button>
                    <Button size="sm" variant="destructive" onClick={() => moderate(l.id, "rejected")}>Reject</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>
        <TabsContent value="tickets" className="space-y-3 mt-4">
          {tickets.map(t => (
            <Card key={t.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between gap-2"><CardTitle className="text-base">{t.subject}</CardTitle><Badge variant="outline">{t.status}</Badge></div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm whitespace-pre-wrap">{t.body}</p>
                {t.admin_response ? <div className="text-sm border-s-2 border-primary ps-3"><strong>Reply:</strong> {t.admin_response}</div> : (
                  <div className="space-y-2">
                    <Textarea placeholder="Reply..." value={reply[t.id] || ""} onChange={(e) => setReply({ ...reply, [t.id]: e.target.value })} />
                    <Button size="sm" onClick={() => respondTicket(t.id)}>Send & resolve</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
