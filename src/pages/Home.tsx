import { Link } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, FileCheck, Unlock, MessageSquare, Sparkles, Search, Users, AlertCircle } from "lucide-react";

export default function Home() {
  const { t } = useI18n();
  const features = [
    { icon: FileCheck, title: t("features.f1.title"), desc: t("features.f1.desc") },
    { icon: Unlock, title: t("features.f2.title"), desc: t("features.f2.desc") },
    { icon: MessageSquare, title: t("features.f3.title"), desc: t("features.f3.desc") },
    { icon: Sparkles, title: t("features.f4.title"), desc: t("features.f4.desc") },
    { icon: Search, title: t("features.f5.title"), desc: t("features.f5.desc") },
    { icon: Users, title: t("features.f6.title"), desc: t("features.f6.desc") },
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="gradient-hero text-primary-foreground">
        <div className="container py-20 md:py-32">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 border border-accent/30 text-accent text-sm font-medium">
              <Shield className="h-4 w-4" />
              {t("app.tagline")}
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">{t("hero.title")}</h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 font-medium">{t("hero.subtitle")}</p>
            <p className="text-base md:text-lg text-primary-foreground/80 max-w-2xl">{t("hero.desc")}</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link to="/auth">
                <Button size="lg" className="gradient-accent text-accent-foreground hover:opacity-90 border-0 shadow-glow">
                  {t("hero.ctaPrimary")}
                </Button>
              </Link>
              <Link to="/browse">
                <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                  {t("hero.ctaSecondary")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">{t("features.title")}</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <Card key={i} className="group hover:shadow-elegant transition-base border-border/60">
              <CardContent className="p-6 space-y-3">
                <div className="h-12 w-12 rounded-lg gradient-primary flex items-center justify-center text-primary-foreground group-hover:scale-110 transition-base">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-lg">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Notice */}
      <section className="container pb-20">
        <Card className="border-warning/40 bg-warning/5">
          <CardContent className="p-6 flex gap-4 items-start">
            <AlertCircle className="h-6 w-6 text-warning shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-lg mb-1">{t("notice.title")}</h3>
              <p className="text-muted-foreground">{t("notice.body")}</p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
