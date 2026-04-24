import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function Profile() {
  const { user } = useAuth();
  const { t } = useI18n();
  const [form, setForm] = useState({ full_name: "", display_name: "", phone: "", city: "", bio: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle().then(({ data }) => {
      if (data) setForm({
        full_name: data.full_name || "", display_name: data.display_name || "",
        phone: data.phone || "", city: data.city || "", bio: data.bio || "",
      });
      setLoading(false);
    });
  }, [user]);

  const save = async () => {
    if (!user) return;
    const { error } = await supabase.from("profiles").update({
      full_name: form.full_name.slice(0,100), display_name: form.display_name.slice(0,100),
      phone: form.phone.slice(0,30), city: form.city.slice(0,100), bio: form.bio.slice(0,500),
    }).eq("id", user.id);
    if (error) toast.error(error.message); else toast.success("Saved");
  };

  if (loading) return <div className="container py-20 text-center text-muted-foreground">{t("common.loading")}</div>;

  return (
    <div className="container py-8 max-w-2xl animate-fade-in">
      <Card>
        <CardHeader><CardTitle>{t("nav.profile")}</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2"><Label>{t("auth.fullName")}</Label>
            <Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} maxLength={100} /></div>
          <div className="space-y-2"><Label>Display name</Label>
            <Input value={form.display_name} onChange={(e) => setForm({ ...form, display_name: e.target.value })} maxLength={100} /></div>
          <div className="space-y-2"><Label>Phone</Label>
            <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} maxLength={30} /></div>
          <div className="space-y-2"><Label>{t("common.city")}</Label>
            <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} maxLength={100} /></div>
          <div className="space-y-2"><Label>Bio</Label>
            <Textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} maxLength={500} /></div>
          <Button onClick={save} className="gradient-primary text-primary-foreground">{t("common.save")}</Button>
        </CardContent>
      </Card>
    </div>
  );
}
