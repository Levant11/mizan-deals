import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { useI18n } from "@/lib/i18n";
import { useLocation } from "react-router-dom";

const PAGE_TITLES: Record<string, { ar: string; en: string }> = {
  "/": { ar: "الرئيسية", en: "Home" },
  "/browse": { ar: "تصفح الأصول", en: "Browse assets" },
  "/rfq": { ar: "طلبات الشراء", en: "Buyer requests" },
  "/dashboard": { ar: "لوحة التحكم", en: "Dashboard" },
  "/my-listings": { ar: "إعلاناتي", en: "My listings" },
  "/offers": { ar: "العروض", en: "Offers" },
  "/support": { ar: "الدعم الفني", en: "Support" },
  "/profile": { ar: "الملف الشخصي", en: "Profile" },
  "/settings": { ar: "الإعدادات", en: "Settings" },
  "/admin": { ar: "لوحة الإدارة", en: "Admin" },
};

export function AppLayout({ children }: { children: ReactNode }) {
  const { lang } = useI18n();
  const location = useLocation();
  const ar = lang === "ar";
  const pageTitle = PAGE_TITLES[location.pathname];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b bg-card/80 backdrop-blur sticky top-0 z-10 px-2">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="shrink-0" />
              {pageTitle && (
                <span className="text-sm font-medium text-foreground hidden sm:block">
                  {ar ? pageTitle.ar : pageTitle.en}
                </span>
              )}
            </div>
          </header>
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
