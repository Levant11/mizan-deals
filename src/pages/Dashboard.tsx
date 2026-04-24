import { useAuth } from "@/lib/auth";
import { BarChart3, TrendingUp, ShieldCheck } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-7xl">

        <div className="mb-10">
          <h1 className="text-3xl font-bold">لوحة المستثمر</h1>
          <p className="text-slate-500 mt-2">
            أهلاً {user?.email}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card icon={<BarChart3 />} title="الفرص المحفوظة" value="12" />
          <Card icon={<TrendingUp />} title="عروض مقدمة" value="5" />
          <Card icon={<ShieldCheck />} title="مستوى المخاطرة" value="منخفض" />
        </div>

        <div className="mt-12 bg-white p-8 rounded-2xl shadow border border-slate-200">
          <h2 className="text-xl font-bold mb-4">نظرة عامة</h2>
          <p className="text-slate-600">
            هذه نسخة Premium تجريبية للوحة المستثمر.
            سيتم ربط البيانات الفعلية في المرحلة التالية.
          </p>
        </div>
      </div>
    </div>
  );
}

function Card({ icon, title, value }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow border border-slate-200">
      <div className="flex items-center gap-3 mb-3 text-blue-700">
        {icon}
        <h3 className="font-semibold">{title}</h3>
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}
