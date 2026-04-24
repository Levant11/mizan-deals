import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  FilePlus2,
  LogOut,
  Search,
  ShieldCheck,
  UserCircle,
} from "lucide-react";
import { useAuth } from "@/lib/auth";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, role, loading, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  if (loading) {
    return (
      <div
        dir="rtl"
        className="min-h-screen flex items-center justify-center bg-slate-50"
      >
        <div className="text-slate-500">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-4 rounded-2xl bg-white p-6 shadow-sm border border-slate-200 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">لوحة التحكم</h1>
            <p className="mt-2 text-slate-500">
              أهلاً بك في منصة MIZAN لإدارة الأصول المتعثرة.
            </p>
          </div>

          <button
            onClick={handleSignOut}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
          >
            <LogOut size={18} />
            تسجيل الخروج
          </button>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              <UserCircle />
            </div>
            <h3 className="font-semibold text-slate-900">الحساب</h3>
            <p className="mt-2 text-sm text-slate-500">{user?.email}</p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <ShieldCheck />
            </div>
            <h3 className="font-semibold text-slate-900">الصلاحية</h3>
            <p className="mt-2 text-sm text-slate-500">
              {role === "admin" ? "مدير النظام" : "مستخدم"}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
              <BarChart3 />
            </div>
            <h3 className="font-semibold text-slate-900">الحالة</h3>
            <p className="mt-2 text-sm text-slate-500">نشط</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <button
            onClick={() => navigate("/create-listing")}
            className="rounded-2xl bg-white p-6 text-right shadow-sm border border-slate-200 transition hover:-translate-y-1 hover:shadow-md"
          >
            <FilePlus2 className="mb-4 text-blue-700" />
            <h3 className="font-bold text-slate-900">إنشاء إعلان</h3>
            <p className="mt-2 text-sm text-slate-500">
              ابدأ بإضافة أصل جديد للبيع.
            </p>
          </button>

          <button
            onClick={() => navigate("/listings")}
            className="rounded-2xl bg-white p-6 text-right shadow-sm border border-slate-200 transition hover:-translate-y-1 hover:shadow-md"
          >
            <Search className="mb-4 text-emerald-700" />
            <h3 className="font-bold text-slate-900">تصفح الإعلانات</h3>
            <p className="mt-2 text-sm text-slate-500">
              اكتشف الفرص المتاحة في السوق.
            </p>
          </button>

          <button
            onClick={() => navigate("/my-listings")}
            className="rounded-2xl bg-white p-6 text-right shadow-sm border border-slate-200 transition hover:-translate-y-1 hover:shadow-md"
          >
            <BarChart3 className="mb-4 text-indigo-700" />
            <h3 className="font-bold text-slate-900">إعلاناتي</h3>
            <p className="mt-2 text-sm text-slate-500">
              تابع أداء إعلاناتك وحالتها.
            </p>
          </button>

          {role === "admin" && (
            <button
              onClick={() => navigate("/admin")}
              className="rounded-2xl bg-slate-900 p-6 text-right text-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <ShieldCheck className="mb-4 text-emerald-400" />
              <h3 className="font-bold">لوحة الإدارة</h3>
              <p className="mt-2 text-sm text-slate-300">
                إدارة المنصة والمراجعات.
              </p>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
