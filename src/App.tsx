import { Routes, Route, Link } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import Dashboard from "@/pages/Dashboard";
import Auth from "@/pages/Auth";
import ProtectedRoute from "@/components/ProtectedRoute";

function Landing() {
  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-50">
      <header className="border-b bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="text-2xl font-bold text-blue-800">MIZAN</h1>
          <div className="flex gap-4">
            <Link to="/auth" className="px-4 py-2 rounded-lg bg-blue-700 text-white hover:bg-blue-800">
              دخول المستثمر
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-24 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-5xl font-extrabold leading-tight text-slate-900">
            البنية الرقمية<br />
            لتداول الأصول المتعثرة
          </h2>

          <p className="mt-6 text-lg text-slate-600 leading-8">
            منصة MIZAN تربط المستثمرين بأصحاب الأصول التجارية المتعثرة
            عبر نظام تحقق ذكي، كشف تدريجي، ولوحة تحكم احترافية.
          </p>

          <div className="mt-8 flex gap-4">
            <Link to="/auth" className="px-6 py-3 rounded-xl bg-blue-700 text-white font-semibold hover:bg-blue-800">
              ابدأ الآن
            </Link>
            <Link to="/dashboard" className="px-6 py-3 rounded-xl border border-slate-300 bg-white font-semibold hover:bg-slate-100">
              لوحة المستثمر
            </Link>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-2xl border border-slate-200">
          <div className="grid grid-cols-2 gap-6">
            <Stat title="قيمة الأصول" value="$12M+" />
            <Stat title="مستثمر نشط" value="320+" />
            <Stat title="أصل مدرج" value="150+" />
            <Stat title="معدل رضا" value="98%" />
          </div>

          <div className="mt-8 
