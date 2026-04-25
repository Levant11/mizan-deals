import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Plus, FileText, MessageSquare, Eye, HelpCircle,
  FileQuestion, TrendingUp, CheckCircle2, AlertCircle, Clock, Crown
} from "lucide-react";

interface Stats {
  activeListings: number;
  totalListings: number;
  unlockedListings: number;
  offersSent: number;
  offersReceived: number;
  rfqsPosted: number;
  openTickets: number;
  subscriptionPlan: string | null;
  subscriptionStatus: string | null;
}

function calcCompletion(profile: any): number {
  if (!profile) return 0;
  const fields = ["full_name", "phone", "whatsapp", "email", "city", "avatar_url"];
  const filled = fields.filter(f => profile[f] && String(profile[f]).trim().length > 0).length;
  return Math.round((filled / fields.length) * 100);
}

export default function Dashboard() {
  const { user, profile } = useAuth();
  const { lang } = useI18n();
  const [stats, setStats] = useState<Stats>({
    activeListings: 0, totalListings: 0, unlockedListings: 0,
    offersSent: 0, offersReceived: 0, rfqsPosted: 0, openTickets: 0,
    subscriptionPlan: null, subscriptionStatus: null,
  });
  const [loading, setLoading] = useState(true);

  const completion = calcCompletion(profile);
  const ar = lang === "ar";

  useEffect(() => {
    if (!user) return;
    (async () => {
      // Offers received: join through seller's listing IDs (offers has no seller_id column)
      const { data: myListings } = await supabase
        .from("listings").select("id").eq("seller_id", user.id);
      const listingIds = (myListings || []).map((l: any) => l.id);

      const [active, total, unlocks, sent, rfqs, tickets] = await Promise.all([
        supabase.from("listings").select("id", { count: "exact", head: true }).eq("seller_id", user.id).eq("status", "active"),
        supabase.from("listings").select("id", { count: "exact", head: true }).eq("seller_id", user.id),
        // correct table name is listing_unlocks
        supabase.from("listing_unlocks").select("id", { count: "exact", head: true }).eq("buyer_id", user.id).eq("paid", true),
        supabase.from("offers").select("id", { count: "exact", head: true }).eq("buyer_id", user.id),
        supabase.from("rfqs").select("id", { count: "exact", head: true }).eq("buyer_id", user.id),
        supabase.from("support_tickets").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("status", "open"),
      ]);

      let receivedCount = 0;
      if (listingIds.length > 0) {
        const { count } = await supabase.from("offers").select("id", { count: "exact", head: true }).in("listing_id", listingIds);
        receivedCount = count || 0;
      }

      setStats({
        activeListings: active.count || 0,
        totalListings: total.count || 0,
        unlockedListings: unlocks.count || 0,
        offersSent: sent.count || 0,
        offersReceived: receivedCount,
        rfqsPosted: rfqs.count || 0,
        openTickets: tickets.count || 0,
        subscriptionPlan: null,
        subscriptionStatus: null,
      });
      setLoading(false);
    })();
  }, [user]);

  const statCards = [
    { label: ar ? "إعلانات نشطة" : "Active listings", value: stats.activeListings, sub: ar ? `من ${stats.totalListings} إجمالاً` : `of ${stats.totalListings} total`, icon: FileText, color: "text-primary", bg: "bg-primary/10", to: "/my-listings" },
    { label: ar ? "تفاصيل مفتوحة" : "Unlocked listings", value: stats.unlockedListings, sub: ar ? "بادئ بالاطلاع على التفاصيل" : "You've accessed details", icon: Eye, color: "text-accent", bg: "bg-accent/10", to: "/browse" },
    { label: ar ? "عروض أرسلتها" : "Offers sent", value: stats.offersSent, sub: ar ? "عروض قدمتها كمشتري" : "As buyer", icon: MessageSquare, color: "text-blue-600", bg: "bg-blue-50", to: "/offers" },
    { label: ar ? "عروض واردة" : "Offers received", value: stats.offersReceived, sub: ar ? "عروض وصلتك كبائع" : "As seller", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50", to: "/offers" },
    { label: ar ? "طلبات شراء" : "RFQs posted", value: stats.rfqsPosted, sub: ar ? "طلبات البحث عن أصول" : "Requests for quotes", icon: FileQuestion, color: "text-violet-600", bg: "bg-violet-50", to: "/rfq" },
    { label: ar ? "تذاكر مفتوحة" : "Open tickets", value: stats.openTickets, sub: ar ? "طلبات دعم قيد المراجعة" : "Support requests", icon: HelpCircle, color: "text-orange-600", bg: "bg-orange-50", to: "/support" },
  ];

  const verStatus = profile?.verification_status || "unverified";
  const verBadge = verStatus === "verified"
    ? { label: ar ? "موثق" : "Verified", cls: "bg-success/15 text-success border-success/30", icon: CheckCircle2 }
    : verStatus === "pending"
    ? { label: ar ? "قيد المراجعة" : "Pending review", cls: "bg-warning/15 text-warning border-warning/30", icon: Clock }
    : { label: ar ? "غير موثق" : "Unverified", cls: "bg-muted text-muted-foreground border-border", icon: AlertCircle };

  const VerIcon = verBadge.icon;

  return (
    <div className="container py-8 max-w-6xl animate-fade-in" dir={ar ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">{ar ? `مرحباً، ${profile?.full_name?.split(" ")[0] || ""}` : `Welcome, ${profile?.full_name?.split(" ")[0] || ""}`}</h1>
          <p className="text-muted-foreground mt-1">{ar ? "هنا نظرة شاملة على حسابك في ميزان" : "Here's an overview of your MIZAN account"}</p>
        </div>
        <Link to="/listings/new">
          <Button className="gradient-accent text-accent-foreground border-0 shadow-md gap-2">
            <Plus className="h-4 w-4" />
            {ar ? "نشر إعلان جديد" : "New listing"}
          </Button>
        </Link>
      </div>

      {/* Profile completion + subscription row */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {/* Profile completion */}
        <Card className={`border-2 ${completion < 100 ? "border-accent/30" : "border-success/30"}`}>
          <CardContent className="pt-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-semibold text-sm">{ar ? "اكتمال الملف الشخصي" : "Profile completion"}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {completion < 100
                    ? (ar ? "أكمل ملفك لزيادة الثقة" : "Complete your profile to build trust")
                    : (ar ? "ملفك مكتمل!" : "Profile complete!")}
                </p>
              </div>
              <div className="text-2xl font-bold" style={{ color: `hsl(var(--${completion === 100 ? "success" : "accent"}))` }}>{completion}%</div>
            </div>
            <Progress value={completion} className="h-2 mb-3" />
            {completion < 100 && (
              <Link to="/profile">
                <Button variant="outline" size="sm" className="text-xs border-accent text-accent hover:bg-accent/10">
                  {ar ? "إكمال الملف الشخصي" : "Complete profile"}
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>

        {/* Subscription status */}
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm">{ar ? "باقة الاشتراك" : "Subscription"}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Crown className="h-4 w-4 text-accent" />
                  <span className="font-bold capitalize text-lg">
                    {stats.subscriptionPlan || (ar ? "بدون اشتراك" : "Free")}
                  </span>
                </div>
                {stats.subscriptionStatus && (
                  <Badge variant="outline" className="mt-1 text-xs capitalize">{stats.subscriptionStatus}</Badge>
                )}
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-xs font-medium ${verBadge.cls}`}>
                  <VerIcon className="h-3.5 w-3.5" />
                  {verBadge.label}
                </div>
                {!stats.subscriptionPlan && (
                  <Button size="sm" variant="outline" className="text-xs mt-2 border-primary text-primary hover:bg-primary/10">
                    {ar ? "ترقية الباقة" : "Upgrade"}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((c) => {
          const Icon = c.icon;
          return (
            <Link key={c.label} to={c.to}>
              <Card className="hover:shadow-elegant transition-base hover:-translate-y-0.5 cursor-pointer">
                <CardContent className="pt-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">{c.label}</p>
                      <p className="text-4xl font-bold mt-1">{loading ? "–" : c.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">{c.sub}</p>
                    </div>
                    <div className={`h-10 w-10 rounded-xl ${c.bg} flex items-center justify-center`}>
                      <Icon className={`h-5 w-5 ${c.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Quick actions */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-3">{ar ? "إجراءات سريعة" : "Quick actions"}</h2>
        <div className="flex flex-wrap gap-3">
          <Link to="/browse"><Button variant="outline">{ar ? "تصفح الأصول" : "Browse assets"}</Button></Link>
          <Link to="/rfq"><Button variant="outline">{ar ? "نشر طلب شراء" : "Post RFQ"}</Button></Link>
          <Link to="/support"><Button variant="outline">{ar ? "فتح تذكرة دعم" : "Open support ticket"}</Button></Link>
          <Link to="/settings"><Button variant="outline">{ar ? "الإعدادات" : "Settings"}</Button></Link>
        </div>
      </div>
    </div>
  );
}
