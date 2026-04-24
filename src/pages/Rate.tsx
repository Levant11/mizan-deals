import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { toast } from "sonner";

export default function Rate() {
  const { user } = useAuth();
  const { t, lang } = useI18n();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [done, setDone] = useState(false);

  const submit = async () => {
    if (!user || rating < 1) { toast.error("Pick a rating"); return; }
    const { error } = await supabase.from("platform_ratings").insert({ user_id: user.id, rating, feedback: feedback.slice(0,1000) });
    if (error) { toast.error(error.message); return; }
    setDone(true);
  };

  return (
    <div className="container py-12 max-w-xl animate-fade-in">
      <Card>
        <CardHeader><CardTitle>{t("rate.title")}</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {done ? (
            <div className="text-center py-8">
              <Star className="h-12 w-12 text-accent mx-auto mb-3 fill-accent" />
              <p className="text-lg font-medium">{t("rate.thanks")}</p>
            </div>
          ) : (
            <>
              <div className="flex justify-center gap-1">
                {[1,2,3,4,5].map(n => (
                  <button key={n} type="button" onClick={() => setRating(n)} onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(0)}
                    className="p-1 transition-base hover:scale-110">
                    <Star className={`h-10 w-10 ${(hover || rating) >= n ? "fill-accent text-accent" : "text-muted-foreground"}`} />
                  </button>
                ))}
              </div>
              <Textarea placeholder={t("rate.feedback")} value={feedback} onChange={(e) => setFeedback(e.target.value)} maxLength={1000} rows={4} />
              <Button onClick={submit} className="w-full gradient-primary text-primary-foreground">{t("rate.submit")}</Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
