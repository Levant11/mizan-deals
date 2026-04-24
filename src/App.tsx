import { Link, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/lib/auth";

function Home() {
  const { session } = useAuth();

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-2xl font-bold text-blue-800">
            MIZAN
          </Link>

          <nav className="flex items-center gap-3">
            <Link
              to="/listings"
              className="rounded-lg px-4 py-2 text-slate-700 hover:bg-slate-100"
            >
              تصفح الإعلانات
            </Link>

            {session ? (
              <Link
                to="/dashboard"
                className="rounded-lg bg-blue-700 px-4 py-2 text-white hover:bg-blue-800"
              >
                لوحة التحكم
              </Link>
            ) : (
              <Link
                to="/auth"
                className="rounded-lg bg-blue-700 px-4 py-2 text-white hover:bg-blue-800"
              >
                تسجيل الدخول
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h1 className="text-5xl font-extrabold leading-tight text-slate-900">
              MIZAN
              <br />
              منصة الأصول المتعثرة في العراق
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              منصة رقمية لتنظيم بيع وشراء الأصول التجارية المتعثرة: مطاعم،
              محلات، معدات، مركبات، مخزون، وفرص استثمارية حقيقية.
            </p>

            <div className="mt-8 flex gap-4">
              <Link
                to="/listings"
                className="rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800"
              >
                تصفح الفرص
              </Link>

              <Link
                to="/auth"
                className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-800 hover:bg-slate-100"
              >
                ابدأ الآن
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="mb-6 grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-blue-50 p-5">
                <p className="text-sm text-slate-500">قيمة الأصول</p>
                <p className="mt-2 text-3xl font-bold text-blue-800">$12M+</p>
              </div>

              <div className="rounded-2xl bg-emerald-50 p-5">
                <p className="text-sm text-slate-500">مستثمر نشط</p>
                <p className="mt-2 text-3xl font-bold text-emerald-700">
                  320+
                </p>
              </div>

              <div className="rounded-2xl bg-indigo-50 p-5">
                <p className="text-sm text-slate-500">إعلان</p>
                <p className="mt-2 text-3xl font-bold text-indigo-700">150+</p>
              </div>

              <div className="rounded-2xl bg-amber-50 p-5">
                <p className="text-sm text-slate-500">رضا المستخدمين</p>
                <p className="mt-2 text-3xl font-bold text-amber-700">98%</p>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-900 p-5 text-white">
              <p className="text-sm text-slate-300">AI Risk Score</p>
              <div className="mt-4 h-3 rounded-full bg-slate-700">
                <div className="h-3 w-3/4 rounded-full bg-emerald-400" />
              </div>
              <p className="mt-3 text-sm text-slate-300">
                نموذج أولي للتحقق الذكي من الإعلانات.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function PlaceholderPage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="mt-3 text-slate-500">{description}</p>
        <Link
          to="/dashboard"
          className="mt-6 inline-block rounded-lg bg-blue-700 px-4 py-2 text-white"
        >
          العودة للوحة التحكم
        </Link>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/listings"
          element={
            <PlaceholderPage
              title="تصفح الإعلانات"
              description="سيتم بناء نظام الإعلانات الحقيقي في المرحلة التالية."
            />
          }
        />

        <Route
          path="/create-listing"
          element={
            <ProtectedRoute>
              <PlaceholderPage
                title="إنشاء إعلان"
                description="سيتم تفعيل إنشاء الإعلانات في المرحلة التالية."
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-listings"
          element={
            <ProtectedRoute>
              <PlaceholderPage
                title="إعلاناتي"
                description="ستظهر هنا إعلاناتك بعد تفعيل نظام البيع."
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <PlaceholderPage
                title="لوحة الإدارة"
                description="سيتم بناء لوحة الإدارة في مرحلة لاحقة."
              />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Toaster position="top-center" richColors />
    </>
  );
}
