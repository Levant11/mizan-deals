import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

export default function Dashboard() {
  const { user, role, loading, signOut } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow rounded-xl p-6">
        <h1 className="text-3xl font-bold mb-4">لوحة التحكم</h1>

        <div className="space-y-2">
          <p>
            <strong>البريد الإلكتروني:</strong> {user?.email}
          </p>
          <p>
            <strong>الدور:</strong>{" "}
            <span className="bg-gray-200 px-2 py-1 rounded">
              {role || "user"}
            </span>
          </p>
        </div>

        <div className="mt-6 flex gap-4">
          <button
            onClick={() => navigate("/profile")}
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            الملف الشخصي
          </button>

          <button
            onClick={signOut}
            className="bg-red-600 text-white px-4 py-2 rounded-md"
          >
            تسجيل الخروج
          </button>
        </div>
      </div>
    </div>
  );
}
