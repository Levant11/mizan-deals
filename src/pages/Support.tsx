import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";

export default function Support() {
  const { user } = useAuth();
  const { t, lang } = useI18n();
  const [tickets, setTickets] = useState<any[]>([]);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const load = async () => {
    if (!user) return;
    const { data } = await supabase.from("support_tickets").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    setTickets(data || []);
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [user]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (subject.trim().length < 3 || body.trim().length < 10) { toast.error("Too short"); return; }
    const { error } = await supabase.from("support_tickets").insert({ user_id: user.id, subject: subject.slice(0,200), body: body.slice(0,3000) });
    if (error) { toast.error(error.message); return; }
    toast.success(lang==="ar"?"تم إرسال التذكرة":"Ticket sent");
    setSubject(""); setBody(""); load();
  };

  return (
    <div className="container py-8 max-w-3xl animate-fade-in space-y-6">
      <h1 className="text-3xl font-bold">{t("nav.support")}</h1>

      <Card className="border-warning/40 bg-warning/5">
        <CardContent className="p-4 flex gap-3 items-start">
          <AlertCircle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
          <p className="text-sm">{t("support.note")}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>{t("support.title")}</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-3">
            <div className="space-y-2"><Label>{t("support.subject")}</Label>
              <Input value={subject} onChange={(e) => setSubject(e.target.value)} maxLength={200} required /></div>
            <div className="space-y-2"><Label>{t("support.body")}</Label>
              <Textarea value={body} onChange={(e) => setBody(e.target.value)} maxLength={3000} rows={5} required /></div>
            <Button type="submit" className="gradient-primary text-primary-foreground">{t("common.submit")}</Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {tickets.map(t => (
          <Card key={t.id}>
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between gap-2">
                <div className="font-semibold">{t.subject}</div>
                <Badge variant="outline">{t.status}</Badge>
              </div>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{t.body}</p>
              {t.admin_response && (
                <div className="border-s-2 border-primary ps-3 mt-2">
                  <div className="text-xs font-medium text-primary mb-1">Admin response</div>
                  <p className="text-sm whitespace-pre-wrap">{t.admin_response}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
