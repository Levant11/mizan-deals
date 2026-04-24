import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Lang = "ar" | "en";

const dict = {
  ar: {
    "app.name": "ميزان",
    "app.tagline": "منصة الأصول المتعثرة في العراق",
    "nav.home": "الرئيسية",
    "nav.browse": "تصفح الأصول",
    "nav.rfq": "طلبات الشراء",
    "nav.myListings": "إعلاناتي",
    "nav.offers": "العروض",
    "nav.support": "الدعم الفني",
    "nav.admin": "لوحة الإدارة",
    "nav.profile": "الملف الشخصي",
    "nav.signOut": "تسجيل الخروج",
    "nav.signIn": "تسجيل الدخول",
    "nav.signUp": "إنشاء حساب",
    "nav.dashboard": "لوحة التحكم",
    "nav.create": "نشر إعلان جديد",
    "nav.rateUs": "قيّم تجربتك",
    "auth.email": "البريد الإلكتروني",
    "auth.password": "كلمة المرور",
    "auth.fullName": "الاسم الكامل",
    "auth.signIn": "تسجيل الدخول",
    "auth.signUp": "إنشاء حساب جديد",
    "auth.haveAccount": "لديك حساب؟",
    "auth.noAccount": "ليس لديك حساب؟",
    "auth.welcome": "مرحباً بعودتك",
    "auth.createAccount": "أنشئ حسابك في ميزان",
    "common.loading": "جاري التحميل...",
    "common.save": "حفظ",
    "common.cancel": "إلغاء",
    "common.submit": "إرسال",
    "common.search": "بحث",
    "common.price": "السعر",
    "common.city": "المدينة",
    "common.category": "الفئة",
    "common.description": "الوصف",
    "common.title": "العنوان",
    "common.status": "الحالة",
    "common.actions": "إجراءات",
    "common.viewDetails": "عرض التفاصيل",
    "common.unlock": "فتح التفاصيل (مدفوع)",
    "common.makeOffer": "تقديم عرض",
    "common.counter": "عرض مضاد",
    "common.accept": "قبول",
    "common.decline": "رفض",
    "common.pending": "قيد المراجعة",
    "common.active": "نشط",
    "common.sold": "تم البيع",
    "common.draft": "مسودة",
    "common.rejected": "مرفوض",
    "common.archived": "مؤرشف",
    "hero.title": "ميزان",
    "hero.subtitle": "السوق الموثوق للأصول المتعثرة في العراق",
    "hero.desc": "منصة محكومة لبيع وشراء العقارات والمركبات والمعدات والأعمال. مع فحص ذكاء اصطناعي للإعلانات وعروض شفافة.",
    "hero.ctaPrimary": "ابدأ الآن",
    "hero.ctaSecondary": "تصفح الأصول",
    "features.title": "كيف يعمل ميزان",
    "features.f1.title": "إعلانات مدفوعة موثوقة",
    "features.f1.desc": "البائعون يدفعون رسماً لنشر الإعلان لضمان الجدية والجودة.",
    "features.f2.title": "فتح تدريجي للمعلومات",
    "features.f2.desc": "المشترون يدفعون لفتح تفاصيل الأصل ومعلومات التواصل.",
    "features.f3.title": "عروض وعروض مضادة",
    "features.f3.desc": "تفاوض رسمي بين الطرفين عبر المنصة.",
    "features.f4.title": "فحص ذكاء اصطناعي",
    "features.f4.desc": "كل إعلان يخضع لفحص نزاهة آلي قبل النشر.",
    "features.f5.title": "طلبات شراء (RFQ)",
    "features.f5.desc": "المشترون ينشرون احتياجاتهم ليصلهم البائعون.",
    "features.f6.title": "إحالات موثوقة",
    "features.f6.desc": "تواصل مع مُتحققين وضامنين من شركاء المنصة.",
    "notice.title": "ملاحظة هامة",
    "notice.body": "ميزان لا يحتفظ بأموال الصفقات ولا يتدخل في تأكيدها. نحن نوفر مساحة آمنة للتعارف بين البائع والمشتري فقط.",
    "lang.toggle": "English",
    "rate.title": "كيف كانت تجربتك مع ميزان؟",
    "rate.feedback": "ملاحظاتك (اختياري)",
    "rate.submit": "إرسال التقييم",
    "rate.thanks": "شكراً لتقييمك!",
    "support.title": "تذكرة دعم فني",
    "support.note": "للمشاكل المتعلقة بالمنصة فقط (لا نتدخل في نزاعات الصفقات).",
    "support.subject": "الموضوع",
    "support.body": "تفاصيل المشكلة",
    "category.real_estate": "عقارات",
    "category.vehicle": "مركبات",
    "category.equipment": "معدات",
    "category.inventory": "مخزون",
    "category.business": "أعمال",
    "category.other": "أخرى",
  },
  en: {
    "app.name": "MIZAN",
    "app.tagline": "Distressed Assets Iraq",
    "nav.home": "Home",
    "nav.browse": "Browse Assets",
    "nav.rfq": "Buyer Requests",
    "nav.myListings": "My Listings",
    "nav.offers": "Offers",
    "nav.support": "Support",
    "nav.admin": "Admin",
    "nav.profile": "Profile",
    "nav.signOut": "Sign out",
    "nav.signIn": "Sign in",
    "nav.signUp": "Sign up",
    "nav.dashboard": "Dashboard",
    "nav.create": "New listing",
    "nav.rateUs": "Rate your experience",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.fullName": "Full name",
    "auth.signIn": "Sign in",
    "auth.signUp": "Create account",
    "auth.haveAccount": "Have an account?",
    "auth.noAccount": "Don't have an account?",
    "auth.welcome": "Welcome back",
    "auth.createAccount": "Create your MIZAN account",
    "common.loading": "Loading...",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.submit": "Submit",
    "common.search": "Search",
    "common.price": "Price",
    "common.city": "City",
    "common.category": "Category",
    "common.description": "Description",
    "common.title": "Title",
    "common.status": "Status",
    "common.actions": "Actions",
    "common.viewDetails": "View details",
    "common.unlock": "Unlock details (paid)",
    "common.makeOffer": "Make an offer",
    "common.counter": "Counter",
    "common.accept": "Accept",
    "common.decline": "Decline",
    "common.pending": "Pending review",
    "common.active": "Active",
    "common.sold": "Sold",
    "common.draft": "Draft",
    "common.rejected": "Rejected",
    "common.archived": "Archived",
    "hero.title": "MIZAN",
    "hero.subtitle": "Trusted marketplace for distressed assets in Iraq",
    "hero.desc": "A controlled platform for buying and selling real estate, vehicles, equipment, and businesses. With AI listing checks and transparent offers.",
    "hero.ctaPrimary": "Get started",
    "hero.ctaSecondary": "Browse assets",
    "features.title": "How MIZAN works",
    "features.f1.title": "Paid, serious listings",
    "features.f1.desc": "Sellers pay a fee to list, ensuring quality and seriousness.",
    "features.f2.title": "Progressive unlocks",
    "features.f2.desc": "Buyers pay to unlock asset details and contact info.",
    "features.f3.title": "Offers & counter-offers",
    "features.f3.desc": "Formal negotiation between both parties on the platform.",
    "features.f4.title": "AI integrity checks",
    "features.f4.desc": "Every listing passes an automated check before going live.",
    "features.f5.title": "Buyer demand (RFQ)",
    "features.f5.desc": "Buyers post what they need; sellers reach out.",
    "features.f6.title": "Trusted referrals",
    "features.f6.desc": "Connect with verifier & guarantor partners.",
    "notice.title": "Important",
    "notice.body": "MIZAN does NOT hold transaction money or confirm offline deals. We provide a secure introduction space only.",
    "lang.toggle": "العربية",
    "rate.title": "How was your experience with MIZAN?",
    "rate.feedback": "Feedback (optional)",
    "rate.submit": "Submit rating",
    "rate.thanks": "Thank you for your feedback!",
    "support.title": "Support ticket",
    "support.note": "Platform issues only (we do not mediate deal disputes).",
    "support.subject": "Subject",
    "support.body": "Describe the issue",
    "category.real_estate": "Real estate",
    "category.vehicle": "Vehicle",
    "category.equipment": "Equipment",
    "category.inventory": "Inventory",
    "category.business": "Business",
    "category.other": "Other",
  },
} as const;

type Key = keyof typeof dict.ar;

interface I18nCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: Key) => string;
  dir: "rtl" | "ltr";
}

const I18nContext = createContext<I18nCtx | null>(null);

function detectLang(): Lang {
  const stored = localStorage.getItem("mizan.lang") as Lang | null;
  if (stored === "ar" || stored === "en") return stored;
  const nav = navigator.language?.toLowerCase() || "";
  return nav.startsWith("ar") ? "ar" : nav.startsWith("en") ? "en" : "ar";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectLang);

  useEffect(() => {
    const dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    localStorage.setItem("mizan.lang", lang);
  }, [lang]);

  const value: I18nCtx = {
    lang,
    setLang: setLangState,
    t: (k) => (dict[lang] as Record<string, string>)[k] ?? k,
    dir: lang === "ar" ? "rtl" : "ltr",
  };
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
